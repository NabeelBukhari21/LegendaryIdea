"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { StaggerContainer, StaggerItem, AnimatedCounter } from "@/components/motion/MotionKit";
import { useSession } from "@/components/session/SessionEngineProvider";

export default function ClassOverview() {
    const { state, getClassSummary } = useSession();

    const hasLiveData = state.isActive || state.totalEvents > 0;
    const summary = hasLiveData ? getClassSummary() : null;

    const avgEngagement = summary ? summary.avgEngagement : 0;

    const lowestSlide = summary?.weakestSlide
        ? { id: summary.weakestSlide.id, title: summary.weakestSlide.title, engagement: (() => { const a = state.slideAnalytics.get(summary.weakestSlide!.id); return a?.avgEngagement ?? 0; })() }
        : { id: 0, title: "Waiting for slide", engagement: 0 };

    const highestSlide = summary?.strongestSlide
        ? { id: summary.strongestSlide.id, title: summary.strongestSlide.title, engagement: (() => { const a = state.slideAnalytics.get(summary.strongestSlide!.id); return a?.avgEngagement ?? 0; })() }
        : { id: 0, title: "Waiting for slide", engagement: 0 };

    const activeStudents = summary ? summary.studentCount : 0;
    const atRiskCount = summary ? summary.atRiskStudents.length : 0;
    const sessionDuration = hasLiveData ? Math.round((Date.now() - state.startTime) / 60000) : 0;

    const stats = [
        {
            label: "Session Engagement",
            value: <AnimatedCounter value={avgEngagement} suffix="%" duration={1.5} />,
            detail: `${sessionDuration} min · ${state.slides.length} slides`,
            change: hasLiveData ? (state.isActive ? "● Live session" : "Session complete") : "↓ 5% from Session 4",
            changeColor: hasLiveData ? "text-success" : "text-warning",
            color: "text-accent-light",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            ),
            bg: "bg-accent/15",
            ring: "ring-accent/20",
        },
        {
            label: "Biggest Dip",
            value: <AnimatedCounter value={lowestSlide.engagement} suffix="%" duration={1.5} />,
            detail: `Slide ${lowestSlide.id}: ${lowestSlide.title}`,
            change: hasLiveData ? `${summary?.confusionSpikes ?? 0} confusion spikes` : "↓ 37pts from avg",
            changeColor: "text-danger",
            color: "text-danger",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                    <polyline points="17 18 23 18 23 12" />
                </svg>
            ),
            bg: "bg-danger/15",
            ring: "ring-danger/20",
        },
        {
            label: "Peak Engagement",
            value: <AnimatedCounter value={highestSlide.engagement} suffix="%" duration={1.5} />,
            detail: `Slide ${highestSlide.id}: ${highestSlide.title}`,
            change: "Best slide this session",
            changeColor: "text-success",
            color: "text-success",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                </svg>
            ),
            bg: "bg-success/15",
            ring: "ring-success/20",
        },
        {
            label: "Participation",
            value: <AnimatedCounter value={summary?.participationTotal ?? 0} duration={1.5} />,
            detail: `${summary?.handRaiseTotal ?? 0} total hand raises detected`,
            change: hasLiveData ? "Heuristic: Hand + Mouth" : "↑ 12% from last session",
            changeColor: "text-emerald-400",
            color: "text-emerald-400",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
            ),
            bg: "bg-emerald-500/15",
            ring: "ring-emerald-500/20",
        },
        {
            label: "Active Students",
            value: <AnimatedCounter value={activeStudents} duration={1.5} />,
            detail: `${atRiskCount} may benefit from support`,
            change: hasLiveData ? (state.isActive ? "Tracking in real time" : "Session ended") : "All present today",
            changeColor: "text-success",
            color: "text-blue-400",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            bg: "bg-blue-500/15",
            ring: "ring-blue-500/20",
        },
    ];

    return (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" stagger={0.1}>
            {stats.map((stat, i) => (
                <StaggerItem key={i} className="h-full">
                    <Card className="relative overflow-hidden group h-full">
                        <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-11 h-11 rounded-xl ${stat.bg} ring-1 ${stat.ring} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                {i === 1 && <Badge variant="danger" size="sm">⚠ Attention</Badge>}
                                {i === 2 && <Badge variant="success" size="sm">✦ Best</Badge>}
                                {hasLiveData && i === 0 && <Badge variant="success" size="sm">Live</Badge>}
                            </div>
                            <div className={`text-3xl font-extrabold ${stat.color} mb-0.5 tracking-tight`}>{stat.value}</div>
                            <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                            <div className="text-xs text-muted mb-2 line-clamp-1">{stat.detail}</div>
                            <div className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</div>
                        </div>
                    </Card>
                </StaggerItem>
            ))}
        </StaggerContainer>
    );
}
