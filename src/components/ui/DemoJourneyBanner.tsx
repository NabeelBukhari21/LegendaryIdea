import React from 'react';
import Link from 'next/link';

interface DemoJourneyBannerProps {
    step: number;
    totalSteps?: number;
    nextPath: string;
    nextLabel: string;
    isFinal?: boolean;
}

const STEP_COLORS = [
    "from-accent/20 to-transparent", // 1
    "from-blue-500/20 to-transparent", // 2
    "from-warning/20 to-transparent", // 3
    "from-success/20 to-transparent", // 4
    "from-purple-500/20 to-transparent", // 5
];

export function DemoJourneyBanner({ step, totalSteps = 5, nextPath, nextLabel, isFinal = false }: DemoJourneyBannerProps) {
    const colorClass = STEP_COLORS[Math.min(step - 1, STEP_COLORS.length - 1)];

    return (
        <div className={`mt-16 sm:mt-24 mb-10 w-full rounded-2xl border border-white/10 bg-gradient-to-t ${colorClass} p-px shadow-2xl relative overflow-hidden group`}>
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

            <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-muted bg-white/5 px-2 py-1 rounded-md border border-white/10">
                            Demo Flow
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                            Step {step} of {totalSteps}
                        </span>
                    </div>
                    <p className="text-muted text-sm max-w-xl">
                        {step === 1 && "Live engagement tracking establishes the baseline ground truth."}
                        {step === 2 && "The student privately reflects on their specific dips in the 3D recovery hub."}
                        {step === 3 && "The teacher views aggregated patterns to identify at-risk students before it's too late."}
                        {step === 4 && "The precise timeline is mapped against the transcript to pinpoint curriculum flaws."}
                        {step === 5 && "Backboard maps multi-week patterns to generate persistent, long-term intelligence."}
                    </p>
                </div>

                <Link href={nextPath} className="shrink-0 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform duration-300 relative">
                    <div className="absolute inset-0 rounded-xl bg-accent blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="text-right">
                            <span className="block text-[10px] uppercase tracking-widest text-muted">{isFinal ? "Finish Flow" : "Next Phase"}</span>
                            <span className="block text-sm font-bold text-foreground">{nextLabel}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-light">
                            →
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
