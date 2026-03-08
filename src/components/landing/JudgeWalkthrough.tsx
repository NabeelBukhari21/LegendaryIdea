"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

export default function JudgeWalkthrough() {
    const questions = [
        {
            id: 1,
            q: "What does this app do?",
            a: "InsightBoard AI is a privacy-first classroom copilot. It uses local device cameras (MediaPipe) to track student engagement in real-time without storing video. It then maps this biometric data against the teacher's lesson content, generating personalized 3D learning interventions for students and actionable timeline analytics for the teacher.",
            icon: "🎯",
            color: "accent"
        },
        {
            id: 2,
            q: "What happens first in the demo?",
            a: "The journey begins in the Live Demo page. You'll see a simulated classroom where the local MediaPipe models are extracting 6 distinct signals (gaze, movement, eye openness, head pitch, jaw openness, and alertness) from student faces. This live tracking establishes the baseline 'ground truth' engagement curve.",
            icon: "▶️",
            color: "blue-500"
        },
        {
            id: 3,
            q: "What happens after the live session?",
            a: "The data splits into two privacy-safe streams. Students get private, 3D interactive learning interventions for the exact concepts they struggled with. Teachers get an aggregated timeline, showing exactly which slides caused the classroom to disengage, without ever seeing raw student tracking data.",
            icon: "🔀",
            color: "warning"
        },
        {
            id: 4,
            q: "How do Gemini and Backboard add value?",
            a: "MediaPipe only provides raw arrays of numbers. Gemini acts as the real-time reasoning engine, analyzing the curriculum to explain *why* engagement dropped. Backboard acts as our Long-Term Memory SDK, saving these transcripts across weeks to detect macro-trends (e.g., 'The class consistently drops 38% whenever Chain Rule is taught').",
            icon: "🚀",
            color: "success"
        },
        {
            id: 5,
            q: "Why is this better than a normal analytics dashboard?",
            a: "Normal dashboards are reactive and isolated. InsightBoard is proactive and connected. It doesn't just show a graph; it uses cross-session Backboard retrievals and multi-agent AI to pinpoint exact curriculum failures and immediately spins up private 3D recovery environments for struggling students.",
            icon: "🏆",
            color: "purple-500"
        }
    ];

    return (
        <section className="py-20 relative max-w-[1000px] mx-auto px-4 sm:px-6 z-20">
            <Reveal>
                <div className="text-center mb-16">
                    <Badge variant="default" className="mb-4">Judge Context Guide</Badge>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                        The 5 questions you likely <br />
                        <span className="gradient-text">have right now.</span>
                    </h2>
                </div>
            </Reveal>

            <StaggerContainer delay={0.2} stagger={0.15}>
                <div className="space-y-6">
                    {questions.map((item, index) => (
                        <StaggerItem key={item.id}>
                            <Card className="relative overflow-hidden group hover:border-white/20 transition-all duration-500">
                                {/* Ambient glow matching the icon color */}
                                <div className={`absolute -right-20 -top-20 w-64 h-64 bg-${item.color}/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                                <div className="relative p-2 sm:p-4">
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className={`w-14 h-14 rounded-2xl bg-${item.color}/15 ring-1 ring-${item.color}/30 flex items-center justify-center text-3xl flex-shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.2)] shadow-${item.color}/20`}>
                                            {item.icon}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-black uppercase tracking-widest text-${item.color} bg-${item.color}/10 px-2.5 py-1 rounded-md`}>
                                                    Question 0{item.id}
                                                </span>
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                                                {item.q}
                                            </h3>
                                            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </StaggerItem>
                    ))}
                </div>
            </StaggerContainer>

            <Reveal delay={0.8} direction="up">
                <div className="mt-16 text-center">
                    <p className="text-muted mb-6">Ready to see it in action?</p>
                    <div className="inline-block relative group">
                        <div className="absolute inset-0 bg-accent rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                        <a href="/live-demo" className="relative flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-lg font-bold text-foreground">
                            Start the 5-Step Demo Journey
                            <span className="text-accent-light">→</span>
                        </a>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
