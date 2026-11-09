'use client';

import { useEffect, useRef } from 'react';

export default function SectionDeck({ children }) {
  const root = useRef(null);

  useEffect(() => {
    const deck = root.current;
    const panels = Array.from(deck.children);
    const mobile = window.matchMedia('(max-width: 767px)');
    const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current;
    let animations = [];

    function stopSlide() {
      for (const animation of animations) animation.cancel();
      animations = [];
    }

    function resolve(hash) {
      if (hash === '#size-guide' || hash === '#scale') {
        const panel = document.getElementById(mobile.matches ? 'scale' : 'products');
        const guide = document.getElementById('size-guide');
        return { panel, target: !mobile.matches && panel.contains(guide) ? guide : panel };
      }
      const target = document.getElementById(hash.slice(1) || 'home');
      const panel = panels.find((item) => item.contains(target));
      return panel ? { panel, target } : null;
    }

    function show(destination, animate) {
      const { panel, target } = destination;
      const previous = current;
      const change = previous !== panel;
      const moveFocus = previous?.contains(document.activeElement);
      if (change) {
        stopSlide();
        current = panel;
        for (const item of panels) {
          item.hidden = item !== panel && item !== previous;
          item.inert = item !== panel;
        }
        deck.dataset.active = panel.id;
        window.dispatchEvent(new Event('noosol:section-change'));
      }

      // Measure the anchor in layout coordinates while its reveal animation runs.
      let top = 0;
      for (let node = target; node && node !== panel; node = node.offsetParent) {
        top += node.offsetTop;
      }
      panel.scrollTop = Math.max(0, top - 16);

      if (!change || !previous) return;
      if (moveFocus) panel.focus({ preventScroll: true });
      if (!animate || reduced.matches) {
        previous.hidden = true;
        return;
      }

      const direction = panels.indexOf(panel) > panels.indexOf(previous) ? 1 : -1;
      const options = { duration: compact.matches ? 240 : 350, easing: 'cubic-bezier(.4,0,.2,1)' };
      const exit = previous.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-direction * 100}%)` }], options);
      const enter = panel.animate([{ transform: `translateX(${direction * 100}%)` }, { transform: 'translateX(0)' }], options);
      animations = [exit, enter];
      exit.onfinish = () => {
        if (current === panel) previous.hidden = true;
      };
    }

    function followLocation() {
      show(resolve(location.hash) || resolve('#home'), true);
    }

    function syncGuideLocation() {
      if (['#size-guide', '#scale'].includes(location.hash)) followLocation();
    }

    function followLink(event) {
      if (event.defaultPrevented || event.button !== 0 ||
          event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || link.target === '_blank') return;
      const destination = resolve(link.hash);
      if (!destination) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      show(destination, true);
    }

    function disable() {
      stopSlide();
      delete deck.dataset.active;
      for (const panel of panels) {
        panel.hidden = false;
        panel.inert = false;
        panel.removeAttribute('tabindex');
      }
      current = null;
    }

    for (const panel of panels) panel.tabIndex = -1;
    followLocation();
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.addEventListener('noosol:guide-placed', syncGuideLocation);
    document.addEventListener('click', followLink, true);
    window.addEventListener('hashchange', followLocation);
    window.addEventListener('popstate', followLocation);
    window.addEventListener('noosol:loader-complete', followLocation);
    return () => {
      window.removeEventListener('noosol:guide-placed', syncGuideLocation);
      document.removeEventListener('click', followLink, true);
      window.removeEventListener('hashchange', followLocation);
      window.removeEventListener('popstate', followLocation);
      window.removeEventListener('noosol:loader-complete', followLocation);
      disable();
    };
  }, []);

  return <div ref={root} className="section-deck">{children}</div>;
}
