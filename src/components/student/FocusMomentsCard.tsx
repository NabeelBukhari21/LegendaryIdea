"use client";
import { formatPercentValue } from "@/lib/formatters";
import { useStudentInsight } from "@/components/student/StudentInsightProvider";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

export default function FocusMomentsCard() {
    const { studentId } = useStudentInsight();

    const mockFocusByStudent: Record<string, any[]> = {
        "s1": [{ slideId: 5, slideTitle: "Practical Example", engagement: 91, duration: "18 mins", insight: "Highest sustained focus." }],
        "s2": [{ slideId: 2, slideTitle: "Perceptrons & Layers", engagement: 82, duration: "12 mins", insight: "Good initial engagement." }],
        "s3": [{ slideId: 1, slideTitle: "Intro to Neural Networks", engagement: 74, duration: "8 mins", insight: "Lost focus quickly after intro." }],
    };

    const mockDropByStudent: Record<string, any[]> = {
        "s1": [{ slideId: 4, slideTitle: "Derivations", engagement: 42, duration: "14 mins", insight: "Attention wandered soon into the section." }],
        "s2": [{ slideId: 4, slideTitle: "Derivations", engagement: 31, duration: "15 mins", insight: "Significant dropoff during math." }],
        "s3": [{ slideId: 3, slideTitle: "Activation Functions", engagement: 18, duration: "21 mins", insight: "Critical disengagement." }],
    };

    const fallbackFocusMoments = mockFocusByStudent[studentId] || mockFocusByStudent["s1"];
    const fallbackDropOffMoments = mockDropByStudent[studentId] || mockDropByStudent["s1"];

    return (
        <StaggerContainer delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strongest Focus */}
            <StaggerItem>
                <Card className="relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-success/8 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-success/15 ring-1 ring-success/20 flex items-center justify-center text-lg">
                                🌟
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-sm">Your Strongest Moments</h3>
                                <p className="text-[10px] text-muted">When you were most focused</p>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {fallbackFocusMoments.map((m) => (
                                <div key={m.slideId} className="glass-card p-3 bg-success/5 border-success/10">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-foreground">Slide {m.slideId}: {m.slideTitle}</span>
                                        <span className="text-sm font-extrabold text-success">{formatPercentValue(m.engagement)}</span>
                                    </div>
                                    <p className="text-[11px] text-muted leading-relaxed">{m.insight}</p>
                                    <span className="text-[10px] text-muted mt-1 inline-block">{m.duration}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </StaggerItem>

            {/* Drop-off */}
            <StaggerItem>
                <Card className="relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-warning/8 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-warning/15 ring-1 ring-warning/20 flex items-center justify-center text-lg">
                                💪
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-sm">Challenging Moments</h3>
                                <p className="text-[10px] text-muted">Where support can help</p>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {fallbackDropOffMoments.map((m) => (
                                <div key={m.slideId} className={`glass-card p-3 ${m.engagement < 60 ? "bg-danger/5 border-danger/10" : "bg-warning/5 border-warning/10"}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-foreground">Slide {m.slideId}: {m.slideTitle}</span>
                                        <span className={`text-sm font-extrabold ${m.engagement < 60 ? "text-danger" : "text-warning"}`}>{formatPercentValue(m.engagement)}</span>
                                    </div>
                                    <p className="text-[11px] text-muted leading-relaxed">{m.insight}</p>
                                    <span className="text-[10px] text-muted mt-1 inline-block">{m.duration}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </StaggerItem>
        </StaggerContainer>
    );
}
