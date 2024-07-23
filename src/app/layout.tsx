import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { cn } from '@/lib/utils'
import Providers from '@/providers/providers'
import Navigation from '@/components/app/navigation'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Drinks Shoppinc Cart',
  description: "Let's learn Redux at last",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <Providers>
          <div className="flex flex-col items-center">
            <Navigation />
            <main className="grow w-full">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
