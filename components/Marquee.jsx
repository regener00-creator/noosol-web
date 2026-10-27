import Image from 'next/image';

// แถบรูปวิ่งอัตโนมัติ — direction: 'left' (ขวาไปซ้าย) หรือ 'right' (ซ้ายไปขวา)
export default function Marquee({ images, direction = 'left', duration = '300s' }) {
  const doubled = [...images, ...images];
  return (
    <div className="marquee overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'
        }`}
        style={{ animationDuration: duration }}
      >
        {doubled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="w-[420px] shrink-0 overflow-hidden rounded-2xl bg-white sm:w-[560px]"
          >
            <Image
              src={src}
              alt="ผลงาน NOOSOL"
              width={1660}
              height={632}
              className="w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
