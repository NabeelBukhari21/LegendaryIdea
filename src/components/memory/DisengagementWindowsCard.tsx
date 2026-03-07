"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

export default function DisengagementWindowsCard() {
    const fallbackDisengagementWindows = [
        { id: "dw1", window: "30-45 mins", avgDrop: 32, sessions: ["S5", "S4", "S2"], triggerType: "Sustained Theoretical Content", description: "Engagement drops below 60% when theoretical explanations exceed 12 minutes without interactive elements." },
        { id: "dw2", window: "First 5 mins", avgDrop: 15, sessions: ["S3", "S1"], triggerType: "Delayed Start", description: "Students take longer to settle when the session starts with administrative/housekeeping slides." },
    ];
    return (
        <Reveal delay={0.3} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-36 h-36 bg-warning/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-warning/15 ring-1 ring-warning/20 flex items-center justify-center text-lg">⏱️</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Disengagement Windows</h3>
                            <p className="text-xs text-muted">When and why engagement consistently drops</p>
                        </div>
                    </div>

                    <StaggerContainer delay={0.4}>
                        <div className="space-y-3">
                            {fallbackDisengagementWindows.map((dw, index) => (
                                <StaggerItem key={dw.id}>
                                    <div className={`glass-card p-4 transition-all hover:bg-white/[0.02] ${dw.avgDrop >= 30 ? "border-danger/10 bg-danger/[0.03]" : "border-white/5"
                                        }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-foreground">{dw.window}</span>
                                                <Badge variant={dw.avgDrop >= 30 ? "danger" : dw.avgDrop >= 10 ? "warning" : "default"} size="sm">
                                                    -{dw.avgDrop}% avg
                                                </Badge>
                                            </div>
                                            <Badge size="sm">{dw.sessions.length} sessions</Badge>
                                        </div>
                                        <p className="text-[11px] text-muted mb-2">
                                            <span className="font-semibold text-foreground">Trigger:</span> {dw.triggerType}
                                        </p>
                                        <p className="text-xs text-muted leading-relaxed">{dw.description}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {dw.sessions.map((s, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted">{s}</span>
                                            ))}
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
