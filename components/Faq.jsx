'use client';

import { useState } from 'react';

// Q&A สไตล์เม็ดยา — กดแล้วคลี่คำตอบนุ่มๆ ปุ่ม + หมุนเป็น ×
export default function Faq({ items }) {
  const [openIds, setOpenIds] = useState(() => new Set());
  const columns = [items.slice(0, 3), items.slice(3, 6)];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:items-start">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="space-y-4">
          {column.map((f, itemIndex) => {
            const i = columnIndex * 3 + itemIndex;
            const open = openIds.has(i);
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-[28px] bg-soft transition-all duration-300 ${
                  open ? 'ring-1 ring-ink' : ''
                }`}
              >
                <button
                  onClick={() => setOpenIds((current) => {
                    const next = new Set(current);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  })}
                  className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
                >
                  <span className="text-base font-bold sm:text-lg">{f.q}</span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className={`transition-transform duration-500 ${open ? 'rotate-45' : ''}`}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.28, 0.11, 0.32, 1)' }}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {/* คำตอบ — คลี่ขยายนุ่มๆ แบบเดียวกับรุ่นในสต็อก */}
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-500"
                  style={{
                    gridTemplateRows: open ? '1fr' : '0fr',
                    opacity: open ? 1 : 0,
                    transitionTimingFunction: 'cubic-bezier(0.28, 0.11, 0.32, 1)',
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="mx-7 border-t border-neutral-300/70" />
                    <div className="space-y-1 px-7 py-5 text-sm leading-7 text-neutral-600">
                      {f.a.split('\n').filter(Boolean).map((line, lineIndex) => (
                        <p key={lineIndex}>• {line.replace(/^•\s*/, '')}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
