'use client'

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip,
} from 'recharts'
import { scoresToRadarData } from '@/lib/utils'
import type { DimensionScores } from '@/types'

interface ScoreRadarChartProps {
  scoresA: DimensionScores
  scoresB: DimensionScores
  nameA?: string
  nameB?: string
}

const TOOLTIP_STYLE = {
  background: 'rgba(3,2,10,0.97)',
  border: '1px solid rgba(255,184,0,0.25)',
  borderRadius: 4,
  fontFamily: 'JetBrains Mono',
  fontSize: 11,
  boxShadow: '0 0 20px rgba(0,0,0,0.5)',
}

export function ScoreRadarChart({ scoresA, scoresB, nameA = 'Red Fighter', nameB = 'Blue Fighter' }: ScoreRadarChartProps) {
  const data = scoresToRadarData(scoresA, scoresB)

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid
            stroke="rgba(255,255,255,0.07)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fill: 'rgba(255,255,255,0.45)',
              fontSize: 10,
              fontFamily: 'JetBrains Mono',
            }}
          />
          <Radar
            name={nameA}
            dataKey="A"
            stroke="#ff2d2d"
            fill="#ff2d2d"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ r: 3, fill: '#ff4444', strokeWidth: 0 }}
          />
          <Radar
            name={nameB}
            dataKey="B"
            stroke="#00aaff"
            fill="#00aaff"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ r: 3, fill: '#33bbff', strokeWidth: 0 }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
            }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: '#ffb800', fontFamily: 'Cinzel', letterSpacing: '0.1em' }}
            itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
