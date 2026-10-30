import Image from 'next/image';

// Stock color sets verified against the product photos.
const white = { name: 'ขาว', hex: '#ffffff' };
const black = { name: 'ดำ', hex: '#222222' };
const blue = { name: 'ฟ้า', hex: '#66cce5' };
const yellow = { name: 'เหลือง', hex: '#f4df28' };
const red = { name: 'แดง', hex: '#e32626' };
const pink = { name: 'ชมพู', hex: '#e878b0' };

const fourColors = [white, black, blue, pink];
const sixColors = [white, black, blue, yellow, red, pink];

const stockColorsByModel = {
  '05402': sixColors,
  '04255': sixColors,
  '04508': fourColors,
  '05898': fourColors,
  '11740': sixColors,
  '09106': sixColors,
  '10496': fourColors,
  '04257': sixColors,
  '05899': fourColors,
  '05891': sixColors,
  '07041': sixColors,
  '04259': sixColors,
  '05712': fourColors,
  '10232': fourColors,
  '06074/1': fourColors,
  '07073': sixColors,
  '11144': fourColors,
  '06267': fourColors,
  '11741': fourColors,
};

// การ์ดสินค้า — รหัสรุ่น ขนาด ราคา และสี
export default function ShopCard({ p }) {
  const isOtherCategory = p.category === 'อื่นๆ';
  const stockColors = isOtherCategory ? [] : stockColorsByModel[p.code] || [];
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
      <div className="flex flex-1 flex-col p-4 pb-9 text-center">
        <p className="text-xs font-normal leading-5 text-neutral-400">
          {stockColors.length ? `NO.${p.code}` : p.code}
        </p>
        <p className="mt-1 min-h-14 text-lg font-bold leading-7 text-ink">
          {stockColors.length ? sizeText.replace(/ x /g, ' × ') : sizeText}
        </p>
        <div className="pt-3">
          {p.retail != null && (
            <span className="text-[15px] font-bold text-[#eb7300]">
              ฿{Number(p.retail).toFixed(0)}
              <span className="ml-1 text-[15px] font-normal text-ink">/ ใบ</span>
            </span>
          )}
        </div>
        {isOtherCategory && (
          <p className="mt-7 text-xs leading-5 text-[#eb7300]">
            สีของรุ่นนี้ มีตามในรูป
          </p>
        )}
        {stockColors.length > 0 && (
          <ul
            className="-mx-2 mt-7 grid min-h-[46px] auto-rows-[20px] grid-cols-4 content-start gap-x-1 gap-y-1.5 text-[10px] leading-5 text-ink sm:mx-0 sm:text-xs"
            aria-label={`สีที่มีในรุ่น ${p.code}`}
            role="list"
          >
            {stockColors.map((color, index) => (
              <li
                key={color.name}
                className={`inline-flex items-center justify-center gap-0.5 whitespace-nowrap sm:gap-1 ${index === 4 ? 'col-start-2' : index === 5 ? 'col-start-3' : ''}`}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full border border-black/15 sm:h-3 sm:w-3"
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
