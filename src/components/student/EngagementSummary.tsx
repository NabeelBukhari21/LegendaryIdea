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
import { engagementTimeline, session } from "@/data/mockData";
import { Reveal, AnimatedCounter } from "@/components/motion/MotionKit";
import { useSession } from "@/components/session/SessionEngineProvider";

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: { time: string; slide?: number; engagement: number } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        const slideInfo = d.slide ? session.find((s) => s.id === d.slide) : undefined;
        return (
            <div className="glass-card p-3 text-xs border border-accent/20 max-w-[220px]">
                <p className="text-foreground font-semibold">{slideInfo?.title || (d.slide ? `Slide ${d.slide}` : "Session")}</p>
                <p className="text-muted">{d.time}</p>
                <p className={`font-bold text-base mt-1 ${d.engagement < 60 ? "text-danger" : d.engagement < 80 ? "text-warning" : "text-success"}`}>
                    {d.engagement}% engaged
                </p>
            </div>
        );
    }
    return null;
}

export default function EngagementSummary() {
    const { state: sessionState } = useSession();
    const hasLive = sessionState.timelineData.length > 1;
    const chartData = hasLive ? sessionState.timelineData : engagementTimeline;

    const avgEngagement = hasLive ? sessionState.classAvgEngagement : Math.round(
        session.reduce((sum, s) => sum + s.engagement, 0) / session.length
    );

    return (
        <Reveal delay={0.1} duration={0.6}>
            <Card>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Your Engagement Journey</h3>
                        <p className="text-sm text-muted">Session 5 — How your focus flowed through the lecture</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-extrabold gradient-text">
                            <AnimatedCounter value={avgEngagement} />%
                        </div>
                        <div className="text-xs text-muted flex items-center justify-end gap-1.5 mt-1">
                            {hasLive && <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />}
                            {hasLive ? "Live Engagement" : "Session Average"}
                        </div>
                    </div>
                </div>

                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="studentEngGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} interval={4} />
                            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="6 4" strokeOpacity={0.3} />
                            <ReferenceArea x1="30:00" x2="42:00" fill="#f43f5e" fillOpacity={0.05} stroke="#f43f5e" strokeOpacity={0.1} />
                            <Area type="monotone" dataKey="engagement" stroke="#818cf8" strokeWidth={2.5} fill="url(#studentEngGrad)" dot={false} activeDot={{ r: 5, fill: "#818cf8", stroke: "#0a0e1a", strokeWidth: 2 }} animationDuration={1500} animationEasing="ease-out" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-danger/50" />Slide 4 challenge zone</span>
                    <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-warning/50 rounded" />60% threshold</span>
                    <span className="ml-auto text-[10px]">This is your personal view — only you can see it</span>
                </div>
            </Card>
        </Reveal>
    );
}
