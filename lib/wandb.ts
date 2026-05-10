// ============================================================
// PromptBattle — Weights & Biases Integration (REST API)
// Gracefully no-ops when WANDB_API_KEY is absent
// ============================================================

import type { Battle } from '@/types'

interface WandbRunPayload {
  name: string
  config: Record<string, unknown>
  summary: Record<string, unknown>
}

function isWandbEnabled(): boolean {
  return Boolean(
    process.env.WANDB_API_KEY &&
      process.env.WANDB_PROJECT &&
      process.env.WANDB_ENTITY
  )
}

async function createWandbRun(payload: WandbRunPayload): Promise<string | null> {
  if (!isWandbEnabled()) return null

  const entity = process.env.WANDB_ENTITY!
  const project = process.env.WANDB_PROJECT!

  const response = await fetch(`https://api.wandb.ai/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WANDB_API_KEY}`,
    },
    body: JSON.stringify({
      query: `
        mutation CreateRun($entity: String!, $project: String!, $name: String!, $config: JSONString!) {
          createRun(input: {
            entityName: $entity,
            projectName: $project,
            name: $name,
            config: $config
          }) {
            run { id name }
          }
        }
      `,
      variables: {
        entity,
        project,
        name: payload.name,
        config: JSON.stringify(payload.config),
      },
    }),
  })

  if (!response.ok) return null

  const data = (await response.json()) as {
    data?: { createRun?: { run?: { id: string } } }
  }
  return data?.data?.createRun?.run?.id ?? null
}

export async function logBattle(battle: Battle): Promise<string | null> {
  if (!isWandbEnabled()) {
    console.log('[W&B] Skipping — no WANDB_API_KEY configured')
    return null
  }

  try {
    const runId = await createWandbRun({
      name: `battle-${battle.id.slice(0, 8)}`,
      config: {
        prompt_a_id: battle.prompt_a_id,
        prompt_b_id: battle.prompt_b_id,
        judge_model: 'llama-3.3-70b-versatile',
        judge_runs: 2,
      },
      summary: {
        winner: battle.winner,
        total_a: battle.total_a,
        total_b: battle.total_b,
        position_bias_delta: battle.position_bias_delta,
        verbosity_bias_score: battle.verbosity_bias_score,
        clarity_a: battle.avg_scores_a.clarity,
        clarity_b: battle.avg_scores_b.clarity,
        specificity_a: battle.avg_scores_a.specificity,
        specificity_b: battle.avg_scores_b.specificity,
        bias_risk_a: battle.avg_scores_a.biasRisk,
        bias_risk_b: battle.avg_scores_b.biasRisk,
        output_quality_a: battle.avg_scores_a.outputQuality,
        output_quality_b: battle.avg_scores_b.outputQuality,
        hallucination_risk_a: battle.avg_scores_a.hallucinationRisk,
        hallucination_risk_b: battle.avg_scores_b.hallucinationRisk,
      },
    })

    console.log(`[W&B] Logged battle ${battle.id} → run ${runId}`)
    return runId
  } catch (err) {
    console.error('[W&B] Failed to log battle:', err)
    return null
  }
}
