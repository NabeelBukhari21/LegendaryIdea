"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface GeminiInsightData {
    recap: string;
    explanation: string;
    workedExample: {
        problem: string;
        steps: string[];
        answer: string;
    };
    reviewQuestions: {
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
    }[];
}

interface StudentInsightContextType {
    studentId: string;
    data: GeminiInsightData | null;
    isLoading: boolean;
    error: Error | null;
}

const StudentInsightContext = createContext<StudentInsightContextType>({
    studentId: "s1",
    data: null,
    isLoading: false,
    error: null,
});

import { useSession } from "@/components/session/SessionEngineProvider";

export function StudentInsightProvider({ children, studentId }: { children: React.ReactNode, studentId: string }) {
    const { state, getStudentSummary } = useSession();
    const [data, setData] = useState<GeminiInsightData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchInsight() {
            if (!state.isActive && state.slides.length === 0) return;

            const summary = getStudentSummary(studentId);
            const weakestSlideId = summary?.weakestSlide ?? state.slides[0]?.id;
            const weakSlideDef = state.slides.find(s => s.id === weakestSlideId);
            const topicName = weakSlideDef?.topic || "Core Concepts";

            const generatedReasons = [];
            if ((summary?.confusionCount ?? 0) > 2) generatedReasons.push("frequent confusion spikes");
            if ((summary?.avgEngagement ?? 50) < 50) generatedReasons.push("overall low engagement");
            if (generatedReasons.length === 0) generatedReasons.push("general review of complex topics needed");

            setIsLoading(true);
            try {
                const response = await fetch("/api/gemini", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "student-insight",
                        payload: {
                            studentId: studentId,
                            sessionTitle: state.sessionTitle || "Course Session",
                            slideTopic: topicName,
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
                    // Check if there was an explicit error from the API 
                    // (e.g., API key not set, which falls back to mock)
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
    }, [studentId, state.isActive, state.slides.length]);

    return (
        <StudentInsightContext.Provider value={{ studentId, data, isLoading, error }}>
            {children}
        </StudentInsightContext.Provider>
    );
}

export function useStudentInsight() {
    return useContext(StudentInsightContext);
}
