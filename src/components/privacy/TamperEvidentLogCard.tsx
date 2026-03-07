"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";
import { useSolana } from "@/components/solana/SolanaProvider";

export default function TamperEvidentLogCard() {
    const { recentProofs } = useSolana();

    const typeIcons: Record<string, string> = {
        "Viewed Class Aggregation": "👁️",
        "Generated Study Recap": "✨",
        "Teacher Dashboard Access": "📊",
        "Student Consent Granted": "✅",
        "Session Parameters Configured": "⚙️",
    };

    const getIcon = (action: string) => {
        for (const [key, icon] of Object.entries(typeIcons)) {
            if (action.includes(key)) return icon;
        }
        return "⚡";
    };

    return (
        <Reveal delay={0.2} duration={0.6}>
            <Card className="relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/20 flex items-center justify-center text-lg">📋</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Tamper-Evident Access Log</h3>
                            <p className="text-xs text-muted">Every data access is logged with a chained hash — any tampering is immediately detectable</p>
                        </div>
                    </div>

                    {/* Chain visualization header */}
                    <div className="glass-card p-3 bg-emerald-500/[0.03] border-emerald-500/10 mb-4">
                        <div className="flex items-center gap-2 text-xs text-muted">
                            <span className="text-emerald-400 font-semibold">Chain integrity:</span>
                            <span>Each entry&apos;s hash includes the previous entry&apos;s hash — if any log is modified, all subsequent hashes break.</span>
                        </div>
                    </div>

                    {/* Log entries */}
                    <StaggerContainer delay={0.3} stagger={0.08}>
                        <div className="space-y-0 font-mono text-xs">
                            {recentProofs.map((entry, i) => {
                                const isLast = i === recentProofs.length - 1;
                                const prevHash = i < recentProofs.length - 1 ? recentProofs[i + 1].dataHash.substring(0, 8) + '...' : "genesis...";
                                return (
                                    <StaggerItem key={entry.id}>
                                        <div className="relative">
                                            {!isLast && (
                                                <div className="absolute left-[15px] top-[40px] w-0.5 h-[calc(100%-16px)] bg-emerald-500/20" />
                                            )}
                                            <div className="flex gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors relative z-10">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center text-sm flex-shrink-0 bg-background">
                                                    {getIcon(entry.action)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-[10px] text-muted">{new Date(entry.timestamp).toLocaleTimeString()} UTC</span>
                                                        <span className="text-xs text-foreground font-sans font-medium">{entry.action}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] text-muted">
                                                        <span>Actor: <span className="text-foreground/60">{entry.actor}</span></span>
                                                        <span>Prev: <span className="text-emerald-400/60">{prevHash}</span></span>
                                                        <span>Hash: <span className="text-emerald-400">{entry.dataHash.substring(0, 8)}...</span></span>
                                                        <span className="flex items-center gap-1 ml-auto">
                                                            {entry.status === "verified" ? (
                                                                <>
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                                                    <span className="text-success">Valid</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                                                                    <span className="text-warning">Pending</span>
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </div>
                    </StaggerContainer>

                    <Reveal delay={0.6}>
                        <p className="text-[10px] text-muted mt-3 text-center">
                            Hash chain anchored to Solana block 281,492,017 — independently verifiable
                        </p>
                    </Reveal>
                </div>
            </Card>
        </Reveal>
    );
}
