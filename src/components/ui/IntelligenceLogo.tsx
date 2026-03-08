import React from 'react';

export default function IntelligenceLogo({ className = "", size = 200 }: { className?: string, size?: number }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            {/* Ambient Base Glow */}
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="absolute inset-10 bg-purple-500/30 blur-2xl rounded-full mix-blend-screen" />

            <svg
                width={size}
                height={size}
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            >
                {/* 1. Outer Ethereal Ring */}
                <circle cx="100" cy="100" r="90" stroke="url(#ringGradientOuter)" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" className="origin-center animate-[spin_40s_linear_infinite]" />

                {/* 2. Primary Orbital Path */}
                <circle cx="100" cy="100" r="75" stroke="url(#ringGradientMain)" strokeWidth="2" strokeDasharray="100 20" className="origin-center animate-[spin_20s_ease-in-out_infinite_reverse]" />

                {/* 3. Neural Nodes (Tri-force arrangement) */}
                <g className="origin-center animate-[spin_30s_linear_infinite]">
                    {/* Node 1 */}
                    <circle cx="100" cy="25" r="4" fill="#60A5FA" />
                    <circle cx="100" cy="25" r="8" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
                    <path d="M 100 33 L 100 65" stroke="#3B82F6" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />

                    {/* Node 2 */}
                    <circle cx="35" cy="137" r="4" fill="#C084FC" />
                    <circle cx="35" cy="137" r="8" stroke="#A855F7" strokeWidth="1" opacity="0.6" />
                    <path d="M 42 133 L 69 118" stroke="#A855F7" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />

                    {/* Node 3 */}
                    <circle cx="165" cy="137" r="4" fill="#34D399" />
                    <circle cx="165" cy="137" r="8" stroke="#10B981" strokeWidth="1" opacity="0.6" />
                    <path d="M 158 133 L 131 118" stroke="#10B981" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
                </g>

                {/* 4. The Intelligence Iris (Center) */}
                <circle cx="100" cy="100" r="45" fill="black" stroke="url(#irisGradient)" strokeWidth="3" opacity="0.8" />
                <circle cx="100" cy="100" r="35" fill="url(#coreGradient)" opacity="0.3" className="animate-pulse" />

                {/* Center "IB" Monogram / Eye Core */}
                <path d="M 100 85 C 110 85 120 95 120 100 C 120 105 110 115 100 115 C 90 115 80 105 80 100 C 80 95 90 85 100 85 Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8" />
                <circle cx="100" cy="100" r="6" fill="white" className="animate-[pulse_2s_ease-in-out_infinite]" />
                <circle cx="100" cy="100" r="14" stroke="#60A5FA" strokeWidth="1" opacity="0.8" strokeDasharray="1 3" className="origin-center animate-[spin_5s_linear_infinite]" />

                {/* Definitions */}
                <defs>
                    <linearGradient id="ringGradientOuter" x1="10" y1="10" x2="190" y2="190" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="ringGradientMain" x1="190" y1="10" x2="10" y2="190" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                    <linearGradient id="irisGradient" x1="55" y1="55" x2="145" y2="145" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="50%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                    <radialGradient id="coreGradient" cx="100" cy="100" r="35" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    );
}
