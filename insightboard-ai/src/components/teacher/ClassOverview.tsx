"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { session, students } from "@/data/mockData";

export default function ClassOverview() {
    const avgEngagement = Math.round(
        session.reduce((sum, s) => sum + s.engagement, 0) / session.length
    );
    const lowestSlide = session.reduce((min, s) => (s.engagement < min.engagement ? s : min), session[0]);
    const highestSlide = session.reduce((max, s) => (s.engagement > max.engagement ? s : max), session[0]);
    const activeStudents = students.length;
    const atRiskCount = students.filter((s) => s.atRisk).length;
    const totalReflections = students.filter((s) => s.lastReflection).length;
    const sessionDuration = session.reduce((sum, s) => sum + s.duration, 0);

    const stats = [
        {
            label: "Session Engagement",
            value: `${avgEngagement}%`,
            detail: `${sessionDuration} min · 6 slides`,
            change: "↓ 5% from Session 4",
            changeColor: "text-warning",
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
            value: `${lowestSlide.engagement}%`,
            detail: `Slide ${lowestSlide.id}: ${lowestSlide.title}`,
            change: "↓ 37pts from avg",
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
            value: `${highestSlide.engagement}%`,
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
            label: "Active Students",
            value: `${activeStudents}`,
            detail: `${atRiskCount} needs support · ${totalReflections} reflections`,
            change: "All present today",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <Card key={i} className={`animate-fade-in-up relative overflow-hidden group`} hover={true}>
                    {/* Glow accent */}
                    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />

                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-11 h-11 rounded-xl ${stat.bg} ring-1 ${stat.ring} flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                            {i === 1 && <Badge variant="danger" size="sm">⚠ Alert</Badge>}
                            {i === 2 && <Badge variant="success" size="sm">✦ Best</Badge>}
                        </div>

                        <div className={`text-3xl font-extrabold ${stat.color} mb-0.5 tracking-tight`}>
                            {stat.value}
                        </div>
                        <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                        <div className="text-xs text-muted mb-2 line-clamp-1">{stat.detail}</div>
                        <div className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
