import React from "react";
import Button from "@/components/ui/Button";

export default function Hero() {
    return (
        <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-sm font-medium mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
                        Privacy-First · AI-Powered · No Surveillance
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in-up stagger-1">
                        Understand Learning,
                        <br />
                        <span className="gradient-text">Not Learners</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2">
                        InsightBoard AI detects engagement dips in real-time, maps them to your slides, and generates personalized AI recaps — while keeping student privacy at the core.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
                        <Button href="/teacher" size="lg" variant="primary">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Teacher Dashboard
                        </Button>
                        <Button href="/student" size="lg" variant="secondary">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Student Dashboard
                        </Button>
                    </div>

                    {/* Trust bar */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted animate-fade-in-up stagger-4">
                        <div className="flex items-center gap-2">
                            <span className="text-success">🔒</span>
                            <span>No raw student media viewed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-accent-light">📊</span>
                            <span>Aggregated insights only</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-warning">🧠</span>
                            <span>Student reflection in the loop</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-danger">⛔</span>
                            <span>No grades from engagement</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
