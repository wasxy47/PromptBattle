'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Trophy } from 'lucide-react'
import { cn, formatScore, getCategoryColor, getRankIcon } from '@/lib/utils'
import type { LeaderboardEntry, PromptCategory } from '@/types'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  loading?: boolean
}

type SortKey = 'rank' | 'wins' | 'win_rate' | 'avg_score' | 'total_battles'

const RANK_STYLES: Record<number, { bg: string; text: string; shadow: string }> = {
  1: { bg: 'linear-gradient(135deg, #ffd700, #ffb800)', text: '#1a0e00', shadow: '0 0 20px rgba(255,184,0,0.7)' },
  2: { bg: 'linear-gradient(135deg, #e0e7f0, #9ca3af)', text: '#111827', shadow: '0 0 12px rgba(200,210,220,0.5)' },
  3: { bg: 'linear-gradient(135deg, #d97435, #a0522d)', text: '#fff7e8', shadow: '0 0 12px rgba(190,100,40,0.5)' },
}

export function LeaderboardTable({ entries, loading }: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = [...entries].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1
    return (a[sortKey] - b[sortKey]) * mul
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(k)}
      className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
    >
      {label}
      {sortKey === k && (
        sortDir === 'desc'
          ? <TrendingDown className="h-3 w-3 text-yellow-400" />
          : <TrendingUp className="h-3 w-3 text-yellow-400" />
      )}
    </button>
  )

  // Skeleton loading rows
  if (loading) {
    return (
      <div className="border border-white/6 rounded-sm overflow-hidden">
        <table className="arena-table">
          <thead>
            <tr>
              {['Rank', 'Fighter', 'Class', 'W / L / D', 'Win Rate', 'Avg Score', 'Battles'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, i) => (
              <tr key={i}>
                {[...Array(7)].map((_, j) => (
                  <td key={j}>
                    <div
                      className="h-4 rounded-sm animate-pulse"
                      style={{ width: `${40 + Math.random() * 45}%`, background: 'rgba(255,255,255,0.05)' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 border border-white/6 rounded-sm"
        style={{ background: 'rgba(0,0,0,0.4)' }}>
        <Trophy className="h-12 w-12" style={{ color: 'rgba(255,184,0,0.2)' }} />
        <p className="font-cinzel text-lg text-white/25 uppercase tracking-widest">No Champions Yet</p>
        <p className="font-mono text-xs text-white/20">Run your first battle to populate the rankings</p>
      </div>
    )
  }

  return (
    <div className="border border-white/6 rounded-sm overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <table className="arena-table">
        <thead>
          <tr>
            <th><SortBtn k="rank" label="Rank" /></th>
            <th>Fighter</th>
            <th>Class</th>
            <th><SortBtn k="wins" label="W / L / D" /></th>
            <th><SortBtn k="win_rate" label="Win Rate" /></th>
            <th><SortBtn k="avg_score" label="Score" /></th>
            <th><SortBtn k="total_battles" label="Battles" /></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, i) => {
            const rankStyle = RANK_STYLES[entry.rank]
            const isTop3 = entry.rank <= 3
            return (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="group cursor-pointer"
                onClick={() => window.location.href = `/prompts/${entry.id}`}
                style={isTop3 ? {
                  background: `rgba(255,184,0,${0.03 - (entry.rank - 1) * 0.005})`,
                } : {}}
              >
                {/* Rank */}
                <td>
                  {isTop3 ? (
                    <div
                      className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-xs font-black"
                      style={{ background: rankStyle.bg, color: rankStyle.text, boxShadow: rankStyle.shadow }}
                    >
                      {entry.rank === 1 ? '👑' : entry.rank === 2 ? '2' : '3'}
                    </div>
                  ) : (
                    <span className="font-orbitron text-sm font-bold text-white/30">
                      #{entry.rank}
                    </span>
                  )}
                </td>

                {/* Name */}
                <td>
                  <div>
                    <p className="font-cinzel font-bold text-white group-hover:text-yellow-400 transition-colors tracking-wide">
                      {entry.name}
                    </p>
                    <p className="font-mono text-[9px] text-white/25 mt-0.5 tracking-widest">
                      v{entry.version}
                    </p>
                  </div>
                </td>

                {/* Category */}
                <td>
                  <span className={cn(
                    'inline-flex items-center border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest rounded-sm',
                    getCategoryColor(entry.category)
                  )}>
                    {entry.category}
                  </span>
                </td>

                {/* W/L/D */}
                <td>
                  <span className="font-mono text-sm">
                    <span className="text-emerald-400 font-bold">{entry.wins}</span>
                    <span className="text-white/20 mx-1">/</span>
                    <span style={{ color: 'var(--crimson)' }}>{entry.losses}</span>
                    <span className="text-white/20 mx-1">/</span>
                    <span className="text-white/35">{entry.draws}</span>
                  </span>
                </td>

                {/* Win Rate bar */}
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 score-bar">
                      <div
                        className="score-bar-fill"
                        style={{
                          width: `${entry.win_rate}%`,
                          background: 'linear-gradient(90deg, var(--crimson), var(--gold))',
                          boxShadow: '0 0 6px rgba(255,184,0,0.3)',
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs text-white/60">{entry.win_rate}%</span>
                  </div>
                </td>

                {/* Score */}
                <td>
                  <span className="font-cinzel text-lg font-black" style={{ color: 'var(--gold)' }}>
                    {formatScore(entry.avg_score)}
                  </span>
                  <span className="font-mono text-[9px] text-white/20 ml-0.5">/50</span>
                </td>

                {/* Battles */}
                <td>
                  <span className="font-mono text-sm text-white/40">{entry.total_battles}</span>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
