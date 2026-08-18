import React from 'react';

export function LegalLayout({ eyebrow, title, intro, children }) {
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
