import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { DimensionScores, RadarDataPoint, DimensionKey } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return score.toFixed(1)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return formatDate(dateString)
}

export function scoresToRadarData(
  scoresA: DimensionScores,
  scoresB: DimensionScores
): RadarDataPoint[] {
  const dims: { key: DimensionKey; label: string }[] = [
    { key: 'clarity', label: 'Clarity' },
    { key: 'specificity', label: 'Specificity' },
    { key: 'biasRisk', label: 'Bias Safety' },
    { key: 'outputQuality', label: 'Output Quality' },
    { key: 'hallucinationRisk', label: 'Hallucination Safety' },
  ]

  return dims.map(({ key, label }) => ({
    dimension: label,
    A: scoresA[key],
    B: scoresB[key],
    fullMark: 10,
  }))
}

export function getWinnerColor(winner: 'A' | 'B' | 'TIE'): string {
  if (winner === 'A') return 'text-crimson-light'
  if (winner === 'B') return 'text-steel-light'
  return 'text-gold'
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    reasoning: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
    creative: 'bg-pink-900/40 text-pink-300 border-pink-700/50',
    coding: 'bg-green-900/40 text-green-300 border-green-700/50',
    analysis: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    instruction: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
    extraction: 'bg-orange-900/40 text-orange-300 border-orange-700/50',
    summarization: 'bg-teal-900/40 text-teal-300 border-teal-700/50',
    debate: 'bg-red-900/40 text-red-300 border-red-700/50',
    general: 'bg-gray-900/40 text-gray-300 border-gray-700/50',
  }
  return colors[category] ?? colors.general
}

export function getRankIcon(rank: number): string {
  if (rank === 1) return 'I'
  if (rank === 2) return 'II'
  if (rank === 3) return 'III'
  return `#${rank}`
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

export function scoreToGrade(score: number, maxScore = 50): string {
  const pct = (score / maxScore) * 100
  if (pct >= 90) return 'S'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B'
  if (pct >= 60) return 'C'
  if (pct >= 50) return 'D'
  return 'F'
}

export function getScoreColor(score: number, max = 10): string {
  const pct = score / max
  if (pct >= 0.8) return 'text-green-400'
  if (pct >= 0.6) return 'text-yellow-400'
  if (pct >= 0.4) return 'text-orange-400'
  return 'text-red-400'
}
