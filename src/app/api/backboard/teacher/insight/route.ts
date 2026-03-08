import { formatPercentValue } from "@/lib/formatters";
import { NextResponse } from 'next/server';
import { getTeacherMasterThreadId, queryBackboardJSON } from '@/lib/backboard-service';
import { z } from 'zod';

const RequestSchema = z.object({
    sessionTitle: z.string(),
    slideTopic: z.string(),
    dipPercentage: z.number(),
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

        const { sessionTitle, slideTopic, dipPercentage, reasons } = parsed.data;
        // Use the Master Thread so the insight is grounded in historical class performance
        const threadId = await getTeacherMasterThreadId();

        const prompt = `
            Analyze this specific session dip event against the historical class memory.
            Context:
            - Session: ${sessionTitle}
            - Slide Focus: ${slideTopic}
            - Engagement Drop: ${formatPercentValue(dipPercentage)}
            - Student Reported Reasons: ${reasons.join(", ")}

            Generate a targeted learning breakdown and tactical recommendation for the teacher.
            Provide a strictly formatted JSON object matching this schema exactly:
            {
                "recommendation": {
                    "title": "String",
                    "description": "String",
                    "steps": ["Step 1", "Step 2", "Step 3"],
                    "type": "content" | "pacing" | "interaction" | "assessment",
                    "confidence": number (0-100),
                    "basedOn": "Brief rationale citing memory"
                },
                "postSlide4": {
                    "insight": "Observation on immediate slide aftermath",
                    "impact": "Predicted impact on next slide"
                },
                "feedbackSummary": "Brief aggregation of the student feedback."
            }
        `;

        const result = await queryBackboardJSON<any>(threadId, prompt);

        if (!result) {
            return NextResponse.json({ error: "Failed to parse Backboard response" }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Failed to fetch teacher insight from Backboard:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
