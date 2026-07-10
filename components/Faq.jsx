'use client';

import { useState } from 'react';

export default function Faq({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="divide-y divide-line rounded-3xl border border-line">
      {items.map((f, i) => {
        const open = openId === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpenId(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-semibold">{f.q}</span>
              <span
                className={`text-xl text-neutral-400 transition-transform ${open ? 'rotate-45' : ''}`}
              >
                +
              </span>
            </button>
            {open && (
              <p className="whitespace-pre-line px-6 pb-6 text-sm leading-7 text-neutral-600">
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
