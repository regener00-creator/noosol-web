'use client';

import { useEffect } from 'react';

export default function RevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    const heroElements = Array.from(document.querySelectorAll('[data-hero-drop]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let heroReady = document.documentElement.dataset.loaderDone === 'true';

    const revealHero = () => {
      heroReady = true;
      heroElements.forEach((element) => {
        const delay = element.dataset.heroDelay || '0';
        element.style.setProperty('--hero-drop-delay', `${delay}ms`);
        element.classList.add('is-hero-entered');
      });
    };

    window.addEventListener('noosol:loader-complete', revealHero);
    if (heroReady || !document.querySelector('.initial-loader')) revealHero();

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-revealed'));
      heroElements.forEach((element) => element.classList.add('is-hero-entered'));
      return () => window.removeEventListener('noosol:loader-complete', revealHero);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay || '0';
            entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
            entry.target.classList.add('is-revealed');
          } else {
            entry.target.classList.remove('is-revealed');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -35px' }
    );

    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (!heroReady) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-hero-entered');
          else entry.target.classList.remove('is-hero-entered');
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));
    heroElements.forEach((element) => heroObserver.observe(element));
    return () => {
      observer.disconnect();
      heroObserver.disconnect();
      window.removeEventListener('noosol:loader-complete', revealHero);
    };
  }, []);

  return null;
}
