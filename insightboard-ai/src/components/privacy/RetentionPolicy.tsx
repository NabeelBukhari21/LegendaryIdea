"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { retentionPolicies } from "@/data/mockData";

export default function RetentionPolicy() {
    return (
        <Card className="animate-fade-in-up">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">Data Retention Policies</h3>
                <p className="text-sm text-muted mt-1">How long we keep your data — and what happens after</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {retentionPolicies.map((policy) => (
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
