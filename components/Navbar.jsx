'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/site';

const nav = [
  ['หน้าแรก', 'home'],
  ['การผลิต', 'services'],
  ['ผลงาน', 'portfolio'],
  ['FAQ', 'qa'],
];
const mobileNav = [...nav, ['ติดต่อ', 'contact']];

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const linkRefs = useRef({});
  const mobileIndex = mobileNav.findIndex(([, id]) => id === active);

  // scroll spy — ดูว่า section ไหนอยู่บนจอ แล้วเลื่อนเม็ดยาไปที่เมนูนั้น
  useEffect(() => {
    const sections = [...nav.map(([, id]) => id), 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const onScroll = () => {
      const panel = document.querySelector('.section-deck')?.dataset.active;
      if (panel) {
        setActive(['products', 'scale', 'colors'].includes(panel) ? 'services' : panel);
        return;
      }
      const mid = window.scrollY + window.innerHeight / 3;
      let current = 'home';
      for (const sec of sections) {
        if (sec.offsetTop <= mid) current = sec.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('noosol:section-change', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('noosol:section-change', onScroll);
    };
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
    <header className="grain-surface sticky top-0 z-50 bg-soft/65 px-2 py-2 backdrop-blur-md md:px-4 md:py-4">
      <div className="relative mx-auto hidden h-16 md:flex max-w-4xl items-center justify-between gap-2 rounded-full sm:gap-6 max-[359px]:gap-1 max-[359px]:px-2 border border-white/60 bg-white/70 px-5 shadow-[0_12px_35px_rgba(0,0,0,0.10)] backdrop-blur-xl sm:px-7">
        <Link href="#home" className="flex items-center gap-2.5">
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
            className="absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-[#f58220] transition-all duration-300 ease-out"
            style={{
              left: pill.left,
              width: pill.width,
              opacity: pill.ready && active !== 'contact' ? 1 : 0,
            }}
          />
          {nav.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              ref={(el) => (linkRefs.current[id] = el)}
              aria-current={active === id ? 'location' : undefined}
              className={`relative z-10 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                active === id ? 'text-white' : 'text-neutral-500 hover:text-ink'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          aria-current={active === 'contact' ? 'location' : undefined}
          className={`relative z-10 ml-auto inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 text-sm font-bold text-white transition max-[359px]:px-3 md:ml-0 md:min-h-0 ${
            active === 'contact' ? 'bg-[#f58220]' : 'bg-[#06C755] hover:bg-[#05b64d]'
          }`}
        >
          ติดต่อ
        </a>
      </div>

      <nav
        aria-label="เมนูหลัก"
        className="relative grid grid-cols-5 gap-1 rounded-2xl border border-white/60 bg-white/90 p-1 shadow-sm md:hidden"
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-1">
          <span
            className="absolute left-0 top-0 h-full rounded-xl bg-[#f58220] motion-safe:transition-[width,transform] motion-safe:duration-300 motion-safe:ease-out"
            style={{
              width: 'calc((100% - 1rem) / 5)',
              transform: `translateX(calc(${mobileIndex * 100}% + ${mobileIndex * 0.25}rem))`,
            }}
          />
        </span>
        {mobileNav.map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? 'location' : undefined}
            className={`relative flex min-h-11 items-center justify-center rounded-xl px-1 text-center text-sm font-semibold leading-tight transition-colors ${
              active === id ? 'text-white' :
              id === 'contact' ? 'bg-[#06C755] text-white' : 'text-neutral-600 hover:bg-soft'
            }`}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
