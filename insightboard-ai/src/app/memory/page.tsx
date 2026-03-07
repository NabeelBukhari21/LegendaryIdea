import ConfusionPatterns from "@/components/memory/ConfusionPatterns";
import TrendChart from "@/components/memory/TrendChart";
import PatternCard from "@/components/memory/PatternCard";
import Button from "@/components/ui/Button";

export default function MemoryPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Memory <span className="gradient-text">Insights</span>
                    </h1>
                    <p className="text-muted mt-1">
                        Recurring confusion patterns across sessions — informing better teaching
                    </p>
                </div>
                <Button href="/teacher" variant="ghost" size="sm">← Back to Dashboard</Button>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                <ConfusionPatterns />
                <div className="space-y-6">
                    <TrendChart />
                    <PatternCard />
                </div>
            </div>

            {/* Info note */}
            <div className="mt-8 glass-card p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent-light flex-shrink-0">
                    ℹ️
                </div>
                <p className="text-xs text-muted">
                    <strong className="text-foreground">How Memory Works:</strong> InsightBoard AI identifies topics that repeatedly cause engagement drops across sessions. These patterns are used to generate proactive teaching suggestions — never to evaluate individual students.
                </p>
            </div>
        </div>
    );
}
