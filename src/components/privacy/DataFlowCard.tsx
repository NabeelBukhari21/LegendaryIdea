"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

export default function DataFlowCard() {
    const stages = [
        {
            step: 1,
            label: "Capture",
            icon: "📸",
            input: "Camera/mic feed",
            process: "On-device engagement analysis via MediaPipe",
            output: "Engagement score (0–100)",
            retention: "Raw media: deleted immediately after processing",
            color: "bg-accent/15 ring-accent/20 text-accent-light",
        },
        {
            step: 2,
            label: "Detect",
            icon: "📉",
            input: "Engagement score stream",
            process: "Dip detection when score drops below threshold",
            output: "Dip event + slide/timestamp mapping",
            retention: "Engagement scores: retained for session, deleted in 48h",
            color: "bg-warning/15 ring-warning/20 text-warning",
        },
        {
            step: 3,
            label: "Reflect",
            icon: "💭",
            input: "Student is prompted after dip detection",
            process: "Student selects reasons + optional free text",
            output: "Anonymized reflection data",
            retention: "Reflections: student-controlled, deletable any time",
            color: "bg-blue-500/15 ring-blue-500/20 text-blue-400",
        },
        {
            step: 4,
            label: "Analyze",
            icon: "🤖",
            input: "Aggregated dip events + reflections",
            process: "Gemini generates personalized recap + teaching suggestions",
            output: "Student recap (private) + teacher insights (aggregated)",
            retention: "AI outputs: retained until end of term, then archived",
            color: "bg-success/15 ring-success/20 text-success",
        },
        {
            step: 5,
            label: "Remember",
            icon: "🧠",
            input: "Session patterns over time",
            process: "Backboard stores recurring pattern hashes",
            output: "Cross-session trend intelligence",
            retention: "Pattern data: aggregated only, no individual identifiers",
            color: "bg-accent/15 ring-accent/20 text-accent-light",
        },
        {
            step: 6,
            label: "Verify",
            icon: "⛓️",
            input: "Access events + consent actions",
            process: "Solana writes tamper-evident hash proofs",
            output: "On-chain audit trail (hashes only, no content)",
            retention: "Audit proofs: permanent, immutable, verifiable",
            color: "bg-emerald-500/15 ring-emerald-500/20 text-emerald-400",
        },
    ];

    return (
        <Reveal delay={0.2} duration={0.6}>
            <Card className="relative overflow-hidden h-full">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-lg">🔄</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Data Flow &amp; Lifecycle</h3>
                            <p className="text-xs text-muted">What data exists, where it goes, and when it&apos;s deleted</p>
                        </div>
                    </div>

                    <StaggerContainer delay={0.3} stagger={0.1}>
                        <div className="space-y-0">
                            {stages.map((stage, i) => {
                                const isLast = i === stages.length - 1;
                                return (
                                    <StaggerItem key={stage.step}>
                                        <div className="relative">
                                            {!isLast && (
                                                <div className="absolute left-[23px] top-[52px] w-0.5 h-[calc(100%-28px)] bg-white/8" />
                                            )}
                                            <div className="flex gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors relative z-10">
                                                <div className={`w-12 h-12 rounded-xl ${stage.color} ring-1 flex items-center justify-center text-base flex-shrink-0 bg-background`}>
                                                    {stage.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-mono text-muted">Step {stage.step}</span>
                                                        <span className="text-sm font-bold text-foreground">{stage.label}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-muted">
                                                        <p><span className="text-foreground/60 font-medium">In:</span> {stage.input}</p>
                                                        <p><span className="text-foreground/60 font-medium">Process:</span> {stage.process}</p>
                                                        <p><span className="text-foreground/60 font-medium">Out:</span> {stage.output}</p>
                                                        <p><span className="text-success font-medium">Retention:</span> {stage.retention}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </div>
                    </StaggerContainer>
                </div>
            </Card>
        </Reveal>
    );
}
