"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuditProof {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    dataHash: string;
    status: "pending" | "verified" | "failed";
}

interface SolanaContextType {
    isConnecting: boolean;
    networkStatus: "mainnet-beta" | "devnet" | "offline";
    recentProofs: AuditProof[];
    verifyProof: (hash: string) => Promise<boolean>;
    logAccess: (action: string, actor: string) => void;
}

const SolanaContext = createContext<SolanaContextType | undefined>(undefined);

// Generate a fake SHA-256 looking hash
const generateMockHash = () => {
    return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
};

const initialProofs: AuditProof[] = [
    {
        id: "prf-001",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        action: "Viewed Class Aggregation",
        actor: "Teacher ID: 8A92",
        dataHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: "verified"
    },
    {
        id: "prf-002",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        action: "Generated Study Recap",
        actor: "System (Gemini)",
        dataHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        status: "verified"
    },
    {
        id: "prf-003",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        action: "Student Consent Granted",
        actor: "Student ID: 41B1",
        dataHash: "b2da24a87eb60c5a271701edcf7a9b1c0ea410d29759bc6b245e1f6e2f1feba6",
        status: "verified"
    }
];

export function SolanaProvider({ children }: { children: React.ReactNode }) {
    const [isConnecting, setIsConnecting] = useState(true);
    const [networkStatus, setNetworkStatus] = useState<"devnet" | "mainnet-beta" | "offline">("devnet");
    const [recentProofs, setRecentProofs] = useState<AuditProof[]>(initialProofs);

    useEffect(() => {
        // Simulate initial connection to RPC node
        const timer = setTimeout(() => {
            setIsConnecting(false);
            setNetworkStatus("devnet"); // Representing a hackathon demo state
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const verifyProof = async (hash: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const isValid = recentProofs.some(p => p.dataHash === hash);
                resolve(isValid);
            }, 800); // Simulate network latency
        });
    };

    const logAccess = (action: string, actor: string) => {
        const newProof: AuditProof = {
            id: `prf-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            action,
            actor,
            dataHash: generateMockHash(),
            status: "pending"
        };

        setRecentProofs(prev => [newProof, ...prev].slice(0, 10)); // Keep last 10

        // Simulate transaction confirmation
        setTimeout(() => {
            setRecentProofs(prev => prev.map(p =>
                p.id === newProof.id ? { ...p, status: "verified" } as AuditProof : p
            ));
        }, 2000);
    };

    return (
        <SolanaContext.Provider value={{
            isConnecting,
            networkStatus,
            recentProofs,
            verifyProof,
            logAccess
        }}>
            {children}
        </SolanaContext.Provider>
    );
}

export function useSolana() {
    const context = useContext(SolanaContext);
    if (context === undefined) {
        throw new Error("useSolana must be used within a SolanaProvider");
    }
    return context;
}
