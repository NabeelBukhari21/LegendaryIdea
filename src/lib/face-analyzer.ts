/**
 * Face Analyzer — Multi-face MediaPipe Face Landmarker
 * 
 * Supports up to 4 faces simultaneously. Each face gets:
 *   - A stable session-based ID (no biometric identification)
 *   - Independent temporal smoothing for gaze stability and movement
 *   - Extracted signals: head pose, eye openness, face presence, movement
 * 
 * Privacy: All processing in-browser. No frames leave the device.
 *          Face IDs are position-based session IDs, not biometric.
 */

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import type { FaceSignals } from "./engagement-mapper";

const WASM_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task";

const MAX_FACES = 5;
const STABILITY_WINDOW = 12;

export interface TrackedFace {
    sessionId: string;          // e.g. "student-A", stable within session
    label: string;              // e.g. "Learner A"
    signals: FaceSignals;
    noseTipX: number;           // normalized 0-1 for position tracking
    noseTipY: number;
    boundingBox: { x: number; y: number; w: number; h: number };
}

// Per-face temporal state
interface FaceTemporalState {
    yawHistory: number[];
    pitchHistory: number[];
    movementHistory: number[];
    prevNoseTip: { x: number; y: number } | null;
    lastSeenMs: number;
}

const LABELS = ["Learner A", "Learner B", "Learner C", "Learner D", "Learner E"];
const IDS = ["student-A", "student-B", "student-C", "student-D", "student-E"];

export class FaceAnalyzer {
    private landmarker: FaceLandmarker | null = null;
    private loading = false;
    private ready = false;

    // Per-face temporal tracking, keyed by slot index
    private faceStates: Map<number, FaceTemporalState> = new Map();
    // Track which slot indices were used last frame for stable ID assignment
    private prevFacePositions: { x: number; y: number }[] = [];

    async initialize(): Promise<void> {
        if (this.ready || this.loading) return;
        this.loading = true;

        try {
            const vision = await FilesetResolver.forVisionTasks(WASM_CDN);

            this.landmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: MODEL_URL,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numFaces: MAX_FACES,
                outputFaceBlendshapes: true,
                outputFacialTransformationMatrixes: true,
            });

            this.ready = true;
        } catch (err) {
            console.error("[FaceAnalyzer] Failed to initialize MediaPipe:", err);
            throw err;
        } finally {
            this.loading = false;
        }
    }

    isReady(): boolean {
        return this.ready;
    }

    /**
     * Process a video frame and return signals for ALL detected faces.
     * Each face gets a stable session-based ID via position-matching.
     */
    processFrameMulti(video: HTMLVideoElement, timestampMs: number): TrackedFace[] {
        if (!this.landmarker || !this.ready || video.videoWidth === 0 || video.videoHeight === 0) return [];

        let results: any;
        const originalConsoleError = console.error;
        try {
            // MediaPipe Wasm logs benign INFO messages to stderr, which Next.js catches as fatal React errors.
            console.error = (...args: any[]) => {
                const msg = args.map(String).join(" ");
                if (msg.includes("XNNPACK delegate") || msg.includes("INFO:")) return;
                originalConsoleError(...args);
            };
            results = this.landmarker.detectForVideo(video, timestampMs);
        } catch (e) {
            console.error = originalConsoleError;
            throw e;
        } finally {
            console.error = originalConsoleError;
        }

        if (!results || !results.faceLandmarks || results.faceLandmarks.length === 0) {
            return [];
        }

        const faces: TrackedFace[] = [];
        const currentPositions: { x: number; y: number }[] = [];

        // Match detected faces to stable slots using position proximity
        const usedSlots = new Set<number>();
        const faceSlots: number[] = new Array(results.faceLandmarks.length).fill(-1);

        for (let i = 0; i < results.faceLandmarks.length; i++) {
            const landmarks = results.faceLandmarks[i];
            const nose = landmarks[1];
            if (!nose) continue;
            currentPositions.push({ x: nose.x, y: nose.y });

            // Find closest previous face position to assign stable slot
            let bestSlot = -1;
            let bestDist = 0.15; // max distance threshold for matching
            for (let s = 0; s < this.prevFacePositions.length; s++) {
                if (usedSlots.has(s)) continue;
                const dx = nose.x - this.prevFacePositions[s].x;
                const dy = nose.y - this.prevFacePositions[s].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestSlot = s;
                }
            }

            if (bestSlot === -1) {
                // New face — assign next available slot
                for (let s = 0; s < MAX_FACES; s++) {
                    if (!usedSlots.has(s)) {
                        bestSlot = s;
                        break;
                    }
                }
            }

            if (bestSlot === -1) bestSlot = i % MAX_FACES;
            usedSlots.add(bestSlot);
            faceSlots[i] = bestSlot;
        }

        for (let i = 0; i < results.faceLandmarks.length; i++) {
            const slot = faceSlots[i];
            if (slot === -1) continue;

            const landmarks = results.faceLandmarks[i];
            const blendshapes = results.faceBlendshapes?.[i]?.categories || [];
            const matrix = results.facialTransformationMatrixes?.[i]?.data;

            // Ensure temporal state exists for this slot
            if (!this.faceStates.has(slot)) {
                this.faceStates.set(slot, {
                    yawHistory: [],
                    pitchHistory: [],
                    movementHistory: [],
                    prevNoseTip: null,
                    lastSeenMs: timestampMs,
                });
            }
            const temporal = this.faceStates.get(slot)!;
            temporal.lastSeenMs = timestampMs;

            // ── Head pose ──
            let headYaw = 0, headPitch = 0;
            if (matrix && matrix.length >= 12) {
                headYaw = Math.atan2(matrix[8] as number, matrix[0] as number);
                headPitch = Math.asin(-(matrix[4] as number));
                headYaw = Math.max(-1.2, Math.min(1.2, headYaw));
                headPitch = Math.max(-1.2, Math.min(1.2, headPitch));
            }

            // ── Eye openness ──
            let eyeOpenness = 0.7;
            const blinkL = this.getBlendshape(blendshapes, "eyeBlinkLeft");
            const blinkR = this.getBlendshape(blendshapes, "eyeBlinkRight");
            if (blinkL !== null && blinkR !== null) {
                eyeOpenness = 1 - (blinkL + blinkR) / 2;
            }

            // ── Movement ──
            let frameMovement = 0;
            const nose = landmarks[1];
            if (nose && temporal.prevNoseTip) {
                const dx = nose.x - temporal.prevNoseTip.x;
                const dy = nose.y - temporal.prevNoseTip.y;
                frameMovement = Math.sqrt(dx * dx + dy * dy);
            }
            if (nose) temporal.prevNoseTip = { x: nose.x, y: nose.y };

            // ── Temporal smoothing (per-face) ──
            temporal.yawHistory.push(headYaw);
            temporal.pitchHistory.push(headPitch);
            temporal.movementHistory.push(frameMovement);
            if (temporal.yawHistory.length > STABILITY_WINDOW) temporal.yawHistory.shift();
            if (temporal.pitchHistory.length > STABILITY_WINDOW) temporal.pitchHistory.shift();
            if (temporal.movementHistory.length > STABILITY_WINDOW) temporal.movementHistory.shift();

            const yawVar = this.variance(temporal.yawHistory);
            const pitchVar = this.variance(temporal.pitchHistory);
            const gazeStability = Math.max(0, Math.min(1, 1 - (yawVar + pitchVar) * 20));

            const avgMov = temporal.movementHistory.reduce((a, b) => a + b, 0) / temporal.movementHistory.length;
            const movementScore = Math.min(1, avgMov * 15);

            // ── Mouth activity (jawOpen blendshape) — heuristic for talking ──
            let mouthActivity = 0;
            const jawOpen = this.getBlendshape(blendshapes, "jawOpen");
            if (jawOpen !== null) mouthActivity = Math.min(1, jawOpen);

            // ── Head-down detection (heuristic) ──
            const headDown = headPitch < -0.3;

            // ── Possible drowsiness (compound heuristic) ──
            const possibleDrowsiness = eyeOpenness < 0.3 && headDown && movementScore < 0.15;

            // ── Bounding box estimation from landmarks ──
            let minX = 1, maxX = 0, minY = 1, maxY = 0;
            for (const lm of landmarks) {
                if (lm.x < minX) minX = lm.x;
                if (lm.x > maxX) maxX = lm.x;
                if (lm.y < minY) minY = lm.y;
                if (lm.y > maxY) maxY = lm.y;
            }
            const pad = 0.04;

            faces.push({
                sessionId: IDS[slot] || `student-${slot}`,
                label: LABELS[slot] || `Learner ${slot + 1}`,
                signals: {
                    facePresent: true,
                    faceConfidence: 0.95,
                    headYaw,
                    headPitch,
                    eyeOpenness: Math.max(0, Math.min(1, eyeOpenness)),
                    gazeStability,
                    movementScore,
                    mouthActivity,
                    headDown,
                    possibleDrowsiness,
                },
                noseTipX: nose?.x ?? 0.5,
                noseTipY: nose?.y ?? 0.5,
                boundingBox: {
                    x: Math.max(0, minX - pad),
                    y: Math.max(0, minY - pad),
                    w: Math.min(1, maxX - minX + pad * 2),
                    h: Math.min(1, maxY - minY + pad * 2),
                },
            });
        }

        this.prevFacePositions = currentPositions;

        // Clean up stale temporal states (not seen for > 3 seconds)
        for (const [slot, state] of this.faceStates.entries()) {
            if (timestampMs - state.lastSeenMs > 3000) {
                this.faceStates.delete(slot);
            }
        }

        return faces;
    }

    destroy(): void {
        if (this.landmarker) {
            this.landmarker.close();
            this.landmarker = null;
        }
        this.ready = false;
        this.faceStates.clear();
        this.prevFacePositions = [];
    }

    // ── Helpers ──

    private getBlendshape(
        categories: { categoryName: string; score: number }[],
        name: string
    ): number | null {
        const match = categories.find(c => c.categoryName === name);
        return match ? match.score : null;
    }

    private variance(arr: number[]): number {
        if (arr.length < 2) return 0;
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / arr.length;
    }
}
