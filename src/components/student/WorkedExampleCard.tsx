"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/MotionKit";
import { useStudentInsight } from "@/components/student/StudentInsightProvider";

export default function WorkedExampleCard() {
    const [expandedStep, setExpandedStep] = useState<number | null>(null);
    const { data, isLoading } = useStudentInsight();

    // Map AI data to component structure, or fallback to mock
    const fallbackExample = {
        title: "Waiting for AI Example",
        topic: "Gemini will generate a relatable worked example here based on session performance.",
        steps: [] as { label: string; content: string; highlight: boolean }[],
        takeaway: "Waiting for example details."
    };

    const stepsData = data?.workedExample ? data.workedExample.steps.map((stepStr, i) => ({
        label: `Step ${i + 1}`,
        content: stepStr,
        highlight: i === 1 // Just an arbitrary highlight for demo
    })) : fallbackExample.steps;

    const takeawayText = data?.workedExample?.answer || fallbackExample.takeaway;

    return (
        <Reveal delay={0.4} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-accent-light text-lg">
                            📝
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">
                                {data?.workedExample ? "Let's Solve This Together" : fallbackExample.title}
                            </h3>
                            <p className="text-xs text-muted">
                                {data?.workedExample?.problem || fallbackExample.topic}
                            </p>
                        </div>
                        <Badge variant="default" size="md">Worked Example</Badge>
                    </div>

                    {isLoading ? (
                        <div className="animate-pulse space-y-3">
                            <div className="h-14 bg-white/5 rounded-xl border border-white/5" />
                            <div className="h-14 bg-white/5 rounded-xl border border-white/5" />
                            <div className="h-14 bg-white/5 rounded-xl border border-white/5" />
                            <div className="h-16 bg-success/5 rounded-xl border border-success/15 mt-5" />
                        </div>
                    ) : (
                        <>
                            {/* Steps */}
                            <div className="space-y-2">
                                {stepsData.length === 0 && (
                                    <div className="glass-card p-4 text-center border-white/5">
                                        <p className="text-sm text-muted">No steps generated yet.</p>
                                    </div>
                                )}
                                {stepsData.map((step, i) => {
                                    const isExpanded = expandedStep === i;
                                    return (
                                        <div
                                            key={i}
                                            className={`glass-card p-4 cursor-pointer transition-all duration-300 ${step.highlight
                                                ? "bg-accent/5 border-accent/15 hover:bg-accent/8"
                                                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                                                } ${isExpanded ? "ring-1 ring-accent/20" : ""}`}
                                            onClick={() => setExpandedStep(isExpanded ? null : i)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${step.highlight
                                                    ? "bg-accent/20 ring-1 ring-accent/30 text-accent-light"
                                                    : "bg-white/10 text-muted"
                                                    }`}>
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-sm font-semibold ${step.highlight ? "text-accent-light" : "text-foreground"}`}>
                                                            {step.label}
                                                        </p>
                                                        <svg
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            className={`text-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                                        >
                                                            <polyline points="6 9 12 15 18 9" />
                                                        </svg>
                                                    </div>
                                                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"}`}>
                                                        <p className="text-xs text-muted leading-relaxed">{step.content}</p>
                                                    </div>
                                                    {!isExpanded && (
                                                        <p className="text-xs text-muted mt-1 line-clamp-1">{step.content}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Takeaway */}
                            <div className="mt-4 glass-card p-4 bg-success/5 border-success/10">
                                <div className="flex items-start gap-2">
                                    <span className="text-base mt-0.5">💡</span>
                                    <div>
                                        <p className="text-xs font-semibold text-success mb-1">The Answer</p>
                                        <p className="text-sm text-foreground leading-relaxed">{takeawayText}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </Reveal>
    );
}
