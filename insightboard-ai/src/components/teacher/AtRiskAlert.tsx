"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { students } from "@/data/mockData";

export default function AtRiskAlert() {
    const atRiskStudents = students.filter((s) => s.atRisk);
    const lowEngStudents = students.filter((s) => s.avgEngagement < 70 && !s.atRisk);

    return (
        <Card className="animate-fade-in-up stagger-3 relative overflow-hidden">
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
                        <p className="text-xs text-muted">Aggregated engagement signals — not surveillance</p>
                    </div>
                    <Badge variant="danger">{atRiskStudents.length + lowEngStudents.length} flagged</Badge>
                </div>

                {/* At-risk students */}
                <div className="space-y-3 mb-4">
                    {atRiskStudents.map((student) => (
                        <div key={student.id} className="glass-card p-4 bg-danger/5 border-danger/10">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-danger/20 ring-1 ring-danger/30 flex items-center justify-center text-danger text-sm font-bold">
                                        {student.alias.split(" ")[1]?.charAt(0) || "?"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{student.alias}</p>
                                        <p className="text-[10px] text-muted">Anonymized · 3-session trend below threshold</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-extrabold text-danger">{student.avgEngagement}%</p>
                                    <Badge variant="danger" size="sm">At-Risk</Badge>
                                </div>
                            </div>
                            <ProgressBar value={student.avgEngagement} size="sm" />
                            {student.lastReflection && (
                                <div className="mt-2 glass-card p-2 bg-white/[0.02] border-white/5">
                                    <p className="text-[10px] text-muted">
                                        <span className="font-semibold text-foreground">Latest reflection: </span>
                                        <em>&ldquo;{student.lastReflection}&rdquo;</em>
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Monitoring students */}
                {lowEngStudents.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider">Monitoring</p>
                        {lowEngStudents.map((student) => (
                            <div key={student.id} className="glass-card p-3 bg-warning/5 border-warning/10 flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-warning/20 flex items-center justify-center text-warning text-xs font-bold">
                                    {student.alias.split(" ")[1]?.charAt(0) || "?"}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{student.alias}</p>
                                </div>
                                <span className="text-sm font-semibold text-warning">{student.avgEngagement}%</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Class health summary */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="glass-card p-2 bg-success/5 border-success/10">
                        <div className="text-sm font-bold text-success">{students.filter(s => s.avgEngagement >= 80).length}</div>
                        <div className="text-[10px] text-muted">On Track</div>
                    </div>
                    <div className="glass-card p-2 bg-warning/5 border-warning/10">
                        <div className="text-sm font-bold text-warning">{students.filter(s => s.avgEngagement >= 60 && s.avgEngagement < 80).length}</div>
                        <div className="text-[10px] text-muted">Monitoring</div>
                    </div>
                    <div className="glass-card p-2 bg-danger/5 border-danger/10">
                        <div className="text-sm font-bold text-danger">{atRiskStudents.length}</div>
                        <div className="text-[10px] text-muted">Needs Support</div>
                    </div>
                </div>

                <p className="text-[10px] text-muted mt-3 italic">
                    ℹ️ Based on aggregated engagement patterns. No grades or punitive actions. Purpose: identify who could benefit from extra learning support.
                </p>
            </div>
        </Card>
    );
}
