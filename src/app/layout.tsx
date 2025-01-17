import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

import { cn } from '@/lib/utils'
import Providers from '@/providers/providers'
import Navigation from '@/components/app/navigation'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'My Drinks',
  description: 'Choose your favorite cocktail!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <Providers>
          <div className="flex flex-col items-center">
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                icon: '🍸',
              }}
            />
            <Navigation />
            <main className="grow w-full pt-28 md:pt-40 lg:pt-48 pb-20">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
