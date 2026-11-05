'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { site } from '@/lib/site';

export default function LineContactButton({ className }) {
  const dialog = useRef(null);
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  const openDialog = (event) => {
    const element = dialog.current;
    if (!element || element.open) return;
    const trigger = event.currentTarget.getBoundingClientRect();
    element.showModal();
    const bounds = element.getBoundingClientRect();
    element.style.setProperty('--line-origin-x', `${trigger.left + trigger.width / 2 - bounds.left - bounds.width / 2}px`);
    element.style.setProperty('--line-origin-y', `${trigger.top + trigger.height / 2 - bounds.top - bounds.height / 2}px`);
    element.style.setProperty('--line-origin-scale', String(Math.max(0.12, Math.min(1, trigger.width / bounds.width))));
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={openDialog}
        aria-haspopup="dialog"
        aria-controls={id}
        aria-expanded={isOpen}
      >
        LINE
      </button>
      <dialog
        ref={dialog}
        id={id}
        className="line-contact-dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
      >
        <div className="line-contact-panel relative flex flex-col items-center rounded-3xl bg-white px-8 pb-9 pt-10 text-center text-ink shadow-2xl">
          <button
            type="button"
            onClick={() => dialog.current.close()}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06c755]"
            aria-label="ปิดหน้าต่าง LINE"
            autoFocus
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
          <h2 id={`${id}-title`} className="text-3xl font-extrabold">LINE</h2>
          <Image
            src="/contact-icons/line-20261105.png"
            alt="LINE"
            width={96}
            height={96}
            className="mt-6 h-24 w-24 object-contain"
            loading="eager"
          />
          <p id={`${id}-description`} className="mt-6 text-base leading-7 text-neutral-600">
            ส่งโลโก้ และ สอบถามข้อมูลได้ที่นี่
          </p>
          <a
            href={site.lineHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 block w-full rounded-xl bg-[#06c755] px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-[#05ae4a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06c755]"
          >
            LINE: @NOOSOL
          </a>
        </div>
      </dialog>
    </>
  );
}
