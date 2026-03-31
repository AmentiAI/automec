import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/toaster'
import { PostHogProvider } from '@/components/posthog-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Automec — Fitment, Builds & Tuning for Modified Cars',
    template: '%s | Automec',
  },
  description:
    'Check part fitment, track your build, and connect with shops and tuners who know your platform. The all-in-one platform for serious car builders.',
  keywords: ['car fitment', 'build tracker', 'tune request', 'modified cars', 'car parts'],
  openGraph: {
    type: 'website',
    siteName: 'Automec',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <body className="font-sans">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <PostHogProvider>
              {children}
              <Toaster />
            </PostHogProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
