"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/components/session/SessionEngineProvider";
import EngagementChart from "@/components/teacher/EngagementChart";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import IntelligenceLogo from "@/components/ui/IntelligenceLogo";
import { Reveal } from "@/components/motion/MotionKit";
import { DemoJourneyBanner } from "@/components/ui/DemoJourneyBanner";
import { formatPercentage, formatPercentValue, formatScore } from "@/lib/formatters";
import { mapSignalsToEngagement, type EngagementState } from "@/lib/engagement-mapper";
import type { StudentEvent, SlideDefinition } from "@/lib/session-engine";
import { SESSION_SLIDES } from "@/lib/session-engine";
import { parsePptx } from "@/lib/pptx-parser";
import { FaceAnalyzer, type TrackedFace } from "@/lib/face-analyzer";


const ANALYSIS_INTERVAL_MS = 200;
const STATE_COLORS: Record<EngagementState, { bg: string; ring: string; text: string; glow: string; border: string; accent: string }> = {
    focused: { bg: "bg-emerald-500", ring: "ring-emerald-500/40", text: "text-emerald-400", glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]", border: "border-emerald-500/80", accent: "emerald" },
    distracted: { bg: "bg-amber-500", ring: "ring-amber-500/40", text: "text-amber-400", glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]", border: "border-amber-500/80", accent: "amber" },
    confused: { bg: "bg-rose-500", ring: "ring-rose-500/40", text: "text-rose-400", glow: "shadow-[0_0_30px_rgba(225,29,72,0.3)]", border: "border-rose-500/80", accent: "rose" },
    reengaged: { bg: "bg-sky-500", ring: "ring-sky-500/40", text: "text-sky-400", glow: "shadow-[0_0_30px_rgba(14,165,233,0.3)]", border: "border-sky-500/80", accent: "sky" },
};

interface StudentTrack {
    face: TrackedFace;
    state: EngagementState;
    confidence: number;
    score: number;
    prevState: EngagementState | null;
    scoreHistory: number[];
}

interface EventLog {
    id: string;
    label: string;
    state: EngagementState;
    score: number;
    time: string;
}

export default function LiveDemoPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const analyzerRef = useRef<FaceAnalyzer | null>(null);
    const animFrameRef = useRef<number>(0);
    const prevStatesRef = useRef<Map<string, EngagementState>>(new Map());
    const isRunningRef = useRef(false);

    // Ref for the analysis loop (avoids stale closures)
    const sessionRef = useRef<ReturnType<typeof useSession>>(null!);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [modelLoading, setModelLoading] = useState(false);
    const [modelReady, setModelReady] = useState(false);
    const [students, setStudents] = useState<StudentTrack[]>([]);
    const [eventLog, setEventLog] = useState<EventLog[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // PPT upload
    const [customSlides, setCustomSlides] = useState<SlideDefinition[] | null>(null);
    const [pptFileName, setPptFileName] = useState<string | null>(null);
    const [pptParsing, setPptParsing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const session = useSession();

    // Keep ref up-to-date
    sessionRef.current = session;

    const currentSlides = session.state.slides;
    const currentSlide = currentSlides[session.state.currentSlideIndex] || currentSlides[0];
    const confusionSpikes = session.state.confusionSpikes;

    // ── PPT Upload handler ──
    const handlePptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPptParsing(true);
        try {
            const slides = await parsePptx(file);
            if (slides.length === 0) {
                alert("No slides found in the uploaded file.");
                setPptParsing(false);
                return;
            }
            setCustomSlides(slides);
            setPptFileName(file.name);
            session.setSessionTitle(file.name.replace('.pptx', ''));
        } catch (err) {
            console.error("Error parsing PPTX:", err);
            alert("Could not parse the file. Please upload a valid .pptx file.");
        }
        setPptParsing(false);
    };

    const clearPpt = () => {
        setCustomSlides(null);
        setPptFileName(null);
        session.setSessionTitle("Neural Networks Deep Dive");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── Slide navigation ──
    const goNext = useCallback(() => {
        const next = Math.min(session.state.currentSlideIndex + 1, session.state.slides.length - 1);
        session.setSlide(next);
    }, [session]);

    const goPrev = useCallback(() => {
        const prev = Math.max(session.state.currentSlideIndex - 1, 0);
        session.setSlide(prev);
    }, [session]);

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [goNext, goPrev]);

    useEffect(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, [stream]);
    useEffect(() => {
        return () => {
            isRunningRef.current = false;
            if (analyzerRef.current) analyzerRef.current.destroy();
            cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // ── Analysis loop (ref-based to avoid stale closures) ──
    const startAnalysisLoop = useCallback(() => {
        isRunningRef.current = true;
        let lastAnalysis = 0;

        const loop = () => {
            if (!isRunningRef.current) return;
            animFrameRef.current = requestAnimationFrame(loop);
            const now = performance.now();
            if (now - lastAnalysis < ANALYSIS_INTERVAL_MS) return;
            lastAnalysis = now;

            const video = videoRef.current;
            const analyzer = analyzerRef.current;
            if (!video || !analyzer || !analyzer.isReady() || video.readyState < 2) return;

            const sess = sessionRef.current;
            let trackedFaces: TrackedFace[];
            try {
                trackedFaces = analyzer.processFrameMulti(video, now);
            } catch (err) {
                // MediaPipe can throw on certain frames (e.g. during init)
                console.warn("Frame analysis error (skipping):", err);
                return;
            }
            const slide = sess.state.slides[sess.state.currentSlideIndex];
            if (!slide) return;

            const tracks: StudentTrack[] = trackedFaces.map(face => {
                const prev = prevStatesRef.current.get(face.sessionId) ?? null;
                const result = mapSignalsToEngagement(face.signals, prev);
                prevStatesRef.current.set(face.sessionId, result.state);

                const studentEvent: StudentEvent = {
                    id: `evt-${face.sessionId}-${Date.now()}`,
                    timestamp: Date.now(),
                    studentId: face.sessionId,
                    slideId: slide.id,
                    state: result.state,
                    score: result.engagementScore,
                    confidence: result.confidence,
                    facePresent: face.signals.facePresent,
                    headTurnScore: Math.min(1, Math.abs(face.signals.headYaw) / 0.5),
                    gazeStabilityScore: face.signals.gazeStability,
                    eyeOpennessScore: face.signals.eyeOpenness,
                    movementScore: face.signals.movementScore,
                    mouthActivity: face.signals.mouthActivity,
                    headDown: face.signals.headDown,
                    possibleDrowsiness: face.signals.possibleDrowsiness,
                };
                sess.pushEvent(studentEvent);

                return {
                    face,
                    state: result.state,
                    confidence: result.confidence,
                    score: result.engagementScore,
                    prevState: prev,
                    scoreHistory: [],
                };
            });

            setStudents(prev => {
                return tracks.map(track => {
                    const existing = prev.find(p => p.face.sessionId === track.face.sessionId);
                    const history = existing?.scoreHistory ?? [];
                    return { ...track, scoreHistory: [...history.slice(-19), track.score] };
                });
            });

            // Log state transitions
            for (const track of tracks) {
                if (track.prevState && track.prevState !== track.state) {
                    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    setEventLog(prev => [{
                        id: `${track.face.sessionId}-${Date.now()}`,
                        label: track.face.label,
                        state: track.state,
                        score: track.score,
                        time: timeStr,
                    }, ...prev].slice(0, 40));
                }
            }

        };
        animFrameRef.current = requestAnimationFrame(loop);
    }, []);  // stable — no dependencies, uses refs

    // ── Camera controls ──
    const startCamera = async () => {
        try {
            setModelLoading(true);
            if (!analyzerRef.current) analyzerRef.current = new FaceAnalyzer();
            await analyzerRef.current.initialize();
            setModelReady(true);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setStream(mediaStream);
            session.startSession(customSlides ?? undefined);
            setModelLoading(false);
            setEventLog([]);
            // Start the analysis loop after a brief delay to let video attach
            setTimeout(() => startAnalysisLoop(), 300);
        } catch (err) {
            console.error("Error starting live demo:", err);
            setModelLoading(false);
            alert("Could not start. Please ensure camera permissions are granted.");
        }
    };

    const stopCamera = async () => {
        isRunningRef.current = false;
        cancelAnimationFrame(animFrameRef.current);
        if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }

        // Capture session state before stopping
        const finalState = session.state;
        session.stopSession();
        setStudents([]);
        prevStatesRef.current.clear();

        // Submit to Backboard
        setIsSubmitting(true);
        try {
            const slideSummary = finalState.slides.map((s) => {
                const analytics = finalState.slideAnalytics.get(s.id);
                return {
                    id: s.id,
                    title: s.title,
                    avgEngagement: analytics?.avgEngagement || 0,
                    durationSeconds: analytics ? (analytics.eventCount * 0.2) : 0 // approx duration
                };
            });

            // Extract unique students that were tracked
            const uniqueStudents = Array.from(finalState.students.keys());
            const studentSummaries = uniqueStudents.map(id => {
                const student = finalState.students.get(id);
                const avgEngagement = student?.scoreHistory.length
                    ? student.scoreHistory.reduce((sum, score) => sum + score, 0) / student.scoreHistory.length
                    : 0;
                return {
                    studentId: id,
                    alias: `Student ${id.split('-')[0].substring(0, 4)}`,
                    avgEngagement: Math.round(avgEngagement)
                };
            });

            await fetch('/api/backboard/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: `live-${Date.now()}`,
                    slideSummary,
                    dipEvents: finalState.dipMoments,
                    studentSummaries
                })
            });
            console.log("✅ Session ingested into Backboard Memory");
        } catch (error) {
            console.error("Failed to ingest session to Backboard", error);
            alert("Warning: Session data failed to save to Backboard memory.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const classAvg = session.state.classAvgEngagement || 0;

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                        Live <span className="gradient-text">Classroom Monitor</span>
                    </h1>
                    {session.state.isActive && (
                        <Badge variant="success" size="md">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                            LIVE — {students.length} {students.length === 1 ? "student" : "students"} tracked
                        </Badge>
                    )}
                    {!session.state.isActive && <Badge variant="default" size="md">Offline</Badge>}
                </div>
                <p className="text-muted max-w-3xl text-sm">
                    Multi-student real-time engagement analysis using <strong>MediaPipe Face Landmarker</strong>. All processing runs locally in your browser. Events flow into teacher/student dashboards and session timeline in real time.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* ═══ LEFT: Camera + Overlays ═══ */}
                <div className="lg:col-span-7 space-y-4">
                    <Card className="p-0 relative overflow-hidden bg-[#070b14] border-white/10">
                        <div className="relative aspect-video">
                            <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform scale-x-[-1] ${stream ? "block" : "hidden"}`} />

                            {!stream && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#010308] overflow-hidden">
                                    {/* Deep Space Vignette */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#010308_85%)] z-10 pointer-events-none mix-blend-multiply" />

                                    {/* Animated grid background */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px", animation: "panGrid 20s linear infinite" }} />

                                    {/* Complex Orbital HUD Rings */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] flex items-center justify-center pointer-events-none opacity-40 z-0">
                                        <div className="absolute w-full h-full border border-accent/10 rounded-full" style={{ animation: 'spin 40s linear infinite' }}>
                                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-accent rounded-full shadow-[0_0_15px_#6366f1]" />
                                            <div className="absolute bottom-0 left-1/2 w-1 h-8 bg-accent/50" />
                                        </div>
                                        <div className="absolute w-[75%] h-[75%] border-t border-b border-purple-500/30 rounded-full" style={{ animation: 'spin 20s linear infinite reverse' }} />
                                        <div className="absolute w-[50%] h-[50%] border-4 border-dashed border-emerald-500/20 rounded-full" style={{ animation: 'spin 30s linear infinite' }} />

                                        {/* Sniper Crosshairs */}
                                        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                                        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
                                    </div>

                                    {/* Left Telemetry Pillar */}
                                    <div className="absolute left-6 top-10 bottom-10 w-48 hidden lg:flex flex-col justify-between opacity-70 z-20 pointer-events-none animate-fade-in-up">
                                        <div className="space-y-3 font-mono text-[9px] text-accent tracking-widest uppercase">
                                            <div className="flex justify-between items-center"><span className="animate-pulse">SYS.CORE</span><span className="text-white">ONLINE</span></div>
                                            <div className="flex justify-between items-center text-muted"><span>LATENCY</span><span className="text-emerald-400">12ms</span></div>
                                            <div className="flex justify-between items-center text-muted"><span>NODE</span><span>LOCAL:EDGE</span></div>
                                            <div className="flex justify-between items-center text-muted"><span>FRAMES</span><span>60fps TARGET</span></div>
                                            <div className="w-full h-px bg-gradient-to-r from-accent/50 to-transparent my-4" />
                                            <div className="text-emerald-400 animate-pulse">AWAITING BIOMETRIC LINK...</div>
                                        </div>
                                        <div className="h-32 w-full border-l-2 border-accent/20 relative">
                                            <div className="absolute -left-[2px] w-1 h-8 bg-accent rounded-full shadow-[0_0_10px_#6366f1]" style={{ animation: 'scan 2s ease-in-out infinite' }} />
                                        </div>
                                    </div>

                                    {/* Right Telemetry Pillar */}
                                    <div className="absolute right-6 top-10 bottom-10 w-48 hidden lg:flex flex-col justify-between opacity-70 z-20 pointer-events-none animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                        <div className="h-32 w-full border-r-2 border-purple-500/20 relative flex justify-end">
                                            <div className="absolute -right-[2px] w-1 h-12 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" style={{ animation: 'scan 3s ease-in-out infinite reverse' }} />
                                        </div>
                                        <div className="space-y-3 font-mono text-[9px] text-purple-400 tracking-widest uppercase text-right">
                                            <div className="flex justify-between items-center text-muted"><span>VIS.MODEL</span><span className="text-white">MEDIAPIPE v3</span></div>
                                            <div className="flex justify-between items-center text-muted"><span>MODE</span><span>MULTI-FACE</span></div>
                                            <div className="flex justify-between items-center text-muted"><span>PRIVACY</span><span className="text-emerald-400">SECURE:E2E</span></div>
                                            <div className="flex justify-between items-center text-muted"><span>MEMORY</span><span className="text-accent">BACKBOARD SDK</span></div>
                                        </div>
                                    </div>

                                    {/* Central glowing core */}
                                    <div className="relative z-30 text-center p-8 backdrop-blur-xl rounded-3xl bg-black/60 border border-white/10 shadow-[0_0_120px_-20px_rgba(99,102,241,0.6)] min-w-[340px] mix-blend-screen overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                        <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center group pointer-events-none">
                                            {modelLoading ? (
                                                <>
                                                    {/* Initializing State: Deep glow and fast mechanical spins */}
                                                    <div className="absolute inset-0 rounded-full border border-white/5 bg-black/40 shadow-[inset_0_0_30px_rgba(168,85,247,0.1)]" />
                                                    <div className="absolute inset-1 border-[1.5px] border-purple-500/10 border-r-purple-500 border-b-purple-500 rounded-full" style={{ animation: 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
                                                    <div className="absolute inset-4 border-[1.5px] border-indigo-500/10 border-t-indigo-400 border-l-indigo-400 rounded-full" style={{ animation: 'spin 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse' }} />

                                                    {/* Central initializing node */}
                                                    <div className="absolute w-8 h-8 rounded-full bg-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <IntelligenceLogo size={120} className="scale-110 drop-shadow-[0_0_25px_rgba(99,102,241,0.8)]" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <h2 className="text-xl font-bold text-white mb-2 tracking-widest uppercase filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                            {modelLoading ? "Initializing Core" : "Vision System Ready"}
                                        </h2>
                                        <p className="text-accent text-xs mb-6 font-mono opacity-90 tracking-widest">
                                            {modelLoading ? "> Loading MediaPipe neural network..." : "> Awaiting biometric streams..."}
                                        </p>

                                        {modelLoading ? (
                                            <div className="mt-4 w-56 mx-auto h-1 bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
                                                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-transparent via-accent to-purple-500 rounded-full" style={{ width: "100%", animation: "shimmer 1.5s ease-in-out infinite" }} />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2.5 text-left bg-black/60 p-4 rounded-xl border border-white/10 font-mono text-[10px] text-muted shadow-inner relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-purple-500" />
                                                <div className="flex items-center justify-between pl-2"><span className="text-accent">●</span> <span className="tracking-wide">Facial Landmarking</span> <span className="text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">OK</span></div>
                                                <div className="flex items-center justify-between pl-2"><span className="text-purple-400">●</span> <span className="tracking-wide">Expression Mapping</span> <span className="text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">OK</span></div>
                                                <div className="flex items-center justify-between pl-2"><span className="text-emerald-400">●</span> <span className="tracking-wide">Local Privacy Core</span> <span className="text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">OK</span></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Per-face overlays */}
                            {session.state.isActive && stream && students.map(student => {
                                const bb = student.face.boundingBox;
                                const colors = STATE_COLORS[student.state];
                                const sig = student.face.signals;
                                return (
                                    <div key={student.face.sessionId} className="absolute pointer-events-none transition-all duration-300 ease-out z-40 group" style={{ right: `${bb.x * 100}%`, top: `${bb.y * 100}%`, width: `${bb.w * 100}%`, height: `${bb.h * 100}%` }}>
                                        {/* Holographic scanning background inside the box */}
                                        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-${colors.accent}-500/5 to-${colors.accent}-500/10 opacity-30 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] rounded-2xl transition-all duration-500`} />

                                        {/* Outer soft glow bracket */}
                                        <div className={`absolute inset-0 rounded-2xl ring-1 ${colors.ring} ${colors.glow} transition-all duration-500 opacity-60`} />

                                        {/* Precision corner brackets */}
                                        <div className="absolute inset-0 rounded-2xl border-[0.5px] border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                                            <div className={`absolute -top-[2px] -left-[2px] w-6 h-6 border-t-[3px] border-l-[3px] rounded-tl-2xl ${colors.border} transition-colors duration-500 drop-shadow-[0_0_10px_currentColor]`} />
                                            <div className={`absolute -top-[2px] -right-[2px] w-6 h-6 border-t-[3px] border-r-[3px] rounded-tr-2xl ${colors.border} transition-colors duration-500 drop-shadow-[0_0_10px_currentColor]`} />
                                            <div className={`absolute -bottom-[2px] -left-[2px] w-6 h-6 border-b-[3px] border-l-[3px] rounded-bl-2xl ${colors.border} transition-colors duration-500 drop-shadow-[0_0_10px_currentColor]`} />
                                            <div className={`absolute -bottom-[2px] -right-[2px] w-6 h-6 border-b-[3px] border-r-[3px] rounded-br-2xl ${colors.border} transition-colors duration-500 drop-shadow-[0_0_10px_currentColor]`} />
                                        </div>

                                        {/* Flagship Top HUD Score Chip */}
                                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-stretch overflow-hidden rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 min-w-[140px]">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border-r border-white/10 relative overflow-hidden">
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.bg}`} />
                                                <div className="relative flex items-center justify-center">
                                                    <div className={`absolute inset-0 ${colors.bg} rounded-full animate-ping opacity-60`} />
                                                    <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} shadow-[0_0_8px_currentColor]`} style={{ color: colors.border.replace('border-', '') }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-white tracking-widest uppercase ml-1 opacity-90">{student.face.label}</span>
                                            </div>
                                            <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 ${colors.glow.replace('shadow-', 'bg-').replace('/30', '/10')}`}>
                                                <div className="flex items-end gap-0.5 ml-auto">
                                                    <span className={`text-xs font-bold font-mono tracking-wider ${colors.text} drop-shadow-[0_0_8px_currentColor]`}>{formatPercentValue(student.score)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flagship Bottom HUD: Stronger State Badge & Micro-Signals */}
                                        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500">
                                            {/* Primary State Plate */}
                                            <div className={`px-4 py-1.5 rounded-full bg-[#0a0f18]/90 backdrop-blur-2xl border-[1.5px] border-${colors.accent}-500/40 shadow-[0_0_25px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(255,255,255,0.05)] relative overflow-hidden group-hover:border-${colors.accent}-400/80 transition-all`}>
                                                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${colors.accent}-400/20 to-transparent animate-[shimmer_2s_infinite]`} />
                                                <span className={`text-[11px] font-black tracking-[0.2em] uppercase ${colors.text} drop-shadow-[0_0_8px_currentColor] relative z-10`}>
                                                    {student.state}
                                                </span>
                                            </div>

                                            {/* Micro-signals Stack */}
                                            {(sig.mouthActivity > 0.3 || sig.headDown || sig.possibleDrowsiness) && (
                                                <div className="flex gap-1.5">
                                                    {sig.mouthActivity > 0.3 && (
                                                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#0a0f18]/90 text-purple-300 border border-purple-500/30 font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> SPEAKING
                                                        </span>
                                                    )}
                                                    {sig.headDown && (
                                                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#0a0f18]/90 text-amber-300 border border-amber-500/30 font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                                                            <div className="w-1.5 h-1.5 rotate-45 bg-amber-400 animate-pulse" /> HEAD DOWN
                                                        </span>
                                                    )}
                                                    {sig.possibleDrowsiness && (
                                                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#0a0f18]/90 text-red-300 border border-red-500/30 font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                                                            <div className="w-1 h-1.5 bg-red-400 animate-pulse" /> DROWSY
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* High-End Tech Telemetry Bar */}
                                        <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-1.5 h-[60%] bg-[#0a0f18]/80 backdrop-blur-sm rounded-full border border-white/5 shadow-2xl overflow-hidden flex flex-col justify-end">
                                            {/* The progress fill */}
                                            <div className={`w-full transition-all duration-500 ease-out relative ${colors.bg}`} style={{ height: `${student.score}%` }}>
                                                {/* Hot glowing tip */}
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                                                {/* Scan pulse inside the bar */}
                                                <div className="absolute inset-x-0 h-4 bg-white/30" style={{ animation: 'scan 2s ease-in-out infinite' }} />
                                            </div>
                                            {/* Segmented notches overlay */}
                                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjYiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC40KSIvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay" />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Scan line */}
                            {session.state.isActive && stream && (
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent absolute" style={{ animation: "scan 4s ease-in-out infinite" }} />
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center justify-between relative overflow-hidden">
                            {/* Animated bottom beam */}
                            {session.state.isActive && <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 w-full animate-beam" />}

                            <div className="flex items-center gap-4 relative z-10 w-full">
                                {!stream ? (
                                    <button
                                        onClick={startCamera}
                                        disabled={modelLoading || isSubmitting}
                                        className="relative group overflow-hidden rounded-xl px-8 py-3 bg-gradient-to-r from-accent to-purple-600 hover:from-accent hover:to-purple-500 text-white font-bold transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative flex items-center gap-2">
                                            {modelLoading ? (
                                                <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> System Booting...</>
                                            ) : isSubmitting ? (
                                                <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Compiling Data...</>
                                            ) : (
                                                <><span className="text-lg">⚡</span> Initialize Protocol</>
                                            )}
                                        </span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopCamera}
                                        disabled={isSubmitting}
                                        className="relative group rounded-xl px-6 py-3 bg-danger/20 hover:bg-danger/30 border border-danger/50 text-danger-light font-bold transition-all flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <><div className="w-4 h-4 border-2 border-danger-light/50 border-t-danger-light rounded-full animate-spin" /> Saving Memory...</>
                                        ) : (
                                            <><span className="w-2 h-2 rounded-sm bg-danger animate-pulse" /> End Session</>
                                        )}
                                    </button>
                                )}

                                <div className="ml-auto flex items-center gap-3">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Processing Node</span>
                                        <span className="text-xs font-mono text-emerald-400">Local Browser E2E</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* ── PPT Upload ── */}
                    <Card className="bg-accent/[0.03] border-accent/20">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Slide Deck</h3>
                            {pptFileName && <Badge variant="success" size="sm">📄 {pptFileName}</Badge>}
                        </div>

                        {!pptFileName ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pptx"
                                        onChange={handlePptUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        disabled={pptParsing || session.state.isActive}
                                    />
                                    <div className={`border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-accent/40 hover:bg-accent/[0.02] transition-all ${session.state.isActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                                        {pptParsing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm text-muted">Parsing slides...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-3xl mb-2">📤</div>
                                                <p className="text-sm text-foreground font-medium">Upload PowerPoint</p>
                                                <p className="text-xs text-muted mt-1">Drop a .pptx file to use your own slides</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted text-center">Or use the default fallback presentation</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                                    {(customSlides ?? []).map((slide, i) => (
                                        <div key={slide.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${session.state.currentSlideIndex === i ? "bg-accent/10 ring-1 ring-accent/30" : "bg-white/[0.02]"}`}>
                                            <span className="font-bold text-muted w-5">{slide.id}</span>
                                            <span className="text-foreground truncate flex-1">{slide.title}</span>
                                        </div>
                                    ))}
                                </div>
                                {!session.state.isActive && (
                                    <button onClick={clearPpt} className="text-[10px] text-muted hover:text-foreground transition-colors underline">
                                        Remove custom deck
                                    </button>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Slide controls + stats */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card className="bg-accent/[0.03] border-accent/20">
                            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Slide</h3>
                            <div className="flex items-center justify-between mb-2">
                                <button onClick={goPrev} disabled={session.state.currentSlideIndex === 0} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-foreground disabled:opacity-30 transition-all" aria-label="Previous slide">←</button>
                                <div className="text-center flex-1 px-2">
                                    <div className="text-xl font-extrabold text-foreground">{currentSlide?.id ?? 1}<span className="text-muted text-sm font-medium"> / {currentSlides.length}</span></div>
                                </div>
                                <button onClick={goNext} disabled={session.state.currentSlideIndex === currentSlides.length - 1} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-foreground disabled:opacity-30 transition-all" aria-label="Next slide">→</button>
                            </div>
                            <div className="bg-black/30 rounded-lg p-2.5 border border-white/5">
                                <p className="text-sm font-semibold text-foreground">{currentSlide?.title ?? ""}</p>
                                <p className="text-xs text-muted mt-0.5">{currentSlide?.topic ?? ""}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted border border-white/5">{currentSlide?.difficulty ?? "medium"}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted border border-white/5">{currentSlide?.teachingMode ?? "lecture"}</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-muted mt-2 text-center">← → arrow keys</p>
                        </Card>

                        <Reveal delay={0.1}>
                            <Card>
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Class Engagement</h3>
                                <div className="text-5xl font-extrabold text-foreground">{classAvg}<span className="text-2xl text-muted ml-1">%</span></div>
                                <p className="text-xs text-muted mt-2">Real-time from {students.length} tracked learner{students.length !== 1 ? "s" : ""}</p>
                            </Card>
                        </Reveal>
                    </div>

                    <EngagementChart />
                </div>

                {/* ═══ RIGHT: Side Panel ═══ */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Student Cards */}
                    <Reveal delay={0.05}>
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Tracked Students</h3>
                                <Badge variant={students.length > 0 ? "success" : "default"} size="sm">{students.length} detected</Badge>
                            </div>
                            {students.length === 0 && <div className="text-center py-8"><p className="text-sm text-muted">Start the session to detect students</p></div>}
                            <div className="space-y-3">
                                {students.map(student => <StudentCard key={student.face.sessionId} student={student} />)}
                            </div>
                        </Card>
                    </Reveal>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                        <Reveal delay={0.1}><Card className="text-center"><p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Students</p><p className="text-2xl font-extrabold text-foreground">{students.length}</p></Card></Reveal>
                        <Reveal delay={0.15}><Card className="text-center"><p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Avg</p><p className="text-2xl font-extrabold text-foreground">{classAvg}<span className="text-sm text-muted">%</span></p></Card></Reveal>
                        <Reveal delay={0.2}><Card className="text-center"><p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Confusion</p><p className="text-2xl font-extrabold text-rose-400">{confusionSpikes}</p></Card></Reveal>
                    </div>

                    {/* Per-Slide Analytics */}
                    <Reveal delay={0.1}>
                        <Card>
                            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Per-Slide Analytics</h3>
                            <div className="space-y-2">
                                {currentSlides.map(slide => {
                                    const a = session.state.slideAnalytics.get(slide.id);
                                    const avg = a?.avgEngagement ?? 0;
                                    const isCurrent = slide.id === currentSlide?.id;
                                    return (
                                        <div key={slide.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${isCurrent ? "bg-accent/10 ring-1 ring-accent/30" : "bg-white/[0.02]"}`}>
                                            <span className={`text-[10px] font-bold w-5 ${isCurrent ? "text-accent-light" : "text-muted"}`}>{slide.id}</span>
                                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-500 ${avg > 70 ? "bg-emerald-500" : avg > 50 ? "bg-amber-500" : avg > 0 ? "bg-rose-500" : "bg-white/10"}`} style={{ width: `${Math.max(2, avg)}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono text-muted w-8 text-right">{avg > 0 ? `${formatPercentValue(avg)}` : "—"}</span>
                                            <span className="text-[9px] text-muted truncate max-w-20">{slide.topic}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </Reveal>

                    {/* Event Feed */}
                    <Reveal delay={0.15}>
                        <Card>
                            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Live Event Feed</h3>
                            {eventLog.length === 0 && <p className="text-xs text-muted text-center py-4">State transitions appear here</p>}
                            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                {eventLog.map(evt => {
                                    const colors = STATE_COLORS[evt.state];
                                    return (
                                        <div key={evt.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-white/[0.02] border border-white/5 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} shrink-0`} />
                                            <span className="text-[11px] font-semibold text-foreground w-16 shrink-0">{evt.label}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>{evt.state}</span>
                                            <span className="text-[10px] text-muted ml-auto shrink-0">{evt.time}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </Reveal>

                    {/* Privacy + Signal Honesty */}
                    <Reveal delay={0.2}>
                        <Card className="bg-emerald-500/[0.03] border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">🔒</span>
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Privacy & Signal Honesty</h3>
                            </div>
                            <ul className="text-[11px] text-muted space-y-1.5">
                                <li className="flex gap-2"><span className="text-emerald-400">✓</span> MediaPipe WASM runs entirely in your browser</li>
                                <li className="flex gap-2"><span className="text-emerald-400">✓</span> No facial recognition or biometric ID</li>
                                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Only computed metrics flow to dashboards</li>
                            </ul>
                            <div className="mt-3 pt-3 border-t border-white/5">
                                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Signal Classification</p>
                                <div className="space-y-1.5 text-[9px]">
                                    <div>
                                        <p className="font-semibold text-emerald-400 mb-0.5">✅ Direct Measurements</p>
                                        <p className="text-muted pl-3">Face detection · Head pose (yaw/pitch) · Eye openness · Gaze stability · Movement</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-400 mb-0.5">🔧 Heuristic Approximations</p>
                                        <p className="text-muted pl-3">Mouth activity · Head down · Drowsiness · Engagement states</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-500 mb-0.5">🧪 Experimental / Future</p>
                                        <p className="text-muted pl-3">Hand raise · Sleeping · Phone use · Question asking</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Reveal>
                </div>
            </div>

            <DemoJourneyBanner step={1} nextPath="/student" nextLabel="Student Insights" />

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                @keyframes shimmer { 0%, 100% { opacity: 0.5; transform: translateX(-10%); } 50% { opacity: 1; transform: translateX(10%); } }
            `}} />
        </div>
    );
}

// ══════════════════════════════════════════════════
// Student Card
// ══════════════════════════════════════════════════

function StudentCard({ student }: { student: StudentTrack }) {
    const colors = STATE_COLORS[student.state];
    const sig = student.face.signals;

    return (
        <div className={`relative p-3.5 rounded-xl bg-white/[0.03] border border-white/10 transition-all duration-500 shadow-lg ${colors.glow}`}>
            <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${colors.bg} transition-colors duration-500`} />
            <div className="pl-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-foreground">{student.face.label}</span>
                        <span className={`text-[9.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${colors.bg}/20 ${colors.text}`}>{student.state}</span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                        {/* Direct Measurements */}
                        <MiniSignal label="Gaze" title="Direct Measurement: Gaze Stability" value={sig.gazeStability} color={colors.bg} type="direct" />
                        <MiniSignal label="Move" title="Direct Measurement: Movement Stability" value={1 - sig.movementScore} color={colors.bg} type="direct" />
                        <MiniSignal label="Eyes" title="Direct Measurement: Eye Openness" value={sig.eyeOpenness} color={colors.bg} type="direct" />

                        {/* Heuristic / Inferred */}
                        <MiniSignal label="Pitch" title="Direct Measurement: Head Pitch" value={Math.max(0, 1 - Math.abs(sig.headPitch) / 0.5)} color={colors.bg} type="direct" />
                        <MiniSignal label="Mouth" title="Heuristic Approximation: Mouth Activity / Talking" value={sig.mouthActivity} color="bg-purple-500" type="heuristic" />
                        <MiniSignal label="Alert" title="Heuristic Approximation: Anti-Drowsiness" value={sig.possibleDrowsiness ? 0.2 : 0.9} color={sig.possibleDrowsiness ? "bg-red-500" : colors.bg} type="heuristic" />
                    </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end">
                    <div className={`text-3xl font-extrabold tracking-tight ${colors.text} transition-colors duration-500`}>
                        {formatScore(student.score / 100)}<span className="text-sm text-muted opacity-80">%</span>
                    </div>
                    <div className="flex items-end gap-[2px] h-5 mt-1.5 justify-end">
                        {student.scoreHistory.slice(-12).map((s, i) => (
                            <div key={i} className={`w-1 rounded-full ${colors.bg}/60 transition-all duration-200`} style={{ height: `${Math.max(3, (s / 100) * 20)}px` }} />
                        ))}
                    </div>
                    <p className="text-[10px] text-muted mt-1.5">conf {formatPercentage(student.confidence, true)}</p>
                </div>
            </div>
        </div>
    );
}

function MiniSignal({ label, title, value, color, type }: { label: string; title: string; value: number; color: string; type: "direct" | "heuristic" | "experimental" }) {
    const typeIndicator = type === "direct" ? "✅" : type === "heuristic" ? "🔧" : "🧪";

    return (
        <div className="flex items-center gap-1.5" title={title}>
            <span className="text-[9px] text-muted w-[38px] shrink-0 font-medium tracking-wide flex items-center justify-between">
                {label} <span className="text-[8px] opacity-70 ml-0.5">{typeIndicator}</span>
            </span>
            <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width: `${Math.max(4, value * 100)}%`, opacity: 0.85 }} />
            </div>
        </div>
    );
}
