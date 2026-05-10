'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Activity, BookOpen, Swords, Trophy } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',             label: 'Arena',    icon: Swords,   sublabel: 'FIGHT' },
  { href: '/leaderboard', label: 'Rankings',  icon: Trophy,   sublabel: 'GLORY' },
  { href: '/prompts',     label: 'Scrolls',   icon: BookOpen, sublabel: 'LORE'  },
  { href: '/calibration', label: 'Tribunal',  icon: Activity, sublabel: 'JUDGE' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="nav-glass sticky top-0 z-[60] transition-all duration-300">
      {/* Top energy line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff2d2d] via-[#ffb800] to-transparent opacity-70" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -15, 10, 0], scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative flex h-10 w-10 items-center justify-center"
          >
            <div className="absolute inset-0 rounded-sm border border-[rgba(255,184,0,0.3)] bg-gradient-to-br from-[rgba(255,45,45,0.15)] to-[rgba(0,0,0,0.8)]" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative z-10">
              <path d="M4 20 L20 4" stroke="#ffb800" strokeWidth="2.5" strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px #ffb800)' }} />
              <path d="M8 16 L16 8" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
              <line x1="8" y1="16" x2="16" y2="8" stroke="#ff2d2d" strokeWidth="2"
                transform="rotate(90 12 12)" strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 3px #ff2d2d)' }} />
              <circle cx="20" cy="4" r="2" fill="#ffd700"
                style={{ filter: 'drop-shadow(0 0 4px #ffd700)' }} />
            </svg>
          </motion.div>

          <div className="leading-none hidden sm:block">
            <span className="block font-cinzel text-base font-black uppercase tracking-widest text-white">
              Prompt
              <span style={{ color: '#ffb800', textShadow: '0 0 12px rgba(255,184,0,0.6)' }}>Battle</span>
            </span>
            <span className="block font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase">
              AI Evaluation Arena
            </span>
          </div>
        </Link>

        {/* Nav Items */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, sublabel }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`nav-item${active ? ' active' : ''}`}
              >
                <Icon className="h-3 w-3 flex-shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 border border-emerald-400/20 bg-emerald-400/6 px-3 py-1.5 rounded-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-300/80">
            Judge Online
          </span>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,184,0,0.2)] to-transparent" />
    </header>
  )
}
