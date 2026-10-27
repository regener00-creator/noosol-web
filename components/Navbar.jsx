'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/site';

const nav = [
  ['หน้าแรก', 'home'],
  ['การผลิต', 'services'],
  ['ผลงาน', 'portfolio'],
  ['รุ่นในสต็อก', 'products'],
  ['คำถามที่พบบ่อย', 'qa'],
  ['ติดต่อ', 'contact'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const linkRefs = useRef({});

  // scroll spy — ดูว่า section ไหนอยู่บนจอ แล้วเลื่อนเม็ดยาไปที่เมนูนั้น
  useEffect(() => {
    const sections = nav
      .map(([, id]) => document.getElementById(id))
      .filter(Boolean);

    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 3;
      let current = 'home';
      for (const sec of sections) {
        if (sec.offsetTop <= mid) current = sec.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ขยับเม็ดยาไปตำแหน่งเมนูที่ active
  useEffect(() => {
    const move = () => {
      const el = linkRefs.current[active];
      if (el) {
        setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
      }
    };
    move();
    window.addEventListener('resize', move);
    return () => window.removeEventListener('resize', move);
  }, [active]);

  return (
    <header className="grain-surface sticky top-0 z-50 bg-soft/65 px-4 py-4 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-4xl items-center justify-between gap-6 rounded-full border border-white/60 bg-white/70 px-5 shadow-[0_12px_35px_rgba(0,0,0,0.10)] backdrop-blur-xl sm:px-7">
        <Link href="#home" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white" aria-hidden>
            <Image
              src="/header-logo.png"
              alt=""
              width={1600}
              height={1600}
              className="absolute h-[86px] w-[86px] max-w-none -translate-x-[21px] -translate-y-[24px]"
              priority
            />
          </span>
          <span className="text-lg font-extrabold tracking-tight">{site.name}</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
          {/* เม็ดยาเลื่อนได้ */}
          <span
            aria-hidden
            className="absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-soft transition-all duration-300 ease-out"
            style={{
              left: pill.left,
              width: pill.width,
              opacity: pill.ready ? 1 : 0,
            }}
          />
          {nav.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              ref={(el) => (linkRefs.current[id] = el)}
              className={`relative z-10 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                active === id ? 'text-ink' : 'text-neutral-500 hover:text-ink'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href={site.lineHref}
          target="_blank"
          rel="noreferrer"
          className="relative z-10 hidden rounded-full bg-[#06C755] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#05b64d] md:block"
        >
          LINE
        </a>

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
        <nav className="mx-auto mt-2 max-w-4xl rounded-3xl border border-white/60 bg-white/85 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.10)] backdrop-blur-xl md:hidden">
          {nav.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-3 py-3 text-base font-semibold ${
                active === id ? 'bg-soft' : 'hover:bg-soft'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href={site.lineHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block rounded-xl bg-[#06C755] px-3 py-3 text-center text-base font-bold text-white"
          >
            LINE
          </a>
        </nav>
      )}
    </header>
  );
}
