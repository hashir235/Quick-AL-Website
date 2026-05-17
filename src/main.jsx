import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CheckCircle2,
  Download,
  FileText,
  Gauge,
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
  ShieldCheck,
  Smartphone,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import './styles.css';
import quickAlLogo from './assets/quick_al_icon.png';
import heroDeskImg from './assets/desk.jpg';
import heroMoboImg from './assets/mobo.jpg';

import ss01 from './assets/screenshots/01-estimation-fabrication-workspace.png';
import ss02 from './assets/screenshots/02-window-fabrication-library.png';
import ss03 from './assets/screenshots/03-glass-sheet-optimization.png';
import ss04 from './assets/screenshots/04-pdf-reports-sharing.png';
import ss05 from './assets/screenshots/05-secure-login-subscription.png';
import ss06 from './assets/screenshots/06-built-for-glass-shops.png';
import ss07 from './assets/screenshots/ss-07.png';
import ss08 from './assets/screenshots/ss-08.png';
import ss09 from './assets/screenshots/ss-09.png';
import ss10 from './assets/screenshots/ss-10.png';
import ss11 from './assets/screenshots/ss-11.png';
import ss12 from './assets/screenshots/ss-12.png';
import ss13 from './assets/screenshots/ss-13.png';
import ss14 from './assets/screenshots/ss-14.png';
import ss15 from './assets/screenshots/ss-15.png';
import ss16 from './assets/screenshots/ss-16.png';
import ss17 from './assets/screenshots/ss-17.png';
import ss18 from './assets/screenshots/ss-18.png';
import ssRecent from './assets/screenshots/ss-recent.png';

const supportEmail = 'quickal.dev@gmail.com';
const supportPhone = '0347 6654447';
const whatsappUrl = 'https://wa.me/923476654447';
const apiPrivacyUrl = 'https://api.quickalapp.com/privacy-policy';
const apiDeleteUrl = 'https://api.quickalapp.com/delete-account';
const directApkUrl = '/downloads/quickal-direct.apk';
const apiBaseUrl = 'https://api.quickalapp.com';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Screenshots', href: '/#screenshots' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Support', href: '/support' },
  { label: 'Privacy', href: '/privacy-policy' },
];

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

const allScreenshots = [
  { src: ss05, label: 'Secure Login' },
  { src: ss01, label: 'Estimation & Fabrication' },
  { src: ss02, label: 'Window Library' },
  { src: ss07, label: 'Center Fix Window' },
  { src: ss08, label: 'Corner Window Setup' },
  { src: ss11, label: 'Single Door' },
  { src: ss09, label: 'Window Selection' },
  { src: ss10, label: 'Window Types' },
  { src: ss12, label: 'Estimation Flow' },
  { src: ss13, label: 'Project Settings' },
  { src: ss14, label: 'Fabrication View' },
  { src: ss15, label: 'Section Settings' },
  { src: ss16, label: 'Window Dimensions' },
  { src: ss17, label: 'Input Screen' },
  { src: ss18, label: 'Review List' },
  { src: ssRecent, label: 'Recent Projects' },
  { src: ss03, label: 'Glass Sheet Optimization' },
  { src: ss04, label: 'PDF Reports & Sharing' },
  { src: ss06, label: 'Built for Glass Shops' },
];

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const path = window.location.pathname;

  React.useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener('hashchange', closeMenu);
    return () => window.removeEventListener('hashchange', closeMenu);
  }, []);

  const isLegalPage = path === '/privacy-policy' || path === '/delete-account' || path === '/support';
  const isAdminPage = path === '/admin-payments';

  return (
    <div className="site-shell">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {path === '/privacy-policy' && <PrivacyPolicy />}
        {path === '/delete-account' && <DeleteAccount />}
        {path === '/support' && <SupportPage />}
        {isAdminPage && <AdminPaymentsPage />}
        {!isLegalPage && !isAdminPage && <HomePage />}
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
        <a className="nav-cta" href={whatsappUrl}>
          <Phone size={17} />
          WhatsApp
        </a>
      </nav>
    </header>
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
        <HeroPhone />
      </section>

      <section className="section feature-band" id="features">
        <div className="section-heading">
          <p className="eyebrow">Features</p>
          <h2>Daily shop work, organized in one app</h2>
          <p>
            Quick AL focuses on the reports and calculations aluminium window fabricators,
            contractors, and glass shops need every day.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card glass-card" key={feature.title}>
              <feature.icon size={24} />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <ScreenshotsSection />

      <section className="section pricing-section" id="pricing">
        <div className="section-heading">
          <p className="eyebrow">Pricing</p>
          <h2>Subscription plans for working shops</h2>
          <p>Direct access prices — separate from the Google Play version.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={plan.highlighted ? 'price-card glass-card highlighted' : 'price-card glass-card'} key={plan.name}>
              {plan.highlighted && <span className="plan-tag">Popular</span>}
              {plan.discount && <span className="discount-badge">{plan.discount}</span>}
              <h3>{plan.name}</h3>
              <div className="price-row">
                {plan.oldPrice && <span className="old-price">{plan.oldPrice}</span>}
                <p className="price">{plan.price}</p>
              </div>
              <p>{plan.note}</p>
            </article>
          ))}
        </div>
        <div className="payment-note glass-card">
          <Phone size={20} />
          <div>
            <strong>How to pay</strong>
            <p>
              Direct plan payments are handled through <strong>EasyPaisa</strong> or <strong>Allied Bank</strong>.
              Contact support on WhatsApp to get payment details and activate your subscription.
            </p>
          </div>
          <a className="primary-button" href={whatsappUrl}>
            <Phone size={16} />
            WhatsApp Support
          </a>
        </div>
      </section>

      <section className="section download-section" id="download">
        <div className="section-heading">
          <p className="eyebrow">Direct APK</p>
          <h2>Install Quick AL from the website</h2>
          <p>
            Download the direct Android APK, install it on your phone, then choose a subscription plan inside the app.
          </p>
        </div>
        <div className="download-panel glass-card">
          <div>
            <Smartphone size={28} />
            <strong>Quick AL Direct APK</strong>
            <span>For website users — pay locally via EasyPaisa or Allied Bank with WhatsApp support.</span>
          </div>
          <a className="primary-button" href={directApkUrl}>
            Download APK
            <Download size={18} />
          </a>
        </div>
      </section>

      <section className="section split-section" id="about">
        <div>
          <p className="eyebrow">About MMH</p>
          <h2>Practical software for real business work</h2>
          <p>
            MMH builds software products that help business owners and field workers complete
            technical work faster, with clearer records and professional outputs. Quick AL is MMH's
            aluminium and glass estimation product for Android.
          </p>
        </div>
        <div className="info-panel">
          <div className="glass-card">
            <Gauge size={24} />
            <strong>Fast reports</strong>
            <span>Estimates, cutting reports, material reports, and invoices stay ready to share.</span>
          </div>
          <div className="glass-card">
            <FileText size={24} />
            <strong>Professional PDFs</strong>
            <span>Send cleaner documents to customers, teams, and project stakeholders.</span>
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="support-strip">
        <div>
          <h2>Need account, subscription, or testing help?</h2>
          <p>Support is available for Google Play testing, subscriptions, account access, privacy, and deletion requests.</p>
        </div>
        <a className="primary-button" href="/support">
          Get Support
          <ArrowRight size={18} />
        </a>
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
      <div className="section-heading">
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
      </div>

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

function HeroPhone() {
  return (
    <div className="hero-phone-wrap" aria-label="Quick AL app preview">
      <div className="hero-phone-frame">
        <img
          src={ss01}
          alt="Quick AL app — Estimation and Fabrication Workspace"
          className="hero-phone-img"
        />
      </div>
    </div>
  );
}

function ScreenshotsSection() {
  const scrollRef = React.useRef(null);

  function scrollBy(dir) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
    }
  }

  return (
    <section className="screenshots-section" id="screenshots">
      <div className="screenshots-heading">
        <p className="eyebrow">
          <Smartphone size={16} />
          App Screenshots
        </p>
        <h2>See Quick AL in action</h2>
        <p>Swipe or scroll to see all screens of the app.</p>
      </div>
      <div className="screenshots-scroll-wrap">
        <button className="scroll-arrow scroll-arrow-left" onClick={() => scrollBy(-1)} aria-label="Scroll left">
          ‹
        </button>
        <div className="screenshots-track" ref={scrollRef}>
          {allScreenshots.map((ss, i) => (
            <div className="ss-item" key={i}>
              <div className="ss-phone-frame">
                <img src={ss.src} alt={ss.label} loading="lazy" />
              </div>
              <span className="ss-label">{ss.label}</span>
            </div>
          ))}
        </div>
        <button className="scroll-arrow scroll-arrow-right" onClick={() => scrollBy(1)} aria-label="Scroll right">
          ›
        </button>
      </div>
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
      </div>
      <div className="footer-links">
        <a href="/support">Support</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/delete-account">Delete Account</a>
        <a href={whatsappUrl}>WhatsApp: {supportPhone}</a>
        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
