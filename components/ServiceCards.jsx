'use client';

import Image from 'next/image';
import LazyVideo from './LazyVideo';
import { useLayoutEffect, useRef, useState } from 'react';

const showcaseVideos = ['K1-h264.mp4', 'K2-h264.mp4', 'K3-h264.mp4', 'K4-h264.mp4'];

const bagExamples = [
  { file: 'water', alt: 'ถุงผ้าสีครีมหูหิ้วสีน้ำเงิน WATER' },
  { file: 'kuku-white', alt: 'กระเป๋าหูหิ้วสีน้ำตาลลาย Ku Ku' },
  { file: 'hi-project', alt: 'กระเป๋าผ้าสีดำลาย Hi! Project' },
  { file: 'informa', alt: 'กระเป๋าผ้าสีน้ำเงิน Informa Markets' },
  { file: 'gsb', alt: 'ถุงหูหิ้วสีชมพู ออมสิน' },
  { file: 'silom-edge', alt: 'ถุงสีดำหูหิ้วสีรุ้ง Silom Edge' },
  { file: 'drawstring', alt: 'เป้หูรูดสีแดงลาย Nichakoon Meen' },
  { file: 'anniversary', alt: 'กระเป๋าผ้าสีขาวลายช้าง 50 ปี' },
];

const formats = [
  {
    label: 'สต๊อก',
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
  },
  {
    label: 'ผลิตกระเป๋า',
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

export default function ServiceCards({ children, stock }) {
  const [stage, setStage] = useState('intro');
  const expanded = stage === 'choices';
  const clips = useRef(null);
  const [selected, setSelected] = useState(null);
  const origin = useRef(null);
  const choices = useRef(null);
  const centeredTop = useRef(null);
  const chart = useRef(null);
  const content = useRef(null);
  const activePill = useRef(null);
  const previousPillBounds = useRef(null);
  const format = formats[selected];
  const showColors = selected === 1;
  const hasSelection = selected !== null;

  // Keep shared #colors links and browser history pointed at the inline chart.
  useLayoutEffect(() => {
    function openLinkedChart() {
      if (window.location.hash === '#colors') {
        setStage('choices');
        setSelected(1);
      }
    }
    openLinkedChart();
    window.addEventListener('noosol:section-change', openLinkedChart);
    return () => window.removeEventListener('noosol:section-change', openLinkedChart);
  }, []);

  useLayoutEffect(() => {
    if (showColors && window.location.hash === '#colors') {
      chart.current.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [showColors]);

  function expand(event) {
    origin.current = event.currentTarget.getBoundingClientRect();
    setStage(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'choices' : 'leaving');
  }

  useLayoutEffect(() => {
    if (stage !== 'leaving') return;
    const exit = clips.current.animate([
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(55%)', opacity: 0 },
    ], { duration: 420, easing: 'cubic-bezier(.45,0,.75,.4)', fill: 'forwards' });
    exit.onfinish = () => setStage('choices');
    return () => exit.cancel();
  }, [stage]);

  useLayoutEffect(() => {
    if (!expanded || !origin.current) return;
    const items = Array.from(choices.current.querySelectorAll('.service-family-label, button'));
    choices.current.querySelector('button').focus({ preventScroll: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const start = origin.current;
    const animations = items.map((item, index) => {
      const end = item.getBoundingClientRect();
      const dx = start.left + start.width / 2 - end.left - end.width / 2;
      const dy = start.top + start.height / 2 - end.top - end.height / 2;
      return item.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(.85)`, opacity: 0 },
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      ], { duration: 560, delay: index * 45, fill: 'backwards', easing: 'cubic-bezier(.2,.75,.25,1)' });
    });
    return () => animations.forEach((animation) => animation.cancel());
  }, [expanded]);

  useLayoutEffect(() => {
    const pill = activePill.current;
    const from = previousPillBounds.current;
    previousPillBounds.current = null;
    if (!pill || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const to = pill.getBoundingClientRect();
    if (!to.width || !to.height) return;
    const start = from
      ? `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`
      : 'scale(.94)';
    const animation = pill.animate([
      { transform: start, opacity: from ? 1 : 0 },
      { transform: 'none', opacity: 1 },
    ], { duration: 340, easing: 'cubic-bezier(.2,.75,.25,1)' });
    return () => animation.cancel();
  }, [selected]);

  useLayoutEffect(() => {
    const start = centeredTop.current;
    centeredTop.current = null;
    if (start === null || !hasSelection || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const row = choices.current;
    const distance = start - row.getBoundingClientRect().top;
    const lift = row.animate([
      { transform: `translateY(${distance}px)`, easing: 'cubic-bezier(.22,.72,.24,1)' },
      { transform: 'translateY(-5px)', offset: .8, easing: 'ease-out' },
      { transform: 'translateY(0)' },
    ], { duration: 480 });
    return () => lift.cancel();
  }, [hasSelection]);

  useLayoutEffect(() => {
    if (selected === null || window.location.hash === '#colors' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const body = content.current;
    const panel = body.closest('#services');
    const distance = Math.max(0, panel.getBoundingClientRect().bottom - body.getBoundingClientRect().top);
    const entry = body.animate([
      { transform: `translateY(${distance}px)`, opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ], { duration: 560, easing: 'cubic-bezier(.22,.8,.22,1)' });
    return () => entry.cancel();
  }, [selected]);

  function choice(index) {
    return (
      <button
        type="button"
        className="service-choice"
        aria-pressed={selected === index}
        onClick={() => {
          if (index !== 1 && window.location.hash === '#colors') {
            window.history.replaceState(window.history.state, '', '#services');
          }
          if (selected !== index) {
            if (!hasSelection) centeredTop.current = choices.current.getBoundingClientRect().top;
            previousPillBounds.current = activePill.current?.getBoundingClientRect();
            setSelected(index);
          }
        }}
      >
        {selected === index && <span ref={activePill} aria-hidden="true" className="service-choice-pill" />}
        <span className="relative z-[2] block">
          {formats[index].label}
          {index === 0 && (
            <strong className="block whitespace-nowrap text-xs font-bold leading-tight">
              <span aria-hidden="true">⭐</span>ยอดนิยม<span aria-hidden="true">⭐</span>
            </strong>
          )}
        </span>
      </button>
    );
  }

  return (
    <div className={`service-layout mx-auto max-w-7xl px-3 sm:px-6 ${hasSelection ? '' : 'service-layout-intro'}`}>
      {expanded ? (
        <div ref={choices} data-selected={hasSelection || undefined} role="group" aria-label="แบบที่รับผลิต" className="service-choices relative z-10 w-full">
          <div className="service-family" role="group" aria-labelledby="spunbond-family">
            {!hasSelection && (
              <Image src="/services/category-spunbond-cutout.webp" alt="ถุงสปันบอนด์สีดำสกรีนโลโก้เนื้อแท้" width={480} height={480} sizes="(max-width: 950px) 40vw, 380px" className="service-choice-photo" />
            )}
            <span id="spunbond-family" className="service-family-label">ถุงสปันบอนด์</span>
            <div className="service-choice-pair">{choice(1)}{choice(0)}</div>
          </div>
          <div className="service-bag-choice">
            {!hasSelection && (
              <Image src="/services/category-shoulder.webp" alt="กระเป๋าสะพายสีดำพร้อมหูหิ้ว" width={480} height={480} sizes="(max-width: 950px) 40vw, 380px" className="service-choice-photo" />
            )}
            {choice(2)}
          </div>
        </div>
      ) : (
        <div className="service-opening w-full text-center">
          <button type="button" onClick={expand} disabled={stage === 'leaving'} aria-expanded={false} className="service-start">
            ทางโรงงานรับผลิตทั้งหมด 3 รูปแบบ
          </button>
          <div className="mt-5 overflow-clip sm:mt-8">
            <div ref={clips} className="service-opening-videos">
              {showcaseVideos.map((file, index) => (
                <LazyVideo
                  key={file}
                  src={`/videos/${file}`}
                  mobileSrc={`/videos/${file.replace('-h264.mp4', '-mobile.mp4')}`}
                  poster={`/videos/${file.replace('.mp4', '-poster.jpg')}`}
                  aria-label={`วิดีโอผลงานการผลิต NOOSOL คลิปที่ ${index + 1}`}
                  className="block aspect-[9/16] w-full rounded-2xl bg-black object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div ref={content} hidden={!hasSelection}>
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

            <article className="flex min-w-0 flex-col items-center justify-center rounded-3xl text-center border border-line bg-white p-6 shadow-sm sm:p-9 md:col-span-2 lg:p-12">
              <h3 className="text-xl font-extrabold leading-relaxed text-ink sm:text-2xl">{format.detailTitle}</h3>
              <ul className="mt-5 list-inside list-disc space-y-3 text-base leading-relaxed text-neutral-700 marker:text-[#f58220] sm:text-lg">
                {format.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </article>
          </div>
        )}
        {selected === 2 && (
          <ul aria-label="ตัวอย่างงานผลิตกระเป๋า" className="mt-8 grid grid-cols-4 gap-2 sm:mt-12 sm:gap-4">
            {bagExamples.map(({ file, alt }) => (
              <li key={file} className="relative aspect-square overflow-hidden rounded-xl border border-line bg-white shadow-sm sm:rounded-2xl">
                <Image src={`/services/bag-examples/${file}.webp`} alt={alt} fill sizes="(min-width: 1280px) 300px, 24vw" className="object-contain" />
              </li>
            ))}
          </ul>
        )}
        {selected === 0 && (
          <section aria-labelledby="stock-screen-heading" className="mt-12 scroll-mt-4 sm:mt-16">
            <div className="mb-7 flex items-center gap-4 sm:gap-6">
              <div className="h-px flex-1 bg-neutral-300" />
              <h2 id="stock-screen-heading" className="rounded-full border border-line bg-white px-5 py-3 text-center text-xl font-extrabold tracking-tight sm:px-8 sm:text-3xl">
                รุ่นถุงสปันบอนด์{' '}
                <span className="text-[#eb7300]">สำหรับสกรีน</span>
              </h2>
              <div className="h-px flex-1 bg-neutral-300" />
            </div>
            {stock}
          </section>
        )}
        <section ref={chart} id="colors" hidden={!showColors} className="mt-12 scroll-mt-4 sm:mt-16">
          {children}
        </section>
      </div>
    </div>
  );
}
