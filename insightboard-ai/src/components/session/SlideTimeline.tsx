"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { session } from "@/data/mockData";

export default function SlideTimeline() {
    const [selectedSlide, setSelectedSlide] = useState<number | null>(4);

    return (
        <Card className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Slide Timeline</h3>
                    <p className="text-sm text-muted">6 slides · ~63 minutes total</p>
                </div>
                <Badge variant="info">Synced via Backboard</Badge>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-white/5" />

                <div className="space-y-3">
                    {session.map((slide) => {
                        const isSelected = selectedSlide === slide.id;
                        const isDip = slide.engagement < 60;

                        return (
                            <div
                                key={slide.id}
                                className={`relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${isSelected
                                        ? "bg-accent/10 border border-accent/20"
                                        : isDip
                                            ? "bg-danger/5 border border-danger/10 hover:bg-danger/8"
                                            : "hover:bg-white/[0.03] border border-transparent"
                                    }`}
                                onClick={() => setSelectedSlide(isSelected ? null : slide.id)}
                            >
                                {/* Timeline dot */}
                                <div
                                    className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${isDip
                                            ? "bg-danger/20 text-danger border border-danger/30"
                                            : isSelected
                                                ? "bg-accent/20 text-accent-light border border-accent/30"
                                                : "bg-white/5 text-muted border border-white/10"
                                        }`}
                                >
                                    {slide.id}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-foreground text-sm truncate">{slide.title}</h4>
                                        {isDip && (
                                            <Badge variant="danger" size="sm">
                                                <span className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-danger inline-block mr-1" />
                                                Engagement Dip
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted mb-2">{slide.topic} · {slide.duration} min</p>
                                    <ProgressBar value={slide.engagement} size="sm" showLabel />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
