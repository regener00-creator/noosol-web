import { site } from '@/lib/site';

export const metadata = { title: 'ติดต่อเรา' };

const channels = [
  ['LINE', (s) => s.lineId, (s) => s.lineHref, 'ช่องทางที่ตอบไวที่สุด ส่งโลโก้ขอราคาได้เลย'],
  ['โทรศัพท์', (s) => s.phone, (s) => s.phoneHref, 'โทรคุยรายละเอียดกับทีมงานโดยตรง'],
  ['Facebook', () => 'NOOSOLBAG', (s) => s.facebook, 'ดูอัปเดตผลงานและรีวิวลูกค้า'],
  ['Shopee', () => 'noosolbag', (s) => s.shopee, 'สั่งซื้อจำนวนน้อยผ่าน Shopee'],
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">ติดต่อเรา</h1>
      <p className="mt-2 max-w-xl text-neutral-500">
        เลือกช่องทางที่สะดวก ทีมงานพร้อมให้คำปรึกษาเรื่องขนาด สี และแบบสกรีน
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {channels.map(([name, value, href, desc]) => (
          <a
            key={name}
            href={href(site)}
            target={name === 'โทรศัพท์' ? undefined : '_blank'}
            rel="noreferrer"
            className="group rounded-3xl border border-line p-7 transition hover:bg-soft"
          >
            <div className="text-sm text-neutral-400">{name}</div>
            <div className="mt-1 text-xl font-extrabold tracking-tight group-hover:text-neutral-600">
              {value(site)}
            </div>
            <p className="mt-2 text-sm text-neutral-500">{desc}</p>
          </a>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-line">
        <iframe
          src={site.mapEmbed}
          title="แผนที่ร้าน NOOSOL"
          className="h-[420px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
