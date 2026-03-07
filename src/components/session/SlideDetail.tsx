"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function SlideDetail() {
    // Ideally this comes from useSession() or an insight provider, using empty fallback state for now
    const fallbackSlide = { id: 4, title: "Awaiting Session...", topic: "Topic...", duration: 0, engagement: 0, notes: "Wait for session summary." };
    const slide = fallbackSlide;
    const reflection = null as { reason: string } | null;
    const aiRecap = { simplerExplanation: "Gemini will generate a simpler explanation here once the session concludes.", keyTakeaways: [] };

    return (
        <Card className="animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Slide Detail</h3>
                <Badge variant="danger">Slide {slide.id}</Badge>
            </div>

            {/* Slide info */}
            <div className="glass-card p-4 bg-danger/5 border-danger/10 mb-4">
                <h4 className="font-semibold text-foreground mb-1">{slide.title}</h4>
                <p className="text-sm text-muted mb-2">{slide.topic}</p>
                <div className="flex items-center gap-4 text-xs text-muted">
                    <span>{slide.duration} minutes</span>
                    <span className="text-danger font-semibold">{slide.engagement}% engagement</span>
                </div>
                <p className="text-xs text-muted mt-2 italic">{slide.notes}</p>
            </div>

            {/* Student reflection */}
            {reflection && (
                <div className="glass-card p-4 bg-accent/5 border-accent/10 mb-4">
                    <p className="text-xs font-semibold text-accent-light uppercase tracking-wider mb-2">Student Reflection (Anonymized)</p>
                    <p className="text-sm text-foreground leading-relaxed italic">
                        &ldquo;{reflection.reason}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="success" size="sm">Helpful</Badge>
                        <span className="text-xs text-muted">Submitted voluntarily</span>
                    </div>
                </div>
            )}

            {/* AI recap preview */}
            <div className="glass-card p-4 bg-success/5 border-success/10">
                <p className="text-xs font-semibold text-success uppercase tracking-wider mb-2">
                    ✨ AI Recap Available
                </p>
                <p className="text-sm text-muted leading-relaxed line-clamp-3">
                    {aiRecap.simplerExplanation}
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <Badge variant="success" size="sm">Gemini</Badge>
                    <span className="text-xs text-muted">{aiRecap.keyTakeaways.length} key takeaways</span>
                </div>
            </div>
        </Card>
    );
}
