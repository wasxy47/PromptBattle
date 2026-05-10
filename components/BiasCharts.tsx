'use client'

import {
  CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Scatter, ScatterChart,
  Tooltip, XAxis, YAxis, ZAxis,
} from 'recharts'
import type { BiasDataPoint, VerbosityDataPoint } from '@/types'

const TOOLTIP_STYLE = {
  background: 'rgba(3,2,10,0.97)',
  border: '1px solid rgba(255,184,0,0.25)',
  borderRadius: 4,
  fontFamily: 'JetBrains Mono',
  fontSize: 11,
  boxShadow: '0 0 20px rgba(0,0,0,0.5)',
}

const AXIS_TICK = { fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' }
const AXIS_LINE = { stroke: 'rgba(255,255,255,0.08)' }
const GRID     = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.05)' }

const EmptyChart = ({ msg }: { msg: string }) => (
  <div className="flex h-48 items-center justify-center font-mono text-xs uppercase tracking-widest"
    style={{ color: 'rgba(255,255,255,0.2)' }}>
    {msg}
  </div>
)

/* ── Position Bias Line Chart ── */
interface PositionBiasChartProps { data: BiasDataPoint[] }

export function PositionBiasChart({ data }: PositionBiasChartProps) {
  if (data.length === 0) {
    return <EmptyChart msg="No data yet — run battles to see bias trends" />
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey="date" tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: '#ffb800' }}
            itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
          />
          <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
          <Line
            type="monotone"
            dataKey="position_bias_delta"
            name="Position Bias Delta"
            stroke="#ffb800"
            strokeWidth={2}
            dot={{ r: 3, fill: '#ffb800', strokeWidth: 0 }}
            activeDot={{ r: 5, style: { filter: 'drop-shadow(0 0 4px #ffb800)' } }}
          />
          <Line
            type="monotone"
            dataKey="verbosity_bias_score"
            name="Verbosity Bias"
            stroke="#00aaff"
            strokeWidth={2}
            dot={{ r: 3, fill: '#00aaff', strokeWidth: 0 }}
            activeDot={{ r: 5, style: { filter: 'drop-shadow(0 0 4px #00aaff)' } }}
            strokeDasharray="5 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ── Verbosity Scatter Chart ── */
interface VerbosityScatterProps { data: VerbosityDataPoint[] }

export function VerbosityScatterChart({ data }: VerbosityScatterProps) {
  if (data.length === 0) {
    return <EmptyChart msg="No data yet — run battles to see verbosity patterns" />
  }

  const scatterData = data.map(d => ({
    x: d.token_count_a - d.token_count_b,
    y: d.score_a - d.score_b,
    winner: d.winner,
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid {...GRID} />
          <XAxis
            dataKey="x"
            name="Token Delta (A−B)"
            tick={AXIS_TICK}
            axisLine={AXIS_LINE}
            tickLine={false}
            label={{ value: 'Token Count Difference (A−B)', position: 'insideBottom', offset: -2, fill: 'rgba(255,255,255,0.2)', fontSize: 9 }}
          />
          <YAxis
            dataKey="y"
            name="Score Delta (A−B)"
            tick={AXIS_TICK}
            axisLine={AXIS_LINE}
            tickLine={false}
            label={{ value: 'Score Diff', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.2)', fontSize: 9 }}
          />
          <ZAxis range={[40, 40]} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
            itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
          />
          <Scatter data={scatterData} fill="#ff2d2d" fillOpacity={0.65}
            style={{ filter: 'drop-shadow(0 0 3px rgba(255,45,45,0.5))' }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
