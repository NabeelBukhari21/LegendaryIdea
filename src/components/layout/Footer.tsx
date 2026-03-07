import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#0a0e1a]/60 backdrop-blur-sm mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/30">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold">
                                <span className="text-foreground">Insight</span>
                                <span className="gradient-text">Board</span>
                                <span className="text-muted text-sm font-medium ml-1">AI</span>
                            </span>
                        </div>
                        <p className="text-muted text-sm leading-relaxed max-w-md">
                            A privacy-first classroom learning copilot. Empowering teachers with aggregated insights and students with personalized support — built on trust and transparency.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Platform</h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: "/teacher", label: "Teacher Dashboard" },
                                { href: "/student", label: "Student Dashboard" },
                                { href: "/session", label: "Session Timeline" },
                                { href: "/memory", label: "Memory Insights" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-muted text-sm hover:text-accent-light transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Trust</h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: "/privacy", label: "Privacy & Audit" },
                                { href: "#", label: "Data Policy" },
                                { href: "#", label: "Terms of Use" },
                                { href: "#", label: "Contact" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-muted text-sm hover:text-accent-light transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted">
                        © 2026 InsightBoard AI. Privacy-first learning intelligence.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted">
                        <span>🔒 Privacy-First</span>
                        <span>🧠 AI-Powered</span>
                        <span>📊 Aggregated Only</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
