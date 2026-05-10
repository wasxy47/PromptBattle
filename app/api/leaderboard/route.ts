import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category')
    const db = getServerSupabase()

    let query = db
      .from('prompts')
      .select('id, name, version, category, wins, losses, draws, avg_score, total_battles')
      .gt('total_battles', 0)
      .order('wins', { ascending: false })
      .order('avg_score', { ascending: false })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) throw error

    // Add rank
    const ranked = (data ?? []).map((p, i) => ({ ...p, rank: i + 1, win_rate: p.total_battles > 0 ? Math.round((p.wins / p.total_battles) * 100) : 0 }))

    return NextResponse.json({ success: true, data: ranked, error: null })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, data: null, error: (e as Error).message }, { status: 500 })
  }
}
