import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase-server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getServerSupabase()
    const { data, error } = await db
      .from('battles')
      .select('*, prompt_a:prompts!battles_prompt_a_id_fkey(id,name), prompt_b:prompts!battles_prompt_b_id_fkey(id,name)')
      .or(`prompt_a_id.eq.${params.id},prompt_b_id.eq.${params.id}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ success: true, data: data ?? [], error: null })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, data: null, error: (e as Error).message }, { status: 500 })
  }
}
