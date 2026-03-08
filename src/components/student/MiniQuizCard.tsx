"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/MotionKit";
import { useStudentInsight } from "@/components/student/StudentInsightProvider";

export default function MiniQuizCard() {
    const [answers, setAnswers] = useState<Record<string, number | null>>({});
    const [showResults, setShowResults] = useState<Record<string, boolean>>({});
    const { data, isLoading } = useStudentInsight();

    const fallbackQuiz = [
        {
            id: "waiting",
            question: "Waiting for session data to generate review questions.",
            topic: "Review Generation Pending",
            options: ["Awaiting Data"],
            correctIndex: 0,
            explanation: "Gemini will generate review questions here based on your comprehension gaps."
        }
    ];

    const quizQuestions = data?.reviewQuestions ? data.reviewQuestions.map((q, i) => ({
        id: `q${i}`,
        question: q.question,
        topic: "AI Review Topic",
        options: q.options,
        correctIndex: q.options.indexOf(q.correctAnswer) !== -1 ? q.options.indexOf(q.correctAnswer) : 0,
        explanation: q.explanation
    })) : fallbackQuiz;

    const handleAnswer = (qId: string, optIndex: number) => {
        if (answers[qId] !== undefined && answers[qId] !== null) return;
        setAnswers((prev) => ({ ...prev, [qId]: optIndex }));
        setTimeout(() => {
            setShowResults((prev) => ({ ...prev, [qId]: true }));
        }, 400);
    };

    const answeredCount = Object.keys(answers).filter((k) => answers[k] !== null).length;
    const correctCount = quizQuestions.filter((q) => answers[q.id] === q.correctIndex).length;

    return (
        <Reveal delay={0.5} duration={0.6}>
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-accent-light text-lg">
                            🧪
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Quick Check — Do You Get It?</h3>
                            <p className="text-xs text-muted">No pressure, no grades — just for you to see where you stand</p>
                        </div>
                        {answeredCount > 0 && answeredCount === quizQuestions.length && (
                            <Badge variant={correctCount === quizQuestions.length ? "success" : "warning"}>
                                {correctCount}/{quizQuestions.length} correct
                            </Badge>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-28 bg-white/5 rounded-xl border border-white/5" />
                            <div className="h-28 bg-white/5 rounded-xl border border-white/5" />
                            <div className="h-28 bg-white/5 rounded-xl border border-white/5" />
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {quizQuestions.map((q, qi) => {
                                const userAnswer = answers[q.id];
                                const revealed = showResults[q.id];
                                const isCorrect = userAnswer === q.correctIndex;

                                return (
                                    <div key={q.id} className="glass-card p-4 bg-white/[0.01] border-white/5">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${revealed
                                                ? isCorrect
                                                    ? "bg-success/20 ring-1 ring-success/30 text-success"
                                                    : "bg-danger/20 ring-1 ring-danger/30 text-danger"
                                                : "bg-white/10 text-muted"
                                                }`}>
                                                {revealed ? (isCorrect ? "✓" : "✗") : qi + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{q.question}</p>
                                                <span className="text-[10px] text-muted">{q.topic}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2 ml-10">
                                            {q.options.map((opt, oi) => {
                                                const isSelected = userAnswer === oi;
                                                const isAnswer = oi === q.correctIndex;
                                                let style = "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] cursor-pointer";

                                                if (revealed) {
                                                    if (isAnswer) style = "border-success/40 bg-success/10";
                                                    else if (isSelected && !isAnswer) style = "border-danger/40 bg-danger/5";
                                                    else style = "border-white/5 bg-white/[0.01] opacity-50";
                                                } else if (isSelected) {
                                                    style = "border-accent bg-accent/10 ring-1 ring-accent/20";
                                                }

                                                return (
                                                    <button
                                                        key={oi}
                                                        onClick={() => handleAnswer(q.id, oi)}
                                                        disabled={userAnswer !== undefined && userAnswer !== null}
                                                        className={`text-left p-3 rounded-xl border transition-all duration-200 ${style}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${revealed && isAnswer ? "border-success bg-success text-white" :
                                                                revealed && isSelected && !isAnswer ? "border-danger bg-danger text-white" :
                                                                    isSelected ? "border-accent bg-accent text-white" :
                                                                        "border-white/20 text-muted"
                                                                }`}>
                                                                {String.fromCharCode(65 + oi)}
                                                            </div>
                                                            <span className={`text-sm ${revealed && isAnswer ? "text-foreground font-medium" : "text-muted"}`}>
                                                                {opt}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation */}
                                        {revealed && (
                                            <div className={`mt-3 ml-10 glass-card p-3 ${isCorrect ? "bg-success/5 border-success/10" : "bg-warning/5 border-warning/10"}`}>
                                                <p className="text-xs text-muted leading-relaxed">
                                                    <span className={`font-semibold ${isCorrect ? "text-success" : "text-warning"}`}>
                                                        {isCorrect ? "Exactly right! " : "Not quite — "}
                                                    </span>
                                                    {q.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <p className="text-[10px] text-muted mt-4 italic text-center">
                        🎯 These questions are just for your own learning — answers are never shared or graded.
                    </p>
                </div>
            </Card>
        </Reveal>
    );
}
