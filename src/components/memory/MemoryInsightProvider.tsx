"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useBackboard } from "@/components/backboard/BackboardProvider";

interface MemoryInsightData {
    classPattern: {
        quote: string;
        detail: string;
        actionable: string;
    };
    recurringConfusion: {
        topic: string;
        suggestedAction: string;
    }[];
}

interface MemoryInsightContextType {
    data: MemoryInsightData | null;
    isLoading: boolean;
    error: string | null;
}

const MemoryInsightContext = createContext<MemoryInsightContextType | undefined>(undefined);

const defaultClassPattern = {
    classPattern: {
        quote: "Waiting for historical session data",
        detail: "No established patterns detected yet. Complete a session to start tracking engagement across multiple classes.",
        actionable: "Run a live session to begin building memory patterns."
    },
    recurringConfusion: []
};

export function MemoryInsightProvider({ children }: { children: React.ReactNode }) {
    const { crossSessionPatterns, isProcessing } = useBackboard();
    const [data, setData] = useState<MemoryInsightData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        if (isProcessing) {
            setIsLoading(true);
            return;
        }

        async function fetchMemoryInsights() {
            if (!crossSessionPatterns || crossSessionPatterns.length === 0) {
                if (isMounted) {
                    setData(defaultClassPattern);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const response = await fetch("/api/gemini", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "memory-insight",
                        payload: {
                            sessionCount: 5, // Ideally track session count in global state, 5 is a placeholder for demo purposes
                            recurringTopics: crossSessionPatterns.map((p) => p.topic)
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch memory insights");
                }

                const result = await response.json();
                if (isMounted) {
                    if (result.classPattern && result.recurringConfusion) {
                        setData(result);
                    } else {
                        setData(defaultClassPattern);
                    }
                    setIsLoading(false);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setData(defaultClassPattern);
                    setError("Failed to generate AI insights.");
                    setIsLoading(false);
                }
            }
        }

        fetchMemoryInsights();

        return () => {
            isMounted = false;
        };
    }, [crossSessionPatterns, isProcessing]);

    return (
        <MemoryInsightContext.Provider value={{ data, isLoading, error }}>
            {children}
        </MemoryInsightContext.Provider>
    );
}

export function useMemoryInsight() {
    const context = useContext(MemoryInsightContext);
    if (context === undefined) {
        throw new Error("useMemoryInsight must be used within a MemoryInsightProvider");
    }
    return context;
}
