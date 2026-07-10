import Image from 'next/image';
import { getGallery } from '@/lib/data';
import { site } from '@/lib/site';

export const revalidate = 3600;

export const metadata = { title: 'ผลงานของเรา' };

export default async function PortfolioPage() {
  const gallery = await getGallery();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">ผลงานของเรา</h1>
      <p className="mt-2 max-w-xl text-neutral-500">
        ตัวอย่างงานสกรีนจริงที่ส่งมอบให้ลูกค้า
      </p>

      <div className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>div]:mb-4">
        {gallery.map((g) => (
          <div key={g.id} className="overflow-hidden rounded-3xl bg-soft">
            <Image
              src={g.image}
              alt={g.title || 'ผลงาน NOOSOL'}
              width={600}
              height={600}
              className="w-full object-cover"
            />
          </div>
        ))}
      </div>

      <section id="reviews" className="mt-16 rounded-3xl bg-soft p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold tracking-tight">อยากเห็นงานแบบของคุณ?</h2>
        <p className="mx-auto mt-2 max-w-md text-neutral-500">
          ส่งโลโก้มาให้เราดู เดี๋ยวช่วยแนะนำรุ่นถุง สี และแบบสกรีนที่เหมาะที่สุด
        </p>
        <a
          href={site.lineHref}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          ทัก LINE {site.lineId}
        </a>
      </section>
    </div>
  );
}
