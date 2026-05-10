'use client'

import { motion } from 'framer-motion'
import { Brain, Code, Network, Scale, Shield, Trophy } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

/* Mock power curve data for the battle graph */
const GRAPH_DATA = [
  { round: 'R0', red: 0,  blue: 0  },
  { round: 'R1', red: 42, blue: 38 },
  { round: 'R2', red: 58, blue: 61 },
  { round: 'R3', red: 71, blue: 65 },
  { round: 'R4', red: 66, blue: 74 },
  { round: 'R5', red: 80, blue: 72 },
  { round: 'R6', red: 75, blue: 79 },
  { round: 'R7', red: 88, blue: 82 },
  { round: 'R8', red: 84, blue: 91 },
  { round: 'R9', red: 92, blue: 86 },
]

const NODES = [
  { icon: Code,   label: 'User Input',    desc: 'Prompt Injection',    delay: 0,   glow: 'rgba(255,255,255,0.3)' },
  { icon: Brain,  label: 'Preprocessing', desc: 'Context Merge',       delay: 0.3, glow: 'rgba(255,184,0,0.5)'   },
  { icon: Shield, label: 'Safety Check',  desc: 'Bias & Content',      delay: 0.6, glow: 'rgba(0,170,255,0.5)'   },
  { icon: Scale,  label: 'Judge LLM',     desc: 'Llama 3 Evaluator',   delay: 0.9, glow: 'rgba(255,45,45,0.5)'   },
  { icon: Trophy, label: 'Verdict',       desc: 'Winner Declared',     delay: 1.2, glow: 'rgba(255,184,0,0.9)'   },
]

export function FlowGraph() {
  return (
    <section className="relative z-10 w-full px-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* ── BATTLE POWER GRAPH ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 border border-white/10 rounded-sm"
              style={{ background: 'rgba(255,255,255,0.03)', fontFamily: 'Orbitron, sans-serif' }}>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Live Score Simulation</span>
            </div>
            <h3 className="font-cinzel text-2xl font-black uppercase tracking-widest text-white mb-1">
              Battle{' '}
              <span style={{ color: 'var(--gold)', textShadow: '0 0 20px rgba(255,184,0,0.5)' }}>Power Curve</span>
            </h3>
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest">
              Score momentum across evaluation rounds
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative border border-white/8 rounded-sm p-6 overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
          >
            {/* Glow accents */}
            <div className="absolute left-0 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(255,45,45,0.5), transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(0,170,255,0.5), transparent)' }} />

            {/* Fighter legend */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 rounded-full" style={{ background: 'var(--crimson)', boxShadow: '0 0 8px var(--crimson)' }} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-red-400">Red Fighter</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                Score Power · 0-100
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-blue-400">Blue Fighter</span>
                <div className="w-8 h-1 rounded-full" style={{ background: 'var(--steel)', boxShadow: '0 0 8px var(--steel)' }} />
              </div>
            </div>

            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GRAPH_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ff2d2d" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff2d2d" stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#00aaff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00aaff" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="round"
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(3,2,10,0.97)',
                      border: '1px solid rgba(255,184,0,0.3)',
                      borderRadius: 4,
                      fontFamily: 'JetBrains Mono',
                      fontSize: 11,
                      boxShadow: '0 0 20px rgba(255,184,0,0.15)',
                    }}
                    labelStyle={{ color: '#ffb800', fontFamily: 'Cinzel', fontSize: 12, letterSpacing: '0.1em' }}
                    itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="red"
                    name="Red Fighter"
                    stroke="#ff2d2d"
                    strokeWidth={2.5}
                    fill="url(#redGrad)"
                    dot={{ r: 4, fill: '#ff2d2d', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#ff4444', strokeWidth: 0, style: { filter: 'drop-shadow(0 0 6px #ff2d2d)' } }}
                  />
                  <Area
                    type="monotone"
                    dataKey="blue"
                    name="Blue Fighter"
                    stroke="#00aaff"
                    strokeWidth={2.5}
                    fill="url(#blueGrad)"
                    dot={{ r: 4, fill: '#00aaff', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#33bbff', strokeWidth: 0, style: { filter: 'drop-shadow(0 0 6px #00aaff)' } }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom scanline */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,184,0,0.3), transparent)' }} />
          </motion.div>
        </div>

        {/* ── SYSTEM ARCHITECTURE FLOW ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="font-cinzel text-2xl font-black uppercase tracking-widest text-white mb-1 flex items-center justify-center gap-3">
              <Network className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <span>System <span style={{ color: 'var(--gold)', textShadow: '0 0 20px rgba(255,184,0,0.5)' }}>Architecture</span></span>
            </h3>
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest">How every battle is evaluated</p>
          </motion.div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            {/* Connecting line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute hidden md:block top-1/2 left-[10%] right-[10%] h-px origin-left"
              style={{
                background: 'linear-gradient(90deg, rgba(255,45,45,0.3), rgba(255,184,0,0.6), rgba(0,170,255,0.3))',
                boxShadow: '0 0 8px rgba(255,184,0,0.3)',
              }}
            />

            {NODES.map(({ icon: Icon, label, desc, delay, glow }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay, type: 'spring', stiffness: 180, damping: 20 }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="relative z-10 flex flex-col items-center gap-3 my-4 md:my-0"
              >
                <div
                  className="relative w-16 h-16 border border-white/10 rounded-sm flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.8)', boxShadow: `0 0 24px ${glow}, inset 0 0 12px ${glow}20` }}
                >
                  <Icon className="w-7 h-7 text-white/80" />
                  {/* Rotating border */}
                  <motion.div
                    className="absolute -inset-1.5 border border-dashed rounded-sm pointer-events-none opacity-40"
                    style={{ borderColor: glow }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <div className="text-center px-2 py-1.5 border border-white/6 rounded-sm"
                  style={{ background: 'rgba(0,0,0,0.7)' }}>
                  <p className="font-cinzel text-xs font-bold text-white uppercase tracking-widest">{label}</p>
                  <p className="font-mono text-[9px] text-white/40 tracking-widest mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
