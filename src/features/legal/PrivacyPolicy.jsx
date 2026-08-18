import React from 'react';
import {
  BadgeCheck,
  Clock,
  CreditCard,
  FileText,
  Globe,
  Server,
  Smartphone,
  Wrench,
} from 'lucide-react';
import { App } from '../../App.jsx';
import { LegalLayout } from '../../components/LegalLayout.jsx';
import { apiPrivacyUrl } from '../../lib/site.js';

export function PrivacyPolicy() {
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
