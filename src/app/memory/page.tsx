import RecurringConfusionCard from "@/components/memory/RecurringConfusionCard";
import DisengagementWindowsCard from "@/components/memory/DisengagementWindowsCard";
import CrossSessionTrend from "@/components/memory/CrossSessionTrend";
import TeachingFormatCard from "@/components/memory/TeachingFormatCard";
import MemoryTimelineCard from "@/components/memory/MemoryTimelineCard";
import MultiAgentInsightCard from "@/components/memory/MultiAgentInsightCard";
import ClassPatternCard from "@/components/memory/ClassPatternCard";
import StudentPatternExample from "@/components/memory/StudentPatternExample";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { MemoryInsightProvider } from "@/components/memory/MemoryInsightProvider";

export default function MemoryPage() {
    return (
        <MemoryInsightProvider>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* ── Header ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                                Memory <span className="gradient-text">Insights</span>
                            </h1>
                            <Badge variant="default" size="md">
                                📋 Backboard-Powered
                            </Badge>
                        </div>
                        <p className="text-muted">
                            Persistent intelligence across 5 sessions — patterns, trends, and recommendations that evolve
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button href="/teacher" variant="secondary" size="sm">
                            ← Teacher Dashboard
                        </Button>
                        <Button href="/session" variant="ghost" size="sm">
                            Session Timeline →
                        </Button>
                    </div>
                </div>

                {/* ── Memory summary stats ────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fade-in-up">
                    {[
                        { label: "Sessions Analyzed", value: "5", icon: "📚", color: "text-accent-light" },
                        { label: "Patterns Detected", value: "7", icon: "🔍", color: "text-warning" },
                        { label: "Interventions Tracked", value: "3", icon: "🛠️", color: "text-success" },
                        { label: "System Confidence", value: "91%", icon: "🧠", color: "text-accent-light" },
                    ].map((stat, i) => (
                        <Card key={i} className="text-center py-4" hover>
                            <span className="text-xl mb-1 block">{stat.icon}</span>
                            <div className={`text-2xl font-extrabold ${stat.color} mb-0.5`}>{stat.value}</div>
                            <div className="text-[10px] text-muted">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                {/* ── Section 1: Recurring Patterns ──────── */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-danger" />
                    <h2 className="text-xl font-bold text-foreground">Recurring Patterns</h2>
                    <Badge variant="danger" size="sm">Critical</Badge>
                </div>
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <RecurringConfusionCard />
                    <DisengagementWindowsCard />
                </div>

                {/* ── Section 2: Cross-Session Trends ────── */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-foreground">Cross-Session Trends</h2>
                </div>
                <div className="mb-8">
                    <CrossSessionTrend />
                </div>

                {/* ── Section 3: Class-Wide Insight ──────── */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-warning" />
                    <h2 className="text-xl font-bold text-foreground">Class-Wide Intelligence</h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <ClassPatternCard />
                    <StudentPatternExample />
                </div>

                {/* ── Section 4: Teaching Format Analysis ── */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-success" />
                    <h2 className="text-xl font-bold text-foreground">Teaching Format Analysis</h2>
                    <Badge variant="success" size="sm">5 sessions of data</Badge>
                </div>
                <div className="mb-8">
                    <TeachingFormatCard />
                </div>

                {/* ── Section 5: Memory Timeline ─────────── */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-accent-light" />
                    <h2 className="text-xl font-bold text-foreground">How InsightBoard Learned</h2>
                    <Badge variant="default" size="sm">Session Memory</Badge>
                </div>
                <div className="mb-8">
                    <MemoryTimelineCard />
                </div>

                {/* ── Section 6: Multi-Agent Summary ────── */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-foreground">Multi-Agent Intelligence</h2>
                    <Badge variant="success" size="sm">✦ Converged</Badge>
                </div>
                <MultiAgentInsightCard />

                {/* ── How Memory Works Footer ──────────── */}
                <div className="mt-10 glass-card p-5 flex items-start gap-4 border-accent/15">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center text-accent-light flex-shrink-0 text-lg">
                        🧠
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground mb-1">How Session Memory Works</p>
                        <p className="text-xs text-muted leading-relaxed">
                            InsightBoard AI remembers patterns across sessions using <strong className="text-foreground">Backboard</strong> for persistent memory, <strong className="text-foreground">MediaPipe</strong> for engagement detection, and <strong className="text-foreground">Gemini</strong> for content analysis.
                            Patterns are detected automatically when recurring signals appear. All data is <strong className="text-foreground">aggregated and anonymized</strong> — never used for grading or evaluation.{" "}
                            <a href="/privacy" className="text-accent-light hover:underline">View full privacy and audit trail →</a>
                        </p>
                    </div>
                </div>
            </div>
        </MemoryInsightProvider>
    );
}
