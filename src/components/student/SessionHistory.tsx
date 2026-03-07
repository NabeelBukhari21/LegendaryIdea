"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/motion/MotionKit";

export default function SessionHistory() {
    const fallbackSessionHistory = [
        { id: 1, title: "Lecture 5: Backpropagation", date: "Today", slides: 6, avgEngagement: 74, reflections: 1 },
        { id: 2, title: "Lecture 4: Feedforward Networks", date: "Mar 4", slides: 8, avgEngagement: 82, reflections: 0 },
        { id: 3, title: "Lecture 3: Gradient Descent", date: "Feb 28", slides: 7, avgEngagement: 65, reflections: 2 },
    ];

    return (
        <Reveal delay={0.3} duration={0.6}>
            <Card>
                <h3 className="text-lg font-bold text-foreground mb-4">Session History</h3>

                <div className="space-y-3">
                    {fallbackSessionHistory.map((sess) => (
                        <div
                            key={sess.id}
                            className="glass-card p-4 bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">{sess.title}</h4>
                                    <p className="text-xs text-muted">{sess.date} · {sess.slides} slides</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${sess.avgEngagement >= 80 ? "text-success" : sess.avgEngagement >= 60 ? "text-warning" : "text-danger"
                                        }`}>
                                        {sess.avgEngagement}%
                                    </span>
                                </div>
                            </div>
                            <ProgressBar value={sess.avgEngagement} size="sm" />
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant={sess.reflections > 0 ? "success" : "default"} size="sm">
                                    {sess.reflections} reflection{sess.reflections !== 1 ? "s" : ""}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </Reveal>
    );
}
