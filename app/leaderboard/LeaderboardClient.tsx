'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Trophy, Swords, Crown } from 'lucide-react'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { readApiResponse } from '@/lib/api'
import { cn, getCategoryColor } from '@/lib/utils'
import type { LeaderboardEntry, PromptCategory } from '@/types'

const CATEGORIES: Array<PromptCategory | 'all'> = [
  'all', 'reasoning', 'creative', 'coding', 'analysis',
  'instruction', 'extraction', 'summarization', 'debate', 'general',
]

export function LeaderboardClient() {
  const [entries, setEntries]   = useState<LeaderboardEntry[]>([])
  const [loading, setLoading]   = useState(true)
  const [category, setCategory] = useState<PromptCategory | 'all'>('all')
  const [error, setError]       = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = category !== 'all' ? `/api/leaderboard?category=${category}` : '/api/leaderboard'
      const res  = await fetch(url)
      const json = await readApiResponse<LeaderboardEntry[]>(res)
      if (!json.success) throw new Error(json.error ?? 'Failed to load leaderboard')
      setEntries(json.data ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => { fetchData() }, [fetchData])

  const totalBattles = entries.reduce((s, e) => s + e.total_battles, 0)
  const topWinRate   = entries.length > 0 ? Math.max(...entries.map(e => e.win_rate)) : 0

  return (
    <div className="space-y-8">

      {/* ── Summary Stats ── */}
      <AnimatePresence>
        {!loading && entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: Crown,  label: 'Champions Ranked', value: entries.length,   color: 'var(--gold)'    },
              { icon: Swords, label: 'Total Battles',    value: totalBattles,      color: 'var(--crimson)' },
              { icon: Trophy, label: 'Top Win Rate',     value: `${topWinRate}%`,  color: 'var(--steel)'   },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="stat-card group hover:border-white/15 transition-all duration-300">
                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
                <p className="font-cinzel text-3xl font-black mb-1" style={{ color }}>
                  {value}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">{label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'border rounded-sm px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-all duration-200',
                category === cat
                  ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400 shadow-[0_0_12px_rgba(255,184,0,0.2)]'
                  : 'border-white/8 text-white/35 hover:border-white/18 hover:text-white/60'
              )}
            >
              {cat === 'all' ? '⚔ All' : cat}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={fetchData}
          className="btn-reset"
        >
          <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-500/20 rounded-sm px-5 py-4"
          style={{ background: 'rgba(255,45,45,0.06)' }}>
          <p className="font-mono text-sm text-red-300">{error}</p>
          <p className="font-mono text-xs text-red-400/40 mt-1">
            Ensure your Supabase credentials are configured in .env.local
          </p>
        </div>
      )}

      {/* Table */}
      <LeaderboardTable entries={entries} loading={loading} />
    </div>
  )
}
