"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backboardClient = exports.BACKBOARD_API_KEY = void 0;
exports.getLongTermMemoryAssistant = getLongTermMemoryAssistant;
exports.getSessionAnalyticsAssistant = getSessionAnalyticsAssistant;
exports.getTeacherMasterThreadId = getTeacherMasterThreadId;
exports.getStudentThreadId = getStudentThreadId;
exports.getSessionThreadId = getSessionThreadId;
exports.queryBackboardJSON = queryBackboardJSON;
var backboard_sdk_1 = require("backboard-sdk");
exports.BACKBOARD_API_KEY = process.env.BACKBOARD_API_KEY;
if (!exports.BACKBOARD_API_KEY) {
    console.warn("⚠️ BACKBOARD_API_KEY is missing from environment variables.");
}
exports.backboardClient = new backboard_sdk_1.BackboardClient({
    apiKey: exports.BACKBOARD_API_KEY || "mock-key",
});
var LONG_TERM_MEMORY_PROMPT = "You are the Long-Term Memory Assistant for InsightBoard AI.\nYour job is to synthesize raw session metrics into persistent learning patterns, recovery strategies, and teaching recommendations over time.\nYou have access to tools to fetch deep analytics. When asked for insights, use your memory and tools.\nRespond strictly in valid JSON format matching the requested schema.";
var SESSION_ANALYTICS_PROMPT = "You are the Session Analytics Assistant for InsightBoard AI.\nYour job is to immediately process a single completed session's data, including uploaded slide documents and engagement metrics.\nSummarize the session and identify immediate takeaways.\nRespond strictly in valid JSON format matching the requested schema.";
var analyticsTools = [
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
// In-memory demo registry (Prod = DB)
var globalThreadRegistry = {
    teacherMasterThreadId: undefined,
    studentThreads: {},
    sessionThreads: {},
};
var memoryAssistantId = undefined;
var sessionAssistantId = undefined;
function getLongTermMemoryAssistant() {
    return __awaiter(this, void 0, void 0, function () {
        var assistant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (memoryAssistantId)
                        return [2 /*return*/, memoryAssistantId];
                    return [4 /*yield*/, exports.backboardClient.createAssistant({
                            name: "Long-Term Memory Assistant",
                            system_prompt: LONG_TERM_MEMORY_PROMPT,
                            tools: analyticsTools
                        })];
                case 1:
                    assistant = _a.sent();
                    memoryAssistantId = assistant.assistantId;
                    return [2 /*return*/, assistant.assistantId];
            }
        });
    });
}
function getSessionAnalyticsAssistant() {
    return __awaiter(this, void 0, void 0, function () {
        var assistant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (sessionAssistantId)
                        return [2 /*return*/, sessionAssistantId];
                    return [4 /*yield*/, exports.backboardClient.createAssistant({
                            name: "Session Analytics Assistant",
                            system_prompt: SESSION_ANALYTICS_PROMPT,
                        })];
                case 1:
                    assistant = _a.sent();
                    sessionAssistantId = assistant.assistantId;
                    return [2 /*return*/, assistant.assistantId];
            }
        });
    });
}
function getTeacherMasterThreadId() {
    return __awaiter(this, void 0, void 0, function () {
        var assistantId, thread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (globalThreadRegistry.teacherMasterThreadId)
                        return [2 /*return*/, globalThreadRegistry.teacherMasterThreadId];
                    return [4 /*yield*/, getLongTermMemoryAssistant()];
                case 1:
                    assistantId = _a.sent();
                    return [4 /*yield*/, exports.backboardClient.createThread(assistantId)];
                case 2:
                    thread = _a.sent();
                    globalThreadRegistry.teacherMasterThreadId = thread.threadId;
                    return [2 /*return*/, thread.threadId];
            }
        });
    });
}
function getStudentThreadId(studentId) {
    return __awaiter(this, void 0, void 0, function () {
        var assistantId, thread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (globalThreadRegistry.studentThreads[studentId])
                        return [2 /*return*/, globalThreadRegistry.studentThreads[studentId]];
                    return [4 /*yield*/, getLongTermMemoryAssistant()];
                case 1:
                    assistantId = _a.sent();
                    return [4 /*yield*/, exports.backboardClient.createThread(assistantId)];
                case 2:
                    thread = _a.sent();
                    globalThreadRegistry.studentThreads[studentId] = thread.threadId;
                    return [2 /*return*/, thread.threadId];
            }
        });
    });
}
function getSessionThreadId(sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var assistantId, thread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (globalThreadRegistry.sessionThreads[sessionId])
                        return [2 /*return*/, globalThreadRegistry.sessionThreads[sessionId]];
                    return [4 /*yield*/, getSessionAnalyticsAssistant()];
                case 1:
                    assistantId = _a.sent();
                    return [4 /*yield*/, exports.backboardClient.createThread(assistantId)];
                case 2:
                    thread = _a.sent();
                    globalThreadRegistry.sessionThreads[sessionId] = thread.threadId;
                    return [2 /*return*/, thread.threadId];
            }
        });
    });
}
/**
 * Ask Backboard a question on a specific thread and expect JSON back.
 * We also handle basic tool calls automatically by returning mock hard-data.
 */
function queryBackboardJSON(threadId, query) {
    return __awaiter(this, void 0, void 0, function () {
        var response, toolOutputs, content, cleaned, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, exports.backboardClient.addMessage({
                            threadId: threadId,
                            content: query + "\n\nRespond ONLY with valid JSON. Do not include markdown formatting.",
                            stream: false
                        })];
                case 1:
                    response = _a.sent();
                    if (!(response.toolCalls && response.toolCalls.length > 0)) return [3 /*break*/, 3];
                    toolOutputs = response.toolCalls.map(function (tc) {
                        var output = "{}";
                        if (tc.function.name === "fetch_student_aggregate_metrics") {
                            output = JSON.stringify({ historicalEngagement: 72, skippedClasses: 2, dominantStruggle: "Theory interpretation" });
                        }
                        else if (tc.function.name === "fetch_class_timeline") {
                            output = JSON.stringify({ dipEvents: [{ topic: "Backpropagation", severity: "high" }, { topic: "Chain Rule", severity: "medium" }] });
                        }
                        return {
                            toolCallId: tc.id,
                            output: output
                        };
                    });
                    return [4 /*yield*/, exports.backboardClient.submitToolOutputs(threadId, response.runId || "", toolOutputs, false)];
                case 2:
                    response = _a.sent();
                    _a.label = 3;
                case 3:
                    content = response.content;
                    cleaned = content.replace(/^```json/g, "").replace(/^```/g, "").replace(/```$/g, "").trim();
                    return [2 /*return*/, JSON.parse(cleaned)];
                case 4:
                    error_1 = _a.sent();
                    console.error("Backboard query failed:", error_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
