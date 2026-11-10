import Image from 'next/image';

// Stock color sets verified against the product photos.
const white = 'ขาว';
const black = 'ดำ';
const blue = 'ฟ้า';
const yellow = 'เหลือง';
const red = 'แดง';
const pink = 'ชมพู';

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
      <div className="flex flex-1 flex-col p-4 text-center">
        <p className="text-xs font-normal leading-5 text-neutral-400">
          {stockColors.length ? `NO.${p.code}` : p.code}
        </p>
        <p className="mt-1 min-h-7 text-lg font-bold leading-7 text-ink">
          {stockColors.length ? sizeText.replace(/ x /g, ' × ') : sizeText}
        </p>
        {stockColors.length > 0 && (
          <ul
            className="sr-only"
            aria-label={`สีที่มีในรุ่น ${p.code}`}
            role="list"
          >
            {stockColors.map((color) => (
              <li key={color}>{color}</li>
            ))}
          </ul>
        )}
        <div className="pt-3">
          {p.retail != null && (
            <span className="text-[15px] font-bold text-[#eb7300]">
              ฿{Number(p.retail).toFixed(0)}
              <span className="ml-1 text-[15px] font-normal text-ink">/ ใบ</span>
            </span>
          )}
        </div>
        {isOtherCategory && (
          <p className="mt-3 text-xs leading-5 text-[#eb7300]">
            สีของรุ่นนี้ มีตามในรูป
          </p>
        )}
      </div>
    </div>
  );
}
