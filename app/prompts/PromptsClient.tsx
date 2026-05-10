'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, BookOpen, Swords } from 'lucide-react'
import { PromptCard } from '@/components/PromptCard'
import { readApiResponse } from '@/lib/api'
import { cn, getCategoryColor } from '@/lib/utils'
import type { Prompt, PromptInput, PromptCategory } from '@/types'

const CATEGORIES: Array<PromptCategory | 'all'> = [
  'all','reasoning','creative','coding','analysis',
  'instruction','extraction','summarization','debate','general',
]

const EMPTY: PromptInput = { name: '', version: '1.0', category: 'general', task_context: '', content: '' }

export function PromptsClient() {
  const [prompts, setPrompts]   = useState<Prompt[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState<PromptCategory | 'all'>('all')
  const [showAdd, setShowAdd]   = useState(false)
  const [form, setForm]         = useState<PromptInput>({ ...EMPTY })
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const fetchPrompts = useCallback(async () => {
    setLoading(true)
    try {
      const url  = category !== 'all' ? `/api/prompts?category=${category}` : '/api/prompts'
      const res  = await fetch(url)
      const json = await readApiResponse<Prompt[]>(res)
      if (json.success) setPrompts(json.data ?? [])
    } finally { setLoading(false) }
  }, [category])

  useEffect(() => { fetchPrompts() }, [fetchPrompts])

  const filtered = prompts.filter(p =>
    search === '' ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.task_context.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async () => {
    if (!form.name || !form.content || !form.task_context) {
      setError('Name, task context, and content are required')
      return
    }
    setSaving(true); setError(null)
    try {
      const res  = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await readApiResponse<Prompt>(res)
      if (!json.success) throw new Error(json.error ?? 'Failed to save')
      if (!json.data) throw new Error('No data returned')
      setPrompts(prev => [json.data!, ...prev])
      setShowAdd(false); setForm({ ...EMPTY })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">

      {/* ── Controls ── */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
          <input
            className="arena-input arena-input-crimson pl-10"
            placeholder="Search fighters by name or context..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Add button */}
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 border border-yellow-500/40 px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-all hover:bg-yellow-500/10 rounded-sm"
          style={{ color: 'var(--gold)', background: 'rgba(255,184,0,0.05)' }}
        >
          <Plus className="h-3.5 w-3.5" />
          Enlist Fighter
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'border rounded-sm px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-all duration-200',
              category === cat
                ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400 shadow-[0_0_12px_rgba(255,184,0,0.2)]'
                : 'border-white/8 text-white/35 hover:border-white/18 hover:text-white/60'
            )}
          >
            {cat === 'all' ? '⚔ All Classes' : cat}
          </button>
        ))}
      </div>

      {/* ── Add Prompt Modal ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={e => { if (e.target === e.currentTarget) { setShowAdd(false); setError(null) } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              className="w-full max-w-2xl border border-white/10 rounded-sm p-6 space-y-4"
              style={{ background: 'rgba(7,5,16,0.98)', backdropFilter: 'blur(20px)' }}
            >
              {/* Modal header */}
              <div className="flex justify-between items-center border-b border-white/8 pb-4">
                <div>
                  <h2 className="font-cinzel text-xl font-black text-white uppercase tracking-wider">
                    Enlist New Fighter
                  </h2>
                  <p className="font-mono text-[9px] text-white/30 mt-0.5 uppercase tracking-widest">
                    Register a prompt for the arena
                  </p>
                </div>
                <button
                  onClick={() => { setShowAdd(false); setError(null) }}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-sm hover:border-red-500/40 transition-colors"
                >
                  <X className="h-4 w-4 text-white/40" />
                </button>
              </div>

              {error && (
                <div className="border border-red-500/30 rounded-sm px-4 py-2"
                  style={{ background: 'rgba(255,45,45,0.08)' }}>
                  <p className="font-mono text-xs text-red-400">⚠ {error}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-white/35">Fighter Name</label>
                  <input className="arena-input arena-input-crimson"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. The Interrogator" />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-white/35">Version</label>
                  <input className="arena-input arena-input-crimson"
                    value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))}
                    placeholder="1.0" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-white/35">Battle Class</label>
                <select className="arena-input arena-input-crimson"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as PromptCategory }))}
                >
                  {CATEGORIES.filter(c => c !== 'all').map(c => (
                    <option key={c} value={c} style={{ background: '#07051a' }}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-white/35">Task Context</label>
                <textarea className="arena-input arena-input-crimson" rows={2}
                  value={form.task_context}
                  onChange={e => setForm(f => ({ ...f, task_context: e.target.value }))}
                  placeholder="What task is this prompt designed for?" />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-white/35">Prompt Content</label>
                <textarea className="arena-input arena-input-crimson" rows={6}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Your full prompt text here..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleAdd} disabled={saving} className="btn-battle flex-1 py-3 text-sm">
                  <Swords className="w-4 h-4" />
                  {saving ? 'Enlisting...' : 'Enlist Fighter'}
                </button>
                <button onClick={() => { setShowAdd(false); setError(null) }} className="btn-reset flex-1">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Prompt Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 border border-white/6 rounded-sm animate-pulse"
              style={{ background: 'rgba(255,255,255,0.025)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/20">
          <BookOpen className="h-12 w-12 opacity-20" />
          <p className="font-cinzel text-xl uppercase tracking-widest">No Fighters Found</p>
          <p className="font-mono text-xs">
            {search ? `No results for "${search}"` : 'Enlist your first fighter to begin'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
        </div>
      )}
    </div>
  )
}
