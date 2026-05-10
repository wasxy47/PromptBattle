import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv
from models import (
    PromptInput, Prompt, BattleResult, JudgeRunResult, 
    LeaderboardEntry, CalibrationStats, BiasDataPoint, VerbosityDataPoint
)
from typing import List, Optional

ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env.local")
load_dotenv(ROOT_DIR / ".env")
load_dotenv()

supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    raise RuntimeError("Missing Supabase credentials in .env")

db: Client = create_client(supabase_url, supabase_key)

# ── Prompts ──────────────────────────────────────────────────────────────────

def get_prompts(category: Optional[str] = None) -> List[dict]:
    query = db.table('prompts').select('*').order('wins', desc=True)
    if category and category != 'all':
        query = query.eq('category', category)
    
    res = query.execute()
    return res.data

def get_prompt_by_id(prompt_id: str) -> Optional[dict]:
    res = db.table('prompts').select('*').eq('id', prompt_id).execute()
    return res.data[0] if res.data else None

def create_prompt(input_data: PromptInput) -> dict:
    res = db.table('prompts').insert(input_data.model_dump()).execute()
    return res.data[0]

def update_prompt_stats(prompt_id: str, outcome: str, score: float):
    res = db.table('prompts').select('wins, losses, draws, total_battles, avg_score').eq('id', prompt_id).execute()
    if not res.data:
        return
    current = res.data[0]
    
    total_battles = current['total_battles'] + 1
    new_avg = (current['avg_score'] * current['total_battles'] + score) / total_battles
    
    update_data = {
        'total_battles': total_battles,
        'avg_score': round(new_avg, 2),
        'wins': current['wins'] + 1 if outcome == 'win' else current['wins'],
        'losses': current['losses'] + 1 if outcome == 'loss' else current['losses'],
        'draws': current['draws'] + 1 if outcome == 'draw' else current['draws'],
    }
    
    db.table('prompts').update(update_data).eq('id', prompt_id).execute()

# ── Battles ──────────────────────────────────────────────────────────────────

def save_battle(result: BattleResult, prompt_a_id: str, prompt_b_id: str) -> dict:
    winner_id = None
    if result.winner == 'A':
        winner_id = prompt_a_id
    elif result.winner == 'B':
        winner_id = prompt_b_id

    battle_data = {
        'prompt_a_id': prompt_a_id,
        'prompt_b_id': prompt_b_id,
        'winner': result.winner,
        'winner_id': winner_id,
        'run1_scores_a': result.run1.scores_a.model_dump(),
        'run1_scores_b': result.run1.scores_b.model_dump(),
        'run1_total_a': result.run1.total_a,
        'run1_total_b': result.run1.total_b,
        'run2_scores_a': result.run2.scores_a.model_dump(),
        'run2_scores_b': result.run2.scores_b.model_dump(),
        'run2_total_a': result.run2.total_a,
        'run2_total_b': result.run2.total_b,
        'avg_scores_a': result.avg_scores_a.model_dump(),
        'avg_scores_b': result.avg_scores_b.model_dump(),
        'total_a': result.total_a,
        'total_b': result.total_b,
        'position_bias_delta': result.position_bias_delta,
        'verbosity_bias_score': result.verbosity_bias_score,
        'token_count_a': result.run1.token_count_a,
        'token_count_b': result.run1.token_count_b,
        'verdict': result.verdict,
        'raw_judge_responses': [result.run1.model_dump(), result.run2.model_dump()],
    }

    res = db.table('battles').insert(battle_data).execute()
    battle_record = res.data[0]

    # Save calibration records
    save_calibration_record(battle_record['id'], result.run1, 1)
    save_calibration_record(battle_record['id'], result.run2, 2)

    # Update prompt stats
    update_prompt_stats(
        prompt_a_id,
        'win' if result.winner == 'A' else 'loss' if result.winner == 'B' else 'draw',
        result.total_a
    )
    update_prompt_stats(
        prompt_b_id,
        'win' if result.winner == 'B' else 'loss' if result.winner == 'A' else 'draw',
        result.total_b
    )

    return battle_record

def save_calibration_record(battle_id: str, run: JudgeRunResult, order: int):
    db.table('judge_calibration').insert({
        'battle_id': battle_id,
        'run_order': order,
        'model': run.model,
        'winner_declared': run.winner,
        'total_a': run.total_a,
        'total_b': run.total_b,
        'position_bias_score': run.total_a - run.total_b,
        'response_time_ms': run.response_time_ms,
        'raw_response': run.raw_response,
    }).execute()

def get_battles_by_prompt_id(prompt_id: str) -> List[dict]:
    # Supabase Python SDK has tricky .or_() syntax, using the string representation
    res = db.table('battles') \
        .select('*, prompt_a:prompts!battles_prompt_a_id_fkey(id,name,version,category), prompt_b:prompts!battles_prompt_b_id_fkey(id,name,version,category)') \
        .or_(f"prompt_a_id.eq.{prompt_id},prompt_b_id.eq.{prompt_id}") \
        .order('created_at', desc=True) \
        .limit(50) \
        .execute()
    return res.data

# ── Leaderboard ──────────────────────────────────────────────────────────────

def get_leaderboard(category: Optional[str] = None) -> List[dict]:
    query = db.table('prompts') \
        .select('id,name,version,category,wins,losses,draws,total_battles,avg_score') \
        .gt('total_battles', 0) \
        .order('wins', desc=True) \
        .order('avg_score', desc=True)

    if category and category != 'all':
        query = query.eq('category', category)

    res = query.execute()
    prompts = res.data
    
    leaderboard = []
    for i, p in enumerate(prompts):
        win_rate = round((p['wins'] / p['total_battles']) * 100, 1) if p['total_battles'] > 0 else 0
        leaderboard.append({
            **p,
            'win_rate': win_rate,
            'rank': i + 1
        })
    return leaderboard

# ── Calibration ──────────────────────────────────────────────────────────────

def get_calibration_stats() -> dict:
    res = db.table('battles') \
        .select('id,winner,position_bias_delta,verbosity_bias_score,total_a,total_b,token_count_a,token_count_b,created_at') \
        .order('created_at', desc=False) \
        .execute()
    
    rows = res.data
    if not rows:
        return {
            'total_battles': 0,
            'avg_position_bias': 0,
            'avg_verbosity_bias': 0,
            'position_bias_trend': [],
            'verbosity_scatter': [],
            'model_consistency_score': 100,
            'tie_rate': 0,
            'a_win_rate': 0,
            'b_win_rate': 0,
        }

    total = len(rows)
    tie_count = sum(1 for r in rows if r['winner'] == 'TIE')
    a_win_count = sum(1 for r in rows if r['winner'] == 'A')
    b_win_count = sum(1 for r in rows if r['winner'] == 'B')
    
    avg_pos_bias = sum(abs(float(r['position_bias_delta'])) for r in rows) / total
    avg_verb_bias = sum(abs(float(r['verbosity_bias_score'])) for r in rows) / total

    trend = [{
        'date': r['created_at'].split('T')[0],
        'position_bias_delta': float(r['position_bias_delta']),
        'verbosity_bias_score': float(r['verbosity_bias_score']),
        'winner': r['winner']
    } for r in rows]

    scatter = [{
        'token_count_a': r['token_count_a'],
        'token_count_b': r['token_count_b'],
        'score_a': float(r['total_a']),
        'score_b': float(r['total_b']),
        'winner': r['winner']
    } for r in rows]

    consistency_score = max(0, 100 - round((avg_pos_bias / 50) * 100))

    return {
        'total_battles': total,
        'avg_position_bias': round(avg_pos_bias, 3),
        'avg_verbosity_bias': round(avg_verb_bias, 3),
        'position_bias_trend': trend,
        'verbosity_scatter': scatter,
        'model_consistency_score': consistency_score,
        'tie_rate': round((tie_count / total) * 100, 1),
        'a_win_rate': round((a_win_count / total) * 100, 1),
        'b_win_rate': round((b_win_count / total) * 100, 1),
    }
