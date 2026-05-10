import { NextRequest, NextResponse } from 'next/server'
import { calculateBattleResult, PromptInput } from '@/lib/judge'
import { getServerSupabase } from '@/lib/supabase-server'

async function upsertPrompt(db: ReturnType<typeof import('@/lib/supabase-server').getServerSupabase>, prompt: PromptInput): Promise<string> {
  const { data, error } = await db
    .from('prompts')
    .insert({
      name:         prompt.name,
      version:      prompt.version ?? '1.0',
      category:     prompt.category ?? 'general',
      task_context: prompt.task_context ?? '',
      content:      prompt.content,
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id as string
}

async function saveBattle(
  db: ReturnType<typeof import('@/lib/supabase-server').getServerSupabase>,
  result: Awaited<ReturnType<typeof calculateBattleResult>>,
  promptAId: string,
  promptBId: string
) {
  const { error: battleError } = await db.from('battles').insert({
    prompt_a_id:          promptAId,
    prompt_b_id:          promptBId,
    winner:               result.winner,
    total_a:              result.total_a,
    total_b:              result.total_b,
    verdict:              result.verdict,
    position_bias_delta:  result.position_bias_delta,
    verbosity_bias_score: result.verbosity_bias_score,
  })
  if (battleError) throw battleError

  // Update win/loss/draw + avg_score for both prompts
  const updates = [
    { id: promptAId, won: result.winner === 'A', lost: result.winner === 'B', score: result.total_a },
    { id: promptBId, won: result.winner === 'B', lost: result.winner === 'A', score: result.total_b },
  ]

  for (const u of updates) {
    const { data: p } = await db.from('prompts').select('wins,losses,draws,avg_score,total_battles').eq('id', u.id).single()
    if (!p) continue
    const newTotal = p.total_battles + 1
    const newAvg   = Math.round(((p.avg_score * p.total_battles + u.score) / newTotal) * 10) / 10
    await db.from('prompts').update({
      wins:          u.won  ? p.wins  + 1 : p.wins,
      losses:        u.lost ? p.losses + 1 : p.losses,
      draws:         (!u.won && !u.lost) ? p.draws + 1 : p.draws,
      avg_score:     newAvg,
      total_battles: newTotal,
      updated_at:    new Date().toISOString(),
    }).eq('id', u.id)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt_a, prompt_b, prompt_a_id, prompt_b_id, save_prompts } = body as {
      prompt_a: PromptInput
      prompt_b: PromptInput
      prompt_a_id?: string
      prompt_b_id?: string
      save_prompts?: boolean
    }

    if (!prompt_a?.content || !prompt_b?.content) {
      return NextResponse.json({ success: false, data: null, error: 'Both prompt_a and prompt_b with content are required' }, { status: 400 })
    }

    // Run the battle (parallel dual evaluation)
    const result = await calculateBattleResult(prompt_a, prompt_b)

    // Save to DB if requested
    const db = getServerSupabase()
    let aId = prompt_a_id
    let bId = prompt_b_id

    if (save_prompts) {
      if (!aId) aId = await upsertPrompt(db, prompt_a)
      if (!bId) bId = await upsertPrompt(db, prompt_b)
    }

    if (aId && bId) {
      await saveBattle(db, result, aId, bId)
    }

    return NextResponse.json({ success: true, data: result, error: null })
  } catch (e: unknown) {
    console.error('[/api/battle]', e)
    return NextResponse.json({ success: false, data: null, error: (e as Error).message }, { status: 500 })
  }
}
