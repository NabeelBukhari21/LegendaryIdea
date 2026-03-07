"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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

const fallbackConfusionPatterns = [
    {
        id: "cp1",
        topic: "Chain Rule / Derivatives",
        occurrences: 3,
        sessions: ["Session 5 - Mar 6", "Session 3 - Feb 20", "Session 1 - Feb 6"],
        trend: "increasing",
        avgEngagementDrop: 38,
        suggestedAction: "Add prerequisite math refresher before this topic. Consider a 5-min calculus warmup slide.",
    },
    {
        id: "cp2",
        topic: "Matrix Multiplication in Layers",
        occurrences: 2,
        sessions: ["Session 4 - Feb 27", "Session 2 - Feb 13"],
        trend: "stable",
        avgEngagementDrop: 22,
        suggestedAction: "Use visual matrix animations. Students respond well to color-coded row×column demonstrations.",
    },
];

const fallbackData: MemoryInsightData = {
    classPattern: {
        quote: "Theory-heavy slides without visual support consistently reduce engagement by 30–40% across all sessions",
        detail: "This class responds strongly to visual, example-based teaching and struggles when content shifts to abstract mathematical notation without adequate scaffolding. This is not a reflection of student capability — it's a content delivery pattern.",
        actionable: "Lead with visual examples to set context, then introduce formal notation. The class demonstrated they can handle complexity when scaffolded properly (Slide 6: 91% after Slide 4's 45%)."
    },
    recurringConfusion: fallbackConfusionPatterns.map(p => ({
        topic: p.topic,
        suggestedAction: p.suggestedAction
    }))
};

export function MemoryInsightProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<MemoryInsightData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchMemoryInsights() {
            try {
                const response = await fetch("/api/gemini", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "memory-insight",
                        payload: {
                            sessionCount: 5,
                            recurringTopics: fallbackConfusionPatterns.map(p => p.topic)
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch memory insights");
                }

                const result = await response.json();
                if (isMounted) {
                    // Make sure the structure matches expectations
                    if (result.classPattern && result.recurringConfusion) {
                        setData(result);
                    } else {
                        setData(fallbackData);
                    }
                    setIsLoading(false);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setData(fallbackData);
                    setError("Using mock data due to API error.");
                    setIsLoading(false);
                }
            }
        }

        fetchMemoryInsights();

        return () => {
            isMounted = false;
        };
    }, []);

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
