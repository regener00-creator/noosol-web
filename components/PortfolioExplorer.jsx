'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';

// ผลงาน — ปุ่มเลือกหมวดแนวนอน และแถบรูปเลื่อนเต็มพื้นที่
const groups = [
  { name: 'ถุงใส่แก้ว', from: 1, to: 12 },
  { name: 'ถุงสปันบอนด์มินิ', from: 13, to: 24 },
  { name: 'ไม่ขยาย', from: 49, to: 60 },
  { name: 'ขยายเฉพาะก้น', from: 35, to: 48 },
  { name: 'ขยายข้างและก้น', from: 25, to: 34 },
  { name: 'ผลิตตามแบบ', from: 61, to: 72 },
  {
    name: 'ผลิตกระเป๋า',
    files: Array.from({ length: 16 }, (_, index) => (
      index === 6
        ? '/works/bags/bag-67.png'
        : `/works/bags/bag-${String(index + 1).padStart(2, '0')}.webp`
    )),
  },
];

const pixelsPerSecond = 24;

function PortfolioRail({ group }) {
  const images = group.files || Array.from(
    { length: group.to - group.from + 1 },
    (_, index) => `/works/${group.from + index}.png`
  );
  const [rows, setRows] = useState(2);
  useLayoutEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    const updateRows = () => setRows(mobile.matches ? 1 : 2);
    updateRows();
    mobile.addEventListener('change', updateRows);
    return () => mobile.removeEventListener('change', updateRows);
  }, []);

  const columns = Array.from({ length: Math.ceil(images.length / rows) }, (_, i) =>
    images.slice(i * rows, (i + 1) * rows)
  );
  const track = useRef(null);
  const shift = useRef(null);
  const drag = useRef(null);

  useLayoutEffect(() => {
    const row = track.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let span = 0;
    let offset = 0;
    let frame = 0;
    let previousTime = null;
    let visible = false;

    // In a reversed row, translating right reveals the next photo from the left.
    // The identical neighboring copies cover either direction at the loop seam.
    const move = (distance) => {
      if (!span) return;
      offset = ((offset + distance) % span + span) % span;
      row.style.transform = `translate3d(${span + offset}px, 0, 0)`;
    };
    const measure = () => {
      const progress = span ? offset / span : 0;
      span = row.children[0].offsetLeft - row.children[columns.length].offsetLeft;
      offset = progress * span;
      move(0);
    };
    measure();
    shift.current = move;
    const resize = new ResizeObserver(measure);
    resize.observe(row);

    const tick = (now) => {
      if (previousTime !== null && !drag.current) {
        move(pixelsPerSecond * Math.min(now - previousTime, 64) / 1000);
      }
      previousTime = now;
      frame = requestAnimationFrame(tick);
    };
    const updatePlayback = () => {
      cancelAnimationFrame(frame);
      previousTime = null;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(row.parentElement);
    document.addEventListener('visibilitychange', updatePlayback);
    motion.addEventListener('change', updatePlayback);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      motion.removeEventListener('change', updatePlayback);
      document.removeEventListener('visibilitychange', updatePlayback);
      shift.current = null;
    };
  }, [columns.length]);

  function startDrag(event) {
    if (!event.isPrimary || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX };
  }

  function moveDrag(event) {
    if (drag.current?.id !== event.pointerId) return;
    shift.current?.((event.clientX - drag.current.x) * 1.5);
    drag.current.x = event.clientX;
  }

  function endDrag(event) {
    if (drag.current?.id === event.pointerId) drag.current = null;
  }

  function handleArrowKey(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const [first, next] = track.current.children;
    const direction = event.key === 'ArrowLeft' ? 1 : -1;
    shift.current?.(direction * (first.offsetLeft - next.offsetLeft));
  }

  return (
    <div
      className="portfolio-rail mt-8 min-w-0 overflow-hidden py-4"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onKeyDown={handleArrowKey}
      tabIndex={0}
      role="region"
      aria-label={`ตัวอย่างงาน ${group.name}`}
    >
      <div ref={track} className="flex w-full flex-row-reverse gap-3 sm:gap-5">
        {[0, 1, 2].map((copy) => columns.map((column, col) => (
          <div
            key={`${copy}-${column[0]}`}
            className="portfolio-rail-column grid min-w-0 content-start gap-3 sm:gap-5"
            aria-hidden={copy !== 1}
          >
            {column.map((src, row) => (
              <div key={src} className="overflow-hidden rounded-xl bg-white sm:rounded-2xl">
                <Image
                  src={src}
                  alt={copy === 1 ? `ผลงาน${group.name} NOOSOL รูปที่ ${col * rows + row + 1}` : ''}
                  width={500}
                  height={500}
                  draggable={false}
                  sizes="(max-width: 767px) 78vw, (max-width: 1023px) 33vw, 300px"
                  className="pointer-events-none aspect-square w-full object-cover"
                />
              </div>
            ))}
          </div>
        )))}
      </div>
    </div>
  );
}

export default function PortfolioExplorer({ showHeading = true }) {
  const [active, setActive] = useState(groups[0].name);
  const tabs = useRef(null);
  const tabIndicator = useRef(null);
  const tabButtons = useRef([]);
  const group = groups.find((item) => item.name === active);

  useLayoutEffect(() => {
    const tabsEl = tabs.current;
    const indicatorEl = tabIndicator.current;
    const activeIndex = groups.findIndex((group) => group.name === active);
    const activeButton = tabButtons.current[activeIndex];
    if (!tabsEl || !indicatorEl || !activeButton) return;

    const moveIndicator = () => {
      indicatorEl.style.width = `${activeButton.offsetWidth}px`;
      indicatorEl.style.transform = `translateX(${activeButton.offsetLeft}px)`;
    };

    moveIndicator();
    const resizeObserver = new ResizeObserver(moveIndicator);
    resizeObserver.observe(tabsEl);

    return () => resizeObserver.disconnect();
  }, [active]);

  return (
    <div>
      {showHeading && (
        <div className="hidden items-center gap-3 sm:gap-5 md:flex">
          <div className="hidden h-px flex-1 bg-neutral-300 sm:block" />
          <h2 className="rounded-full border border-line bg-white px-8 py-3 text-2xl font-extrabold tracking-normal sm:text-3xl">
            ตัวอย่างงาน
          </h2>
          <div className="hidden h-px flex-1 bg-neutral-300 sm:block" />
        </div>
      )}

      {/* ปุ่มเลือกหมวดอยู่คนละบรรทัดใต้หัวข้อ */}
      <div className="flex justify-center md:mt-7">
        <div
          ref={tabs}
          className="portfolio-category-tabs relative flex w-full items-center overflow-x-auto rounded-full border border-line bg-white p-1 shadow-sm"
        >
          <span
            ref={tabIndicator}
            className="portfolio-tab-indicator pointer-events-none absolute bottom-1 left-0 top-1 rounded-full bg-[#f58220] shadow-sm"
            aria-hidden="true"
          />
          {groups.map((grp, index) => {
              const isActive = active === grp.name;
              return (
                <button
                  key={grp.name}
                  ref={(element) => { tabButtons.current[index] = element; }}
                  type="button"
                  onClick={() => setActive(grp.name)}
                  className={`relative z-10 min-h-11 flex-1 shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-colors duration-300 sm:text-base ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-500 hover:text-ink'
                  }`}
                  aria-pressed={isActive}
                >
                  {grp.name}
                </button>
              );
            })}
        </div>
      </div>

      <PortfolioRail key={active} group={group} />
    </div>
  );
}
