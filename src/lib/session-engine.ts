/**
 * Session Engine — Central state model for live classroom sessions
 * 
 * This is the single source of truth for all session data.
 * When a live session runs, ALL pages consume data from here.
 * When no session is active, pages fall back to mockData.
 */

// ── Slide Definition ──

export interface SlideDefinition {
    id: number;
    title: string;
    topic: string;
    summary: string;
    difficulty: "easy" | "medium" | "hard";
    teachingMode: "lecture" | "example" | "demo" | "discussion";
    durationMin: number;
}

export const SESSION_SLIDES: SlideDefinition[] = [
    { id: 1, title: "Introduction to Neural Networks", topic: "What are neural networks?", summary: "Overview of biological vs artificial neurons, network structure basics.", difficulty: "easy", teachingMode: "lecture", durationMin: 8 },
    { id: 2, title: "Perceptrons & Layers", topic: "How neurons connect", summary: "Single perceptron model, weight/bias, multi-layer architecture.", difficulty: "medium", teachingMode: "example", durationMin: 10 },
    { id: 3, title: "Activation Functions", topic: "Non-linearity in networks", summary: "ReLU, sigmoid, tanh — why non-linearity matters.", difficulty: "medium", teachingMode: "demo", durationMin: 12 },
    { id: 4, title: "Backpropagation", topic: "How networks learn", summary: "Loss functions, gradient descent, chain rule, weight updates.", difficulty: "hard", teachingMode: "lecture", durationMin: 15 },
    { id: 5, title: "Training & Overfitting", topic: "Making it work in practice", summary: "Epochs, batch size, regularization, dropout, validation.", difficulty: "hard", teachingMode: "discussion", durationMin: 10 },
    { id: 6, title: "Real-World Applications", topic: "Neural networks in daily life", summary: "Image recognition, NLP, recommendation engines, self-driving.", difficulty: "easy", teachingMode: "demo", durationMin: 8 },
];

// ── Engagement Types ──

export type EngagementState = "focused" | "distracted" | "confused" | "reengaged";

export interface StudentEvent {
    id: string;
    timestamp: number;
    studentId: string;
    slideId: number;
    state: EngagementState;
    score: number;
    confidence: number;
    // Measured signals
    facePresent: boolean;
    headTurnScore: number;
    gazeStabilityScore: number;
    eyeOpennessScore: number;
    movementScore: number;
    mouthActivity: number;
    headDown: boolean;
    handRaised: boolean;
    handConfidence: number;
    possibleDrowsiness: boolean;
}

// ── Per-Student Session Data ──

export interface StudentSession {
    sessionId: string;
    label: string;
    currentState: EngagementState;
    currentScore: number;
    confidence: number;
    events: StudentEvent[];
    scoreHistory: number[];
    perSlideScores: Map<number, number[]>;    // slideId → score samples
    perSlideStates: Map<number, EngagementState[]>;
    confusionCount: number;
    headDownCount: number;
    handRaiseCount: number;
    handRaised: boolean;                      // tracks previous state for edge-triggering
    participationCount: number;               // mouth activity or hand raise events
    lastSeen: number;
}

// ── Per-Slide Analytics ──

export interface SlideAnalytics {
    slideId: number;
    avgEngagement: number;
    confusionSpikes: number;
    participationCount: number;
    headDownCount: number;
    handRaiseCount: number;
    eventCount: number;
    entryScore: number | null;
    exitScore: number | null;
    teachingEffectiveness: number;  // exitScore - entryScore delta
    dipMoment: boolean;
    recoveryMoment: boolean;
    states: { focused: number; distracted: number; confused: number; reengaged: number };
}

// ── Session Timeline Events ──

export interface TimelineMarker {
    id: string;
    timestamp: number;
    type: "slide_change" | "dip" | "recovery" | "confusion_spike" | "participation" | "head_down_cluster" | "hand_raise" | "possible_question";
    slideId: number;
    label: string;
    detail: string;
    severity: "info" | "warning" | "danger" | "success";
}

// ── Dip / Recovery moments ──

export interface DipMoment {
    slideId: number;
    timestamp: number;
    dropAmount: number;
    fromScore: number;
    toScore: number;
}

export interface RecoveryMoment {
    slideId: number;
    timestamp: number;
    recoveryAmount: number;
    fromScore: number;
    toScore: number;
}

// ── Full Session State ──

export interface SessionState {
    isActive: boolean;
    startTime: number;
    sessionTitle: string;
    slides: SlideDefinition[];
    currentSlideIndex: number;

    students: Map<string, StudentSession>;
    slideAnalytics: Map<number, SlideAnalytics>;

    classAvgEngagement: number;
    confusionSpikes: number;
    participationTotal: number;
    headDownTotal: number;
    handRaiseTotal: number;
    totalEvents: number;

    eventLog: StudentEvent[];
    timelineMarkers: TimelineMarker[];
    timelineData: { time: string; engagement: number; slide: number }[];

    weakestSlide: number | null;
    strongestSlide: number | null;
    dipMoments: DipMoment[];
    recoveryMoments: RecoveryMoment[];
}

// ── Class Summary (computed view) ──

export interface ClassSummary {
    studentCount: number;
    avgEngagement: number;
    confusionSpikes: number;
    participationTotal: number;
    headDownTotal: number;
    handRaiseTotal: number;
    totalEvents: number;
    weakestSlide: SlideDefinition | null;
    strongestSlide: SlideDefinition | null;
    dipMoments: DipMoment[];
    recoveryMoments: RecoveryMoment[];
    atRiskStudents: { id: string; label: string; score: number; state: EngagementState }[];
}

// ── Student Summary (computed view) ──

export interface StudentSummary {
    sessionId: string;
    label: string;
    avgEngagement: number;
    currentState: EngagementState;
    weakestSlide: number | null;
    strongestSlide: number | null;
    confusionCount: number;
    participationCount: number;
    handRaiseCount: number;
    perSlideAvg: { slideId: number; avg: number; topic: string }[];
    scoreHistory: number[];
}

// ── Factory ──

export function createEmptySlideAnalytics(slideId: number): SlideAnalytics {
    return {
        slideId,
        avgEngagement: 0,
        confusionSpikes: 0,
        participationCount: 0,
        headDownCount: 0,
        handRaiseCount: 0,
        eventCount: 0,
        entryScore: null,
        exitScore: null,
        teachingEffectiveness: 0,
        dipMoment: false,
        recoveryMoment: false,
        states: { focused: 0, distracted: 0, confused: 0, reengaged: 0 },
    };
}

export function createInitialSessionState(): SessionState {
    const slideAnalytics = new Map<number, SlideAnalytics>();
    SESSION_SLIDES.forEach(s => slideAnalytics.set(s.id, createEmptySlideAnalytics(s.id)));

    return {
        isActive: false,
        startTime: 0,
        sessionTitle: "Awaiting Session Data",
        slides: SESSION_SLIDES,
        currentSlideIndex: 0,
        students: new Map(),
        slideAnalytics,
        classAvgEngagement: 0,
        confusionSpikes: 0,
        participationTotal: 0,
        headDownTotal: 0,
        handRaiseTotal: 0,
        totalEvents: 0,
        eventLog: [],
        timelineMarkers: [],
        timelineData: [],
        weakestSlide: null,
        strongestSlide: null,
        dipMoments: [],
        recoveryMoments: [],
    };
}
