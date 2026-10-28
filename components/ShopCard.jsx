import Image from 'next/image';

// การ์ดสินค้า — รหัสรุ่น ขนาด และราคา
export default function ShopCard({ p }) {
  const sizeText = p.sizeLabel || (p.size === 'มีหลายขนาด' ? p.size : `${p.size} นิ้ว`);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="bg-soft">
        {p.image ? (
          <Image
            src={p.image}
            alt={`ถุงสปันบอนด์ ${p.category} รุ่น ${p.code}`}
            width={400}
            height={400}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center text-sm text-neutral-300">
            ไม่มีรูป
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 text-center">
        <p className="text-xs font-normal leading-5 text-neutral-400">{p.code}</p>
        <p className="mt-1 text-lg font-bold leading-7 text-ink">
          {sizeText}
        </p>
        <div className="mt-auto pt-3">
          {p.retail != null && (
            <span className="text-[15px] font-bold text-[#eb7300]">
              ฿{Number(p.retail).toFixed(0)}
              <span className="ml-1 text-[15px] font-normal text-ink">/ ใบ</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
