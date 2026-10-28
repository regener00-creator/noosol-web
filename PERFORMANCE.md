# Performance and measurement

- The full-screen InitialLoader is retained as a fallback component but is no longer mounted. Hero copy is visible in the server-rendered HTML, without waiting for hydration or entrance animations.
- Showcase videos render posters with preload="none" and no source URL until they enter the viewport. They pause offscreen or when the tab is hidden. Reduced-motion and data-saving users get manual playback.
- Existing Google Sans typography, Poppins hero branding and bold product prices are preserved.

## Enable GA4

Analytics is OFF unless NEXT_PUBLIC_GA_MEASUREMENT_ID contains a valid G-... ID and the build is production. Set that public ID on the existing Vercel noosol project, then redeploy. No account/property is created by this code change.

The Google tag loads after hydration. It sends its standard page_view; do not add another manual page_view. The site is currently one page, with anchor navigation.

contact_click records channel (line, phone, shopee, facebook) and placement (header, contact_section, page), without forwarding link URLs, phone numbers or message text. A click indicates intent to contact, not a completed inquiry or sale. Ad blockers or navigating away may prevent collection. Development traffic is disabled.

## Verify and read reports

After adding the real ID and redeploying, check GA4 Realtime/DebugView for one page_view and one contact_click per click, and verify all links still open normally. Register channel and placement as event-scoped custom dimensions to break down contact clicks. View traffic and devices in GA4 Reports. Data before activation cannot be recovered.

Measure mobile performance before/after with the same device/network and several runs. Removing the loader eliminates an intentional minimum wait of about 2.3 seconds; this is not a measured improvement to network latency or a Lighthouse score.
