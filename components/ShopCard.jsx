import Image from 'next/image';

// Only list colors confirmed for each stock model.
const stockColorsByModel = {
  '04508': [
    { name: 'ขาว', hex: '#ffffff' },
    { name: 'ดำ', hex: '#222222' },
    { name: 'ฟ้า', hex: '#66cce5' },
    { name: 'ชมพู', hex: '#e878b0' },
  ],
};

// การ์ดสินค้า — รหัสรุ่น ขนาด ราคา และสี
export default function ShopCard({ p }) {
  const stockColors = stockColorsByModel[p.code] || [];
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
        <p className={stockColors.length ? 'text-sm font-bold leading-5 text-ink' : 'text-xs font-normal leading-5 text-neutral-400'}>
          {stockColors.length ? `NO.${p.code}` : p.code}
        </p>
        <p className="mt-1 text-lg font-bold leading-7 text-ink">
          {stockColors.length ? sizeText.replace(/ x /g, ' × ') : sizeText}
        </p>
        <div className="mt-auto pt-3">
          {p.retail != null && (
            <span className="text-[15px] font-bold text-[#eb7300]">
              ฿{Number(p.retail).toFixed(0)}
              <span className="ml-1 text-[15px] font-normal text-ink">/ ใบ</span>
            </span>
          )}
        </div>
        {stockColors.length > 0 && (
          <ul
            className="mt-7 flex flex-wrap justify-center gap-x-2 gap-y-1.5 text-xs leading-5 text-ink"
            aria-label={`สีที่มีในรุ่น ${p.code}`}
            role="list"
          >
            {stockColors.map((color) => (
              <li key={color.name} className="inline-flex items-center gap-1 whitespace-nowrap">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full border border-black/15"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
