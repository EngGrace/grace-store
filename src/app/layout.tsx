import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/CartContext'
import NavBar from './NavBar'

export const metadata: Metadata = {
  title: 'Grace Store',
  description: 'Technology. Simplified.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <NavBar />
          <main className="main-content">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
