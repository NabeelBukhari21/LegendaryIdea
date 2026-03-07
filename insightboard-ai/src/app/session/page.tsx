import SlideTimeline from "@/components/session/SlideTimeline";
import EngagementOverlay from "@/components/session/EngagementOverlay";
import SlideDetail from "@/components/session/SlideDetail";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function SessionPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Session <span className="gradient-text">Timeline</span>
                    </h1>
                    <p className="text-muted mt-1">
                        Session 5 — Neural Networks Deep Dive · Mar 6, 2026
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="info">Backboard Sync</Badge>
                    <Badge variant="default">Presage Detection</Badge>
                    <Button href="/teacher" variant="ghost" size="sm">← Back to Dashboard</Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <SlideTimeline />
                </div>
                <div className="lg:col-span-3 space-y-6">
                    <EngagementOverlay />
                    <SlideDetail />
                </div>
            </div>
        </div>
    );
}
