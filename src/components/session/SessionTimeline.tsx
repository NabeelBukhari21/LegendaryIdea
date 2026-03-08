"use client";
import { formatPercentValue } from "@/lib/formatters";

import React from "react";
import Badge from "@/components/ui/Badge";
import { StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";
import { useSession } from "@/components/session/SessionEngineProvider";

export interface EnrichedSlide {
    id: number;
    title: string;
    topic: string;
    engagement: number;
    confusion: number;
    duration: number;
    timeRange: string;
    status: "strong" | "moderate" | "dip" | "recovery" | "peak";
    notes: string;
    marker?: { type: "dip" | "spike" | "recovery" | "peak"; label: string };
    transcript?: string;
    feedbackThemes?: string[];
    teacherNote?: string;
    studentNote?: string;
    recommendation?: string;
}

const statusConfig: Record<string, { color: string; bg: string; border: string; ring: string; label: string }> = {
    strong: { color: "text-success", bg: "bg-success/15", border: "border-success/20", ring: "ring-success/20", label: "Strong" },
    moderate: { color: "text-warning", bg: "bg-warning/15", border: "border-warning/20", ring: "ring-warning/20", label: "Moderate" },
    dip: { color: "text-danger", bg: "bg-danger/15", border: "border-danger/25", ring: "ring-danger/20", label: "Dip" },
    recovery: { color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/20", ring: "ring-blue-500/20", label: "Recovery" },
    peak: { color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20", ring: "ring-emerald-500/20", label: "Peak" },
};

const markerConfig: Record<string, { color: string; bg: string; pulse: boolean }> = {
    dip: { color: "text-danger", bg: "bg-danger", pulse: true },
    spike: { color: "text-warning", bg: "bg-warning", pulse: true },
    recovery: { color: "text-blue-400", bg: "bg-blue-400", pulse: false },
    peak: { color: "text-emerald-400", bg: "bg-emerald-400", pulse: false },
};

interface Props {
    selectedSlide: number;
    onSelectSlide: (id: number) => void;
}

export default function SessionTimeline({ selectedSlide, onSelectSlide }: Props) {
    const { state } = useSession();
    const hasLive = state.totalEvents > 0;

    // Build slide items from session engine or fall back to mockData
    const slideItems: EnrichedSlide[] = hasLive
        ? state.slides.map((slide, i) => {
            const a = state.slideAnalytics.get(slide.id);
            const eng = a?.avgEngagement ?? 0;
            const conf = a ? Math.round((a.states.confused / Math.max(1, a.eventCount)) * 100) : 0;
            const isDip = eng > 0 && eng < 60;
            const isPeak = eng >= 80;
            const isRecovery = a?.recoveryMoment ?? false;
            const status = isDip ? "dip" : isRecovery ? "recovery" : isPeak ? "peak" : eng >= 60 ? "moderate" : "strong";
            return {
                id: slide.id,
                title: slide.title,
                topic: slide.topic,
                engagement: eng,
                confusion: conf,
                duration: slide.durationMin,
                timeRange: `${i * 10}:00 – ${(i + 1) * 10}:00`,
                status,
                notes: slide.summary,
                marker: isDip ? { type: "dip" as const, label: `Dip: ${formatPercentValue(eng)}` } : isPeak ? { type: "peak" as const, label: `Peak: ${formatPercentValue(eng)}` } : isRecovery ? { type: "recovery" as const, label: "Recovery" } : undefined,
            } as unknown as EnrichedSlide;
        })
        : [];

    if (slideItems.length === 0) {
        return (
            <div className="glass-card p-6 text-center border-white/5">
                <p className="text-sm text-muted">Awaiting session data to build the timeline...</p>
            </div>
        );
    }

    return (
        <StaggerContainer delay={0.4} stagger={0.06} className="space-y-0">
            {slideItems.map((slide, i) => {
                const cfg = statusConfig[slide.status];
                const isSelected = selectedSlide === slide.id;
                const isLast = i === slideItems.length - 1;

                return (
                    <StaggerItem key={slide.id}>
                        <div className="relative">
                            {/* Connector line */}
                            {!isLast && (
                                <div className={`absolute left-[23px] top-[56px] w-0.5 h-[calc(100%-32px)] ${slide.status === "dip" ? "bg-gradient-to-b from-danger/40 to-danger/10" : "bg-white/8"
                                    }`} />
                            )}

                            <button
                                onClick={() => onSelectSlide(slide.id)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex gap-4 group relative ${isSelected
                                    ? `${cfg.border} ${cfg.bg.replace('/15', '/8')} ring-1 ${cfg.ring}`
                                    : "border-transparent hover:bg-white/[0.03]"
                                    }`}
                            >
                                {/* Timeline node */}
                                <div className="flex-shrink-0 relative">
                                    <div className={`w-12 h-12 rounded-xl ${cfg.bg} ring-1 ${cfg.ring} flex items-center justify-center transition-all ${isSelected ? "scale-110" : "group-hover:scale-105"
                                        }`}>
                                        <span className={`text-xl font-extrabold ${cfg.color}`}>{slide.id}</span>
                                    </div>
                                    {/* Marker dot */}
                                    {slide.marker && (
                                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${markerConfig[slide.marker.type].bg} flex items-center justify-center ${markerConfig[slide.marker.type].pulse ? "animate-pulse-dot" : ""
                                            }`}>
                                            <span className="text-[8px] text-white font-bold">
                                                {slide.marker.type === "dip" ? "!" : slide.marker.type === "peak" ? "★" : "↗"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className={`text-sm font-bold truncate ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                                            {slide.title}
                                        </h4>
                                    </div>
                                    <p className="text-[11px] text-muted mb-2 truncate">{slide.topic} · {slide.timeRange}</p>

                                    {/* Engagement + confusion mini bars */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <span className="text-[10px] text-muted w-4 flex-shrink-0">E</span>
                                            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                <div className={`h-full rounded-full ${slide.engagement >= 80 ? "bg-success" : slide.engagement >= 60 ? "bg-warning" : "bg-danger"
                                                    }`} style={{ width: `${slide.engagement}%` }} />
                                            </div>
                                            <span className={`text-[10px] font-bold w-8 text-right ${slide.engagement >= 80 ? "text-success" : slide.engagement >= 60 ? "text-warning" : "text-danger"
                                                }`}>{formatPercentValue(slide.engagement)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <span className="text-[10px] text-muted w-4 flex-shrink-0">C</span>
                                            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                <div className={`h-full rounded-full ${slide.confusion <= 15 ? "bg-success/60" : slide.confusion <= 30 ? "bg-warning/60" : "bg-danger/60"
                                                    }`} style={{ width: `${slide.confusion}%` }} />
                                            </div>
                                            <span className={`text-[10px] font-bold w-8 text-right ${slide.confusion <= 15 ? "text-success" : slide.confusion <= 30 ? "text-warning" : "text-danger"
                                                }`}>{formatPercentValue(slide.confusion)}</span>
                                        </div>
                                    </div>

                                    {/* Marker label */}
                                    {slide.marker && (
                                        <div className="mt-2">
                                            <Badge variant={slide.status === "dip" ? "danger" : slide.status === "peak" ? "success" : "default"} size="sm">
                                                {slide.marker.label}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                    </StaggerItem>
                );
            })}

            <StaggerItem>
                <div className="flex items-center gap-3 mt-4 text-[10px] text-muted px-4">
                    <span className="flex items-center gap-1"><span className="font-semibold">E</span> = Engagement</span>
                    <span className="flex items-center gap-1"><span className="font-semibold">C</span> = Confusion</span>
                </div>
            </StaggerItem>
        </StaggerContainer>
    );
}
