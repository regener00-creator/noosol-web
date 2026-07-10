import Link from 'next/link';
import { site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-xl font-extrabold tracking-tight">{site.name}</div>
          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">{site.description}</p>
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-400">เมนู</div>
          <ul className="mt-3 space-y-2 text-sm font-medium">
            <li><Link href="/products" className="hover:text-neutral-500">สินค้า</Link></li>
            <li><Link href="/pricing" className="hover:text-neutral-500">ตารางราคา</Link></li>
            <li><Link href="/portfolio" className="hover:text-neutral-500">ผลงาน</Link></li>
            <li><Link href="/qa" className="hover:text-neutral-500">คำถามที่พบบ่อย</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-400">ติดต่อ</div>
          <ul className="mt-3 space-y-2 text-sm font-medium">
            <li><a href={site.lineHref} target="_blank" rel="noreferrer" className="hover:text-neutral-500">LINE {site.lineId}</a></li>
            <li><a href={site.phoneHref} className="hover:text-neutral-500">โทร {site.phone}</a></li>
            <li><a href={site.facebook} target="_blank" rel="noreferrer" className="hover:text-neutral-500">Facebook</a></li>
            <li><a href={site.shopee} target="_blank" rel="noreferrer" className="hover:text-neutral-500">Shopee</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} {site.name} — {site.tagline}
      </div>
    </footer>
  );
}
