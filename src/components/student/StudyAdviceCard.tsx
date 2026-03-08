"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/MotionKit";
import { useStudentInsight } from "@/components/student/StudentInsightProvider";

const typeStyles: Record<string, { bg: string; ring: string; badgeVariant: "success" | "warning" | "default"; badgeLabel: string }> = {
    strength: {
        bg: "bg-success/5 border-success/10",
        ring: "bg-success/15 ring-1 ring-success/20",
        badgeVariant: "success",
        badgeLabel: "Your Strength",
    },
    improvement: {
        bg: "bg-warning/5 border-warning/10",
        ring: "bg-warning/15 ring-1 ring-warning/20",
        badgeVariant: "warning",
        badgeLabel: "Growth Area",
    },
    tip: {
        bg: "bg-accent/5 border-accent/10",
        ring: "bg-accent/15 ring-1 ring-accent/20",
        badgeVariant: "default",
        badgeLabel: "Study Tip",
    },
};

export default function StudyAdviceCard() {
    const { data, isLoading } = useStudentInsight();

    const fallbackStudyAdvice = [
        { type: "strength", title: "Awaiting Session Insights", description: "Your study strengths will appear here once the session concludes.", actionable: "Stay engaged with the live presentation.", icon: "👁️" },
        { type: "improvement", title: "Awaiting Focus Data", description: "Your improvement areas will be calculated from your focus metrics.", actionable: "Try to maintain steady attention.", icon: "🔋" },
    ] as const;

    // TODO: Wire this fully to a future structured `studyAdvice` array from the Gemini payload.
    // For now, if there is no data, use the generic fallback.
    const adviceList = fallbackStudyAdvice;

    return (
        <Reveal delay={0.6} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-success/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-success/15 ring-1 ring-success/20 flex items-center justify-center text-lg">
                            📚
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Personal Study Advice</h3>
                            <p className="text-xs text-muted">Tailored suggestions based on your learning patterns</p>
                        </div>
                        <Badge>Gemini</Badge>
                    </div>

                    <div className="space-y-3">
                        {isLoading ? (
                            <div className="animate-pulse space-y-3">
                                <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                                <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                            </div>
                        ) : adviceList.map((advice, i) => {
                            const styles = typeStyles[advice.type];
                            return (
                                <div key={i} className={`glass-card p-4 ${styles.bg}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${styles.ring} flex items-center justify-center text-xl flex-shrink-0`}>
                                            {advice.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-bold text-foreground">{advice.title}</h4>
                                                <Badge variant={styles.badgeVariant} size="sm">{styles.badgeLabel}</Badge>
                                            </div>
                                            <p className="text-xs text-muted leading-relaxed mb-2">{advice.description}</p>
                                            <div className="glass-card p-3 bg-white/[0.02] border-white/5">
                                                <p className="text-xs text-foreground leading-relaxed">
                                                    <span className="font-semibold text-accent-light">→ Try this: </span>
                                                    {advice.actionable}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </Reveal>
    );
}
