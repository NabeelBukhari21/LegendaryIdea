"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import Card from "@/components/ui/Card";

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 text-xs border border-accent/20">
                <p className="text-foreground font-semibold mb-1">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color }}>
                        {entry.dataKey === "confusion" ? "Confusion" : "Engagement"}: {entry.value}%
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

export default function TrendChart() {
    const fallbackTrendData = [
        { session: "S1", engagement: 82, confusion: 15 },
        { session: "S2", engagement: 85, confusion: 12 },
        { session: "S3", engagement: 78, confusion: 22 },
        { session: "S4", engagement: 74, confusion: 35 },
        { session: "S5", engagement: 76, confusion: 28 },
    ];
    return (
        <Card className="animate-fade-in-up stagger-1">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-foreground">Cross-Session Trends</h3>
                <p className="text-sm text-muted">Confusion vs engagement over time</p>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fallbackTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="session" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: "12px", color: "#64748b" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="confusion"
                            stroke="#f43f5e"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#f43f5e", stroke: "#0a0e1a", strokeWidth: 2 }}
                            name="Confusion"
                        />
                        <Line
                            type="monotone"
                            dataKey="engagement"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#6366f1", stroke: "#0a0e1a", strokeWidth: 2 }}
                            name="Engagement"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
