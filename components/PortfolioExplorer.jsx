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

export default function PortfolioExplorer({ showHeading = true }) {
  const [active, setActive] = useState(groups[0].name);
  const scroller = useRef(null);
  const tabs = useRef(null);
  const tabIndicator = useRef(null);
  const tabButtons = useRef([]);
  const g = groups.find((x) => x.name === active);
  const images = g.files || Array.from({ length: g.to - g.from + 1 }, (_, i) => g.from + i);
  const pageCount = Math.ceil(images.length / 6);
  const pages = Array.from({ length: pageCount }, (_, pageIndex) =>
    Array.from({ length: 6 }, (_, imageIndex) => images[(pageIndex * 6 + imageIndex) % images.length])
  );
  const loopPages = [...pages, ...pages, ...pages];

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const firstPage = el.children[0];
    const middlePage = el.children[pages.length];
    if (firstPage && middlePage) {
      el.scrollLeft = middlePage.offsetLeft - firstPage.offsetLeft;
    }
  }, [active]);

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

  const selectGroup = (name) => {
    setActive(name);
  };

  const scroll = (direction) => {
    const el = scroller.current;
    if (!el) return;
    const firstPage = el.children[0];
    const nextPage = el.children[1];
    const pageStep = nextPage && firstPage
      ? nextPage.offsetLeft - firstPage.offsetLeft
      : el.clientWidth + 20;
    const setWidth = pageStep * pages.length;
    const target = el.scrollLeft + direction * pageStep;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (el.scrollLeft >= setWidth * 2) el.scrollLeft -= setWidth;
      if (el.scrollLeft <= 1) el.scrollLeft += setWidth;
    };

    el.addEventListener('scrollend', finish, { once: true });
    el.scrollTo({ left: target, behavior: 'smooth' });
    window.setTimeout(finish, 900);
  };

  return (
    <div>
      {showHeading && (
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden h-px flex-1 bg-neutral-300 sm:block" />
          <h2 className="rounded-full border border-line bg-white px-8 py-3 text-2xl font-extrabold tracking-normal sm:text-3xl">
            ตัวอย่างงาน
          </h2>
          <div className="hidden h-px flex-1 bg-neutral-300 sm:block" />
        </div>
      )}

      {/* ปุ่มเลือกหมวดอยู่คนละบรรทัดใต้หัวข้อ */}
      <div className="mt-7 flex justify-center">
        <div
          ref={tabs}
          className="portfolio-category-tabs relative flex w-full items-center overflow-x-auto rounded-full border border-line bg-white p-1 shadow-sm"
        >
          <span
            ref={tabIndicator}
            className="portfolio-tab-indicator pointer-events-none absolute bottom-1 left-0 top-1 rounded-full bg-[#3f3f3f] shadow-sm"
            aria-hidden="true"
          />
          {groups.map((grp, index) => {
              const isActive = active === grp.name;
              return (
                <button
                  key={grp.name}
                  ref={(element) => { tabButtons.current[index] = element; }}
                  type="button"
                  onClick={() => selectGroup(grp.name)}
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

      {/* รูปแยกเป็นการ์ด เห็นพร้อมกัน 3 รูปบนจอใหญ่ */}
      <div className="relative mt-8 min-w-0 px-12 sm:px-16">
        <div
          key={active}
          ref={scroller}
          className="portfolio-manual-scroll flex gap-5 overflow-x-auto py-4"
        >
          {loopPages.map((page, pageIndex) => (
            <div
              key={`${active}-page-${pageIndex}`}
              className="grid w-full shrink-0 grid-cols-3 gap-3 sm:gap-5"
              aria-hidden={pageIndex < pages.length || pageIndex >= pages.length * 2}
            >
              {page.map((n, imageIndex) => (
                <div
                  key={`${active}-${pageIndex}-${n}-${imageIndex}`}
                  className="portfolio-card-pop overflow-hidden rounded-xl border-[3px] border-neutral-300 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.07)] sm:rounded-2xl"
                  style={{ '--portfolio-card-delay': `${imageIndex * 60}ms` }}
                >
                  <Image
                    src={typeof n === 'number' ? `/works/${n}.png` : n}
                    alt={`ผลงาน${active} NOOSOL`}
                    width={500}
                    height={500}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-md transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 sm:h-12 sm:w-12"
          aria-label="เลื่อนผลงานไปทางซ้าย"
          title="เลื่อนไปทางซ้าย"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m14 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-md transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 sm:h-12 sm:w-12"
          aria-label="เลื่อนผลงานไปทางขวา"
          title="เลื่อนไปทางขวา"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m10 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
