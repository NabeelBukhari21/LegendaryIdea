import { NextResponse } from 'next/server';
import { getStudentThreadId, queryBackboardJSON } from '@/lib/backboard-service';
import { z } from 'zod';

const RequestSchema = z.object({
    studentId: z.string().default("s1"),
    sessionTitle: z.string(),
    slideTopic: z.string(),
    reasons: z.array(z.string())
});

export async function POST(req: Request) {
    try {
        const token = process.env.BACKBOARD_API_KEY;
        if (!token) {
            return NextResponse.json({ error: "Missing BACKBOARD_API_KEY" }, { status: 500 });
        }

        const body = await req.json();
        const parsed = RequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
        }

        const { studentId, sessionTitle, slideTopic, reasons } = parsed.data;
        const threadId = await getStudentThreadId(studentId);

        const prompt = `
            Based on the student's historical memory in this thread, generate a personalized learning breakdown for the topic they struggled with.
            Context:
            - Session: ${sessionTitle}
            - Topic: ${slideTopic}
            - Reasons for struggle: ${reasons.join(", ")}

            Provide a strictly formatted JSON object matching this schema exactly:
            {
                "recap": "Brief 1-sentence recap of what the topic is.",
                "explanation": "A personalized explanation relating back to their known learning style / history.",
                "workedExample": {
                    "problem": "A simple problem string",
                    "steps": ["Step 1 string", "Step 2 string"],
                    "answer": "Final answer string"
                },
                "reviewQuestions": [
                    {
                        "question": "Question string",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correctAnswer": "Option B",
                        "explanation": "Why this is correct."
                    }
                ]
            }
        `;

        const result = await queryBackboardJSON<any>(threadId, prompt);

        if (!result) {
            return NextResponse.json({ error: "Failed to parse Backboard response" }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Failed to fetch student insight from Backboard:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
