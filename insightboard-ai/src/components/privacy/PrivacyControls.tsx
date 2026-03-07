"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";

interface PrivacyToggle {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
    locked?: boolean;
}

const defaultToggles: PrivacyToggle[] = [
    {
        id: "engagement",
        label: "Share Engagement Data",
        description: "Allow aggregated engagement metrics to be included in class-level reports for your teacher.",
        enabled: true,
    },
    {
        id: "reflection",
        label: "Anonymous Reflections",
        description: "Your reflections feed into class-level themes seen by your teacher. Individual responses remain anonymous.",
        enabled: true,
    },
    {
        id: "recap",
        label: "AI Recaps",
        description: "Allow AI to generate personalized recaps based on your engagement patterns.",
        enabled: true,
    },
    {
        id: "memory",
        label: "Cross-Session Memory",
        description: "Allow engagement data to be used for identifying recurring confusion patterns across sessions.",
        enabled: true,
    },
    {
        id: "raw-media",
        label: "Raw Media Collection",
        description: "Raw video/audio for engagement detection. Auto-deleted within 24 hours. Cannot be viewed by teachers.",
        enabled: true,
        locked: true,
    },
    {
        id: "grade",
        label: "Use for Grading",
        description: "Engagement data used to influence grades or academic standing. This is permanently disabled by policy.",
        enabled: false,
        locked: true,
    },
];

export default function PrivacyControls() {
    const [toggles, setToggles] = useState<PrivacyToggle[]>(defaultToggles);

    const handleToggle = (id: string) => {
        setToggles((prev) =>
            prev.map((t) =>
                t.id === id && !t.locked ? { ...t, enabled: !t.enabled } : t
            )
        );
    };

    return (
        <Card className="animate-fade-in-up stagger-2">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">Privacy Controls</h3>
                <p className="text-sm text-muted mt-1">Manage how your data is used. Changes take effect immediately.</p>
            </div>

            <div className="space-y-3">
                {toggles.map((toggle) => (
                    <div
                        key={toggle.id}
                        className={`glass-card p-4 flex items-start gap-4 transition-all ${toggle.locked ? "opacity-70" : ""
                            } ${!toggle.enabled ? "border-white/5" : "border-accent/10 bg-accent/[0.02]"}`}
                    >
                        <button
                            onClick={() => handleToggle(toggle.id)}
                            disabled={toggle.locked}
                            className={`mt-0.5 w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 relative ${toggle.enabled ? "bg-accent" : "bg-white/10"
                                } ${toggle.locked ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${toggle.enabled ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground text-sm">{toggle.label}</h4>
                                {toggle.locked && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted border border-white/10">
                                        {toggle.id === "grade" ? "🚫 Policy Locked" : "🔒 Required"}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted mt-1 leading-relaxed">{toggle.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
