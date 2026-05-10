'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, RefreshCw, Shield, TrendingUp, Zap } from 'lucide-react'
import { PositionBiasChart, VerbosityScatterChart } from '@/components/BiasCharts'
import type { CalibrationStats } from '@/types'
import { readApiResponse } from '@/lib/api'

export function CalibrationClient() {
  const [stats, setStats]   = useState<CalibrationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch('/api/calibration')
      const json = await readApiResponse<CalibrationStats>(res)
      if (!json.success) throw new Error(json.error ?? 'Failed to load calibration data')
      setStats(json.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load calibration data')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchStats() }, [])

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 border border-white/6 rounded-sm animate-pulse"
            style={{ background: 'rgba(255,255,255,0.025)' }} />
        ))}
      </div>
    )
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 border border-red-500/20 rounded-sm"
        style={{ background: 'rgba(255,45,45,0.04)' }}>
        <p className="font-cinzel text-xl text-red-300 uppercase tracking-widest">Tribunal Unavailable</p>
        <p className="font-mono text-sm text-red-400/50">{error}</p>
        <p className="font-mono text-xs text-white/20">Configure Supabase to enable analytics</p>
        <button onClick={fetchStats} className="btn-reset mt-2">
          <RefreshCw className="h-3 w-3" /> Retry Connection
        </button>
      </div>
    )
  }

  /* ── Empty state ── */
  if (!stats || stats.total_battles === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/20">
        <Activity className="h-16 w-16 opacity-20" />
        <p className="font-cinzel text-xl uppercase tracking-widest">No Battle Data Yet</p>
        <p className="font-mono text-xs">Run battles to populate Tribunal analytics</p>
      </div>
    )
  }

  const consistencyColor =
    stats.model_consistency_score >= 80 ? '#4ade80' :
    stats.model_consistency_score >= 60 ? '#ffb800' : '#ff2d2d'

  const biasLevel = (val: number) =>
    val < 0.1 ? { label: '✓ Excellent', color: '#4ade80' } :
    val < 0.3 ? { label: '~ Acceptable', color: '#ffb800' } :
    { label: '⚠ High', color: '#ff2d2d' }

  return (
    <div className="space-y-6">

      {/* Refresh */}
      <div className="flex justify-end">
        <button onClick={fetchStats} className="btn-reset">
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      {/* ── Headline Metrics ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            icon: Activity,
            label: 'Total Battles',
            value: stats.total_battles,
            sub: 'evaluated',
            color: 'rgba(255,255,255,0.8)',
            accent: 'rgba(255,255,255,0.1)',
          },
          {
            icon: Shield,
            label: 'Consistency',
            value: `${stats.model_consistency_score}%`,
            sub: stats.model_consistency_score >= 80 ? 'Stable Judge' : 'Needs More Data',
            color: consistencyColor,
            accent: `${consistencyColor}20`,
          },
          {
            icon: TrendingUp,
            label: 'Position Bias',
            value: stats.avg_position_bias.toFixed(3),
            sub: biasLevel(stats.avg_position_bias / 10).label,
            color: biasLevel(stats.avg_position_bias / 10).color,
            accent: `${biasLevel(stats.avg_position_bias / 10).color}15`,
          },
          {
            icon: Zap,
            label: 'Verbosity Bias',
            value: stats.avg_verbosity_bias.toFixed(3),
            sub: biasLevel(stats.avg_verbosity_bias).label,
            color: biasLevel(stats.avg_verbosity_bias).color,
            accent: `${biasLevel(stats.avg_verbosity_bias).color}15`,
          },
        ].map(({ icon: Icon, label, value, sub, color, accent }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
            style={{ background: accent }}
          >
            <Icon className="w-4 h-4 mx-auto mb-2" style={{ color }} />
            <p className="font-cinzel text-3xl font-black mb-1" style={{ color }}>{value}</p>
            <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 mb-1">{label}</p>
            <p className="font-mono text-[9px]" style={{ color }}>{sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Win Distribution ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-white/6 rounded-sm p-6"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-px rounded-l-sm"
          style={{ background: 'linear-gradient(180deg, var(--gold), var(--crimson))' }} />
        <h2 className="font-cinzel text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-5">
          ⚔ Outcome Distribution
        </h2>
        <div className="space-y-4">
          {[
            { label: 'Red Fighter Wins',  value: stats.a_win_rate, color: 'var(--crimson)', glow: 'rgba(255,45,45,0.3)' },
            { label: 'Draws',             value: stats.tie_rate,    color: 'var(--gold)',    glow: 'rgba(255,184,0,0.3)' },
            { label: 'Blue Fighter Wins', value: stats.b_win_rate, color: 'var(--steel)',   glow: 'rgba(0,170,255,0.3)' },
          ].map(({ label, value, color, glow }) => (
            <div key={label}>
              <div className="flex justify-between mb-1.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">{label}</span>
                <span className="font-mono text-xs font-bold" style={{ color }}>{value}%</span>
              </div>
              <div className="score-bar">
                <div className="score-bar-fill" style={{
                  width: `${value}%`,
                  background: color,
                  boxShadow: `0 0 8px ${glow}`,
                }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[9px] text-white/20 leading-relaxed">
          Healthy: ~45% Red / ~45% Blue / ~10% Draw. Heavy skew indicates systemic bias.
        </p>
      </motion.div>

      {/* ── Position Bias Trend ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border border-white/6 rounded-sm p-6"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      >
        <h2 className="font-cinzel text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-1">
          📈 Bias Over Time
        </h2>
        <p className="font-mono text-[9px] text-white/25 mb-5 uppercase tracking-widest">
          Position and verbosity bias across all battles — lower is better
        </p>
        <PositionBiasChart data={stats.position_bias_trend} />
      </motion.div>

      {/* ── Verbosity Scatter ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border border-white/6 rounded-sm p-6"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      >
        <h2 className="font-cinzel text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-1">
          🔬 Verbosity vs Score Correlation
        </h2>
        <p className="font-mono text-[9px] text-white/25 mb-5 uppercase tracking-widest">
          X: token delta (A−B) · Y: score delta · No correlation = unbiased judge
        </p>
        <VerbosityScatterChart data={stats.verbosity_scatter} />
      </motion.div>

      {/* ── Judge Config ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border rounded-sm p-6"
        style={{ borderColor: 'rgba(255,184,0,0.15)', background: 'rgba(255,184,0,0.04)' }}
      >
        <h2 className="font-cinzel text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
          ⚙ Judge Configuration
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: 'Provider',        value: 'Groq' },
            { label: 'Model',           value: 'llama-3.3-70b' },
            { label: 'Evaluation Runs', value: '2× (swapped)' },
            { label: 'Temperature',     value: '0.1' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-1">{label}</p>
              <p className="font-mono text-sm text-white/70">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[9px] text-white/20 leading-relaxed">
          Bias mitigation: Each battle runs twice with prompt order swapped. Scores are averaged
          to correct for position bias. Verbosity bias is tracked by correlating token counts with score advantages.
        </p>
      </motion.div>
    </div>
  )
}
