"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { confusionPatterns } from "@/data/mockData";

export default function ConfusionPatterns() {
    return (
        <Card className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Recurring Confusion Patterns</h3>
                    <p className="text-sm text-muted">Aggregated across past sessions</p>
                </div>
                <Badge variant="warning">{confusionPatterns.length} patterns</Badge>
            </div>

            <div className="space-y-4">
                {confusionPatterns.map((pattern) => (
                    <div key={pattern.id} className="glass-card p-5 bg-white/[0.02] border-white/5">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-semibold text-foreground text-base">{pattern.topic}</h4>
                                <p className="text-xs text-muted mt-0.5">{pattern.occurrences} occurrences across sessions</p>
                            </div>
                            <Badge
                                variant={
                                    pattern.trend === "increasing" ? "danger" : pattern.trend === "decreasing" ? "success" : "warning"
                                }
                            >
                                {pattern.trend === "increasing" ? "↗ Increasing" : pattern.trend === "decreasing" ? "↘ Decreasing" : "→ Stable"}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-danger font-semibold">-{pattern.avgEngagementDrop}%</span>
                            <span className="text-xs text-muted">avg engagement drop</span>
                        </div>

                        {/* Sessions */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {pattern.sessions.map((sess, i) => (
                                <Badge key={i} variant="default" size="sm">{sess}</Badge>
                            ))}
                        </div>

                        {/* Suggested action */}
                        <div className="glass-card p-3 bg-success/5 border-success/10">
                            <p className="text-xs font-semibold text-success mb-1">💡 Suggested Action</p>
                            <p className="text-sm text-muted">{pattern.suggestedAction}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
