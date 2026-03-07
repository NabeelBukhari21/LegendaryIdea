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
import { engagementTimeline } from "@/data/mockData";
import { Reveal } from "@/components/motion/MotionKit";
import { useSession } from "@/components/session/SessionEngineProvider";

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: { time: string; slide?: number; engagement: number } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="glass-card p-3 text-xs border border-accent/20">
                {data.slide && <p className="text-foreground font-semibold">Slide {data.slide}</p>}
                <p className="text-muted">{data.time}</p>
                <p className={`font-bold ${data.engagement < 60 ? "text-danger" : data.engagement < 80 ? "text-warning" : "text-success"}`}>
                    {data.engagement}% engaged
                </p>
            </div>
        );
    }
    return null;
}

export default function EngagementChart() {
    const { state: sessionState } = useSession();

    const hasSessionData = sessionState.timelineData.length > 1;
    const chartData = hasSessionData
        ? sessionState.timelineData
        : engagementTimeline;

    return (
        <Reveal delay={0.2} duration={0.6}>
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Session Engagement Timeline</h3>
                        <p className="text-sm text-muted mt-1">Session 5 — Neural Networks Deep Dive</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!hasSessionData && <Badge variant="danger">⚠ Dip on Slide 4</Badge>}
                        <Badge variant={hasSessionData ? "success" : "info"}>
                            {hasSessionData ? "Live Session Data" : "Demo Data"}
                        </Badge>
                    </div>
                </div>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis
                                dataKey="time"
                                stroke="#64748b"
                                fontSize={11}
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
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="6 4" strokeOpacity={0.5} />
                            <ReferenceArea
                                x1="30:00"
                                x2="42:00"
                                fill="#f43f5e"
                                fillOpacity={0.06}
                                stroke="#f43f5e"
                                strokeOpacity={0.15}
                            />
                            <Area
                                type="monotone"
                                dataKey="engagement"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                fill="url(#engGradient)"
                                dot={false}
                                activeDot={{ r: 5, fill: "#6366f1", stroke: "#0a0e1a", strokeWidth: 2 }}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex items-center gap-6 mt-4 text-xs text-muted">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-warning rounded" />
                        <span>60% warning threshold</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-danger/15 border border-danger/30" />
                        <span>Engagement dip zone</span>
                    </div>
                </div>
            </Card>
        </Reveal>
    );
}
