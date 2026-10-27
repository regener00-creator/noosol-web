'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import ShopCard from './ShopCard';

const stockCats = [
  {
    id: 'ไม่ขยาย',
    label: 'รุ่นไม่ขยาย',
    desc: 'ทรงแบนคลาสสิก เหมาะกับเอกสาร หนังสือ และงานอีเวนต์ พื้นที่สกรีนโลโก้เต็มใบ',
  },
  {
    id: 'ขยายเฉพาะก้น',
    label: 'รุ่นขยายเฉพาะก้น',
    desc: 'มีก้นถุง วางของหนาได้ เช่น กล่องอาหาร ขวดน้ำ และของชำร่วย',
  },
  {
    id: 'ขยายข้างและก้น',
    label: 'รุ่นขยายข้างและก้น',
    desc: 'จุของได้เยอะที่สุด ทรงกล่องตั้งได้ เหมาะกับงานสัมมนาและช้อปปิ้ง',
  },
  {
    id: 'เชือกรูด',
    label: 'รุ่นเชือกรูด',
    desc: 'ปิดปากถุงด้วยเชือกรูด กันของหล่น เหมาะกับของขวัญและของชำร่วย',
  },
  {
    id: 'อื่นๆ',
    label: 'รุ่นอื่นๆ',
  },
];

const categories = stockCats;

export default function ProductExplorer({ products }) {
  const [active, setActive] = useState(categories[0].id);
  const tabs = useRef(null);
  const indicator = useRef(null);
  const buttons = useRef([]);
  const current = categories.find((category) => category.id === active);
  const items = products.filter((product) => product.category === active);
  const showInfo = Boolean(current.text);

  useLayoutEffect(() => {
    const tabsEl = tabs.current;
    const indicatorEl = indicator.current;
    const activeIndex = categories.findIndex((category) => category.id === active);
    const activeButton = buttons.current[activeIndex];
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
      <div
        ref={tabs}
        className="product-category-tabs relative flex items-center overflow-x-auto rounded-full border border-line bg-white p-1 shadow-sm"
      >
        <span
          ref={indicator}
          className="portfolio-tab-indicator pointer-events-none absolute bottom-1 left-0 top-1 rounded-full bg-[#3f3f3f] shadow-sm"
          aria-hidden="true"
        />
        {categories.map((category, index) => {
          const isActive = category.id === active;
          return (
            <button
              key={category.id}
              ref={(element) => { buttons.current[index] = element; }}
              type="button"
              onClick={() => setActive(category.id)}
              className={`relative z-10 min-h-12 shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 sm:flex-1 sm:px-6 sm:text-base ${
                isActive ? 'text-white' : 'text-neutral-500 hover:text-ink'
              }`}
              aria-pressed={isActive}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div key={active} className="fade-up mt-8">
        {showInfo && (
          <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-8">
            <h3 className="text-2xl font-extrabold tracking-tight">{current.label}</h3>
            {current.desc && (
              <p className="mt-2 text-base leading-7 text-neutral-500">{current.desc}</p>
            )}
            {current.text?.map((line, index) => (
              <p
                key={line}
                className={index === 0 ? 'mt-3 text-lg font-bold' : 'mt-1 text-base text-neutral-500'}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className={`${showInfo ? 'mt-6' : ''} grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5`}>
            {items.map((product) => (
              <ShopCard key={product.code} p={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
