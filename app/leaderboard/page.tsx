import type { Metadata } from 'next'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { LeaderboardClient } from './LeaderboardClient'

export const metadata: Metadata = {
  title: 'Rankings — Champion Leaderboard',
  description: 'Ranked prompt leaderboard — see which prompts dominate the battle arena.',
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen">

      {/* ── PAGE HERO ── */}
      <div className="relative overflow-hidden border-b border-white/6 px-6 py-16 text-center">
        {/* BG glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(255,184,0,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        {/* Top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,184,0,0.5), transparent)' }} />

        <div className="relative z-10">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: 'rgba(255,184,0,0.6)' }}>
            ⚔ Champion Rankings
          </p>
          <h1 className="font-cinzel font-black uppercase text-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', textShadow: '0 0 60px rgba(255,255,255,0.1)' }}>
            THE{' '}
            <span style={{ color: 'var(--gold)', textShadow: '0 0 30px rgba(255,184,0,0.6)' }}>
              LEADERBOARD
            </span>
          </h1>
          <p className="mt-3 font-mono text-sm max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Only those who survive the Tribunal rise to these ranks. Every battle counts.
          </p>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,184,0,0.25), transparent)' }} />
      </div>

      {/* ── CONTENT ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Suspense fallback={
          <div className="font-mono text-[10px] uppercase tracking-widest text-center py-20"
            style={{ color: 'rgba(255,255,255,0.2)' }}>
            Loading champions...
          </div>
        }>
          <LeaderboardClient />
        </Suspense>
      </div>
    </div>
  )
}
