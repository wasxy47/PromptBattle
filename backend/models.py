from pydantic import BaseModel, Field
from typing import Optional, Literal, List, Dict
from datetime import datetime

# --- Enums ---
PromptCategory = Literal[
    'reasoning', 'creative', 'coding', 'analysis', 'instruction',
    'extraction', 'summarization', 'debate', 'general'
]

BattleWinner = Literal['A', 'B', 'TIE']

# --- Dimension Scores ---
class DimensionScores(BaseModel):
    clarity: int | float = Field(ge=0, le=10)
    specificity: int | float = Field(ge=0, le=10)
    biasRisk: int | float = Field(ge=0, le=10)
    outputQuality: int | float = Field(ge=0, le=10)
    hallucinationRisk: int | float = Field(ge=0, le=10)

# --- Prompts ---
class PromptInput(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    version: str = Field(default="1.0", max_length=20)
    category: PromptCategory = Field(default="general")
    task_context: str = Field(min_length=10, max_length=500)
    content: str = Field(min_length=20, max_length=5000)

class Prompt(PromptInput):
    id: str
    wins: int
    losses: int
    draws: int
    avg_score: float
    total_battles: int
    created_at: str
    updated_at: str

# --- Judge Runs ---
class JudgeRunResult(BaseModel):
    scores_a: DimensionScores
    scores_b: DimensionScores
    total_a: float
    total_b: float
    winner: BattleWinner
    reasoning: str
    raw_response: str
    model: str
    response_time_ms: int
    token_count_a: int
    token_count_b: int

class RawJudgeOutput(BaseModel):
    scores_a: DimensionScores
    scores_b: DimensionScores
    winner: BattleWinner
    reasoning: str

# --- Battle ---
class BattleResult(BaseModel):
    run1: JudgeRunResult
    run2: JudgeRunResult
    winner: BattleWinner
    verdict: str
    avg_scores_a: DimensionScores
    avg_scores_b: DimensionScores
    total_a: float
    total_b: float
    position_bias_delta: float
    verbosity_bias_score: float

class BattleRequest(BaseModel):
    prompt_a: PromptInput
    prompt_b: PromptInput
    save_prompts: bool = True
    prompt_a_id: Optional[str] = None
    prompt_b_id: Optional[str] = None

# --- Leaderboard ---
class LeaderboardEntry(BaseModel):
    id: str
    name: str
    version: str
    category: PromptCategory
    wins: int
    losses: int
    draws: int
    total_battles: int
    win_rate: float
    avg_score: float
    rank: int

# --- Calibration ---
class BiasDataPoint(BaseModel):
    date: str
    position_bias_delta: float
    verbosity_bias_score: float
    winner: BattleWinner

class VerbosityDataPoint(BaseModel):
    token_count_a: int
    token_count_b: int
    score_a: float
    score_b: float
    winner: BattleWinner

class CalibrationStats(BaseModel):
    total_battles: int
    avg_position_bias: float
    avg_verbosity_bias: float
    position_bias_trend: List[BiasDataPoint]
    verbosity_scatter: List[VerbosityDataPoint]
    model_consistency_score: int
    tie_rate: float
    a_win_rate: float
    b_win_rate: float

# --- API Response Base ---
class ApiResponse(BaseModel):
    data: Optional[Dict | List | BaseModel] = None
    error: Optional[str] = None
    success: bool
