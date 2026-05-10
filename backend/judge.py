import os
import json
import time
from pathlib import Path
from typing import Tuple
from groq import Groq
from dotenv import load_dotenv
from models import PromptInput, JudgeRunResult, RawJudgeOutput, DimensionScores, BattleResult

ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env.local")
load_dotenv(ROOT_DIR / ".env")
load_dotenv()

groq_client = None

def get_groq_client() -> Groq:
    global groq_client
    if not groq_client:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY is missing from .env")
        groq_client = Groq(api_key=api_key)
    return groq_client

JUDGE_SYSTEM_PROMPT = """You are an impartial, expert AI judge in the PromptBattle colosseum.
Your sole purpose is to evaluate two prompts designed for a specific task and determine which is superior.

CRITICAL INSTRUCTIONS:
1. You must output ONLY valid JSON. No conversational text, no markdown block wrappers (like ```json).
2. Evaluate BOTH Prompt A and Prompt B across 5 dimensions. Give a score from 0.0 to 10.0.
3. Be brutally objective. Do not penalize shorter prompts if they are highly effective.
4. If they are equally good, you MUST declare a TIE. Do not arbitrarily pick one.
5. Provide a 1-3 sentence ruthless verdict summarizing your decision.

EVALUATION DIMENSIONS:
- clarity (0-10): How unambiguous are the instructions?
- specificity (0-10): How precise is the prompt? Does it prevent edge cases?
- biasRisk (0-10): Higher score = LESS bias risk. Does it avoid forcing the model into unwanted assumptions?
- outputQuality (0-10): How good will the final LLM output likely be?
- hallucinationRisk (0-10): Higher score = LESS hallucination risk. Does it ground the model?

JSON SCHEMA:
{
  "scores_a": { "clarity": 0, "specificity": 0, "biasRisk": 0, "outputQuality": 0, "hallucinationRisk": 0 },
  "scores_b": { "clarity": 0, "specificity": 0, "biasRisk": 0, "outputQuality": 0, "hallucinationRisk": 0 },
  "winner": "A" | "B" | "TIE",
  "reasoning": "Your ruthless verdict here."
}"""

def build_judge_prompt(prompt_a: PromptInput, prompt_b: PromptInput, is_swapped: bool) -> str:
    p1 = prompt_b if is_swapped else prompt_a
    p2 = prompt_a if is_swapped else prompt_b
    
    return f"""TASK CONTEXT:
Both prompts are attempting to solve this task: {prompt_a.task_context}

PROMPT A:
{p1.content}

PROMPT B:
{p2.content}

Evaluate them and output ONLY the JSON object. 
IMPORTANT: Remember that 'scores_a' in your JSON corresponds to PROMPT A above, and 'scores_b' corresponds to PROMPT B above."""

def count_tokens_approx(text: str) -> int:
    # A simple estimation: 1 token ~= 4 chars
    return len(text) // 4

def evaluate_run(prompt_a: PromptInput, prompt_b: PromptInput, is_swapped: bool) -> JudgeRunResult:
    start_time = time.time()
    user_prompt = build_judge_prompt(prompt_a, prompt_b, is_swapped)
    
    client = get_groq_client()
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": JUDGE_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.1,
        max_tokens=1000,
        response_format={"type": "json_object"}
    )
    
    end_time = time.time()
    raw_response = completion.choices[0].message.content or "{}"
    
    try:
        parsed = json.loads(raw_response)
        output = RawJudgeOutput(**parsed)
    except Exception as e:
        raise ValueError(f"Judge failed to return valid JSON: {str(e)}\nRaw: {raw_response}")

    # Map scores back to original A and B
    real_scores_a = output.scores_b if is_swapped else output.scores_a
    real_scores_b = output.scores_a if is_swapped else output.scores_b

    real_winner = output.winner
    if is_swapped and output.winner in ['A', 'B']:
        real_winner = 'A' if output.winner == 'B' else 'B'

    total_a = sum(real_scores_a.model_dump().values())
    total_b = sum(real_scores_b.model_dump().values())

    # Force winner logic based on exact scores to prevent LLM contradictions
    if total_a > total_b:
        real_winner = 'A'
    elif total_b > total_a:
        real_winner = 'B'
    else:
        real_winner = 'TIE'

    return JudgeRunResult(
        scores_a=real_scores_a,
        scores_b=real_scores_b,
        total_a=total_a,
        total_b=total_b,
        winner=real_winner,
        reasoning=output.reasoning,
        raw_response=raw_response,
        model="llama-3.3-70b-versatile",
        response_time_ms=int((end_time - start_time) * 1000),
        token_count_a=count_tokens_approx(prompt_a.content),
        token_count_b=count_tokens_approx(prompt_b.content)
    )

def average_dimension(val1: float, val2: float) -> float:
    return round((val1 + val2) / 2.0, 1)

def calculate_battle_result(prompt_a: PromptInput, prompt_b: PromptInput) -> BattleResult:
    # Run 1: Normal order
    run1 = evaluate_run(prompt_a, prompt_b, is_swapped=False)
    # Run 2: Swapped order (mitigates position bias)
    run2 = evaluate_run(prompt_a, prompt_b, is_swapped=True)

    # Average scores across both runs
    avg_scores_a = DimensionScores(**{
        k: average_dimension(getattr(run1.scores_a, k), getattr(run2.scores_a, k))
        for k in run1.scores_a.model_dump().keys()
    })
    avg_scores_b = DimensionScores(**{
        k: average_dimension(getattr(run1.scores_b, k), getattr(run2.scores_b, k))
        for k in run1.scores_b.model_dump().keys()
    })

    total_a = round(sum(avg_scores_a.model_dump().values()), 1)
    total_b = round(sum(avg_scores_b.model_dump().values()), 1)

    winner = 'TIE'
    if total_a > total_b:
        winner = 'A'
    elif total_b > total_a:
        winner = 'B'

    # Calculate Position Bias Delta
    # How much did the score gap change when positions swapped?
    gap_run1 = run1.total_a - run1.total_b
    gap_run2 = run2.total_a - run2.total_b
    position_bias_delta = abs(gap_run1 - gap_run2)

    # Calculate Verbosity Bias Score
    # Correlation between token count advantage and score advantage
    token_diff = run1.token_count_a - run1.token_count_b
    score_diff = total_a - total_b
    verbosity_bias = 0.0
    if token_diff != 0:
        # Scale down significantly so it's a manageable metric (e.g. -1.0 to 1.0 roughly)
        verbosity_bias = (score_diff / (abs(token_diff) + 1)) * 10

    # Pick the reasoning from the run where the LLM was most confident (largest gap)
    verdict = run1.reasoning if abs(gap_run1) > abs(gap_run2) else run2.reasoning

    return BattleResult(
        run1=run1,
        run2=run2,
        winner=winner,
        verdict=verdict,
        avg_scores_a=avg_scores_a,
        avg_scores_b=avg_scores_b,
        total_a=total_a,
        total_b=total_b,
        position_bias_delta=round(position_bias_delta, 2),
        verbosity_bias_score=round(verbosity_bias, 3)
    )
