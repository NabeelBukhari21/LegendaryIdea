"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { confusionPatterns } from "@/data/mockData";

export default function PatternCard() {
    const topPattern = confusionPatterns[0];

    return (
        <Card className="animate-fade-in-up stagger-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-warning/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center text-warning text-xl">
                        🧠
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Top Pattern to Address</h3>
                        <p className="text-xs text-muted">Most impactful recurring issue</p>
                    </div>
                </div>

                <div className="glass-card p-4 bg-warning/5 border-warning/10 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{topPattern.topic}</h4>
                        <Badge variant="danger">-{topPattern.avgEngagementDrop}% avg drop</Badge>
                    </div>

                    <p className="text-sm text-muted leading-relaxed mb-3">
                        This topic has caused engagement drops in {topPattern.occurrences} of the last 5 sessions.
                        The trend is <strong className="text-danger">increasing</strong>, suggesting students are progressively
                        finding this harder to grasp.
                    </p>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="glass-card p-3 bg-white/[0.02]">
                            <div className="text-lg font-bold text-danger">{topPattern.occurrences}</div>
                            <div className="text-xs text-muted">Occurrences</div>
                        </div>
                        <div className="glass-card p-3 bg-white/[0.02]">
                            <div className="text-lg font-bold text-warning">{topPattern.avgEngagementDrop}%</div>
                            <div className="text-xs text-muted">Avg Drop</div>
                        </div>
                        <div className="glass-card p-3 bg-white/[0.02]">
                            <div className="text-lg font-bold text-accent-light">{topPattern.sessions.length}</div>
                            <div className="text-xs text-muted">Sessions</div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-3 bg-success/5 border-success/10">
                    <p className="text-xs font-semibold text-success mb-1">💡 Recommended Action</p>
                    <p className="text-sm text-muted">{topPattern.suggestedAction}</p>
                </div>
            </div>
        </Card>
    );
}
