import React from 'react';
import {
  ArrowRight,
  Building2,
  Code2,
  Mail,
  Phone,
} from 'lucide-react';
import quickAlLogo from '../../assets/quick_al_icon.png';
import { Reveal } from '../../components/Reveal.jsx';
import { supportEmail, whatsappUrl } from '../../lib/site.js';
import { mmhServices, mmhTrustPoints } from './PrivacyPolicy.jsx';

export function AboutPage() {
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
