import React from 'react';
import {
  Smartphone,
} from 'lucide-react';
import { Reveal } from '../../components/Reveal.jsx';
import { screenshotCategories } from '../../lib/content.js';

export function ScreenshotTrack({ category }) {
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

export function ScreenshotsSection() {
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
