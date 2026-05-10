import type { Metadata } from 'next'
import { CalibrationClient } from './CalibrationClient'

export const metadata: Metadata = {
  title: 'Judge Tribunal — Calibration Analytics',
  description: 'Monitor LLM judge bias, consistency, and calibration metrics across all battle evaluations.',
}

export default function CalibrationPage() {
  return (
    <div className="min-h-screen">

      {/* ── PAGE HERO ── */}
      <div className="relative overflow-hidden border-b border-white/6 px-6 py-16 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(0,170,255,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,170,255,0.5), transparent)' }} />

        <div className="relative z-10">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: 'rgba(0,170,255,0.6)' }}>
            ⚖ Tribunal Analytics
          </p>
          <h1 className="font-cinzel font-black uppercase text-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', textShadow: '0 0 60px rgba(255,255,255,0.1)' }}>
            JUDGE{' '}
            <span style={{ color: 'var(--steel)', textShadow: '0 0 30px rgba(0,170,255,0.6)' }}>
              CALIBRATION
            </span>
          </h1>
          <p className="mt-3 font-mono text-sm max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Position bias, verbosity bias, and judge consistency metrics across all evaluations.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,170,255,0.25), transparent)' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <CalibrationClient />
      </div>
    </div>
  )
}
