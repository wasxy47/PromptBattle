'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Flag, ScrollText, Shield, Swords } from 'lucide-react'
import { cn, getCategoryColor } from '@/lib/utils'
import type { PromptCategory, PromptInput } from '@/types'

const CATEGORIES: PromptCategory[] = [
  'reasoning',
  'creative',
  'coding',
  'analysis',
  'instruction',
  'extraction',
  'summarization',
  'debate',
  'general',
]

interface FighterCardProps {
  corner: 'A' | 'B'
  value: PromptInput
  onChange: (value: PromptInput) => void
  disabled?: boolean
}

export function FighterCard({ corner, value, onChange, disabled }: FighterCardProps) {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const isRed = corner === 'A'
  const tone = isRed
    ? {
        corner: 'Red Corner',
        house: 'Crimson Legion',
        glow: 'shadow-[0_0_70px_rgba(192,57,43,0.16)]',
        border: 'border-primary/35 hover:border-primary-light/55',
        blade: 'from-primary-light via-primary to-transparent',
        text: 'text-primary-light text-glow-primary',
        badge: 'border-primary/45 bg-primary/12 text-primary-light',
        focus: 'focus:border-primary-light/70 focus:shadow-[0_0_0_1px_rgba(255,90,76,0.22),0_0_28px_rgba(192,57,43,0.12)]',
        meter: 'from-primary-light to-primary',
      }
    : {
        corner: 'Blue Corner',
        house: 'Azure Phalanx',
        glow: 'shadow-[0_0_70px_rgba(41,128,185,0.16)]',
        border: 'border-steel/35 hover:border-steel-light/55',
        blade: 'from-transparent via-primary to-steel-light',
        text: 'text-steel-light text-glow-steel',
        badge: 'border-steel/45 bg-steel/12 text-steel-light',
        focus: 'focus:border-steel-light/70 focus:shadow-[0_0_0_1px_rgba(88,184,255,0.22),0_0_28px_rgba(41,128,185,0.12)]',
        meter: 'from-primary to-steel-light',
      }

  const set = (field: keyof PromptInput, val: string | PromptCategory) => {
    onChange({ ...value, [field]: val })
  }

  const contentPct = Math.min(100, Math.round((value.content.length / 5000) * 100))

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className={cn(
        'group relative h-full overflow-hidden border bg-[linear-gradient(145deg,rgba(18,18,26,0.9),rgba(5,5,7,0.96))] p-5 backdrop-blur-xl transition duration-300 sm:p-6',
        tone.border,
        tone.glow
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r', tone.blade)} />
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-70" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-70" />
      <div className="pointer-events-none absolute -top-20 right-8 h-40 w-40 rounded-full bg-white/5 blur-3xl transition group-hover:bg-primary/10" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className={cn('mb-3 inline-flex items-center gap-2 border px-3 py-1.5', tone.badge)}>
            <Flag className="h-3.5 w-3.5" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]">
              {tone.corner}
            </span>
          </div>
          <h2 className={cn('font-cinzel text-3xl font-black uppercase tracking-normal sm:text-4xl', tone.text)}>
            Prompt {corner}
          </h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/34">
            {tone.house}
          </p>
        </div>

        <div className={cn('relative flex h-14 w-14 shrink-0 items-center justify-center border', tone.badge)}>
          <Shield className="absolute h-10 w-10 opacity-25" strokeWidth={1.2} />
          <span className="relative font-cinzel text-2xl font-black">{corner}</span>
        </div>
      </div>

      <div className="relative my-6 h-px bg-white/8">
        <Swords className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 bg-[#09090d] px-1 text-primary" />
      </div>

      <div className="relative grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">
            Champion Name
          </label>
          <input
            className={cn('arena-input', tone.focus)}
            placeholder="e.g. The Interrogator"
            value={value.name}
            onChange={e => set('name', e.target.value)}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">
            Version
          </label>
          <input
            className={cn('arena-input', tone.focus)}
            placeholder="1.0"
            value={value.version}
            onChange={e => set('version', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="relative mt-5">
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">
          Battle Class
        </label>
        <button
          type="button"
          onClick={() => setCategoryOpen(o => !o)}
          disabled={disabled}
          className={cn(
            'arena-input flex cursor-pointer items-center justify-between gap-3 text-left',
            tone.focus
          )}
        >
          <span className={cn('category-badge', getCategoryColor(value.category))}>
            {value.category}
          </span>
          <ChevronDown className={cn('h-4 w-4 text-white/45 transition-transform', categoryOpen && 'rotate-180')} />
        </button>

        {categoryOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 grid grid-cols-1 gap-1 border border-white/10 bg-[#09090d]/98 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:grid-cols-2"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  set('category', cat)
                  setCategoryOpen(false)
                }}
                className={cn(
                  'flex items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.055]',
                  value.category === cat && 'bg-primary/10'
                )}
              >
                <span className={cn('category-badge', getCategoryColor(cat))}>{cat}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-5">
        <label className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">
          <ScrollText className="h-3.5 w-3.5" />
          Task Context
        </label>
        <textarea
          className={cn('arena-input min-h-[90px]', tone.focus)}
          rows={3}
          placeholder="What battlefield should the judge test this prompt on?"
          value={value.task_context}
          onChange={e => set('task_context', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="mt-5 flex min-h-[260px] flex-1 flex-col">
        <label className="mb-2 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">
          <span>Prompt Scroll</span>
          <span className={cn(value.content.length > 4500 ? 'text-primary-light' : 'text-white/30')}>
            {value.content.length}/5000
          </span>
        </label>
        <textarea
          className={cn('arena-input min-h-[240px] flex-1 text-sm leading-7', tone.focus)}
          placeholder="Paste the full prompt here. Strategy, constraints, examples, output format..."
          value={value.content}
          onChange={e => set('content', e.target.value)}
          disabled={disabled}
        />
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-500', tone.meter)}
            style={{ width: `${contentPct}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
