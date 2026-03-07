"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function RetentionPolicy() {
    const fallbackRetentionPolicies = [
        { id: "rp1", dataType: "Video Feed", retention: "Processed locally", autoDelete: true, description: "Raw video frames never leave your device. Engagement metrics are extracted client-side and frames are discarded immediately.", icon: "🎥" },
        { id: "rp2", dataType: "Engagement Metrics", retention: "30 days", autoDelete: true, description: "Aggregated, anonymized engagement scores are temporarily stored to generate insights, then auto-deleted after 30 days.", icon: "📊" },
        { id: "rp3", dataType: "Student Identifying Data", retention: "Anonymized", autoDelete: true, description: "Students are assigned random aliases (e.g. Student Alpha). We do not store names, emails, or personal identifiers.", icon: "🎭" }
    ];
    return (
        <Card className="animate-fade-in-up">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">Data Retention Policies</h3>
                <p className="text-sm text-muted mt-1">How long we keep your data — and what happens after</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {fallbackRetentionPolicies.map((policy) => (
                    <div key={policy.id} className="glass-card p-4 bg-white/[0.02] border-white/5 group hover:border-accent/15 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{policy.icon}</span>
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground text-sm">{policy.dataType}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant={policy.autoDelete ? "success" : "warning"} size="sm">
                                        {policy.retention}
                                    </Badge>
                                    {policy.autoDelete && (
                                        <Badge variant="success" size="sm">Auto-delete</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted leading-relaxed">{policy.description}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
