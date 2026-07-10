import { getFaq } from '@/lib/data';
import Faq from '@/components/Faq';
import { site } from '@/lib/site';

export const revalidate = 3600;

export const metadata = { title: 'คำถามที่พบบ่อย' };

export default async function QaPage() {
  const faq = await getFaq();

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">คำถามที่พบบ่อย</h1>
      <p className="mt-2 text-neutral-500">
        ไม่เจอคำตอบที่ต้องการ? ทัก LINE {site.lineId} ได้เลย ตอบไวครับ
      </p>
      <div className="mt-8">
        <Faq items={faq} />
      </div>
    </div>
  );
}
