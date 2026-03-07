"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/components/session/SessionEngineProvider";
import EngagementChart from "@/components/teacher/EngagementChart";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Reveal } from "@/components/motion/MotionKit";
import { FaceAnalyzer, type TrackedFace } from "@/lib/face-analyzer";
import { mapSignalsToEngagement, type EngagementState } from "@/lib/engagement-mapper";
import type { StudentEvent, SlideDefinition } from "@/lib/session-engine";
import { SESSION_SLIDES } from "@/lib/session-engine";
import { parsePptx } from "@/lib/pptx-parser";

const ANALYSIS_INTERVAL_MS = 200;
const STATE_COLORS: Record<EngagementState, { bg: string; ring: string; text: string; glow: string; border: string }> = {
    focused: { bg: "bg-emerald-500", ring: "ring-emerald-400/60", text: "text-emerald-400", glow: "shadow-emerald-500/30", border: "border-emerald-400" },
    distracted: { bg: "bg-amber-500", ring: "ring-amber-400/60", text: "text-amber-400", glow: "shadow-amber-500/30", border: "border-amber-400" },
    confused: { bg: "bg-rose-500", ring: "ring-rose-400/60", text: "text-rose-400", glow: "shadow-rose-500/30", border: "border-rose-400" },
    reengaged: { bg: "bg-sky-500", ring: "ring-sky-400/60", text: "text-sky-400", glow: "shadow-sky-500/30", border: "border-sky-400" },
};

interface StudentTrack {
    face: TrackedFace;
    state: EngagementState;
    confidence: number;
    score: number;
    prevState: EngagementState | null;
    scoreHistory: number[];
}

interface EventLog {
    id: string;
    label: string;
    state: EngagementState;
    score: number;
    time: string;
}

export default function LiveDemoPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const analyzerRef = useRef<FaceAnalyzer | null>(null);
    const animFrameRef = useRef<number>(0);
    const prevStatesRef = useRef<Map<string, EngagementState>>(new Map());
    const isRunningRef = useRef(false);

    // Ref for the analysis loop (avoids stale closures)
    const sessionRef = useRef<ReturnType<typeof useSession>>(null!);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [modelLoading, setModelLoading] = useState(false);
    const [modelReady, setModelReady] = useState(false);
    const [students, setStudents] = useState<StudentTrack[]>([]);
    const [eventLog, setEventLog] = useState<EventLog[]>([]);

    // PPT upload
    const [customSlides, setCustomSlides] = useState<SlideDefinition[] | null>(null);
    const [pptFileName, setPptFileName] = useState<string | null>(null);
    const [pptParsing, setPptParsing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const session = useSession();

    // Keep ref up-to-date
    sessionRef.current = session;

    const currentSlides = session.state.slides;
    const currentSlide = currentSlides[session.state.currentSlideIndex] || currentSlides[0];
    const confusionSpikes = session.state.confusionSpikes;

    // ── PPT Upload handler ──
    const handlePptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPptParsing(true);
        try {
            const slides = await parsePptx(file);
            if (slides.length === 0) {
                alert("No slides found in the uploaded file.");
                setPptParsing(false);
                return;
            }
            setCustomSlides(slides);
            setPptFileName(file.name);
        } catch (err) {
            console.error("Error parsing PPTX:", err);
            alert("Could not parse the file. Please upload a valid .pptx file.");
        }
        setPptParsing(false);
    };

    const clearPpt = () => {
        setCustomSlides(null);
        setPptFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── Slide navigation ──
    const goNext = useCallback(() => {
        const next = Math.min(session.state.currentSlideIndex + 1, session.state.slides.length - 1);
        session.setSlide(next);
    }, [session]);

    const goPrev = useCallback(() => {
        const prev = Math.max(session.state.currentSlideIndex - 1, 0);
        session.setSlide(prev);
    }, [session]);

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [goNext, goPrev]);

    useEffect(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, [stream]);
    useEffect(() => {
        return () => {
            isRunningRef.current = false;
            if (analyzerRef.current) analyzerRef.current.destroy();
            cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // ── Analysis loop (ref-based to avoid stale closures) ──
    const startAnalysisLoop = useCallback(() => {
        isRunningRef.current = true;
        let lastAnalysis = 0;

        const loop = () => {
            if (!isRunningRef.current) return;
            animFrameRef.current = requestAnimationFrame(loop);
            const now = performance.now();
            if (now - lastAnalysis < ANALYSIS_INTERVAL_MS) return;
            lastAnalysis = now;

            const video = videoRef.current;
            const analyzer = analyzerRef.current;
            if (!video || !analyzer || !analyzer.isReady() || video.readyState < 2) return;

            const sess = sessionRef.current;
            let trackedFaces: TrackedFace[];
            try {
                trackedFaces = analyzer.processFrameMulti(video, now);
            } catch (err) {
                // MediaPipe can throw on certain frames (e.g. during init)
                console.warn("Frame analysis error (skipping):", err);
                return;
            }
            const slide = sess.state.slides[sess.state.currentSlideIndex];
            if (!slide) return;

            const tracks: StudentTrack[] = trackedFaces.map(face => {
                const prev = prevStatesRef.current.get(face.sessionId) ?? null;
                const result = mapSignalsToEngagement(face.signals, prev);
                prevStatesRef.current.set(face.sessionId, result.state);

                const studentEvent: StudentEvent = {
                    id: `evt-${face.sessionId}-${Date.now()}`,
                    timestamp: Date.now(),
                    studentId: face.sessionId,
                    slideId: slide.id,
                    state: result.state,
                    score: result.engagementScore,
                    confidence: result.confidence,
                    facePresent: face.signals.facePresent,
                    headTurnScore: Math.min(1, Math.abs(face.signals.headYaw) / 0.5),
                    gazeStabilityScore: face.signals.gazeStability,
                    eyeOpennessScore: face.signals.eyeOpenness,
                    movementScore: face.signals.movementScore,
                    mouthActivity: face.signals.mouthActivity,
                    headDown: face.signals.headDown,
                    possibleDrowsiness: face.signals.possibleDrowsiness,
                };
                sess.pushEvent(studentEvent);

                return {
                    face,
                    state: result.state,
                    confidence: result.confidence,
                    score: result.engagementScore,
                    prevState: prev,
                    scoreHistory: [],
                };
            });

            setStudents(prev => {
                return tracks.map(track => {
                    const existing = prev.find(p => p.face.sessionId === track.face.sessionId);
                    const history = existing?.scoreHistory ?? [];
                    return { ...track, scoreHistory: [...history.slice(-19), track.score] };
                });
            });

            // Log state transitions
            for (const track of tracks) {
                if (track.prevState && track.prevState !== track.state) {
                    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    setEventLog(prev => [{
                        id: `${track.face.sessionId}-${Date.now()}`,
                        label: track.face.label,
                        state: track.state,
                        score: track.score,
                        time: timeStr,
                    }, ...prev].slice(0, 40));
                }
            }

        };
        animFrameRef.current = requestAnimationFrame(loop);
    }, []);  // stable — no dependencies, uses refs

    // ── Camera controls ──
    const startCamera = async () => {
        try {
            setModelLoading(true);
            if (!analyzerRef.current) analyzerRef.current = new FaceAnalyzer();
            await analyzerRef.current.initialize();
            setModelReady(true);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setStream(mediaStream);
            session.startSession(customSlides ?? undefined);
            setModelLoading(false);
            setEventLog([]);
            // Start the analysis loop after a brief delay to let video attach
            setTimeout(() => startAnalysisLoop(), 300);
        } catch (err) {
            console.error("Error starting live demo:", err);
            setModelLoading(false);
            alert("Could not start. Please ensure camera permissions are granted.");
        }
    };

    const stopCamera = () => {
        isRunningRef.current = false;
        cancelAnimationFrame(animFrameRef.current);
        if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
        session.stopSession();
        setStudents([]);
        prevStatesRef.current.clear();
    };

    const classAvg = session.state.classAvgEngagement || 0;

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                        Live <span className="gradient-text">Classroom Monitor</span>
                    </h1>
                    {session.state.isActive && (
                        <Badge variant="success" size="md">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                            LIVE — {students.length} {students.length === 1 ? "student" : "students"} tracked
                        </Badge>
                    )}
                    {!session.state.isActive && <Badge variant="default" size="md">Offline</Badge>}
                </div>
                <p className="text-muted max-w-3xl text-sm">
                    Multi-student real-time engagement analysis using <strong>MediaPipe Face Landmarker</strong>. All processing runs locally in your browser. Events flow into teacher/student dashboards and session timeline in real time.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* ═══ LEFT: Camera + Overlays ═══ */}
                <div className="lg:col-span-7 space-y-4">
                    <Card className="p-0 relative overflow-hidden bg-[#070b14] border-white/10">
                        <div className="relative aspect-video">
                            <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform scale-x-[-1] ${stream ? "block" : "hidden"}`} />

                            {!stream && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center text-3xl border border-white/10">
                                            {modelLoading ? "⏳" : "📷"}
                                        </div>
                                        <p className="text-muted text-sm mb-1">{modelLoading ? "Loading MediaPipe Face Model..." : "Multi-student tracking ready"}</p>
                                        {modelLoading && (
                                            <div className="mt-3 w-48 mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-accent via-purple-500 to-accent rounded-full" style={{ width: "70%", animation: "shimmer 1.5s ease-in-out infinite" }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Per-face overlays */}
                            {session.state.isActive && stream && students.map(student => {
                                const bb = student.face.boundingBox;
                                const colors = STATE_COLORS[student.state];
                                const sig = student.face.signals;
                                return (
                                    <div key={student.face.sessionId} className="absolute pointer-events-none transition-all duration-300 ease-out" style={{ right: `${bb.x * 100}%`, top: `${bb.y * 100}%`, width: `${bb.w * 100}%`, height: `${bb.h * 100}%` }}>
                                        <div className={`absolute inset-0 rounded-2xl ring-2 ${colors.ring} transition-all duration-500`}>
                                            <div className={`absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl ${colors.border} transition-colors duration-500`} />
                                            <div className={`absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 rounded-tr-2xl ${colors.border} transition-colors duration-500`} />
                                            <div className={`absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 rounded-bl-2xl ${colors.border} transition-colors duration-500`} />
                                            <div className={`absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 rounded-br-2xl ${colors.border} transition-colors duration-500`} />
                                        </div>
                                        <div className={`absolute -top-9 left-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 shadow-lg ${colors.glow}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} animate-pulse`} />
                                            <span className="text-[10px] font-bold text-white tracking-wide">{student.face.label}</span>
                                            <span className={`text-[10px] font-semibold ${colors.text}`}>{student.score}%</span>
                                        </div>
                                        <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 ${colors.glow} whitespace-nowrap`}>
                                            <span className={`text-[9px] font-bold uppercase tracking-widest ${colors.text}`}>{student.state}</span>
                                            {sig.mouthActivity > 0.3 && <span className="text-[8px] px-1 rounded bg-purple-500/20 text-purple-300">🗣</span>}
                                            {sig.headDown && <span className="text-[8px] px-1 rounded bg-amber-500/20 text-amber-300">↓</span>}
                                            {sig.possibleDrowsiness && <span className="text-[8px] px-1 rounded bg-red-500/20 text-red-300">😴</span>}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Scan line */}
                            {session.state.isActive && stream && (
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent absolute" style={{ animation: "scan 4s ease-in-out infinite" }} />
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-3 bg-black/40 backdrop-blur border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {!stream ? (
                                    <Button onClick={startCamera} variant="primary" size="sm" disabled={modelLoading}>{modelLoading ? "Loading Model..." : "▶ Start Live Session"}</Button>
                                ) : (
                                    <Button onClick={stopCamera} variant="danger" size="sm">■ End Session</Button>
                                )}
                            </div>
                            <Badge variant="warning" size="sm">🔒 On-device only</Badge>
                        </div>
                    </Card>

                    {/* ── PPT Upload ── */}
                    <Card className="bg-accent/[0.03] border-accent/20">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Slide Deck</h3>
                            {pptFileName && <Badge variant="success" size="sm">📄 {pptFileName}</Badge>}
                        </div>

                        {!pptFileName ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pptx"
                                        onChange={handlePptUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        disabled={pptParsing || session.state.isActive}
                                    />
                                    <div className={`border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-accent/40 hover:bg-accent/[0.02] transition-all ${session.state.isActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                                        {pptParsing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm text-muted">Parsing slides...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-3xl mb-2">📤</div>
                                                <p className="text-sm text-foreground font-medium">Upload PowerPoint</p>
                                                <p className="text-xs text-muted mt-1">Drop a .pptx file to use your own slides</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted text-center">Or use the default 6-slide Neural Networks deck</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                                    {(customSlides ?? []).map((slide, i) => (
                                        <div key={slide.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${session.state.currentSlideIndex === i ? "bg-accent/10 ring-1 ring-accent/30" : "bg-white/[0.02]"}`}>
                                            <span className="font-bold text-muted w-5">{slide.id}</span>
                                            <span className="text-foreground truncate flex-1">{slide.title}</span>
                                        </div>
                                    ))}
                                </div>
                                {!session.state.isActive && (
                                    <button onClick={clearPpt} className="text-[10px] text-muted hover:text-foreground transition-colors underline">
                                        Remove and use default deck
                                    </button>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Slide controls + stats */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card className="bg-accent/[0.03] border-accent/20">
                            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Slide</h3>
                            <div className="flex items-center justify-between mb-2">
                                <button onClick={goPrev} disabled={session.state.currentSlideIndex === 0} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-foreground disabled:opacity-30 transition-all" aria-label="Previous slide">←</button>
                                <div className="text-center flex-1 px-2">
                                    <div className="text-xl font-extrabold text-foreground">{currentSlide?.id ?? 1}<span className="text-muted text-sm font-medium"> / {currentSlides.length}</span></div>
                                </div>
                                <button onClick={goNext} disabled={session.state.currentSlideIndex === currentSlides.length - 1} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-foreground disabled:opacity-30 transition-all" aria-label="Next slide">→</button>
                            </div>
                            <div className="bg-black/30 rounded-lg p-2.5 border border-white/5">
                                <p className="text-sm font-semibold text-foreground">{currentSlide?.title ?? ""}</p>
                                <p className="text-xs text-muted mt-0.5">{currentSlide?.topic ?? ""}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted border border-white/5">{currentSlide?.difficulty ?? "medium"}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted border border-white/5">{currentSlide?.teachingMode ?? "lecture"}</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-muted mt-2 text-center">← → arrow keys</p>
                        </Card>

                        <Reveal delay={0.1}>
                            <Card>
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Class Engagement</h3>
                                <div className="text-5xl font-extrabold text-foreground">{classAvg}<span className="text-2xl text-muted ml-1">%</span></div>
                                <p className="text-xs text-muted mt-2">Real-time from {students.length} tracked learner{students.length !== 1 ? "s" : ""}</p>
                            </Card>
                        </Reveal>
                    </div>

                    <EngagementChart />
                </div>

                {/* ═══ RIGHT: Side Panel ═══ */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Student Cards */}
                    <Reveal delay={0.05}>
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Tracked Students</h3>
                                <Badge variant={students.length > 0 ? "success" : "default"} size="sm">{students.length} detected</Badge>
                            </div>
                            {students.length === 0 && <div className="text-center py-8"><p className="text-sm text-muted">Start the session to detect students</p></div>}
                            <div className="space-y-3">
                                {students.map(student => <StudentCard key={student.face.sessionId} student={student} />)}
                            </div>
                        </Card>
                    </Reveal>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                        <Reveal delay={0.1}><Card className="text-center"><p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Students</p><p className="text-2xl font-extrabold text-foreground">{students.length}</p></Card></Reveal>
                        <Reveal delay={0.15}><Card className="text-center"><p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Avg</p><p className="text-2xl font-extrabold text-foreground">{classAvg}<span className="text-sm text-muted">%</span></p></Card></Reveal>
                        <Reveal delay={0.2}><Card className="text-center"><p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Confusion</p><p className="text-2xl font-extrabold text-rose-400">{confusionSpikes}</p></Card></Reveal>
                    </div>

                    {/* Per-Slide Analytics */}
                    <Reveal delay={0.1}>
                        <Card>
                            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Per-Slide Analytics</h3>
                            <div className="space-y-2">
                                {currentSlides.map(slide => {
                                    const a = session.state.slideAnalytics.get(slide.id);
                                    const avg = a?.avgEngagement ?? 0;
                                    const isCurrent = slide.id === currentSlide?.id;
                                    return (
                                        <div key={slide.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${isCurrent ? "bg-accent/10 ring-1 ring-accent/30" : "bg-white/[0.02]"}`}>
                                            <span className={`text-[10px] font-bold w-5 ${isCurrent ? "text-accent-light" : "text-muted"}`}>{slide.id}</span>
                                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-500 ${avg > 70 ? "bg-emerald-500" : avg > 50 ? "bg-amber-500" : avg > 0 ? "bg-rose-500" : "bg-white/10"}`} style={{ width: `${Math.max(2, avg)}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono text-muted w-8 text-right">{avg > 0 ? `${avg}%` : "—"}</span>
                                            <span className="text-[9px] text-muted truncate max-w-20">{slide.topic}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </Reveal>

                    {/* Event Feed */}
                    <Reveal delay={0.15}>
                        <Card>
                            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Live Event Feed</h3>
                            {eventLog.length === 0 && <p className="text-xs text-muted text-center py-4">State transitions appear here</p>}
                            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                {eventLog.map(evt => {
                                    const colors = STATE_COLORS[evt.state];
                                    return (
                                        <div key={evt.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-white/[0.02] border border-white/5 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} shrink-0`} />
                                            <span className="text-[11px] font-semibold text-foreground w-16 shrink-0">{evt.label}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>{evt.state}</span>
                                            <span className="text-[10px] text-muted ml-auto shrink-0">{evt.time}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </Reveal>

                    {/* Privacy + Signal Honesty */}
                    <Reveal delay={0.2}>
                        <Card className="bg-emerald-500/[0.03] border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">🔒</span>
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Privacy & Signal Honesty</h3>
                            </div>
                            <ul className="text-[11px] text-muted space-y-1.5">
                                <li className="flex gap-2"><span className="text-emerald-400">✓</span> MediaPipe WASM runs entirely in your browser</li>
                                <li className="flex gap-2"><span className="text-emerald-400">✓</span> No facial recognition or biometric ID</li>
                                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Only computed metrics flow to dashboards</li>
                            </ul>
                            <div className="mt-3 pt-3 border-t border-white/5">
                                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Signal Classification</p>
                                <div className="space-y-1.5 text-[9px]">
                                    <div>
                                        <p className="font-semibold text-emerald-400 mb-0.5">✅ Direct Measurements</p>
                                        <p className="text-muted pl-3">Face detection · Head pose (yaw/pitch) · Eye openness · Gaze stability · Movement</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-400 mb-0.5">🔧 Heuristic Approximations</p>
                                        <p className="text-muted pl-3">Mouth activity · Head down · Drowsiness · Engagement states</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-500 mb-0.5">🧪 Experimental / Future</p>
                                        <p className="text-muted pl-3">Hand raise · Sleeping · Phone use · Question asking</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Reveal>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                @keyframes shimmer { 0%, 100% { opacity: 0.5; transform: translateX(-10%); } 50% { opacity: 1; transform: translateX(10%); } }
            `}} />
        </div>
    );
}

// ══════════════════════════════════════════════════
// Student Card
// ══════════════════════════════════════════════════

function StudentCard({ student }: { student: StudentTrack }) {
    const colors = STATE_COLORS[student.state];
    const sig = student.face.signals;

    return (
        <div className={`relative p-3 rounded-xl bg-white/[0.03] border border-white/10 transition-all duration-500 shadow-lg ${colors.glow}`}>
            <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${colors.bg} transition-colors duration-500`} />
            <div className="pl-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-bold text-foreground">{student.face.label}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${colors.bg}/20 ${colors.text}`}>{student.state}</span>
                        {sig.mouthActivity > 0.3 && <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300" title="Mouth activity (heuristic)">🗣</span>}
                        {sig.headDown && <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300" title="Head down (heuristic)">↓</span>}
                        {sig.possibleDrowsiness && <span className="text-[9px] px-1 rounded bg-red-500/20 text-red-300" title="Possible drowsiness (heuristic)">😴</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                        <MiniSignal label="Head" value={1 - Math.min(1, Math.abs(sig.headYaw) / 0.5)} color={colors.bg} />
                        <MiniSignal label="Eyes" value={sig.eyeOpenness} color={colors.bg} />
                        <MiniSignal label="Stability" value={sig.gazeStability} color={colors.bg} />
                        <MiniSignal label="Movement" value={1 - sig.movementScore} color={colors.bg} />
                        <MiniSignal label="Mouth" value={sig.mouthActivity} color="bg-purple-500" />
                        <MiniSignal label="Pitch" value={Math.max(0, 1 - Math.abs(sig.headPitch) / 0.5)} color={colors.bg} />
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className={`text-2xl font-extrabold ${colors.text} transition-colors duration-500`}>{student.score}<span className="text-xs text-muted">%</span></div>
                    <div className="flex items-end gap-[2px] h-4 mt-1 justify-end">
                        {student.scoreHistory.slice(-12).map((s, i) => (
                            <div key={i} className={`w-[3px] rounded-full ${colors.bg}/60 transition-all duration-200`} style={{ height: `${Math.max(2, (s / 100) * 16)}px` }} />
                        ))}
                    </div>
                    <p className="text-[9px] text-muted mt-0.5">conf {(student.confidence * 100).toFixed(0)}%</p>
                </div>
            </div>
        </div>
    );
}

function MiniSignal({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="flex items-center gap-1">
            <span className="text-[8px] text-muted w-10 shrink-0">{label}</span>
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width: `${Math.max(3, value * 100)}%`, opacity: 0.7 }} />
            </div>
        </div>
    );
}
