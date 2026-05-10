import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase-server'

export async function GET(_req: NextRequest) {
  try {
    const db = getServerSupabase()

    // 1. Basic Battle Stats
    const { data: battles, error: bError } = await db
      .from('battles')
      .select('winner, position_bias_delta, verbosity_bias_score, created_at')
      .order('created_at', { ascending: true })

    if (bError) throw bError

    const total = battles.length
    let aWins = 0, bWins = 0, ties = 0
    let pbSum = 0, vbSum = 0

    const posBiasTrend = []
    const verbosityScatter: any[] = []

    // 2. Need full battle data with token counts for verbosity scatter (from another query)
    const { data: fullBattles, error: fbError } = await db
      .from('battles')
      .select(`
        id, winner, total_a, total_b, created_at,
        prompt_a:prompts!battles_prompt_a_id_fkey(content),
        prompt_b:prompts!battles_prompt_b_id_fkey(content)
      `)

    if (!fbError && fullBattles) {
      for (const b of fullBattles) {
        if (!b.prompt_a || !b.prompt_b) continue
        const pA: any = b.prompt_a
        const pB: any = b.prompt_b
        const cA = Array.isArray(pA) ? pA[0].content : pA.content
        const cB = Array.isArray(pB) ? pB[0].content : pB.content
        verbosityScatter.push({
          score_a: b.total_a,
          score_b: b.total_b,
          token_count_a: Math.floor(cA.length / 4),
          token_count_b: Math.floor(cB.length / 4),
          winner: b.winner
        })
      }
    }

    for (let i = 0; i < battles.length; i++) {
      const b = battles[i]
      if (b.winner === 'A') aWins++
      else if (b.winner === 'B') bWins++
      else ties++

      pbSum += (b.position_bias_delta || 0)
      vbSum += Math.abs(b.verbosity_bias_score || 0)

      posBiasTrend.push({
        date: new Date(b.created_at).toLocaleDateString(),
        position_bias_delta: b.position_bias_delta || 0,
        verbosity_bias_score: b.verbosity_bias_score || 0,
      })
    }

    // 3. Consistency Score (100 - (avg_position_bias * 10) - (avg_verbosity_bias * 20))
    const avgPb = total > 0 ? pbSum / total : 0
    const avgVb = total > 0 ? vbSum / total : 0

    let consistency = 100 - (avgPb * 10) - (avgVb * 20)
    consistency = Math.max(0, Math.min(100, consistency))

    const data = {
      total_battles: total,
      a_win_rate: total > 0 ? Math.round((aWins / total) * 100) : 0,
      b_win_rate: total > 0 ? Math.round((bWins / total) * 100) : 0,
      tie_rate: total > 0 ? Math.round((ties / total) * 100) : 0,
      avg_position_bias: Math.round(avgPb * 100) / 100,
      avg_verbosity_bias: Math.round(avgVb * 1000) / 1000,
      model_consistency_score: Math.round(consistency),
      position_bias_trend: posBiasTrend,
      verbosity_scatter: verbosityScatter,
    }

    return NextResponse.json({ success: true, data, error: null })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, data: null, error: (e as Error).message }, { status: 500 })
  }
}
