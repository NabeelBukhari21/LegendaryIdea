"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

export default function RetentionPolicyCard() {
    const policies = [
        {
            dataType: "Raw video/audio",
            retention: "Deleted immediately",
            detail: "Processed on-device by MediaPipe. Raw media never leaves the client. Only computed engagement scores are transmitted.",
            icon: "📸",
            severity: "strict",
        },
        {
            dataType: "Engagement scores",
            retention: "48 hours",
            detail: "Session-level engagement data is retained for 48 hours to generate insights, then permanently deleted. Aggregated patterns are retained separately.",
            icon: "📊",
            severity: "short",
        },
        {
            dataType: "Student reflections",
            retention: "Student-controlled",
            detail: "Students can view, export, or delete their reflections at any time. Reflections are automatically deleted at end of term unless the student opts to keep them.",
            icon: "💭",
            severity: "controlled",
        },
        {
            dataType: "AI-generated recaps",
            retention: "End of term",
            detail: "Personalized recaps are retained until the end of the academic term for student review, then archived or deleted based on student preference.",
            icon: "✨",
            severity: "medium",
        },
        {
            dataType: "Aggregated class patterns",
            retention: "Academic year",
            detail: "Class-level patterns (no individual identifiers) are retained for the academic year to inform teaching improvement across semesters.",
            icon: "📈",
            severity: "long",
        },
        {
            dataType: "Audit proofs (Solana)",
            retention: "Permanent",
            detail: "Tamper-evident hashes of access events and consent actions are written to Solana. These contain no student content — only cryptographic proofs.",
            icon: "⛓️",
            severity: "permanent",
        },
    ];

    const severityColors: Record<string, string> = {
        strict: "text-success",
        short: "text-success",
        controlled: "text-blue-400",
        medium: "text-warning",
        long: "text-warning",
        permanent: "text-accent-light",
    };

    return (
        <Reveal delay={0.1} duration={0.6}>
            <Card className="relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-success/15 ring-1 ring-success/20 flex items-center justify-center text-lg">🗑️</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Minimal Retention Policy</h3>
                            <p className="text-xs text-muted">We keep as little data as possible, for as short as possible</p>
                        </div>
                    </div>

                    <StaggerContainer delay={0.2} stagger={0.1}>
                        <div className="space-y-2">
                            {policies.map((p, i) => (
                                <StaggerItem key={i}>
                                    <div className="glass-card p-3.5 bg-white/[0.01] border-white/5 hover:bg-white/[0.03] transition-all">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{p.icon}</span>
                                                <span className="text-sm font-semibold text-foreground">{p.dataType}</span>
                                            </div>
                                            <span className={`text-sm font-bold ${severityColors[p.severity]}`}>{p.retention}</span>
                                        </div>
                                        <p className="text-xs text-muted leading-relaxed ml-7">{p.detail}</p>
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
