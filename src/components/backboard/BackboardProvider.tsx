"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- 1. Define Multi-Agent Models ---
export interface CrossSessionMemory {
    patternId: string;
    topic: string;
    occurrences: number;
    sessions: string[];
    severity: "high" | "medium" | "low";
    trend: "increasing" | "stable" | "decreasing";
    avgEngagementDrop: number;
}

export interface StudentAtRiskProfile {
    studentId: string;
    alias: string;
    riskScore: number;
    activeFlags: string[];
    recommendedSupport: string;
}

export interface TeacherRecommendation {
    recommendation: string;
}

export interface StudentSupportAdvice {
    id: string;
    pattern: string;
    advice: string;
    confidence: number;
}

export interface BackboardContextType {
    isProcessing: boolean;
    // Memory Agent Output
    crossSessionPatterns: CrossSessionMemory[];
    // Student Support Agent Output
    atRiskProfiles: StudentAtRiskProfile[];
    studentSupportAdvice: StudentSupportAdvice[];
    // Intervention Agent Output
    activeTeacherRecommendations: string[];
    simulateAgentProcessing: () => void;
}

const BackboardContext = createContext<BackboardContextType | undefined>(undefined);

// Define complex simulated outputs
const fallbackConfusionPatterns = [
    { id: "cp1", topic: "Chain Rule / Derivatives", occurrences: 3, sessions: ["Session 5", "Session 3", "Session 1"], trend: "increasing" as const, avgEngagementDrop: 38 },
    { id: "cp2", topic: "Matrix Multiplication in Layers", occurrences: 2, sessions: ["Session 4", "Session 2"], trend: "stable" as const, avgEngagementDrop: 22 }
];

const fallbackStudents = [
    { id: "s1", alias: "Student Alpha", avgEngagement: 82, atRisk: false },
    { id: "s2", alias: "Student Beta", avgEngagement: 74, atRisk: false },
    { id: "s3", alias: "Student Gamma", avgEngagement: 56, atRisk: true },
];

const initialCrossSessionPatterns: CrossSessionMemory[] = fallbackConfusionPatterns.map(p => ({
    patternId: `ptn-${p.id}`,
    topic: p.topic,
    occurrences: p.occurrences,
    sessions: p.sessions,
    severity: p.trend === "increasing" ? "high" : p.trend === "stable" ? "medium" : "low",
    trend: p.trend as "increasing" | "stable" | "decreasing",
    avgEngagementDrop: p.avgEngagementDrop
}));

const initialAtRiskProfiles: StudentAtRiskProfile[] = fallbackStudents
    .filter(s => s.atRisk)
    .map(s => ({
        studentId: s.id.toString(),
        alias: s.alias,
        riskScore: Math.round(90 - s.avgEngagement * 0.8), // Mock logic
        activeFlags: ["Consecutive drop-offs", "Struggled with current topic pre-reqs"],
        recommendedSupport: "Schedule 1:1 check-in before Segment 6. Assign simpler visual primer for homework."
    }));

const initialStudentSupportAdvice: StudentSupportAdvice[] = [
    {
        id: "adv-1",
        pattern: "Theoretical Math Drop-offs",
        advice: "You tend to disengage during heavy notation. Try reviewing visually first.",
        confidence: 88
    }
];

export function BackboardProvider({ children }: { children: React.ReactNode }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [crossSessionPatterns, setCrossSessionPatterns] = useState<CrossSessionMemory[]>(initialCrossSessionPatterns);
    const [atRiskProfiles, setAtRiskProfiles] = useState<StudentAtRiskProfile[]>(initialAtRiskProfiles);
    const [studentSupportAdvice, setStudentSupportAdvice] = useState<StudentSupportAdvice[]>(initialStudentSupportAdvice);
    const [activeTeacherRecommendations, setActiveTeacherRecommendations] = useState<string[]>([
        "Group highly visual learners together for next module.",
        "Add a 5-minute practical application break after slide 4 in future sessions."
    ]);

    // Simulate an orchestration tick where agents process raw data and converge
    const simulateAgentProcessing = () => {
        setIsProcessing(true);
        // Simulate Backboard analyzing live session + DB memory
        setTimeout(() => {
            setIsProcessing(false);
        }, 1500);
    };

    // Initial load simulation
    useEffect(() => {
        const timer = setTimeout(() => {
            simulateAgentProcessing();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <BackboardContext.Provider value={{
            isProcessing,
            crossSessionPatterns,
            atRiskProfiles,
            studentSupportAdvice,
            activeTeacherRecommendations,
            simulateAgentProcessing
        }}>
            {children}
        </BackboardContext.Provider>
    );
}

export function useBackboard() {
    const context = useContext(BackboardContext);
    if (context === undefined) {
        throw new Error("useBackboard must be used within a BackboardProvider");
    }
    return context;
}
