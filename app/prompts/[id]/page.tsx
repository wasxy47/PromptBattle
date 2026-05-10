import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PromptProfileClient } from './PromptProfileClient'
import { readApiResponse } from '@/lib/api'
import type { Prompt, Battle } from '@/types'

interface Props {
  params: { id: string }
}

async function getPromptById(id: string): Promise<Prompt | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/prompts/${id}`, { cache: 'no-store' })
    const json = await readApiResponse<Prompt>(res)
    if (json.success) return json.data
    return null
  } catch (e) {
    return null
  }
}

async function getBattlesByPromptId(id: string): Promise<Battle[]> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/prompts/${id}/battles`, { cache: 'no-store' })
    const json = await readApiResponse<Battle[]>(res)
    if (json.success) return json.data ?? []
    return []
  } catch (e) {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prompt = await getPromptById(params.id)
  if (!prompt) return { title: 'Prompt Not Found' }
  return {
    title: `${prompt.name} v${prompt.version}`,
    description: `Prompt profile for ${prompt.name} - ${prompt.wins}W/${prompt.losses}L in ${prompt.total_battles} battles`,
  }
}

export default async function PromptProfilePage({ params }: Props) {
  const [prompt, battles] = await Promise.all([
    getPromptById(params.id),
    getBattlesByPromptId(params.id),
  ])

  if (!prompt) notFound()

  return <PromptProfileClient prompt={prompt} battles={battles} />
}
