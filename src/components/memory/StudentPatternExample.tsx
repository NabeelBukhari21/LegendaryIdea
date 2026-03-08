"use client";
import { formatPercentValue } from "@/lib/formatters";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem, AnimatedCounter } from "@/components/motion/MotionKit";

export default function StudentPatternExample() {
    return (
        <Reveal delay={0.3} duration={0.6}>
            <Card className="relative overflow-hidden h-full">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-lg">👤</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground">Student-Level Pattern Example</h3>
                            <p className="text-xs text-muted">Anonymized recurring pattern for one student</p>
                        </div>
                        <Badge size="sm">Anonymized</Badge>
                    </div>

                    <div className="glass-card p-4 bg-accent/[0.03] border-accent/10 mb-4 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-danger/15 ring-1 ring-danger/20 flex items-center justify-center text-danger font-bold text-sm">G</div>
                            <div>
                                <p className="text-sm font-bold text-foreground">Student Gamma</p>
                                <p className="text-[10px] text-muted">3-session recurring pattern</p>
                            </div>
                            <div className="ml-auto">
                                <Badge variant="warning" size="sm">May Benefit from Support</Badge>
                            </div>
                        </div>

                        <p className="text-sm text-muted leading-relaxed mb-3">
                            Repeatedly disengages during dense mathematical notation sections. Engagement drops average <strong className="text-danger"><AnimatedCounter value={34} />%</strong> during theory-heavy content across Sessions 1, 3, and 5. Recovers strongly when examples or demos follow.
                        </p>

                        {/* Session history */}
                        <StaggerContainer delay={0.4} stagger={0.1}>
                            <div className="space-y-2 mb-3">
                                {[
                                    { session: "Session 5", topic: "Backpropagation math", drop: 42, recovery: true },
                                    { session: "Session 3", topic: "Gradient derivation", drop: 35, recovery: true },
                                    { session: "Session 1", topic: "Neuron equations", drop: 25, recovery: false },
                                ].map((s, i) => (
                                    <StaggerItem key={i}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-muted w-20 flex-shrink-0">{s.session}</span>
                                            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                <div className="h-full rounded-full bg-danger/60" style={{ width: `${s.drop}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-danger w-10 text-right">-{formatPercentValue(s.drop)}</span>
                                            {s.recovery && <span className="text-[10px] text-success">↗ recovered</span>}
                                        </div>
                                    </StaggerItem>
                                ))}
                            </div>
                        </StaggerContainer>

                        <div className="glass-card p-2.5 bg-success/5 border-success/10">
                            <p className="text-[11px] text-muted">
                                <span className="font-semibold text-success">✦</span> Student Gamma consistently recovers when visual/practical content follows — suggesting this is a <strong className="text-foreground">learning style preference</strong>, not an ability gap.
                            </p>
                        </div>
                    </div>

                    <p className="text-[10px] text-muted italic mt-auto">
                        🔒 Student patterns are shared with teachers only as anonymized examples to illustrate class-wide trends. Individual data is private to the student.
                    </p>
                </div>
            </Card>
        </Reveal>
    );
}
