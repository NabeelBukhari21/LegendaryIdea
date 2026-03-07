import RetentionPolicy from "@/components/privacy/RetentionPolicy";
import AuditLog from "@/components/privacy/AuditLog";
import PrivacyControls from "@/components/privacy/PrivacyControls";
import Badge from "@/components/ui/Badge";

export default function PrivacyPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                    Privacy & <span className="gradient-text">Audit</span>
                </h1>
                <p className="text-muted mt-1">
                    Full transparency on data handling, retention, and your privacy controls.
                </p>
            </div>

            {/* Compliance badges */}
            <div className="glass-card p-5 mb-8 flex flex-wrap items-center gap-3 animate-fade-in-up">
                <span className="text-sm font-semibold text-foreground mr-2">Compliance:</span>
                <Badge variant="success" size="md">🔒 FERPA Aligned</Badge>
                <Badge variant="success" size="md">🇪🇺 GDPR Ready</Badge>
                <Badge variant="success" size="md">🛡️ COPPA Aware</Badge>
                <Badge variant="info" size="md">⛓️ Solana Audit Trail</Badge>
                <Badge variant="warning" size="md">🚫 No Surveillance</Badge>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <RetentionPolicy />
                    <PrivacyControls />
                </div>
                <div className="space-y-6">
                    <AuditLog />

                    {/* Core principles */}
                    <div className="glass-card p-6 animate-fade-in-up stagger-3">
                        <h3 className="text-lg font-bold text-foreground mb-4">Core Privacy Principles</h3>
                        <div className="space-y-3">
                            {[
                                {
                                    icon: "🔒",
                                    title: "No Raw Media Viewed by Teachers",
                                    desc: "Teacher dashboards only show aggregated metrics. Individual student video, audio, or biometric data is never accessible.",
                                },
                                {
                                    icon: "📊",
                                    title: "Aggregated by Default",
                                    desc: "All teacher-facing insights are aggregated across the class. Individual patterns are visible only to the student themselves.",
                                },
                                {
                                    icon: "💭",
                                    title: "Student Voice in the Loop",
                                    desc: "Student reflections are a core part of the intelligence loop. The AI learns from what students say, not just what it observes.",
                                },
                                {
                                    icon: "⛔",
                                    title: "No Grades from Engagement",
                                    desc: "Engagement data is never used for grading, discipline, or ranking. This is a learning support tool, not an evaluation tool.",
                                },
                                {
                                    icon: "🗑️",
                                    title: "Minimal Retention",
                                    desc: "Raw media is deleted within 24 hours. Students can delete their reflections and engagement data at any time.",
                                },
                            ].map((principle, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                                    <span className="text-xl flex-shrink-0 mt-0.5">{principle.icon}</span>
                                    <div>
                                        <h4 className="font-semibold text-foreground text-sm">{principle.title}</h4>
                                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{principle.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
