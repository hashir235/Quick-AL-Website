import React from 'react';
import quickAlLogo from '../../assets/quick_al_icon.png';
import { Reveal } from '../../components/Reveal.jsx';
import { posterHighlights } from '../../components/Header.jsx';

export function PosterShowcase() {
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
