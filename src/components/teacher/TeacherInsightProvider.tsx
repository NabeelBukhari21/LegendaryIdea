"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface GeminiTeacherInsightData {
    recommendation: {
        title: string;
        description: string;
        steps: string[];
        type?: string;
        confidence?: number;
        basedOn?: string;
    };
    postSlide4: {
        insight: string;
        impact: string;
    };
    feedbackSummary: string;
}

interface TeacherInsightContextType {
    data: GeminiTeacherInsightData | null;
    isLoading: boolean;
    error: Error | null;
}

const TeacherInsightContext = createContext<TeacherInsightContextType>({
    data: null,
    isLoading: false,
    error: null,
});

import { useSession } from "@/components/session/SessionEngineProvider";

export function TeacherInsightProvider({ children }: { children: React.ReactNode }) {
    const { state, getClassSummary } = useSession();
    const [data, setData] = useState<GeminiTeacherInsightData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchInsight() {
            if (!state.isActive && state.slides.length === 0) return;

            const summary = getClassSummary();
            const weakestSlideId = summary.weakestSlide?.id ?? state.slides[0]?.id;
            const weakSlideDef = state.slides.find(s => s.id === weakestSlideId);
            const topicName = weakSlideDef?.topic || "Core Concepts";

            const generatedReasons = [];
            if (summary.confusionSpikes > 2) generatedReasons.push("widespread confusion detected");
            if (summary.headDownTotal > Math.max(1, summary.studentCount / 4)) generatedReasons.push("high distraction levels");
            if (generatedReasons.length === 0) generatedReasons.push("general engagement drop-off");

            const dipVal = summary.dipMoments.length > 0
                ? Math.abs(summary.dipMoments[summary.dipMoments.length - 1].dropAmount)
                : 35; // Default assumed dip if none formally logged

            setIsLoading(true);
            try {
                const response = await fetch("/api/gemini", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "teacher-insight",
                        payload: {
                            sessionTitle: state.sessionTitle || "Course Session",
                            slideTopic: topicName,
                            dipPercentage: dipVal,
                            reasons: generatedReasons
                        }
                    })
                });

                if (!response.ok) {
                    if (isMounted) setError(new Error("Failed to fetch insight"));
                    return;
                }

                const json = await response.json();
                if (isMounted) {
                    if (json.error) {
                        setError(new Error(json.error));
                        return;
                    }
                    setData(json);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error("Unknown error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchInsight();

        return () => {
            isMounted = false;
        };
    }, [state.isActive, state.slides.length]);

    return (
        <TeacherInsightContext.Provider value={{ data, isLoading, error }}>
            {children}
        </TeacherInsightContext.Provider>
    );
}

export function useTeacherInsight() {
    return useContext(TeacherInsightContext);
}
