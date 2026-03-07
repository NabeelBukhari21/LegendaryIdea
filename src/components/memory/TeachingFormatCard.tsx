"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { StaggerContainer, StaggerItem, AnimatedCounter } from "@/components/motion/MotionKit";

export default function TeachingFormatCard() {
    // In a real app, this comes from an AI insight analysis API
    const fallbackTeachingFormats = [
        {
            format: "Real-World Examples",
            avgEngagement: 89,
            trend: "up" as const,
            sessions: 5,
            icon: "🌍",
            examples: ["Session 5 Slide 6: +46pts recovery", "Session 3 Slide 5: +28pts recovery"],
            verdict: "best" as "best" | "good" | "weak" | "worst",
        },
        {
            format: "Interactive Polls / Demos",
            avgEngagement: 83,
            trend: "up" as const,
            sessions: 4,
            icon: "🎯",
            examples: ["Session 5 Slide 2: sustained 82%", "Session 4 Slide 3: +15pts boost"],
            verdict: "good" as "best" | "good" | "weak" | "worst",
        },
        {
            format: "Formal Math Proofs",
            avgEngagement: 48,
            trend: "down" as const,
            sessions: 5,
            icon: "∑",
            examples: ["Session 5 Slide 4: -38pts drop", "Session 3 Slide 4: -42pts drop"],
            verdict: "worst" as "best" | "good" | "weak" | "worst",
        }
    ];

    const best = fallbackTeachingFormats.filter((f) => f.verdict === "best" || f.verdict === "good");
    const weak = fallbackTeachingFormats.filter((f) => f.verdict === "weak" || f.verdict === "worst");

    const verdictStyle: Record<string, { badge: "success" | "warning" | "danger" | "default"; label: string }> = {
        best: { badge: "success", label: "★ Best" },
        good: { badge: "success", label: "Good" },
        weak: { badge: "warning", label: "Weak" },
        worst: { badge: "danger", label: "⚠ Weakest" },
    };

    return (
        <StaggerContainer delay={0.4} stagger={0.15}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best formats */}
                <StaggerItem>
                    <Card className="relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-success/15 ring-1 ring-success/20 flex items-center justify-center text-lg">🏆</div>
                                <div>
                                    <h3 className="font-bold text-foreground">Best Teaching Formats</h3>
                                    <p className="text-xs text-muted">What works for your class</p>
                                </div>
                            </div>
                            <div className="space-y-2.5 flex-1">
                                {best.map((f) => {
                                    const vs = verdictStyle[f.verdict];
                                    return (
                                        <div key={f.format} className="glass-card p-3.5 bg-success/[0.03] border-success/10 hover:bg-success/[0.06] transition-all">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{f.icon}</span>
                                                    <span className="text-sm font-semibold text-foreground">{f.format}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={vs.badge} size="sm">{vs.label}</Badge>
                                                    <span className="text-sm font-extrabold text-success"><AnimatedCounter value={f.avgEngagement} />%</span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                                                <div className="h-full rounded-full bg-success/60" style={{ width: `${f.avgEngagement}%` }} />
                                            </div>
                                            <div className="text-[10px] text-muted">
                                                {f.examples.map((ex, i) => (
                                                    <span key={i} className="block">✓ {ex}</span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </StaggerItem>

                {/* Weak formats */}
                <StaggerItem>
                    <Card className="relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-danger/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-danger/15 ring-1 ring-danger/20 flex items-center justify-center text-lg">📉</div>
                                <div>
                                    <h3 className="font-bold text-foreground">Formats Needing Rework</h3>
                                    <p className="text-xs text-muted">Consistently lower engagement</p>
                                </div>
                            </div>
                            <div className="space-y-2.5 flex-1">
                                {weak.map((f) => {
                                    const vs = verdictStyle[f.verdict];
                                    return (
                                        <div key={f.format} className="glass-card p-3.5 bg-danger/[0.03] border-danger/10 hover:bg-danger/[0.06] transition-all">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{f.icon}</span>
                                                    <span className="text-sm font-semibold text-foreground">{f.format}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={vs.badge} size="sm">{vs.label}</Badge>
                                                    <span className={`text-sm font-extrabold ${f.verdict === "worst" ? "text-danger" : "text-warning"}`}><AnimatedCounter value={f.avgEngagement} />%</span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                                                <div className={`h-full rounded-full ${f.verdict === "worst" ? "bg-danger/60" : "bg-warning/60"}`} style={{ width: `${f.avgEngagement}%` }} />
                                            </div>
                                            <div className="text-[10px] text-muted">
                                                {f.examples.map((ex, i) => (
                                                    <span key={i} className="block">⚠ {ex}</span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-3 glass-card p-2.5 bg-accent/5 border-accent/10 mt-auto">
                                <p className="text-[11px] text-muted">
                                    <span className="font-semibold text-accent-light">Insight:</span> Formal math content doesn&apos;t need to be removed — it needs <strong className="text-foreground">visual scaffolding before</strong> the formal notation.
                                </p>
                            </div>
                        </div>
                    </Card>
                </StaggerItem>
            </div>
        </StaggerContainer>
    );
}
