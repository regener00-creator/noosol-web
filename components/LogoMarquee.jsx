'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function LogoMarquee({ images, direction = 'left', duration = '180s' }) {
  const strip = useRef(null);
  const [ready, setReady] = useState(() => new Set(images.slice(0, 3)));

  useEffect(() => {
    const root = strip.current;
    if (!('IntersectionObserver' in window)) {
      setReady(new Set(images));
      return;
    }

    // Observe both copies so either scrolling direction can prefetch the next logo.
    const observer = new IntersectionObserver((entries) => {
      const approaching = entries.filter((entry) => entry.isIntersecting);
      if (!approaching.length) return;
      setReady((current) => {
        const next = new Set(current);
        approaching.forEach(({ target }) => next.add(target.dataset.logo));
        return next.size === current.size ? current : next;
      });
      approaching.forEach(({ target }) => observer.unobserve(target));
    }, { root, rootMargin: '0px 180px' });
    root.querySelectorAll('[data-logo]').forEach((cell) => observer.observe(cell));
    return () => observer.disconnect();
  }, [images]);

  return (
    <div ref={strip} className="logo-marquee-fade marquee overflow-hidden rounded-xl bg-white py-2">
      <div
        className={`flex w-max ${direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'}`}
        style={{ animationDuration: duration }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-3 pr-3">
            {images.map((src) => (
              <div key={src} data-logo={src} className="logo-marquee-cell flex h-[96px] w-[110px] shrink-0 items-center justify-center p-0.5 sm:h-[104px] sm:w-[120px] md:p-3">
                {ready.has(src) && (
                  <Image
                    src={src}
                    alt={copy === 0 ? 'โลโก้ลูกค้า NOOSOL' : ''}
                    width={160}
                    height={160}
                    sizes="(min-width: 1024px) and (hover: hover) and (pointer: fine) 144px, (max-width: 639px) 110px, 120px"
                    loading="eager"
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
