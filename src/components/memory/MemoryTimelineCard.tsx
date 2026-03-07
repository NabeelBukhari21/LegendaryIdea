"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

const typeConfig: Record<string, { color: string; bg: string; ring: string; icon: string; label: string }> = {
    "pattern-detected": { color: "text-warning", bg: "bg-warning/15", ring: "ring-warning/20", icon: "🔍", label: "Pattern" },
    intervention: { color: "text-accent-light", bg: "bg-accent/15", ring: "ring-accent/20", icon: "🛠️", label: "Intervention" },
    improvement: { color: "text-success", bg: "bg-success/15", ring: "ring-success/20", icon: "📈", label: "Improvement" },
    alert: { color: "text-danger", bg: "bg-danger/15", ring: "ring-danger/20", icon: "🚨", label: "Alert" },
    milestone: { color: "text-blue-400", bg: "bg-blue-500/15", ring: "ring-blue-500/20", icon: "🏁", label: "Milestone" },
};

export default function MemoryTimelineCard() {
    // Ideally this comes from useMemoryInsight(), falling back to empty wait state for now
    const timelineEvents = [] as Array<{
        id: string;
        date: string;
        session: string;
        type: "pattern-detected" | "intervention" | "improvement" | "alert" | "milestone";
        event: string;
        detail: string;
        impact?: string;
    }>;

    return (
        <Reveal delay={0.2} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-lg">🧠</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Memory Timeline</h3>
                            <p className="text-xs text-muted">How InsightBoard learned across sessions</p>
                        </div>
                        <Badge variant="default">{timelineEvents.length} events</Badge>
                    </div>

                    <StaggerContainer delay={0.3} stagger={0.1}>
                        <div className="space-y-0">
                            {timelineEvents.length === 0 ? (
                                <div className="glass-card p-4 bg-white/[0.01] border-white/5 text-center">
                                    <p className="text-sm text-muted">Awaiting historical session data...</p>
                                </div>
                            ) : timelineEvents.map((event, i) => {
                                const cfg = typeConfig[event.type];
                                const isLast = i === timelineEvents.length - 1;
                                return (
                                    <StaggerItem key={event.id}>
                                        <div className="relative">
                                            {!isLast && (
                                                <div className="absolute left-[19px] top-[44px] w-0.5 h-[calc(100%-20px)] bg-white/8" />
                                            )}
                                            <div className="flex gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                                                <div className={`w-10 h-10 rounded-xl ${cfg.bg} ring-1 ${cfg.ring} flex items-center justify-center text-base flex-shrink-0 z-10 relative`}>
                                                    {cfg.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-[10px] font-mono text-muted">{event.date}</span>
                                                        <Badge variant={event.type === "alert" ? "danger" : event.type === "improvement" ? "success" : "default"} size="sm">{cfg.label}</Badge>
                                                        <span className="text-[10px] text-muted">{event.session}</span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-foreground mb-0.5">{event.event}</p>
                                                    <p className="text-xs text-muted leading-relaxed">{event.detail}</p>
                                                    {event.impact && (
                                                        <p className="text-[11px] mt-1 text-accent-light font-medium">→ {event.impact}</p>
                                                    )}
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
