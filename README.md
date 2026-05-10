<div align="center">

![PromptBattle Preview](./assets/Screenshot%202026-05-10%20093006.png)

<br/>

# ⚔️ PROMPTBATTLE

### AI Prompt Evaluation Arena

**Pit two prompts against each other. Let the AI Tribunal declare the victor.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Judge-Groq_LLaMA_3.3_70B-F55036?style=for-the-badge)](https://groq.com/)
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
| ⚔️ **Battle Arena** | Submit two prompts, define a task context, and get a full evaluation in ~30 seconds |
| 🏆 **5-Dimension Scoring** | Scored on Clarity, Specificity, Bias Safety, Output Quality, and Hallucination Risk |
| 🔄 **Dual-Run Bias Mitigation** | Every battle runs twice with prompt order swapped — scores are averaged to eliminate position bias |
| 📊 **Score Radar Chart** | Visual radar/spider chart comparing both prompts across all 5 dimensions |
| ⚖️ **Verbosity Bias Detection** | Tracks whether the judge unfairly favors longer prompts |
| 🗃️ **Fighter Library** | Full CRUD for your prompt collection with battle history per prompt |
| 🏅 **Champion Leaderboard** | Ranked table of all prompts sorted by wins, win rate, and average score |
| 📈 **Calibration Dashboard** | Analytics on judge consistency, position bias trend, and verbosity correlation scatter chart |
| 🎨 **Battle-Themed UI** | Cinematic dark arena design with animated sword cursor, particle effects, energy bars, and full motion UI |

---

## 🏗️ Architecture

PromptBattle uses a **decoupled full-stack architecture** — a Next.js frontend that proxies all API calls to a Python/FastAPI backend, backed by Supabase (PostgreSQL) for persistent storage.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                    http://localhost:3000                          │
└────────────────────────┬────────────────────────────────────────┘
                         │ Next.js rewrites /api/* → :8000
┌────────────────────────▼────────────────────────────────────────┐
│                    NEXT.JS FRONTEND (Port 3000)                   │
│  TypeScript · Tailwind CSS · Framer Motion · Recharts            │
│                                                                   │
│  Pages: Arena · Leaderboard · Fighter Library · Calibration       │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP Proxy (next.config.js rewrites)
┌────────────────────────▼────────────────────────────────────────┐
│                  FASTAPI BACKEND (Port 8000)                      │
│  Python · FastAPI · Pydantic · Uvicorn                           │
│                                                                   │
│  Routes: /api/battle · /api/prompts · /api/leaderboard           │
│          /api/calibration · /api/health                           │
└──────────────────┬──────────────────────┬───────────────────────┘
                   │                      │
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
├── 📂 backend/                     # Python FastAPI Backend
│   ├── main.py                     # All API route handlers
│   ├── judge.py                    # Core evaluation engine + bias mitigation
│   ├── models.py                   # Pydantic schemas (BattleRequest, BattleResult, etc.)
│   ├── db.py                       # All Supabase DB interactions
│   ├── requirements.txt            # Python dependencies
│   └── venv/                       # Python virtual environment
│
├── 📂 app/                         # Next.js App Router (Frontend)
│   ├── page.tsx                    # 🏟️ Arena — main battle submission page
│   ├── layout.tsx                  # Root layout (Navigation, Particles, Cursor)
│   ├── globals.css                 # All CSS variables, animations, arena styles
│   ├── icon.svg                    # Custom sword favicon
│   ├── leaderboard/
│   │   ├── page.tsx                # Leaderboard page (server component)
│   │   └── LeaderboardClient.tsx   # Leaderboard UI with filters
│   ├── prompts/
│   │   ├── page.tsx                # Fighter Library page
│   │   ├── PromptsClient.tsx       # Prompt grid + add modal
│   │   └── [id]/
│   │       └── PromptProfileClient.tsx  # Single prompt profile + battle history
│   └── calibration/
│       ├── page.tsx                # Judge Calibration page
│       └── CalibrationClient.tsx   # Bias analytics dashboard
│
├── 📂 components/                  # Reusable React Components
│   ├── Navigation.tsx              # Top nav bar with sword logo
│   ├── CustomCursor.tsx            # Animated sword cursor
│   ├── Particles.tsx               # Canvas ember/spark particle system
│   ├── VerdictBanner.tsx           # Battle results display
│   ├── LoadingOverlay.tsx          # Battle loading animation
│   ├── ScoreRadarChart.tsx         # Spider/radar chart (Recharts)
│   ├── FlowGraph.tsx               # Battle power curve chart + architecture flow
│   ├── BiasCharts.tsx              # Position bias line chart + verbosity scatter
│   ├── LeaderboardTable.tsx        # Sortable leaderboard table
│   ├── PromptCard.tsx              # Prompt card in the library grid
│   └── VersionTimeline.tsx         # Battle history timeline per prompt
│
├── 📂 scripts/
│   └── seed.ts                     # Seed script — populates 10 sample prompts
│
├── 📂 docs/
│   └── preview.webp                # Frontend preview screenshot
│
├── .env.local                      # Environment variables (never commit this!)
├── next.config.js                  # API proxy config (rewrites /api/* → :8000)
├── tailwind.config.ts              # Design tokens, colors, animations
└── package.json                    # Node dependencies + scripts
```

---

## 🧠 How the Evaluation Works (The Science)

### Step 1 — Prompt Submission
You provide two prompts (Fighters A and B) and an optional battle context (the shared task).

### Step 2 — Dual Evaluation (Bias Mitigation)
The judge runs **twice**:
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

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Python** 3.10+
- **Supabase** account (free tier works)
- **Groq** API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/promptbattle.git
cd promptbattle
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Set up the Python backend
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Configure environment variables
Create `.env.local` in the project root:

```env
# Groq AI Judge
GROQ_API_KEY=gsk_your_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Copy the same `.env.local` contents to `backend/.env`.

### 5. Set up the Supabase database
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

### 6. Seed sample prompts
```bash
npm run seed
```
This inserts 10 professional battle-ready prompts into your database.

### 7. Start both servers

**Terminal 1 — Backend:**
```bash
cd backend
.\venv\Scripts\activate     # Windows
source venv/bin/activate    # macOS/Linux
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

### 8. Open the arena
Navigate to **http://localhost:3000** 🎉

---

## 🔄 Switching to a Different LLM Judge

By default, PromptBattle uses **Groq's LLaMA 3.3 70B** as the judge. You can swap it for any LLM with a compatible API.

### Option A — Different Groq Model
Edit `backend/judge.py`:
```python
# Current default
model = "llama-3.3-70b-versatile"

# Other Groq options (faster/cheaper)
model = "llama-3.1-8b-instant"       # Much faster, less accurate
model = "mixtral-8x7b-32768"         # Good balance
model = "gemma2-9b-it"               # Google Gemma via Groq
```

### Option B — OpenAI GPT
1. Install the OpenAI SDK: `pip install openai`
2. In `backend/judge.py`, replace the Groq client:

```python
# Remove this:
from groq import Groq
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Add this:
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

3. Change the model name:
```python
model = "gpt-4o"        # Most capable
model = "gpt-4o-mini"   # Faster, cheaper
model = "gpt-3.5-turbo" # Budget option
```

4. Update your `.env`:
```env
OPENAI_API_KEY=sk-your-key-here
```

### Option C — Anthropic Claude
1. Install: `pip install anthropic`
2. In `backend/judge.py`:

```python
import anthropic
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# In the evaluate() function, replace the completion call:
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=2000,
    messages=[{"role": "user", "content": prompt}]
)
result_text = response.content[0].text
```

### Option D — Local Model (Ollama)
Run models locally with zero API cost:
1. Install [Ollama](https://ollama.com) and pull a model: `ollama pull llama3.1`
2. In `backend/judge.py`:

```python
from openai import OpenAI  # Ollama is OpenAI-compatible
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

model = "llama3.1"   # or qwen2.5, mistral, gemma2, etc.
```

> ⚠️ **Note:** Smaller local models (< 13B parameters) may not follow the JSON scoring format reliably. Use at least a 70B model or a well-instruction-tuned smaller model for consistent results.

---

## 🌐 API Reference

The backend exposes a RESTful API at `http://localhost:8000`. The frontend proxies all `/api/*` requests through Next.js.

### `GET /api/health`
Check if the backend is alive.
```json
{ "status": "ok", "message": "The Tribunal is awaiting champions." }
```

### `GET /api/prompts`
Get all prompts. Optional: `?category=coding`
```json
{ "success": true, "data": [ { "id": "...", "name": "The Interrogator", ... } ] }
```

### `POST /api/prompts`
Create a new prompt.
```json
{
  "name": "My Prompt",
  "version": "1.0",
  "category": "reasoning",
  "task_context": "Analyze documents",
  "content": "You are an expert analyst..."
}
```

### `POST /api/battle`
Run a battle between two prompts.
```json
{
  "prompt_a": { "name": "Fighter A", "content": "...", "category": "reasoning", "task_context": "...", "version": "1.0" },
  "prompt_b": { "name": "Fighter B", "content": "...", "category": "reasoning", "task_context": "...", "version": "1.0" },
  "save_prompts": true
}
```

**Response includes:** winner, scores per dimension for both prompts, position bias delta, verbosity bias score, and the written verdict.

### `GET /api/leaderboard`
Get prompts ranked by performance. Optional: `?category=coding`

### `GET /api/calibration`
Get judge calibration analytics — consistency score, bias trends, outcome distribution.

---

## 🧩 Tech Stack — Full Breakdown

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14 | React framework with App Router, server components, API proxy |
| **TypeScript** | 5 | Type safety across all components and API calls |
| **Tailwind CSS** | 3 | Utility-first styling with custom battle design tokens |
| **Framer Motion** | 11 | Page transitions, entrance animations, hover effects |
| **Recharts** | 2 | Battle Power Curve (AreaChart), Radar Chart, Bias charts |
| **Lucide React** | — | Icon library |
| **Orbitron / Cinzel** | — | Google Fonts — futuristic & battle typography |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.10+ | Backend runtime |
| **FastAPI** | 0.110 | High-performance async API framework |
| **Pydantic** | 2 | Request/response validation and serialization |
| **Uvicorn** | — | ASGI server for running FastAPI |
| **Groq SDK** | — | LLM API client for the judge |
| **Supabase Python** | — | PostgreSQL client for database operations |
| **python-dotenv** | — | Environment variable loading |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Supabase** | Managed PostgreSQL database with instant REST API |
| **Groq** | Ultra-fast LLM inference (free tier available) |
| **Vercel** (optional) | Frontend deployment |
| **Railway / Render** (optional) | Backend deployment |

---

## 📊 Prompt Categories

PromptBattle supports 9 battle classes for your prompts:

| Category | Best For |
|---|---|
| `reasoning` | Logic puzzles, analysis, fact-checking prompts |
| `creative` | Storytelling, copywriting, ideation prompts |
| `coding` | Code generation, debugging, refactoring prompts |
| `analysis` | Data interpretation, critique, evaluation prompts |
| `instruction` | Step-by-step guides, how-tos, teaching prompts |
| `extraction` | Data parsing, entity extraction, summarization prompts |
| `summarization` | Document condensation, TL;DR prompts |
| `debate` | Argumentation, devil's advocate, steelman prompts |
| `general` | Everything else |

---

## ❓ Frequently Asked Questions

**Q: Do I need to pay for anything to run this?**
> Both Groq and Supabase have generous free tiers. Groq's free tier allows thousands of requests/day. Supabase's free tier includes a full PostgreSQL database. You can run the entire stack for free.

**Q: How long does a battle take?**
> Approximately 20–45 seconds. Each battle makes 2 LLM API calls (one per evaluation run). Groq is extremely fast — most of the time is the LLM thinking.

**Q: Can I run multiple battles at once?**
> Yes. FastAPI handles concurrent requests natively with async support.

**Q: Why does the judge sometimes disagree with my intuition?**
> The judge evaluates prompts in isolation — it doesn't run them against a real task and measure actual outputs. It scores the prompt's *structural quality* (clarity, specificity, etc.). A prompt that *feels* powerful might have hidden ambiguity the judge penalizes.

**Q: What is position bias and why does it matter?**
> Studies show that LLMs tend to favor whichever piece of text they read first. If a judge always saw Prompt A first, it would win more often just due to ordering. PromptBattle runs every battle twice (A vs B, then B vs A) and averages the scores to cancel this bias out.

**Q: What is verbosity bias?**
> The tendency for LLMs to rate longer text as better, regardless of actual quality. PromptBattle tracks whether your judge has this bias using the Calibration dashboard's scatter chart — if you see a strong positive correlation between token count difference and score difference, your judge has verbosity bias.

**Q: Can I use PromptBattle to evaluate prompts for different tasks simultaneously?**
> Yes! Use the **Battle Context** field in the arena to define the shared task. Both prompts are evaluated against the same context, making the comparison fair.

**Q: What happens if both prompts score within 1 point of each other?**
> The battle ends in a **DRAW**. The win/loss records are not updated, but the battle is still logged for calibration analytics.

**Q: Can I track how a prompt improves across versions?**
> Yes. Create multiple prompts with the same name but different versions (e.g., `v1.0`, `v2.0`). Each will have its own battle record. The Fighter Library shows all your prompts and you can compare their stats.

**Q: Is there a way to batch-test prompts automatically?**
> Currently battles are initiated manually through the UI or the `/api/battle` endpoint. You can write a script that POSTs to `/api/battle` in a loop to automate batch testing.

**Q: How do I deploy this to production?**
> - **Frontend**: Deploy to [Vercel](https://vercel.com) — just connect your GitHub repo. Add all env vars in the Vercel dashboard. Change the proxy destination in `next.config.js` to your backend URL.
> - **Backend**: Deploy to [Railway](https://railway.app) or [Render](https://render.com). Add a `Procfile` with `web: uvicorn main:app --host 0.0.0.0 --port $PORT`.

**Q: The leaderboard shows "No Champions Yet" — why?**
> The leaderboard only shows prompts that have fought at least one battle. Run a battle first, and your prompts will appear on the leaderboard.

**Q: Can I delete prompts?**
> The UI currently supports create and read. To delete, use the Supabase dashboard directly or add a `DELETE /api/prompts/{id}` endpoint to `backend/main.py`.

**Q: The backend gives a 500 error — what's wrong?**
> Check `backend/.env` has all 3 required keys: `GROQ_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. Also ensure the database tables exist (run the SQL from the setup section).

---

## 🛠️ Available Scripts

```bash
# Start the frontend (development)
npm run dev

# Start the backend
cd backend && uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# Seed the database with 10 sample prompts
npm run seed

# Type-check the frontend
npm run type-check

# Lint the frontend
npm run lint

# Build for production
npm run build
```

---

## 🗺️ Roadmap

- [ ] **Bracket Tournaments** — run round-robin tournaments across your entire prompt library
- [ ] **Prompt Versioning UI** — compare v1 vs v2 of the same prompt with a diff view
- [ ] **Export Results** — download battle history as CSV or PDF
- [ ] **Team Mode** — multiple users submitting prompts to compete
- [ ] **Custom Scoring Rubrics** — define your own evaluation dimensions
- [ ] **WandB Integration** — log all battles to Weights & Biases for experiment tracking
- [ ] **Webhook Support** — trigger external actions when a prompt wins/loses

---

## 📄 License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ⚔️ for prompt engineers who refuse to guess.**

*Enter the forge. Only the strongest prompt survives.*

</div>
