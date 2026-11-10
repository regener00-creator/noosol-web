'use client';

import { useEffect, useRef } from 'react';

export default function LazyVideo({ src, mobileSrc, poster, className, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    let visible = false;

    function loadSource() {
      if (video.hasAttribute('src')) return;
      const compact = window.matchMedia('(max-width: 767px)').matches || connection?.saveData;
      video.src = compact && mobileSrc ? mobileSrc : src;
    }

    const updatePlayback = () => {
      const manual = reducedMotion.matches || Boolean(connection?.saveData);
      video.controls = manual;
      if (visible && !document.hidden && !manual) {
        loadSource();
        video.play().catch(() => { video.controls = true; });
      } else {
        video.pause();
        // On reduced-motion/data-saving devices, only load after a deliberate play.
        if (visible && manual) loadSource();
      }
    };

    if (!('IntersectionObserver' in window)) {
      loadSource();
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
  }, [src, mobileSrc]);

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
