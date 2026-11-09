import Image from 'next/image';

export default function LogoMarquee({ images, direction = 'left', duration = '180s' }) {
  return (
    <div className="logo-marquee-fade marquee overflow-hidden rounded-xl bg-white py-2">
      <div
        className={`flex w-max ${direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'}`}
        style={{ animationDuration: duration }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-3 pr-3">
            {images.map((src) => (
              <div key={src} className="logo-marquee-cell flex h-[96px] w-[110px] shrink-0 items-center justify-center p-0.5 sm:h-[104px] sm:w-[120px] md:p-3">
                <Image
                  src={src}
                  alt={copy === 0 ? 'โลโก้ลูกค้า NOOSOL' : ''}
                  width={160}
                  height={160}
                  sizes="(min-width: 1024px) and (hover: hover) and (pointer: fine) 144px, (max-width: 639px) 110px, 120px"
                  loading="eager"
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
