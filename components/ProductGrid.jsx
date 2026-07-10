'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, initialCat = '' }) {
  const cats = ['ทั้งหมด', ...new Set(products.map((p) => p.category).filter(Boolean))];
  const [cat, setCat] = useState(
    cats.includes(initialCat) ? initialCat : 'ทั้งหมด'
  );

  const shown = cat === 'ทั้งหมด' ? products : products.filter((p) => p.category === cat);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              cat === c ? 'bg-ink text-white' : 'border border-line hover:bg-soft'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => (
          <ProductCard key={p.code} p={p} />
        ))}
      </div>
      {shown.length === 0 && (
        <p className="mt-10 text-center text-neutral-400">ไม่พบสินค้าในหมวดนี้</p>
      )}
    </div>
  );
}
