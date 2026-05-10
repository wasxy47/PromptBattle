'use client'

import { Github, Mail } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-[60] mt-auto border-t border-[rgba(255,184,0,0.1)] bg-black/40 backdrop-blur-md py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        
        {/* Creator Name */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-white/40">
            Forged by
          </span>
          <span className="font-cinzel text-sm font-bold tracking-widest" style={{ color: '#ffb800' }}>
            Abdul Wasay
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="https://github.com/wasxy47/PromptBattle"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-white/40 transition-colors hover:text-white"
          >
            <Github className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="font-mono text-xs uppercase tracking-wider">GitHub</span>
          </Link>
          
          <Link
            href="mailto:abdulwasay2019kk@gmail.com"
            className="group flex items-center gap-2 text-white/40 transition-colors hover:text-[#ff2d2d]"
          >
            <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="font-mono text-xs uppercase tracking-wider">Contact</span>
          </Link>
        </div>

      </div>
    </footer>
  )
}
