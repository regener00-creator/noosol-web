'use client';

import Image from 'next/image';
import { useRef } from 'react';

// สไลด์ผลงานเลื่อนซ้าย-ขวา หนึ่งชุดต่อหนึ่งหมวด
export default function PortfolioSlider({ title, images }) {
  const ref = useRef(null);

  const slide = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => slide(-1)}
            aria-label={`เลื่อนดูผลงาน${title}ก่อนหน้า`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:bg-soft"
          >
            ←
          </button>
          <button
            onClick={() => slide(1)}
            aria-label={`เลื่อนดูผลงาน${title}ถัดไป`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:bg-soft"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src) => (
          <div
            key={src}
            className="w-full shrink-0 snap-center overflow-hidden rounded-3xl border border-line bg-white"
          >
            <Image
              src={src}
              alt={`ผลงาน ${title} NOOSOL`}
              width={1660}
              height={632}
              className="w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
