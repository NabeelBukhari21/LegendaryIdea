"use client";
import { formatPercentValue } from "@/lib/formatters";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
} from "recharts";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

interface TrendTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
}

function TrendTooltip({ active, payload, label }: TrendTooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 text-xs border border-accent/20">
                <p className="text-foreground font-semibold mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="font-medium">
                        {p.name}: {formatPercentValue(p.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

export default function CrossSessionTrend() {
    const fallbackTrendData = [
        { session: "S1", engagement: 82, confusion: 15 },
        { session: "S2", engagement: 85, confusion: 12 },
        { session: "S3", engagement: 78, confusion: 22 },
        { session: "S4", engagement: 74, confusion: 35 },
        { session: "S5", engagement: 76, confusion: 28 },
    ];
    const fallbackAtRiskTrend = [
        { session: "S1", atRiskCount: 2, monitoringCount: 4 },
        { session: "S2", atRiskCount: 2, monitoringCount: 3 },
        { session: "S3", atRiskCount: 3, monitoringCount: 5 },
        { session: "S4", atRiskCount: 4, monitoringCount: 6 },
        { session: "S5", atRiskCount: 4, monitoringCount: 7 },
    ];

    return (
        <StaggerContainer delay={0.4} stagger={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Engagement vs Confusion trend */}
                <StaggerItem>
                    <Card className="h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-foreground">Engagement vs Confusion</h3>
                                <p className="text-xs text-muted">Cross-session trend over 5 sessions</p>
                            </div>
                            <Badge variant="warning" size="sm">Diverging ⚠</Badge>
                        </div>
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={fallbackTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis dataKey="session" stroke="#64748b" fontSize={10} tickLine={false} />
                                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `${formatPercentValue(v)}`} />
                                    <Tooltip content={<TrendTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                                    <Line type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1", stroke: "#0a0e1a", strokeWidth: 2 }} name="Engagement" animationDuration={1500} animationEasing="ease-out" />
                                    <Line type="monotone" dataKey="confusion" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: "#f43f5e", stroke: "#0a0e1a", strokeWidth: 2 }} name="Confusion" animationDuration={1500} animationEasing="ease-out" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-warning mt-2">⚠ Engagement is declining while confusion is rising — intervention needed</p>
                    </Card>
                </StaggerItem>

                {/* Support needs trend */}
                <StaggerItem>
                    <Card className="h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-foreground">Support Needs Trend</h3>
                                <p className="text-xs text-muted">Students needing support over time</p>
                            </div>
                            <Badge variant="default" size="sm">21 students</Badge>
                        </div>
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={fallbackAtRiskTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                    <XAxis dataKey="session" stroke="#64748b" fontSize={10} tickLine={false} />
                                    <YAxis domain={[0, 5]} stroke="#64748b" fontSize={10} tickLine={false} />
                                    <Tooltip content={<TrendTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                                    <Bar dataKey="atRiskCount" fill="#f43f5e" fillOpacity={0.7} radius={[4, 4, 0, 0]} name="Extra Support" stackId="a" animationDuration={1000} animationEasing="ease-out" />
                                    <Bar dataKey="monitoringCount" fill="#f59e0b" fillOpacity={0.5} radius={[4, 4, 0, 0]} name="Emerging" stackId="a" animationDuration={1000} animationEasing="ease-out" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-muted mt-2">Based on aggregated engagement patterns — built to support learning, not evaluation</p>
                    </Card>
                </StaggerItem>
            </div>
        </StaggerContainer>
    );
}
