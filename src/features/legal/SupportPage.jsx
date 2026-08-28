import React from 'react';
import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { LegalLayout } from '../../components/LegalLayout.jsx';
import { supportEmail, supportPhone, whatsappUrl } from '../../lib/site.js';

export function SupportPage() {
  return (
    <LegalLayout
      eyebrow="Support"
      title="Contact Quick AL Support"
      intro="Use this page for app testing, account, report, invoice, privacy, and delete account help."
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
        <li>Login, account, or profile help</li>
        <li>Estimation, cutting report, invoice, and PDF sharing issues</li>
        <li>Privacy policy and delete account requests</li>
      </ul>
    </LegalLayout>
  );
}
