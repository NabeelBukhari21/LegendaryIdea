"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Reveal, AnimatedCounter } from "@/components/motion/MotionKit";
import { useMemoryInsight } from "@/components/memory/MemoryInsightProvider";

export default function ClassPatternCard() {
    const { data, isLoading } = useMemoryInsight();

    return (
        <Reveal delay={0.2} duration={0.6}>
            <Card className="relative overflow-hidden" glow>
                <div className="absolute top-0 right-0 w-40 h-40 bg-warning/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-warning/15 ring-1 ring-warning/20 flex items-center justify-center text-lg">📊</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Class-Wide Pattern</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-xs text-muted">Persistent learning pattern across all students</p>
                                <Badge variant="success" size="sm">REAL Backboard Thread</Badge>
                            </div>
                        </div>
                        <Badge variant="warning">High Confidence</Badge>
                    </div>

                    <div className="glass-card p-5 bg-warning/[0.04] border-warning/15 mb-4 relative min-h-[140px]">
                        {isLoading ? (
                            <div className="animate-pulse space-y-3">
                                <div className="h-5 bg-white/10 rounded w-full" />
                                <div className="h-4 bg-white/5 rounded w-5/6" />
                                <div className="h-4 bg-white/5 rounded w-4/6" />
                            </div>
                        ) : (
                            <>
                                <p className="text-base font-bold text-foreground leading-relaxed mb-2">
                                    &ldquo;{data?.classPattern.quote}&rdquo;
                                </p>
                                <p className="text-sm text-muted leading-relaxed">
                                    {data?.classPattern.detail}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-xs text-muted">Pattern confidence</span>
                                    <ProgressBar value={94} size="sm" className="flex-1 max-w-40" />
                                    <span className="text-xs font-bold text-warning"><AnimatedCounter value={94} />%</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="glass-card p-3 text-center bg-success/5 border-success/10 transition-transform hover:scale-105">
                            <div className="text-xl font-extrabold text-success"><AnimatedCounter value={89} />%</div>
                            <div className="text-[10px] text-muted mt-0.5">Engagement with examples</div>
                        </div>
                        <div className="glass-card p-3 text-center bg-danger/5 border-danger/10 transition-transform hover:scale-105">
                            <div className="text-xl font-extrabold text-danger"><AnimatedCounter value={48} />%</div>
                            <div className="text-[10px] text-muted mt-0.5">Engagement with formal math</div>
                        </div>
                        <div className="glass-card p-3 text-center bg-accent/5 border-accent/10 transition-transform hover:scale-105">
                            <div className="text-xl font-extrabold text-accent-light"><AnimatedCounter value={41} />pts</div>
                            <div className="text-[10px] text-muted mt-0.5">Gap between formats</div>
                        </div>
                    </div>

                    <div className="glass-card p-3 bg-success/5 border-success/10">
                        {isLoading ? (
                            <div className="animate-pulse h-4 bg-success/20 rounded w-full" />
                        ) : (
                            <p className="text-xs text-muted">
                                <span className="font-semibold text-success">✦ AI Recommendation (Gemini):</span> {data?.classPattern.actionable}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </Reveal>
    );
}
