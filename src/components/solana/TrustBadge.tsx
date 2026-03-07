"use client";

import React, { useState } from "react";
import { useSolana } from "@/components/solana/SolanaProvider";

export default function TrustBadge() {
    const { isConnecting, networkStatus, recentProofs } = useSolana();
    const [isHovered, setIsHovered] = useState(false);

    if (isConnecting) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 opacity-50 cursor-default">
                <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-medium text-emerald-400">Verifying chain...</span>
            </div>
        );
    }

    const latestProof = recentProofs.filter(p => p.status === "verified")[0];

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 cursor-pointer hover:bg-success/15 transition-colors">
                <span className="text-[10px] font-bold text-success uppercase tracking-wider">Secured by Solana</span>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                </div>
            </div>

            {isHovered && latestProof && (
                <div className="absolute top-full right-0 mt-2 w-64 glass-card p-3 border-emerald-500/20 z-50 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Latest Audit Proof</span>
                        <span className="text-[10px] text-muted">{networkStatus}</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-foreground font-medium truncate">{latestProof.action}</p>
                        <p className="text-[10px] text-muted font-mono truncate">Hash: {latestProof.dataHash}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <span className="text-[10px] text-muted">{new Date(latestProof.timestamp).toLocaleTimeString()} UTC</span>
                            <span className="text-[10px] text-success font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                Verified
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
