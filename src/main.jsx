import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  Code2,
  CreditCard,
  Download,
  Facebook,
  FileText,
  Gauge,
  Globe,
  Layers3,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  PackageCheck,
  Phone,
  ReceiptText,
  Scissors,
  Send,
  Server,
  Settings,
  ShieldCheck,
  Smartphone,
  Star,
  Trash2,
  Wrench,
  X,
  Youtube,
} from 'lucide-react';
import './styles.css';
import quickAlLogo from './assets/quick_al_icon.png';
import heroDeskImg from './assets/desk.jpg';
import heroMoboImg from './assets/mobo.jpg';

// Screenshot galleries, one folder per app area (mirrors "App ss" source
// folders). import.meta.glob keeps this maintenance-free: drop new images in
// a folder and they appear on the site after a rebuild.
function sortedShots(globResult) {
  return Object.entries(globResult)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, src]) => src);
}
const estimationShots = sortedShots(
  import.meta.glob('./assets/screenshots/estimation/*.jpg', { eager: true, import: 'default' }),
);
const fabricationShots = sortedShots(
  import.meta.glob('./assets/screenshots/fabrication/*.jpg', { eager: true, import: 'default' }),
);
const glassShots = sortedShots(
  import.meta.glob('./assets/screenshots/glass/*.jpg', { eager: true, import: 'default' }),
);
const settingsShots = sortedShots(
  import.meta.glob('./assets/screenshots/settings/*.jpg', { eager: true, import: 'default' }),
);

const supportEmail = 'quickal.dev@gmail.com';
const supportPhone = '0329 7590468';
const whatsappUrl = 'https://wa.me/923297590468';
const apiPrivacyUrl = 'https://api.quickalapp.com/privacy-policy';
const apiDeleteUrl = 'https://api.quickalapp.com/delete-account';
const apiRefundUrl = 'https://api.quickalapp.com/refund-policy';
const apiBaseUrl = 'https://api.quickalapp.com';
// Counted download: the API logs the hit for the owner dashboard, then
// redirects to the real APK file from the live release policy.
const directApkUrl = `${apiBaseUrl}/api/downloads/apk`;
// Video guides (how to use the app + who we are) and social page.
const youtubePlaylistUrl = 'https://www.youtube.com/playlist?list=PLHV3ATsOdETE';
const facebookUrl = 'https://www.facebook.com/profile.php?id=61590000736332';

const navItems = [
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
function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const features = [
  {
    icon: Calculator,
    title: 'Window Estimation',
    text: 'Prepare aluminium window estimates with measurements, materials, and cost details in one flow.',
  },
  {
    icon: Scissors,
    title: 'Cutting Reports',
    text: 'Generate fabrication and glass cutting reports that are easier for workshop teams to follow.',
  },
  {
    icon: Layers3,
    title: 'Glass Optimization',
    text: 'Plan glass sheet cutting with optimization support to reduce waste and improve shop efficiency.',
  },
  {
    icon: PackageCheck,
    title: 'Material Reports',
    text: 'Create material lists for aluminium sections, glass, accessories, and project requirements.',
  },
  {
    icon: ReceiptText,
    title: 'Invoices',
    text: 'Make customer invoices and share professional PDF documents from your Android phone.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Access',
    text: 'Accounts, subscriptions, privacy information, and deletion support are clearly handled.',
  },
];

const plans = [
  {
    name: '1 Month',
    price: 'Rs 1,200',
    oldPrice: 'Rs 1,500',
    discount: '20% OFF',
    note: 'Good for trying Quick AL through direct website access.',
  },
  {
    name: '3 Months',
    price: 'Rs 3,000',
    oldPrice: 'Rs 4,000',
    discount: '25% OFF',
    note: 'Balanced plan for regular estimation and reports.',
    highlighted: true,
  },
  {
    name: '1 Year',
    price: 'Rs 10,000',
    oldPrice: 'Rs 15,000',
    discount: '33% OFF',
    note: 'Best value for established aluminium and glass businesses.',
  },
];

const screenshotCategories = [
  {
    id: 'estimation',
    title: 'Estimation',
    blurb:
      'Window selection, size input, optimization, rates, material table, and the final bill.',
    icon: Calculator,
    shots: estimationShots,
  },
  {
    id: 'fabrication',
    title: 'Fabrication',
    blurb:
      'Production-ready windows, cutting workflow, and fabrication reports for the workshop.',
    icon: Wrench,
    shots: fabricationShots,
  },
  {
    id: 'glass',
    title: 'Glass',
    blurb:
      'Glass cutting table and sheet optimization with waste tracking.',
    icon: Layers3,
    shots: glassShots,
  },
  {
    id: 'settings',
    title: 'Settings',
    blurb:
      'Company info, estimation rules, fabrication margins, and payment preferences.',
    icon: Settings,
    shots: settingsShots,
  },
];

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const path = window.location.pathname;

  React.useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener('hashchange', closeMenu);
    return () => window.removeEventListener('hashchange', closeMenu);
  }, []);

  // Count a page view for the owner dashboard. Fire-and-forget: failures are
  // silent and never affect the visitor. Admin pages are excluded so the
  // owner's own visits don't inflate the numbers.
  React.useEffect(() => {
    if (path === '/admin' || path === '/admin-payments') return;
    try {
      fetch(`${apiBaseUrl}/api/site/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'page_view',
          path,
          referrer: document.referrer || '',
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLegalPage =
    path === '/privacy-policy' ||
    path === '/delete-account' ||
    path === '/support' ||
    path === '/refund-policy';
  const isAdminPage = path === '/admin-payments';
  const isAdminDashboard = path === '/admin';
  const isAboutPage = path === '/about';

  return (
    <div className="site-shell">
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {path === '/privacy-policy' && <PrivacyPolicy />}
        {path === '/delete-account' && <DeleteAccount />}
        {path === '/refund-policy' && <RefundPolicy />}
        {path === '/support' && <SupportPage />}
        {isAboutPage && <AboutPage />}
        {isAdminPage && <AdminPaymentsPage />}
        {isAdminDashboard && <AdminDashboardPage />}
        {!isLegalPage && !isAdminPage && !isAdminDashboard && !isAboutPage && <HomePage />}
      </main>
      <Footer />
    </div>
  );
}

function Header({ menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Quick AL home">
        <span className="brand-mark">
          <img src={quickAlLogo} alt="" />
        </span>
        <span>
          <strong>Quick AL</strong>
          <small>by MMH</small>
        </span>
      </a>

      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
        <a
          className="nav-cta nav-youtube"
          href={youtubePlaylistUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          <Youtube size={17} />
          How to Use
        </a>
        <a className="nav-cta" href={whatsappUrl}>
          <Phone size={17} />
          WhatsApp
        </a>
      </nav>
    </header>
  );
}

const posterHighlights = [
  { icon: Calculator, title: 'Estimate', text: 'Accurate calculations' },
  { icon: Scissors, title: 'Cutting Size', text: 'Optimized cutting' },
  { icon: PackageCheck, title: 'Material List', text: 'Detailed reports' },
  { icon: ReceiptText, title: 'Invoice', text: 'Professional billing' },
  { icon: Settings, title: 'Settings', text: 'Customizable' },
];

/**
 * Brand band inspired by the Quick AL poster: as the user scrolls, the app
 * icon, title, tagline, five feature circles, and the closing pill reveal
 * one by one.
 */
function PosterShowcase() {
  return (
    <section className="poster-section" aria-label="Quick AL highlights">
      <div className="poster-inner">
        <Reveal variant="scale" className="poster-icon-wrap">
          <img src={quickAlLogo} alt="Quick AL app icon" />
        </Reveal>
        <Reveal as="h2" delay={120} className="poster-title">
          Quick <span>AL</span>
        </Reveal>
        <Reveal as="p" delay={220} className="poster-tagline">
          <span>Smart</span>
          <i aria-hidden="true">|</i>
          <span>Accurate</span>
          <i aria-hidden="true">|</i>
          <span>Reliable</span>
        </Reveal>
        <Reveal as="p" delay={320} className="poster-subline">
          Aluminium window estimation &amp; fabrication made easy
        </Reveal>
        <div className="poster-highlights">
          {posterHighlights.map((item, index) => (
            <Reveal
              key={item.title}
              variant="up"
              delay={380 + index * 120}
              className="poster-highlight"
            >
              <span className="poster-circle">
                <item.icon size={26} strokeWidth={1.7} />
              </span>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </Reveal>
          ))}
        </div>
        <Reveal variant="scale" delay={980} className="poster-pill-wrap">
          <span className="poster-pill">Fast &nbsp;•&nbsp; Easy &nbsp;•&nbsp; Professional</span>
        </Reveal>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <picture className="hero-banner-img" aria-hidden="true">
          <source media="(max-width: 640px)" srcSet={heroMoboImg} />
          <img src={heroDeskImg} alt="" />
        </picture>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-mobile-top">Quick AL by MMH</div>
        <div className="hero-content">
          <p className="eyebrow">
            <BadgeCheck size={18} />
            Android app for aluminium and glass shops
          </p>
          <h1>Quick AL by MMH</h1>
          <p className="hero-copy">
            Create aluminium window estimates, fabrication cutting reports, glass cutting reports,
            material reports, invoices, PDFs, and optimized glass sheet plans from one simple app.
          </p>
          <p className="hero-copy-short">
            Estimates, cutting reports, glass optimization, and invoices — one app.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href={directApkUrl}>
              Download Quick AL APK
              <Download size={18} />
            </a>
            <a className="secondary-button" href="/#screenshots">
              See Screenshots
            </a>
          </div>
          <div className="trust-row" aria-label="Quick AL highlights">
            <span>Made for fabricators</span>
            <span>PDF sharing</span>
            <span>Local support</span>
          </div>
        </div>
      </section>

      <PosterShowcase />

      <section className="section feature-band" id="features">
        <Reveal className="section-heading">
          <p className="eyebrow">Features</p>
          <h2>Daily shop work, organized in one app</h2>
          <p>
            Quick AL focuses on the reports and calculations aluminium window fabricators,
            contractors, and glass shops need every day.
          </p>
        </Reveal>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <Reveal
              as="article"
              className="feature-card glass-card"
              key={feature.title}
              delay={index * 90}
            >
              <feature.icon size={24} />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <ScreenshotsSection />

      <section className="section pricing-section" id="pricing">
        <Reveal className="section-heading">
          <p className="eyebrow">Pricing</p>
          <h2>Subscription plans for working shops</h2>
          <p>Direct access prices — separate from the Google Play version.</p>
        </Reveal>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <Reveal
              as="article"
              className={plan.highlighted ? 'price-card glass-card highlighted' : 'price-card glass-card'}
              key={plan.name}
              delay={index * 120}
            >
              {plan.highlighted && <span className="plan-tag">Popular</span>}
              {plan.discount && <span className="discount-badge">{plan.discount}</span>}
              <h3>{plan.name}</h3>
              <div className="price-row">
                {plan.oldPrice && <span className="old-price">{plan.oldPrice}</span>}
                <p className="price">{plan.price}</p>
              </div>
              <p>{plan.note}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="payment-note glass-card" delay={120}>
          <CreditCard size={20} />
          <div>
            <strong>How to pay</strong>
            <p>
              Pay securely inside the app with your <strong>card or wallet</strong>. Your subscription
              activates instantly once the payment is confirmed — no waiting and no manual steps.
            </p>
            <p className="pricing-refund-note">
              All payments are final and non-refundable. If the app does not work after payment
              due to a problem on our side, see the <a href="/refund-policy">Refund Policy</a>.
            </p>
          </div>
          <a className="primary-button" href={whatsappUrl}>
            <Phone size={16} />
            WhatsApp Support
          </a>
        </Reveal>
      </section>

      <section className="section how-to-section" id="how-to">
        <Reveal className="section-heading">
          <p className="eyebrow">How to use</p>
          <h2>Learn Quick AL step by step</h2>
          <p>
            New to Quick AL? Watch our video guides on YouTube. The playlist walks you through
            every part of the app — from your first window estimate to cutting reports, glass
            optimization, and invoices — and introduces who we are at MMH Tech.
          </p>
        </Reveal>
        <Reveal variant="scale" className="download-panel glass-card" delay={140}>
          <div>
            <Youtube size={28} />
            <strong>Quick AL video guides</strong>
            <span>Step-by-step tutorials plus an introduction to MMH Tech — everything you need to get started.</span>
          </div>
          <a
            className="primary-button youtube-button"
            href={youtubePlaylistUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube size={20} />
            Watch on YouTube
          </a>
        </Reveal>
      </section>

      <section className="section download-section" id="download">
        <Reveal className="section-heading">
          <p className="eyebrow">Android app · Direct APK</p>
          <h2>Install the Quick AL Android app</h2>
          <p>
            Quick AL is an Android app. Download the direct APK, install it on your Android
            phone, then choose a subscription plan inside the app. It is not available on
            iPhone / iOS.
          </p>
        </Reveal>
        <Reveal variant="scale" className="download-panel glass-card" delay={140}>
          <div>
            <Smartphone size={28} />
            <strong>Quick AL Direct APK · Android only</strong>
            <span>For website users — pay securely with your card or wallet, right inside the app.</span>
          </div>
          <a className="primary-button" href={directApkUrl}>
            Download APK
            <Download size={18} />
          </a>
        </Reveal>
      </section>

      <section className="section split-section" id="mmh">
        <Reveal variant="left">
          <p className="eyebrow">About MMH</p>
          <h2>Practical software for real business work</h2>
          <p>
            MMH Tech builds software products that help business owners and field workers complete
            technical work faster, with clearer records and professional outputs. Quick AL is MMH's
            aluminium and glass estimation product for Android.
          </p>
          <a className="secondary-button" href="/about" style={{ marginTop: '14px' }}>
            Learn more about MMH Tech
            <ArrowRight size={16} />
          </a>
        </Reveal>
        <div className="info-panel">
          <Reveal variant="right" className="glass-card" delay={120}>
            <Gauge size={24} />
            <strong>Fast reports</strong>
            <span>Estimates, cutting reports, material reports, and invoices stay ready to share.</span>
          </Reveal>
          <Reveal variant="right" className="glass-card" delay={260}>
            <FileText size={24} />
            <strong>Professional PDFs</strong>
            <span>Send cleaner documents to customers, teams, and project stakeholders.</span>
          </Reveal>
        </div>
      </section>

      <ReviewsSection />

      <section className="support-strip">
        <Reveal variant="left">
          <h2>Need account, subscription, or testing help?</h2>
          <p>Support is available for Google Play testing, subscriptions, account access, privacy, and deletion requests.</p>
        </Reveal>
        <Reveal variant="right" delay={150}>
          <a className="primary-button" href="/support">
            Get Support
            <ArrowRight size={18} />
          </a>
        </Reveal>
      </section>
    </>
  );
}

function StarRating({ value, onChange, size = 24, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={readOnly ? 'star-row star-row-readonly' : 'star-row'} role={readOnly ? 'img' : 'radiogroup'} aria-label={`${value} out of 5 stars`}>
      {stars.map((n) => {
        const filled = n <= value;
        const StarIcon = (
          <Star
            size={size}
            strokeWidth={1.6}
            fill={filled ? '#F5B400' : 'transparent'}
            color={filled ? '#F5B400' : '#9AA8B8'}
          />
        );
        if (readOnly) {
          return <span key={n}>{StarIcon}</span>;
        }
        return (
          <button
            key={n}
            type="button"
            className="star-button"
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            onClick={() => onChange(n)}
          >
            {StarIcon}
          </button>
        );
      })}
    </div>
  );
}

function ReviewsSection() {
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);

  const [name, setName] = React.useState('');
  const [city, setCity] = React.useState('');
  const [rating, setRating] = React.useState(5);
  const [message, setMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const fetchReviews = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/reviews`);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      setLoadError('Could not load reviews right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (trimmedName.length < 2) {
      setSubmitError('Please enter your name.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setSubmitError('Please write at least a short review (10+ characters).');
      return;
    }
    if (rating < 1 || rating > 5) {
      setSubmitError('Please choose a star rating.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          city: city.trim(),
          rating,
          message: trimmedMessage,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server responded ${res.status}`);
      }
      setSubmitSuccess(true);
      setName('');
      setCity('');
      setRating(5);
      setMessage('');
    } catch (err) {
      setSubmitError(err.message || 'Could not submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="section reviews-section" id="reviews">
      <Reveal className="section-heading">
        <p className="eyebrow">
          <MessageSquare size={16} /> Reviews
        </p>
        <h2>What users say about Quick AL</h2>
        <p>
          Real feedback from aluminium and glass shops using Quick AL.
          {averageRating && (
            <>
              {' '}
              Current average rating:{' '}
              <strong style={{ color: '#F5B400' }}>{averageRating} / 5</strong>{' '}
              ({reviews.length} review{reviews.length === 1 ? '' : 's'}).
            </>
          )}
        </p>
      </Reveal>

      <div className="reviews-grid">
        {loading && <p className="reviews-empty">Loading reviews…</p>}
        {!loading && loadError && <p className="reviews-empty">{loadError}</p>}
        {!loading && !loadError && reviews.length === 0 && (
          <p className="reviews-empty">
            No reviews yet — be the first to share your experience below.
          </p>
        )}
        {!loading &&
          !loadError &&
          reviews.map((review) => (
            <article className="review-card glass-card" key={review.id}>
              <StarRating value={Number(review.rating || 0)} readOnly size={18} />
              <p className="review-message">"{review.message}"</p>
              <div className="review-meta">
                <strong>{review.name}</strong>
                {review.city && <span> · {review.city}</span>}
              </div>
            </article>
          ))}
      </div>

      <form className="review-form glass-card" onSubmit={handleSubmit}>
        <h3>Share your experience</h3>
        <p className="review-form-hint">
          Your review will appear on this page after a quick moderation check.
        </p>

        <label className="review-field">
          <span>Your name</span>
          <input
            type="text"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ahmed Hassan"
            required
          />
        </label>

        <label className="review-field">
          <span>City (optional)</span>
          <input
            type="text"
            value={city}
            maxLength={40}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Lahore"
          />
        </label>

        <div className="review-field">
          <span>Your rating</span>
          <StarRating value={rating} onChange={setRating} size={30} />
        </div>

        <label className="review-field">
          <span>Your review</span>
          <textarea
            value={message}
            maxLength={500}
            rows={4}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell other shops what you liked or what could be better…"
            required
          />
          <small className="review-counter">{message.length}/500</small>
        </label>

        {submitError && <p className="review-error">{submitError}</p>}
        {submitSuccess && (
          <p className="review-success">
            Thank you! Your review has been received and will appear after a quick review.
          </p>
        )}

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : (
            <>
              Submit Review
              <Send size={16} />
            </>
          )}
        </button>
      </form>
    </section>
  );
}

function ScreenshotTrack({ category }) {
  const scrollRef = React.useRef(null);

  function scrollBy(dir) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
    }
  }

  return (
    <div className="screenshots-scroll-wrap">
      <button className="scroll-arrow scroll-arrow-left" onClick={() => scrollBy(-1)} aria-label="Scroll left">
        ‹
      </button>
      <div className="screenshots-track" ref={scrollRef}>
        {category.shots.map((src, i) => (
          <div className="ss-item" key={src}>
            <div className="ss-phone-frame">
              <img
                src={src}
                alt={`${category.title} screen ${i + 1}`}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
      <button className="scroll-arrow scroll-arrow-right" onClick={() => scrollBy(1)} aria-label="Scroll right">
        ›
      </button>
    </div>
  );
}

function ScreenshotsSection() {
  return (
    <section className="screenshots-section" id="screenshots">
      <Reveal className="screenshots-heading">
        <p className="eyebrow">
          <Smartphone size={16} />
          App Screenshots
        </p>
        <h2>See Quick AL in action</h2>
        <p>Every part of the app, area by area — swipe each row to explore.</p>
      </Reveal>
      {screenshotCategories.map((category) => {
        const Icon = category.icon;
        return (
          <div className="ss-category" key={category.id}>
            <Reveal className="ss-category-head">
              <div className="ss-category-title">
                <span className="ss-category-icon">
                  <Icon size={19} />
                </span>
                <h3>{category.title}</h3>
                <span className="ss-count">{category.shots.length} screens</span>
              </div>
              <p className="ss-category-blurb">{category.blurb}</p>
            </Reveal>
            <ScreenshotTrack category={category} />
          </div>
        );
      })}
    </section>
  );
}

function AdminPaymentsPage() {
  const [token, setToken] = React.useState(() => window.localStorage.getItem('quickalAdminToken') || '');
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  async function loadRequests() {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      window.localStorage.setItem('quickalAdminToken', token);
      const response = await fetch(`${apiBaseUrl}/api/subscription/direct-payment-requests/admin?status=pending`, {
        headers: { 'x-quickal-admin-token': token },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Pending payments failed to load.');
      setRequests(payload.requests || []);
      setMessage(`Loaded ${(payload.requests || []).length} pending payment request(s).`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Pending payments failed to load.');
    } finally {
      setLoading(false);
    }
  }

  async function reviewRequest(id, action) {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/subscription/direct-payment-requests/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-quickal-admin-token': token },
        body: JSON.stringify({ adminNote: action === 'approve' ? 'Payment verified' : 'Payment rejected' }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `Payment ${action} failed.`);
      setRequests((current) => current.filter((r) => r.id !== id));
      setMessage(action === 'approve' ? 'Payment approved and subscription activated.' : 'Payment rejected.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : `Payment ${action} failed.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="legal-page admin-page">
      <div className="legal-header">
        <p className="eyebrow"><LockKeyhole size={18} /> Owner Admin</p>
        <h1>Payment Approvals</h1>
        <p>Review direct website payments submitted from the Quick AL direct APK.</p>
      </div>
      <div className="legal-body admin-body">
        <div className="admin-token-row">
          <label>
            Admin token
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter DIRECT_PAYMENT_ADMIN_TOKEN"
              type="password"
            />
          </label>
          <button className="primary-button" type="button" onClick={loadRequests} disabled={loading || !token.trim()}>
            Load Pending
          </button>
        </div>
        {message && <p className="admin-message">{message}</p>}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-list">
          {requests.map((request) => (
            <article className="admin-request" key={request.id}>
              <div>
                <strong>{request.planId} - Rs {request.amountPkr}</strong>
                <span>{request.paymentMethod} / {request.paymentReference}</span>
                <span>User: {request.userId}</span>
                <span>{new Date(request.createdAt).toLocaleString()}</span>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => reviewRequest(request.id, 'approve')} disabled={loading}>
                  <CheckCircle2 size={18} /> Approve
                </button>
                <button type="button" onClick={() => reviewRequest(request.id, 'reject')} disabled={loading}>
                  <X size={18} /> Reject
                </button>
              </div>
            </article>
          ))}
          {!loading && requests.length === 0 && <p className="empty-admin">No pending payments loaded.</p>}
        </div>
      </div>
    </section>
  );
}

const dashProviderLabels = {
  google_play: 'Play Store',
  direct_website: 'Website (direct)',
};
const dashPlanLabels = {
  monthly: 'Monthly - 1 month',
  quarterly: 'Quarterly - 3 months',
  yearly: 'Yearly - 1 year',
};

// Rows for the subscriptions table: always show every provider x plan combo
// (zeros included) so the owner sees the full picture, plus any unexpected
// plan ids that show up in the data.
function dashSubscriptionRows(byPlan) {
  const rows = [];
  const seen = new Set();
  Object.keys(dashProviderLabels).forEach((provider) => {
    Object.keys(dashPlanLabels).forEach((planId) => {
      const found = (byPlan || []).find(
        (row) => row.provider === provider && row.planId === planId,
      );
      seen.add(`${provider}:${planId}`);
      rows.push({ provider, planId, activeCount: found ? found.activeCount : 0 });
    });
  });
  (byPlan || []).forEach((row) => {
    if (!seen.has(`${row.provider}:${row.planId}`)) {
      rows.push(row);
    }
  });
  return rows;
}

function AdminDashboardPage() {
  const [panelToken, setPanelToken] = React.useState(
    () => window.localStorage.getItem('quickalPanelToken') || '',
  );
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [summary, setSummary] = React.useState(null);
  const [manualEnabled, setManualEnabled] = React.useState(false);
  const [manualBusy, setManualBusy] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const loadSummary = React.useCallback(
    async (tokenOverride) => {
      const token = tokenOverride || panelToken;
      if (!token) return;
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBaseUrl}/api/admin/panel/summary`, {
          headers: { 'x-quickal-panel-token': token },
        });
        const payload = await response.json();
        if (response.status === 401) {
          window.localStorage.removeItem('quickalPanelToken');
          setPanelToken('');
          setSummary(null);
          throw new Error('Session expired. Please log in again.');
        }
        if (!response.ok) throw new Error(payload.error || 'Analytics failed to load.');
        setSummary(payload.summary);
        setManualEnabled(Boolean(payload.settings && payload.settings.manualPaymentEnabled));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Analytics failed to load.');
      } finally {
        setLoading(false);
      }
    },
    [panelToken],
  );

  async function toggleManualPayment() {
    const next = !manualEnabled;
    setManualBusy(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/manual-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-quickal-panel-token': panelToken,
        },
        body: JSON.stringify({ enabled: next }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not update the setting.');
      setManualEnabled(Boolean(payload.manualPaymentEnabled));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not update the setting.');
    } finally {
      setManualBusy(false);
    }
  }

  React.useEffect(() => {
    if (panelToken) loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Login failed.');
      window.localStorage.setItem('quickalPanelToken', payload.token);
      setPanelToken(payload.token);
      setPassword('');
      await loadSummary(payload.token);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem('quickalPanelToken');
    setPanelToken('');
    setSummary(null);
    setError('');
  }

  const visits = summary?.websiteVisits;
  const downloads = summary?.apkDownloads;
  const users = summary?.appUsers;
  const subs = summary?.subscriptions;

  return (
    <section className="legal-page admin-page">
      <div className="legal-header">
        <p className="eyebrow"><Gauge size={18} /> Owner Admin</p>
        <h1>Analytics Dashboard</h1>
        <p>Website visits, APK downloads, app usage and active subscriptions.</p>
      </div>
      <div className="legal-body admin-body">
        {!panelToken && (
          <form className="admin-token-row dash-login" onSubmit={handleLogin}>
            <label>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                type="password"
                autoComplete="current-password"
              />
            </label>
            <button
              className="primary-button"
              type="submit"
              disabled={loading || !username.trim() || !password}
            >
              <LockKeyhole size={17} />
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>
        )}

        {error && <p className="admin-error">{error}</p>}

        {panelToken && (
          <>
            <div className="dash-toolbar">
              <span className="dash-updated">
                {summary
                  ? `Updated ${new Date(summary.generatedAt).toLocaleString()}`
                  : loading
                    ? 'Loading analytics...'
                    : ''}
              </span>
              <div className="dash-toolbar-actions">
                <button type="button" onClick={() => loadSummary()} disabled={loading}>
                  Refresh
                </button>
                <a href="/admin-payments">Payment Approvals</a>
                <button type="button" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>

            {summary && (
              <>
                <article className="dash-card glass-card dash-settings">
                  <header><CreditCard size={20} /> Payment Settings</header>
                  <div className="dash-toggle-row">
                    <div>
                      <strong>Manual bank transfer</strong>
                      <span className="dash-sub">
                        {manualEnabled
                          ? 'ON — users can pay by bank transfer and submit a reference for your approval.'
                          : 'OFF — users can only pay online (Safepay). Bank transfer is shown to them but disabled.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={manualEnabled ? 'dash-toggle dash-toggle-on' : 'dash-toggle'}
                      onClick={toggleManualPayment}
                      disabled={manualBusy}
                      aria-pressed={manualEnabled}
                    >
                      <span className="dash-toggle-knob" />
                      <span className="dash-toggle-text">
                        {manualBusy ? '…' : manualEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                </article>

                <div className="dash-grid">
                  <article className="dash-card glass-card">
                    <header><Globe size={20} /> Website Visits</header>
                    <strong className="dash-num">{visits.total}</strong>
                    <span className="dash-sub">total page views</span>
                    <ul>
                      <li><span>Today</span><strong>{visits.today}</strong></li>
                      <li><span>Last 7 days</span><strong>{visits.last7Days}</strong></li>
                      <li><span>Last 30 days</span><strong>{visits.last30Days}</strong></li>
                      <li>
                        <span>Unique visitors (30 days)</span>
                        <strong>{visits.uniqueVisitors.last30Days}</strong>
                      </li>
                    </ul>
                  </article>

                  <article className="dash-card glass-card">
                    <header><Download size={20} /> APK Downloads</header>
                    <strong className="dash-num">{downloads.total}</strong>
                    <span className="dash-sub">total downloads (website APK)</span>
                    <ul>
                      <li><span>Today</span><strong>{downloads.today}</strong></li>
                      <li><span>Last 7 days</span><strong>{downloads.last7Days}</strong></li>
                      <li><span>Last 30 days</span><strong>{downloads.last30Days}</strong></li>
                    </ul>
                  </article>

                  <article className="dash-card glass-card">
                    <header><Smartphone size={20} /> App Users</header>
                    <strong className="dash-num">{users.totalAccounts}</strong>
                    <span className="dash-sub">registered accounts</span>
                    <ul>
                      <li><span>Active last 7 days</span><strong>{users.activeLast7Days}</strong></li>
                      <li><span>Active last 30 days</span><strong>{users.activeLast30Days}</strong></li>
                      <li><span>New last 30 days</span><strong>{users.newLast30Days}</strong></li>
                    </ul>
                  </article>

                  <article className="dash-card glass-card">
                    <header><Clock size={20} /> Trials &amp; Payments</header>
                    <strong className="dash-num">{summary.trials.active}</strong>
                    <span className="dash-sub">active free trials</span>
                    <ul>
                      <li><span>Trials started (total)</span><strong>{summary.trials.total}</strong></li>
                      <li>
                        <span>Pending payment requests</span>
                        <strong>{summary.directPayments.pending}</strong>
                      </li>
                    </ul>
                  </article>
                </div>

                <article className="dash-card glass-card dash-subs">
                  <header><CreditCard size={20} /> Active Subscriptions</header>
                  <strong className="dash-num">{subs.totalActive}</strong>
                  <span className="dash-sub">currently active paid subscriptions</span>
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Plan</th>
                        <th>Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashSubscriptionRows(subs.byPlan).map((row) => (
                        <tr key={`${row.provider}-${row.planId}`}>
                          <td>{dashProviderLabels[row.provider] || row.provider}</td>
                          <td>{dashPlanLabels[row.planId] || row.planId}</td>
                          <td>{row.activeCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </article>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function SupportPage() {
  return (
    <LegalLayout
      eyebrow="Support"
      title="Contact Quick AL Support"
      intro="Use this page for app testing, subscription, account, report, invoice, privacy, and delete account help."
    >
      <div className="contact-grid">
        <a className="contact-card" href={`mailto:${supportEmail}`}>
          <Mail size={24} />
          <span>Email</span>
          <strong>{supportEmail}</strong>
        </a>
        <a className="contact-card" href={whatsappUrl}>
          <Phone size={24} />
          <span>Phone / WhatsApp</span>
          <strong>{supportPhone}</strong>
        </a>
        <div className="contact-card">
          <MapPin size={24} />
          <span>Service Area</span>
          <strong>Pakistan</strong>
        </div>
      </div>
      <h2>Support topics</h2>
      <ul>
        <li>Google Play internal or closed testing access</li>
        <li>Subscription, local bank or wallet payment, and free trial questions</li>
        <li>Login, account, or profile help</li>
        <li>Estimation, cutting report, invoice, and PDF sharing issues</li>
        <li>Privacy policy and delete account requests</li>
      </ul>
    </LegalLayout>
  );
}

function PrivacyPolicy() {
  return (
    <LegalLayout
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="Quick AL respects user privacy and keeps legal information easy to access for customers and Google Play review."
    >
      <p>
        Quick AL is an Android app by MMH for aluminium and glass estimation, reporting, invoicing,
        PDF sharing, subscriptions, and related account services.
      </p>
      <h2>Information we may process</h2>
      <ul>
        <li>Account information used for login and support.</li>
        <li>Project, estimate, material, cutting report, invoice, and PDF related app data.</li>
        <li>Subscription status handled through Google Play Billing for Play Store installs, or direct account support for website installs.</li>
        <li>Technical information needed to keep the service reliable and secure.</li>
      </ul>
      <h2>How information is used</h2>
      <ul>
        <li>To provide app features, saved records, reports, and customer support.</li>
        <li>To manage access, subscriptions, trial status, and app security.</li>
        <li>To improve reliability and fix technical issues.</li>
      </ul>
      <h2>Official policy</h2>
      <p>
        The current official policy is available at{' '}
        <a href={apiPrivacyUrl}>{apiPrivacyUrl}</a>.
      </p>
    </LegalLayout>
  );
}

const mmhServices = [
  {
    icon: Smartphone,
    title: 'Android App Development',
    text: 'Custom business apps built with Flutter — from idea to a live app on the Google Play Store.',
  },
  {
    icon: Globe,
    title: 'Websites & Web Apps',
    text: 'Fast, modern websites and web panels (React) for products, companies, and admin dashboards.',
  },
  {
    icon: Server,
    title: 'Backend & Cloud',
    text: 'Secure APIs, databases, and cloud deployment (AWS) with real production experience.',
  },
  {
    icon: FileText,
    title: 'Business Automation & PDF Reports',
    text: 'Estimation systems, invoices, cutting reports, and professional PDF documents generated automatically.',
  },
  {
    icon: CreditCard,
    title: 'Payments & Subscriptions',
    text: 'Google Play billing, local payment flows, and subscription systems with fraud controls.',
  },
  {
    icon: Wrench,
    title: 'Maintenance & Support',
    text: 'Updates, monitoring, and ongoing improvements after launch — software that keeps working.',
  },
];

const mmhTrustPoints = [
  { icon: BadgeCheck, text: 'FBR-registered business (NTN 3420147176827)' },
  { icon: Smartphone, text: 'Live product on the Google Play Store' },
  { icon: Server, text: 'Production infrastructure on AWS with SSL' },
  { icon: Clock, text: 'Support replies within 24 hours' },
];

function AboutPage() {
  React.useEffect(() => {
    const previousTitle = document.title;
    document.title = 'About MMH Tech — Software House behind Quick AL';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="about-page">
      <section className="section about-hero">
        <Reveal className="section-heading about-heading">
          <p className="eyebrow">
            <Building2 size={16} />
            About the Company
          </p>
          <h1>MMH Tech</h1>
          <p>
            MMH Tech is a registered Pakistani software house that designs, builds, and runs
            practical business software — mobile apps, websites, and the backend systems behind
            them. Our flagship product, <strong>Quick AL</strong>, serves aluminium and glass
            fabrication shops across Pakistan.
          </p>
        </Reveal>
        <div className="about-fact-row">
          {mmhTrustPoints.map((point, index) => (
            <Reveal key={point.text} className="about-fact glass-card" delay={index * 110}>
              <point.icon size={20} />
              <span>{point.text}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section about-founder-section">
        <Reveal variant="left" className="founder-card glass-card">
          <div className="founder-avatar" aria-hidden="true">MH</div>
          <div>
            <p className="eyebrow">Founder</p>
            <h2>Muhammad Hashir</h2>
            <p className="founder-role">Founder &amp; Full-Stack Engineer</p>
            <p>
              Muhammad Hashir builds complete products end to end — Android apps (Flutter),
              backends (Node.js), databases, cloud deployment, and payment systems. He founded
              MMH Tech to bring professional, affordable software to real working businesses,
              starting with the aluminium and glass industry he knows first-hand.
            </p>
          </div>
        </Reveal>
        <Reveal variant="right" delay={150} className="about-mission glass-card">
          <Code2 size={24} />
          <h3>How we work</h3>
          <p>
            One team, full ownership: we design, develop, deploy, and maintain. Clear pricing,
            honest timelines, and software that is tested in production — not just delivered
            and forgotten.
          </p>
        </Reveal>
      </section>

      <section className="section about-services">
        <Reveal className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>What MMH Tech can build for you</h2>
          <p>
            If you need an app or system for your business, these are the services we provide —
            the same stack that powers Quick AL in production.
          </p>
        </Reveal>
        <div className="feature-grid">
          {mmhServices.map((service, index) => (
            <Reveal
              as="article"
              className="feature-card glass-card"
              key={service.title}
              delay={index * 90}
            >
              <service.icon size={24} />
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section about-flagship">
        <Reveal variant="scale" className="download-panel glass-card">
          <div>
            <img className="about-flagship-icon" src={quickAlLogo} alt="Quick AL icon" />
            <strong>Flagship product: Quick AL</strong>
            <span>
              Aluminium window estimation, cutting reports, glass optimization, and invoices —
              live on Google Play and this website.
            </span>
          </div>
          <a className="primary-button" href="/#screenshots">
            See Quick AL
            <ArrowRight size={18} />
          </a>
        </Reveal>
      </section>

      <section className="support-strip about-cta">
        <Reveal variant="left">
          <h2>Have a project in mind?</h2>
          <p>
            Tell us what your business needs — an app, a website, or a complete system. We reply
            within 24 hours.
          </p>
        </Reveal>
        <Reveal variant="right" delay={150} className="about-cta-actions">
          <a className="primary-button" href={whatsappUrl}>
            <Phone size={16} />
            WhatsApp Us
          </a>
          <a className="secondary-button" href={`mailto:${supportEmail}`}>
            <Mail size={16} />
            {supportEmail}
          </a>
        </Reveal>
      </section>
    </div>
  );
}

function RefundPolicy() {
  return (
    <LegalLayout
      eyebrow="Payments"
      title="Refund Policy"
      intro="Clear and simple rules for Quick AL subscription payments."
    >
      <h2>All payments are final</h2>
      <p>
        Quick AL subscription payments are final and non-refundable. When a subscription is
        activated, the service is considered delivered for the paid period.
      </p>
      <h2>The one exception</h2>
      <p>
        If you have paid and the app does not work because of a technical problem on our side,
        you can request a refund review. In this case the refund request will be considered.
      </p>
      <h2>How to request a refund review</h2>
      <ol>
        <li>Email <a href={`mailto:${supportEmail}`}>{supportEmail}</a> from the email address registered to your Quick AL account.</li>
        <li>Use the subject line: <strong>Refund Request</strong>.</li>
        <li>Include your payment reference / transaction ID and a short description of the problem.</li>
        <li>Send the request within 7 days of the payment.</li>
      </ol>
      <p>
        We respond to refund requests within 3 working days. If a refund is approved, it is
        returned to the original payment method.
      </p>
      <h2>Google Play purchases</h2>
      <p>
        Subscriptions bought through Google Play follow Google Play&apos;s own refund process,
        handled by Google.
      </p>
      <h2>Official policy</h2>
      <p>
        The current official policy is available at <a href={apiRefundUrl}>{apiRefundUrl}</a>.
      </p>
    </LegalLayout>
  );
}

function DeleteAccount() {
  return (
    <LegalLayout
      eyebrow="Account"
      title="Delete Account Instructions"
      intro="Quick AL users can request account deletion and removal of associated account data."
    >
      <div className="delete-callout">
        <Trash2 size={26} />
        <div>
          <strong>Delete account request</strong>
          <span>Use the official delete account page or contact support with your registered email.</span>
        </div>
      </div>
      <h2>How to request deletion</h2>
      <ol>
        <li>Open the official delete account page: <a href={apiDeleteUrl}>{apiDeleteUrl}</a>.</li>
        <li>Enter or provide the email or account information used in Quick AL.</li>
        <li>Submit the request and wait for support confirmation.</li>
      </ol>
      <h2>Alternative support request</h2>
      <p>
        You can email <a href={`mailto:${supportEmail}`}>{supportEmail}</a> with the subject
        "Quick AL Delete Account" and include your registered email address.
      </p>
      <h2>What may be deleted</h2>
      <p>
        Account profile information and related app records may be deleted according to the official
        policy and any legal, billing, or security requirements.
      </p>
    </LegalLayout>
  );
}

function LegalLayout({ eyebrow, title, intro, children }) {
  return (
    <section className="legal-page">
      <div className="legal-header">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <div className="legal-body">{children}</div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Quick AL by MMH</strong>
        <p>Professional aluminium and glass estimation software for Android.</p>
        <div className="footer-social">
          <a
            className="footer-social-link"
            href={youtubePlaylistUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Quick AL video guides on YouTube"
          >
            <Youtube size={18} /> YouTube guides
          </a>
          <a
            className="footer-social-link"
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Quick AL on Facebook"
          >
            <Facebook size={18} /> Facebook
          </a>
        </div>
      </div>
      <div className="footer-links">
        <a href="/about">About MMH Tech</a>
        <a href="/#how-to">How to Use</a>
        <a href="/support">Support</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/refund-policy">Refund Policy</a>
        <a href="/delete-account">Delete Account</a>
        <a href={whatsappUrl}>WhatsApp: {supportPhone}</a>
        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
