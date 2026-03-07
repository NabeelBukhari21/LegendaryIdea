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
import { Reveal } from "@/components/motion/MotionKit";
import { useSession } from "@/components/session/SessionEngineProvider";

interface BarItem {
    slide: string;
    engagement: number;
    fullLabel: string;
    isDip: boolean;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: BarItem }>;
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
                {d.isDip && <p className="text-danger/80 mt-1">⚠ Engagement breakdown point</p>}
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
    const { state } = useSession();
    const hasLive = state.totalEvents > 0;

    // Build bar data from session engine strictly
    const data: BarItem[] = state.slides.map(slide => {
        const a = state.slideAnalytics.get(slide.id);
        const eng = a?.avgEngagement ?? 0;
        return {
            slide: `S${slide.id}`,
            engagement: eng,
            fullLabel: slide.title,
            isDip: eng > 0 && eng < 60,
        };
    });

    // Find lowest slide for badge
    const lowestLive = hasLive
        ? data.reduce((min, d) => (d.engagement > 0 && d.engagement < min.engagement ? d : min), { ...data[0], engagement: 100 })
        : null;

    return (
        <Reveal delay={0.1} duration={0.6}>
            <Card>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Slide-by-Slide Engagement</h3>
                        <p className="text-sm text-muted mt-0.5">
                            {hasLive ? "Live session data" : "All 6 slides — Slide 4 is the clear breakdown point"}
                        </p>
                    </div>
                    {hasLive && lowestLive && lowestLive.engagement < 60 ? (
                        <Badge variant="danger">
                            <span className="w-2 h-2 rounded-full bg-danger animate-pulse-dot inline-block mr-1.5" />
                            {lowestLive.slide}: {lowestLive.engagement}%
                        </Badge>
                    ) : !hasLive ? (
                        <Badge variant="info">Waiting for Start</Badge>
                    ) : (
                        <Badge variant="success">Live</Badge>
                    )}
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="slide" stroke="#64748b" fontSize={12} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickFormatter={(v) => `${v}%`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="6 4" strokeOpacity={0.5} />
                            <Bar dataKey="engagement" radius={[8, 8, 2, 2]} animationDuration={1500} animationEasing="ease-out">
                                {data.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={getBarColor(entry.engagement, entry.isDip)} fillOpacity={entry.isDip ? 1 : 0.7} stroke={entry.isDip ? "#f43f5e" : "transparent"} strokeWidth={entry.isDip ? 2 : 0} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-6 gap-1 mt-3">
                    {data.map((s, i) => (
                        <div key={i} className={`text-center text-[10px] leading-tight px-1 py-1.5 rounded-lg ${s.isDip ? "bg-danger/10 text-danger font-semibold" : "text-muted"}`}>
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
        </Reveal>
    );
}
