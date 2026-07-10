import Link from 'next/link';
import { getProducts } from '@/lib/data';
import { site } from '@/lib/site';

export const revalidate = 3600;

export const metadata = { title: 'ตารางราคา' };

const tiers = ['100-200', '300-400', '500-1000', '2000+'];
const tierLabel = {
  '100-200': '100–200',
  '300-400': '300–400',
  '500-1000': '500–1,000',
  '2000+': '2,000+',
};

export default async function PricingPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">ตารางราคา</h1>
      <p className="mt-2 max-w-2xl text-neutral-500">
        ราคาถุงพร้อมสกรีนโลโก้ 1 สี 1 ตำแหน่ง (บาท/ใบ) — กดที่รุ่นเพื่อดูราคาสกรีน 2–4 สี
        และราคาถุงเปล่า
      </p>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line bg-soft text-left">
              <th className="px-5 py-3.5 font-semibold">รุ่น</th>
              <th className="px-5 py-3.5 font-semibold">ขนาด (นิ้ว)</th>
              <th className="px-5 py-3.5 font-semibold">ทรง</th>
              {tiers.map((t) => (
                <th key={t} className="px-5 py-3.5 text-right font-semibold">
                  {tierLabel[t]} ใบ
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.code} className="border-b border-line last:border-0 hover:bg-soft/60">
                <td className="px-5 py-3.5">
                  <Link href={`/products/${encodeURIComponent(p.code)}`} className="font-bold hover:underline">
                    {p.code}
                  </Link>
                </td>
                <td className="px-5 py-3.5">{p.size}</td>
                <td className="px-5 py-3.5">{p.style}</td>
                {tiers.map((t) => (
                  <td key={t} className="px-5 py-3.5 text-right tabular-nums">
                    {p.screen1?.[t] != null ? `฿${Number(p.screen1[t]).toFixed(2)}` : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 rounded-3xl bg-soft p-8 text-center">
        <p className="font-semibold">ต้องการใบเสนอราคา หรือจำนวนมากกว่านี้?</p>
        <p className="mt-1 text-sm text-neutral-500">ส่งโลโก้และจำนวนมาทางไลน์ ตอบไวภายในวันเดียว</p>
        <a
          href={site.lineHref}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          ทัก LINE {site.lineId}
        </a>
      </div>
    </div>
  );
}
