'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  color: string
  alpha: number
  life: number
  maxLife: number
  type: 'ember' | 'spark' | 'ash'
}

const COLORS = [
  'rgba(255, 45, 45,',    // crimson
  'rgba(255, 100, 0,',    // orange
  'rgba(255, 184, 0,',    // gold
  'rgba(0, 170, 255,',    // steel
  'rgba(180, 0, 255,',    // plasma
]

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const canvas = canvasEl as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []
    const MAX_PARTICLES = 80

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function spawn(): Particle {
      const type = Math.random() < 0.6 ? 'ember' : Math.random() < 0.5 ? 'spark' : 'ash'
      const side = Math.random()
      let x: number, y: number, vx: number, vy: number

      if (type === 'ember') {
        // Rise from bottom
        x = Math.random() * canvas.width
        y = canvas.height + 10
        vx = (Math.random() - 0.5) * 0.8
        vy = -(Math.random() * 1.2 + 0.4)
      } else if (type === 'spark') {
        // Drift across
        x = Math.random() < 0.5 ? -10 : canvas.width + 10
        y = Math.random() * canvas.height
        vx = x < 0 ? Math.random() * 0.6 + 0.2 : -(Math.random() * 0.6 + 0.2)
        vy = (Math.random() - 0.5) * 0.4
      } else {
        // Ash fall
        x = Math.random() * canvas.width
        y = -10
        vx = (Math.random() - 0.5) * 0.5
        vy = Math.random() * 0.5 + 0.1
      }

      const maxLife = 200 + Math.random() * 300
      return {
        x, y, vx, vy,
        size: type === 'ember' ? Math.random() * 2 + 0.8 : Math.random() * 1.5 + 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0,
        life: 0,
        maxLife,
        type,
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new particles
      while (particles.length < MAX_PARTICLES) {
        particles.push(spawn())
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy

        // Fade in/out
        const progress = p.life / p.maxLife
        p.alpha = progress < 0.2
          ? progress / 0.2
          : progress > 0.8
            ? 1 - (progress - 0.8) / 0.2
            : 1

        // Wobble for embers
        if (p.type === 'ember') {
          p.vx += Math.sin(p.life * 0.05) * 0.01
        }

        // Draw glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, `${p.color} ${p.alpha * 0.3})`)
        gradient.addColorStop(1, `${p.color} 0)`)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color} ${p.alpha * 0.9})`
        ctx.fill()

        // Remove dead
        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.65 }}
    />
  )
}