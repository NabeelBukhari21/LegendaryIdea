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
    data: GeminiInsightData | null;
    isLoading: boolean;
    error: Error | null;
}

const StudentInsightContext = createContext<StudentInsightContextType>({
    data: null,
    isLoading: false,
    error: null,
});

export function StudentInsightProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<GeminiInsightData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchInsight() {
            setIsLoading(true);
            try {
                const response = await fetch("/api/backboard/student/insight", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        studentId: "s1",
                        sessionTitle: "Session 5 — Neural Networks Deep Dive",
                        slideTopic: "Backpropagation Math",
                        reasons: ["too fast", "unclear explanation"]
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
    }, []);

    return (
        <StudentInsightContext.Provider value={{ data, isLoading, error }}>
            {children}
        </StudentInsightContext.Provider>
    );
}

export function useStudentInsight() {
    return useContext(StudentInsightContext);
}
