import EngagementSummary from "@/components/student/EngagementSummary";
import FocusMomentsCard from "@/components/student/FocusMomentsCard";
import TopicBreakdownCard from "@/components/student/TopicBreakdownCard";
import ReflectionFlow from "@/components/student/ReflectionFlow";
import AIRecapCard from "@/components/student/AIRecapCard";
import WorkedExampleCard from "@/components/student/WorkedExampleCard";
import MiniQuizCard from "@/components/student/MiniQuizCard";
import StudyAdviceCard from "@/components/student/StudyAdviceCard";
import PatternInsightCard from "@/components/student/PatternInsightCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { StudentInsightProvider } from "@/components/student/StudentInsightProvider";

export default function StudentDashboard() {
    return (
        <StudentInsightProvider>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* ── Header ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                                Your <span className="gradient-text">Learning Hub</span>
                            </h1>
                            <Badge variant="success" size="md">
                                🟢 Real Backboard Data
                            </Badge>
                        </div>
                        <p className="text-muted">
                            Session 5 — Neural Networks Deep Dive · Great job showing up today! 🎉
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button href="/session" variant="secondary" size="sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Session Timeline
                        </Button>
                        <Button href="/privacy" variant="ghost" size="sm">
                            🔒 Your Privacy
                        </Button>
                    </div>
                </div>

                {/* ── Section 1: Engagement Journey ────────── */}
                <EngagementSummary />

                {/* ── Section 2: Focus Highlights ──────────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-success" />
                        <h2 className="text-xl font-bold text-foreground">Session Highlights</h2>
                    </div>
                    <FocusMomentsCard />
                </div>

                {/* ── Section 3: Topic Breakdown ──────────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-accent" />
                        <h2 className="text-xl font-bold text-foreground">Topic-by-Topic</h2>
                    </div>
                    <TopicBreakdownCard />
                </div>

                {/* ── Section 4: Reflection (Slide 4 Dip) ── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-warning" />
                        <h2 className="text-xl font-bold text-foreground">Reflection</h2>
                        <Badge variant="warning" size="sm">Slide 4</Badge>
                    </div>
                    <ReflectionFlow />
                </div>

                {/* ── Section 5: AI Recap & Learning Materials */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-success" />
                        <h2 className="text-xl font-bold text-foreground">Your Personalized Materials</h2>
                        <Badge variant="success" size="sm">✨ AI-Generated</Badge>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <AIRecapCard />
                        <WorkedExampleCard />
                    </div>
                </div>

                {/* ── Section 6: Mini Quiz ─────────────────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-accent-light" />
                        <h2 className="text-xl font-bold text-foreground">Quick Check</h2>
                        <Badge variant="default" size="sm">No grades — just for you</Badge>
                    </div>
                    <MiniQuizCard />
                </div>

                {/* ── Section 7: Study Advice & Pattern ────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-success" />
                        <h2 className="text-xl font-bold text-foreground">Your Growth Zone</h2>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <StudyAdviceCard />
                        <PatternInsightCard />
                    </div>
                </div>

                {/* ── Privacy Footer ──────────────────────── */}
                <div className="mt-10 glass-card p-5 flex items-start gap-4 border-accent/15">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center text-accent-light flex-shrink-0 text-lg">
                        🤝
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground mb-1">This Page Is Yours</p>
                        <p className="text-xs text-muted leading-relaxed">
                            Everything on this page is <strong className="text-foreground">private to you</strong>. Your teacher only sees aggregated, anonymous class-level data — never your individual engagement, reflections, or quiz answers. We&apos;re here to help you learn, not to evaluate you.{" "}
                            <a href="/privacy" className="text-accent-light hover:underline">Learn more about how we protect your data →</a>
                        </p>
                    </div>
                </div>
            </div>
        </StudentInsightProvider>
    );
}
