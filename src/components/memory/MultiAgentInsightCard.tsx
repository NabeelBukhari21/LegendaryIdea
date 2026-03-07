"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { multiAgentInsights } from "@/data/mockData";
import { Reveal, StaggerContainer, StaggerItem, AnimatedCounter } from "@/components/motion/MotionKit";

const colorMap: Record<string, { bg: string; ring: string; text: string; fill: string }> = {
    accent: { bg: "bg-accent/15", ring: "ring-accent/20", text: "text-accent-light", fill: "bg-accent" },
    success: { bg: "bg-success/15", ring: "ring-success/20", text: "text-success", fill: "bg-success" },
    warning: { bg: "bg-warning/15", ring: "ring-warning/20", text: "text-warning", fill: "bg-warning" },
};

export default function MultiAgentInsightCard() {
    return (
        <Reveal delay={0.2} duration={0.6}>
            <Card className="relative overflow-hidden" glow>
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-success/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-lg">🤖</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Multi-Agent Intelligence Summary</h3>
                            <p className="text-xs text-muted">Combined analysis from MediaPipe, Gemini, and Backboard</p>
                        </div>
                        <Badge variant="success">Converged</Badge>
                    </div>

                    <StaggerContainer delay={0.3} stagger={0.1}>
                        <div className="space-y-3">
                            {multiAgentInsights.map((agent) => {
                                const cm = colorMap[agent.color];
                                return (
                                    <StaggerItem key={agent.agent}>
                                        <div className={`glass-card p-4 ${cm.bg.replace('/15', '/[0.04]')} border-white/8 hover:border-white/15 transition-all`}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-9 h-9 rounded-lg ${cm.bg} ring-1 ${cm.ring} flex items-center justify-center text-base`}>
                                                    {agent.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm font-bold ${cm.text}`}>{agent.agent}</span>
                                                        <span className="text-[10px] text-muted">· {agent.role}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted">Confidence</span>
                                                    <span className={`text-sm font-bold ${cm.text}`}><AnimatedCounter value={agent.confidence} />%</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground/80 leading-relaxed">{agent.insight}</p>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </div>
                    </StaggerContainer>

                    {/* Convergence summary */}
                    <Reveal delay={0.6} direction="up">
                        <div className="mt-4 glass-card p-4 bg-accent/5 border-accent/15">
                            <div className="flex items-start gap-2">
                                <span className="text-base mt-0.5">✦</span>
                                <div>
                                    <p className="text-xs font-bold text-accent-light mb-1">Converged Recommendation</p>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        All three agents agree: <strong>theory-heavy content needs visual scaffolding</strong> before formal notation.
                                        The pattern is accelerating and poses a projected 48%+ drop in Session 6 without intervention.
                                        Recommended action: add a 5-minute visual prerequisite before Slide 4&apos;s chain rule content.
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-muted">Combined confidence</span>
                                        <ProgressBar value={91} size="sm" className="flex-1 max-w-40" />
                                        <span className="text-xs font-bold text-success"><AnimatedCounter value={91} />%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </Card>
        </Reveal>
    );
}
