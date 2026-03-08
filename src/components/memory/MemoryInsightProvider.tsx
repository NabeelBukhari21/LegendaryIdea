"use client";
import { formatPercentValue } from "@/lib/formatters";

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

        if (!crossSessionPatterns || crossSessionPatterns.length === 0) {
            if (isMounted) {
                setData(defaultClassPattern);
                setIsLoading(false);
            }
            return;
        }

        // Map Backboard crossSessionPatterns directly into the UI schema
        if (isMounted) {
            const topPattern = crossSessionPatterns[0];
            const mappedData: MemoryInsightData = {
                classPattern: {
                    quote: `Students repeatedly lose focus during ${topPattern?.topic || 'core concept'} explanations.`,
                    detail: `Backboard Memory tracked a ${formatPercentValue((topPattern?.avgEngagementDrop || 0))} engagement drop ${topPattern?.occurrences || 1} times across recent sessions.`,
                    actionable: `Break down ${topPattern?.topic || 'the topic'} with interactive visual scaffolding.`
                },
                recurringConfusion: crossSessionPatterns.map(p => ({
                    topic: p.topic,
                    suggestedAction: `Pre-teach ${p.topic} vocabulary`
                }))
            };

            setData(mappedData);
            setIsLoading(false);
        }

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
