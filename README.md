# NOOSOL website

Current source for https://www.noosol.com, recovered from the local website developed through 29 July 2026 and updated on 27 October 2026.

## Development

Use Node.js and npm. Run `npm ci`, then `npm run dev`. Run `npm run build` for a production build.

Stack: Next.js 14.2.15, React 18, Tailwind CSS 3.

## Source

- `app/page.jsx`: one-page website with services, portfolio, products, colors, FAQ, and contact sections.
- `app/layout.jsx`, `app/globals.css`, `tailwind.config.js`: layout and typography.
- `components/`: InitialLoader, LogoMarquee, ProductExplorer, PortfolioExplorer, and other components.
- `public/`: complete local images and videos.
- `data/`: local product, color, FAQ, and service layout data.
- `app/api/save-layout/route.js`: development-only save endpoint; disabled in production.

Google Sans is the default font. Only the large NOOSOL hero heading uses the original Poppins font.

Deploy to the existing Vercel project `noosol`. Keep credentials, dependencies, caches, and generated build files out of Git.

See HANDOFF.md before continuing work.
