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

// ── Student Focus / Drop-off Moments ─────────

export interface FocusMoment {
  slideId: number;
  slideTitle: string;
  engagement: number;
  type: "peak" | "dip";
  duration: string;
  insight: string;
  emoji: string;
}

export const focusMoments: FocusMoment[] = [
  {
    slideId: 6,
    slideTitle: "Real-World Applications",
    engagement: 91,
    type: "peak",
    duration: "8 min",
    insight: "You were most engaged when the content connected to real-world examples you could relate to.",
    emoji: "🌟",
  },
  {
    slideId: 1,
    slideTitle: "Introduction to Neural Networks",
    engagement: 87,
    type: "peak",
    duration: "8 min",
    insight: "Strong start! Visual analogies at the beginning kept your attention high.",
    emoji: "🧠",
  },
];

export const dropOffMoments: FocusMoment[] = [
  {
    slideId: 4,
    slideTitle: "Backpropagation Explained",
    engagement: 45,
    type: "dip",
    duration: "15 min",
    insight: "This was the math-heavy section. Don't worry — this is one of the hardest topics in the course, and many students found it challenging.",
    emoji: "📉",
  },
  {
    slideId: 3,
    slideTitle: "Layers & Architecture",
    engagement: 78,
    type: "dip",
    duration: "12 min",
    insight: "The content got more abstract here. A slight dip is normal as complexity increases.",
    emoji: "📊",
  },
];

// ── Topic-Level Breakdown ────────────────────

export interface TopicBreakdown {
  topic: string;
  slideId: number;
  engagement: number;
  comprehension: "strong" | "moderate" | "needs-review";
  timeSpent: string;
  emoji: string;
}

export const topicBreakdown: TopicBreakdown[] = [
  { topic: "What are neural networks?", slideId: 1, engagement: 87, comprehension: "strong", timeSpent: "8 min", emoji: "✅" },
  { topic: "Perceptrons & activation functions", slideId: 2, engagement: 82, comprehension: "strong", timeSpent: "10 min", emoji: "✅" },
  { topic: "Network layers & architecture", slideId: 3, engagement: 78, comprehension: "moderate", timeSpent: "12 min", emoji: "🔶" },
  { topic: "Backpropagation (chain rule)", slideId: 4, engagement: 45, comprehension: "needs-review", timeSpent: "15 min", emoji: "🔴" },
  { topic: "Training & optimization", slideId: 5, engagement: 68, comprehension: "moderate", timeSpent: "10 min", emoji: "🔶" },
  { topic: "Real-world applications", slideId: 6, engagement: 91, comprehension: "strong", timeSpent: "8 min", emoji: "✅" },
];

// ── Worked Example ───────────────────────────

export interface WorkedExample {
  title: string;
  topic: string;
  steps: { label: string; content: string; highlight?: boolean }[];
  takeaway: string;
}

export const workedExample: WorkedExample = {
  title: "Backpropagation: Step by Step",
  topic: "How the chain rule works in a simple network",
  steps: [
    {
      label: "Step 1: Forward Pass",
      content: "Input x=2 goes through the network: Layer 1 multiplies by weight w₁=3, giving 6. Layer 2 multiplies by weight w₂=0.5, giving output ŷ=3.",
    },
    {
      label: "Step 2: Calculate Error",
      content: "The correct answer is y=5. Our error (loss) = (ŷ - y)² = (3 - 5)² = 4. We need to reduce this!",
      highlight: true,
    },
    {
      label: "Step 3: Backward Pass",
      content: "Now we ask: how much did each weight contribute to the error? We trace backward: ∂Loss/∂w₂ tells us how to adjust w₂, and ∂Loss/∂w₁ tells us how to adjust w₁.",
    },
    {
      label: "Step 4: Update Weights",
      content: "Adjust each weight slightly in the direction that reduces error. After one round: w₁ becomes 3.2 and w₂ becomes 0.7. The new output would be closer to 5!",
      highlight: true,
    },
    {
      label: "Step 5: Repeat",
      content: "Do this thousands of times with many examples. Each round, the weights get a tiny bit better. That's how neural networks 'learn' — they keep adjusting until they get it right.",
    },
  ],
  takeaway: "Backpropagation is just the network asking 'what went wrong?' and fixing each part a little bit. It's like tuning a guitar string by string until the whole thing sounds right.",
};

// ── Mini Quiz ────────────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What does backpropagation help a neural network do?",
    options: [
      "Make predictions faster",
      "Learn from its mistakes by adjusting weights",
      "Add more layers to the network",
      "Collect more training data",
    ],
    correctIndex: 1,
    explanation: "Backpropagation calculates how much each weight contributed to the error, then adjusts them to reduce future mistakes. It's the network's way of learning!",
    topic: "Backpropagation basics",
  },
  {
    id: "q2",
    question: "In backpropagation, error flows in which direction?",
    options: [
      "Forward through the network",
      "Only through the first layer",
      "Backward from output to input",
      "Randomly through any layer",
    ],
    correctIndex: 2,
    explanation: "The 'back' in backpropagation means the error signal flows backward — from the output layer back through each hidden layer to the input, updating weights along the way.",
    topic: "Error propagation direction",
  },
  {
    id: "q3",
    question: "Why is the chain rule important for backpropagation?",
    options: [
      "It speeds up the computer's calculations",
      "It connects layers so we can calculate each weight's impact on the error",
      "It adds more neurons to the network",
      "It prevents the network from overfitting",
    ],
    correctIndex: 1,
    explanation: "The chain rule lets us break down a complex function into simpler parts. Since a neural network is layers of functions, the chain rule lets us figure out how each individual weight affects the final error.",
    topic: "Chain rule application",
  },
];

// ── Personal Study Advice ────────────────────

export interface StudyAdvice {
  title: string;
  description: string;
  type: "strength" | "improvement" | "tip";
  icon: string;
  actionable: string;
}

export const studyAdvice: StudyAdvice[] = [
  {
    title: "You learn best from examples",
    description: "Your engagement peaks when content includes real-world analogies and visual demonstrations. Your strongest moments were during Slides 1 and 6.",
    type: "strength",
    icon: "🌟",
    actionable: "When studying backpropagation, look for video tutorials that use visual step-by-step walkthroughs rather than textbook-style explanations.",
  },
  {
    title: "Math notation needs a warm-up",
    description: "Your engagement tends to dip when new math concepts are introduced quickly. A quick refresher before diving in could help.",
    type: "improvement",
    icon: "📐",
    actionable: "Try spending 5 minutes reviewing basic derivative rules before your next session. This small warm-up can make a big difference.",
  },
  {
    title: "Break theory into smaller chunks",
    description: "Long theory-heavy sections (like Slide 4's 15 minutes) tend to challenge you. Shorter focused study sessions work better for your learning style.",
    type: "tip",
    icon: "⏱️",
    actionable: "When reviewing the backpropagation material, study it in 10-minute chunks with short breaks. Try the Pomodoro technique.",
  },
];

// ── Personal Learning Pattern ────────────────

export interface LearningPattern {
  pattern: string;
  description: string;
  evidence: string[];
  suggestion: string;
  confidence: number;
}

export const personalPattern: LearningPattern = {
  pattern: "You tend to lose focus during theory-heavy explanations without visual support",
  description: "Across your last 3 sessions, there's a consistent pattern: your engagement stays high during visual, example-based content but drops when the material shifts to abstract theory or dense mathematical notation for extended periods.",
  evidence: [
    "Session 5: Dip on Slide 4 (backpropagation math), peak on Slide 6 (real-world examples)",
    "Session 3: Dip during formal gradient descent derivation, recovery during interactive demo",
    "Session 1: Strong engagement on intro analogies, dip during formal neuron equations",
  ],
  suggestion: "This isn't a weakness — it's a learning preference. Many successful learners are visual/applied thinkers. Try watching the 3Blue1Brown neural network series before lectures for visual context.",
  confidence: 87,
};

// ── Enriched Session Timeline Slides ─────────

export interface EnrichedSlide {
  id: number;
  title: string;
  topic: string;
  duration: number;
  timeRange: string;
  engagement: number;
  confusion: number;
  status: "strong" | "moderate" | "dip" | "recovery" | "peak";
  transcript: string;
  feedbackThemes: string[];
  recommendation: string;
  marker?: { type: "dip" | "spike" | "recovery" | "peak"; label: string };
  teacherNote: string;
  studentNote: string;
}

export const enrichedSlides: EnrichedSlide[] = [
  {
    id: 1,
    title: "Introduction to Neural Networks",
    topic: "What are neural networks?",
    duration: 8,
    timeRange: "0:00 – 8:00",
    engagement: 87,
    confusion: 8,
    status: "strong",
    transcript: "Today we're going to understand how computers can learn from data, much like how your brain learns from experience. Imagine a network of tiny decision-makers, each looking at one small piece of the puzzle…",
    feedbackThemes: [],
    recommendation: "Great opening — keep using visual brain analogies to anchor abstract concepts.",
    marker: { type: "peak", label: "Strong start" },
    teacherNote: "Visual analogies landed well. Students were attentive from the opening.",
    studentNote: "The brain analogy helped me understand why this is called a 'neural' network.",
  },
  {
    id: 2,
    title: "Perceptrons & Activation Functions",
    topic: "How single neurons compute",
    duration: 10,
    timeRange: "8:00 – 18:00",
    engagement: 82,
    confusion: 12,
    status: "strong",
    transcript: "A perceptron takes inputs, multiplies each by a weight, adds them up, and passes the result through an activation function. Think of it like a vote — each input gets a say, and the neuron decides yes or no…",
    feedbackThemes: [],
    recommendation: "Interactive polling maintained attention. Consider adding a quick hands-on demo.",
    teacherNote: "In-class polling question kept engagement high throughout this segment.",
    studentNote: "The voting analogy made sense. I get how a single neuron works now.",
  },
  {
    id: 3,
    title: "Layers & Architecture",
    topic: "Building deeper networks",
    duration: 12,
    timeRange: "18:00 – 30:00",
    engagement: 78,
    confusion: 22,
    status: "moderate",
    transcript: "When we stack layers of neurons, something magical happens — the network can learn increasingly complex patterns. The first layer might detect edges, the second shapes, the third entire objects…",
    feedbackThemes: ["Lost context from previous slide"],
    recommendation: "Add a transition slide connecting single neurons to multi-layer concepts.",
    teacherNote: "Slight dip as abstraction increased. Some students lost the thread between single neurons and layers.",
    studentNote: "I understood layers conceptually but wasn't sure how they connect to what we just learned about single neurons.",
  },
  {
    id: 4,
    title: "Backpropagation Explained",
    topic: "How networks learn from errors",
    duration: 15,
    timeRange: "30:00 – 45:00",
    engagement: 45,
    confusion: 62,
    status: "dip",
    transcript: "Backpropagation uses the chain rule to compute gradients. For each weight w, we calculate ∂L/∂w by propagating the error backward through the network. The partial derivative of the loss with respect to…",
    feedbackThemes: ["Content moved too fast", "Unclear example or analogy", "Too much math notation", "Needed a visual diagram"],
    recommendation: "Split into two 7-minute segments. Add a visual chain rule walkthrough before introducing the formal math.",
    marker: { type: "dip", label: "Major engagement drop" },
    teacherNote: "43% of students reported confusion. The chain rule was introduced too abruptly. Math notation overwhelmed the class.",
    studentNote: "The math notation came out of nowhere. I couldn't follow why we needed derivatives and lost track of the main idea.",
  },
  {
    id: 5,
    title: "Training & Optimization",
    topic: "Gradient descent and learning rates",
    duration: 10,
    timeRange: "45:00 – 55:00",
    engagement: 68,
    confusion: 28,
    status: "recovery",
    transcript: "Let me show you what this looks like in practice. [Live demo] Watch how the error decreases with each training step. The learning rate controls how big each step is — too big and you overshoot, too small and you barely move…",
    feedbackThemes: ["Felt fatigued / lost focus"],
    recommendation: "The live demo helped recovery. Consider placing demos before heavy theory, not after.",
    marker: { type: "recovery", label: "Partial recovery (+23pts)" },
    teacherNote: "The live demo triggered a 23-point recovery. Students re-engaged when they could see the concept in action.",
    studentNote: "The demo finally showed me what all that math was for. I wish we'd seen this before the equations.",
  },
  {
    id: 6,
    title: "Real-World Applications",
    topic: "Neural networks in daily life",
    duration: 8,
    timeRange: "55:00 – 63:00",
    engagement: 91,
    confusion: 5,
    status: "peak",
    transcript: "Every time you unlock your phone with your face, ask Siri a question, or get a Netflix recommendation — that's a neural network. Self-driving cars, medical diagnoses, language translation…",
    feedbackThemes: [],
    recommendation: "Excellent closer. Consider opening future sessions with real-world hooks to set context early.",
    marker: { type: "peak", label: "Full re-engagement" },
    teacherNote: "Strongest engagement of the session. Relatable examples restored attention to above-baseline levels.",
    studentNote: "This was the best part — I finally see how all of this applies to real life. It made the hard parts feel worth it.",
  },
];

// ── Disengagement Windows ────────────────────

export interface DisengagementWindow {
  id: string;
  window: string;
  avgDrop: number;
  sessions: string[];
  triggerType: string;
  description: string;
}

export const disengagementWindows: DisengagementWindow[] = [
  {
    id: "dw1",
    window: "25–45 min mark",
    avgDrop: 35,
    sessions: ["Session 5", "Session 3", "Session 1"],
    triggerType: "Theory-heavy content",
    description: "Engagement consistently drops when dense theoretical content appears in the 25–45 minute window without visual support. This is the highest-risk zone across all sessions.",
  },
  {
    id: "dw2",
    window: "First transition (slide 2→3)",
    avgDrop: 12,
    sessions: ["Session 5", "Session 4"],
    triggerType: "Abstraction increase",
    description: "A moderate dip occurs when content shifts from concrete to abstract. Adding a bridging slide or recap can mitigate this.",
  },
  {
    id: "dw3",
    window: "Post-break re-entry",
    avgDrop: 8,
    sessions: ["Session 4", "Session 2"],
    triggerType: "Context loss",
    description: "Students lose some engagement after breaks. Starting the second half with a quick recap consistently helps.",
  },
];

// ── Teaching Format Analysis ─────────────────

export interface TeachingFormat {
  format: string;
  avgEngagement: number;
  trend: "up" | "down" | "stable";
  sessions: number;
  icon: string;
  examples: string[];
  verdict: "best" | "good" | "weak" | "worst";
}

export const teachingFormats: TeachingFormat[] = [
  {
    format: "Real-World Examples",
    avgEngagement: 89,
    trend: "up",
    sessions: 5,
    icon: "🌍",
    examples: ["Session 5 Slide 6: +46pts recovery", "Session 3 Slide 5: +28pts recovery"],
    verdict: "best",
  },
  {
    format: "Interactive Polls / Demos",
    avgEngagement: 83,
    trend: "up",
    sessions: 4,
    icon: "🎯",
    examples: ["Session 5 Slide 2: sustained 82%", "Session 4 Slide 3: +15pts boost"],
    verdict: "good",
  },
  {
    format: "Visual Analogies",
    avgEngagement: 85,
    trend: "stable",
    sessions: 5,
    icon: "🖼️",
    examples: ["Session 5 Slide 1: 87% opening", "Session 1 Slide 1: 90% opening"],
    verdict: "good",
  },
  {
    format: "Formal Math Derivations",
    avgEngagement: 48,
    trend: "down",
    sessions: 3,
    icon: "📐",
    examples: ["Session 5 Slide 4: 45% engagement", "Session 3 Slide 4: 52% engagement"],
    verdict: "worst",
  },
  {
    format: "Theory-Only Lectures",
    avgEngagement: 62,
    trend: "down",
    sessions: 4,
    icon: "📖",
    examples: ["Session 5 Slide 3: 78%", "Session 2 Slide 4: 55%"],
    verdict: "weak",
  },
];

// ── Memory Timeline ──────────────────────────

export interface MemoryEvent {
  id: string;
  session: string;
  date: string;
  event: string;
  type: "pattern-detected" | "intervention" | "improvement" | "alert" | "milestone";
  detail: string;
  impact?: string;
}

export const memoryTimeline: MemoryEvent[] = [
  {
    id: "me1",
    session: "Session 5",
    date: "Mar 6",
    event: "Chain rule confusion pattern detected (3rd occurrence)",
    type: "alert",
    detail: "Backpropagation math caused a 42% engagement drop — the largest this semester. Pattern now flagged as critical.",
    impact: "Triggered critical intervention recommendation",
  },
  {
    id: "me2",
    session: "Session 5",
    date: "Mar 6",
    event: "Real-world examples achieved full recovery",
    type: "improvement",
    detail: "Slide 6's real-world examples pushed engagement to 91%, confirming example-based teaching as the strongest format.",
    impact: "Best format confidence increased to 94%",
  },
  {
    id: "me3",
    session: "Session 4",
    date: "Feb 27",
    event: "Interactive demo reduced confusion by 22%",
    type: "intervention",
    detail: "After implementing the recommendation from Session 3 to add a live demo, confusion on convolution math dropped from 34% to 12%.",
    impact: "Validated demo-first approach",
  },
  {
    id: "me4",
    session: "Session 3",
    date: "Feb 20",
    event: "Gradient descent derivation pattern detected (2nd occurrence)",
    type: "pattern-detected",
    detail: "Formal math derivation caused 35% engagement drop. Pattern matched with Session 1 neuron equation drop.",
  },
  {
    id: "me5",
    session: "Session 2",
    date: "Feb 13",
    event: "Matrix multiplication confusion first detected",
    type: "pattern-detected",
    detail: "22% engagement drop during matrix layer explanation. First occurrence — tracking for pattern confirmation.",
  },
  {
    id: "me6",
    session: "Session 1",
    date: "Feb 6",
    event: "First session baseline established",
    type: "milestone",
    detail: "Initial engagement patterns recorded. Visual analogy opening set a strong 90% baseline.",
    impact: "Baseline established for future comparisons",
  },
];

// ── Support Needs Trend ──────────────────────

export interface AtRiskTrend {
  session: string;
  atRiskCount: number;
  monitoringCount: number;
  totalStudents: number;
}

export const atRiskTrend: AtRiskTrend[] = [
  { session: "Session 1", atRiskCount: 0, monitoringCount: 1, totalStudents: 21 },
  { session: "Session 2", atRiskCount: 0, monitoringCount: 2, totalStudents: 21 },
  { session: "Session 3", atRiskCount: 1, monitoringCount: 2, totalStudents: 21 },
  { session: "Session 4", atRiskCount: 1, monitoringCount: 1, totalStudents: 21 },
  { session: "Session 5", atRiskCount: 1, monitoringCount: 2, totalStudents: 21 },
];

// ── Multi-Agent Insight Summary ──────────────

export interface AgentInsight {
  agent: string;
  icon: string;
  role: string;
  insight: string;
  confidence: number;
  color: string;
}

export const multiAgentInsights: AgentInsight[] = [
  {
    agent: "MediaPipe",
    icon: "👁️",
    role: "Engagement Detection",
    insight: "Theory-heavy slides consistently reduce engagement by 30-40% across sessions. The 25-45 minute window is the highest-risk zone. Visual/example content recovers engagement within 5-8 minutes.",
    confidence: 94,
    color: "accent",
  },
  {
    agent: "Gemini",
    icon: "✨",
    role: "Content Analysis",
    insight: "The chain rule explanation lacks prerequisite scaffolding. Students need a visual warm-up before formal notation. The current slide jumps from intuition to ∂L/∂w without intermediate steps.",
    confidence: 91,
    color: "success",
  },
  {
    agent: "Backboard",
    icon: "📋",
    role: "Session Memory",
    insight: "This is the 3rd session with a theory-math engagement dip. The pattern is accelerating — each occurrence shows a larger drop than the last (28% → 35% → 42%). Without intervention, Session 6 is projected to see a 48%+ drop.",
    confidence: 88,
    color: "warning",
  },
];
