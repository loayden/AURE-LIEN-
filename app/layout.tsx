import AmbientBackdrop from '@/components/AmbientBackdrop'
import Cursor from '@/components/Cursor'
import DeferredAIChatStylist from '@/components/DeferredAIChatStylist'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

export const metadata = {
  title: 'AURÉLIEN — Luxury Menswear & Accessories',
  description: 'Crafted in silence. Designed for presence. Explore refined tailoring, footwear, and accessories for the modern man.',
  openGraph: {
    title: 'AURÉLIEN — Luxury Menswear',
    description: 'Refined silhouettes and timeless design. Shop the collection.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
}

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-jost',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-[#080808] text-white">
        <AmbientBackdrop />
        <Cursor />
        <div id="app-shell" className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1 min-h-[calc(100svh-54px)] sm:min-h-[calc(100svh-58px)]">
            {children}
          </div>
          <DeferredAIChatStylist />
          <Footer />
        </div>
      </body>
    </html>
  )
}
