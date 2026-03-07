"use client";

import React, { createContext, useContext, useCallback, useRef } from "react";
import { useSyncExternalStore } from "react";
import {
    type SessionState,
    type StudentEvent,
    type StudentSession,
    type SlideAnalytics,
    type ClassSummary,
    type StudentSummary,
    type TimelineMarker,
    type DipMoment,
    type RecoveryMoment,
    type EngagementState,
    SESSION_SLIDES,
    createInitialSessionState,
    createEmptySlideAnalytics,
} from "@/lib/session-engine";

// ══════════════════════════════════════════════════
// External store for session state (avoids re-render storms)
// ══════════════════════════════════════════════════

type Listener = () => void;

class SessionStore {
    private state: SessionState;
    private listeners: Set<Listener> = new Set();
    private prevClassAvg = 0;

    constructor() {
        this.state = createInitialSessionState();
    }

    getState = (): SessionState => this.state;

    subscribe = (listener: Listener): (() => void) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify() {
        this.listeners.forEach(l => l());
    }

    // ── Session lifecycle ──

    startSession = (customSlides?: import("@/lib/session-engine").SlideDefinition[]) => {
        this.state = createInitialSessionState();
        if (customSlides && customSlides.length > 0) {
            this.state.slides = customSlides;
            this.state.slideAnalytics = new Map();
            customSlides.forEach(s => this.state.slideAnalytics.set(s.id, createEmptySlideAnalytics(s.id)));
        }
        this.state.isActive = true;
        this.state.startTime = Date.now();
        this.prevClassAvg = 0;
        this.notify();
    };

    stopSession = () => {
        const s: SessionState = {
            ...this.state,
            isActive: false,
            slideAnalytics: new Map(this.state.slideAnalytics),
        };
        this.state = s;
        this.computePostSession();
        this.notify();
    };

    setSlide = (index: number) => {
        const slides = this.state.slides;
        if (index < 0 || index >= slides.length) return;
        const prevSlide = slides[this.state.currentSlideIndex];

        // Create mutable clone
        const s: SessionState = {
            ...this.state,
            currentSlideIndex: index,
            timelineMarkers: [...this.state.timelineMarkers],
            slideAnalytics: new Map(this.state.slideAnalytics),
        };

        s.timelineMarkers.push({
            id: `marker-slide-${Date.now()}`,
            timestamp: Date.now(),
            type: "slide_change",
            slideId: slides[index].id,
            label: `Slide ${slides[index].id}`,
            detail: `→ ${slides[index].title}`,
            severity: "info",
        });

        // Record exit score for previous slide
        const prevA = s.slideAnalytics.get(prevSlide.id);
        if (prevA && prevA.eventCount > 0) {
            const clonedPrev = { ...prevA };
            clonedPrev.exitScore = s.classAvgEngagement;
            if (clonedPrev.entryScore !== null) {
                clonedPrev.teachingEffectiveness = s.classAvgEngagement - clonedPrev.entryScore;
            }
            s.slideAnalytics.set(prevSlide.id, clonedPrev);
        }

        // Record entry score for new slide
        const newA = s.slideAnalytics.get(slides[index].id);
        if (newA) {
            const clonedNew = { ...newA };
            clonedNew.entryScore = s.classAvgEngagement;
            s.slideAnalytics.set(slides[index].id, clonedNew);
        }

        this.state = s;
        this.notify();
    };

    // ── Push student event ──
    // NOTE: Next.js dev mode freezes objects from useSyncExternalStore.
    // We must create a fresh mutable state clone before any mutations.

    pushEvent = (event: StudentEvent) => {
        const { studentId } = event;

        // Create a mutable clone of state (shallow + new mutable arrays)
        const s: SessionState = {
            ...this.state,
            timelineData: [...this.state.timelineData],
            timelineMarkers: [...this.state.timelineMarkers],
            eventLog: [...this.state.eventLog],
            dipMoments: [...this.state.dipMoments],
            recoveryMoments: [...this.state.recoveryMoments],
            students: new Map(this.state.students),
            slideAnalytics: new Map(this.state.slideAnalytics),
        };

        const slide = s.slides[s.currentSlideIndex];
        if (!slide) return;
        const slideId = slide.id;

        // Update or create student (clone to make mutable)
        let student = s.students.get(studentId);
        if (student) {
            student = { ...student, scoreHistory: [...student.scoreHistory], perSlideScores: new Map(student.perSlideScores), perSlideStates: new Map(student.perSlideStates) };
        } else {
            student = this.createStudent(studentId, event);
        }
        s.students.set(studentId, student);

        // Update student state
        const prevState = student.currentState;
        student.currentState = event.state;
        student.currentScore = event.score;
        student.confidence = event.confidence;
        student.scoreHistory = [...student.scoreHistory.slice(-59), event.score];
        student.lastSeen = event.timestamp;

        // Per-slide scores
        const slideScores = student.perSlideScores.get(slideId) ? [...student.perSlideScores.get(slideId)!] : [];
        slideScores.push(event.score);
        student.perSlideScores.set(slideId, slideScores);

        const slideStates = student.perSlideStates.get(slideId) ? [...student.perSlideStates.get(slideId)!] : [];
        slideStates.push(event.state);
        student.perSlideStates.set(slideId, slideStates);

        // Count behaviors
        if (event.state === "confused") student.confusionCount++;
        if (event.mouthActivity > 0.3) student.participationCount++;
        if (event.headDown) student.headDownCount++;

        // Update slide analytics (clone to make mutable)
        let analytics = s.slideAnalytics.get(slideId);
        if (analytics) {
            analytics = { ...analytics, states: { ...analytics.states } };
        } else {
            analytics = createEmptySlideAnalytics(slideId);
        }
        s.slideAnalytics.set(slideId, analytics);

        analytics.eventCount++;
        analytics.states[event.state]++;
        if (event.state === "confused" && prevState !== "confused") {
            analytics.confusionSpikes++;
            s.confusionSpikes++;
            s.timelineMarkers.push({
                id: `marker-confusion-${Date.now()}`,
                timestamp: event.timestamp,
                type: "confusion_spike",
                slideId,
                label: student.label,
                detail: `Confusion detected on "${slide.title}"`,
                severity: "danger",
            });
        }
        if (event.mouthActivity > 0.3) {
            analytics.participationCount++;
            s.participationTotal++;
        }
        if (event.headDown) {
            analytics.headDownCount++;
            s.headDownTotal++;
        }

        // Dip detection
        const newClassAvg = this.computeClassAvgFrom(s);
        if (this.prevClassAvg - newClassAvg > 15 && newClassAvg < 60) {
            const dip: DipMoment = {
                slideId,
                timestamp: event.timestamp,
                dropAmount: this.prevClassAvg - newClassAvg,
                fromScore: this.prevClassAvg,
                toScore: newClassAvg,
            };
            s.dipMoments.push(dip);
            analytics.dipMoment = true;
            s.timelineMarkers.push({
                id: `marker-dip-${Date.now()}`,
                timestamp: event.timestamp,
                type: "dip",
                slideId,
                label: "Engagement Dip",
                detail: `Class dropped from ${this.prevClassAvg}% to ${newClassAvg}%`,
                severity: "warning",
            });
        }

        // Recovery detection
        if (event.state === "reengaged" && (prevState === "confused" || prevState === "distracted")) {
            const recovery: RecoveryMoment = {
                slideId,
                timestamp: event.timestamp,
                recoveryAmount: event.score - (student.scoreHistory[student.scoreHistory.length - 3] ?? 50),
                fromScore: student.scoreHistory[student.scoreHistory.length - 3] ?? 50,
                toScore: event.score,
            };
            s.recoveryMoments.push(recovery);
            analytics.recoveryMoment = true;
            s.timelineMarkers.push({
                id: `marker-recovery-${Date.now()}`,
                timestamp: event.timestamp,
                type: "recovery",
                slideId,
                label: student.label,
                detail: `Re-engaged after ${prevState}`,
                severity: "success",
            });
        }

        // Recompute slide average
        const allScoresForSlide: number[] = [];
        s.students.forEach(st => {
            const scores = st.perSlideScores.get(slideId);
            if (scores && scores.length > 0) {
                allScoresForSlide.push(scores[scores.length - 1]);
            }
        });
        if (allScoresForSlide.length > 0) {
            analytics.avgEngagement = Math.round(
                allScoresForSlide.reduce((a, b) => a + b, 0) / allScoresForSlide.length
            );
        }

        // Update global state
        s.totalEvents++;
        s.eventLog = [event, ...s.eventLog].slice(0, 100);
        this.prevClassAvg = newClassAvg;
        s.classAvgEngagement = newClassAvg;

        // Timeline data point (throttle to 1 per second)
        const elapsed = Math.floor((Date.now() - s.startTime) / 1000);
        const lastPoint = s.timelineData[s.timelineData.length - 1];
        const timeStr = `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, "0")}`;
        if (!lastPoint || lastPoint.time !== timeStr) {
            s.timelineData.push({ time: timeStr, engagement: newClassAvg, slide: slideId });
        }

        this.state = s;
        this.notify();
    };

    // ── Computed views ──

    getClassSummary = (): ClassSummary => {
        const students = Array.from(this.state.students.values());
        const atRisk = students
            .filter(s => s.currentScore < 50 || s.confusionCount >= 3)
            .map(s => ({ id: s.sessionId, label: s.label, score: s.currentScore, state: s.currentState }));

        let weakest: number | null = null, strongest: number | null = null;
        let minAvg = 100, maxAvg = 0;
        this.state.slideAnalytics.forEach((a, id) => {
            if (a.eventCount > 0 && a.avgEngagement < minAvg) { minAvg = a.avgEngagement; weakest = id; }
            if (a.eventCount > 0 && a.avgEngagement > maxAvg) { maxAvg = a.avgEngagement; strongest = id; }
        });

        return {
            studentCount: students.length,
            avgEngagement: this.state.classAvgEngagement,
            confusionSpikes: this.state.confusionSpikes,
            participationTotal: this.state.participationTotal,
            headDownTotal: this.state.headDownTotal,
            totalEvents: this.state.totalEvents,
            weakestSlide: weakest !== null ? this.state.slides.find(s => s.id === weakest) ?? null : null,
            strongestSlide: strongest !== null ? this.state.slides.find(s => s.id === strongest) ?? null : null,
            dipMoments: this.state.dipMoments,
            recoveryMoments: this.state.recoveryMoments,
            atRiskStudents: atRisk,
        };
    };

    getStudentSummary = (studentId: string): StudentSummary | null => {
        const s = this.state.students.get(studentId);
        if (!s) return null;

        const perSlideAvg: { slideId: number; avg: number; topic: string }[] = [];
        let weakest: number | null = null, strongest: number | null = null;
        let minAvg = 100, maxAvg = 0;

        s.perSlideScores.forEach((scores, slideId) => {
            const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
            const slide = this.state.slides.find(sl => sl.id === slideId);
            perSlideAvg.push({ slideId, avg, topic: slide?.topic ?? "" });
            if (avg < minAvg) { minAvg = avg; weakest = slideId; }
            if (avg > maxAvg) { maxAvg = avg; strongest = slideId; }
        });

        return {
            sessionId: s.sessionId,
            label: s.label,
            avgEngagement: s.scoreHistory.length > 0
                ? Math.round(s.scoreHistory.reduce((a, b) => a + b, 0) / s.scoreHistory.length)
                : 0,
            currentState: s.currentState,
            weakestSlide: weakest,
            strongestSlide: strongest,
            confusionCount: s.confusionCount,
            participationCount: s.participationCount,
            perSlideAvg,
            scoreHistory: s.scoreHistory,
        };
    };

    // ── Helpers ──

    private createStudent(id: string, event: StudentEvent): StudentSession {
        const labels = ["Learner A", "Learner B", "Learner C", "Learner D", "Learner E"];
        const idx = this.state.students.size;
        return {
            sessionId: id,
            label: labels[idx] ?? `Learner ${idx + 1}`,
            currentState: event.state,
            currentScore: event.score,
            confidence: event.confidence,
            events: [],
            scoreHistory: [event.score],
            perSlideScores: new Map(),
            perSlideStates: new Map(),
            participationCount: 0,
            confusionCount: 0,
            headDownCount: 0,
            lastSeen: event.timestamp,
        };
    }

    private computeClassAvg(): number {
        return this.computeClassAvgFrom(this.state);
    }

    private computeClassAvgFrom(s: SessionState): number {
        const students = Array.from(s.students.values());
        if (students.length === 0) return 0;
        return Math.round(students.reduce((sum, st) => sum + st.currentScore, 0) / students.length);
    }

    private computePostSession() {
        let weakest: number | null = null, strongest: number | null = null;
        let minAvg = 100, maxAvg = 0;
        this.state.slideAnalytics.forEach((a, id) => {
            if (a.eventCount > 0 && a.avgEngagement < minAvg) { minAvg = a.avgEngagement; weakest = id; }
            if (a.eventCount > 0 && a.avgEngagement > maxAvg) { maxAvg = a.avgEngagement; strongest = id; }
        });
        this.state.weakestSlide = weakest;
        this.state.strongestSlide = strongest;
    }
}

// ══════════════════════════════════════════════════
// React Context
// ══════════════════════════════════════════════════

const storeInstance = new SessionStore();

interface SessionContextType {
    state: SessionState;
    startSession: (customSlides?: import("@/lib/session-engine").SlideDefinition[]) => void;
    stopSession: () => void;
    setSlide: (index: number) => void;
    pushEvent: (event: StudentEvent) => void;
    getClassSummary: () => ClassSummary;
    getStudentSummary: (id: string) => StudentSummary | null;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionEngineProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef(storeInstance);
    const store = storeRef.current;

    const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);

    const value: SessionContextType = {
        state,
        startSession: store.startSession,
        stopSession: store.stopSession,
        setSlide: store.setSlide,
        pushEvent: store.pushEvent,
        getClassSummary: store.getClassSummary,
        getStudentSummary: store.getStudentSummary,
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession(): SessionContextType {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used within SessionEngineProvider");
    return ctx;
}
