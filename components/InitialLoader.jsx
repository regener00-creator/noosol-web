'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function InitialLoader() {
  const [phase, setPhase] = useState('loading');
  const exiting = phase === 'exiting';
  const progress = exiting ? 100 : 0;

  useEffect(() => {
    const root = document.documentElement;
    delete root.dataset.loaderDone;
    root.classList.add('is-loading');
    setPhase('exiting');

    // The page is hydrated. Only wait for the curtain to finish opening.
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400;
    const timer = window.setTimeout(() => {
      setPhase('done');
      root.classList.remove('is-loading');
      root.dataset.loaderDone = 'true';
      window.dispatchEvent(new Event('noosol:loader-complete'));
    }, duration);
    return () => {
      window.clearTimeout(timer);
      root.classList.remove('is-loading');
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className={`initial-loader fixed inset-0 z-[100] ${exiting ? 'is-exiting' : ''}`}
      role="progressbar"
      aria-label="กำลังโหลดเว็บไซต์ NOOSOL"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
    >
      <div className="initial-loader-panel initial-loader-panel-left" aria-hidden="true" />
      <div className="initial-loader-panel initial-loader-panel-right" aria-hidden="true" />

      <div className="initial-loader-content absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="flex flex-col items-center">
          <div className="initial-loader-logo flex items-center gap-4">
            <span className="relative h-20 w-20 shrink-0 overflow-hidden" aria-hidden="true">
              <Image
                src="/header-logo.png"
                alt=""
                width={1600}
                height={1600}
                sizes="156px"
                priority
                className="absolute h-[156px] w-[156px] max-w-none -translate-x-[38px] -translate-y-[44px]"
              />
            </span>
            <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">NOOSOL</span>
          </div>

          <div className="mt-9 w-56 sm:w-64">
            <div className="relative h-9 overflow-hidden rounded-full bg-[#f4e1d1] shadow-inner">
              <div
                className="h-full rounded-full bg-[#f58220] transition-[width] duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold tabular-nums text-ink">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
