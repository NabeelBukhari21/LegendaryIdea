"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, GlowPulse } from "@/components/motion/MotionKit";
import { useStudentInsight } from "@/components/student/StudentInsightProvider";

export default function AIRecapCard() {
    const { data, isLoading } = useStudentInsight();

    const fallbackRecap = {
        topic: "Topic Summaries",
        poweredBy: "Gemini",
        originalExplanation: "Waiting for session data to generate a recap.",
        simplerExplanation: "Gemini will simplify complex topics here once the session concludes.",
        keyTakeaways: [] as string[]
    };

    return (
        <Reveal delay={0.3} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-success/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-success/15 ring-1 ring-success/20 flex items-center justify-center text-success text-lg">
                            ✨
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Your Personalized Recap</h3>
                            <p className="text-xs text-muted">A simpler way to understand {data?.recap ? "this topic" : fallbackRecap.topic}</p>
                        </div>
                        <Badge variant="success" size="md">
                            <span className="mr-1">🤖</span> {fallbackRecap.poweredBy}
                        </Badge>
                    </div>

                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-20 bg-white/5 rounded-xl border border-white/5" />
                            <div className="h-32 bg-success/5 rounded-xl border border-success/15" />
                        </div>
                    ) : (
                        <>
                            {data?.recap && (
                                <p className="text-sm text-foreground leading-relaxed mb-4 border-l-2 border-accent pl-3">
                                    {data.recap}
                                </p>
                            )}

                            {/* Original — collapsed/subtle */}
                            <div className="glass-card p-4 bg-white/[0.02] border-white/5 mb-3">
                                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">What the lecture said</p>
                                <p className="text-xs text-muted leading-relaxed">{fallbackRecap.originalExplanation}</p>
                            </div>

                            {/* Simpler — prominent */}
                            <div className="glass-card p-5 bg-success/5 border-success/15 mb-4">
                                <p className="text-[10px] font-semibold text-success uppercase tracking-wider mb-2">✨ Here&apos;s a simpler way to think about it</p>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {data?.explanation || fallbackRecap.simplerExplanation}
                                </p>
                            </div>

                            {/* Key Takeaways */}
                            {fallbackRecap.keyTakeaways.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">Key Takeaways</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {fallbackRecap.keyTakeaways.map((t, i) => (
                                            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                                <div className="w-5 h-5 rounded-full bg-success/15 ring-1 ring-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-success text-[10px]">✓</span>
                                                </div>
                                                <span className="text-xs text-muted leading-relaxed">{t}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>
        </Reveal>
    );
}
