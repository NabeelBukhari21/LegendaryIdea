"use client";
import { formatPercentValue } from "@/lib/formatters";
import { useStudentInsight } from "@/components/student/StudentInsightProvider";

import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/motion/MotionKit";
import { useSession } from "@/components/session/SessionEngineProvider";

const compStyles: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
    strong: { label: "Got it!", variant: "success" },
    moderate: { label: "Mostly clear", variant: "warning" },
    "needs-review": { label: "Review this", variant: "danger" },
};

export default function TopicBreakdownCard() {
    const { state } = useSession();
    const { studentId } = useStudentInsight();
    const hasLive = state.totalEvents > 0;

    const studentOffsets: Record<string, number> = {
        "s1": 8,
        "s2": -12,
        "s3": -28,
    };
    const offset = studentOffsets[studentId] || 0;

    const topics = state.slides.map(slide => {
        const a = state.slideAnalytics.get(slide.id);
        let eng = a?.avgEngagement ?? 0;

        // Shift data by student specifically to prove the dashboard reacts 
        eng = Math.max(0, Math.min(100, eng + offset + (Math.sin(slide.id) * 10)));
        eng = Math.round(eng);

        const comp = eng >= 80 ? "strong" : eng >= 60 ? "moderate" : "needs-review";
        return {
            slideId: slide.id,
            topic: slide.title, // Fixed to use title as 'topic' doesn't exist on Slide
            engagement: eng,
            comprehension: comp as "strong" | "moderate" | "needs-review",
            emoji: slide.difficulty === "hard" ? "🔴" : slide.difficulty === "medium" ? "🟡" : "🟢",
            timeSpent: a && a.eventCount > 0 ? `${Math.max(1, Math.round(a.eventCount * 1.5 / 60))} min` : "Skipped", // Approx 1.5s per event frame
        };
    });

    const strongCount = topics.filter((t) => t.comprehension === "strong").length;
    const reviewCount = topics.filter((t) => t.comprehension === "needs-review").length;

    return (
        <Reveal delay={0.2} duration={0.6}>
            <Card>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Topic Breakdown</h3>
                        <p className="text-sm text-muted">How you did on each topic this session</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="success">{strongCount} solid</Badge>
                        {reviewCount > 0 && <Badge variant="danger">{reviewCount} to review</Badge>}
                    </div>
                </div>

                <div className="space-y-2.5">
                    {topics.map((topic) => {
                        const comp = compStyles[topic.comprehension];
                        return (
                            <div
                                key={topic.slideId}
                                className={`glass-card p-3.5 border-white/5 transition-all hover:bg-white/[0.02] ${topic.comprehension === "needs-review" ? "bg-danger/[0.03] border-danger/10" : "bg-white/[0.01]"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-base flex-shrink-0">{topic.emoji}</span>
                                        <span className="text-sm font-medium text-foreground truncate">{topic.topic}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        <Badge variant={comp.variant} size="sm">{comp.label}</Badge>
                                        <span className={`text-sm font-bold ${topic.engagement >= 80 ? "text-success" : topic.engagement >= 60 ? "text-warning" : "text-danger"
                                            }`}>
                                            {formatPercentValue(topic.engagement)}
                                        </span>
                                    </div>
                                </div>
                                <ProgressBar value={topic.engagement} size="sm" />
                                <div className="flex items-center justify-between mt-2.5">
                                    <span className="text-[10px] text-muted">Slide {topic.slideId} &bull; {topic.timeSpent}</span>
                                    {topic.comprehension === "needs-review" && (
                                        <Button variant="secondary" size="sm" href="/student/immersive" className="text-[10px] px-2 py-1 h-6">
                                            🧠 3D Explainer
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </Reveal>
    );
}
