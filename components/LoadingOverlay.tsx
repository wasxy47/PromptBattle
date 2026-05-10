'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BATTLE_PHRASES = [
  'Sharpening blades...',
  'Summoning the Tribunal...',
  'Analyzing combat metrics...',
  'Measuring prompt power...',
  'Calculating critical hits...',
  'Running evaluation round 1...',
  'Mirror-testing for bias...',
  'Running evaluation round 2...',
  'Tallying the final verdict...',
]

interface Props {
  nameA?: string
  nameB?: string
}

export function BattleLoadingScreen({ nameA = 'Red Fighter', nameB = 'Blue Fighter' }: Props) {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIdx(i => (i + 1) % BATTLE_PHRASES.length)
    }, 1400)

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 8 + 2, 95))
    }, 400)

    return () => {
      clearInterval(phraseInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(3,2,10,0.97)', backdropFilter: 'blur(20px)' }}
    >
      {/* Background flash lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${20 + i * 30}%`,
            left: 0, right: 0,
            height: 1,
            background: i === 0
              ? 'linear-gradient(90deg, transparent, rgba(255,45,45,0.4), transparent)'
              : i === 1
                ? 'linear-gradient(90deg, transparent, rgba(255,184,0,0.3), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(0,170,255,0.4), transparent)',
          }}
          animate={{ opacity: [0, 1, 0], scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}

      {/* VS Fighters */}
      <div className="flex items-center gap-8 mb-10">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border border-red-500/40 rounded-sm flex items-center justify-center mb-2"
            style={{ background: 'rgba(255,45,45,0.1)' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 24 L24 4" stroke="#ff2d2d" strokeWidth="3" strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px #ff2d2d)' }} />
              <line x1="8" y1="20" x2="20" y2="8" stroke="#ff2d2d" strokeWidth="2"
                transform="rotate(90 14 14)" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-cinzel text-sm font-bold text-red-400 uppercase tracking-widest max-w-[100px] truncate">
            {nameA}
          </p>
        </motion.div>

        {/* Center crossed swords */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative"
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M10 50 L50 10" stroke="#ffb800" strokeWidth="3" strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 8px #ffb800)' }} />
            <path d="M50 50 L10 10" stroke="#ff2d2d" strokeWidth="3" strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 8px #ff2d2d)' }} />
            <circle cx="30" cy="30" r="6" fill="rgba(0,0,0,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            {/* Sparks */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.circle
                key={i}
                cx={30 + Math.cos((angle * Math.PI) / 180) * 12}
                cy={30 + Math.sin((angle * Math.PI) / 180) * 12}
                r="1.5"
                fill="#ffb800"
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                transition={{ duration: 0.8, delay: i * 0.13, repeat: Infinity }}
              />
            ))}
          </svg>
        </motion.div>

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border border-blue-500/40 rounded-sm flex items-center justify-center mb-2"
            style={{ background: 'rgba(0,170,255,0.1)' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 24 L24 4" stroke="#00aaff" strokeWidth="3" strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px #00aaff)' }} />
              <line x1="8" y1="20" x2="20" y2="8" stroke="#00aaff" strokeWidth="2"
                transform="rotate(90 14 14)" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-cinzel text-sm font-bold text-blue-400 uppercase tracking-widest max-w-[100px] truncate">
            {nameB}
          </p>
        </motion.div>
      </div>

      {/* Title */}
      <motion.h2
        className="font-cinzel font-black text-3xl uppercase tracking-widest text-white mb-2"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ textShadow: '0 0 30px rgba(255,184,0,0.5)' }}
      >
        TRIBUNAL JUDGING...
      </motion.h2>

      {/* Rotating phrase */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phraseIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="font-mono text-xs uppercase tracking-[0.3em] mb-8"
          style={{ color: 'rgba(255,184,0,0.7)' }}
        >
          {BATTLE_PHRASES[phraseIdx]}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="loading-bar">
        <motion.div
          className="loading-bar-fill"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <p className="font-mono text-[10px] mt-2 tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {Math.round(progress)}% complete
      </p>
    </motion.div>
  )
}

// Keep old export name for compat
export { BattleLoadingScreen as LoadingOverlay }
