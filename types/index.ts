// ============================================================
// PromptBattle — Complete Type Definitions
// ============================================================

// --- Core Dimensions ---
export type DimensionKey =
  | 'clarity'
  | 'specificity'
  | 'biasRisk'
  | 'outputQuality'
  | 'hallucinationRisk'

export interface DimensionScores {
  clarity: number           // 0–10
  specificity: number       // 0–10
  biasRisk: number          // 0–10 (lower = riskier)
  outputQuality: number     // 0–10
  hallucinationRisk: number // 0–10 (lower = riskier)
}

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  clarity: 'Clarity',
  specificity: 'Specificity',
  biasRisk: 'Bias Risk',
  outputQuality: 'Output Quality',
  hallucinationRisk: 'Hallucination Risk',
}

export const DIMENSION_DESCRIPTIONS: Record<DimensionKey, string> = {
  clarity: 'How clear and unambiguous the prompt is',
  specificity: 'Level of detail and precision in instructions',
  biasRisk: 'Risk of introducing unwanted bias (higher = safer)',
  outputQuality: 'Expected quality of model output',
  hallucinationRisk: 'Risk of model confabulating (higher = safer)',
}

// --- Prompt Entity ---
export type PromptCategory =
  | 'reasoning'
  | 'creative'
  | 'coding'
  | 'analysis'
  | 'instruction'
  | 'extraction'
  | 'summarization'
  | 'debate'
  | 'general'

export interface Prompt {
  id: string
  name: string
  version: string
  category: PromptCategory
  task_context: string
  content: string
  wins: number
  losses: number
  draws: number
  avg_score: number
  total_battles: number
  created_at: string
  updated_at: string
}

export interface PromptInput {
  name: string
  version: string
  category: PromptCategory
  task_context: string
  content: string
}

// --- Judge Run ---
export interface JudgeRunResult {
  scores_a: DimensionScores
  scores_b: DimensionScores
  total_a: number
  total_b: number
  winner: 'A' | 'B' | 'TIE'
  reasoning: string
  raw_response: string
  model: string
  response_time_ms: number
  token_count_a: number
  token_count_b: number
}

// --- Battle Entity ---
export type BattleWinner = 'A' | 'B' | 'TIE'

export interface Battle {
  id: string
  prompt_a_id: string
  prompt_b_id: string
  prompt_a?: Prompt
  prompt_b?: Prompt
  winner: BattleWinner
  winner_id: string | null
  run1_scores_a: DimensionScores
  run1_scores_b: DimensionScores
  run2_scores_a: DimensionScores
  run2_scores_b: DimensionScores
  avg_scores_a: DimensionScores
  avg_scores_b: DimensionScores
  total_a: number
  total_b: number
  position_bias_delta: number   // Difference between run1 and run2 totals (bias indicator)
  verbosity_bias_score: number  // Correlation between length and score
  verdict: string
  raw_judge_responses: JudgeRunResult[]
  wandb_run_id: string | null
  created_at: string
}

export interface BattleResult {
  battle: Battle
  run1: JudgeRunResult
  run2: JudgeRunResult
  winner: BattleWinner
  verdict: string
  avg_scores_a: DimensionScores
  avg_scores_b: DimensionScores
  total_a: number
  total_b: number
  position_bias_delta: number
  verbosity_bias_score: number
}

// --- Battle Request ---
export interface BattleRequest {
  prompt_a: PromptInput
  prompt_b: PromptInput
  save_prompts?: boolean
}

// --- Leaderboard ---
export interface LeaderboardEntry {
  id: string
  name: string
  version: string
  category: PromptCategory
  wins: number
  losses: number
  draws: number
  total_battles: number
  win_rate: number
  avg_score: number
  rank: number
}

// --- Calibration & Bias ---
export interface CalibrationRecord {
  id: string
  battle_id: string
  run_order: 1 | 2
  model: string
  winner_declared: BattleWinner
  position_bias_score: number
  response_time_ms: number
  raw_response: string
  created_at: string
}

export interface BiasDataPoint {
  date: string
  position_bias_delta: number
  verbosity_bias_score: number
  winner: BattleWinner
}

export interface VerbosityDataPoint {
  token_count_a: number
  token_count_b: number
  score_a: number
  score_b: number
  winner: BattleWinner
}

export interface CalibrationStats {
  total_battles: number
  avg_position_bias: number
  avg_verbosity_bias: number
  position_bias_trend: BiasDataPoint[]
  verbosity_scatter: VerbosityDataPoint[]
  model_consistency_score: number
  tie_rate: number
  a_win_rate: number
  b_win_rate: number
}

// --- Judge Config (for extensibility) ---
export interface JudgeConfig {
  provider: 'groq' | 'anthropic' | 'openai' | 'gemini'
  model: string
  temperature: number
  maxTokens: number
}

export const DEFAULT_JUDGE_CONFIG: JudgeConfig = {
  provider: 'groq',
  model: 'llama-3.3-70b-versatile',
  temperature: 0.1,
  maxTokens: 2048,
}

// --- API Response Shapes ---
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
}

// --- Radar Chart Data ---
export interface RadarDataPoint {
  dimension: string
  A: number
  B: number
  fullMark: number
}

// --- Version History ---
export interface VersionEntry {
  version: string
  created_at: string
  total_battles: number
  wins: number
  losses: number
  avg_score: number
  prompt_id: string
}
