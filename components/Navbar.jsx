'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

const nav = [
  ['สินค้า', '/products'],
  ['ตารางราคา', '/pricing'],
  ['ผลงาน', '/portfolio'],
  ['Q&A', '/qa'],
  ['ติดต่อเรา', '/contact'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt={site.name} width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="text-lg font-extrabold tracking-tight">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pathname === href ? 'bg-soft' : 'text-neutral-600 hover:bg-soft hover:text-ink'
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href={site.lineHref}
            target="_blank"
            rel="noreferrer"
            className="ml-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700"
          >
            ทัก LINE
          </a>
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-soft md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="เมนู"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-4 py-3 md:hidden">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-base font-semibold hover:bg-soft"
            >
              {label}
            </Link>
          ))}
          <a
            href={site.lineHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block rounded-xl bg-ink px-3 py-3 text-center text-base font-semibold text-white"
          >
            ทัก LINE {site.lineId}
          </a>
        </nav>
      )}
    </header>
  );
}
