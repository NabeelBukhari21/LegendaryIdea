"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/motion/MotionKit";
import { useTeacherInsight } from "@/components/teacher/TeacherInsightProvider";

const typeLabels: Record<string, { label: string; badge: "default" | "success" | "warning" | "danger" }> = {
    immediate: { label: "Apply Now", badge: "danger" },
    "next-session": { label: "Next Session", badge: "warning" },
    structural: { label: "Structural", badge: "default" },
};

const priorityStyles: Record<string, string> = {
    critical: "bg-danger/15 text-danger ring-danger/20",
    high: "bg-warning/15 text-warning ring-warning/20",
    medium: "bg-accent/15 text-accent-light ring-accent/20",
};

export default function BestInterventionCard() {
    const { data } = useTeacherInsight();

    // Fallback since Best Intervention is not currently provided by the backend prompt
    const int = {
        type: "immediate",
        priority: "medium",
        confidence: 0,
        title: "Awaiting Session Insights",
        description: "Gemini requires more session data to provide an intervention plan.",
        estimatedTime: "N/A",
        expectedImpact: "Waiting for sufficient data.",
        steps: [],
        evidence: []
    };
    const typeInfo = typeLabels[int.type];

    return (
        <Reveal delay={0.3} duration={0.6}>
            <Card className="relative overflow-hidden" glow>
                <div className="absolute top-0 right-0 w-48 h-48 bg-success/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className={`w-11 h-11 rounded-xl ring-1 flex items-center justify-center ${priorityStyles[int.priority]}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground text-base">Best Intervention Suggestion</h3>
                            <p className="text-xs text-muted">AI-generated action plan for maximum impact</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={typeInfo.badge}>{typeInfo.label}</Badge>
                            <Badge variant="success">
                                {int.confidence}% match
                            </Badge>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div className="glass-card p-5 bg-accent/[0.03] border-accent/10 mb-4">
                        <h4 className="text-lg font-bold text-foreground mb-2">{int.title}</h4>
                        <p className="text-sm text-muted leading-relaxed">{int.description}</p>

                        <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted">Confidence</span>
                                <ProgressBar value={int.confidence} size="sm" className="w-24" />
                                <span className="text-xs font-semibold text-success">{int.confidence}%</span>
                            </div>
                            <div className="text-xs text-muted">
                                ⏱ {int.estimatedTime}
                            </div>
                        </div>
                    </div>

                    {/* Expected Impact */}
                    <div className="glass-card p-4 bg-success/5 border-success/10 mb-4">
                        <p className="text-xs font-semibold text-success uppercase tracking-wider mb-1">✦ Expected Impact</p>
                        <p className="text-sm text-foreground leading-relaxed">{int.expectedImpact}</p>
                    </div>

                    {/* Action Steps */}
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Action Steps</p>
                        <div className="space-y-2">
                            {int.steps.length === 0 ? (
                                <p className="text-xs text-muted italic">Waiting for steps...</p>
                            ) : (
                                int.steps.map((step, i) => (
                                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                                        <div className="w-6 h-6 rounded-full bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-xs font-bold text-accent-light flex-shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm text-muted">{step}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Evidence */}
                    <div>
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Supporting Evidence</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {int.evidence.length === 0 ? (
                                <p className="text-xs text-muted italic">No evidence collected yet.</p>
                            ) : (
                                int.evidence.map((ev, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-muted">
                                        <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                                        <span>{ev}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <Badge>Gemini</Badge>
                        <span className="text-[10px] text-muted">AI-generated suggestion — review and customize before applying</span>
                    </div>
                </div>
            </Card>
        </Reveal>
    );
}
