"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function CTASection() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                    Ready to <span className="gradient-text">Explore?</span>
                </h2>
                <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
                    Dive into the live demo — see the teacher dashboard, student view, session timeline, memory intelligence, and privacy architecture.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                    <Button href="/teacher" variant="primary" size="lg">
                        🎓 Teacher Dashboard
                    </Button>
                    <Button href="/student" variant="secondary" size="lg">
                        🧑‍🎓 Student Dashboard
                    </Button>
                    <Button href="/session" variant="secondary" size="lg">
                        📊 Session Timeline
                    </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                    <Button href="/memory" variant="ghost" size="md">
                        🧠 Memory Insights
                    </Button>
                    <Button href="/privacy" variant="ghost" size="md">
                        🔒 Privacy & Audit
                    </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                    <Badge variant="default" size="md">Next.js</Badge>
                    <Badge variant="default" size="md">TypeScript</Badge>
                    <Badge variant="success" size="md">Gemini</Badge>
                    <Badge variant="warning" size="md">MediaPipe</Badge>
                    <Badge variant="info" size="md">Backboard</Badge>
                    <Badge variant="default" size="md">Solana</Badge>
                </div>
            </div>
        </section>
    );
}
