// Keep contact events categorical: never send phone numbers, messages or URLs.
export function getContactChannel(href, origin) {
  let url;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  if (url.protocol === 'tel:') return 'phone';
  if (url.protocol !== 'https:') return null;
  if (url.hostname === 'line.me') return 'line';
  if (['shopee.co.th', 'www.shopee.co.th'].includes(url.hostname)) return 'shopee';
  if (['facebook.com', 'www.facebook.com'].includes(url.hostname)) return 'facebook';
  return null;
}

export function isMeasurementId(value) {
  return typeof value === 'string' && /^G-[A-Z0-9]+$/.test(value);
}
