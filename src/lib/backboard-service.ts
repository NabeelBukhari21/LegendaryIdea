import { BackboardClient, MessageRole } from "backboard-sdk";

export interface CrossSessionMemory {
    patternId: string;
    topic: string;
    occurrences: number;
    sessions: string[];
    severity: "high" | "medium" | "low";
    trend: "increasing" | "stable" | "decreasing";
    avgEngagementDrop: number;
}

export interface StudentAtRiskProfile {
    studentId: string;
    alias: string;
    riskScore: number;
    activeFlags: string[];
    recommendedSupport: string;
}

export interface StudentSupportAdvice {
    id: string;
    pattern: string;
    advice: string;
    confidence: number;
}

export const BACKBOARD_API_KEY = process.env.BACKBOARD_API_KEY;

if (!BACKBOARD_API_KEY) {
    console.warn("⚠️ BACKBOARD_API_KEY is missing from environment variables.");
}

export const backboardClient = new BackboardClient({
    apiKey: BACKBOARD_API_KEY || "mock-key",
});

const LONG_TERM_MEMORY_PROMPT = `You are the Long-Term Memory Assistant for InsightBoard AI.
Your job is to synthesize raw session metrics into persistent learning patterns, recovery strategies, and teaching recommendations over time.
You have access to tools to fetch deep analytics. When asked for insights, use your memory and tools.
Respond strictly in valid JSON format matching the requested schema.`;

const SESSION_ANALYTICS_PROMPT = `You are the Session Analytics Assistant for InsightBoard AI.
Your job is to immediately process a single completed session's data, including uploaded slide documents and engagement metrics.
Summarize the session and identify immediate takeaways.
Respond strictly in valid JSON format matching the requested schema.`;

const analyticsTools = [
    {
        type: "function",
        function: {
            name: "fetch_student_aggregate_metrics",
            description: "Fetches historical engagement and attendance data for a specific student.",
            parameters: {
                type: "object",
                properties: {
                    studentId: { type: "string", description: "The ID of the student to fetch metrics for." }
                },
                required: ["studentId"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "fetch_class_timeline",
            description: "Fetches raw dip events and recovery events for a specific historical duration.",
            parameters: {
                type: "object",
                properties: {
                    daysBack: { type: "number", description: "Number of days back to search." }
                },
                required: ["daysBack"]
            }
        }
    }
];

export interface ThreadRegistry {
    teacherMasterThreadId?: string;
    studentThreads: Record<string, string>;
    sessionThreads: Record<string, string>;
}

// In-memory demo registry (Prod = DB)
let globalThreadRegistry: ThreadRegistry = {
    teacherMasterThreadId: undefined,
    studentThreads: {},
    sessionThreads: {},
};

let memoryAssistantId: string | undefined = undefined;
let sessionAssistantId: string | undefined = undefined;

export async function getLongTermMemoryAssistant() {
    if (memoryAssistantId) return memoryAssistantId;
    const assistant = await backboardClient.createAssistant({
        name: "Long-Term Memory Assistant",
        system_prompt: LONG_TERM_MEMORY_PROMPT,
        tools: analyticsTools
    });
    memoryAssistantId = assistant.assistantId;
    return assistant.assistantId;
}

export async function getSessionAnalyticsAssistant() {
    if (sessionAssistantId) return sessionAssistantId;
    const assistant = await backboardClient.createAssistant({
        name: "Session Analytics Assistant",
        system_prompt: SESSION_ANALYTICS_PROMPT,
    });
    sessionAssistantId = assistant.assistantId;
    return assistant.assistantId;
}

export async function getTeacherMasterThreadId(): Promise<string> {
    if (globalThreadRegistry.teacherMasterThreadId) return globalThreadRegistry.teacherMasterThreadId;
    const assistantId = await getLongTermMemoryAssistant();
    const thread = await backboardClient.createThread(assistantId);
    globalThreadRegistry.teacherMasterThreadId = thread.threadId;
    return thread.threadId;
}

export async function getStudentThreadId(studentId: string): Promise<string> {
    if (globalThreadRegistry.studentThreads[studentId]) return globalThreadRegistry.studentThreads[studentId];
    const assistantId = await getLongTermMemoryAssistant();
    const thread = await backboardClient.createThread(assistantId);
    globalThreadRegistry.studentThreads[studentId] = thread.threadId;
    return thread.threadId;
}

export async function getSessionThreadId(sessionId: string): Promise<string> {
    if (globalThreadRegistry.sessionThreads[sessionId]) return globalThreadRegistry.sessionThreads[sessionId];
    const assistantId = await getSessionAnalyticsAssistant();
    const thread = await backboardClient.createThread(assistantId);
    globalThreadRegistry.sessionThreads[sessionId] = thread.threadId;
    return thread.threadId;
}

/**
 * Ask Backboard a question on a specific thread and expect JSON back.
 * We also handle basic tool calls automatically by returning mock hard-data.
 */
export async function queryBackboardJSON<T>(threadId: string, query: string): Promise<T | null> {
    try {
        let response: any = await backboardClient.addMessage(threadId, {
            content: query + "\n\nRespond ONLY with valid JSON. Do not include markdown formatting.",
            stream: false
        });

        // Handle tool calls if the assistant requests analytics
        if (response.toolCalls && response.toolCalls.length > 0) {
            const toolOutputs = response.toolCalls.map((tc: any) => {
                let output = "{}";
                if (tc.function.name === "fetch_student_aggregate_metrics") {
                    output = JSON.stringify({ historicalEngagement: 72, skippedClasses: 2, dominantStruggle: "Theory interpretation" });
                } else if (tc.function.name === "fetch_class_timeline") {
                    output = JSON.stringify({ dipEvents: [{ topic: "Backpropagation", severity: "high" }, { topic: "Chain Rule", severity: "medium" }] });
                }
                return {
                    toolCallId: tc.id,
                    output: output
                };
            });

            const submitRes = await backboardClient.submitToolOutputs(threadId, response.runId || "", toolOutputs, false);
            response = submitRes as any;
        }

        const content = response.content || "{}";
        const cleaned = content.replace(/^```json/g, "").replace(/^```/g, "").replace(/```$/g, "").trim();
        return JSON.parse(cleaned) as T;
    } catch (error) {
        console.error("Backboard query failed:", error);
        return null;
    }
}
