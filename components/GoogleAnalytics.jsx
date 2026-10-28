'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { getContactChannel, isMeasurementId } from '@/lib/analytics';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const enabled = process.env.NODE_ENV === 'production' && isMeasurementId(measurementId);

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!enabled) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    if (window.__noosolMeasurementId !== measurementId) {
      window.__noosolMeasurementId = measurementId;
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
    }

    const onContactClick = (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!anchor) return;
      const channel = getContactChannel(anchor.href, window.location.origin);
      if (!channel) return;
      const placement = anchor.closest('header') ? 'header' :
        anchor.closest('#contact') ? 'contact_section' : 'page';
      window.gtag('event', 'contact_click', {
        channel,
        placement,
        transport_type: 'beacon',
      });
    };

    document.addEventListener('click', onContactClick, true);
    return () => document.removeEventListener('click', onContactClick, true);
  }, []);

  if (!enabled) return null;
  return (
    <Script
      id="noosol-google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
    />
  );
}
