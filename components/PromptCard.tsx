'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Swords, Trophy, XCircle, Minus } from 'lucide-react'
import { cn, getCategoryColor, formatRelativeTime, truncate } from '@/lib/utils'
import type { Prompt } from '@/types'

interface PromptCardProps {
  prompt: Prompt
  index?: number
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const winRate = prompt.total_battles > 0
    ? Math.round((prompt.wins / prompt.total_battles) * 100)
    : 0

  const strengthColor =
    winRate >= 70 ? 'var(--gold)' :
    winRate >= 50 ? '#4ade80' :
    winRate >= 30 ? 'var(--steel)' : 'var(--crimson)'

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
        whileHover={{ y: -4, scale: 1.01 }}
        className="group relative flex flex-col gap-4 h-full border border-white/6 rounded-sm p-5 overflow-hidden transition-all duration-300 hover:border-yellow-500/25"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)' }}
      >
        {/* Top corner accent */}
        <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-500/40 to-transparent group-hover:from-yellow-500/70 transition-all" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-yellow-500/40 to-transparent group-hover:from-yellow-500/70 transition-all" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-cinzel text-base font-bold text-white group-hover:text-yellow-400 transition-colors truncate tracking-wide">
              {prompt.name}
            </h3>
            <p className="font-mono text-[9px] text-white/25 mt-0.5 tracking-widest">v{prompt.version}</p>
          </div>
          <span className={cn(
            'shrink-0 border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest rounded-sm',
            getCategoryColor(prompt.category)
          )}>
            {prompt.category}
          </span>
        </div>

        {/* Task context */}
        <p className="font-mono text-[10px] text-white/35 leading-relaxed">
          {truncate(prompt.task_context, 90)}
        </p>

        {/* Prompt preview */}
        <div className="flex-1 border border-white/5 rounded-sm p-3"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          <p className="font-mono text-[10px] text-white/45 leading-relaxed">
            {truncate(prompt.content, 140)}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Trophy,   value: prompt.wins,          label: 'Wins',    color: '#4ade80' },
            { icon: XCircle,  value: prompt.losses,        label: 'Losses',  color: 'var(--crimson)' },
            { icon: Minus,    value: prompt.draws,          label: 'Draws',   color: 'rgba(255,255,255,0.3)' },
            { icon: Swords,   value: prompt.total_battles, label: 'Battles', color: 'var(--gold)' },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="flex flex-col items-center border border-white/5 rounded-sm py-2"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="font-cinzel text-lg font-black" style={{ color }}>{value}</span>
              <span className="font-mono text-[8px] text-white/25 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>

        {/* Win rate bar */}
        {prompt.total_battles > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-mono text-[8px] uppercase tracking-widest text-white/25">Win Rate</span>
              <span className="font-mono text-[8px]" style={{ color: strengthColor }}>{winRate}%</span>
            </div>
            <div className="score-bar">
              <div className="score-bar-fill"
                style={{ width: `${winRate}%`, background: strengthColor, boxShadow: `0 0 6px ${strengthColor}60` }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <Clock className="h-3 w-3" />
            <span className="font-mono text-[9px]">{formatRelativeTime(prompt.created_at)}</span>
          </div>
          {prompt.avg_score > 0 && (
            <span className="font-cinzel text-sm font-black" style={{ color: 'var(--gold)' }}>
              {prompt.avg_score.toFixed(1)}
              <span className="font-mono text-[9px] text-white/20">/50</span>
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
