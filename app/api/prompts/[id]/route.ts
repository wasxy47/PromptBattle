import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase-server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getServerSupabase()
    const { data, error } = await db
      .from('prompts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, data: null, error: 'Prompt not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data, error: null })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, data: null, error: (e as Error).message }, { status: 500 })
  }
}
