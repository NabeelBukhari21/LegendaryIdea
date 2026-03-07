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

export function TeacherInsightProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<GeminiTeacherInsightData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchInsight() {
            setIsLoading(true);
            try {
                const response = await fetch("/api/backboard/teacher/insight", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionTitle: "Session 5 — Neural Networks Deep Dive",
                        slideTopic: "Backpropagation Math",
                        dipPercentage: 42,
                        reasons: ["too fast", "unclear example"]
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
    }, []);

    return (
        <TeacherInsightContext.Provider value={{ data, isLoading, error }}>
            {children}
        </TeacherInsightContext.Provider>
    );
}

export function useTeacherInsight() {
    return useContext(TeacherInsightContext);
}
