import React, { FC, ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getClient } from './_actions/getUser'
import { redirect } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { DirectionProvider } from './components/direction-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Learning Platform',
  description: 'Modern e-learning platform for students',
  generator: 'v0.dev',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getClient()
  if (!user) {
    redirect('/login')
    return null
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <DirectionProvider>{children}</DirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'
