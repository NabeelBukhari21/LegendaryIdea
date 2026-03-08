import React from 'react';

interface GlowingLogoProps {
    variant?: 'navbar' | 'hero' | 'favicon';
    className?: string; // Standard tailwind sizing overrides if needed
    showText?: boolean;
    animated?: boolean;
}

export function GlowingLogo({ variant = 'navbar', className = "", showText = true, animated = true }: GlowingLogoProps) {
    // Determine base sizes
    let sizeClass = className;
    if (!className) {
        if (variant === 'hero') sizeClass = "w-28 h-28";
        else if (variant === 'navbar') sizeClass = "w-10 h-10";
        else if (variant === 'favicon') sizeClass = "w-full h-full";
    }

    // Determine complexity based on variant
    const isHero = variant === 'hero';
    const isFavicon = variant === 'favicon';

    return (
        <div className={`flex items-center gap-3.5 ${showText ? '' : 'justify-center'} group`}>
            <div className={`relative flex items-center justify-center shrink-0 ${sizeClass}`}>

                {/* ── Ambient Floating Glows ── */}
                {animated && !isFavicon && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-accent/40 via-blue-500/30 to-purple-500/40 blur-[12px] opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" style={{ animationDuration: '4s' }} />
                )}
                {!animated && !isFavicon && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-accent/30 to-blue-500/30 blur-[10px]" />
                )}

                {/* ── Main SVG Structure ── */}
                <svg
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 w-full h-full drop-shadow-2xl"
                >
                    <defs>
                        {/* Premium Neural Gradients */}
                        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" /> {/* slate-900 */}
                            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" /> {/* slate-800 */}
                        </linearGradient>

                        <linearGradient id="neonCyan" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" /> {/* cyan-500 */}
                            <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
                        </linearGradient>

                        <linearGradient id="neonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
                            <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
                        </linearGradient>

                        <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.7" /> {/* indigo-200 */}
                        </linearGradient>

                        <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        <filter id="heavyGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* ─────────────────────────────────────────────────────────────
                        LAYER 1: The Outer Shield / Grid 
                        ───────────────────────────────────────────────────────────── */}
                    {/* Dark Glass Hexagon */}
                    <path
                        d="M60 5 L108 32 L108 88 L60 115 L12 88 L12 32 Z"
                        fill="url(#shieldGrad)"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                        filter="url(#glass)"
                    />

                    {/* Rotating Dashed Orbital Ring (Hero only) */}
                    {isHero && animated && (
                        <circle
                            cx="60" cy="60" r="44"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                            strokeDasharray="4 6"
                            fill="none"
                            className="origin-center animate-[spin_20s_linear_infinite]"
                        />
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        LAYER 2: The Neural Nodes & Connections 
                        ───────────────────────────────────────────────────────────── */}
                    {/* Connecting paths indicating multi-agent intelligence */}
                    <path
                        d="M30 35 L60 60 L90 35 M30 85 L60 60 L90 85 M12 60 L60 60 L108 60"
                        stroke="rgba(59, 130, 246, 0.2)"
                        strokeWidth="2"
                    />

                    {/* Privacy / Guardrail Outer Ring */}
                    <circle cx="60" cy="60" r="32" stroke="url(#neonCyan)" strokeWidth="3" fill="none" opacity="0.6" />

                    {/* ─────────────────────────────────────────────────────────────
                        LAYER 3: The Holographic Knowledge Core
                        ───────────────────────────────────────────────────────────── */}
                    {/* Emerald intelligence data flowing in */}
                    <path
                        d="M60 28 A32 32 0 0 1 92 60"
                        stroke="url(#neonEmerald)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        className={animated ? "animate-pulse origin-center" : ""}
                        style={animated ? { animationDuration: '2s' } : {}}
                    />
                    <path
                        d="M60 92 A32 32 0 0 1 28 60"
                        stroke="url(#neonEmerald)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        className={animated ? "animate-pulse origin-center" : ""}
                        style={animated ? { animationDuration: '2.5s', animationDelay: '0.5s' } : {}}
                    />

                    {/* ─────────────────────────────────────────────────────────────
                        LAYER 4: The Monogram "IB"
                        ───────────────────────────────────────────────────────────── */}
                    <g transform="translate(60,60) scale(1) translate(-60,-60)">
                        {/* Dense glowing core behind the letters */}
                        <circle cx="60" cy="60" r="18" fill="url(#neonCyan)" opacity="0.3" filter="url(#heavyGlow)" />

                        {/* The 'I' */}
                        <rect x="44" y="46" width="6" height="28" rx="2" fill="url(#coreGlow)" />

                        {/* The 'B' in a modern, geometric tech-font style */}
                        <path
                            d="M 56 46 h 10 c 5.5 0 9 3 9 7 c 0 3 -2 5 -5 6 c 4 1 7 3.5 7 7.5 c 0 4.5 -4 7.5 -10 7.5 h -11 v -28 z m 6 11 h 3 c 2.5 0 4 -1 4 -3 c 0 -2 -1.5 -3 -4 -3 h -3 v 6 z m 0 11 h 4 c 2.5 0 4.5 -1 4.5 -3.5 c 0 -2.5 -2 -3.5 -4.5 -3.5 h -4 v 7 z"
                            fill="url(#coreGlow)"
                        />
                    </g>

                    {/* Tiny blinking data nodes */}
                    {animated && (
                        <>
                            <circle cx="90" cy="35" r="3" fill="#10b981" className="animate-ping" style={{ animationDuration: '3s' }} />
                            <circle cx="30" cy="85" r="3" fill="#3b82f6" className="animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                        </>
                    )}
                </svg>
            </div>

            {/* Typography */}
            {showText && !isFavicon && (
                <div className="flex flex-col">
                    <span className={`font-extrabold tracking-tight text-white leading-none ${isHero ? 'text-4xl' : 'text-xl'}`}>
                        InsightBoard<span className="text-emerald-400">.ai</span>
                    </span>
                    <span className={`font-medium text-slate-400 tracking-[0.2em] uppercase mt-1 ${isHero ? 'text-sm' : 'text-[0.65rem]'}`}>
                        Intelligence Loop
                    </span>
                </div>
            )}
        </div>
    );
}
