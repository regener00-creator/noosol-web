import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/data';
import PriceTable from '@/components/PriceTable';
import ProductCard from '@/components/ProductCard';
import { site } from '@/lib/site';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  return { title: `รุ่น ${decodeURIComponent(params.code)}` };
}

export default async function ProductPage({ params }) {
  const p = await getProduct(params.code);
  if (!p) notFound();

  const all = await getProducts();
  const related = all.filter((x) => x.code !== p.code && x.category === p.category).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <nav className="text-sm text-neutral-400">
        <Link href="/products" className="hover:text-ink">สินค้า</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">รุ่น {p.code}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-soft">
          {p.image ? (
            <Image
              src={p.image}
              alt={`ถุงสปันบอนด์ รุ่น ${p.code}`}
              width={800}
              height={800}
              priority
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-neutral-300">ไม่มีรูป</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">รุ่น {p.code}</h1>
          <dl className="mt-6 space-y-3 text-[15px]">
            <div className="flex gap-3">
              <dt className="w-32 shrink-0 text-neutral-400">ขนาด</dt>
              <dd className="font-semibold">{p.size} นิ้ว</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 shrink-0 text-neutral-400">ทรงถุง</dt>
              <dd className="font-semibold">{p.style}</dd>
            </div>
            {p.logo_area && (
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-neutral-400">พื้นที่สกรีนโลโก้</dt>
                <dd className="font-semibold">{p.logo_area}</dd>
              </div>
            )}
            {p.retail != null && (
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-neutral-400">ราคาปลีก</dt>
                <dd className="font-semibold">฿{Number(p.retail).toFixed(2)}/ใบ</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={site.lineHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              สั่งซื้อรุ่นนี้ทาง LINE
            </a>
            <a
              href={site.phoneHref}
              className="rounded-full border border-line px-7 py-3 text-sm font-semibold transition hover:bg-soft"
            >
              โทร {site.phone}
            </a>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-extrabold tracking-tight">ตารางราคา</h2>
            <p className="mb-4 mt-1 text-sm text-neutral-500">
              ราคารวมสกรีนโลโก้แล้ว (สกรีน 1 ตำแหน่ง) ยิ่งสั่งเยอะยิ่งถูก
            </p>
            <PriceTable p={p} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight">รุ่นใกล้เคียง</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.code} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
