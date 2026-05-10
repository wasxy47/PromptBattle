import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category')
    const db = getServerSupabase()

    let query = db.from('prompts').select('*').order('created_at', { ascending: false })
    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ success: true, data, error: null })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, data: null, error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = getServerSupabase()

    const { data, error } = await db
      .from('prompts')
      .insert({
        name:         body.name,
        version:      body.version ?? '1.0',
        category:     body.category ?? 'general',
        task_context: body.task_context ?? '',
        content:      body.content,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data, error: null })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, data: null, error: (e as Error).message }, { status: 500 })
  }
}
