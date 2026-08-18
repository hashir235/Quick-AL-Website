import React from 'react';
import { dashNumber } from '../lib/format.js';

export function DashTrendChart({ points, metric, color }) {
  const width = 720;
  const height = 180;
  const padX = 8;
  const padY = 14;

  if (!points || points.length === 0) {
    return <p className="dash-sub">No data for this period yet.</p>;
  }

  const values = points.map((p) => Number(p[metric] || 0));
  const peak = Math.max(...values, 1);
  const stepX = points.length > 1 ? (width - padX * 2) / (points.length - 1) : 0;
  const yFor = (value) =>
    height - padY - (value / peak) * (height - padY * 2);

  const line = values
    .map((value, i) => `${i === 0 ? 'M' : 'L'} ${padX + i * stepX} ${yFor(value)}`)
    .join(' ');
  const area =
    `${line} L ${padX + (values.length - 1) * stepX} ${height - padY}` +
    ` L ${padX} ${height - padY} Z`;

  const total = values.reduce((sum, v) => sum + v, 0);
  const busiest = points[values.indexOf(peak)];

  return (
    <div className="dash-chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img"
        aria-label={`${metric} over ${points.length} days`}>
        <defs>
          <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.34" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1={padX}
            x2={width - padX}
            y1={padY + fraction * (height - padY * 2)}
            y2={padY + fraction * (height - padY * 2)}
            className="dash-chart-grid"
          />
        ))}
        <path d={area} fill={`url(#grad-${metric})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.4"
          strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="dash-chart-foot">
        <span>{points[0].day}</span>
        <span className="dash-chart-stat">
          <strong>{dashNumber(total)}</strong> total ·
          {' '}peak <strong>{dashNumber(peak)}</strong>
          {busiest ? ` on ${busiest.day}` : ''}
        </span>
        <span>{points[points.length - 1].day}</span>
      </div>
    </div>
  );
}

/// One row of a horizontal breakdown bar, e.g. Play Store vs Website APK.
