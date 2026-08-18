export const supportEmail = 'quickal.dev@gmail.com';
export const supportPhone = '0329 7590468';
export const whatsappUrl = 'https://wa.me/923297590468';
export const apiPrivacyUrl = 'https://api.quickalapp.com/privacy-policy';
export const apiDeleteUrl = 'https://api.quickalapp.com/delete-account';
export const apiRefundUrl = 'https://api.quickalapp.com/refund-policy';
export const apiBaseUrl = 'https://api.quickalapp.com';
// Counted download: the API logs the hit for the owner dashboard, then
// redirects to the real APK file from the live release policy.
export const directApkUrl = `${apiBaseUrl}/api/downloads/apk`;
// Video guides (how to use the app + who we are) and social page.
export const youtubePlaylistUrl = 'https://www.youtube.com/playlist?list=PLHV3ATsOdETE';
export const facebookUrl = 'https://www.facebook.com/profile.php?id=61590000736332';

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/#features' },
  { label: 'How to Use', href: '/#how-to' },
  { label: 'Screenshots', href: '/#screenshots' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Support', href: '/support' },
  { label: 'Privacy', href: '/privacy-policy' },
];

/**
 * Scroll-reveal wrapper: renders hidden, then animates in the first time it
 * enters the viewport (IntersectionObserver). `variant` picks the motion
 * (up / fade / scale / left / right) and `delay` staggers siblings.
 * Respects prefers-reduced-motion via CSS.
 */
