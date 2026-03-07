"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { aiRecap } from "@/data/mockData";

export default function AIRecapCard() {
    return (
        <Card className="animate-fade-in-up stagger-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-success/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center text-success">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-foreground">AI Recap: {aiRecap.topic}</h3>
                        <p className="text-xs text-muted">Slide {aiRecap.slideId} — Simpler explanation</p>
                    </div>
                    <Badge variant="success">
                        <span className="mr-1">✨</span>{aiRecap.poweredBy}
                    </Badge>
                </div>

                {/* Original vs Simple */}
                <div className="space-y-4">
                    <div className="glass-card p-4 bg-white/[0.02] border-white/5">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Original Explanation</p>
                        <p className="text-sm text-muted leading-relaxed">{aiRecap.originalExplanation}</p>
                    </div>

                    <div className="glass-card p-4 bg-success/5 border-success/10">
                        <p className="text-xs font-semibold text-success uppercase tracking-wider mb-2">✨ Simpler Explanation</p>
                        <p className="text-sm text-foreground leading-relaxed">{aiRecap.simplerExplanation}</p>
                    </div>
                </div>

                {/* Key Takeaways */}
                <div className="mt-4">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Key Takeaways</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {aiRecap.keyTakeaways.map((takeaway, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                                <span className="text-muted">{takeaway}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
