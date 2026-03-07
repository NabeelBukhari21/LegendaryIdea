"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { session } from "@/data/mockData";

export default function EngagementSummary() {
    const avgEngagement = Math.round(
        session.reduce((sum, s) => sum + s.engagement, 0) / session.length
    );

    return (
        <Card className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Your Engagement</h3>
                    <p className="text-sm text-muted">Session 5 — Neural Networks Deep Dive</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">{avgEngagement}%</div>
                    <div className="text-xs text-muted">Average</div>
                </div>
            </div>

            <div className="space-y-3">
                {session.map((slide) => (
                    <div key={slide.id}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted w-16">Slide {slide.id}</span>
                                <span className="text-xs text-foreground truncate max-w-[200px]">{slide.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {slide.engagement < 60 && <Badge variant="danger" size="sm">Dip</Badge>}
                                <span className={`text-xs font-semibold ${slide.engagement >= 80 ? "text-success" : slide.engagement >= 60 ? "text-warning" : "text-danger"
                                    }`}>
                                    {slide.engagement}%
                                </span>
                            </div>
                        </div>
                        <ProgressBar value={slide.engagement} size="sm" />
                    </div>
                ))}
            </div>
        </Card>
    );
}
