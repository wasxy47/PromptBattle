import Groq from 'groq-sdk'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PromptInput {
  name: string
  version: string
  category: string
  task_context: string
  content: string
}

export interface DimensionScores {
  clarity: number
  specificity: number
  biasRisk: number
  outputQuality: number
  hallucinationRisk: number
}

export interface JudgeRunResult {
  scores_a: DimensionScores
  scores_b: DimensionScores
  total_a: number
  total_b: number
  winner: 'A' | 'B' | 'TIE'
  reasoning: string
  model: string
  response_time_ms: number
  token_count_a: number
  token_count_b: number
}

export interface BattleResult {
  run1: JudgeRunResult
  run2: JudgeRunResult
  winner: 'A' | 'B' | 'TIE'
  verdict: string
  avg_scores_a: DimensionScores
  avg_scores_b: DimensionScores
  total_a: number
  total_b: number
  position_bias_delta: number
  verbosity_bias_score: number
}

// ── Judge Prompt ───────────────────────────────────────────────────────────────

const JUDGE_SYSTEM_PROMPT = `You are an impartial, expert AI judge in the PromptBattle colosseum.
Your sole purpose is to evaluate two prompts designed for a specific task and determine which is superior.

CRITICAL INSTRUCTIONS:
1. You must output ONLY valid JSON. No conversational text, no markdown block wrappers.
2. Evaluate BOTH Prompt A and Prompt B across 5 dimensions. Give a score from 0.0 to 10.0.
3. Be brutally objective. Do not penalize shorter prompts if they are highly effective.
4. If they are equally good, you MUST declare a TIE. Do not arbitrarily pick one.
5. Provide a 1-3 sentence ruthless verdict summarizing your decision.

EVALUATION DIMENSIONS:
- clarity (0-10): How unambiguous are the instructions?
- specificity (0-10): How precise is the prompt? Does it prevent edge cases?
- biasRisk (0-10): Higher score = LESS bias risk.
- outputQuality (0-10): How good will the final LLM output likely be?
- hallucinationRisk (0-10): Higher score = LESS hallucination risk.

JSON SCHEMA (output EXACTLY this structure):
{
  "scores_a": { "clarity": 0, "specificity": 0, "biasRisk": 0, "outputQuality": 0, "hallucinationRisk": 0 },
  "scores_b": { "clarity": 0, "specificity": 0, "biasRisk": 0, "outputQuality": 0, "hallucinationRisk": 0 },
  "winner": "A",
  "reasoning": "Your ruthless verdict here."
}`

function buildJudgePrompt(promptA: PromptInput, promptB: PromptInput, isSwapped: boolean): string {
  const p1 = isSwapped ? promptB : promptA
  const p2 = isSwapped ? promptA : promptB
  return `TASK CONTEXT:
Both prompts are attempting to solve this task: ${promptA.task_context}

PROMPT A:
${p1.content}

PROMPT B:
${p2.content}

Evaluate them and output ONLY the JSON object.
IMPORTANT: 'scores_a' corresponds to PROMPT A above, 'scores_b' corresponds to PROMPT B above.`
}

function countTokensApprox(text: string): number {
  return Math.floor(text.length / 4)
}

function sumScores(s: DimensionScores): number {
  return s.clarity + s.specificity + s.biasRisk + s.outputQuality + s.hallucinationRisk
}

function avgDimension(a: number, b: number): number {
  return Math.round(((a + b) / 2) * 10) / 10
}

// ── Core Evaluation ────────────────────────────────────────────────────────────

async function evaluateRun(
  promptA: PromptInput,
  promptB: PromptInput,
  isSwapped: boolean
): Promise<JudgeRunResult> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const userPrompt = buildJudgePrompt(promptA, promptB, isSwapped)
  const start = Date.now()

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: JUDGE_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.1,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  })

  const elapsed = Date.now() - start
  const raw = completion.choices[0].message.content ?? '{}'

  let parsed: {
    scores_a: DimensionScores
    scores_b: DimensionScores
    winner: 'A' | 'B' | 'TIE'
    reasoning: string
  }

  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(`Judge returned invalid JSON: ${raw}`)
  }

  // Un-swap scores back to original A/B
  const realScoresA: DimensionScores = isSwapped ? parsed.scores_b : parsed.scores_a
  const realScoresB: DimensionScores = isSwapped ? parsed.scores_a : parsed.scores_b

  const totalA = sumScores(realScoresA)
  const totalB = sumScores(realScoresB)

  // Force winner based on actual totals (prevents LLM contradictions)
  let winner: 'A' | 'B' | 'TIE' = 'TIE'
  if (totalA > totalB) winner = 'A'
  else if (totalB > totalA) winner = 'B'

  return {
    scores_a: realScoresA,
    scores_b: realScoresB,
    total_a: totalA,
    total_b: totalB,
    winner,
    reasoning: parsed.reasoning ?? '',
    model: 'llama-3.3-70b-versatile',
    response_time_ms: elapsed,
    token_count_a: countTokensApprox(promptA.content),
    token_count_b: countTokensApprox(promptB.content),
  }
}

// ── Main Export ────────────────────────────────────────────────────────────────

export async function calculateBattleResult(
  promptA: PromptInput,
  promptB: PromptInput
): Promise<BattleResult> {
  // Run both evaluations in parallel for speed
  const [run1, run2] = await Promise.all([
    evaluateRun(promptA, promptB, false),
    evaluateRun(promptA, promptB, true),
  ])

  const avgScoresA: DimensionScores = {
    clarity: avgDimension(run1.scores_a.clarity, run2.scores_a.clarity),
    specificity: avgDimension(run1.scores_a.specificity, run2.scores_a.specificity),
    biasRisk: avgDimension(run1.scores_a.biasRisk, run2.scores_a.biasRisk),
    outputQuality: avgDimension(run1.scores_a.outputQuality, run2.scores_a.outputQuality),
    hallucinationRisk: avgDimension(run1.scores_a.hallucinationRisk, run2.scores_a.hallucinationRisk),
  }

  const avgScoresB: DimensionScores = {
    clarity: avgDimension(run1.scores_b.clarity, run2.scores_b.clarity),
    specificity: avgDimension(run1.scores_b.specificity, run2.scores_b.specificity),
    biasRisk: avgDimension(run1.scores_b.biasRisk, run2.scores_b.biasRisk),
    outputQuality: avgDimension(run1.scores_b.outputQuality, run2.scores_b.outputQuality),
    hallucinationRisk: avgDimension(run1.scores_b.hallucinationRisk, run2.scores_b.hallucinationRisk),
  }

  const totalA = Math.round(sumScores(avgScoresA) * 10) / 10
  const totalB = Math.round(sumScores(avgScoresB) * 10) / 10

  let winner: 'A' | 'B' | 'TIE' = 'TIE'
  if (totalA > totalB) winner = 'A'
  else if (totalB > totalA) winner = 'B'

  // Position bias = how much the gap changed when order flipped
  const gapRun1 = run1.total_a - run1.total_b
  const gapRun2 = run2.total_a - run2.total_b
  const positionBiasDelta = Math.round(Math.abs(gapRun1 - gapRun2) * 100) / 100

  // Verbosity bias = score advantage correlated with token count advantage
  const tokenDiff = run1.token_count_a - run1.token_count_b
  const scoreDiff = totalA - totalB
  const verbosityBias =
    tokenDiff !== 0 ? Math.round(((scoreDiff / (Math.abs(tokenDiff) + 1)) * 10) * 1000) / 1000 : 0

  // Pick verdict from the run with the larger score gap (more confident)
  const verdict = Math.abs(gapRun1) >= Math.abs(gapRun2) ? run1.reasoning : run2.reasoning

  return {
    run1,
    run2,
    winner,
    verdict,
    avg_scores_a: avgScoresA,
    avg_scores_b: avgScoresB,
    total_a: totalA,
    total_b: totalB,
    position_bias_delta: positionBiasDelta,
    verbosity_bias_score: verbosityBias,
  }
}
