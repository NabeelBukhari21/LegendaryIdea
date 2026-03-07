import React from "react";
import Button from "@/components/ui/Button";

export default function CTASection() {
    return (
        <section className="relative py-24">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Ready to Transform Your{" "}
                    <span className="gradient-text">Classroom?</span>
                </h2>
                <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
                    Join the movement toward empathetic, privacy-respecting education technology. Start understanding learning patterns — not monitoring students.
                </p>

                <div className="glass-card p-8 sm:p-12 glow">
                    <div className="grid sm:grid-cols-3 gap-8 mb-10">
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text mb-1">43%</div>
                            <div className="text-sm text-muted">Avg. engagement dip detected</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-success mb-1">89%</div>
                            <div className="text-sm text-muted">Recommendation confidence</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-warning mb-1">24h</div>
                            <div className="text-sm text-muted">Max raw data retention</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button href="/teacher" size="lg" variant="primary">
                            Explore Teacher View
                        </Button>
                        <Button href="/student" size="lg" variant="secondary">
                            Try Student Experience
                        </Button>
                    </div>
                </div>

                {/* Future features */}
                <div className="mt-12 glass-card p-6 max-w-xl mx-auto border-dashed border-white/10">
                    <div className="flex items-center gap-2 text-sm text-muted mb-2">
                        <span>🚀</span>
                        <span className="font-medium text-foreground">Coming Soon</span>
                    </div>
                    <p className="text-sm text-muted">
                        <strong className="text-accent-light">Exam Mode</strong> — Optional focus-tracking during assessments with full student consent, configurable by institution. <em>Not part of core MVP.</em>
                    </p>
                </div>
            </div>
        </section>
    );
}
