import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ p, badge }) {
  return (
    <Link href={`/products/${encodeURIComponent(p.code)}`} className="group">
      <div className="relative overflow-hidden rounded-3xl bg-soft">
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
        {p.image ? (
          <Image
            src={p.image}
            alt={`ถุงสปันบอนด์ รุ่น ${p.code}`}
            width={480}
            height={480}
            className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center text-neutral-300">
            ไม่มีรูป
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="font-bold tracking-tight">รุ่น {p.code}</div>
          <div className="mt-0.5 text-sm text-neutral-500">
            {p.size} นิ้ว · {p.style}
          </div>
        </div>
        {p.retail != null && (
          <div className="whitespace-nowrap text-sm font-semibold">
            ฿{Number(p.retail).toFixed(0)}<span className="text-neutral-400">/ใบ</span>
          </div>
        )}
      </div>
    </Link>
  );
}
