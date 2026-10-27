import Image from 'next/image';

const cardMeta = [
  {
    title: 'สปันบอนด์สต็อก',
    icon: '/services/icon-76.png',
    iconScale: 'scale-[1.15]',
    description: ['รับสกรีนขั้นต่ำ 100 ใบ', 'เฉพาะสีและขนาดในสต็อก'],
  },
  {
    title: 'สปันบอนด์ผลิตใหม่',
    icon: '/services/icon-78.png',
    iconScale: 'scale-[1.30]',
    description: ['รับผลิตขั้นต่ำ 3,000 ใบ', 'พร้อมสีให้เลือกถึง 30 สี'],
  },
  {
    title: 'กระเป๋าผลิตใหม่',
    icon: '/services/icon-77.png',
    iconScale: 'scale-[1.55]',
    description: ['รับผลิตขั้นต่ำ 300 ใบ', 'ส่งแบบเพื่อประเมิณราคาทางแชท'],
  },
];

export default function ServiceCards({ services }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {services.map((service, index) => {
        const meta = cardMeta[index];

        return (
          <a
            key={service.title}
            href={service.href}
            className="group flex min-h-[600px] flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)] sm:p-8"
          >
            <div className="flex min-h-14 items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#eb7300]">
                <Image
                  src={meta.icon}
                  alt=""
                  fill
                  sizes="56px"
                  className={`${meta.iconScale} object-contain brightness-0 invert`}
                />
              </div>
              <h3 className="min-w-0 flex-1 text-[20px] font-extrabold leading-7 tracking-normal">
                {meta.title}
              </h3>
              <span className="font-sans text-[35px] font-bold leading-none text-[#f5d5b7]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="relative mt-8 min-h-[300px] flex-1 overflow-hidden bg-white">
              <Image
                src={service.image}
                alt={meta.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-contain p-5 transition duration-300 group-hover:scale-[1.03]"
              />
            </div>

            <div className="mt-7 h-px w-full bg-neutral-200" />
            <p className="min-h-[76px] pt-6 text-center text-[17px] font-medium leading-7 text-neutral-600">
              {meta.description.map((line, lineIndex) => (
                <span key={line} className={`block ${lineIndex === 0 ? 'font-bold text-neutral-900' : ''}`}>
                  {line}
                </span>
              ))}
            </p>
          </a>
        );
      })}
    </div>
  );
}
