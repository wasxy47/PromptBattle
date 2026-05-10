/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel:    ['Cinzel', 'serif'],
        mono:      ['JetBrains Mono', 'monospace'],
        bebas:     ['Bebas Neue', 'cursive'],
        orbitron:  ['Orbitron', 'sans-serif'],
        rajdhani:  ['Rajdhani', 'sans-serif'],
        sans:      ['Rajdhani', 'sans-serif'],
      },
      colors: {
        background: '#03020a',
        foreground: '#f0eeff',
        // Battle palette
        crimson: {
          DEFAULT: '#ff2d2d',
          dark:    '#c0000a',
          glow:    'rgba(255,45,45,0.6)',
          muted:   '#6b0000',
        },
        steel: {
          DEFAULT: '#00aaff',
          dark:    '#0066cc',
          glow:    'rgba(0,170,255,0.6)',
          muted:   '#003d7a',
          light:   '#33bbff',
        },
        gold: {
          DEFAULT: '#ffb800',
          light:   '#ffd700',
          glow:    'rgba(255,184,0,0.6)',
          muted:   '#664a00',
          dark:    '#3d2c00',
        },
        plasma: {
          DEFAULT: '#bf00ff',
          glow:    'rgba(191,0,255,0.5)',
        },
        forge: {
          DEFAULT: '#1a1728',
          light:   '#24203a',
          dark:    '#0d0a1a',
        },
        obsidian: {
          DEFAULT: '#03020a',
          mid:     '#07051a',
        },
      },
      backgroundImage: {
        'battle-radial':  'radial-gradient(ellipse at center, #0d0a1a 0%, #03020a 70%)',
        'crimson-glow':   'radial-gradient(circle, rgba(255,45,45,0.3) 0%, transparent 70%)',
        'steel-glow':     'radial-gradient(circle, rgba(0,170,255,0.3) 0%, transparent 70%)',
        'gold-glow':      'radial-gradient(circle, rgba(255,184,0,0.4) 0%, transparent 70%)',
        'hero-gradient':  'linear-gradient(180deg, #03020a 0%, #07051a 40%, #03020a 100%)',
      },
      animation: {
        'flicker':       'flicker 3s infinite',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':       'fadeIn 0.5s ease-in-out',
        'slide-up':      'slideUp 0.6s ease-out',
        'float':         'floatY 4s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
        'border-flow':   'borderFlow 4s ease infinite',
        'bar-shimmer':   'barShimmer 2s ease-in-out infinite',
        'glitch':        'glitchBefore 3s infinite',
        'energy-pulse':  'energyPulse 2s ease-in-out infinite',
        'sword-spin':    'spinSword 3s linear infinite',
        'screen-shake':  'screenShake 0.4s ease-out',
        'critical-hit':  'criticalHit 0.5s ease-out',
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.85' },
          '75%':     { opacity: '0.95' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        borderFlow: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        barShimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
        energyPulse: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':     { opacity: '1',   transform: 'scale(1.03)' },
        },
        spinSword: {
          'from': { transform: 'rotate(0deg)' },
          'to':   { transform: 'rotate(360deg)' },
        },
        screenShake: {
          '0%,100%': { transform: 'translate(0,0)' },
          '20%':     { transform: 'translate(-4px,2px)' },
          '40%':     { transform: 'translate(4px,-2px)' },
          '60%':     { transform: 'translate(-2px,4px)' },
          '80%':     { transform: 'translate(2px,-4px)' },
        },
        criticalHit: {
          '0%':   { transform: 'scale(1)' },
          '20%':  { transform: 'scale(1.08) rotate(-1deg)' },
          '40%':  { transform: 'scale(0.96) rotate(1deg)' },
          '60%':  { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'crimson': '0 0 20px rgba(255,45,45,0.5)',
        'steel':   '0 0 20px rgba(0,170,255,0.5)',
        'gold':    '0 0 20px rgba(255,184,0,0.5)',
        'forge':   '0 8px 32px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
}
