import React from "react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
    accentColor: string;
}

export default function FeatureCard({ icon, title, description, badge, accentColor }: FeatureCardProps) {
    return (
        <div className="glass-card p-8 group">
            <div className={`w-12 h-12 rounded-xl ${accentColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-muted mb-3">{badge}</span>
            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted text-sm leading-relaxed">{description}</p>
        </div>
    );
}
