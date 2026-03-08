"use client";
import { formatPercentValue } from "@/lib/formatters";

import React from "react";

interface ProgressBarProps {
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    className?: string;
}

function getProgressColor(pct: number): string {
    if (pct >= 80) return "bg-success";
    if (pct >= 60) return "bg-warning";
    return "bg-danger";
}

export default function ProgressBar({
    value,
    max = 100,
    size = "md",
    showLabel = false,
    className = "",
}: ProgressBarProps) {
    const pct = Math.min((value / max) * 100, 100);
    const heights: Record<string, string> = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`flex-1 rounded-full bg-white/5 overflow-hidden ${heights[size]}`}>
                <div
                    className={`${heights[size]} rounded-full transition-all duration-700 ease-out ${getProgressColor(pct)}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showLabel && (
                <span className="text-xs font-semibold text-muted min-w-[3ch]">{formatPercentValue(Math.round(pct))}</span>
            )}
        </div>
    );
}
