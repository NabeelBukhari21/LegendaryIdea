"use client";
import { formatPercentValue } from "@/lib/formatters";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/motion/MotionKit";
import { useBackboard } from "@/components/backboard/BackboardProvider";
import { useSession } from "@/components/session/SessionEngineProvider";

export default function AtRiskAlert() {
    const { isProcessing, atRiskProfiles } = useBackboard();
    const { state: sessionState, getClassSummary } = useSession();
    const hasLive = sessionState.totalEvents > 0;
    const liveSummary = hasLive ? getClassSummary() : null;
    const lowEngStudents = hasLive
        ? liveSummary!.atRiskStudents.map(s => ({ id: s.id, alias: s.label, avgEngagement: s.score, atRisk: true, lastReflection: null }))
        : [];

    return (
        <Reveal delay={0.3} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-danger/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-danger/15 ring-1 ring-danger/20 flex items-center justify-center text-danger">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground">Students Needing Support</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="info" size="sm">Backboard Target</Badge>
                                <p className="text-xs text-muted">Aggregated engagement patterns</p>
                            </div>
                        </div>
                        <Badge variant="danger">{atRiskProfiles.length + lowEngStudents.length} identified</Badge>
                    </div>

                    {/* Students needing extra support */}
                    <div className="space-y-3 mb-4">
                        {isProcessing ? (
                            <div className="py-8 flex flex-col items-center justify-center space-y-3">
                                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs text-muted animate-pulse">Backboard Agents Processing Risk Profiles...</span>
                            </div>
                        ) : (
                            atRiskProfiles.map((profile) => (
                                <div key={profile.studentId} className="glass-card p-4 bg-danger/5 border-danger/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-danger/20 ring-1 ring-danger/30 flex items-center justify-center text-danger text-sm font-bold">
                                                {profile.alias.split(" ")[1]?.charAt(0) || "?"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{profile.alias}</p>
                                                <p className="text-[10px] text-muted">Anonymized · Multi-session risk analysis</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-extrabold text-danger">{formatPercentValue(100 - profile.riskScore)}</p>
                                            <Badge variant="danger" size="sm">Extra Support</Badge>
                                        </div>
                                    </div>
                                    <ProgressBar value={100 - profile.riskScore} size="sm" />
                                    <div className="mt-2 space-y-1">
                                        {profile.activeFlags.map((flag, idx) => (
                                            <div key={idx} className="flex items-start gap-1.5 text-[10px] text-muted">
                                                <span className="text-danger mt-0.5">•</span>
                                                <span>{flag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Emerging patterns */}
                    {lowEngStudents.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Emerging Patterns</p>
                            {lowEngStudents.map((student) => (
                                <div key={student.id} className="glass-card p-3 bg-warning/5 border-warning/10 flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-warning/20 flex items-center justify-center text-warning text-xs font-bold">
                                        {student.alias.split(" ")[1]?.charAt(0) || "?"}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">{student.alias}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-warning">{formatPercentValue(student.avgEngagement)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Class health summary */}
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className="glass-card p-2 bg-success/5 border-success/10">
                            <div className="text-sm font-bold text-success">{hasLive ? Array.from(sessionState.students.values()).filter(s => s.currentScore >= 80).length : 0}</div>
                            <div className="text-[10px] text-muted">On Track</div>
                        </div>
                        <div className="glass-card p-2 bg-warning/5 border-warning/10">
                            <div className="text-sm font-bold text-warning">{hasLive ? Array.from(sessionState.students.values()).filter(s => s.currentScore >= 60 && s.currentScore < 80).length : 0}</div>
                            <div className="text-[10px] text-muted">Emerging</div>
                        </div>
                        <div className="glass-card p-2 bg-danger/5 border-danger/10">
                            <div className="text-sm font-bold text-danger">{atRiskProfiles.length}</div>
                            <div className="text-[10px] text-muted">Needs Support</div>
                        </div>
                    </div>

                    <p className="text-[10px] text-muted mt-3 italic">
                        ℹ️ Based on aggregated engagement patterns. These insights help identify students who could benefit from additional learning support — never for grading or evaluation.
                    </p>
                </div>
            </Card>
        </Reveal>
    );
}
