import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { site } from '@/lib/site';

export const metadata = {
  title: {
    default: `${site.name} – ${site.tagline}`,
    template: `%s – ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Navbar />
        <main className="min-h-screen pb-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
