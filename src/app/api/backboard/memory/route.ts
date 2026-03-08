import { NextResponse } from 'next/server';
import { getTeacherMasterThreadId, queryBackboardJSON, CrossSessionMemory } from '@/lib/backboard-service';

interface MemoryInsightsResponse {
    crossSessionPatterns: CrossSessionMemory[];
    disengagementWindows: Array<{ time: string, occurrences: number, primaryCause: string }>;
}

export async function GET() {
    try {
        const token = process.env.BACKBOARD_API_KEY;
        const useMock = process.env.MOCK_BACKBOARD === "true" || !token;

        if (useMock) {
            return NextResponse.json({
                crossSessionPatterns: [
                    { patternId: "pat-1", topic: "Backpropagation Math", occurrences: 4, sessions: ["Session 1", "Session 2"], severity: "high", trend: "increasing", avgEngagementDrop: 15 },
                    { patternId: "pat-2", topic: "Activation Functions", occurrences: 2, sessions: ["Session 1"], severity: "medium", trend: "stable", avgEngagementDrop: 8 }
                ],
                disengagementWindows: [
                    { time: "Minute 15-20", occurrences: 3, primaryCause: "Heavy notation without visual anchor" }
                ]
            });
        }

        const masterThreadId = await getTeacherMasterThreadId();
        const prompt = `
            Synthesize all class sessions into long-term memory patterns. 
            CRITICAL: Use your 'fetch_class_timeline' tool (e.g., daysBack: 30) to get hard evidence of dip events before generating the response.
            Provide:
            1. 'crossSessionPatterns': An array of topics that repeatedly cause confusion. Each object must have:
               { patternId: string, topic: string, occurrences: number, sessions: string[], severity: "high"|"medium"|"low", trend: "increasing"|"stable"|"decreasing", avgEngagementDrop: number }
            2. 'disengagementWindows': Aggregate the typical times (e.g. "15-20 min") when the class drops focus. Each object must have:
               { time: string, occurrences: number, primaryCause: string }

            If memory is empty, generate realistic baseline data based on typical learning curves.
            Respond strictly with a JSON object. No raw text.
        `;

        const result = await queryBackboardJSON<MemoryInsightsResponse>(masterThreadId, prompt);

        if (!result) {
            return NextResponse.json({ error: "Failed to parse Backboard response" }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Failed to fetch memory insights data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
