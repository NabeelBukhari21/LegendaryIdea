"use client";
import { formatPercentValue } from "@/lib/formatters";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/MotionKit";
import { useSession } from "@/components/session/SessionEngineProvider";

export default function TopWeakTopicCard() {
    const { state } = useSession();
    const hasLive = state.totalEvents > 0;

    // Fallback empty state for now until cross-session insights are wired to a DB
    const topWeakTopic = {
        topic: "Waiting for historical session data",
        rootCause: "Requires multiple completed sessions to identify recurring weak topics.",
        occurrences: 0,
        avgDrop: 0,
        affectedPercentage: 0,
        historySessions: [] as { session: string; drop: number }[],
        prerequisite: "None"
    };

    return (
        <Reveal delay={0.4} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-36 h-36 bg-danger/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-danger/15 ring-1 ring-danger/20 flex items-center justify-center text-danger">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground">Top Weak Topic</h3>
                            <p className="text-xs text-muted">Biggest recurring engagement challenge</p>
                        </div>
                        <Badge variant="danger">
                            <span className="w-2 h-2 rounded-full bg-danger animate-pulse-dot inline-block mr-1.5" />
                            Critical
                        </Badge>
                    </div>

                    {/* Topic header */}
                    <div className="glass-card p-4 bg-danger/5 border-danger/10 mb-4">
                        <h4 className="text-base font-bold text-foreground mb-1">{topWeakTopic.topic}</h4>
                        <p className="text-xs text-muted leading-relaxed mb-3">{topWeakTopic.rootCause}</p>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center glass-card p-2 bg-white/[0.02]">
                                <div className="text-lg font-extrabold text-danger">{topWeakTopic.occurrences}×</div>
                                <div className="text-[10px] text-muted">Recurrences</div>
                            </div>
                            <div className="text-center glass-card p-2 bg-white/[0.02]">
                                <div className="text-lg font-extrabold text-warning">-{formatPercentValue(topWeakTopic.avgDrop)}</div>
                                <div className="text-[10px] text-muted">Avg Drop</div>
                            </div>
                            <div className="text-center glass-card p-2 bg-white/[0.02]">
                                <div className="text-lg font-extrabold text-accent-light">{formatPercentValue(topWeakTopic.affectedPercentage)}</div>
                                <div className="text-[10px] text-muted">Students Affected</div>
                            </div>
                        </div>
                    </div>

                    {/* History trend */}
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Engagement Drop History</p>
                        <div className="space-y-2">
                            {topWeakTopic.historySessions.map((h, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-xs text-muted w-32 flex-shrink-0">{h.session}</span>
                                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-danger" : "bg-danger/50"}`}
                                            style={{ width: `${h.drop}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-danger font-semibold w-10 text-right">-{formatPercentValue(h.drop)}</span>
                                </div>
                            ))}
                        </div>
                        {topWeakTopic.historySessions.length > 0 && (
                            <p className="text-[10px] text-danger mt-2">⚠ Trend is increasing — drops are getting worse each session</p>
                        )}
                    </div>

                    {/* Prerequisite note */}
                    <div className="glass-card p-3 bg-accent/5 border-accent/10">
                        <p className="text-xs text-muted">
                            <span className="font-semibold text-accent-light">Suggested Prerequisite:</span> {topWeakTopic.prerequisite}
                        </p>
                    </div>
                </div>
            </Card>
        </Reveal>
    );
}
