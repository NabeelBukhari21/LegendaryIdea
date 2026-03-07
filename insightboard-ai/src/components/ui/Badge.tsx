"use client";

import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "danger" | "info";
    size?: "sm" | "md";
    className?: string;
}

const variantStyles: Record<string, string> = {
    default: "bg-accent/15 text-accent-light border-accent/20",
    success: "bg-success/15 text-success border-success/20",
    warning: "bg-warning/15 text-warning border-warning/20",
    danger: "bg-danger/15 text-danger border-danger/20",
    info: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

export default function Badge({ children, variant = "default", size = "sm", className = "" }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border font-medium ${size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
                } ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
