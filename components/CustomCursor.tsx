'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const cursorX = useMotionValue(-200)
  const cursorY = useMotionValue(-200)

  const springCfg = { damping: 22, stiffness: 350, mass: 0.08 }
  const smoothX = useSpring(cursorX, springCfg)
  const smoothY = useSpring(cursorY, springCfg)

  const trailX = useMotionValue(-200)
  const trailY = useMotionValue(-200)
  const trailSpring = { damping: 40, stiffness: 200, mass: 0.2 }
  const smoothTrailX = useSpring(trailX, trailSpring)
  const smoothTrailY = useSpring(trailY, trailSpring)

  const [isHover, setIsHover] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const [slashActive, setSlashActive] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const hoverable = t.tagName === 'BUTTON' || t.tagName === 'A' || t.tagName === 'INPUT' ||
        t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' ||
        t.closest('button') || t.closest('a') || t.closest('[role="button"]')
      setIsHover(!!hoverable)
    }

    const onDown = () => {
      setIsClick(true)
      setSlashActive(true)
      setTimeout(() => setSlashActive(false), 500)
    }
    const onUp = () => setIsClick(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [cursorX, cursorY, trailX, trailY])

  return (
    <>
      {/* Energy trail */}
      <motion.div
        className="pointer-events-none fixed z-[9990] rounded-full"
        style={{
          x: smoothTrailX,
          y: smoothTrailY,
          translateX: '-50%',
          translateY: '-50%',
          width: 40,
          height: 40,
          background: isHover
            ? 'radial-gradient(circle, rgba(255,184,0,0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,45,45,0.2) 0%, transparent 70%)',
        }}
      />

      {/* Sword cursor SVG */}
      <motion.div
        className="pointer-events-none fixed z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-4px',
          translateY: '-4px',
        }}
        animate={{
          rotate: isClick ? [0, -30, 15, 0] : 0,
          scale: isClick ? [1, 1.3, 0.9, 1] : isHover ? 1.15 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: isHover ? 'drop-shadow(0 0 6px #ffb800)' : 'drop-shadow(0 0 4px rgba(255,45,45,0.8))' }}
        >
          {/* Blade */}
          <path
            d="M6 26 L26 4"
            stroke={isHover ? '#ffb800' : '#ffffff'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Blade glow */}
          <path
            d="M6 26 L26 4"
            stroke={isHover ? 'rgba(255,184,0,0.4)' : 'rgba(255,45,45,0.5)'}
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Guard (cross) */}
          <line
            x1="10" y1="22"
            x2="22" y2="10"
            stroke={isHover ? '#ffb800' : '#ff2d2d'}
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(90, 16, 16)"
          />
          {/* Blade edge highlight */}
          <path
            d="M7 25 L25 5"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          {/* Tip flash */}
          <circle cx="26" cy="4" r={isClick ? 4 : 2} fill={isHover ? '#ffd700' : '#ff4444'}
            opacity={isClick ? 1 : 0.8}
          />
        </svg>

        {/* Slash effect */}
        {slashActive && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0, rotate: -30 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1.5], x: [0, 60] }}
            transition={{ duration: 0.4 }}
            className="absolute top-1/2 left-1/2 origin-left h-0.5 w-16 rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.9), transparent)',
              boxShadow: '0 0 8px rgba(255,200,100,0.8)',
              translateY: '-50%',
            }}
          />
        )}
      </motion.div>
    </>
  )
}