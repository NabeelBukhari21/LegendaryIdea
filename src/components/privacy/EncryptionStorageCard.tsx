"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/MotionKit";

export default function EncryptionStorageCard() {
    const layers = [
        {
            layer: "In Transit",
            protocol: "TLS 1.3",
            detail: "All data transmitted between client devices, API servers, and storage is encrypted using TLS 1.3. No plaintext data is ever sent over the network.",
            icon: "🔐",
        },
        {
            layer: "At Rest",
            protocol: "AES-256",
            detail: "Engagement scores, reflections, and AI outputs are encrypted at rest using AES-256 in cloud storage. Encryption keys are managed via a hardware security module (HSM).",
            icon: "💾",
        },
        {
            layer: "Processing",
            protocol: "On-device (MediaPipe)",
            detail: "Raw media is processed entirely on the student's device. Engagement scores are computed locally — raw video/audio never reaches our servers.",
            icon: "📱",
        },
        {
            layer: "Audit Layer",
            protocol: "Solana (hashes only)",
            detail: "Cryptographic hashes (SHA-256) of audit events are written to Solana for tamper-evident verification. No student content, metadata, or identifiers are stored on-chain.",
            icon: "⛓️",
        },
    ];

    return (
        <Reveal delay={0.1} duration={0.6}>
            <Card className="relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-36 h-36 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-accent/15 ring-1 ring-accent/20 flex items-center justify-center text-lg">🔐</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Encrypted Off-Chain Storage</h3>
                            <p className="text-xs text-muted">Student data is encrypted at every layer — on-chain stores only verification hashes</p>
                        </div>
                    </div>

                    <StaggerContainer delay={0.2} stagger={0.1}>
                        <div className="space-y-2.5">
                            {layers.map((l, i) => (
                                <StaggerItem key={i}>
                                    <div className="glass-card p-4 bg-white/[0.01] border-white/5 hover:bg-white/[0.03] transition-all">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl flex-shrink-0 mt-0.5">{l.icon}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-bold text-foreground">{l.layer}</h4>
                                                    <Badge size="sm">{l.protocol}</Badge>
                                                </div>
                                                <p className="text-xs text-muted leading-relaxed">{l.detail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </div>
                    </StaggerContainer>

                    {/* Architecture diagram */}
                    <Reveal delay={0.5} direction="up">
                        <div className="mt-4 glass-card p-4 bg-white/[0.02] border-white/5">
                            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Storage Architecture</p>
                            <div className="flex items-center gap-2 text-xs text-muted justify-center flex-wrap">
                                <span className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent-light font-mono text-[10px]">Student Device</span>
                                <span className="text-white/20">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-success/10 text-success font-mono text-[10px]">TLS 1.3</span>
                                <span className="text-white/20">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-warning/10 text-warning font-mono text-[10px]">AES-256 Storage</span>
                                <span className="text-white/20">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">Solana (hash only)</span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </Card>
        </Reveal>
    );
}
