import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 text-center sm:px-6">
      <div className="text-6xl font-extrabold tracking-tight">404</div>
      <p className="mt-3 text-neutral-500">ไม่พบหน้าที่คุณกำลังหา</p>
      <Link
        href="/"
        className="mt-7 inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
      >
        กลับหน้าแรก
      </Link>
    </div>
  );
}
