"use client";

import React, { useState } from "react";
import EngagementSummary from "@/components/student/EngagementSummary";
import FocusMomentsCard from "@/components/student/FocusMomentsCard";
import TopicBreakdownCard from "@/components/student/TopicBreakdownCard";
import ReflectionFlow from "@/components/student/ReflectionFlow";
import AIRecapCard from "@/components/student/AIRecapCard";
import WorkedExampleCard from "@/components/student/WorkedExampleCard";
import MiniQuizCard from "@/components/student/MiniQuizCard";
import StudyAdviceCard from "@/components/student/StudyAdviceCard";
import PatternInsightCard from "@/components/student/PatternInsightCard";
import Button from "@/components/ui/Button";
import { DemoJourneyBanner } from "@/components/ui/DemoJourneyBanner";
import Badge from "@/components/ui/Badge";
import { StudentInsightProvider } from "@/components/student/StudentInsightProvider";
import { useSession } from "@/components/session/SessionEngineProvider";

export default function StudentDashboard() {
    const { state, getStudentSummary } = useSession();

    // Dynamically build the list of learners from actual live tracking data
    const activeLearnerIds = Array.from(state.students.keys());
    const classLearners = activeLearnerIds.length > 0
        ? activeLearnerIds.map((id, index) => {
            const sum = getStudentSummary(id);
            const confusionCount = sum?.confusionCount ?? 0;
            const avgEngagement = sum?.avgEngagement ?? 100;

            const statusStr = confusionCount > 2 ? "Attention Needed" :
                avgEngagement < 50 ? "Review Suggested" : "Active Tracking";
            const colorClass = statusStr === "Attention Needed" ? "bg-warning/80" :
                statusStr === "Review Suggested" ? "bg-accent/80" : "bg-success/80";
            const textColorClass = statusStr === "Attention Needed" ? "text-warning" :
                statusStr === "Review Suggested" ? "text-accent-light" : "text-success";

            return {
                id: id,
                name: `Learner ${id.split('-')[0].substring(0, 4)}`,
                status: statusStr,
                bg: colorClass,
                color: textColorClass
            };
        })
        : [{ id: "waiting", name: "Awaiting Camera Session", status: "Idle", bg: "bg-white/20", color: "text-muted" }];

    const [selectedStudent, setSelectedStudent] = useState(classLearners[0]);

    // Ensure state syncs if the activeLearnerIds updates
    React.useEffect(() => {
        if (classLearners.length > 0 && !classLearners.find(l => l.id === selectedStudent.id)) {
            setSelectedStudent(classLearners[0]);
        }
    }, [classLearners, selectedStudent.id]);

    return (
        <StudentInsightProvider studentId={selectedStudent.id}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* ── Premium Intelligence Header ──────────────────────────────── */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 relative z-10 animate-fade-in-up">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                                Intelligence <span className="gradient-text">Hub</span>
                            </h1>
                            <Badge variant="success" size="md" className="shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" /> Live Telemetry
                            </Badge>
                        </div>
                        <p className="text-muted flex items-center gap-2 text-sm">
                            <span className="font-mono text-accent">SESSION</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            {state.sessionTitle}
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-emerald-400/80">Analysis complete</span>
                        </p>
                    </div>

                    {/* Premium Learner Switcher */}
                    <div className="flex items-center gap-2 bg-[#09090b]/80 backdrop-blur-2xl border border-white/5 rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-x-auto max-w-full">
                        {classLearners.map(learner => {
                            const isSelected = selectedStudent.id === learner.id;
                            const isWarning = learner.status === "Attention Needed";

                            return (
                                <button
                                    key={learner.id}
                                    onClick={() => setSelectedStudent(learner)}
                                    className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 overflow-hidden ${isSelected ? "text-white" : "text-muted hover:text-white hover:bg-white/[0.03]"}`}
                                >
                                    {isSelected && (
                                        <>
                                            <div className="absolute inset-0 bg-white/5" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_infinite]" />
                                            <div className={`absolute inset-0 border ${isWarning ? 'border-warning/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]'} rounded-xl`} />
                                        </>
                                    )}
                                    <div className="relative z-10 flex items-center gap-2">
                                        <div className="relative flex items-center justify-center">
                                            {isSelected && <div className={`absolute inset-0 ${learner.bg} rounded-full blur-md opacity-60`} />}
                                            <div className={`w-2 h-2 rounded-full ${isSelected ? learner.bg + " shadow-[0_0_8px_currentColor]" : "bg-white/20"}`} style={{ color: learner.color.replace('text-', '') }} />
                                        </div>
                                        {learner.name}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button href="/session" variant="secondary" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
                            Timeline
                        </Button>
                        <Button href="/privacy" variant="ghost" size="sm">
                            🔒 Privacy
                        </Button>
                    </div>
                </div>

                {/* ── Active Learner Snapshot Strip ────────── */}
                <div className="mb-8 flex items-center gap-4 px-5 py-3 rounded-2xl bg-gradient-to-r from-accent/5 via-transparent to-transparent border border-accent/10 backdrop-blur-sm relative overflow-hidden animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/50 rounded-l-2xl" />
                    <span className="text-sm font-bold text-foreground">Active Target: <span className={selectedStudent.color}>{selectedStudent.name}</span></span>
                    <div className="w-px h-4 bg-white/10" />
                    <span className="text-xs text-muted font-mono uppercase tracking-widest flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedStudent.bg}`} />
                        {selectedStudent.status}
                    </span>
                    <div className="ml-auto text-[10px] text-muted tracking-widest uppercase font-mono">
                        Biometric ID: {selectedStudent.id.toUpperCase()}-942
                    </div>
                </div>

                {/* ── Section 1: Engagement Journey ────────── */}
                <EngagementSummary />

                {/* ── Section 2: Focus Highlights ──────────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-success" />
                        <h2 className="text-xl font-bold text-foreground">Session Highlights</h2>
                    </div>
                    <FocusMomentsCard />
                </div>

                {/* ── Section 3: Topic Breakdown ──────────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-accent" />
                        <h2 className="text-xl font-bold text-foreground">Topic-by-Topic</h2>
                    </div>
                    <TopicBreakdownCard />
                </div>

                {/* ── Section 4: Reflection (Dip Analysis) ── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-warning" />
                        <h2 className="text-xl font-bold text-foreground">Reflection</h2>
                        <Badge variant="warning" size="sm">Slide {getStudentSummary(selectedStudent.id)?.weakestSlide ?? "N/A"}</Badge>
                    </div>
                    <ReflectionFlow />
                </div>

                {/* ── Section 5: AI Recap & Learning Materials */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-success" />
                        <h2 className="text-xl font-bold text-foreground">Your Personalized Materials</h2>
                        <Badge variant="success" size="sm">✨ AI-Generated</Badge>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <AIRecapCard />
                        <WorkedExampleCard />
                    </div>
                </div>

                {/* ── Section 6: Mini Quiz ─────────────────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-accent-light" />
                        <h2 className="text-xl font-bold text-foreground">Quick Check</h2>
                        <Badge variant="default" size="sm">No grades — just for you</Badge>
                    </div>
                    <MiniQuizCard />
                </div>

                {/* ── Section 7: Study Advice & Pattern ────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-success" />
                        <h2 className="text-xl font-bold text-foreground">Your Growth Zone</h2>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <StudyAdviceCard />
                        <PatternInsightCard />
                    </div>
                </div>

                {/* ── Privacy Footer ──────────────────────── */}
                <div className="mt-10 glass-card p-5 flex items-start gap-4 border-accent/15">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center text-accent-light flex-shrink-0 text-lg">
                        🤝
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground mb-1">This Page Is Yours</p>
                        <p className="text-xs text-muted leading-relaxed">
                            Everything on this page is <strong className="text-foreground">private to you</strong>. Your teacher only sees aggregated, anonymous class-level data — never your individual engagement, reflections, or quiz answers. We&apos;re here to help you learn, not to evaluate you.{" "}
                            <a href="/privacy" className="text-accent-light hover:underline">Learn more about how we protect your data →</a>
                        </p>
                    </div>
                </div>

                <DemoJourneyBanner step={2} nextPath="/teacher" nextLabel="Teacher Analytics" />
            </div>
        </StudentInsightProvider>
    );
}
