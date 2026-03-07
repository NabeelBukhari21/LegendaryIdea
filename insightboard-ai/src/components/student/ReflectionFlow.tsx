"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const reasons = [
    "Content was too fast-paced",
    "Math was too complex",
    "Couldn't follow the notation",
    "Lost context from previous slide",
    "Distracted / tired",
    "Other",
];

export default function ReflectionFlow() {
    const [step, setStep] = useState<"prompt" | "select" | "detail" | "done">("prompt");
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [detail, setDetail] = useState("");

    const toggleReason = (reason: string) => {
        setSelectedReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    if (step === "done") {
        return (
            <Card className="animate-fade-in-up stagger-2">
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-success/15 flex items-center justify-center text-3xl mx-auto mb-4">
                        ✅
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Reflection Submitted!</h3>
                    <p className="text-sm text-muted max-w-md mx-auto">
                        Thank you for sharing why you disengaged. Your AI recap has been personalized based on your feedback. Your response is anonymous to your teacher.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {selectedReasons.map((r, i) => (
                            <Badge key={i} variant="success">{r}</Badge>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="animate-fade-in-up stagger-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent-light">
                        💭
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Reflection</h3>
                        <p className="text-xs text-muted">Help us help you — your response is private</p>
                    </div>
                    <Badge className="ml-auto">Step {step === "prompt" ? "1" : step === "select" ? "2" : "3"}/3</Badge>
                </div>

                {step === "prompt" && (
                    <div className="space-y-4">
                        <div className="glass-card p-4 bg-accent/5 border-accent/10">
                            <p className="text-sm text-foreground">
                                We noticed your engagement dropped during <strong>Slide 4: Backpropagation Explained</strong>. Would you like to share why? This helps us create a better recap for you.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={() => setStep("select")} variant="primary" size="sm">
                                Yes, I&apos;ll share
                            </Button>
                            <Button onClick={() => setStep("done")} variant="ghost" size="sm">
                                Skip
                            </Button>
                        </div>
                    </div>
                )}

                {step === "select" && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted">What contributed to your disengagement? (Select all that apply)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {reasons.map((reason) => (
                                <button
                                    key={reason}
                                    onClick={() => toggleReason(reason)}
                                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${selectedReasons.includes(reason)
                                            ? "border-accent bg-accent/10 text-foreground"
                                            : "border-white/10 bg-white/[0.02] text-muted hover:border-white/20 hover:bg-white/5"
                                        }`}
                                >
                                    <span className="mr-2">
                                        {selectedReasons.includes(reason) ? "✓" : "○"}
                                    </span>
                                    {reason}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setStep("detail")}
                                variant="primary"
                                size="sm"
                                disabled={selectedReasons.length === 0}
                            >
                                Continue
                            </Button>
                            <Button onClick={() => setStep("prompt")} variant="ghost" size="sm">
                                Back
                            </Button>
                        </div>
                    </div>
                )}

                {step === "detail" && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted">Anything else you&apos;d like to add? (Optional)</p>
                        <textarea
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            placeholder="E.g., I couldn't follow the chain rule notation..."
                            className="w-full h-24 bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-foreground placeholder-muted/50 focus:outline-none focus:border-accent/50 resize-none transition-colors"
                        />
                        <div className="flex gap-3">
                            <Button onClick={() => setStep("done")} variant="primary" size="sm">
                                Submit Reflection
                            </Button>
                            <Button onClick={() => setStep("select")} variant="ghost" size="sm">
                                Back
                            </Button>
                        </div>
                        <p className="text-xs text-muted italic">
                            🔒 Your reflection is anonymous. Your teacher sees aggregated themes only, never individual responses.
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
