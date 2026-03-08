# InsightBoard AI

**Privacy-first classroom learning copilot** — detect confusion, help students learn, help teachers teach.

Built for the **Google Antigravity Hackathon**.

---

## What It Does

InsightBoard AI closes the feedback loop between student engagement and teaching:

1. **Detect** — Real-time engagement analysis via browser-based computer vision (MediaPipe)
2. **Map** — Dips are mapped to the specific slide and topic causing confusion
3. **Reflect** — Students are asked why they disengaged (not assumed)
4. **Recap** — AI generates a personalized simpler explanation + review questions (Gemini)
5. **Improve** — Teachers receive aggregated class-level insights and teaching suggestions
6. **Remember** — Recurring patterns are tracked across sessions (Backboard)
7. **Verify** — Every data access is logged with tamper-evident proofs (Solana)

---

## Category Mapping

| Technology | Role | What It Does |
|---|---|---|
| **Gemini API** | Content Intelligence | AI recaps, simpler explanations, worked examples, quiz generation, teaching recommendations |
| **MediaPipe** | Engagement Detection | On-device, privacy-first engagement sensing via Face Landmarker — outputs learning-relevant state labels (focused, confused, distracted, reengaged) without storing raw media |
| **Backboard** | Long-Term Memory & Orchestration | **Fully Integrated API:** Uses the official Backboard SDK for robust state persistence. Employs a dual-assistant architecture (Session vs. Long-Term), dedicated Threads per student/teacher, Document Uploads for RAG, and JSON Tool Calls for fetching cross-session analytics. |
| **React Three Fiber** | 3D Immersive Learning | Browser-based WebXR layer offering interactive 3D visualizations for complex architectural concepts (e.g., Backpropagation) without requiring a VR headset. |
| **Solana** | Audit Verification | Tamper-evident hash proofs for data access, consent receipts, deletion confirmations (hashes only, no content on-chain) |

---

## Architecture

```
Student Browser (MediaPipe Face Landmarker — WASM, runs 100% in-browser)
    ↓ face signals: head pose, gaze, eye openness, movement, mouth activity
Session Engine (SessionEngineProvider)
    ↓ per-student tracking, per-slide analytics, dip/recovery detection
    ↓ → Teacher Dashboard (aggregated, anonymized)
    ↓ → Student Dashboard (personal engagement journey)
    ↓ → Session Timeline (auto-built from live data)
Gemini API
    ↓ personalized recap (student-private) + aggregated insights (teacher)
Backboard Agent Architecture (Real API Integration)
    ├─ Session Assistant (Fast analytics & slide document RAG grounding)
    ├─ Long-Term Memory Assistant (Cross-session trend synthesis via Tool Calls)
    ├─ Teacher Master Thread (Aggregated class trends)
    └─ Student Personal Threads (Individual learning journeys)
React Three Fiber (WebGL)
    └─ Premium 3D Immersive Concept Hub for spatial explanations
Solana
    ↓ audit proofs (SHA-256 hashes only)
```

**Privacy boundaries:**
- Teachers **only** see aggregated, anonymized class-level data
- Students **own** their data — view, export, or delete any time
- Raw video **never leaves the browser** — only computed metrics flow to dashboards
- No facial recognition, no biometric ID, no persistent identity
- Every access is **logged** with tamper-evident verification

---

## Live Demo — Real Computer Vision

The live demo (`/live-demo`) is the **central session engine** that drives the entire app with real data.

### How It Works
- **MediaPipe Face Landmarker** runs as a WASM module in the browser
- Tracks **up to 5 students** simultaneously from a single webcam
- Extracts per-face signals every 200ms:
  - Face present / absent
  - Head pose (yaw, pitch)
  - Eye openness / blink approximation
  - Gaze stability
  - Movement stability
  - Mouth activity (heuristic)
  - Head down (heuristic)
  - Possible drowsiness (compound heuristic)
- Maps signals → engagement states via a decision tree
- Pushes events to the **SessionEngine**, which computes per-student and per-slide analytics
- All dashboards consume this data in real time

### PPT Upload
- Upload a `.pptx` file to use your own slide deck
- Client-side parsing via JSZip (no server upload)
- Slide titles and content are extracted and used as the active deck
- Or use the default 6-slide "Neural Networks Deep Dive" demo deck

### Signal Honesty

| Tier | Signals |
|---|---|
| ✅ **Direct Measurements** | Face detection, head pose (yaw/pitch), eye openness, gaze stability, movement |
| 🔧 **Heuristic Approximations** | Mouth activity, head down, drowsiness, engagement states |
| 🧪 **Experimental / Future** | Hand raise, sleeping, phone use, question asking |

---

## Features

### Live Demo (`/live-demo`)
- Real-time multi-student tracking (up to 5 faces)
- Per-face overlays with state, score, confidence, and micro-signal badges
- PPT upload or default demo deck
- Slide navigation with keyboard arrows
- Per-slide analytics panel
- Live event feed (state transitions)
- Privacy & signal honesty classification card

### Teacher Dashboard (`/teacher`)
- Classroom engagement overview with live stats
- Slide-by-slide engagement bar chart (live or demo data)
- Engagement timeline chart
- Aggregated student feedback reasons
- Zone-based engagement heatmap
- AI teaching recommendations (Gemini-powered)
- At-risk student alerts
- Post-Slide-4 behavioral shift analysis

### Student Dashboard (`/student`)
- Personal engagement timeline (live or demo)
- Topic-by-topic comprehension breakdown
- 3-step reflection flow with reason selection
- AI recap with simpler explanation
- Worked example card
- Interactive mini quiz (3 questions, no grades)
- Personal study advice and learning pattern insights

### Session Timeline (`/session`)
- Interactive timeline auto-built from live slide analytics
- Engagement curve with dip zone and threshold
- 5-beat story card (narrative of the session)
- Detailed slide panel with transcript, metrics, and recommendations

### Memory Insights (`/memory`)
- Recurring confusion topics with cross-session trend indicators
- Disengagement windows analysis
- Cross-session trend charts
- Class-wide and student-level pattern examples
- Teaching format analysis
- Active Backboard integration with Long-Term Memory Assistants and RAG document grounding

### Immersive Learning 3D (`/student/immersive`)
- Premium 3D WebGL Neural Network Hero scene
- Full-screen "Concept Recovery" Hub with OrbitControls
- 8-step interactive Backpropagation visualizer (Forward/Backward passes)
- Contextual launch from Student Dashboard on weak topics

### Privacy & Audit (`/privacy`)
- 6 privacy-by-design principles
- Data flow lifecycle (6 stages with retention policies)
- Minimal retention policy for 6 data types
- 5-layer consent architecture
- Encrypted off-chain storage diagram
- Solana audit proofs with verified entries
- Tamper-evident access log with chained hashes

---

## Demo Flow (For Judges)

> **Session 5 — Neural Networks Deep Dive** (21 students, 6 slides)

1. Open `/live-demo` → Start Live Session → grant camera
2. Students appear as tracked faces with real-time overlays
3. Navigate slides with ← → arrow keys
4. Watch dashboards update in real time:
   - `/teacher` — class overview, engagement chart, at-risk alerts
   - `/student` — topic breakdown, engagement journey
   - `/session` — auto-built timeline from live data
5. Upload your own `.pptx` to test with custom content
6. All data stays in your browser — no server, no storage

---

## Setup

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
git clone https://github.com/NabeelBukhari21/LegendaryIdea.git
cd LegendaryIdea
npm install
npm run dev
```

### Environment Variables
To enable live Backboard AI features, create an `.env.local` file and add your key:
```bash
BACKBOARD_API_KEY=your_key_here
```
If you run out of tokens or want to test without Backboard, temporarily set:
```bash
MOCK_BACKBOARD=true
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **3D WebXR** | React Three Fiber, Three.js, Drei |
| **Charts** | Recharts |
| **Computer Vision** | MediaPipe Face Landmarker (WASM) |
| **Orchestration** | Backboard SDK (Assistants, Threads, Memory, ToolCalls) |
| **PPTX Parsing** | JSZip |
| **State Management** | React Context + useSyncExternalStore |
| **Design** | Glassmorphism, dark theme, custom animations |

---

## Integration Architecture

| Component | Status | Details |
|---|---|---|
| **MediaPipe Face Landmarker** | ✅ Real | Browser-based WASM. Runs on any device with a camera. No server needed. |
| **Session Engine** | ✅ Real | Central state store with per-student, per-slide analytics, dip/recovery detection, timeline generation |
| **Gemini API** | ✅ Real | Server-side integration (`/api/gemini`). Generates live recaps, explanations, recommendations |
| **Frontend UI** | ✅ Real | Next.js 16, Tailwind CSS 4, Recharts. All UI, routing, animations |
| **3D Immersive Layer**| ✅ Real | React Three Fiber WebGL canvas rendering complex neural network concepts interactively |
| **Backboard** | ✅ Real | Fully integrated Backboard Node SDK utilizing robust Assistants, Threads, ToolCalls, and Documents. Includes a secure server-side proxy system and graceful `MOCK_BACKBOARD` token-saving fallbacks. |
| **Solana** | 🔶 Simulated | Audit proofs generated via `SolanaProvider` using real SHA-256 hashes locally |
| **Student Data** | 🔶 Demo | All profiles, reflections, and class participation metrics are demo data (replaced by live session data when camera is active) |

---

*Built for the Google Antigravity Hackathon 2026.*
