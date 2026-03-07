"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    href?: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

const variantStyles: Record<string, string> = {
    primary:
        "bg-accent hover:bg-accent-light text-white shadow-lg shadow-accent/25 hover:shadow-accent/40",
    secondary:
        "bg-white/5 hover:bg-white/10 text-foreground border border-white/10 hover:border-white/20",
    ghost: "text-muted hover:text-foreground hover:bg-white/5",
    danger:
        "bg-danger/15 hover:bg-danger/25 text-danger border border-danger/20",
};

const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-8 py-3.5 text-base rounded-xl",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    href,
    onClick,
    className = "",
    disabled = false,
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const combinedClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClass}>
                {children}
            </Link>
        );
    }

    return (
        <button className={combinedClass} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}
