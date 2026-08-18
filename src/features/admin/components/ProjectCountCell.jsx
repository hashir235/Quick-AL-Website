import React from 'react';

export function ProjectCountCell({ projects }) {
  const p = projects || { estimation: 0, fabrication: 0, glass: 0, total: 0 };
  if (!p.total) return <span style={{ opacity: 0.4 }}>—</span>;
  const parts = [
    { label: 'Est', value: p.estimation, color: '#3882E4' },
    { label: 'Fab', value: p.fabrication, color: '#12A594' },
    { label: 'Gls', value: p.glass, color: '#E07B39' },
  ];
  return (
    <span className="dash-project-counts">
      {parts.map((part) => (
        <span
          key={part.label}
          className="dash-project-count"
          style={{ color: part.value ? part.color : undefined }}
          title={`${part.label}: ${part.value}`}
        >
          {part.value}
        </span>
      ))}
    </span>
  );
}

/// A grouped bar chart of one user's twelve months, drawn as plain SVG.
///
/// No charting dependency: the whole thing is a dozen buckets and four series,
/// and a library for that would cost more in bundle than it saves in code.
