import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Enrique Manterola - Full Stack Developer',
  description: 'Portfolio profesional de Enrique Manterola - Desarrollador Full Stack especializado en React, Next.js, TypeScript y más.',
  keywords: ['Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'Web Development'],
  authors: [{ name: 'Enrique Manterola' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Enrique Manterola - Full Stack Developer',
    description: 'Portfolio profesional de Enrique Manterola',
    siteName: 'Enrique Manterola Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enrique Manterola - Full Stack Developer',
    description: 'Portfolio profesional de Enrique Manterola',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
