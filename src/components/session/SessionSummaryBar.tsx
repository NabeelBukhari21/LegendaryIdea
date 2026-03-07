"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";
import { useSession } from "@/components/session/SessionEngineProvider";

export default function SessionSummaryBar() {
    const { state } = useSession();
    const hasLive = state.totalEvents > 0;

    let avgEngagement: number, avgConfusion: number, totalDuration: number;
    let dipSlideLabel: string, peakSlideLabel: string;
    const slideCount = state.slides.length;

    if (hasLive) {
        // Compute from live session data
        const analytics = Array.from(state.slideAnalytics.values()).filter(a => a.eventCount > 0);
        avgEngagement = analytics.length > 0
            ? Math.round(analytics.reduce((s, a) => s + a.avgEngagement, 0) / analytics.length)
            : state.classAvgEngagement;
        avgConfusion = analytics.length > 0
            ? Math.round(analytics.reduce((s, a) => s + (a.confusionSpikes > 0 ? (a.states.confused / Math.max(1, a.eventCount)) * 100 : 0), 0) / analytics.length)
            : 0;
        totalDuration = Math.round((Date.now() - state.startTime) / 60000);

        let minAvg = 100, maxAvg = 0, dipId = 0, peakId = 0;
        analytics.forEach(a => {
            if (a.avgEngagement < minAvg) { minAvg = a.avgEngagement; dipId = a.slideId; }
            if (a.avgEngagement > maxAvg) { maxAvg = a.avgEngagement; peakId = a.slideId; }
        });
        dipSlideLabel = analytics.length > 0 ? `S${dipId}: ${minAvg}%` : "N/A";
        peakSlideLabel = analytics.length > 0 ? `S${peakId}: ${maxAvg}%` : "N/A";
    } else {
        avgEngagement = 0;
        avgConfusion = 0;
        totalDuration = 0;
        dipSlideLabel = "N/A";
        peakSlideLabel = "N/A";
    }

    const stats = [
        { label: hasLive ? "Live Avg" : "Session Avg", value: `${avgEngagement}%`, color: "text-accent-light", icon: "📊" },
        { label: "Duration", value: `${totalDuration} min`, color: "text-foreground", icon: "⏱️" },
        { label: "Slides", value: `${slideCount}`, color: "text-foreground", icon: "📄" },
        { label: "Biggest Dip", value: dipSlideLabel, color: "text-danger", icon: "📉" },
        { label: "Peak", value: peakSlideLabel, color: "text-success", icon: "📈" },
        { label: "Confusion", value: hasLive ? `${state.confusionSpikes}` : `${avgConfusion}%`, color: avgConfusion > 25 || state.confusionSpikes > 3 ? "text-warning" : "text-success", icon: "🤔" },
    ];

    return (
        <StaggerContainer delay={0.1} stagger={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {stats.map((stat, i) => (
                    <StaggerItem key={i}>
                        <Card className="text-center py-3 px-2" hover>
                            <span className="text-lg mb-1 block">{stat.icon}</span>
                            <div className={`text-xl font-extrabold ${stat.color} mb-0.5`}>{stat.value}</div>
                            <div className="text-[10px] text-muted">{stat.label}</div>
                        </Card>
                    </StaggerItem>
                ))}
            </div>
        </StaggerContainer>
    );
}
