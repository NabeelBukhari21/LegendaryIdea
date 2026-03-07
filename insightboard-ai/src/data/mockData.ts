// ──────────────────────────────────────────────
// InsightBoard AI - Mock Data
// ──────────────────────────────────────────────

export interface Slide {
  id: number;
  title: string;
  topic: string;
  duration: number; // minutes
  engagement: number; // 0-100
  notes: string;
}

export interface EngagementPoint {
  time: string;
  engagement: number;
  slide: number;
}

export interface Student {
  id: string;
  alias: string;
  avgEngagement: number;
  atRisk: boolean;
  lastReflection: string | null;
}

export interface Reflection {
  studentId: string;
  slideId: number;
  reason: string;
  timestamp: string;
  helpful: boolean;
}

export interface AIRecap {
  slideId: number;
  topic: string;
  originalExplanation: string;
  simplerExplanation: string;
  keyTakeaways: string[];
  poweredBy: string;
}

export interface TeacherRecommendation {
  id: string;
  type: "pacing" | "content" | "interaction" | "assessment";
  title: string;
  description: string;
  confidence: number;
  basedOn: string;
}

export interface ConfusionPattern {
  id: string;
  topic: string;
  occurrences: number;
  sessions: string[];
  trend: "increasing" | "stable" | "decreasing";
  avgEngagementDrop: number;
  suggestedAction: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  dataType: string;
  retention: string;
  status: "retained" | "deleted" | "anonymized";
}

export interface RetentionPolicy {
  id: string;
  dataType: string;
  retention: string;
  description: string;
  autoDelete: boolean;
  icon: string;
}

export interface SessionSummary {
  id: string;
  date: string;
  title: string;
  slides: number;
  avgEngagement: number;
  reflections: number;
}

export interface TrendPoint {
  session: string;
  confusion: number;
  engagement: number;
}

// ── Session Data (6 slides) ──────────────────

export const session: Slide[] = [
  {
    id: 1,
    title: "Introduction to Neural Networks",
    topic: "What are neural networks?",
    duration: 8,
    engagement: 87,
    notes: "Strong opening with visual analogy to the brain.",
  },
  {
    id: 2,
    title: "Perceptrons & Activation Functions",
    topic: "How single neurons compute",
    duration: 10,
    engagement: 82,
    notes: "Interactive polling kept attention.",
  },
  {
    id: 3,
    title: "Layers & Architecture",
    topic: "Building deeper networks",
    duration: 12,
    engagement: 78,
    notes: "Slight dip as content got more abstract.",
  },
  {
    id: 4,
    title: "Backpropagation Explained",
    topic: "How networks learn from errors",
    duration: 15,
    engagement: 45,
    notes: "Major engagement drop — math-heavy section.",
  },
  {
    id: 5,
    title: "Training & Optimization",
    topic: "Gradient descent and learning rates",
    duration: 10,
    engagement: 68,
    notes: "Partial recovery after live demo.",
  },
  {
    id: 6,
    title: "Real-World Applications",
    topic: "Neural networks in daily life",
    duration: 8,
    engagement: 91,
    notes: "High re-engagement with relatable examples.",
  },
];

// ── Engagement Timeline ──────────────────────

export const engagementTimeline: EngagementPoint[] = [
  { time: "0:00", engagement: 90, slide: 1 },
  { time: "2:00", engagement: 88, slide: 1 },
  { time: "4:00", engagement: 85, slide: 1 },
  { time: "6:00", engagement: 87, slide: 1 },
  { time: "8:00", engagement: 84, slide: 2 },
  { time: "10:00", engagement: 82, slide: 2 },
  { time: "12:00", engagement: 80, slide: 2 },
  { time: "14:00", engagement: 83, slide: 2 },
  { time: "16:00", engagement: 78, slide: 2 },
  { time: "18:00", engagement: 79, slide: 3 },
  { time: "20:00", engagement: 76, slide: 3 },
  { time: "22:00", engagement: 74, slide: 3 },
  { time: "24:00", engagement: 78, slide: 3 },
  { time: "26:00", engagement: 72, slide: 3 },
  { time: "28:00", engagement: 65, slide: 3 },
  { time: "30:00", engagement: 58, slide: 4 },
  { time: "32:00", engagement: 48, slide: 4 },
  { time: "34:00", engagement: 42, slide: 4 },
  { time: "36:00", engagement: 38, slide: 4 },
  { time: "38:00", engagement: 44, slide: 4 },
  { time: "40:00", engagement: 50, slide: 4 },
  { time: "42:00", engagement: 55, slide: 4 },
  { time: "44:00", engagement: 60, slide: 5 },
  { time: "46:00", engagement: 65, slide: 5 },
  { time: "48:00", engagement: 70, slide: 5 },
  { time: "50:00", engagement: 68, slide: 5 },
  { time: "52:00", engagement: 72, slide: 5 },
  { time: "54:00", engagement: 82, slide: 6 },
  { time: "56:00", engagement: 88, slide: 6 },
  { time: "58:00", engagement: 92, slide: 6 },
  { time: "60:00", engagement: 91, slide: 6 },
];

// ── Students ─────────────────────────────────

export const students: Student[] = [
  {
    id: "s1",
    alias: "Student Alpha",
    avgEngagement: 82,
    atRisk: false,
    lastReflection: "Found the demo very helpful.",
  },
  {
    id: "s2",
    alias: "Student Beta",
    avgEngagement: 74,
    atRisk: false,
    lastReflection: "Backprop was confusing.",
  },
  {
    id: "s3",
    alias: "Student Gamma",
    avgEngagement: 56,
    atRisk: true,
    lastReflection: "Lost focus during math section.",
  },
  {
    id: "s4",
    alias: "Student Delta",
    avgEngagement: 88,
    atRisk: false,
    lastReflection: null,
  },
  {
    id: "s5",
    alias: "Student Epsilon",
    avgEngagement: 79,
    atRisk: false,
    lastReflection: "Liked the real-world examples.",
  },
];

// ── Student Reflection ───────────────────────

export const reflections: Reflection[] = [
  {
    studentId: "s3",
    slideId: 4,
    reason:
      "The chain rule explanation was too fast. I couldn't follow the math notation and lost track of why we needed derivatives.",
    timestamp: "2026-03-06T14:35:00Z",
    helpful: true,
  },
];

// ── AI Recap ─────────────────────────────────

export const aiRecap: AIRecap = {
  slideId: 4,
  topic: "Backpropagation",
  originalExplanation:
    "Backpropagation uses the chain rule of calculus to compute partial derivatives of the loss function with respect to each weight, propagating the error gradient backward through the network layers.",
  simplerExplanation:
    "Think of backpropagation like a teacher grading papers. The network makes a prediction, checks how wrong it was (the error), then goes back through each layer saying: 'How much did YOU contribute to this mistake?' Each layer adjusts a little bit so next time the answer is closer to correct. It's like playing 'hot and cold' — the network keeps adjusting until it gets warmer (more accurate).",
  keyTakeaways: [
    "Backpropagation = learning from mistakes",
    "Error flows backward through the network",
    "Each layer adjusts its weights to reduce the error",
    "It's an iterative process — many rounds of adjustment",
  ],
  poweredBy: "Gemini",
};

// ── Teacher Recommendation ───────────────────

export const teacherRecommendation: TeacherRecommendation = {
  id: "rec1",
  type: "pacing",
  title: "Slow Down on Backpropagation",
  description:
    "Engagement dropped 43% during the backpropagation section (Slide 4). Consider breaking this into two shorter segments with a visual walkthrough of the chain rule. Adding a step-by-step animated diagram reduced confusion by 35% in similar courses.",
  confidence: 89,
  basedOn: "Engagement data from 3 sessions + 12 student reflections",
};

// ── Confusion Patterns ───────────────────────

export const confusionPatterns: ConfusionPattern[] = [
  {
    id: "cp1",
    topic: "Chain Rule / Derivatives",
    occurrences: 3,
    sessions: ["Session 5 - Mar 6", "Session 3 - Feb 20", "Session 1 - Feb 6"],
    trend: "increasing",
    avgEngagementDrop: 38,
    suggestedAction:
      "Add prerequisite math refresher before this topic. Consider a 5-min calculus warmup slide.",
  },
  {
    id: "cp2",
    topic: "Matrix Multiplication in Layers",
    occurrences: 2,
    sessions: ["Session 4 - Feb 27", "Session 2 - Feb 13"],
    trend: "stable",
    avgEngagementDrop: 22,
    suggestedAction:
      "Use visual matrix animations. Students respond well to color-coded row×column demonstrations.",
  },
];

// ── Cross-Session Trend Data ─────────────────

export const trendData: TrendPoint[] = [
  { session: "Session 1", confusion: 15, engagement: 82 },
  { session: "Session 2", confusion: 22, engagement: 78 },
  { session: "Session 3", confusion: 28, engagement: 75 },
  { session: "Session 4", confusion: 20, engagement: 80 },
  { session: "Session 5", confusion: 35, engagement: 72 },
];

// ── Audit Log ────────────────────────────────

export const auditLog: AuditEvent[] = [
  {
    id: "a1",
    timestamp: "2026-03-06T15:00:00Z",
    action: "Session engagement data collected",
    dataType: "Engagement metrics",
    retention: "90 days",
    status: "retained",
  },
  {
    id: "a2",
    timestamp: "2026-03-06T14:35:00Z",
    action: "Student reflection submitted",
    dataType: "Text reflection",
    retention: "End of semester",
    status: "retained",
  },
  {
    id: "a3",
    timestamp: "2026-03-06T14:30:00Z",
    action: "AI recap generated",
    dataType: "Generated content",
    retention: "30 days",
    status: "retained",
  },
  {
    id: "a4",
    timestamp: "2026-03-05T16:00:00Z",
    action: "Raw engagement frames purged",
    dataType: "Video frames",
    retention: "24 hours",
    status: "deleted",
  },
  {
    id: "a5",
    timestamp: "2026-03-05T15:00:00Z",
    action: "Session 4 data anonymized",
    dataType: "Student identifiers",
    retention: "Immediate",
    status: "anonymized",
  },
  {
    id: "a6",
    timestamp: "2026-03-04T10:00:00Z",
    action: "Teacher viewed aggregated report",
    dataType: "Access log",
    retention: "180 days",
    status: "retained",
  },
  {
    id: "a7",
    timestamp: "2026-03-03T09:00:00Z",
    action: "Privacy settings updated",
    dataType: "Config change",
    retention: "365 days",
    status: "retained",
  },
  {
    id: "a8",
    timestamp: "2026-03-01T12:00:00Z",
    action: "Bulk data export requested",
    dataType: "Export audit",
    retention: "365 days",
    status: "retained",
  },
];

// ── Retention Policies ───────────────────────

export const retentionPolicies: RetentionPolicy[] = [
  {
    id: "rp1",
    dataType: "Raw Video / Audio",
    retention: "24 hours",
    description:
      "Raw media is processed for engagement signals only and deleted within 24 hours. Teachers never see raw student media.",
    autoDelete: true,
    icon: "🎥",
  },
  {
    id: "rp2",
    dataType: "Engagement Metrics",
    retention: "90 days",
    description:
      "Aggregated engagement scores per slide/session. Individual scores are anonymized after 30 days.",
    autoDelete: true,
    icon: "📊",
  },
  {
    id: "rp3",
    dataType: "Student Reflections",
    retention: "End of semester",
    description:
      "Voluntary text reflections submitted by students. Students can delete their reflections at any time.",
    autoDelete: false,
    icon: "💭",
  },
  {
    id: "rp4",
    dataType: "AI-Generated Content",
    retention: "30 days",
    description:
      "Recaps and explanations generated by AI. Regenerated on demand, so long-term storage is unnecessary.",
    autoDelete: true,
    icon: "🤖",
  },
];

// ── Aggregated Feedback Reasons ──────────────

export interface FeedbackReason {
  reason: string;
  percentage: number;
  count: number;
  slideId: number;
  category: "pacing" | "content" | "clarity" | "fatigue" | "other";
}

export const feedbackReasons: FeedbackReason[] = [
  { reason: "Content moved too fast", percentage: 43, count: 9, slideId: 4, category: "pacing" },
  { reason: "Unclear example or analogy", percentage: 33, count: 7, slideId: 4, category: "clarity" },
  { reason: "Too much math notation", percentage: 29, count: 6, slideId: 4, category: "content" },
  { reason: "Lost context from previous slide", percentage: 19, count: 4, slideId: 3, category: "clarity" },
  { reason: "Felt fatigued / lost focus", percentage: 14, count: 3, slideId: 4, category: "fatigue" },
  { reason: "Needed a visual diagram", percentage: 10, count: 2, slideId: 4, category: "content" },
];

// ── Classroom Zone Engagement ────────────────

export interface ZoneData {
  zone: string;
  label: string;
  engagement: number;
  students: number;
  trend: "up" | "down" | "stable";
}

export const zoneEngagement: ZoneData[] = [
  { zone: "front-left", label: "Front Left", engagement: 84, students: 5, trend: "stable" },
  { zone: "front-center", label: "Front Center", engagement: 88, students: 6, trend: "up" },
  { zone: "front-right", label: "Front Right", engagement: 81, students: 4, trend: "stable" },
  { zone: "mid-left", label: "Middle Left", engagement: 72, students: 5, trend: "down" },
  { zone: "mid-center", label: "Middle Center", engagement: 76, students: 6, trend: "stable" },
  { zone: "mid-right", label: "Middle Right", engagement: 69, students: 5, trend: "down" },
  { zone: "back-left", label: "Back Left", engagement: 58, students: 4, trend: "down" },
  { zone: "back-center", label: "Back Center", engagement: 62, students: 5, trend: "down" },
  { zone: "back-right", label: "Back Right", engagement: 54, students: 3, trend: "down" },
];

// ── Post-Slide-4 Behavioral Shift ────────────

export interface BehavioralShift {
  metric: string;
  before: number;
  after: number;
  unit: string;
  interpretation: string;
  trend: "positive" | "negative" | "neutral";
}

export const postSlide4Shifts: BehavioralShift[] = [
  { metric: "Avg Engagement", before: 82, after: 45, unit: "%", interpretation: "Dropped 37 points during Slide 4, partially recovered to 68% on Slide 5", trend: "negative" },
  { metric: "Active Participation", before: 76, after: 41, unit: "%", interpretation: "Fewer students responding to interactive prompts after the dip", trend: "negative" },
  { metric: "Recovery after Demo", before: 45, after: 68, unit: "%", interpretation: "Live demo on Slide 5 helped 23-point partial recovery", trend: "positive" },
  { metric: "Full Recovery (Slide 6)", before: 68, after: 91, unit: "%", interpretation: "Real-world examples restored engagement above baseline", trend: "positive" },
];

// ── Top Weak Topic ───────────────────────────

export interface WeakTopic {
  topic: string;
  occurrences: number;
  avgDrop: number;
  relatedSlides: number[];
  rootCause: string;
  affectedPercentage: number;
  historySessions: { session: string; drop: number }[];
  prerequisite: string;
}

export const topWeakTopic: WeakTopic = {
  topic: "Chain Rule & Backpropagation Math",
  occurrences: 3,
  avgDrop: 38,
  relatedSlides: [4],
  rootCause: "Students lack prerequisite calculus fluency. The chain rule is introduced too abruptly without connecting it to prior knowledge of derivatives.",
  affectedPercentage: 62,
  historySessions: [
    { session: "Session 5 (Today)", drop: 42 },
    { session: "Session 3", drop: 35 },
    { session: "Session 1", drop: 28 },
  ],
  prerequisite: "Basic derivative rules and function composition",
};

// ── Best Intervention Suggestion ─────────────

export interface InterventionSuggestion {
  id: string;
  title: string;
  type: "immediate" | "next-session" | "structural";
  description: string;
  expectedImpact: string;
  confidence: number;
  evidence: string[];
  steps: string[];
  estimatedTime: string;
  priority: "critical" | "high" | "medium";
}

export const bestIntervention: InterventionSuggestion = {
  id: "int1",
  title: "Add Visual Chain Rule Walkthrough Before Slide 4",
  type: "next-session",
  description: "Insert a 5-minute visual prerequisite slide before Backpropagation that demonstrates the chain rule with a simple, non-math example (e.g., dominos falling). Then use color-coded step-by-step animation to build to the formal chain rule.",
  expectedImpact: "Projected 25-35% reduction in Slide 4 engagement drop based on similar course interventions.",
  confidence: 91,
  evidence: [
    "3 sessions show increasing confusion on this topic",
    "43% of students cited 'too fast' as primary feedback",
    "Diagram-based re-engagement worked on Slide 6 (+46 points)",
    "Similar courses saw 35% improvement with visual prerequisites",
  ],
  steps: [
    "Create a visual analogy slide (dominos → chain rule)",
    "Add color-coded step-by-step derivative walkthrough",
    "Split Slide 4 into two 7-minute segments with a check-in",
    "Add an interactive poll between sub-segments",
    "Include a 'Try it yourself' mini-exercise worksheet",
  ],
  estimatedTime: "20 min prep",
  priority: "critical",
};

// ── Slide-by-Slide Bar Chart Data ────────────

export interface SlideBarData {
  slide: string;
  engagement: number;
  fullLabel: string;
  isDip: boolean;
}

export const slideBarData: SlideBarData[] = session.map((s) => ({
  slide: `S${s.id}`,
  engagement: s.engagement,
  fullLabel: s.title,
  isDip: s.engagement < 60,
}));

// ── Session History ──────────────────────────

export const sessionHistory: SessionSummary[] = [
  {
    id: "sess5",
    date: "Mar 6, 2026",
    title: "Session 5: Neural Networks Deep Dive",
    slides: 6,
    avgEngagement: 75,
    reflections: 4,
  },
  {
    id: "sess4",
    date: "Feb 27, 2026",
    title: "Session 4: Convolutional Networks",
    slides: 5,
    avgEngagement: 80,
    reflections: 2,
  },
  {
    id: "sess3",
    date: "Feb 20, 2026",
    title: "Session 3: Gradient Descent Basics",
    slides: 4,
    avgEngagement: 78,
    reflections: 3,
  },
];
