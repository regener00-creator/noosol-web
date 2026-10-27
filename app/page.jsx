import Image from 'next/image';
import { getProducts, getColors, getFaq } from '@/lib/data';
import ProductExplorer from '@/components/ProductExplorer';
import ServiceCards from '@/components/ServiceCards';
import PortfolioExplorer from '@/components/PortfolioExplorer';
import LogoMarquee from '@/components/LogoMarquee';
import Faq from '@/components/Faq';
import { site } from '@/lib/site';

export const revalidate = 3600;

// โลโก้ลูกค้า — ไฟล์ใน public/customers (ไม่มีเบอร์ 25)
const customerLogos = [
  '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg',
  '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg',
  '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg',
  '26.jpg', '27.png', '28.png', '29.png', '30.jpg', '31.png', '32.png', '33.png',
  '34.png', '35.png', '36.png', '37.png', '38.jpg', '39.png', '40.png', '41.png',
  '42.png', '43.jpg', '44.jpg', '45.jpg', '46.jpg', '47.jpg', '48.jpg', '49.jpg',
  '50.jpg',
].map((f) => `/customers/${f}`);

const showcaseVideos = ['K1-h264.mp4', 'K2-h264.mp4', 'K3-h264.mp4', 'K4-h264.mp4'];

// 3 ก้อนบริการ — การสกรีน & ผลิต
const services = [
  {
    title: 'สกรีนถุงสปันบอนด์ในสต็อก',
    description: 'รับสกรีนขั้นต่ำ 100 ใบ เฉพาะสีและขนาดในสต็อก',
    image: '/services/service-1.png',
    href: '#products',
    color: '#2563eb',
  },
  {
    title: 'ผลิตถุงสปันบอนด์ใหม่',
    description: 'รับผลิตใหม่เริ่มต้น 3,000 ใบ พร้อมสีให้เลือกถึง 30 สี',
    image: '/services/service-2.png',
    href: '#colors',
    color: '#059669',
  },
  {
    title: 'ผลิตกระเป๋าตามแบบ',
    description: 'รับผลิตขั้นต่ำ 300 ใบ ส่งแบบเพื่อประเมิณราคาทางแชท',
    image: '/services/service-3-311.png',
    href: '#contact',
    color: '#ea580c',
  },
];

// กล่องครอบเนื้อหาแต่ละส่วน
const Container = ({ children }) => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
);

export default async function Home() {
  const [products, colors, faq] = await Promise.all([getProducts(), getColors(), getFaq()]);

  return (
    <div>
      {/* หน้าแรก — พื้นเทาแบบ Apple */}
      <section id="home" className="grain-surface scroll-mt-16 bg-soft">
        <Container>
          <div className="pb-20 pt-28 text-center sm:pt-44">
            <h1 data-hero-drop data-hero-delay="0" className="font-poppins text-7xl font-extrabold leading-none tracking-normal text-[#eb7300] sm:text-[8rem]">
              NOOSOL
            </h1>
            <h2 data-hero-drop data-hero-delay="500" className="mx-auto mt-5 max-w-4xl text-[1.75rem] font-extrabold leading-tight tracking-normal sm:text-[2.65rem]">
              โรงงานรับผลิตกระเป๋าและถุงผ้าสปันบอนด์
            </h2>
            <p data-hero-drop data-hero-delay="1000" className="mx-auto mt-5 max-w-2xl text-xl font-bold text-ink sm:text-2xl">
              ประสบการณ์มากกว่า 30 ปี
            </p>

            {/* โลโก้ลูกค้าวิ่ง 3 แถว */}
            <div data-reveal data-reveal-delay="180" className="mt-24 space-y-3 sm:mt-32">
              <LogoMarquee direction="left" images={customerLogos.slice(0, 17)} />
              <LogoMarquee direction="right" images={customerLogos.slice(17, 33)} />
              <LogoMarquee direction="left" images={customerLogos.slice(33)} />
            </div>

            <div id="services" className="scroll-mt-16 pt-20">
              <div data-reveal className="flex items-center gap-4 sm:gap-6">
                <div className="h-px flex-1 bg-neutral-300" />
                <span className="inline-flex rounded-full border border-line bg-white px-8 py-3 text-2xl font-extrabold tracking-tight shadow-sm sm:text-3xl">
                  แบบที่รับผลิต
                </span>
                <div className="h-px flex-1 bg-neutral-300" />
              </div>
              <div data-reveal data-reveal-delay="90" className="mt-16 text-left">
                <ServiceCards services={services} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ผลงาน — พื้นเทาแบบ Apple */}
      <section id="portfolio" className="grain-surface scroll-mt-16 bg-soft">
        <Container>
          <div className="py-20">
            <div data-reveal className="flex items-center gap-3 sm:gap-5">
              <div className="hidden h-px flex-1 bg-neutral-300 sm:block" />
              <h2 className="rounded-full border border-line bg-white px-8 py-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                ตัวอย่างงาน
              </h2>
              <div className="hidden h-px flex-1 bg-neutral-300 sm:block" />
            </div>

            <div className="mt-10 grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
              {showcaseVideos.map((file, index) => (
                <div
                  key={file}
                  data-reveal
                  data-reveal-delay={index * 70}
                  className="min-w-0 overflow-hidden rounded-2xl bg-black shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                >
                  <video
                    src={`/videos/${file}`}
                    poster={`/videos/${file.replace('.mp4', '-poster.jpg')}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    disablePictureInPicture
                    aria-label={`วิดีโอผลงานการผลิต NOOSOL คลิปที่ ${index + 1}`}
                    className="aspect-[9/16] min-w-0 max-w-full bg-black object-cover"
                  />
                </div>
              ))}
            </div>
            <div data-reveal>
              <PortfolioExplorer showHeading={false} />
            </div>
          </div>
        </Container>
      </section>

      {/* สินค้าของเรา — พื้นขาว */}
      <section id="products" className="scroll-mt-16">
        <Container>
          <div className="py-20">
            <div data-reveal className="flex items-center gap-4 sm:gap-6">
              <div className="h-px flex-1 bg-neutral-300" />
              <h2 className="rounded-full border border-line bg-white px-8 py-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                รุ่นสินค้าในสต็อก
              </h2>
              <div className="h-px flex-1 bg-neutral-300" />
            </div>
            <p data-reveal data-reveal-delay="70" className="mt-4 text-center text-neutral-500">
              ตามที่แจ้งด้านล่างนี้ เป็นราคาถุงเปล่า ยังไม่รวมค่าสกรีน
            </p>
            <div data-reveal data-reveal-delay="120" className="mt-10">
              <ProductExplorer products={products} />
            </div>
          </div>
        </Container>
      </section>

      {/* ชาร์ตสี — พื้นเทา */}
      <section id="colors" className="scroll-mt-16 bg-soft">
        <Container>
          <div className="py-20">
            <div data-reveal className="flex items-center gap-4 sm:gap-6">
              <div className="h-px flex-1 bg-neutral-300" />
              <h2 className="rounded-full border border-line bg-white px-8 py-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                ชาร์ตสีถุงผ้าสปันบอนด์{' '}
                <span className="text-[#eb7300]">เฉพาะผลิตใหม่</span>
              </h2>
              <div className="h-px flex-1 bg-neutral-300" />
            </div>
            <p data-reveal data-reveal-delay="70" className="mt-4 text-center text-neutral-500">
              สีในรูปอาจจะแตกต่างกันตามจอแสดงผล อาจมีความคลาดเคลื่อน 10-15%
            </p>
            <div data-reveal data-reveal-delay="120" className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-10">
              {colors.map((c) => (
                <div key={c.no} className="overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={`/spun-colors/${c.no}.png`}
                    alt={`สี${c.name}`}
                    width={300}
                    height={300}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="px-1 py-2 text-center text-xs font-semibold">
                    {c.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Q&A — พื้นขาว */}
      <section id="qa" className="scroll-mt-16">
        <Container>
          <div className="py-20">
            <div data-reveal className="flex items-center gap-4 sm:gap-6">
              <div className="h-px flex-1 bg-neutral-300" />
              <h2 className="rounded-full border border-line bg-white px-8 py-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                ข้อมูลเบื้องต้น
              </h2>
              <div className="h-px flex-1 bg-neutral-300" />
            </div>
            <div data-reveal data-reveal-delay="90" className="mx-auto mt-10 max-w-3xl">
              <Faq items={faq} />
            </div>
          </div>
        </Container>
      </section>

      {/* ติดต่อ */}
      <section id="contact" className="scroll-mt-16 bg-soft text-ink">
        <Container>
          <div className="py-20 sm:py-24">
            <div data-reveal className="text-center">
              <h2 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
                ช่องทางการติดต่อ
              </h2>
              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#f58220]" />
            </div>

            <div data-reveal data-reveal-delay="70" className="mx-auto mt-10 flex max-w-5xl flex-col items-center gap-1 text-center">
              <p className="text-lg font-bold leading-8 text-ink">
                วันเปิดทำการ : จันทร์ - ศุกร์
              </p>
              <p className="text-lg font-bold leading-8 text-ink">
                เวลาทำการ : 10:00 - 18:00
              </p>
              <p className="whitespace-nowrap text-[11px] font-normal leading-8 text-neutral-600 sm:text-lg">
                มีหน้าร้านพร้อมให้บริการ ติดต่อนัดหมาย เพื่อเข้าชมสินค้าตัวอย่างได้เลยครับ
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article data-reveal data-reveal-delay="100" className="flex min-h-[280px] flex-col items-center rounded-lg bg-[#fff0eb] p-6 text-center text-[#171717]">
                <h3 className="text-xl font-extrabold">SHOPEE</h3>
                <Image src="/contact-icons/shopee.svg" alt="Shopee" width={64} height={64} className="mt-4 h-14 w-14 object-contain" />
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  ช่องทางการสั่งซื้อสินค้าปลีก
                </p>
                <a href={site.shopee} target="_blank" rel="noreferrer" className="mt-auto w-full rounded-md bg-[#ee4d2d] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#d94124]">
                  คลิกที่นี่
                </a>
              </article>

              <article data-reveal data-reveal-delay="160" className="flex min-h-[280px] flex-col items-center rounded-lg bg-[#eaf2ff] p-6 text-center text-[#171717]">
                <h3 className="text-xl font-extrabold">FACEBOOK</h3>
                <Image src="/contact-icons/facebook-2.png" alt="Facebook" width={64} height={64} className="mt-4 h-14 w-14 object-contain" />
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  ตัวอย่างผลงาน และ รีวิวจากลูกค้า
                </p>
                <a href={site.facebook} target="_blank" rel="noreferrer" className="mt-auto w-full rounded-md bg-[#1877f2] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#1267d6]">
                  คลิกที่นี่
                </a>
              </article>

              <article data-reveal data-reveal-delay="220" className="flex min-h-[280px] flex-col items-center rounded-lg bg-[#e8faee] p-6 text-center text-[#171717]">
                <h3 className="text-xl font-extrabold">LINE</h3>
                <Image src="/contact-icons/line.svg" alt="LINE" width={64} height={64} className="mt-4 h-14 w-14 object-contain" />
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  ส่งโลโก้ และ สอบถามข้อมูลได้ที่นี่
                </p>
                <a href={site.lineHref} target="_blank" rel="noreferrer" className="mt-auto w-full rounded-md bg-[#06c755] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#05ae4a]">
                  LINE: @NOOSOL
                </a>
              </article>

              <article data-reveal data-reveal-delay="280" className="flex min-h-[280px] flex-col items-center rounded-lg bg-[#e7e7e7] p-6 text-center text-[#171717]">
                <h3 className="text-xl font-extrabold">CALL</h3>
                <Image src="/contact-icons/call.svg" alt="โทรศัพท์" width={64} height={64} className="mt-4 h-14 w-14 object-contain" />
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  โทรสอบถามข้อมูลได้ที่นี่
                </p>
                <a href={site.phoneHref} className="mt-auto w-full rounded-md bg-black px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-neutral-800">
                  {site.phone}
                </a>
              </article>
              </div>

              <div data-reveal className="mt-12 overflow-hidden rounded-lg border border-line bg-white">
                <Image
                  src="/contact/storefront-2.jpg"
                  alt="หน้าร้านและพื้นที่แสดงสินค้าตัวอย่าง NOOSOL"
                  width={1920}
                  height={1280}
                  className="h-auto w-full object-cover"
                />
              </div>

              <div data-reveal className="mt-6 overflow-hidden rounded-lg border border-line">
                <iframe
                  src={site.mapEmbed}
                title="แผนที่ร้าน NOOSOL"
                className="h-[420px] w-full sm:h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
