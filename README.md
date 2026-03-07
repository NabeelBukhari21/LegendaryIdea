# InsightBoard AI

**Privacy-first classroom learning copilot** — detect confusion, help students learn, help teachers teach.

Built for the **Google Antigravity Hackathon**.

---

## What It Does

InsightBoard AI closes the feedback loop between student engagement and teaching:

1. **Detect** — Real-time engagement analysis spots when students disengage (Presage)
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
| **Google Antigravity** | Hackathon Track | Competition framework |
| **Gemini API** | Content Intelligence | AI recaps, simpler explanations, worked examples, quiz generation, teaching recommendations |
| **Presage** | Engagement Detection | On-device real-time engagement analysis from camera feeds — raw media never stored |
| **Backboard** | Session Memory | Persistent cross-session memory — recurring confusion patterns, intervention tracking |
| **Solana** | Audit Verification | Tamper-evident hash proofs for data access, consent receipts, deletion confirmations (hashes only, no content on-chain) |

---

## Architecture

```
Student Device (Presage)
    ↓ engagement scores (raw media deleted immediately)
API Server (encrypted, AES-256)
    ↓ dip detection + student reflections
Gemini API
    ↓ personalized recap (student-private) + aggregated insights (teacher)
Backboard
    ↓ cross-session pattern memory
Solana
    ↓ audit proofs (SHA-256 hashes only)
```

**Privacy boundaries:**
- Teachers **only** see aggregated, anonymized class-level data
- Students **own** their data — view, export, or delete any time
- Raw media is **deleted immediately** after on-device processing
- Every access is **logged** with tamper-evident verification

---

## Features

### Teacher Dashboard (`/teacher`)
- Classroom engagement overview with 4 summary stats
- Slide-by-slide engagement chart with Slide 4 dip highlighted
- Aggregated student feedback reasons
- Zone-based engagement heatmap
- AI teaching recommendations (Gemini-powered)
- Post-Slide-4 behavioral shift analysis
- Top weak topic and best intervention cards

### Student Dashboard (`/student`)
- Personal engagement timeline
- Focus moments and drop-off highlights
- Topic-by-topic breakdown
- 3-step reflection flow with reason selection
- AI recap with simpler explanation
- Worked example card
- Interactive mini quiz (3 questions, no grades)
- Personal study advice and learning pattern insights

### Session Timeline (`/session`)
- 6-slide interactive timeline with engagement and confusion bars
- Engagement curve with dip zone and threshold
- 5-beat story card (narrative of the session)
- Detailed slide panel with transcript, metrics, and recommendations

### Memory Insights (`/memory`)
- Recurring confusion topics with cross-session trend indicators
- Disengagement windows analysis
- Cross-session trend charts (engagement vs. confusion, support needs)
- Class-wide and student-level pattern examples
- Teaching format analysis (best vs. weakest formats)
- Memory timeline: how the system learned across sessions
- Multi-agent insight convergence (Presage + Gemini + Backboard)

### Privacy & Audit (`/privacy`)
- 6 privacy-by-design principles
- Data flow lifecycle (6 stages with retention policies)
- Minimal retention policy for 6 data types
- 5-layer consent architecture
- Encrypted off-chain storage diagram
- Solana audit proofs with verified entries
- Tamper-evident access log with chained hashes

### Landing Page (`/`)
- One-line pitch with 5-step workflow
- Teacher and student value cards
- Technology category mapping
- Demo scenario walkthrough
- Privacy trust section
- Navigation to all dashboards

---

## Demo Scenario

> **Session 5 — Neural Networks Deep Dive** (21 students, 6 slides)

1. Session opens with **87% engagement**
2. **Slide 4** (Backpropagation Math) hits — engagement crashes to **45%**, confusion spikes to **62%**
3. **43% of students** report "too fast" and "unclear example"
4. Gemini generates a **personalized recap** with simpler explanation, worked example, and 3 review questions — **private to each student**
5. Teacher receives **aggregated insight**: theory-heavy content → 35% avg engagement drop. Suggestion: add visual scaffolding
6. **Backboard memory** flags this as the **3rd occurrence** of this pattern — projects **48%+ drop next session** without change

**The entire intelligence loop runs in under 60 seconds.**

---

## Pitch Bullets

- **"Detect confusion. Help students learn. Help teachers teach."**
- Privacy-first: raw media never stored, teachers never see individual data
- Reflection-driven: students validate AI detections, not the other way around
- Persistent memory: the system learns and improves across sessions
- Explainable: every insight shows its source data, confidence, and reasoning
- On-chain audit: tamper-evident proofs for every data access — verifiable by anyone
- No grades, no discipline, no ranking — learning support only

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

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Design**: Glassmorphism, dark theme, custom animations

---

## Important Notes

- This is an MVP demo with mock data — no real backend or API calls
- All student data shown is simulated
- Presage, Gemini, Backboard, and Solana integrations are represented as placeholders
- The focus is on demonstrating the product concept, UX, and privacy architecture

---

*Built for the Google Antigravity Hackathon 2026.*


### WHAT TO DO DO NEXT:
Project Handover — InsightBoard AI

We’ve built the app up to the Gemini integration stage. The project is a privacy-first classroom learning copilot built as a Next.js App Router web app with TypeScript, Tailwind CSS, and Recharts.

What’s already implemented

Core app structure

The app already has these main pages working:
	•	Landing page
	•	Teacher dashboard
	•	Student dashboard
	•	Session timeline page
	•	Memory insights page
	•	Privacy and audit page

Current product flow

The app is designed around this loop:

detect engagement dip → map it to a slide/topic → ask student why → generate AI support → show teacher aggregated insights → remember recurring patterns

UI / UX

A full modern UI pass has already been done:
	•	premium dark/futuristic design
	•	motion system across pages
	•	animated charts
	•	scroll-triggered section reveals
	•	polished cards, layouts, and dashboards
	•	stronger visual emphasis on teacher dashboard and memory page

Mock/demo logic already built

These MVP demo elements are already in place:
	•	1 class session with 6 slides
	•	clear engagement dip on slide 4
	•	student reflection flow
	•	teacher aggregated insight flow
	•	recurring pattern memory from previous sessions
	•	at-risk alert
	•	privacy-first trust messaging
	•	Solana / Presage / Backboard placeholders were already designed in concept

Gemini integration — completed

Gemini is now the first real integration that has been added.

Gemini is being used for:
	•	student recap generation
	•	simpler explanation of the confusing topic
	•	worked example generation
	•	review question generation
	•	teacher recommendation summary
	•	aggregated reflection summary

Gemini implementation status
Already done:
	•	server-side Gemini integration layer / API route
	•	environment variable setup
	•	Gemini connected into the most important student and teacher cards
	•	loading states
	•	error states
	•	fallback behavior so demo still works if API fails
	•	privacy-first structure so raw student media is not sent to Gemini, only structured insight/topic/reflection data

⸻

What still needs to be done

1. Presage integration

Next task is to add a real or semi-real Presage-aligned signal pipeline.

Goal
Replace some static engagement placeholder data with believable live/replayable engagement signal flow.

What needs to be done
	•	define a structured signal/event model
	•	create a Presage adapter or event ingestion layer
	•	connect signal output to:
	•	teacher dashboard
	•	session timeline
	•	student timeline
	•	make charts respond to actual event data
	•	keep it limited to useful states like:
	•	focused
	•	confused
	•	distracted
	•	re-engaged

Important
Do not build creepy surveillance logic or too many labels.

⸻

2. Backboard integration

After Presage, add the Backboard memory/orchestration layer.

Goal
Turn the memory page into a real persistent learning intelligence feature.

What needs to be done
Use Backboard for:
	•	recurring confusion topics
	•	recurring disengagement patterns
	•	memory across 2–3 sessions
	•	at-risk pattern retrieval
	•	teacher recommendations informed by session history
	•	student support informed by past weak spots

Multi-agent structure expected
	•	Engagement Agent
	•	Content Agent
	•	Reflection Agent
	•	Intervention Agent
	•	Student Support Agent
	•	Memory Agent

Must connect to:
	•	Memory page
	•	Teacher dashboard recommendation logic
	•	Student pattern insight card
	•	At-risk alert logic

⸻

3. Solana layer

Do this last.

Goal
Add a lightweight trust/auditability layer.

Solana should only be used for:
	•	tamper-evident hashes
	•	audit proof records
	•	consent receipt proof concept
	•	access verification records

Solana should NOT be used for:
	•	raw media storage
	•	storing classroom video/photos on-chain
	•	core app data

Where it should show up
	•	Privacy and Audit page
	•	README / architecture summary
	•	optional small trust panel or proof status card

⸻

4. Final polish after integrations

Once the above is done:
	•	unify all integration flows
	•	check loading/fallback states
	•	make sure UI still feels polished
	•	confirm the story still stays:
	•	privacy-first
	•	learning support
	•	teaching improvement
	•	not surveillance

⸻

Current tech stack
	•	Next.js App Router
	•	TypeScript
	•	Tailwind CSS
	•	Recharts
	•	Gemini API
	•	planned: Presage
	•	planned: Backboard
	•	planned: Solana as audit layer only

⸻

Important product rules

These should stay unchanged:
	•	teachers should only see aggregated insights by default
	•	teachers should not see raw student media
	•	raw media should not be sent to Gemini
	•	the app should be framed as learning support, not surveillance
	•	any trust/privacy language must stay realistic
	•	Solana must not be presented as “consent is unnecessary”

⸻

Recommended next order

Best handoff order:
	1.	Presage integration
	2.	Backboard integration
	3.	Solana audit layer
	4.	final polish + README + demo prep

⸻

Demo story to preserve

The demo is centered on:
	•	slide 4 causes the biggest engagement drop
	•	students report reasons like:
	•	too fast
	•	unclear explanation
	•	Gemini generates:
	•	recap
	•	simpler explanation
	•	worked example
	•	review questions
	•	teacher sees aggregated recommendation
	•	memory page shows this is a recurring pattern across sessions