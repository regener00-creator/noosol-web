'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';

const formats = [
  {
    label: 'ถุงสปันบอนด์สต๊อก',
    title: 'สปันบอนด์สต็อก',
    image: '/services/service-1.png',
    icon: '/services/icon-76.png',
    iconScale: 'scale-[1.15]',
    description: ['รับสกรีนขั้นต่ำ 100 ใบ', 'เฉพาะสีและขนาดในสต็อก'],
    detailTitle: '✨ถุงสปันบอนด์ [สต๊อก] ✨',
    details: [
      'รับสกรีนขั้นต่ำเพียง 100 ใบ',
      'ใช้เวลา 10-15 วัน ถ้าเสร็จก่อนส่งให้ก่อน',
      'เฉพาะ ขนาด & สี ในสต๊อกของทางร้าน',
    ],
    action: { label: 'ขนาดสต๊อก', href: '#products' },
  },
  {
    label: 'ผลิตใหม่',
    title: 'สปันบอนด์ผลิตใหม่',
    image: '/services/service-2.png',
    icon: '/services/icon-78.png',
    iconScale: 'scale-[1.30]',
    description: ['รับผลิตขั้นต่ำ 3,000 ใบ', 'พร้อมสีให้เลือกถึง 30 สี'],
    detailTitle: '⭐ถุงสปันบอนด์ผลิตใหม่⭐',
    details: [
      'รับผลิตใหม่ ขั้นต่ำที่ 3,000 ใบ',
      'ใช้เวลา 15-20 วัน ถ้าเสร็จก่อนส่งให้ก่อน',
      'ราคาประเมินตามแบบ และ สีโลโก้',
    ],
    action: { label: 'สีผลิตใหม่', href: '#colors' },
  },
  {
    label: 'กระเป๋า',
    title: 'กระเป๋าผลิตใหม่',
    image: '/services/service-3-311.png',
    icon: '/services/icon-77.png',
    iconScale: 'scale-[1.55]',
    description: ['รับผลิตขั้นต่ำ 300 ใบ', 'ส่งแบบเพื่อประเมินราคาทางแชท'],
    detailTitle: '🎒 กระเป๋าผลิตใหม่ 🎒',
    details: [
      'รับผลิตใหม่ ขั้นต่ำที่ 300 ใบ',
      'ใช้เวลาผลิตภายใน 30 วัน',
      'ราคาประเมินตามแบบ และ สีโลโก้',
    ],
  },
];

export default function ServiceCards() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const origin = useRef(null);
  const choices = useRef(null);
  const format = formats[selected];

  function expand(event) {
    origin.current = event.currentTarget.getBoundingClientRect();
    setExpanded(true);
  }

  useLayoutEffect(() => {
    if (!expanded) return;
    const buttons = Array.from(choices.current.querySelectorAll('button'));
    buttons[0].focus({ preventScroll: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const start = origin.current;
    const animations = buttons.map((button, index) => {
      const end = button.getBoundingClientRect();
      const dx = start.left + start.width / 2 - end.left - end.width / 2;
      const dy = start.top + start.height / 2 - end.top - end.height / 2;
      return button.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(.85)`, opacity: 0 },
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      ], { duration: 560, delay: index * 45, fill: 'backwards', easing: 'cubic-bezier(.2,.75,.25,1)' });
    });
    return () => animations.forEach((animation) => animation.cancel());
  }, [expanded]);

  function choice(index) {
    return (
      <button
        type="button"
        className="service-choice"
        aria-pressed={selected === index}
        onClick={() => setSelected(index)}
      >
        {formats[index].label}
      </button>
    );
  }

  return (
    <div className={`service-layout mx-auto max-w-7xl px-3 sm:px-6 ${expanded ? '' : 'service-layout-intro'}`}>
      {expanded ? (
        <>
          <div ref={choices} role="group" aria-label="แบบที่รับผลิต" className="service-choices">
            <div className="service-choice-pair">{choice(0)}{choice(1)}</div>
            {choice(2)}
          </div>

          {format && (
            <div key={format.label} className="service-result grid gap-4 md:grid-cols-3 md:gap-6">
              <article className="flex min-w-0 flex-col rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-[#eb7300]">
                    <Image src={format.icon} alt="" fill sizes="48px" className={`${format.iconScale} object-contain brightness-0 invert`} />
                  </div>
                  <h2 className="flex-1 text-lg font-extrabold text-ink">{format.title}</h2>
                  <span className="text-3xl font-bold text-[#d88a46]">{String(selected + 1).padStart(2, '0')}</span>
                </div>
                <div className="relative my-3 h-36 sm:h-52 lg:h-64">
                  <Image src={format.image} alt={format.title} fill sizes="(min-width: 768px) 33vw, 94vw" className="object-contain" />
                </div>
                <p className="mt-auto border-t border-line pt-4 text-center text-sm leading-relaxed text-neutral-600 sm:text-base">
                  <strong className="block text-ink">{format.description[0]}</strong>
                  {format.description[1]}
                </p>
              </article>

              <article className="flex min-w-0 flex-col justify-center rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-9 md:col-span-2 lg:p-12">
                <h3 className="text-xl font-extrabold leading-relaxed text-ink sm:text-2xl">{format.detailTitle}</h3>
                <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-relaxed text-neutral-700 marker:text-[#f58220] sm:text-lg">
                  {format.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
                {format.action && (
                  <a href={format.action.href} className="mt-7 self-start rounded-full bg-[#f58220] px-6 py-3 font-bold text-white hover:bg-[#eb7300]">
                    {format.action.label}
                  </a>
                )}
              </article>
            </div>
          )}
        </>
      ) : (
        <button type="button" onClick={expand} aria-expanded={false} className="service-start">
          ทางโรงงานรับผลิตทั้งหมด 3 รูปแบบ
        </button>
      )}
    </div>
  );
}
