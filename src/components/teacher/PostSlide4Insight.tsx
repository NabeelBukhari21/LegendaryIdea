"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/MotionKit";
import { useTeacherInsight } from "@/components/teacher/TeacherInsightProvider";

export default function PostSlide4Insight() {
    const { data, isLoading } = useTeacherInsight();

    const fallbackPostSlide4Shifts = [
        { metric: "Engagement", before: 82, after: 44, unit: "%", trend: "negative" as "positive" | "negative" | "stable", interpretation: "Severe drop during theoretical explanation." },
        { metric: "Confusion", before: 15, after: 68, unit: "%", trend: "negative" as "positive" | "negative" | "stable", interpretation: "Significant spike in reported confusion." },
    ];

    const aiInsightTitle = data?.postSlide4?.insight || "Silver Lining";
    const aiInsightDescription = data?.postSlide4?.impact ||
        "Despite the dip, the live demo and real-world examples achieved full recovery to 91%. This suggests visual/practical content is highly effective for this class.";

    return (
        <Reveal delay={0.4} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-warning/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-warning/15 ring-1 ring-warning/20 flex items-center justify-center text-warning">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground">What Changed After Slide 4</h3>
                            <p className="text-xs text-muted">Before vs. during/after the engagement dip</p>
                        </div>
                        <Badge variant="warning">Impact Analysis</Badge>
                    </div>

                    {/* Metrics grid */}
                    <div className="space-y-3">
                        {fallbackPostSlide4Shifts.map((shift, i) => (
                            <div key={i} className="glass-card p-4 bg-white/[0.01] border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-foreground">{shift.metric}</span>
                                    <Badge
                                        variant={shift.trend === "positive" ? "success" : shift.trend === "negative" ? "danger" : "default"}
                                        size="sm"
                                    >
                                        {shift.trend === "positive" ? "↗ Recovery" : shift.trend === "negative" ? "↘ Drop" : "→ Stable"}
                                    </Badge>
                                </div>

                                {/* Before / After bar */}
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between text-[10px] text-muted mb-1">
                                            <span>Before</span>
                                            <span className="font-semibold text-foreground">{shift.before}{shift.unit}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                            <div className="h-full rounded-full bg-accent/60 transition-all duration-700" style={{ width: `${shift.before}%` }} />
                                        </div>
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted flex-shrink-0">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between text-[10px] text-muted mb-1">
                                            <span>After</span>
                                            <span className={`font-semibold ${shift.trend === "positive" ? "text-success" : shift.trend === "negative" ? "text-danger" : "text-foreground"}`}>
                                                {shift.after}{shift.unit}
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${shift.trend === "positive" ? "bg-success" : shift.trend === "negative" ? "bg-danger" : "bg-accent/60"
                                                    }`}
                                                style={{ width: `${shift.after}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11px] text-muted leading-relaxed">{shift.interpretation}</p>
                            </div>
                        ))}
                    </div>

                    {/* Summary insight */}
                    <div className="mt-4 glass-card p-3 bg-success/5 border-success/10">
                        {isLoading ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 w-1/3 bg-success/20 rounded" />
                                <div className="h-8 bg-success/10 rounded" />
                            </div>
                        ) : (
                            <div className="flex items-start gap-2">
                                <span className="text-sm mt-0.5">✦</span>
                                <div>
                                    <p className="text-xs font-semibold text-success mb-0.5">{aiInsightTitle}</p>
                                    <p className="text-xs text-muted">
                                        {aiInsightDescription}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </Reveal>
    );
}
