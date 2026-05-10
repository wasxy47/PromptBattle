<div align="center">

![PromptBattle Preview](./assets/Screenshot%202026-05-10%20093006.png)

<br/>

# ⚔️ PROMPTBATTLE

### AI Prompt Evaluation Arena

**Pit two prompts against each other. Let the AI Tribunal declare the victor.**

**[🔥 Live Demo (Vercel)](https://prompt-battle-tau.vercel.app/)**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Judge-Groq_LLaMA_3.3_70B-F55036?style=for-the-badge)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📖 What is PromptBattle?

**PromptBattle** is a production-grade **LLM prompt evaluation platform** built as a battle-themed arena. You submit two competing prompts — a *Red Fighter* and a *Blue Fighter* — and an AI Tribunal (powered by Groq's LLaMA 3.3 70B) judges them head-to-head across **5 combat dimensions**, producing a final winner, detailed score breakdown, bias analysis, and a written verdict.

Think of it as: **UFC for AI Prompts.**

It answers the question every prompt engineer faces daily:

> *"Is my new prompt actually better than the old one — or do I just think it is?"*

PromptBattle removes the guesswork with objective, reproducible, bias-mitigated evaluation.

---

## 🎯 Why Does This Exist? (The Problem It Solves)

### Without PromptBattle:
- You write a prompt, test it manually, and *feel* like it works — but you have no data
- You have two versions of a prompt and don't know which is better
- Your LLM might be judging based on which prompt is **longer** (verbosity bias) or which comes **first** (position bias) — not which is actually better
- There's no history of how your prompts have performed over time
- There's no way to rank your entire prompt library

### With PromptBattle:
- ✅ **Objective scoring** across 5 measurable dimensions (not just vibes)
- ✅ **Bias mitigation** — the same battle runs twice with order swapped to detect and correct for position/verbosity bias
- ✅ **Battle history** — every prompt has a win/loss record and average score
- ✅ **Leaderboard** — see your entire prompt library ranked by combat performance
- ✅ **Judge calibration analytics** — monitor whether the AI judge itself is drifting or biased over time

---

## ✨ Key Features

| Feature | Description |
|---|---|
| ⚔️ **Battle Arena** | Submit two prompts, define a task context, and get a full evaluation in ~10 seconds |
| 🏆 **5-Dimension Scoring** | Scored on Clarity, Specificity, Bias Safety, Output Quality, and Hallucination Risk |
| 🔄 **Dual-Run Bias Mitigation** | Every battle runs twice in parallel with prompt order swapped — scores are averaged to eliminate position bias |
| 📊 **Score Radar Chart** | Visual radar/spider chart comparing both prompts across all 5 dimensions |
| ⚖️ **Verbosity Bias Detection** | Tracks whether the judge unfairly favors longer prompts |
| 🗃️ **Fighter Library** | Full CRUD for your prompt collection with battle history per prompt |
| 🏅 **Champion Leaderboard** | Ranked table of all prompts sorted by wins, win rate, and average score |
| 📈 **Calibration Dashboard** | Analytics on judge consistency, position bias trend, and verbosity correlation scatter chart |
| 🎨 **Battle-Themed UI** | Cinematic dark arena design with animated sword cursor, particle effects, energy bars, and full motion UI |

---

## 🏗️ Architecture

PromptBattle uses a **unified full-stack Next.js architecture**, optimized for seamless serverless deployment on Vercel.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                https://prompt-battle-tau.vercel.app              │
└────────────────────────┬────────────────────────────────────────┘
                         │ 
┌────────────────────────▼────────────────────────────────────────┐
│                    NEXT.JS FULL-STACK APP                         │
│  TypeScript · Tailwind CSS · Framer Motion · Recharts            │
│                                                                   │
│  [Frontend] Pages: Arena · Leaderboard · Library · Calibration   │
│  [Backend]  API Routes: /api/battle · /api/prompts               │
│             Judge Engine: /lib/judge.ts (Groq SDK)               │
└────────────────────────┬────────────────────────────────────────┘
                         │
       ┌───────────▼──────┐    ┌──────────▼──────────────┐
       │   GROQ LLM API   │    │  SUPABASE (PostgreSQL)   │
       │  LLaMA 3.3 70B   │    │  Tables: prompts,        │
       │  (The Tribunal)  │    │          battles         │
       └──────────────────┘    └──────────────────────────┘
```

---

## 📁 Project Structure

```text
PromptBattle/
│
├── 📂 app/                         # Next.js App Router
│   ├── page.tsx                    # 🏟️ Arena — main battle submission page
│   ├── layout.tsx                  # Root layout (Navigation, Particles, Cursor)
│   ├── globals.css                 # All CSS variables, animations, arena styles
│   ├── api/                        # ⚙️ Next.js Serverless API Routes
│   │   ├── battle/route.ts         # Battle execution endpoint
│   │   ├── prompts/route.ts        # Prompt CRUD endpoints
│   │   ├── leaderboard/route.ts    # Leaderboard ranking logic
│   │   └── calibration/route.ts    # Judge analytics generation
│   ├── leaderboard/                # Leaderboard pages
│   ├── prompts/                    # Fighter Library pages
│   └── calibration/                # Judge Calibration pages
│
├── 📂 components/                  # Reusable React Components
│   ├── Navigation.tsx              # Top nav bar with sword logo
│   ├── CustomCursor.tsx            # Animated sword cursor
│   ├── Particles.tsx               # Canvas ember/spark particle system
│   ├── VerdictBanner.tsx           # Battle results display
│   ├── LoadingOverlay.tsx          # Battle loading animation
│   └── ... (Charts, Cards, Tables)
│
├── 📂 lib/                         # Core Logic & Utilities
│   ├── judge.ts                    # 🧠 Core evaluation engine + dual-run bias mitigation
│   └── supabase-server.ts          # Supabase client (service role for API routes)
│
├── 📂 assets/                      # Media and preview images
├── .env.local                      # Environment variables
├── vercel.json                     # Vercel deployment config
├── tailwind.config.ts              # Design tokens, colors, animations
└── package.json                    # Node dependencies + scripts
```

---

## 🧠 How the Evaluation Works (The Science)

### Step 1 — Prompt Submission
You provide two prompts (Fighters A and B) and an optional battle context (the shared task).

### Step 2 — Parallel Dual Evaluation (Bias Mitigation)
The judge runs **twice simultaneously**:
- **Run 1:** Prompt A first, then Prompt B
- **Run 2:** Prompt B first, then Prompt A (order swapped)

This eliminates **position bias** — the proven tendency for LLMs to favor whichever prompt appears first.

### Step 3 — 5-Dimension Scoring
Each prompt is scored **0–10** on every dimension in both runs. The four values per dimension are averaged:

| Dimension | What it measures |
|---|---|
| ⚡ **Clarity** | Is the prompt unambiguous? Does it say exactly what it means? |
| 🎯 **Specificity** | Does it constrain the output effectively without being over-rigid? |
| 🛡️ **Bias Safety** | Does the prompt introduce stereotypes or unfair framing? |
| 📈 **Output Quality** | Would a response to this prompt actually be useful and correct? |
| 🧠 **Hallucination Risk** | Does the prompt create conditions for the LLM to make things up? |

**Max total score: 50 points** (5 dimensions × 10 points each)

### Step 4 — Verbosity Bias Tracking
The system logs the token count of each prompt and correlates it with score advantage over time. If longer prompts consistently win by more than their actual quality warrants, the calibration dashboard will show this.

### Step 5 — Verdict & Winner Declaration
The fighter with the higher averaged total score wins. In the event of a score difference < 1 point, a **DRAW** is declared. The judge also produces a natural-language **Tribunal Statement** explaining the decision.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** 18+
- **Supabase** account (free tier works)
- **Groq** API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/promptbattle.git
cd promptbattle
npm install
```

### 2. Configure environment variables
Create `.env.local` in the project root:

```env
# Groq AI Judge
GROQ_API_KEY=gsk_your_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Set up the Supabase database
Run this SQL in your Supabase SQL editor:

```sql
-- Prompts table
CREATE TABLE prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  version text NOT NULL DEFAULT '1.0',
  category text NOT NULL DEFAULT 'general',
  task_context text NOT NULL DEFAULT '',
  content text NOT NULL,
  wins integer NOT NULL DEFAULT 0,
  losses integer NOT NULL DEFAULT 0,
  draws integer NOT NULL DEFAULT 0,
  avg_score numeric NOT NULL DEFAULT 0,
  total_battles integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Battles table
CREATE TABLE battles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_a_id uuid REFERENCES prompts(id),
  prompt_b_id uuid REFERENCES prompts(id),
  winner text,
  total_a numeric,
  total_b numeric,
  verdict text,
  position_bias_delta numeric DEFAULT 0,
  verbosity_bias_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

### 4. Start the server
```bash
npm run dev
```
Navigate to **http://localhost:3000** 🎉

---

## ☁️ Deploying to Vercel

PromptBattle is fully optimized for 1-click deployment on Vercel. 

1. Push your code to GitHub.
2. Go to **Vercel** and import your repository.
3. Under **Environment Variables**, add:
   - `GROQ_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**.

Because the backend uses Next.js API Routes, Vercel automatically deploys the entire application seamlessly.

---

## 🔄 Switching to a Different LLM Judge

By default, PromptBattle uses **Groq's LLaMA 3.3 70B**. You can swap it for any LLM with a compatible Node.js SDK.

Edit `/lib/judge.ts`:

### Option A — OpenAI GPT
```typescript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Replace Groq completion with OpenAI completion
const completion = await openai.chat.completions.create({
  model: 'gpt-4o', // or gpt-4o-mini
  // ... rest of config
});
```

### Option B — Anthropic Claude
```typescript
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Replace completion
const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  // ... rest of config
});
```

---

## 🧩 Tech Stack — Full Breakdown

| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router, API Routes |
| **TypeScript** | Type safety across frontend and API |
| **Tailwind CSS** | Utility-first styling with custom battle design tokens |
| **Framer Motion** | Page transitions, entrance animations, hover effects |
| **Recharts** | Battle Power Curve (AreaChart), Radar Chart, Bias charts |
| **Groq SDK** | Ultra-fast LLM inference client for the judge |
| **Supabase** | PostgreSQL client for database operations (`@supabase/ssr`) |

---

## ❓ Frequently Asked Questions

**Q: Do I need to pay for anything to run this?**
> Both Groq and Supabase have generous free tiers. You can run the entire stack for free.

**Q: How long does a battle take?**
> Approximately 5–15 seconds. Because we ported the logic to Node.js, the dual-run evaluations now execute *in parallel*, making battles incredibly fast.

**Q: Why does the judge sometimes disagree with my intuition?**
> The judge evaluates prompts in isolation — it doesn't run them against a real task and measure actual outputs. It scores the prompt's *structural quality* (clarity, specificity, etc.).

**Q: What is position bias and why does it matter?**
> Studies show that LLMs tend to favor whichever piece of text they read first. PromptBattle runs every battle twice (A vs B, then B vs A) and averages the scores to cancel this bias out.

**Q: What is verbosity bias?**
> The tendency for LLMs to rate longer text as better, regardless of actual quality. The Calibration dashboard tracks whether your judge has this bias.

**Q: Can I use PromptBattle to evaluate prompts for different tasks simultaneously?**
> Yes! Use the **Battle Context** field in the arena to define the shared task.

**Q: What happens if both prompts score within 1 point of each other?**
> The battle ends in a **DRAW**.

---

<div align="center">

**Built with ⚔️ for prompt engineers who refuse to guess.**

*Enter the forge. Only the strongest prompt survives.*

</div>
