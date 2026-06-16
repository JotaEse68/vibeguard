import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VibeguARD by Jota! — Audit your AI-built app before the internet does',
  description: 'Auditor de seguridad para apps hechas con IA. 22 puntos, stack automático, soluciones concretas y prompts para Claude Code.',
  openGraph: {
    title: 'VibeguARD — Audit your AI-built app before the internet does',
    description: '22 puntos de auditoría. Stack automático. Soluciones con prompts para Claude Code.',
    type: 'website',
    siteName: 'VibeguARD by Jota!'
  },
  twitter: { card: 'summary_large_image', title: 'VibeguARD by Jota!', description: 'Audita tu app antes de lanzarla.' },
  robots: { index: true, follow: true }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
