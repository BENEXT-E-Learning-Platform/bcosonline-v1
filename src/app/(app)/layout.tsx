import './styles.css'
import React, { ReactElement, ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): ReactElement {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
