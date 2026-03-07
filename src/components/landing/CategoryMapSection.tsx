"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { SectionReveal, StaggerContainer, StaggerItem, Reveal } from "@/components/motion/MotionKit";

export default function CategoryMapSection() {
    const categories = [
        {
            name: "Google Antigravity",
            icon: "🏆",
            role: "Hackathon Track",
            description: "InsightBoard AI is built for the Google Antigravity hackathon — combining AI, blockchain, and real-time analysis to transform education.",
            color: "bg-accent/15 ring-accent/20",
            badgeColor: "default" as const,
        },
        {
            name: "Gemini API",
            icon: "✨",
            role: "Content Intelligence",
            description: "Powers AI recaps, simpler explanations, worked examples, quiz generation, and teaching recommendations. Turns engagement data into actionable learning content.",
            color: "bg-success/15 ring-success/20",
            badgeColor: "success" as const,
        },
        {
            name: "MediaPipe",
            icon: "👁️",
            role: "Engagement Detection",
            description: "Real-time, on-device engagement analysis from camera feeds. Computes engagement scores locally — raw media never leaves the device.",
            color: "bg-warning/15 ring-warning/20",
            badgeColor: "warning" as const,
        },
        {
            name: "Backboard",
            icon: "📋",
            role: "Session Memory",
            description: "Persistent memory across sessions. Stores recurring confusion patterns, tracks interventions, and detects accelerating issues over time.",
            color: "bg-blue-500/15 ring-blue-500/20",
            badgeColor: "info" as const,
        },
        {
            name: "Solana",
            icon: "⛓️",
            role: "Audit Verification",
            description: "Tamper-evident audit proofs for data access, consent receipts, and deletion confirmations. Only SHA-256 hashes on-chain — no student content.",
            color: "bg-emerald-500/15 ring-emerald-500/20",
            badgeColor: "success" as const,
        },
    ];

    return (
        <section className="py-16 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-foreground mb-3">
                        Technology <span className="gradient-text">Stack</span>
                    </h2>
                    <p className="text-muted max-w-xl mx-auto">
                        Five technologies, one intelligence loop
                    </p>
                </div>
            </SectionReveal>

            {/* Architecture flow */}
            <Reveal delay={0.2} blur>
                <div className="flex items-center justify-center gap-2 mb-10 flex-wrap text-xs">
                    {["MediaPipe", "→", "Gemini", "→", "Backboard", "→", "Solana"].map((item, i) => (
                        item === "→" ? (
                            <span key={i} className="text-white/20 text-lg">→</span>
                        ) : (
                            <span key={i} className="px-4 py-2 rounded-xl glass-card border-white/10 font-semibold text-foreground">
                                {item}
                            </span>
                        )
                    ))}
                </div>
            </Reveal>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4" delay={0.4} stagger={0.1}>
                {categories.map((cat) => (
                    <StaggerItem key={cat.name} className="h-full">
                        <Card className="text-center group h-full">
                            <div className={`w-14 h-14 rounded-2xl ${cat.color} ring-1 flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                {cat.icon}
                            </div>
                            <Badge variant={cat.badgeColor} size="sm">{cat.role}</Badge>
                            <h4 className="text-sm font-bold text-foreground mt-2 mb-1.5">{cat.name}</h4>
                            <p className="text-[11px] text-muted leading-relaxed">{cat.description}</p>
                        </Card>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
}
