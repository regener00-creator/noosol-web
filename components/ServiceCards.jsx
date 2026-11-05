'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';

const cardMeta = [
  {
    title: 'สปันบอนด์สต็อก',
    icon: '/services/icon-76.png',
    iconScale: 'scale-[1.15]',
    description: ['รับสกรีนขั้นต่ำ 100 ใบ', 'เฉพาะสีและขนาดในสต็อก'],
    detailTitle: '✨สกรีนถุงสปันบอนด์ [ขนาดในสต๊อก] ✨',
    details: [
      'ขั้นต่ำ 100 ใบ',
      'ใช้เวลา 10-15 วันโดยประมาณ ถ้าเสร็จก่อนส่งให้ก่อนครับ',
      'เฉพาะ ขนาด และ สี ที่มีในสต๊อกของทางร้านเท่านั้น',
    ],
    action: { label: 'ขนาดสต๊อก', href: '#products' },
  },
  {
    title: 'สปันบอนด์ผลิตใหม่',
    icon: '/services/icon-78.png',
    iconScale: 'scale-[1.30]',
    description: ['รับผลิตขั้นต่ำ 3,000 ใบ', 'พร้อมสีให้เลือกถึง 30 สี'],
    detailTitle: '⭐ถุงสปันบอนด์ผลิตใหม่⭐',
    details: [
      'รับผลิตขั้นต่ำที่ 3,000 ใบ',
      'ใช้เวลา 15-20 วัน ถ้าเสร็จก่อนส่งให้ก่อนครับ',
      'ราคาต้องประเมินตามแบบครับ',
    ],
    action: { label: 'สีผลิตใหม่', href: '#colors' },
  },
  {
    title: 'กระเป๋าผลิตใหม่',
    icon: '/services/icon-77.png',
    iconScale: 'scale-[1.55]',
    description: ['รับผลิตขั้นต่ำ 300 ใบ', 'ส่งแบบเพื่อประเมิณราคาทางแชท'],
    detailTitle: 'กระเป๋าผลิตใหม่',
    details: [
      'กระเป๋ารับผลิตขั้นต่ำที่ 300 ใบ',
      'ใช้เวลาผลิตภายใน 30 วัน ถ้าเสร็จก่อนส่งให้ก่อนครับ',
      'ราคาต้องประเมินตามแบบครับ',
    ],
  },
];

function ServiceCard({ service, index }) {
  const meta = cardMeta[index];
  const [opened, setOpened] = useState(false);
  const id = useId();
  const front = useRef(null);
  const back = useRef(null);
  const interacted = useRef(false);

  useEffect(() => {
    if (interacted.current) {
      (opened ? back : front).current?.focus({ preventScroll: true });
    }
  }, [opened]);

  const turnPage = (next) => {
    interacted.current = true;
    setOpened(next);
  };

  return (
    <article
      className="service-calendar"
      data-open={opened}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && opened) {
          event.preventDefault();
          turnPage(false);
        }
      }}
    >
      <div
        id={id}
        className="service-calendar-details flex flex-col rounded-3xl border border-line bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-8"
        aria-hidden={!opened}
        inert={!opened ? '' : undefined}
      >
        <div className="flex items-center justify-between gap-3 border-b border-orange-100 pb-5">
          <span className="text-sm font-bold text-[#eb7300]">หน้าที่ 2</span>
          <button
            ref={back}
            type="button"
            tabIndex={opened ? 0 : -1}
            onClick={() => turnPage(false)}
            className="rounded-full px-3 py-2 text-sm font-semibold text-neutral-500 transition-colors hover:bg-orange-50 hover:text-[#eb7300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f58220]"
            aria-label={`กลับหน้าแรก ${meta.title}`}
          >
            <span aria-hidden="true">↶ </span>กลับหน้าแรก
          </button>
        </div>
        <h3 className="mt-7 text-[23px] font-extrabold leading-relaxed text-ink">{meta.detailTitle}</h3>
        <ul className="mb-8 mt-6 list-disc space-y-5 pl-5 text-[17px] leading-8 text-neutral-700 marker:text-[#f58220]">
          {meta.details.map((detail) => <li key={detail}>{detail}</li>)}
        </ul>
        {meta.action && (
          <a
            href={meta.action.href}
            tabIndex={opened ? 0 : -1}
            className="mt-auto block rounded-xl bg-[#f58220] px-5 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-[#eb7300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f58220]"
          >
            {meta.action.label}
          </a>
        )}
      </div>

      <button
        ref={front}
        type="button"
        className="service-calendar-front group flex w-full flex-col rounded-3xl border border-line bg-white p-6 text-left shadow-[0_10px_30px_rgba(0,0,0,0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f58220] sm:p-8"
        onClick={() => turnPage(true)}
        aria-label={`ดูรายละเอียด ${meta.title}`}
        aria-expanded={opened}
        aria-controls={id}
        aria-hidden={opened}
        inert={opened ? '' : undefined}
        tabIndex={opened ? -1 : 0}
      >
        <div className="flex min-h-14 w-full items-center gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#eb7300]">
            <Image src={meta.icon} alt="" fill sizes="56px" className={`${meta.iconScale} object-contain brightness-0 invert`} />
          </div>
          <h3 className="min-w-0 flex-1 text-[20px] font-extrabold leading-7 tracking-normal">{meta.title}</h3>
          <span className="font-sans text-[35px] font-bold leading-none text-[#f5d5b7]">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="relative mt-8 min-h-[300px] w-full flex-1 overflow-hidden bg-white">
          <Image src={service.image} alt={meta.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-contain p-5 transition duration-300 group-hover:scale-[1.03]" />
        </div>
        <div className="mt-7 h-px w-full bg-neutral-200" />
        <p className="min-h-[76px] w-full pt-6 text-center text-[17px] font-medium leading-7 text-neutral-600">
          {meta.description.map((line, lineIndex) => (
            <span key={line} className={`block ${lineIndex === 0 ? 'font-bold text-neutral-900' : ''}`}>{line}</span>
          ))}
        </p>
        <span className="mt-3 w-full rounded-xl bg-[#f58220] px-4 py-3 text-center text-sm font-bold text-white">คลิกเพื่อเปิดดูรายละเอียด</span>
      </button>
    </article>
  );
}

export default function ServiceCards({ services }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {services.map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}
    </div>
  );
}
