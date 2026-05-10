'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, RefreshCw, ChevronDown, ChevronUp, Info, Target, Zap } from 'lucide-react'
import { VerdictBanner } from '@/components/VerdictBanner'
import { BattleLoadingScreen } from '@/components/LoadingOverlay'
import { FlowGraph } from '@/components/FlowGraph'
import { readApiResponse } from '@/lib/api'
import type { BattleResult, PromptInput } from '@/types'

const EMPTY: PromptInput = { name: '', version: '1.0', category: 'general', task_context: '', content: '' }

export default function ArenaPage() {
  const [promptA, setPromptA] = useState<PromptInput>({ ...EMPTY })
  const [promptB, setPromptB] = useState<PromptInput>({ ...EMPTY })
  const [sharedCtx, setSharedCtx] = useState(true)
  const [globalCtx, setGlobalCtx] = useState('')
  const [showCtx, setShowCtx] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BattleResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [flashActive, setFlashActive] = useState(false)

  const validate = () => {
    if (!promptA.name.trim()) return 'Red Fighter needs a name'
    if (!promptB.name.trim()) return 'Blue Fighter needs a name'
    if (promptA.content.trim().length < 20) return 'Red Prompt is too short (min 20 chars)'
    if (promptB.content.trim().length < 20) return 'Blue Prompt is too short (min 20 chars)'
    if (sharedCtx && !globalCtx.trim()) return 'Add a Battle Context or disable shared context'
    if (!sharedCtx && !promptA.task_context.trim()) return 'Red Fighter needs a Task Context'
    if (!sharedCtx && !promptB.task_context.trim()) return 'Blue Fighter needs a Task Context'
    return null
  }

  const runBattle = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError(null); setResult(null); setLoading(true)
    setFlashActive(true)
    setTimeout(() => setFlashActive(false), 600)

    const finalA = { ...promptA, task_context: sharedCtx ? globalCtx : promptA.task_context }
    const finalB = { ...promptB, task_context: sharedCtx ? globalCtx : promptB.task_context }

    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_a: finalA, prompt_b: finalB }),
      })
      const json = await readApiResponse<BattleResult>(res)
      if (!json.success) throw new Error(json.error ?? 'Battle failed')
      if (!json.data) throw new Error('No result data returned')
      setTimeout(() => setResult(json.data), 1500)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setTimeout(() => setLoading(false), 1500)
    }
  }

  const reset = () => {
    setResult(null); setError(null)
    setPromptA({ ...EMPTY }); setPromptB({ ...EMPTY }); setGlobalCtx('')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-void)' }}>

      {/* Flash overlay on battle start */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ background: 'linear-gradient(135deg, rgba(255,45,45,0.4), rgba(255,184,0,0.3), rgba(0,170,255,0.4))' }}
          />
        )}
      </AnimatePresence>

      {/* Loading Screen */}
      <AnimatePresence>
        {loading && <BattleLoadingScreen nameA={promptA.name} nameB={promptB.name} />}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative z-10 w-full min-h-[55vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">

        {/* Atmospheric glow orbs */}
        <div className="absolute left-[15%] top-[20%] w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,45,45,0.5) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute right-[15%] bottom-[10%] w-72 h-72 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,170,255,0.5) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 border border-[rgba(255,184,0,0.3)] rounded-sm"
            style={{ background: 'rgba(255,184,0,0.06)', fontFamily: 'Orbitron, sans-serif' }}
          >
            <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-300/80">
              AI Prompt Evaluation Arena · Season I
            </span>
            <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
          </motion.div>

          {/* Main Title */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-cinzel font-black uppercase leading-none tracking-wider"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
            >
              <span className="block text-white" style={{ textShadow: '0 0 40px rgba(255,255,255,0.15)' }}>
                PROMPT
              </span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #ff2d2d 0%, #ff6b00 30%, #ffb800 60%, #ff2d2d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(255,45,45,0.5))',
                  backgroundSize: '300% 100%',
                  animation: 'borderFlow 4s ease infinite',
                }}
              >
                BATTLE
              </span>
            </motion.h1>

            {/* Slash decoration */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mx-auto mt-2 h-[3px] max-w-2xl origin-left"
              style={{ background: 'linear-gradient(90deg, transparent, #ff2d2d, #ffb800, #00aaff, transparent)' }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 max-w-xl mx-auto text-base uppercase tracking-widest font-semibold"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.25em' }}
          >
            Enter the forge · Pit two prompts against each other
            <br />
            <span style={{ color: 'rgba(255,184,0,0.7)' }}>Let the AI Tribunal declare the victor</span>
          </motion.p>

          {/* Fight icon row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex justify-center items-center gap-6"
          >
            {[
              { icon: '⚡', label: 'Clarity' },
              { icon: '🎯', label: 'Specificity' },
              { icon: '🛡️', label: 'Bias Safety' },
              { icon: '🧠', label: 'Output Quality' },
              { icon: '⚔️', label: 'Hallucination' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                <span className="text-xl">{stat.icon}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/50">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── BATTLE CONTEXT ── */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 mb-12">
        <div className="battle-panel battle-panel-gold" style={{ color: 'var(--gold)' }}>
          <button
            onClick={() => setShowCtx(!showCtx)}
            className="w-full flex items-center justify-between p-5 group"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5" style={{ color: 'var(--gold)' }} />
              <div className="text-left">
                <p className="font-cinzel text-base font-bold uppercase tracking-wider text-white">
                  Battle Context
                  <span className="ml-2 text-[9px] font-mono tracking-widest px-2 py-0.5 border border-yellow-500/30 rounded-sm text-yellow-400/70">OPTIONAL</span>
                </p>
                <p className="text-xs font-mono text-white/30 mt-0.5">Define the shared task for fair evaluation</p>
              </div>
            </div>
            {showCtx ? <ChevronUp className="text-white/30 w-4 h-4" /> : <ChevronDown className="text-white/30 w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showCtx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[rgba(255,184,0,0.15)]"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3 p-3 border border-blue-400/15 rounded-sm bg-blue-400/5">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-mono text-blue-200/70 leading-relaxed">
                      If both prompts attempt the same task, define it here so the judge evaluates them equally.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 w-fit">
                    <input
                      type="checkbox"
                      checked={sharedCtx}
                      onChange={e => setSharedCtx(e.target.checked)}
                      className="w-4 h-4 accent-yellow-400"
                    />
                    <span className="font-mono text-xs text-white/60 uppercase tracking-widest">
                      Use shared context for both fighters
                    </span>
                  </label>

                  {sharedCtx && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <label className="block font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>
                        Shared Battle Context
                      </label>
                      <textarea
                        rows={3}
                        value={globalCtx}
                        onChange={e => setGlobalCtx(e.target.value)}
                        placeholder="e.g. Act as a senior developer reviewing a pull request..."
                        className="arena-input arena-input-crimson"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── ARENA ── */}
      <section className="relative z-10 w-full mb-24 px-4">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              {/* Fighter Cards Grid */}
              <div className="w-full max-w-[92rem] mx-auto grid lg:grid-cols-[1fr_120px_1fr] gap-6 items-start">

                {/* ── RED CORNER ── */}
                <FighterInputPanel
                  side="A"
                  prompt={promptA}
                  onChange={setPromptA}
                  showContext={!sharedCtx}
                />

                {/* ── VS CENTER ── */}
                <div className="vs-divider hidden lg:flex flex-col items-center justify-center self-stretch py-24">
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                      filter: [
                        'drop-shadow(0 0 12px rgba(255,184,0,0.4))',
                        'drop-shadow(0 0 30px rgba(255,184,0,0.8))',
                        'drop-shadow(0 0 12px rgba(255,184,0,0.4))',
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative z-10 flex items-center justify-center"
                    style={{ width: 80, height: 80 }}
                  >
                    <div className="absolute inset-0 rounded-full border border-yellow-500/30 bg-black" />
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="relative z-10">
                      {/* Two crossed swords */}
                      <path d="M8 32 L32 8" stroke="#ffb800" strokeWidth="2.5" strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 4px #ffb800)' }} />
                      <path d="M32 32 L8 8" stroke="#ff2d2d" strokeWidth="2.5" strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 4px #ff2d2d)' }} />
                      <circle cx="20" cy="20" r="4" fill="rgba(0,0,0,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    </svg>
                    <span
                      className="absolute font-cinzel font-black text-xs"
                      style={{ color: '#ffb800', textShadow: '0 0 8px #ffb800' }}
                    >VS</span>
                  </motion.div>
                </div>

                {/* ── BLUE CORNER ── */}
                <FighterInputPanel
                  side="B"
                  prompt={promptB}
                  onChange={setPromptB}
                  showContext={!sharedCtx}
                />
              </div>

              {/* Error + Battle Button */}
              <div className="mt-12 flex flex-col items-center gap-4">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-6 py-3 border border-red-500/40 rounded-sm text-red-300 font-mono text-xs tracking-widest uppercase"
                      style={{ background: 'rgba(255,45,45,0.08)' }}
                    >
                      ⚠ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button onClick={runBattle} className="btn-battle">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M3 19 L19 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M19 19 L3 3" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  INITIATE BATTLE
                  <Swords className="w-5 h-5" />
                </button>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
                  2 evaluation runs · unbiased tribunal · do or die
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl mx-auto space-y-8"
            >
              {/* Reset button */}
              <div className="flex justify-center">
                <button onClick={reset} className="btn-reset">
                  <RefreshCw className="w-3 h-3" />
                  New Duel
                </button>
              </div>

              <VerdictBanner result={result} nameA={promptA.name} nameB={promptB.name} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── FLOW GRAPH (bottom) ── */}
      <FlowGraph />
    </div>
  )
}

/* ────────────────────────────────────────
   FIGHTER INPUT PANEL COMPONENT
──────────────────────────────────────── */
interface FighterInputPanelProps {
  side: 'A' | 'B'
  prompt: PromptInput
  onChange: (p: PromptInput) => void
  showContext: boolean
}

function FighterInputPanel({ side, prompt, onChange, showContext }: FighterInputPanelProps) {
  const isA = side === 'A'
  const color     = isA ? 'var(--crimson)'      : 'var(--steel)'
  const colorDim  = isA ? 'rgba(255,45,45,0.15)' : 'rgba(0,170,255,0.15)'
  const border    = isA ? 'var(--border-crimson)': 'var(--border-steel)'
  const inputFocus= isA ? 'arena-input-crimson'  : 'arena-input-steel'
  const label     = isA ? 'RED FIGHTER'          : 'BLUE FIGHTER'
  const corner    = isA ? '← CHALLENGER'         : 'CHALLENGER →'

  return (
    <motion.div
      initial={{ opacity: 0, x: isA ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="battle-panel flex flex-col h-full"
      style={{
        borderColor: border,
        background: `linear-gradient(135deg, ${colorDim} 0%, rgba(3,2,10,0.92) 40%, rgba(0,0,0,0.96) 100%)`,
        color,
      }}
    >
      {/* Header */}
      <div className="p-5 border-b flex items-center justify-between"
        style={{ borderColor: `${color}22`, background: `${colorDim}` }}>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.35em] mb-1" style={{ color: `${color}99` }}>
            {corner}
          </p>
          <h2 className="font-cinzel text-xl font-black uppercase tracking-wider" style={{ color, textShadow: `0 0 20px ${color}` }}>
            {label}
          </h2>
        </div>
        <div className="w-10 h-10 border rounded-sm flex items-center justify-center"
          style={{ borderColor: `${color}40`, background: `${color}10` }}>
          <Swords className="w-5 h-5" style={{ color }} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Name */}
        <div className="space-y-1.5">
          <label className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color }}>
            ⚔ Fighter Name
          </label>
          <input
            type="text"
            value={prompt.name}
            onChange={e => onChange({ ...prompt, name: e.target.value })}
            placeholder={isA ? 'e.g. Code Slayer v2' : 'e.g. Precision Bot X'}
            className={`arena-input ${inputFocus}`}
            style={{ borderRadius: 3 }}
          />
        </div>

        {/* Context (only if not shared) */}
        {showContext && (
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color }}>
              🎯 Task Context
            </label>
            <textarea
              rows={2}
              value={prompt.task_context}
              onChange={e => onChange({ ...prompt, task_context: e.target.value })}
              placeholder="Define the task goal..."
              className={`arena-input ${inputFocus}`}
              style={{ borderRadius: 3 }}
            />
          </div>
        )}

        {/* Prompt */}
        <div className="space-y-1.5 flex-1 flex flex-col">
          <label className="font-mono text-[9px] uppercase tracking-[0.25em] flex justify-between" style={{ color }}>
            <span>📜 The Prompt</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>{prompt.content.length} chars</span>
          </label>
          <textarea
            rows={12}
            value={prompt.content}
            onChange={e => onChange({ ...prompt, content: e.target.value })}
            placeholder={`Write your ${isA ? 'red' : 'blue'} fighter's full prompt here...`}
            className={`arena-input ${inputFocus} flex-1 min-h-[280px]`}
            style={{ borderRadius: 3 }}
          />
        </div>

        {/* Char HP bar */}
        <div>
          <div className="energy-bar">
            <div
              className="energy-bar-fill"
              style={{
                width: `${Math.min((prompt.content.length / 2000) * 100, 100)}%`,
                background: `linear-gradient(90deg, ${color}, ${isA ? '#ffb800' : '#00ffaa'})`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: `${color}60` }}>
              Prompt Strength
            </span>
            <span className="font-mono text-[8px]" style={{ color: `${color}60` }}>
              {Math.min(Math.round((prompt.content.length / 2000) * 100), 100)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
