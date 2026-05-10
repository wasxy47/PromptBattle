import type { Metadata } from 'next'
import { PromptsClient } from './PromptsClient'

export const metadata: Metadata = {
  title: 'Fighter Library — Prompt Scrolls',
  description: 'Browse all battle-tested prompts in the PromptBattle arena with full stats and battle history.',
}

export default function PromptsPage() {
  return (
    <div className="min-h-screen">

      {/* ── PAGE HERO ── */}
      <div className="relative overflow-hidden border-b border-white/6 px-6 py-16 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(191,0,255,0.09) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(191,0,255,0.5), transparent)' }} />

        <div className="relative z-10">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: 'rgba(191,0,255,0.6)' }}>
            📜 Prompt Scroll Archive
          </p>
          <h1 className="font-cinzel font-black uppercase text-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', textShadow: '0 0 60px rgba(255,255,255,0.1)' }}>
            FIGHTER{' '}
            <span style={{ color: 'var(--plasma)', textShadow: '0 0 30px rgba(191,0,255,0.6)' }}>
              LIBRARY
            </span>
          </h1>
          <p className="mt-3 font-mono text-sm max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Browse battle-tested prompts. Every entry is ranked by combat record and average score.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(191,0,255,0.25), transparent)' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <PromptsClient />
      </div>
    </div>
  )
}
