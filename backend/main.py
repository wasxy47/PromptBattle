from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import traceback

from models import (
    PromptInput, Prompt, BattleRequest, BattleResult, ApiResponse
)
from db import (
    get_prompts, get_prompt_by_id, create_prompt, save_battle, 
    get_battles_by_prompt_id, get_leaderboard, get_calibration_stats
)
from judge import calculate_battle_result

app = FastAPI(title="PromptBattle API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "The Tribunal is awaiting champions."}

# ── Prompts Routes ───────────────────────────────────────────────────────────

@app.get("/api/prompts", response_model=ApiResponse)
def route_get_prompts(category: Optional[str] = None):
    try:
        prompts = get_prompts(category)
        return ApiResponse(success=True, data=prompts)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))

@app.get("/api/prompts/{prompt_id}", response_model=ApiResponse)
def route_get_prompt_by_id(prompt_id: str):
    try:
        prompt = get_prompt_by_id(prompt_id)
        if not prompt:
            raise HTTPException(status_code=404, detail="Prompt not found")
        return ApiResponse(success=True, data=prompt)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))

@app.post("/api/prompts", response_model=ApiResponse)
def route_create_prompt(prompt: PromptInput = Body(...)):
    try:
        new_prompt = create_prompt(prompt)
        return ApiResponse(success=True, data=new_prompt)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))

@app.get("/api/prompts/{prompt_id}/battles", response_model=ApiResponse)
def route_get_prompt_battles(prompt_id: str):
    try:
        battles = get_battles_by_prompt_id(prompt_id)
        return ApiResponse(success=True, data=battles)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))

# ── Battle Route ─────────────────────────────────────────────────────────────

@app.post("/api/battle", response_model=ApiResponse)
def route_run_battle(req: BattleRequest = Body(...)):
    try:
        # Evaluate using Groq
        result = calculate_battle_result(req.prompt_a, req.prompt_b)

        # Save Prompts if requested and not provided IDs
        a_id = req.prompt_a_id
        b_id = req.prompt_b_id

        if req.save_prompts:
            if not a_id:
                p_a = create_prompt(req.prompt_a)
                a_id = p_a['id']
            if not b_id:
                p_b = create_prompt(req.prompt_b)
                b_id = p_b['id']

        # Save Battle
        if a_id and b_id:
            save_battle(result, a_id, b_id)

        return ApiResponse(success=True, data=result.model_dump())
    except Exception as e:
        traceback.print_exc()
        return ApiResponse(success=False, error=str(e))

# ── Leaderboard Route ────────────────────────────────────────────────────────

@app.get("/api/leaderboard", response_model=ApiResponse)
def route_get_leaderboard(category: Optional[str] = None):
    try:
        lb = get_leaderboard(category)
        return ApiResponse(success=True, data=lb)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))

# ── Calibration Route ────────────────────────────────────────────────────────

@app.get("/api/calibration", response_model=ApiResponse)
def route_get_calibration():
    try:
        stats = get_calibration_stats()
        return ApiResponse(success=True, data=stats)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))
