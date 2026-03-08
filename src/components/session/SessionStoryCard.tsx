"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

export default function SessionStoryCard() {
    const storyBeats = [
        {
            time: "0:00",
            event: "Session starts strong",
            detail: "Visual brain analogy hooks the class. 87% engagement.",
            type: "positive" as const,
            icon: "🟢",
        },
        {
            time: "18:00",
            event: "Complexity increases",
            detail: "Multi-layer concepts start to stretch some students. Slight dip to 78%.",
            type: "neutral" as const,
            icon: "🟡",
        },
        {
            time: "30:00",
            event: "⚠ Breakdown at Slide 4",
            detail: "Backpropagation math hits. Engagement crashes to 45%. Confusion spikes to 62%. 43% of students report 'too fast.'",
            type: "negative" as const,
            icon: "🔴",
        },
        {
            time: "45:00",
            event: "Live demo triggers recovery",
            detail: "Hands-on demo restores engagement to 68%. Students re-engage when they see theory in action.",
            type: "recovery" as const,
            icon: "🔵",
        },
        {
            time: "55:00",
            event: "Real-world examples close strong",
            detail: "Relatable examples push engagement to 91% — above the opening. Full recovery achieved.",
            type: "positive" as const,
            icon: "🟢",
        },
    ];

    const typeStyles = {
        positive: "border-success/15 bg-success/5",
        neutral: "border-warning/15 bg-warning/5",
        negative: "border-danger/15 bg-danger/5",
        recovery: "border-blue-500/15 bg-blue-500/5",
    };

    return (
        <Reveal delay={0.3} duration={0.6}>
            <Card>
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-lg">
                            📖
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground">Session Story</h3>
                            <p className="text-xs text-muted">The key moments at a glance</p>
                        </div>
                    </div>
                    <Badge variant="default">Powered by Gemini & MediaPipe</Badge>
                </div>

                <StaggerContainer delay={0.4}>
                    <div className="space-y-2">
                        {storyBeats.map((beat, i) => (
                            <StaggerItem key={i}>
                                <div className={`glass-card p-3.5 ${typeStyles[beat.type]} transition-all hover:scale-[1.01]`}>
                                    <div className="flex items-start gap-3">
                                        <span className="text-base mt-0.5 flex-shrink-0">{beat.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[10px] font-mono text-muted">{beat.time}</span>
                                                <span className="text-sm font-semibold text-foreground">{beat.event}</span>
                                            </div>
                                            <p className="text-xs text-muted leading-relaxed">{beat.detail}</p>
                                        </div>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            </Card>
        </Reveal>
    );
}
