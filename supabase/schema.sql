-- ============================================================
-- PromptBattle — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROMPTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS prompts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  version       TEXT NOT NULL DEFAULT '1.0',
  category      TEXT NOT NULL DEFAULT 'general',
  task_context  TEXT NOT NULL,
  content       TEXT NOT NULL,
  wins          INTEGER NOT NULL DEFAULT 0,
  losses        INTEGER NOT NULL DEFAULT 0,
  draws         INTEGER NOT NULL DEFAULT 0,
  avg_score     NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_battles INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT prompts_category_check CHECK (
    category IN ('reasoning','creative','coding','analysis','instruction','extraction','summarization','debate','general')
  )
);

-- ============================================================
-- BATTLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS battles (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_a_id           UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  prompt_b_id           UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  winner                TEXT NOT NULL CHECK (winner IN ('A','B','TIE')),
  winner_id             UUID REFERENCES prompts(id) ON DELETE SET NULL,

  -- Run 1 scores (A evaluated first)
  run1_scores_a         JSONB NOT NULL DEFAULT '{}',
  run1_scores_b         JSONB NOT NULL DEFAULT '{}',
  run1_total_a          NUMERIC(5,2) NOT NULL DEFAULT 0,
  run1_total_b          NUMERIC(5,2) NOT NULL DEFAULT 0,

  -- Run 2 scores (B evaluated first — swapped)
  run2_scores_a         JSONB NOT NULL DEFAULT '{}',
  run2_scores_b         JSONB NOT NULL DEFAULT '{}',
  run2_total_a          NUMERIC(5,2) NOT NULL DEFAULT 0,
  run2_total_b          NUMERIC(5,2) NOT NULL DEFAULT 0,

  -- Averaged final scores
  avg_scores_a          JSONB NOT NULL DEFAULT '{}',
  avg_scores_b          JSONB NOT NULL DEFAULT '{}',
  total_a               NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_b               NUMERIC(5,2) NOT NULL DEFAULT 0,

  -- Bias metrics
  position_bias_delta   NUMERIC(6,3) NOT NULL DEFAULT 0,
  verbosity_bias_score  NUMERIC(6,3) NOT NULL DEFAULT 0,
  token_count_a         INTEGER NOT NULL DEFAULT 0,
  token_count_b         INTEGER NOT NULL DEFAULT 0,

  -- Judge output
  verdict               TEXT NOT NULL DEFAULT '',
  raw_judge_responses   JSONB NOT NULL DEFAULT '[]',

  -- W&B tracking
  wandb_run_id          TEXT,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- JUDGE CALIBRATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS judge_calibration (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  battle_id           UUID NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  run_order           INTEGER NOT NULL CHECK (run_order IN (1, 2)),
  model               TEXT NOT NULL,
  winner_declared     TEXT NOT NULL CHECK (winner_declared IN ('A','B','TIE')),
  total_a             NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_b             NUMERIC(5,2) NOT NULL DEFAULT 0,
  position_bias_score NUMERIC(6,3) NOT NULL DEFAULT 0,
  response_time_ms    INTEGER NOT NULL DEFAULT 0,
  raw_response        TEXT NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_battles_prompt_a ON battles(prompt_a_id);
CREATE INDEX IF NOT EXISTS idx_battles_prompt_b ON battles(prompt_b_id);
CREATE INDEX IF NOT EXISTS idx_battles_winner   ON battles(winner);
CREATE INDEX IF NOT EXISTS idx_battles_created  ON battles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calibration_battle ON judge_calibration(battle_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_wins     ON prompts(wins DESC);

-- ============================================================
-- LEADERBOARD VIEW
-- ============================================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id,
  p.name,
  p.version,
  p.category,
  p.wins,
  p.losses,
  p.draws,
  p.total_battles,
  p.avg_score,
  CASE
    WHEN p.total_battles = 0 THEN 0
    ELSE ROUND((p.wins::NUMERIC / p.total_battles) * 100, 1)
  END AS win_rate,
  RANK() OVER (ORDER BY p.wins DESC, p.avg_score DESC) AS rank,
  p.created_at
FROM prompts p
WHERE p.total_battles > 0
ORDER BY rank;

-- ============================================================
-- CALIBRATION STATS VIEW
-- ============================================================
CREATE OR REPLACE VIEW calibration_stats AS
SELECT
  COUNT(*)                                        AS total_battles,
  ROUND(AVG(ABS(position_bias_delta)), 3)        AS avg_position_bias,
  ROUND(AVG(ABS(verbosity_bias_score)), 3)       AS avg_verbosity_bias,
  ROUND(
    COUNT(*) FILTER (WHERE winner = 'TIE')::NUMERIC / NULLIF(COUNT(*),0) * 100, 1
  )                                               AS tie_rate,
  ROUND(
    COUNT(*) FILTER (WHERE winner = 'A')::NUMERIC / NULLIF(COUNT(*),0) * 100, 1
  )                                               AS a_win_rate,
  ROUND(
    COUNT(*) FILTER (WHERE winner = 'B')::NUMERIC / NULLIF(COUNT(*),0) * 100, 1
  )                                               AS b_win_rate
FROM battles;

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
