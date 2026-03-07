import { NextResponse } from 'next/server';
import {
    backboardClient,
    getTeacherMasterThreadId,
    getStudentThreadId,
    getSessionThreadId
} from '@/lib/backboard-service';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Minimal validation of expected session summary
const IngestSchema = z.object({
    sessionId: z.string().optional(),
    slideSummary: z.array(z.any()),
    dipEvents: z.array(z.any()),
    studentSummaries: z.array(z.object({
        studentId: z.string(),
        alias: z.string(),
        avgEngagement: z.number()
    }))
});

export async function POST(req: Request) {
    try {
        const token = process.env.BACKBOARD_API_KEY;
        if (!token) {
            return NextResponse.json({ error: "Missing BACKBOARD_API_KEY" }, { status: 500 });
        }

        const body = await req.json();
        const parsed = IngestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
        }

        const { sessionId = "demo-session", slideSummary, dipEvents, studentSummaries } = parsed.data;

        // 1. Session Thread & Document Upload 
        // We create an ephemeral thread for the immediate session recap and ground it in a document
        const sessionThreadId = await getSessionThreadId(sessionId);

        // Write mock transcript to tmp to upload via Backboard Document API
        const tmpPath = path.join("/tmp", `slide-text-${sessionId}.txt`);
        const mockTranscript = `
        Session: Neural Networks Deep Dive
        Slide 4: Backpropagation Math - Explains the chain rule using partial derivatives. Heavy notation.
        Slide 5: Worked Example - Visualizes the flow of gradients backward through a 3-layer network.
        Slide 6: Common Pitfalls - Discusses vanishing gradients and sigmoid limitations.
        `;
        fs.writeFileSync(tmpPath, mockTranscript);

        // Upload the slide transcript to ground the Session Assistant
        await backboardClient.uploadDocumentToThread(sessionThreadId, tmpPath);

        // Generate immediate session recap via Session Analytics Assistant
        await backboardClient.addMessage(sessionThreadId, {
            content: `Analyze the uploaded slide transcript alongside these dip events: ${JSON.stringify(dipEvents)}. 
                      Generate a recap of where the class struggled the most according to the slide content.`,
            stream: false
        });

        // 2. Synthesize and write to Long-Term Memory (Teacher Master Thread)
        const masterThreadId = await getTeacherMasterThreadId();
        await backboardClient.addMessage(masterThreadId, {
            content: `New Session Completed. Please update your long-term memory.
                      Slides Summary: ${JSON.stringify(slideSummary)}
                      Dip Events: ${JSON.stringify(dipEvents)}
                      Overall Engagement Info: ${JSON.stringify(studentSummaries)}
                      
                      Store this conceptually. Next time I ask for at-risk profiles or active recommendations, 
                      use your tool calls to fetch hard numbers and combine them with this conceptual layout.`,
            stream: false
        });

        // 3. Update Long-Term Memory for individual students
        for (const student of studentSummaries) {
            const stuThreadId = await getStudentThreadId(student.studentId);
            await backboardClient.addMessage(stuThreadId, {
                content: `Update learning pattern memory for ${student.alias}. 
                          Session Average Engagement: ${student.avgEngagement}.`,
                stream: false
            });
        }

        return NextResponse.json({ success: true, message: "Session ingested and Document uploaded." });
    } catch (error: any) {
        console.error("Failed to ingest session:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
