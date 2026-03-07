import ClassOverview from "@/components/teacher/ClassOverview";
import EngagementChart from "@/components/teacher/EngagementChart";
import SlideBySlideChart from "@/components/teacher/SlideBySlideChart";
import FeedbackReasonsCard from "@/components/teacher/FeedbackReasonsCard";
import RecommendationCard from "@/components/teacher/RecommendationCard";
import AtRiskAlert from "@/components/teacher/AtRiskAlert";
import ZoneHeatmap from "@/components/teacher/ZoneHeatmap";
import PostSlide4Insight from "@/components/teacher/PostSlide4Insight";
import TopWeakTopicCard from "@/components/teacher/TopWeakTopicCard";
import BestInterventionCard from "@/components/teacher/BestInterventionCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { TeacherInsightProvider } from "@/components/teacher/TeacherInsightProvider";

export default function TeacherDashboard() {
    return (
        <TeacherInsightProvider>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* ── Header ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                                Teacher <span className="gradient-text">Dashboard</span>
                            </h1>
                            <Badge variant="success" size="md">
                                🟢 Real Backboard Data
                            </Badge>
                        </div>
                        <p className="text-muted">
                            Session 5 — Neural Networks Deep Dive · Mar 6, 2026 · 21 students
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
                        <Button href="/memory" variant="secondary" size="sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            Memory Insights
                        </Button>
                        <Button href="/privacy" variant="ghost" size="sm">
                            🔒 Privacy
                        </Button>
                    </div>
                </div>

                {/* ── Section 1: Overview Stats ───────────── */}
                <ClassOverview />

                {/* ── Section 2: Engagement Analysis ──────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-accent" />
                        <h2 className="text-xl font-bold text-foreground">Engagement Analysis</h2>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <EngagementChart />
                        <SlideBySlideChart />
                    </div>
                </div>

                {/* ── Section 3: Slide 4 Deep Dive ───────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-danger" />
                        <h2 className="text-xl font-bold text-foreground">Slide 4 Deep Dive</h2>
                        <Badge variant="danger" size="sm">Key Moment</Badge>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <FeedbackReasonsCard />
                        <PostSlide4Insight />
                    </div>
                </div>

                {/* ── Section 4: Classroom Insights ──────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-warning" />
                        <h2 className="text-xl font-bold text-foreground">Classroom Insights</h2>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <ZoneHeatmap />
                        <AtRiskAlert />
                    </div>
                </div>

                {/* ── Section 5: AI Recommendations ──────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-success" />
                        <h2 className="text-xl font-bold text-foreground">AI Recommendations</h2>
                        <Badge variant="success" size="sm">Gemini-Powered</Badge>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <TopWeakTopicCard />
                        <RecommendationCard />
                    </div>
                </div>

                {/* ── Section 6: Best Intervention ────────── */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-accent-light" />
                        <h2 className="text-xl font-bold text-foreground">Top Action Plan</h2>
                        <Badge variant="default" size="sm">✦ Highest Impact</Badge>
                    </div>
                    <BestInterventionCard />
                </div>

                {/* ── Privacy Footer ──────────────────────── */}
                <div className="mt-10 glass-card p-5 flex items-start gap-4 border-success/15">
                    <div className="w-10 h-10 rounded-xl bg-success/10 ring-1 ring-success/20 flex items-center justify-center text-success flex-shrink-0 text-lg">
                        🔒
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground mb-1">Privacy-First Dashboard</p>
                        <p className="text-xs text-muted leading-relaxed">
                            All data shown on this page is <strong className="text-foreground">aggregated and anonymized</strong>. No raw student video, audio, or biometric data is ever displayed to teachers. Student identifiers are anonymized. Engagement data is used exclusively for <strong className="text-foreground">teaching improvement</strong> — never for grading or evaluation.{" "}
                            <a href="/privacy" className="text-accent-light hover:underline">View full privacy policy and audit trail →</a>
                        </p>
                    </div>
                </div>
            </div>
        </TeacherInsightProvider>
    );
}
