import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getColors } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { site } from '@/lib/site';

export const revalidate = 3600;

const index = [
  {
    title: 'หมวดหมู่',
    links: [
      ['ถุงไม่ขยายข้าง', '/products?cat=ไม่ขยาย'],
      ['ถุงขยายเฉพาะก้น', '/products?cat=ขยายก้น'],
      ['ถุงขยายข้างและก้น', '/products?cat=ขยายข้างและก้น'],
      ['ถุงทั้งหมด', '/products'],
    ],
  },
  {
    title: 'บริการ',
    links: [
      ['สกรีนโลโก้ 1–4 สี', '/pricing'],
      ['ถุงสต็อกพร้อมส่ง', '/products'],
      ['สั่งผลิตใหม่ตามแบบ', '/qa'],
      ['จัดส่งทั่วประเทศ', '/qa'],
    ],
  },
  {
    title: 'ข้อมูล',
    links: [
      ['ตารางราคา', '/pricing'],
      ['ชาร์ตสีผ้า', '/#colors'],
      ['ผลงานของเรา', '/portfolio'],
      ['คำถามที่พบบ่อย', '/qa'],
    ],
  },
  {
    title: 'สั่งซื้อ',
    links: [
      ['LINE', null, 'line'],
      ['Facebook', null, 'facebook'],
      ['Shopee', null, 'shopee'],
      ['โทรหาเรา', null, 'phone'],
    ],
  },
];

const external = {
  line: site.lineHref,
  facebook: site.facebook,
  shopee: site.shopee,
  phone: site.phoneHref,
};

export default async function Home() {
  const [products, colors] = await Promise.all([getProducts(), getColors()]);
  const featured = products.filter((p) => p.image).slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Hero */}
      <section className="pt-14 sm:pt-20">
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          โรงงานผลิตกระเป๋า และ<br className="hidden sm:block" /> ถุงผ้าสปันบอนด์ครบวงจร
        </h1>
        <p className="mt-4 max-w-xl text-lg text-neutral-500">
          ประสบการณ์กว่า 30 ปี ถุงสต็อกพร้อมสกรีนโลโก้ เริ่มต้น 100 ใบ ราคาโรงงาน ส่งทั่วประเทศ
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
          >
            ดูสินค้าทั้งหมด
          </Link>
          <a
            href={site.lineHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-7 py-3 text-sm font-semibold transition hover:bg-soft"
          >
            ทัก LINE ขอราคา
          </a>
        </div>
      </section>

      {/* Link index — Mobbin style */}
      <section className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-12 lg:grid-cols-4">
        {index.map((col) => (
          <div key={col.title}>
            <div className="text-sm text-neutral-400">{col.title}</div>
            <ul className="mt-3 space-y-2.5">
              {col.links.map(([label, href, ext]) =>
                ext ? (
                  <li key={label}>
                    <a
                      href={external[ext]}
                      target={ext === 'phone' ? undefined : '_blank'}
                      rel="noreferrer"
                      className="text-lg font-bold tracking-tight transition hover:text-neutral-500 sm:text-xl"
                    >
                      {label}
                    </a>
                  </li>
                ) : (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-lg font-bold tracking-tight transition hover:text-neutral-500 sm:text-xl"
                    >
                      {label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </section>

      {/* Featured products */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">รุ่นยอดนิยม</h2>
            <p className="mt-1 text-neutral-500">ถุงสต็อกพร้อมสกรีน จัดส่งไว</p>
          </div>
          <Link
            href="/products"
            className="rounded-full border border-line px-5 py-2 text-sm font-semibold transition hover:bg-soft"
          >
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.code} p={p} badge={i < 2 ? 'ขายดี' : undefined} />
          ))}
        </div>
      </section>

      {/* Colors */}
      <section id="colors" className="mt-20 rounded-3xl bg-soft p-8 sm:p-12">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          สีผ้าให้เลือกกว่า {colors.length} สี
        </h2>
        <p className="mt-1 text-neutral-500">
          สีสต็อกพร้อมผลิต ดูสีจริงได้ที่หน้าร้าน หรือขอดูตัวอย่างทางไลน์
        </p>
        <div className="mt-8 grid grid-cols-5 gap-3 sm:grid-cols-8 lg:grid-cols-10">
          {colors.map((c) => (
            <div key={c.no} className="text-center">
              <Image
                src={c.image}
                alt={c.name}
                width={80}
                height={80}
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <div className="mt-1.5 truncate text-[11px] text-neutral-500">{c.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="mt-20 grid gap-6 sm:grid-cols-3">
        {[
          ['30+ ปี', 'ประสบการณ์การผลิต เรามุ่งมั่นใช้วัสดุที่ได้คุณภาพ'],
          ['เริ่มต้น 100 ใบ', 'ถุงสต็อกพร้อมสกรีนโลโก้ ราคาโรงงาน ไม่ต้องรอผลิตนาน'],
          ['ให้คำปรึกษาฟรี', 'ช่วยเลือกขนาด สี และแบบสกรีน พร้อมดูแลหลังการขาย'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-3xl border border-line p-8">
            <div className="text-3xl font-extrabold tracking-tight">{t}</div>
            <p className="mt-2 text-sm leading-6 text-neutral-500">{d}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-20 rounded-3xl bg-ink px-8 py-14 text-center text-white sm:py-16">
        <h2 className="text-3xl font-extrabold tracking-tight">พร้อมเริ่มงานของคุณแล้วหรือยัง?</h2>
        <p className="mx-auto mt-3 max-w-md text-neutral-300">
          ส่งโลโก้และจำนวนที่ต้องการมาทางไลน์ รับใบเสนอราคาภายในวันเดียว
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={site.lineHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-ink transition hover:bg-neutral-200"
          >
            ทัก LINE {site.lineId}
          </a>
          <a
            href={site.phoneHref}
            className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            โทร {site.phone}
          </a>
        </div>
      </section>
    </div>
  );
}
