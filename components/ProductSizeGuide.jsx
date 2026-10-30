'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import guides from '@/data/size-guides.json';

export default function ProductSizeGuide() {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);
  const guide = guides[index];

  function move(direction) {
    setIndex((current) => (current + direction + guides.length) % guides.length);
  }

  function handleKeyDown(event) {
    if (event.target.tagName === 'SELECT') return;
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
      aria-labelledby="size-guide-heading"
      aria-roledescription="ชุดภาพเลื่อน"
      className="mx-auto mt-12 max-w-4xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-400"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <h3 id="size-guide-heading" className="mb-5 text-center text-xl font-bold text-ink sm:text-2xl">
        เทียบขนาดถุงกับกระดาษ A4
      </h3>

      <div
        className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        <Image
          key={guide.code}
          src={guide.src}
          width={1600}
          height={1600}
          sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 944px) calc(100vw - 48px), 896px"
          alt={`NO.${guide.code} ${guide.category} กว้าง ${guide.width} สูง ${guide.height} นิ้ว${guide.gusset ? ` ขยาย ${guide.gusset} นิ้ว` : ''} เทียบกับกระดาษ A4`}
          className="aspect-square w-full select-none object-contain"
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="mx-auto mt-4 flex max-w-lg items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="ดูภาพเทียบขนาดรุ่นก่อนหน้า"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m14 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <label htmlFor="size-guide-model" className="sr-only">เลือกรุ่นเพื่อเทียบขนาด</label>
        <select
          id="size-guide-model"
          value={index}
          onChange={(event) => setIndex(Number(event.target.value))}
          className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-center text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-500 sm:text-sm"
        >
          {guides.map((item, itemIndex) => (
            <option key={item.code} value={itemIndex}>NO.{item.code} : {item.category}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="ดูภาพเทียบขนาดรุ่นถัดไป"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m10 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        ภาพ {index + 1} จาก {guides.length} รุ่น {guide.code}
      </p>
      <div className="mt-3 text-center">
        <a href={guide.src} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-500 underline underline-offset-4 hover:text-ink">
          ดูภาพขนาดเต็ม
        </a>
      </div>
    </section>
  );
}
