'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import guides from '@/data/size-guides.json';

export default function ProductSizeGuide() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const moving = useRef(false);
  const touchStart = useRef(null);
  const guide = guides[index];
  const visibleGuides = [-1, 0, 1].map((offset) => ({
    guide: guides[(index + offset + guides.length) % guides.length],
    offset,
  }));

  function move(nextDirection) {
    if (moving.current) return;
    moving.current = true;
    setDirection(nextDirection);
  }

  function finishMove(event) {
    if (event.target !== event.currentTarget || !direction) return;
    setIndex((current) => (current + direction + guides.length) % guides.length);
    setDirection(0);
    moving.current = false;
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  function handleTouchEnd(event) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const end = event.changedTouches[0];
    const distanceX = end.clientX - start.x;
    const distanceY = end.clientY - start.y;
    if (Math.abs(distanceX) > 48 && Math.abs(distanceX) > Math.abs(distanceY) * 1.25) {
      move(distanceX < 0 ? 1 : -1);
    }
  }

  return (
    <section
      aria-label="ภาพขนาดถุงเทียบกระดาษ A4"
      aria-roledescription="ชุดภาพเลื่อน"
      className="relative mx-auto mt-12 max-w-5xl px-12 sm:px-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-400"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="aspect-square overflow-hidden rounded-2xl border-2 border-neutral-300 bg-white shadow-sm"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        <div
          className="size-guide-track flex h-full"
          data-direction={direction}
          onAnimationEnd={finishMove}
        >
          {visibleGuides.map(({ guide: item, offset }) => (
            <div key={item.code} className="h-full w-full shrink-0" aria-hidden={offset !== 0}>
              <Image
                src={item.src}
                width={1600}
                height={1600}
                sizes="(max-width: 639px) calc(100vw - 128px), (max-width: 1072px) calc(100vw - 176px), 896px"
                alt={offset === 0 ? `NO.${item.code} ${item.category} กว้าง ${item.width} สูง ${item.height} นิ้ว${item.gusset ? ` ขยาย ${item.gusset} นิ้ว` : ''} เทียบกับกระดาษ A4` : ''}
                className="aspect-square w-full select-none object-contain"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => move(-1)}
        aria-label="ดูภาพเทียบขนาดรุ่นก่อนหน้า"
        aria-disabled={direction !== 0}
        className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-md transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 sm:h-12 sm:w-12"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m14 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label="ดูภาพเทียบขนาดรุ่นถัดไป"
        aria-disabled={direction !== 0}
        className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-md transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 sm:h-12 sm:w-12"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m10 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        ภาพ {index + 1} จาก {guides.length} รุ่น {guide.code}
      </p>
      <style jsx>{`
        .size-guide-track {
          transform: translateX(-100%);
        }
        .size-guide-track[data-direction='1'] {
          animation: size-guide-next 360ms cubic-bezier(0.22, 0.68, 0, 1) both;
        }
        .size-guide-track[data-direction='-1'] {
          animation: size-guide-previous 360ms cubic-bezier(0.22, 0.68, 0, 1) both;
        }
        @keyframes size-guide-next {
          from { transform: translateX(-100%); }
          to { transform: translateX(-200%); }
        }
        @keyframes size-guide-previous {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .size-guide-track[data-direction] {
            animation-duration: 1ms;
          }
        }
      `}</style>
    </section>
  );
}
