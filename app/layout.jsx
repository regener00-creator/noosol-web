import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import InitialLoader from '@/components/InitialLoader';
import { site } from '@/lib/site';

export const viewport = {
  width: 1440,
  initialScale: 0.273,
  maximumScale: 5,
  userScalable: true,
};

export const metadata = {
  metadataBase: new URL('https://www.noosol.com'),
  title: {
    default: `${site.name} – ${site.tagline}`,
    template: `%s – ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${site.name} – ${site.tagline}`,
    description: site.description,
    url: '/',
    siteName: site.name,
    locale: 'th_TH',
    type: 'website',
    images: [
      {
        url: '/share-noosol-v2.png',
        width: 1200,
        height: 630,
        alt: 'NOOSOL โรงงานรับผลิตกระเป๋าและถุงผ้าสปันบอนด์',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} – ${site.tagline}`,
    description: site.description,
    images: ['/share-noosol-v2.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400..700&family=Poppins:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <InitialLoader />
        <RevealOnScroll />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
