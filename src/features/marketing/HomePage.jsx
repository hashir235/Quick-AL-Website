import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Download,
  FileText,
  Gauge,
  Phone,
  Send,
  Smartphone,
  Youtube,
} from 'lucide-react';
import heroDeskImg from '../../assets/desk.jpg';
import heroMoboImg from '../../assets/mobo.jpg';
import { Reveal } from '../../components/Reveal.jsx';
import { PosterShowcase } from './PosterShowcase.jsx';
import { ReviewsSection } from './ReviewsSection.jsx';
import { ScreenshotsSection } from './ScreenshotsSection.jsx';
import { directApkUrl, whatsappUrl, youtubePlaylistUrl } from '../../lib/site.js';

export function HomePage() {
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
