/**
 * Engagement Mapper — Pure function module
 * 
 * Maps raw face analysis signals into engagement states.
 * No dependencies, no side effects. All logic is transparent and heuristic-based.
 * 
 * States:
 *   focused     = face present, head forward, stable gaze, eyes open
 *   distracted  = face absent OR head turned away OR gaze unstable
 *   confused    = face present but unstable head/gaze + elevated movement
 *   reengaged   = transition from distracted/confused back to focused
 */

export type EngagementState = "focused" | "distracted" | "confused" | "reengaged";

export interface FaceSignals {
    facePresent: boolean;
    faceConfidence: number;     // 0-1
    headYaw: number;            // radians, 0 = forward, negative = turned left
    headPitch: number;          // radians, 0 = forward, negative = looking down
    eyeOpenness: number;        // 0-1, average of both eyes
    gazeStability: number;      // 0-1, computed over time (1 = very stable)
    movementScore: number;      // 0-1, frame-to-frame jitter (1 = lots of movement)
    mouthActivity: number;      // 0-1, jaw open blendshape (heuristic: talking)
    headDown: boolean;          // headPitch < -0.3 (heuristic: looking down)
    possibleDrowsiness: boolean; // eyes low + head down + low movement (heuristic)
}

export interface EngagementEvent {
    timestamp: number;
    slideId: number;
    topicTitle: string;
    facePresent: boolean;
    headTurnScore: number;          // 0-1, how far head is turned from center
    gazeStabilityScore: number;     // 0-1
    eyeOpennessScore: number;       // 0-1
    movementScore: number;          // 0-1
    mouthActivity: number;          // 0-1 (heuristic: talking)
    headDown: boolean;              // heuristic: looking down
    possibleDrowsiness: boolean;    // heuristic compound signal
    derivedState: EngagementState;
    confidence: number;             // 0-1
    source: "mediapipe-live";
}

/**
 * Maps raw face signals into an engagement state.
 * 
 * The previousState parameter enables re-engaged detection:
 * if the user was distracted/confused and is now showing focused behavior,
 * we label it "reengaged" for one cycle before switching to "focused".
 */
export function mapSignalsToEngagement(
    signals: FaceSignals,
    previousState: EngagementState | null
): { state: EngagementState; confidence: number; engagementScore: number } {

    // ── No face detected → distracted ──
    if (!signals.facePresent) {
        return { state: "distracted", confidence: 0.90, engagementScore: 20 };
    }

    // ── Compute composite scores ──
    const headTurn = Math.abs(signals.headYaw);
    const headTilt = Math.abs(signals.headPitch);

    // Head significantly turned away (> ~20 degrees = 0.35 rad)
    const isLookingAway = headTurn > 0.35 || headTilt > 0.40;

    // Eyes mostly closed
    const eyesClosed = signals.eyeOpenness < 0.25;

    // Gaze is unstable (< 0.4 stability)
    const gazeUnstable = signals.gazeStability < 0.40;

    // Lots of movement
    const highMovement = signals.movementScore > 0.50;

    // ── Decision tree ──

    // DISTRACTED: looking away or eyes closed
    if (isLookingAway) {
        return {
            state: "distracted",
            confidence: 0.75 + Math.min(headTurn, 0.25),
            engagementScore: Math.max(15, 55 - headTurn * 80)
        };
    }

    if (eyesClosed) {
        return {
            state: "distracted",
            confidence: 0.70,
            engagementScore: 30
        };
    }

    // CONFUSED: face present but unstable gaze + elevated movement
    if (gazeUnstable && highMovement) {
        return {
            state: "confused",
            confidence: 0.65 + signals.movementScore * 0.15,
            engagementScore: Math.max(30, 60 - signals.movementScore * 40)
        };
    }

    // CONFUSED: just very unstable gaze (milder)
    if (gazeUnstable && signals.gazeStability < 0.25) {
        return {
            state: "confused",
            confidence: 0.60,
            engagementScore: 45
        };
    }

    // ── If we get here, the person looks focused ──

    // RE-ENGAGED: was previously distracted or confused, now focused
    if (previousState === "distracted" || previousState === "confused") {
        return {
            state: "reengaged",
            confidence: 0.75,
            engagementScore: 72
        };
    }

    // FOCUSED: everything looks good
    const focusQuality =
        (1 - Math.min(headTurn / 0.35, 1)) * 0.30 +   // head forward
        signals.eyeOpenness * 0.25 +                      // eyes open
        signals.gazeStability * 0.30 +                     // gaze stable
        (1 - signals.movementScore) * 0.15;                // not fidgeting

    return {
        state: "focused",
        confidence: 0.65 + focusQuality * 0.30,
        engagementScore: Math.round(60 + focusQuality * 38)
    };
}
