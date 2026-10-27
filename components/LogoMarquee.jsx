import Image from 'next/image';

// แถบโลโก้ลูกค้าวิ่งอัตโนมัติ — direction: 'left' หรือ 'right'
export default function LogoMarquee({ images, direction = 'left', duration = '180s' }) {
  const doubled = [...images, ...images];
  return (
    <div className="logo-marquee-fade marquee overflow-hidden rounded-xl bg-white py-2">
      <div
        className={`flex w-max gap-3 ${
          direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'
        }`}
        style={{ animationDuration: duration }}
      >
        {doubled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="flex h-[96px] w-[110px] shrink-0 items-center justify-center p-3 sm:h-[104px] sm:w-[120px]"
          >
            <Image
              src={src}
              alt="โลโก้ลูกค้า NOOSOL"
              width={160}
              height={160}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
