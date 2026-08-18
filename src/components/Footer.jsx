import React from 'react';
import {
  Facebook,
  Youtube,
} from 'lucide-react';
import { facebookUrl, supportEmail, supportPhone, whatsappUrl, youtubePlaylistUrl } from '../lib/site.js';

export function Footer() {
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
