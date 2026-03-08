"use client";
import { formatPercentValue } from "@/lib/formatters";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceArea,
} from "recharts";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: { time: string; slide: number; engagement: number } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="glass-card p-3 text-xs border border-accent/20">
                <p className="text-foreground font-semibold">Slide {d.slide} · {d.time}</p>
                <p className={`font-bold ${d.engagement < 60 ? "text-danger" : d.engagement < 80 ? "text-warning" : "text-success"}`}>
                    {formatPercentValue(d.engagement)} engaged
                </p>
            </div>
        );
    }
    return null;
}

export default function EngagementOverlay() {
    return (
        <Card className="animate-fade-in-up stagger-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Engagement Curve</h3>
                    <p className="text-sm text-muted">Real-time engagement across the session</p>
                </div>
                <Badge variant="info">MediaPipe</Badge>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[] as any[]} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} interval={4} />
                        <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `${formatPercentValue(v)}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="6 4" strokeOpacity={0.4} />
                        <ReferenceArea x1="30:00" x2="42:00" fill="#f43f5e" fillOpacity={0.06} stroke="#f43f5e" strokeOpacity={0.12} />
                        <Area type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={2} fill="url(#sessionGrad)" dot={false} activeDot={{ r: 4, fill: "#6366f1", stroke: "#0a0e1a", strokeWidth: 2 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger" />Slide 4 dip zone</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-warning rounded" />60% threshold</span>
            </div>
        </Card>
    );
}
