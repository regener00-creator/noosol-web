import LazyVideo from './LazyVideo';

const showcaseVideos = ['K1-h264.mp4', 'K2-h264.mp4', 'K3-h264.mp4', 'K4-h264.mp4'];

export default function ProductionVideos({ mobile = false }) {
  const files = mobile ? showcaseVideos.slice(0, 3) : showcaseVideos;
  return (
    <div className="service-opening-videos">
      {files.map((file, index) => (
        <LazyVideo
          key={file}
          src={`/videos/${file}`}
          mobileSrc={`/videos/${file.replace('-h264.mp4', '-mobile.mp4')}`}
          poster={`/videos/${file.replace('.mp4', '-poster.jpg')}`}
          aria-label={`วิดีโอผลงานการผลิต NOOSOL คลิปที่ ${index + 1}`}
          className="block aspect-[9/16] w-full rounded-2xl bg-black object-cover"
        />
      ))}
    </div>
  );
}
