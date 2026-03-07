"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

export default function PrivacyByDesignCard() {
    const principles = [
        {
            icon: "🔒",
            title: "Teachers Only See Aggregated Insights",
            description: "Teacher dashboards display class-level engagement, confusion trends, and aggregated student feedback. Individual student data — including engagement scores, reflections, and quiz results — is never visible to teachers.",
            detail: "Teacher view → class average, pattern counts, anonymized examples only",
        },
        {
            icon: "🚫",
            title: "No Raw Media in Teacher Workflows",
            description: "Teachers never see raw student video, audio, or biometric data at any point. MediaPipe processes engagement signals locally and discards raw media immediately after analysis. Only computed engagement scores are retained.",
            detail: "Raw media → local processing → engagement score → media deleted",
        },
        {
            icon: "💭",
            title: "Student Reflection Validates Detection",
            description: "When the system detects an engagement dip, it asks the student why — rather than making assumptions. Student reflections provide context (e.g., 'content moved too fast') that shapes the AI's response and teaching suggestions.",
            detail: "Detection is a prompt for dialogue, not a conclusion",
        },
        {
            icon: "🔍",
            title: "Explainable Insights Only",
            description: "Every insight shown to teachers includes a clear explanation of what data it's based on, its confidence level, and the reasoning behind any recommendation. There are no opaque scores or unexplained flags.",
            detail: "Every card shows: source data, confidence %, and reasoning",
        },
        {
            icon: "👤",
            title: "Human Review Before Action",
            description: "Learning support signals are suggestions for the teacher to consider — not automated actions. No automated emails, notifications to parents, or grade changes are triggered. A teacher must decide how to respond.",
            detail: "AI suggests → teacher decides → teacher acts (if appropriate)",
        },
        {
            icon: "⛔",
            title: "No Grades, Discipline, or Ranking",
            description: "Engagement data is used exclusively for learning support and teaching improvement. It is never factored into grades, behavioral assessments, or student rankings. This is a learning tool, not an evaluation tool.",
            detail: "Purpose-limited: learning support and content improvement only",
        },
    ];

    return (
        <Reveal delay={0.1} duration={0.6}>
            <Card className="relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-40 h-40 bg-success/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-success/15 ring-1 ring-success/20 flex items-center justify-center text-lg">🛡️</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Privacy-First Design</h3>
                            <p className="text-xs text-muted">How we built privacy into the architecture — not bolted it on</p>
                        </div>
                    </div>

                    <StaggerContainer delay={0.2} stagger={0.08}>
                        <div className="space-y-2.5">
                            {principles.map((p, i) => (
                                <StaggerItem key={i}>
                                    <div className="glass-card p-4 bg-white/[0.01] border-white/5 hover:bg-white/[0.03] transition-all">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl flex-shrink-0 mt-0.5">{p.icon}</span>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-foreground mb-1">{p.title}</h4>
                                                <p className="text-xs text-muted leading-relaxed mb-1.5">{p.description}</p>
                                                <p className="text-[10px] text-accent-light font-mono">{p.detail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </div>
                    </StaggerContainer>
                </div>
            </Card>
        </Reveal>
    );
}
