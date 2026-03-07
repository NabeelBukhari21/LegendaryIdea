"use client";

import React, { useState } from "react";
import SessionTimeline from "@/components/session/SessionTimeline";
import SessionEngagementChart from "@/components/session/SessionEngagementChart";
import SlideDetailPanel from "@/components/session/SlideDetailPanel";
import SessionSummaryBar from "@/components/session/SessionSummaryBar";
import SessionStoryCard from "@/components/session/SessionStoryCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { TeacherInsightProvider } from "@/components/teacher/TeacherInsightProvider";

export default function SessionPage() {
    const [selectedSlide, setSelectedSlide] = useState(4);

    return (
        <TeacherInsightProvider>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* ── Header ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                                Session <span className="gradient-text">Timeline</span>
                            </h1>
                            <Badge variant="info" size="md">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-dot inline-block mr-1.5" />
                                Backboard Sync
                            </Badge>
                        </div>
                        <p className="text-muted">
                            Session 5 — Neural Networks Deep Dive · Mar 6, 2026 · 6 slides · 63 min
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="default">Live Analysis</Badge>
                        <Button href="/teacher" variant="secondary" size="sm">
                            ← Teacher Dashboard
                        </Button>
                        <Button href="/memory" variant="ghost" size="sm">
                            Memory Insights →
                        </Button>
                    </div>
                </div>

                {/* ── Summary Bar ─────────────────────────── */}
                <SessionSummaryBar />

                {/* ── Engagement Curve ────────────────────── */}
                <div className="mt-6">
                    <SessionEngagementChart />
                </div>

                {/* ── Session Story ───────────────────────── */}
                <div className="mt-6">
                    <SessionStoryCard />
                </div>

                {/* ── Timeline + Detail ───────────────────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-accent" />
                        <h2 className="text-xl font-bold text-foreground">Slide-by-Slide Breakdown</h2>
                        <Badge variant="default" size="sm">Click any slide</Badge>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* Timeline sidebar */}
                        <div className="lg:col-span-4 xl:col-span-3">
                            <div className="glass-card p-3 border-white/5 sticky top-20">
                                <SessionTimeline selectedSlide={selectedSlide} onSelectSlide={setSelectedSlide} />
                            </div>
                        </div>

                        {/* Detail panel */}
                        <div className="lg:col-span-8 xl:col-span-9">
                            <SlideDetailPanel selectedSlide={selectedSlide} />
                        </div>
                    </div>
                </div>

                {/* ── Privacy Notice ──────────────────────── */}
                <div className="mt-10 glass-card p-5 flex items-start gap-4 border-accent/15">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center text-accent-light flex-shrink-0 text-lg">
                        📊
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground mb-1">Content-Mapped Intelligence</p>
                        <p className="text-xs text-muted leading-relaxed">
                            This timeline maps <strong className="text-foreground">engagement patterns to specific content moments</strong>. All student data is aggregated — individual students are never identifiable. Teacher insights focus on <strong className="text-foreground">improving content and delivery</strong>, not evaluating students.{" "}
                            <a href="/privacy" className="text-accent-light hover:underline">View privacy policy →</a>
                        </p>
                    </div>
                </div>
            </div>
        </TeacherInsightProvider>
    );
}
