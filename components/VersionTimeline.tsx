'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Minus, Trophy, XCircle } from 'lucide-react'
import { cn, formatDate, formatScore } from '@/lib/utils'
import type { Battle } from '@/types'

interface Props { battles: Battle[]; promptId: string }

export function VersionTimeline({ battles, promptId }: Props) {
  if (battles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/20">
        <p className="font-cinzel text-base uppercase tracking-widest">No Battles Fought Yet</p>
        <p className="mt-2 font-mono text-xs">Enter the arena to begin your legacy</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline spine */}
      <div className="absolute bottom-0 left-6 top-0 w-px pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(255,184,0,0.5) 0%, rgba(255,184,0,0.1) 70%, transparent 100%)' }} />

      <div className="space-y-4 pl-16">
        {battles.map((battle, i) => {
          const isA   = battle.prompt_a_id === promptId
          const myScore  = isA ? battle.total_a : battle.total_b
          const oppScore = isA ? battle.total_b : battle.total_a
          const won  = (battle.winner === 'A' && isA) || (battle.winner === 'B' && !isA)
          const drew = battle.winner === 'TIE'
          const opponent = isA ? battle.prompt_b : battle.prompt_a

          const outcomeColor  = won ? '#4ade80' : drew ? 'var(--gold)' : 'var(--crimson)'
          const outcomeBorder = won ? 'rgba(74,222,128,0.25)'   : drew ? 'rgba(255,184,0,0.25)'  : 'rgba(255,45,45,0.25)'
          const outcomeBg     = won ? 'rgba(74,222,128,0.05)'   : drew ? 'rgba(255,184,0,0.05)'  : 'rgba(255,45,45,0.05)'
          const outcomeLabel  = won ? 'WIN' : drew ? 'DRAW' : 'LOSS'

          return (
            <motion.div
              key={battle.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div
                className="absolute -left-10 top-4 z-10 h-4 w-4 rounded-full border-2"
                style={{
                  borderColor: outcomeColor,
                  background: `${outcomeColor}25`,
                  boxShadow: `0 0 8px ${outcomeColor}60`,
                }}
              />

              {/* Battle card */}
              <div
                className="border rounded-sm p-4 transition-all duration-200 hover:border-white/12"
                style={{ borderColor: outcomeBorder, background: outcomeBg }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {won
                      ? <Trophy className="h-4 w-4 shrink-0" style={{ color: '#4ade80' }} />
                      : drew
                        ? <Minus className="h-4 w-4 shrink-0" style={{ color: 'var(--gold)' }} />
                        : <XCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--crimson)' }} />
                    }
                    <div>
                      <p className="font-mono text-[9px] text-white/30 tracking-widest mb-0.5">
                        {formatDate(battle.created_at)}
                      </p>
                      <p className="font-cinzel text-sm font-bold text-white">
                        vs{' '}
                        <span style={{ color: 'var(--gold)' }}>
                          {(opponent as { name?: string })?.name ?? 'Unknown'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-cinzel text-xl font-black" style={{ color: outcomeColor }}>
                      {formatScore(myScore)}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-white/15" />
                    <span className="font-cinzel text-xl font-black text-white/25">
                      {formatScore(oppScore)}
                    </span>
                    <span
                      className="border px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest rounded-sm"
                      style={{ borderColor: outcomeBorder, color: outcomeColor, background: `${outcomeColor}10` }}
                    >
                      {outcomeLabel}
                    </span>
                  </div>
                </div>

                {battle.verdict && (
                  <p className="mt-3 border-t border-white/5 pt-3 font-mono text-[9px] leading-relaxed text-white/25">
                    {battle.verdict.slice(0, 180)}{battle.verdict.length > 180 ? '...' : ''}
                  </p>
                )}

                {/* Score regression warning */}
                {i > 0 && (() => {
                  const prev = battles[i - 1]
                  const prevIsA = prev.prompt_a_id === promptId
                  const prevScore = prevIsA ? prev.total_a : prev.total_b
                  if (prevScore - myScore > 5) {
                    return (
                      <div className="mt-2 flex items-center gap-2 border border-red-500/20 rounded-sm px-3 py-1.5"
                        style={{ background: 'rgba(255,45,45,0.06)' }}>
                        <span className="font-mono text-[9px] text-red-400">
                          ⚠ Score regression: −{(prevScore - myScore).toFixed(1)} pts from previous battle
                        </span>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
