'use client';

import { useEffect, useRef } from 'react';

export default function LazyVideo({ src, poster, className, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    let visible = false;

    const updatePlayback = () => {
      const manual = reducedMotion.matches || Boolean(connection?.saveData);
      video.controls = manual;
      if (visible && !document.hidden && !manual) {
        if (!video.hasAttribute('src')) video.src = src;
        video.play().catch(() => { video.controls = true; });
      } else {
        video.pause();
        // On reduced-motion/data-saving devices, only load after a deliberate play.
        if (visible && manual && !video.hasAttribute('src')) video.src = src;
      }
    };

    if (!('IntersectionObserver' in window)) {
      video.src = src;
      video.controls = true;
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.1 });

    observer.observe(video);
    document.addEventListener('visibilitychange', updatePlayback);
    reducedMotion.addEventListener('change', updatePlayback);
    connection?.addEventListener?.('change', updatePlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updatePlayback);
      reducedMotion.removeEventListener('change', updatePlayback);
      connection?.removeEventListener?.('change', updatePlayback);
      video.pause();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      className={className}
      preload="none"
      muted
      loop
      playsInline
      controls
      disablePictureInPicture
      {...props}
    />
  );
}
