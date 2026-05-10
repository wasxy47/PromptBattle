'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, XCircle, Minus, Swords, Copy, Check } from 'lucide-react'
import { VersionTimeline } from '@/components/VersionTimeline'
import { cn, getCategoryColor, formatDate, formatScore, scoreToGrade } from '@/lib/utils'
import type { Prompt, Battle } from '@/types'

interface Props { prompt: Prompt; battles: Battle[] }

export function PromptProfileClient({ prompt, battles }: Props) {
  const [copied, setCopied] = useState(false)
  const [tab, setTab]       = useState<'content' | 'battles'>('content')

  const winRate = prompt.total_battles > 0
    ? Math.round((prompt.wins / prompt.total_battles) * 100) : 0

  const copy = () => {
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const grade = scoreToGrade(prompt.avg_score, 50)

  const gradeColor =
    grade === 'S' ? 'var(--gold)' :
    grade === 'A' ? '#4ade80' :
    grade === 'B' ? 'var(--steel)' :
    grade === 'C' ? 'var(--gold)' : 'var(--crimson)'

  return (
    <div className="min-h-screen">

      {/* Back link */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8">
        <Link href="/prompts"
          className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-white/25 hover:text-white/70 transition-colors mb-8">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Fighter Library
        </Link>
      </div>

      {/* ── FIGHTER HERO ── */}
      <div className="relative overflow-hidden border-b border-white/8">
        {/* BG glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[40vw] h-64 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(0,170,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,170,255,0.4), transparent)' }} />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-start gap-6">

            {/* Grade badge */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex h-20 w-20 shrink-0 items-center justify-center border-2 rounded-sm"
              style={{
                borderColor: `${gradeColor}50`,
                background: `${gradeColor}12`,
                boxShadow: `0 0 30px ${gradeColor}30`,
              }}
            >
              <span className="font-cinzel text-4xl font-black" style={{ color: gradeColor }}>
                {grade}
              </span>
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={cn('border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest rounded-sm',
                  getCategoryColor(prompt.category))}>
                  {prompt.category}
                </span>
                <span className="font-mono text-[9px] text-white/30 tracking-widest">v{prompt.version}</span>
                <span className="font-mono text-[9px] text-white/20">{formatDate(prompt.created_at)}</span>
              </div>
              <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-white mb-3 tracking-wide">
                {prompt.name}
              </h1>
              <p className="font-mono text-sm text-white/45 leading-relaxed max-w-2xl">
                {prompt.task_context}
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {[
                { label: 'Avg Score', value: prompt.avg_score > 0 ? `${formatScore(prompt.avg_score)}/50` : 'N/A', color: 'var(--gold)' },
                { label: 'Win Rate',  value: prompt.total_battles > 0 ? `${winRate}%` : 'N/A',                   color: '#4ade80'       },
                { label: 'Battles',   value: prompt.total_battles,                                                  color: 'var(--steel)'  },
                { label: 'Record',    value: `${prompt.wins}W ${prompt.losses}L`,                                   color: 'rgba(255,255,255,0.5)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="stat-card px-4 py-3">
                  <p className="font-cinzel text-lg font-black mb-0.5" style={{ color }}>{value}</p>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/25">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* W/L/D progress bar */}
          {prompt.total_battles > 0 && (
            <div className="mt-6">
              <div className="flex h-2 overflow-hidden rounded-sm">
                <div className="transition-all" style={{ width: `${winRate}%`, background: '#4ade80' }} />
                <div className="transition-all" style={{ width: `${(prompt.losses / prompt.total_battles) * 100}%`, background: 'var(--crimson)' }} />
                <div className="flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
              </div>
              <div className="flex items-center gap-5 mt-2">
                {[
                  { icon: Trophy,  val: prompt.wins,   color: '#4ade80',         label: 'Wins'  },
                  { icon: XCircle, val: prompt.losses, color: 'var(--crimson)',   label: 'Losses'},
                  { icon: Minus,   val: prompt.draws,  color: 'rgba(255,255,255,0.3)', label: 'Draws' },
                ].map(({ icon: Icon, val, color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" style={{ color }} />
                    <span className="font-mono text-xs" style={{ color }}>{val}</span>
                    <span className="font-mono text-[9px] text-white/25">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="mb-8 flex w-fit gap-1 border border-white/8 rounded-sm p-1"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          {(['content', 'battles'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-5 py-2 font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all',
                tab === t
                  ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
                  : 'text-white/35 hover:text-white/60'
              )}
            >
              {t === 'content' ? '📜 Content' : `⚔ Battles (${battles.length})`}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-5"
            >
              <div className="border border-white/8 rounded-sm p-5" style={{ background: 'rgba(0,0,0,0.45)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-cinzel text-sm font-bold uppercase tracking-[0.2em] text-white/50">
                    Prompt Arsenal
                  </h2>
                  <button
                    onClick={copy}
                    className="flex items-center gap-2 border border-white/10 rounded-sm px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white/35 hover:text-white/70 hover:border-white/20 transition-all"
                  >
                    {copied
                      ? <><Check className="h-3 w-3 text-green-400" /> Copied!</>
                      : <><Copy className="h-3 w-3" /> Copy</>
                    }
                  </button>
                </div>
                <pre className="whitespace-pre-wrap border border-white/5 rounded-sm p-4 font-mono text-[11px] leading-relaxed text-white/60"
                  style={{ background: 'rgba(0,0,0,0.5)' }}>
                  {prompt.content}
                </pre>
              </div>

              <Link
                href={`/?a_name=${encodeURIComponent(prompt.name)}&a_id=${prompt.id}`}
                className="inline-flex items-center gap-2 btn-battle py-3 px-8 text-sm"
              >
                <Swords className="h-4 w-4" />
                Send to Arena
              </Link>
            </motion.div>
          )}

          {tab === 'battles' && (
            <motion.div
              key="battles"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              {battles.length === 0 ? (
                <div className="text-center py-20 text-white/20">
                  <Swords className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p className="font-cinzel uppercase tracking-widest">No Battles Fought</p>
                  <p className="font-mono text-xs mt-2">Enter the arena to begin this fighter's legacy</p>
                </div>
              ) : (
                <VersionTimeline battles={battles} promptId={prompt.id} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
