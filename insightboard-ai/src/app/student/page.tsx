import EngagementSummary from "@/components/student/EngagementSummary";
import AIRecapCard from "@/components/student/AIRecapCard";
import ReflectionFlow from "@/components/student/ReflectionFlow";
import SessionHistory from "@/components/student/SessionHistory";

export default function StudentDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                    Student <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="text-muted mt-1">
                    Welcome back! Here&apos;s your learning summary for the latest session.
                </p>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <EngagementSummary />
                    <SessionHistory />
                </div>
                <div className="space-y-6">
                    <ReflectionFlow />
                    <AIRecapCard />
                </div>
            </div>

            {/* Privacy note */}
            <div className="mt-8 glass-card p-4 flex items-center gap-3 border-success/15">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success flex-shrink-0">
                    🔒
                </div>
                <p className="text-xs text-muted">
                    <strong className="text-foreground">Your Privacy:</strong> Your engagement data is never shared individually with your teacher. Reflections are voluntary and anonymous. You can delete your data anytime from <a href="/privacy" className="text-accent-light hover:underline">Privacy Settings →</a>
                </p>
            </div>
        </div>
    );
}
