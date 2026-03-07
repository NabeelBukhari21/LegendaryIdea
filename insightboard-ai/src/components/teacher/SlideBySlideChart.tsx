"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
} from "recharts";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { slideBarData } from "@/data/mockData";

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: { slide: string; engagement: number; fullLabel: string; isDip: boolean } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="glass-card p-3 text-xs border border-accent/20 max-w-[200px]">
                <p className="text-foreground font-semibold mb-1">{d.fullLabel}</p>
                <p className={`font-bold text-base ${d.isDip ? "text-danger" : d.engagement >= 80 ? "text-success" : "text-warning"}`}>
                    {d.engagement}%
                </p>
                {d.isDip && (
                    <p className="text-danger/80 mt-1">⚠ Engagement breakdown point</p>
                )}
            </div>
        );
    }
    return null;
}

function getBarColor(engagement: number, isDip: boolean): string {
    if (isDip) return "#f43f5e";
    if (engagement >= 80) return "#6366f1";
    return "#f59e0b";
}

export default function SlideBySlideChart() {
    return (
        <Card className="animate-fade-in-up stagger-1">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Slide-by-Slide Engagement</h3>
                    <p className="text-sm text-muted mt-0.5">All 6 slides — Slide 4 is the clear breakdown point</p>
                </div>
                <Badge variant="danger">
                    <span className="w-2 h-2 rounded-full bg-danger animate-pulse-dot inline-block mr-1.5" />
                    Slide 4: 45%
                </Badge>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={slideBarData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis
                            dataKey="slide"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            stroke="#64748b"
                            fontSize={11}
                            tickLine={false}
                            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                            tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                        <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="6 4" strokeOpacity={0.5} />
                        <Bar dataKey="engagement" radius={[8, 8, 2, 2]}>
                            {slideBarData.map((entry, i) => (
                                <Cell
                                    key={`cell-${i}`}
                                    fill={getBarColor(entry.engagement, entry.isDip)}
                                    fillOpacity={entry.isDip ? 1 : 0.7}
                                    stroke={entry.isDip ? "#f43f5e" : "transparent"}
                                    strokeWidth={entry.isDip ? 2 : 0}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Slide labels */}
            <div className="grid grid-cols-6 gap-1 mt-3">
                {slideBarData.map((s, i) => (
                    <div key={i} className={`text-center text-[10px] leading-tight px-1 py-1.5 rounded-lg ${s.isDip ? "bg-danger/10 text-danger font-semibold" : "text-muted"
                        }`}>
                        {s.fullLabel.length > 20 ? s.fullLabel.slice(0, 18) + "…" : s.fullLabel}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-5 mt-3 text-xs text-muted">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent/70" />Normal</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-warning" />Moderate</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-danger" />Breakdown</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-warning rounded" />60% threshold</span>
            </div>
        </Card>
    );
}
