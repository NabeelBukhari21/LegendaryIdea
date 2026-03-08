import { NextResponse } from 'next/server';
import { getTeacherMasterThreadId, queryBackboardJSON, StudentAtRiskProfile } from '@/lib/backboard-service';

interface TeacherDashboardResponse {
    atRiskProfiles: StudentAtRiskProfile[];
    activeTeacherRecommendations: string[];
}

export async function GET() {
    try {
        const token = process.env.BACKBOARD_API_KEY;
        const useMock = process.env.MOCK_BACKBOARD === "true" || !token;

        if (useMock) {
            return NextResponse.json({
                atRiskProfiles: [
                    { studentId: "s1", alias: "Jane D.", riskScore: 85, activeFlags: ["Missed 3 concepts", "Low engagement"], recommendedSupport: "Schedule 1:1 on Backpropagation" },
                    { studentId: "s2", alias: "Mark T.", riskScore: 65, activeFlags: ["Dropped off early"], recommendedSupport: "Review early slides" }
                ],
                activeTeacherRecommendations: [
                    "Slow down during mathematical notations",
                    "Add more visual diagrams to Slide 4"
                ]
            });
        }

        const masterThreadId = await getTeacherMasterThreadId();
        const prompt = `
            Based on the accumulated memory in this thread, analyze the class and provide:
            1. 'atRiskProfiles': An array of students who are consistently struggling. 
               CRITICAL: Use your 'fetch_student_aggregate_metrics' tool to retrieve actual engagement numbers for students like 's1' before responding.
               Format strictly as:
               { studentId: string, alias: string, riskScore: number (0-100), activeFlags: string[], recommendedSupport: string }
            2. 'activeTeacherRecommendations': An array of 2-3 specific strings advising the teacher on how to adjust upcoming lessons based on the class's repeated dip moments.

            If memory is mostly empty, return plausible baseline analysis.
            Respond strictly with a JSON object matching this schema. Do not pad with markdown.
        `;

        const result = await queryBackboardJSON<TeacherDashboardResponse>(masterThreadId, prompt);

        if (!result) {
            return NextResponse.json({ error: "Failed to parse Backboard response" }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Failed to fetch teacher dashboard data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
