"use client";

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
import { Reveal } from "@/components/motion/MotionKit";
import { useSession } from "@/components/session/SessionEngineProvider";

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: { time: string; slide?: number; engagement: number } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        // In a real app we'd fetch the slide dynamically
        const slideInfo = undefined as { topic: string; title: string } | undefined;
        return (
            <div className="glass-card p-3 text-xs border border-accent/20">
                <p className="text-foreground font-semibold">{slideInfo?.title || (d.slide ? `Slide ${d.slide}` : "Session")}</p>
                <p className="text-muted">{d.time}</p>
                <p className={`font-bold text-base mt-1 ${d.engagement < 60 ? "text-danger" : d.engagement < 80 ? "text-warning" : "text-success"}`}>
                    {d.engagement}%
                </p>
            </div>
        );
    }
    return null;
}

// Slide boundary markers
const slideBoundaries = [
    { time: "8:00", label: "S2" },
    { time: "18:00", label: "S3" },
    { time: "30:00", label: "S4" },
    { time: "44:00", label: "S5" },
    { time: "54:00", label: "S6" },
];

export default function SessionEngagementChart() {
    const { state: sessionState } = useSession();
    const hasLive = sessionState.timelineData.length > 1;
    const chartData = hasLive ? sessionState.timelineData : [];

    return (
        <Reveal delay={0.2} duration={0.6}>
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Session Engagement Curve</h3>
                        <p className="text-sm text-muted">Engagement mapped to content timeline</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="default" size="sm">Live Analysis</Badge>
                        <Badge variant="default" size="sm">{hasLive ? "Live" : "63 min"}</Badge>
                    </div>
                </div>

                <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="sessionEngGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} interval={4} />
                            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="6 4" strokeOpacity={0.3} label={{ value: "Threshold", position: "insideTopLeft", fill: "#f59e0b", fontSize: 9, opacity: 0.6 }} />
                            <ReferenceArea x1="30:00" x2="42:00" fill="#f43f5e" fillOpacity={0.06} stroke="#f43f5e" strokeOpacity={0.15} label={{ value: "⚠ Slide 4 Dip", position: "insideTop", fill: "#f43f5e", fontSize: 9, opacity: 0.8 }} />
                            {slideBoundaries.map((b) => (
                                <ReferenceLine key={b.time} x={b.time} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" label={{ value: b.label, position: "top", fill: "#64748b", fontSize: 9 }} />
                            ))}
                            <Area
                                type="monotone"
                                dataKey="engagement"
                                stroke="#818cf8"
                                strokeWidth={2.5}
                                fill="url(#sessionEngGrad)"
                                dot={false}
                                activeDot={{ r: 5, fill: "#818cf8", stroke: "#0a0e1a", strokeWidth: 2 }}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex items-center gap-5 mt-3 text-xs text-muted">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-accent/50" />Engagement</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-danger/30" />Slide 4 dip zone</span>
                    <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-warning/40 rounded" />60% threshold</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-white/10 rounded" />Slide boundaries</span>
                </div>
            </Card>
        </Reveal>
    );
}
