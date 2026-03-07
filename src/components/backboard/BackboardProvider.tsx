"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
    CrossSessionMemory,
    StudentAtRiskProfile,
    StudentSupportAdvice
} from "@/lib/backboard-service";

export interface TeacherRecommendation {
    recommendation: string;
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
    syncBackboardData: () => void;
}

const BackboardContext = createContext<BackboardContextType | undefined>(undefined);

export function BackboardProvider({ children }: { children: React.ReactNode }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [crossSessionPatterns, setCrossSessionPatterns] = useState<CrossSessionMemory[]>([]);
    const [atRiskProfiles, setAtRiskProfiles] = useState<StudentAtRiskProfile[]>([]);
    const [studentSupportAdvice, setStudentSupportAdvice] = useState<StudentSupportAdvice[]>([]);
    const [activeTeacherRecommendations, setActiveTeacherRecommendations] = useState<string[]>([]);

    // Real Backboard Fetching
    const syncBackboardData = async () => {
        setIsProcessing(true);
        try {
            const [teacherRes, memoryRes, studentRes] = await Promise.all([
                fetch('/api/backboard/teacher').then(r => r.json()),
                fetch('/api/backboard/memory').then(r => r.json()),
                fetch('/api/backboard/student?id=s1').then(r => r.json())
            ]);

            if (teacherRes.atRiskProfiles) setAtRiskProfiles(teacherRes.atRiskProfiles);
            if (teacherRes.activeTeacherRecommendations) setActiveTeacherRecommendations(teacherRes.activeTeacherRecommendations);

            if (memoryRes.crossSessionPatterns) setCrossSessionPatterns(memoryRes.crossSessionPatterns);
            // Ignore disengagementWindows here, we can fetch it separately if needed

            if (studentRes.studentSupportAdvice) setStudentSupportAdvice(studentRes.studentSupportAdvice);
        } catch (error) {
            console.error("Failed to sync Backboard state", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Initial load
    useEffect(() => {
        syncBackboardData();
    }, []);

    return (
        <BackboardContext.Provider value={{
            isProcessing,
            crossSessionPatterns,
            atRiskProfiles,
            studentSupportAdvice,
            activeTeacherRecommendations,
            syncBackboardData
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
