import DeferredAIChatStylist from '@/components/DeferredAIChatStylist'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { Inter, Playfair_Display } from 'next/font/google'
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

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#080808] text-white">
        <div id="app-shell" className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <DeferredAIChatStylist />
          <Footer />
        </div>
      </body>
    </html>
  )
}
