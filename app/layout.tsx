import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { CustomCursor } from '@/components/CustomCursor'
import { Particles } from '@/components/Particles'

export const metadata: Metadata = {
  title: {
    default: 'PromptBattle — AI Evaluation Arena',
    template: '%s | PromptBattle',
  },
  description:
    'A battle-themed AI prompt evaluation platform. Submit two prompts, let the LLM Tribunal judge them across 5 combat dimensions. Only the strongest prompt survives.',
  keywords: ['AI', 'prompt engineering', 'LLM evaluation', 'prompt battle', 'Groq', 'judge arena'],
  openGraph: {
    title: 'PromptBattle — AI Evaluation Arena',
    description: 'Enter the forge. Pit two prompts against each other. Only the best survives.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className="min-h-screen antialiased"
        style={{
          background: 'var(--bg-void)',
          color: '#f0eeff',
          cursor: 'none',
          userSelect: 'none',
        }}
      >
        <CustomCursor />
        <Particles />
        <Navigation />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  )
}
