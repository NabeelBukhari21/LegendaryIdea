import { NextResponse } from 'next/server';
import { getStudentThreadId, queryBackboardJSON, StudentSupportAdvice } from '@/lib/backboard-service';

interface StudentDashboardResponse {
    studentSupportAdvice: StudentSupportAdvice[];
}

export async function GET(req: Request) {
    try {
        const token = process.env.BACKBOARD_API_KEY;
        const useMock = process.env.MOCK_BACKBOARD === "true" || !token;

        if (useMock) {
            return NextResponse.json({
                studentSupportAdvice: [
                    { id: "adv-1", pattern: "Struggles with notation", advice: "Review the math symbols glossary before class", confidence: 92 },
                    { id: "adv-2", pattern: "Loses focus after 20 mins", advice: "Take a 5 minute stretch break", confidence: 85 }
                ]
            });
        }

        const url = new URL(req.url);
        let studentId = url.searchParams.get("id");
        if (!studentId) {
            studentId = "s1"; // Default for demo routing
        }

        const threadId = await getStudentThreadId(studentId);
        const prompt = `
            Synthesize the stored memory for this individual student into actionable learning patterns.
            CRITICAL: Use your 'fetch_student_aggregate_metrics' tool to verify raw engagement for this student before drafting advice.
            Provide 'studentSupportAdvice', an array of objects representing specific learning behaviors and advice. 
            Format strictly as: { id: string, pattern: string, advice: string, confidence: number (0-100) }

            If memory is empty, provide plausible baseline advice.
            Respond strictly with a JSON object matching this schema.
        `;

        const result = await queryBackboardJSON<StudentDashboardResponse>(threadId, prompt);

        if (!result) {
            return NextResponse.json({ error: "Failed to parse Backboard response" }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Failed to fetch student dashboard data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
