import React from 'react';
import {
  Calculator,
  Menu,
  PackageCheck,
  Phone,
  ReceiptText,
  Scissors,
  Settings,
  X,
  Youtube,
} from 'lucide-react';
import quickAlLogo from '../assets/quick_al_icon.png';
import { navItems, whatsappUrl, youtubePlaylistUrl } from '../lib/site.js';

export function Header({ menuOpen, setMenuOpen }) {
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
