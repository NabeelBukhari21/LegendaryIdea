import { formatPercentValue } from "@/lib/formatters";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatEngagement(value: number): string {
    return `${formatPercentValue(value)}`;
}

export function getEngagementColor(value: number): string {
    if (value >= 80) return "text-emerald-400";
    if (value >= 60) return "text-amber-400";
    return "text-rose-400";
}

export function getEngagementBg(value: number): string {
    if (value >= 80) return "bg-emerald-500/20";
    if (value >= 60) return "bg-amber-500/20";
    return "bg-rose-500/20";
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
