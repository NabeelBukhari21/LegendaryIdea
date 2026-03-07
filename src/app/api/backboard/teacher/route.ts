import { NextResponse } from 'next/server';
import { getTeacherMasterThreadId, queryBackboardJSON, StudentAtRiskProfile } from '@/lib/backboard-service';

interface TeacherDashboardResponse {
    atRiskProfiles: StudentAtRiskProfile[];
    activeTeacherRecommendations: string[];
}

export async function GET() {
    try {
        const token = process.env.BACKBOARD_API_KEY;
        if (!token) {
            return NextResponse.json({ error: "Missing BACKBOARD_API_KEY" }, { status: 500 });
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
