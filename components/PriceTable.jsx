const tiers = ['100-200', '300-400', '500-1000', '2000+'];

const tierLabel = {
  '100-200': '100–200 ใบ',
  '300-400': '300–400 ใบ',
  '500-1000': '500–1,000 ใบ',
  '2000+': '2,000 ใบขึ้นไป',
};

// ตารางราคาต่อรุ่น: ถุงเปล่า + สกรีน 1–4 สี ตามช่วงจำนวน
export default function PriceTable({ p }) {
  const rows = [
    ['ถุงเปล่า (ขายส่ง)', p.wholesale],
    ['สกรีน 1 สี', p.screen1],
    ['สกรีน 2 สี', p.screen2],
    ['สกรีน 3 สี', p.screen3],
    ['สกรีน 4 สี', p.screen4],
  ].filter(([, v]) => v);

  return (
    <div className="overflow-x-auto rounded-3xl border border-line">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-line bg-soft text-left">
            <th className="px-5 py-3.5 font-semibold">ราคา/ใบ</th>
            {tiers.map((t) => (
              <th key={t} className="px-5 py-3.5 text-right font-semibold">
                {tierLabel[t]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, prices]) => (
            <tr key={label} className="border-b border-line last:border-0">
              <td className="px-5 py-3.5 font-medium">{label}</td>
              {tiers.map((t) => (
                <td key={t} className="px-5 py-3.5 text-right tabular-nums">
                  {prices[t] != null ? `฿${Number(prices[t]).toFixed(2)}` : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
