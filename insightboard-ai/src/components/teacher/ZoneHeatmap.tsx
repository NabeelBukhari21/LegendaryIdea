"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { zoneEngagement } from "@/data/mockData";

function getZoneColor(engagement: number): string {
    if (engagement >= 80) return "from-indigo-500/40 to-indigo-600/20 border-indigo-400/30";
    if (engagement >= 70) return "from-amber-500/30 to-amber-600/15 border-amber-400/25";
    return "from-rose-500/30 to-rose-600/15 border-rose-400/25";
}

function getTextColor(engagement: number): string {
    if (engagement >= 80) return "text-indigo-300";
    if (engagement >= 70) return "text-amber-300";
    return "text-rose-300";
}

function getTrendIcon(trend: "up" | "down" | "stable"): string {
    if (trend === "up") return "↗";
    if (trend === "down") return "↘";
    return "→";
}

export default function ZoneHeatmap() {
    const rows = [
        zoneEngagement.slice(0, 3),  // Front row
        zoneEngagement.slice(3, 6),  // Middle row
        zoneEngagement.slice(6, 9),  // Back row
    ];
    const rowLabels = ["Front", "Middle", "Back"];

    return (
        <Card className="animate-fade-in-up stagger-3 relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Classroom Zone Engagement</h3>
                        <p className="text-sm text-muted mt-0.5">Seating-area aggregated engagement heatmap</p>
                    </div>
                    <Badge variant="info">Presage Zones</Badge>
                </div>

                {/* Classroom visualization */}
                <div className="space-y-2">
                    {/* Whiteboard */}
                    <div className="mx-auto w-3/4 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-[10px] text-muted uppercase tracking-widest">Whiteboard / Screen</span>
                    </div>

                    <div className="space-y-2 mt-4">
                        {rows.map((row, ri) => (
                            <div key={ri} className="flex items-center gap-2">
                                <span className="text-[10px] text-muted w-12 text-right flex-shrink-0">{rowLabels[ri]}</span>
                                <div className="grid grid-cols-3 gap-2 flex-1">
                                    {row.map((zone) => (
                                        <div
                                            key={zone.zone}
                                            className={`relative rounded-xl border bg-gradient-to-br ${getZoneColor(zone.engagement)} p-3 group hover:scale-[1.02] transition-all duration-300 cursor-default`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xl font-extrabold ${getTextColor(zone.engagement)}`}>
                                                    {zone.engagement}%
                                                </span>
                                                <span className={`text-xs ${zone.trend === "down" ? "text-rose-400" : zone.trend === "up" ? "text-emerald-400" : "text-muted"}`}>
                                                    {getTrendIcon(zone.trend)}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-muted">
                                                {zone.students} students
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-4 text-xs text-muted">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-500/50" />80%+</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/40" />70-79%</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/40" />&lt;70%</span>
                    </div>
                    <span className="text-[10px] text-muted italic">Aggregated · not individual tracking</span>
                </div>

                {/* Insight */}
                <div className="mt-4 glass-card p-3 bg-rose-500/5 border-rose-500/10">
                    <p className="text-xs text-muted">
                        <span className="font-semibold text-danger">Back rows averaged 58% engagement</span> — 30 points lower than front rows. Consider adding mid-lecture check-ins or moving to breakout groups to distribute engagement more evenly.
                    </p>
                </div>
            </div>
        </Card>
    );
}
