"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TrustBadge from "@/components/solana/TrustBadge";
import { GlowingLogo } from "@/components/ui/GlowingLogo";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/live-demo", label: "Start Demo" },
    { href: "/student", label: "Student Insights" },
    { href: "/teacher", label: "Teacher Insights" },
    { href: "/session", label: "Session Replay" },
    { href: "/memory", label: "Memory" },
    { href: "/privacy", label: "Privacy" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <GlowingLogo showText={true} />
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? "text-accent-light bg-accent/10"
                                        : "text-muted hover:text-foreground hover:bg-white/5"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="ml-4 pl-4 border-l border-white/10">
                            <TrustBadge />
                        </div>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden text-muted hover:text-foreground transition-colors p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {mobileOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-white/5 bg-[#0a0e1a]/95 backdrop-blur-xl">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? "text-accent-light bg-accent/10"
                                        : "text-muted hover:text-foreground hover:bg-white/5"
                                        }`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
