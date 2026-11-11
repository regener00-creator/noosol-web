import SectionDeck from '@/components/SectionDeck';
import Image from 'next/image';
import { getProducts, getColors, getFaq } from '@/lib/data';
import ProductExplorer from '@/components/ProductExplorer';
import ServiceCards from '@/components/ServiceCards';
import PortfolioExplorer from '@/components/PortfolioExplorer';
import ProductionVideos from '@/components/ProductionVideos';
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

// กล่องครอบเนื้อหาแต่ละส่วน
const Container = ({ children }) => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
);

export default async function Home() {
  const [products, colors, faq] = await Promise.all([getProducts(), getColors(), getFaq()]);

  return (
    <SectionDeck>
      {/* หน้าแรก — พื้นเทาแบบ Apple */}
      <section id="home" className="grain-surface scroll-mt-16 bg-soft">
        <Container>
          <div className="home-intro pt-16 text-center sm:pt-44">
            <h1 data-hero-drop data-hero-delay="0" className="font-poppins text-[clamp(2.25rem,10vw,3.25rem)] font-extrabold leading-none tracking-normal text-[#eb7300] sm:text-[8rem]">
              <span className="hero-motion-word">NOOSOL</span>
            </h1>
            <h2 data-hero-drop data-hero-delay="500" className="mx-auto mt-5 max-w-4xl text-[1.75rem] font-extrabold leading-tight tracking-normal sm:text-[2.65rem]">
              <span className="hero-motion-word">โรงงานรับผลิตกระเป๋า</span><wbr /><span className="hero-motion-word" style={{ '--hero-word-delay': '110ms' }}>และถุงผ้าสปันบอนด์</span>
            </h2>
            <p data-hero-drop data-hero-delay="1000" className="mx-auto mt-5 max-w-2xl text-xl font-bold text-ink sm:text-2xl">
              <span className="hero-motion-word">ประสบการณ์มากกว่า</span>{' '}<span className="hero-motion-word hero-motion-underline" style={{ '--hero-word-delay': '110ms' }}>30 ปี</span>
            </p>

            {/* โลโก้ลูกค้าวิ่ง 3 แถว */}
            <div className="home-logos mt-24 space-y-3 sm:mt-32">
              <LogoMarquee direction="left" images={customerLogos.slice(0, 17)} />
              <LogoMarquee direction="right" images={customerLogos.slice(17, 33)} />
              <LogoMarquee direction="left" images={customerLogos.slice(33)} />
            </div>
            <div className="mt-8 hidden md:block">
              <ProductionVideos />
            </div>

          </div>
        </Container>
      </section>

      <section id="services" className="grain-surface scroll-mt-16 bg-soft">
        <ServiceCards stock={<ProductExplorer products={products} inlineGuide />}>
          <div data-reveal className="flex items-center gap-2 md:gap-6">
            <div className="h-px flex-1 bg-neutral-300" />
            <h2 className="rounded-full border border-line bg-white px-3 py-2 text-center text-lg font-extrabold tracking-tight md:px-8 md:py-3 md:text-3xl">
              <span className="md:hidden">สีผ้าสปันบอนด์</span>
              <span className="hidden md:inline">ชาร์ตสีถุงผ้าสปันบอนด์</span>{' '}
              <span className="text-[#eb7300]">เฉพาะผลิตใหม่</span>
            </h2>
            <div className="h-px flex-1 bg-neutral-300" />
          </div>
          <div data-reveal className="color-drop-grid mt-4 grid grid-cols-5 gap-1.5 md:gap-3 lg:grid-cols-10">
            {colors.map((c, index) => (
              <div
                key={c.no}
                className="color-drop-card min-w-0 overflow-hidden rounded-lg md:rounded-2xl bg-white"
                style={{ '--color-drop-delay': `${index * 35}ms` }}
              >
                <Image
                  src={`/spun-colors/${c.no}.png`}
                  alt={`สี${c.name}`}
                  width={300}
                  height={300}
                  sizes="(max-width: 1023px) 20vw, 125px"
                  className="aspect-square w-full object-cover"
                />
                <div className="px-0.5 py-1 text-center text-[10px] font-semibold leading-tight [overflow-wrap:anywhere] md:px-1 md:py-2 md:text-xs">
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </ServiceCards>
      </section>

      {/* ผลงาน — พื้นเทาแบบ Apple */}
      <section id="portfolio" className="grain-surface scroll-mt-16 bg-soft">
        <Container>
          <div className="pb-20 pt-5 md:pt-20">
            <div data-reveal className="hidden items-center gap-3 md:flex sm:gap-5">
              <div className="hidden h-px flex-1 bg-neutral-300 sm:block" />
              <h2 className="rounded-full border border-line bg-white px-5 py-3 text-center text-xl font-extrabold tracking-tight sm:px-8 sm:text-3xl">
                ตัวอย่างงาน
              </h2>
              <div className="hidden h-px flex-1 bg-neutral-300 sm:block" />
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
              <h2 className="rounded-full border border-line bg-white px-5 py-3 text-center text-xl font-extrabold tracking-tight sm:px-8 sm:text-3xl">
                รุ่นสินค้าในสต็อก
              </h2>
              <div className="h-px flex-1 bg-neutral-300" />
            </div>
            <div data-reveal data-reveal-delay="120" className="mt-10">
              <ProductExplorer products={products} />
            </div>
          </div>
        </Container>
      </section>

      <section id="scale" className="scroll-mt-16">
        <Container>
          <div className="py-8">
            <div id="size-guide-slot" />
          </div>
        </Container>
      </section>

      {/* Q&A — พื้นขาว */}
      <section id="qa" className="grain-surface scroll-mt-16 bg-soft">
        <Container>
          <div className="py-20">
            <div data-reveal className="flex items-center gap-4 sm:gap-6">
              <div className="h-px flex-1 bg-neutral-300" />
              <h2 className="rounded-full border border-line bg-white px-5 py-3 text-center text-xl font-extrabold tracking-tight sm:px-8 sm:text-3xl">
                ข้อมูลเบื้องต้น
              </h2>
              <div className="h-px flex-1 bg-neutral-300" />
            </div>
            <div data-reveal data-reveal-delay="90" className="mt-10">
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
              <h2 className="text-xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                วันทำการ: จันทร์ - ศุกร์  | <span className="whitespace-nowrap">10:00 - 18:00</span>
              </h2>
              <div className="mx-auto mt-5 h-1 w-40 rounded-full bg-[#f58220]" />
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <article data-reveal data-reveal-delay="100" className="order-3 md:order-none flex min-h-[220px] min-w-0 sm:min-h-[280px] flex-col items-center rounded-lg bg-[#fff0eb] px-3 py-4 text-center sm:p-6 text-[#171717]">
                <h3 className="text-xl font-extrabold">SHOPEE</h3>
                <Image src="/contact-icons/shopee-20261105.jpg" alt="Shopee" width={64} height={64} className="mt-4 h-14 w-14 rounded-full object-contain" />
                <a href={site.shopee} target="_blank" rel="noreferrer" className="mt-auto w-full rounded-md bg-[#ee4d2d] px-1 py-3 text-center sm:px-4 text-sm font-bold text-white transition hover:bg-[#d94124]">
                  คลิกที่นี่
                </a>
              </article>

              <article data-reveal data-reveal-delay="160" className="order-4 md:order-none flex min-h-[220px] min-w-0 sm:min-h-[280px] flex-col items-center rounded-lg bg-[#eaf2ff] px-3 py-4 text-center sm:p-6 text-[#171717]">
                <h3 className="text-xl font-extrabold">FACEBOOK</h3>
                <Image src="/contact-icons/facebook-20261105.png" alt="Facebook" width={64} height={64} className="mt-4 h-14 w-14 object-contain" />
                <a href={site.facebook} target="_blank" rel="noreferrer" className="mt-auto w-full rounded-md bg-[#1877f2] px-1 py-3 text-center sm:px-4 text-sm font-bold text-white transition hover:bg-[#1267d6]">
                  คลิกที่นี่
                </a>
              </article>

              <article data-reveal data-reveal-delay="220" className="order-1 md:order-none flex min-h-[220px] min-w-0 sm:min-h-[280px] flex-col items-center rounded-lg bg-[#e8faee] px-3 py-4 text-center sm:p-6 text-[#171717]">
                <h3 className="text-xl font-extrabold">LINE</h3>
                <Image src="/contact-icons/line-20261105.png" alt="LINE" width={64} height={64} className="mt-4 h-14 w-14 object-contain" />
                <p className="mt-4 text-xs font-bold leading-5 text-neutral-600 md:text-sm md:leading-6">
                  🌟ช่องทางติดต่อที่แนะนำ🌟
                </p>
                <a href={site.lineHref} target="_blank" rel="noreferrer" className="mt-auto w-full rounded-md bg-[#06c755] px-1 py-3 text-center sm:px-4 text-sm font-bold text-white transition hover:bg-[#05ae4a]">
                  LINE: @NOOSOL
                </a>
              </article>

              <article data-reveal data-reveal-delay="280" className="order-2 md:order-none flex min-h-[220px] min-w-0 sm:min-h-[280px] flex-col items-center rounded-lg bg-[#e7e7e7] px-3 py-4 text-center sm:p-6 text-[#171717]">
                <h3 className="text-xl font-extrabold">CALL</h3>
                <Image src="/contact-icons/call-20261105.png" alt="โทรศัพท์" width={64} height={64} className="mt-4 h-14 w-14 object-contain" />
                <a href={site.phoneHref} className="mt-auto w-full rounded-md bg-black px-1 py-3 text-center sm:px-4 text-sm font-bold text-white transition hover:bg-neutral-800">
                  {site.phone}
                </a>
              </article>
              </div>

            <div data-reveal className="mt-12 overflow-hidden rounded-lg border border-line">
              <iframe
                src={site.mapEmbed}
                title="แผนที่ร้าน NOOSOL"
                className="h-[420px] w-full sm:h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div data-reveal className="mt-6 overflow-hidden rounded-lg border border-line bg-white">
              <Image
                src="/contact/storefront-2.jpg"
                alt="หน้าร้านและพื้นที่แสดงสินค้าตัวอย่าง NOOSOL"
                width={1920}
                height={1280}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>
    </SectionDeck>
  );
}
