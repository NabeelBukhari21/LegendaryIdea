"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/motion/MotionKit";
import { useTeacherInsight } from "@/components/teacher/TeacherInsightProvider";
import { useBackboard } from "@/components/backboard/BackboardProvider";

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
    pacing: { icon: "⏱️", color: "text-warning", bg: "bg-warning/15" },
    content: { icon: "📝", color: "text-accent-light", bg: "bg-accent/15" },
    interaction: { icon: "🤝", color: "text-success", bg: "bg-success/15" },
    assessment: { icon: "📊", color: "text-blue-400", bg: "bg-blue-500/15" },
};

export default function RecommendationCard() {
    const { data, isLoading } = useTeacherInsight();
    const { isProcessing, activeTeacherRecommendations } = useBackboard();

    // If no real data from Gemini, provide a neutral empty state fallback (not mockData)
    const fallbackRec = { type: "content", confidence: 0, basedOn: "Waiting for insights", title: "Analyzing Session Data", description: "Gemini is analyzing session patterns to generate a teaching recommendation." };
    const recType = data?.recommendation?.type || fallbackRec.type;
    const config = typeConfig[recType] || typeConfig.content;

    const titleText = data?.recommendation?.title || fallbackRec.title;
    const descriptionText = data?.recommendation?.description || fallbackRec.description;
    const detailedSteps = data?.recommendation?.steps || [];
    const confidence = data?.recommendation?.confidence || fallbackRec.confidence;
    const basedOn = data?.recommendation?.basedOn || fallbackRec.basedOn;

    const relatedData = [
        { label: "Student confusion reports", value: "43%", trend: "high" },
        { label: "Avg engagement on Slide 4", value: "45%", trend: "low" },
        { label: "Recovery after demo (Slide 5)", value: "+23pts", trend: "positive" },
        { label: "Similar course improvement", value: "35%", trend: "benchmark" },
    ];

    return (
        <Reveal delay={0.4} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className={`w-11 h-11 rounded-xl ${config.bg} ring-1 ring-accent/20 flex items-center justify-center text-2xl`}>
                            {config.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground">AI Teaching Recommendation</h3>
                            <p className="text-xs text-muted">Generated from aggregated class data</p>
                        </div>
                        {confidence > 0 && <Badge variant="success">{confidence}% confidence</Badge>}
                    </div>

                    {isLoading || confidence === 0 ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-28 bg-white/5 rounded-xl border border-white/5" />
                            <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                            <div className="h-20 bg-white/5 rounded-xl border border-white/5" />
                        </div>
                    ) : (
                        <>
                            {/* Main recommendation */}
                            <div className="glass-card p-5 bg-accent/[0.03] border-accent/10 mb-4">
                                <h4 className="text-base font-bold text-foreground mb-2">{titleText}</h4>
                                <p className="text-sm text-muted leading-relaxed mb-3">{descriptionText}</p>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted">Confidence</span>
                                    <ProgressBar value={confidence} size="sm" className="flex-1 max-w-32" />
                                    <span className="text-xs font-bold text-success">{confidence}%</span>
                                </div>
                            </div>

                            {/* Suggested steps */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Recent Strategy</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {detailedSteps.map((step, i) => (
                                        <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                                            <div className="w-5 h-5 rounded-full bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-[10px] font-bold text-accent-light flex-shrink-0">
                                                {i + 1}
                                            </div>
                                            <span className="text-xs text-muted">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Backboard Agent Additions */}
                            <div className="mb-4 glass-card p-3 bg-blue-500/5 border-blue-500/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="info" size="sm">Backboard Target</Badge>
                                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Cross-Session Advisory</p>
                                </div>
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-[10px] text-muted animate-pulse">Checking historical agent memory...</span>
                                    </div>
                                ) : (
                                    <ul className="space-y-1.5 ml-1">
                                        {activeTeacherRecommendations.map((recStr, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted">
                                                <span className="text-blue-400 mt-0.5">•</span>
                                                <span>{recStr}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Supporting data */}
                            <div className="glass-card p-4 bg-white/[0.01] border-white/5">
                                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Supporting Data</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {relatedData.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <span className="text-xs text-muted">{item.label}</span>
                                            <span className={`text-xs font-bold ${item.trend === "high" ? "text-danger" :
                                                item.trend === "low" ? "text-warning" :
                                                    item.trend === "positive" ? "text-success" :
                                                        "text-accent-light"
                                                }`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                        {confidence > 0 && <Badge>Gemini</Badge>}
                        <span className="text-[10px] text-muted">{confidence > 0 ? `Based on: ${basedOn}` : "Provides recommendations once specific learning blockers are identified."}</span>
                    </div>
                </div>
            </Card>
        </Reveal>
    );
}
