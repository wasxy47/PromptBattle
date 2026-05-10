'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Crown, Shield, Target, TrendingDown, TrendingUp, Trophy, Zap, Minus } from 'lucide-react'
import { cn, formatScore, getScoreColor } from '@/lib/utils'
import type { BattleResult, DimensionScores } from '@/types'
import { ScoreRadarChart } from './ScoreRadarChart'

interface Props {
  result: BattleResult
  nameA: string
  nameB: string
}

const DIMS = [
  { key: 'clarity' as keyof DimensionScores,           label: 'Clarity',              icon: Target    },
  { key: 'specificity' as keyof DimensionScores,       label: 'Specificity',          icon: Zap       },
  { key: 'biasRisk' as keyof DimensionScores,          label: 'Bias Safety',          icon: Shield    },
  { key: 'outputQuality' as keyof DimensionScores,     label: 'Output Quality',       icon: TrendingUp},
  { key: 'hallucinationRisk' as keyof DimensionScores, label: 'Hallucination Safety', icon: Brain     },
]

export function VerdictBanner({ result, nameA, nameB }: Props) {
  const [animIn, setAnimIn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 400)
    return () => clearTimeout(t)
  }, [])

  const { winner, total_a, total_b, avg_scores_a, avg_scores_b, verdict } = result
  const isTie = winner === 'TIE'
  const winnerName = isTie ? 'DRAW' : winner === 'A' ? nameA : nameB
  const winnerColor = isTie ? 'var(--gold)' : winner === 'A' ? 'var(--crimson)' : 'var(--steel)'
  const loserTotal  = winner === 'A' ? total_b : total_a

  return (
    <div className="space-y-6">

      {/* ── WINNER BANNER ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-sm border text-center py-12 px-6"
        style={{
          borderColor: `${winnerColor}40`,
          background: `linear-gradient(135deg, ${winnerColor}08 0%, rgba(3,2,10,0.95) 60%)`,
        }}
      >
        {/* Animated top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${winnerColor}, transparent)`,
            boxShadow: `0 0 20px ${winnerColor}` }} />

        {/* Crown icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-sm border mb-4"
          style={{ borderColor: `${winnerColor}40`, background: `${winnerColor}12`,
            boxShadow: `0 0 40px ${winnerColor}30` }}
        >
          <Crown className="w-8 h-8" style={{ color: winnerColor }} />
        </motion.div>

        {/* Label */}
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: `${winnerColor}80` }}>
          {isTie ? '— The duel ends in —' : '— Tribunal Verdict —'}
        </p>

        {/* Winner name — MASSIVE */}
        <motion.h2
          className="font-cinzel font-black uppercase tracking-wider mb-1"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: winnerColor,
            textShadow: `0 0 40px ${winnerColor}, 0 0 80px ${winnerColor}50` }}
          animate={{ textShadow: [
            `0 0 20px ${winnerColor}`,
            `0 0 60px ${winnerColor}, 0 0 100px ${winnerColor}50`,
            `0 0 20px ${winnerColor}`,
          ]}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {isTie ? 'PERFECT DRAW' : winnerName}
        </motion.h2>

        {!isTie && (
          <p className="font-mono text-xs uppercase tracking-widest mb-6"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            Claims Victory · Score {formatScore(winner === 'A' ? total_a : total_b)} vs {formatScore(loserTotal)}
          </p>
        )}

        {/* Score comparison row */}
        <div className="flex items-center justify-center gap-8 mt-4">
          <ScoreDisplay name={nameA} score={total_a} side="A" isWinner={!isTie && winner === 'A'} />
          <div className="font-cinzel font-black text-2xl text-white/20">vs</div>
          <ScoreDisplay name={nameB} score={total_b} side="B" isWinner={!isTie && winner === 'B'} />
        </div>

        {/* Bottom scanline decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${winnerColor}30, transparent)` }} />
      </motion.div>

      {/* ── VERDICT TEXT ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative border rounded-sm p-5 overflow-hidden"
        style={{ borderColor: 'rgba(255,184,0,0.2)', background: 'rgba(255,184,0,0.04)' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-sm"
          style={{ background: 'linear-gradient(180deg, var(--gold), var(--crimson))' }} />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-400/60 mb-2 pl-3">
          ⚖ Tribunal Statement
        </p>
        <p className="font-rajdhani text-sm leading-7 text-white/70 pl-3">
          {verdict}
        </p>
      </motion.div>

      {/* ── DIMENSION BREAKDOWN + RADAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animIn ? 1 : 0, y: animIn ? 0 : 20 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6"
      >
        {/* Dimension bars */}
        <div className="battle-panel battle-panel-gold p-5 space-y-4" style={{ color: 'var(--gold)' }}>
          <h3 className="font-cinzel text-sm font-bold uppercase tracking-[0.2em] text-white/60 border-b border-white/8 pb-3">
            📊 Dimension Breakdown
          </h3>
          {DIMS.map(({ key, label, icon: Icon }) => {
            const sA = avg_scores_a[key]
            const sB = avg_scores_b[key]
            const diff = sA - sB
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-yellow-400/70" strokeWidth={1.5} />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/50">{label}</span>
                  </div>
                  {diff > 0.5 ? (
                    <span className="font-mono text-[9px] text-red-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> A leads
                    </span>
                  ) : diff < -0.5 ? (
                    <span className="font-mono text-[9px] text-blue-400 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> B leads
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] text-white/30 flex items-center gap-1">
                      <Minus className="w-3 h-3" /> Even
                    </span>
                  )}
                </div>

                {/* Dual bar */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[8px] text-red-400/70 uppercase tracking-widest">A</span>
                      <span className="font-cinzel text-sm font-bold" style={{ color: '#ff6060' }}>{sA.toFixed(1)}</span>
                    </div>
                    <div className="score-bar">
                      <div className="score-bar-fill" style={{
                        width: animIn ? `${sA * 10}%` : '0%',
                        background: 'linear-gradient(90deg, #c0000a, #ff6060)',
                        boxShadow: '0 0 8px rgba(255,45,45,0.4)',
                      }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[8px] text-blue-400/70 uppercase tracking-widest">B</span>
                      <span className="font-cinzel text-sm font-bold" style={{ color: '#60aaff' }}>{sB.toFixed(1)}</span>
                    </div>
                    <div className="score-bar">
                      <div className="score-bar-fill" style={{
                        width: animIn ? `${sB * 10}%` : '0%',
                        background: 'linear-gradient(90deg, #0066cc, #60aaff)',
                        boxShadow: '0 0 8px rgba(0,170,255,0.4)',
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Radar + Bias Metrics */}
        <div className="space-y-4">
          {/* Radar */}
          <div className="radar-container">
            <h3 className="font-cinzel text-sm font-bold uppercase tracking-[0.2em] text-white/60 border-b border-white/8 pb-3 mb-3">
              🕸 Performance Radar
            </h3>
            <ScoreRadarChart scoresA={avg_scores_a} scoresB={avg_scores_b} nameA={nameA} nameB={nameB} />
          </div>

          {/* Bias stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: 'Position Bias',
                value: result.position_bias_delta.toFixed(2),
                note: result.position_bias_delta < 2 ? '✓ Low' : '⚠ Detected',
                ok: result.position_bias_delta < 2,
              },
              {
                label: 'Verbosity Bias',
                value: Math.abs(result.verbosity_bias_score).toFixed(3),
                note: Math.abs(result.verbosity_bias_score) < 0.3 ? '✓ Minimal' : '⚠ Present',
                ok: Math.abs(result.verbosity_bias_score) < 0.3,
              },
              {
                label: 'Eval Runs',
                value: '2',
                note: 'Mirrored',
                ok: true,
              },
            ].map(m => (
              <div key={m.label} className="stat-card">
                <p className="font-mono text-[8px] uppercase tracking-widest text-white/30 mb-1">{m.label}</p>
                <p className="font-cinzel text-2xl font-black text-white">{m.value}</p>
                <p className={`font-mono text-[9px] uppercase tracking-widest mt-1 ${m.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                  {m.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* Score display sub-component */
function ScoreDisplay({ name, score, side, isWinner }: {
  name: string; score: number; side: 'A' | 'B'; isWinner: boolean
}) {
  const color = side === 'A' ? 'var(--crimson)' : 'var(--steel)'
  return (
    <div className={`flex flex-col items-center gap-1 transition-all duration-500 ${!isWinner ? 'opacity-40 grayscale' : ''}`}>
      <div className="w-12 h-12 border rounded-sm flex items-center justify-center mb-1"
        style={{ borderColor: `${color}40`, background: `${color}10` }}>
        {isWinner ? (
          <Trophy className="w-6 h-6" style={{ color }} />
        ) : (
          <Shield className="w-6 h-6 text-white/20" />
        )}
      </div>
      <p className="font-mono text-[8px] uppercase tracking-widest text-white/40">
        {side === 'A' ? 'RED FIGHTER' : 'BLUE FIGHTER'}
      </p>
      <p className="font-cinzel font-black text-3xl" style={{ color, textShadow: isWinner ? `0 0 20px ${color}` : 'none' }}>
        {formatScore(score)}
      </p>
      <p className="font-cinzel text-xs font-bold uppercase tracking-widest text-white/50 max-w-[120px] truncate text-center">
        {name}
      </p>
      {isWinner && (
        <span className="winner-badge mt-1" style={{ color, borderColor: `${color}40`, background: `${color}10`, fontSize: '8px' }}>
          ⚔ VICTOR
        </span>
      )}
    </div>
  )
}
