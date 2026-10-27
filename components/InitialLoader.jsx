'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const MINIMUM_DISPLAY_MS = 1200;
const MAXIMUM_DISPLAY_MS = 3500;

export default function InitialLoader() {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const completed = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();
    let pageReady = document.readyState === 'complete';
    const timers = [];

    delete document.documentElement.dataset.loaderDone;
    document.documentElement.classList.add('is-loading');

    const finish = () => {
      if (completed.current) return;
      completed.current = true;
      setProgress(100);
      timers.push(window.setTimeout(() => setExiting(true), 260));
      timers.push(window.setTimeout(() => {
        setHidden(true);
        document.documentElement.classList.remove('is-loading');
        document.documentElement.dataset.loaderDone = 'true';
        window.dispatchEvent(new Event('noosol:loader-complete'));
      }, 1100));
    };

    const onLoad = () => {
      pageReady = true;
    };

    window.addEventListener('load', onLoad);

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const waitingTarget = Math.min(92, Math.floor(elapsed / 14));

      setProgress((current) => {
        if (completed.current) return current;
        const distance = waitingTarget - current;
        return distance > 0 ? Math.min(waitingTarget, current + Math.max(1, Math.ceil(distance * 0.16))) : current;
      });

      if ((pageReady && elapsed >= MINIMUM_DISPLAY_MS) || elapsed >= MAXIMUM_DISPLAY_MS) {
        window.clearInterval(interval);
        finish();
      }
    }, 35);

    return () => {
      window.removeEventListener('load', onLoad);
      window.clearInterval(interval);
      timers.forEach((timer) => window.clearTimeout(timer));
      document.documentElement.classList.remove('is-loading');
    };
  }, []);

  if (hidden) return null;

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
