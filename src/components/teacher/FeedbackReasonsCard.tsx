"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/MotionKit";
import { useTeacherInsight } from "@/components/teacher/TeacherInsightProvider";

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
    pacing: { bg: "bg-warning/15", text: "text-warning", label: "Pacing" },
    clarity: { bg: "bg-accent/15", text: "text-accent-light", label: "Clarity" },
    content: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Content" },
    fatigue: { bg: "bg-muted/15", text: "text-muted", label: "Fatigue" },
    other: { bg: "bg-white/10", text: "text-muted", label: "Other" },
};

export default function FeedbackReasonsCard() {
    const { data, isLoading } = useTeacherInsight();
    const fallbackTakeaway = "Insufficient reflection data collected yet to determine precise takeaway.";
    const takeaway = data?.feedbackSummary || fallbackTakeaway;
    const feedbackReasons: any[] = []; // Replaced mock array. Will wire to real StudentReflection metrics.

    return (
        <Reveal delay={0.2} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-warning/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Why Students Disengaged</h3>
                            <p className="text-sm text-muted mt-0.5">Aggregated anonymous reflection themes</p>
                        </div>
                        <Badge variant="warning">{feedbackReasons.length} themes</Badge>
                    </div>

                    <div className="space-y-3">
                        {feedbackReasons.map((item, i) => {
                            const cat = categoryColors[item.category];
                            return (
                                <div key={i} className="group">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className={`text-sm font-medium text-foreground`}>{item.reason}</span>
                                            <Badge variant="default" size="sm">
                                                <span className={`w-1.5 h-1.5 rounded-full ${cat.bg.replace('/15', '')} inline-block mr-1`} style={{ backgroundColor: cat.text.includes('warning') ? '#f59e0b' : cat.text.includes('accent') ? '#818cf8' : cat.text.includes('blue') ? '#60a5fa' : '#64748b' }} />
                                                {cat.label}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                            <span className={`text-sm font-bold ${i === 0 ? "text-danger" : i === 1 ? "text-warning" : "text-muted"}`}>
                                                {item.percentage}%
                                            </span>
                                            <span className="text-xs text-muted">({item.count})</span>
                                        </div>
                                    </div>
                                    {/* Bar */}
                                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-danger" : i === 1 ? "bg-warning" : "bg-accent/60"
                                                }`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div className="mt-5 glass-card p-3 bg-warning/5 border-warning/10">
                        {isLoading ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 w-1/4 bg-warning/20 rounded" />
                                <div className="h-8 bg-warning/10 rounded" />
                            </div>
                        ) : (
                            <div className="flex items-start gap-2">
                                <span className="text-sm mt-0.5">💡</span>
                                <div>
                                    <p className="text-xs font-semibold text-warning mb-0.5">Key Takeaway</p>
                                    <p className="text-xs text-muted leading-relaxed">
                                        <strong className="text-foreground">{takeaway}</strong>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-[10px] text-muted mt-3 italic">
                        📊 Based on {feedbackReasons.reduce((s, r) => s + r.count, 0)} anonymous student reflections. Teachers see themes only — never individual responses.
                    </p>
                </div>
            </Card>
        </Reveal>
    );
}
