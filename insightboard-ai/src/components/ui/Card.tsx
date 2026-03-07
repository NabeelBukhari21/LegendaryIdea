"use client";

import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    onClick?: () => void;
}

export default function Card({ children, className = "", hover = true, glow = false, onClick }: CardProps) {
    return (
        <div
            className={`glass-card p-6 ${hover ? "" : "hover:transform-none hover:border-[rgba(99,102,241,0.12)]"} ${glow ? "glow" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
