import { formatPercentValue } from "@/lib/formatters";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
    if (!apiKey) {
        return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { type, payload } = body;

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.5-flash as the default model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        if (type === "student-insight") {
            const prompt = `
You are an AI learning copilot designed to help students who have just experienced confusion during a lecture.
The student reported confusion during the following class segment:
- Session: ${payload.sessionTitle}
- Slide/Topic: ${payload.slideTopic}
- Student's reported reasons for confusion: ${payload.reasons.join(", ")}

Your goal is to provide a highly supportive, personalized JSON response with the following keys:
1. "recap": A 2-sentence empathetic recap of the core concept that acknowledges their confusion.
2. "explanation": A simpler, clear explanation of the topic using an analogy if possible (3-4 sentences max).
3. "workedExample": An object with "problem" (string), "steps" (array of strings), and "answer" (string).
4. "reviewQuestions": An array of exactly 3 objects, each with "question", "options" (array of 4 strings), "correctAnswer" (exact string from options), and "explanation" (1-2 sentences).

Respond ONLY with valid JSON. Do not include markdown blocks like \`\`\`json. Valid JSON only.
`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Clean up potential markdown formatting
            const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const data = JSON.parse(cleanedText);

            return NextResponse.json(data);
        }

        if (type === "teacher-insight") {
            const prompt = `
You are an AI teaching assistant analyzing class engagement data.
During the session "${payload.sessionTitle}", specifically on the slide "${payload.slideTopic}", there was a significant engagement dip (${formatPercentValue(payload.dipPercentage)} drop).
Aggregated student feedback indicates the primary reasons for confusion were: ${payload.reasons.join(", ")}.

Your goal is to provide a highly actionable, supportive JSON response with the following keys for the teacher:
1. "recommendation": An object with:
   - "title": A short, punchy title for the intervention (e.g., "Add Visual Scaffolding").
   - "description": A 2-sentence explanation of why this intervention helps.
   - "steps": An array of 3 brief, actionable steps the teacher can take in the next class.
2. "postSlide4": An object with:
   - "insight": A 1-sentence observation about how the class recovered (or didn't) after this slide.
   - "impact": A metric-driven statement (e.g., "30% of students remained disengaged until the end").
3. "feedbackSummary": A concise, 1-2 sentence aggregated summary of why students struggled based on the input reasons.

Respond ONLY with valid JSON. Do not include markdown blocks like \`\`\`json. Valid JSON only.
`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Clean up potential markdown formatting
            const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const data = JSON.parse(cleanedText);

            return NextResponse.json(data);
        }

        if (type === "memory-insight") {
            const prompt = `
You are an AI teaching assistant analyzing class engagement data over multiple sessions.
The teacher has taught ${payload.sessionCount} sessions.
Aggregated data shows these recurring confusion topics: ${payload.recurringTopics.join(", ")}.
There is a distinct class-wide pattern: When shifting from visual examples to abstract math notation, engagement drops significantly.

Your goal is to provide a highly actionable, concise JSON response with the following keys for the teacher's memory insights dashboard:
1. "classPattern": An object with:
   - "quote": A 1-sentence analytical quote summarizing the main learning pattern.
   - "detail": A 2-sentence explanation of why this happens and confirming it's a delivery issue, not a student capability issue.
   - "actionable": A 1-sentence actionable tip for future sessions.
2. "recurringConfusion": An array of exactly ${payload.recurringTopics.length} objects, each with:
   - "topic": The input topic name.
   - "suggestedAction": A 1-sentence specific teaching suggestion for this topic based on typical pedagogical strategies.

Respond ONLY with valid JSON. Do not include markdown blocks like \`\`\`json. Valid JSON only. Keep outputs extremely concise and helpful.
`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const data = JSON.parse(cleanedText);

            return NextResponse.json(data);
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to generate AI content" }, { status: 500 });
    }
}
