import React from 'react';

const SERIES = [
  { key: 'estimation', label: 'Estimation', color: '#4C8DFF' },
  { key: 'fabrication', label: 'Fabrication', color: '#17C3B2' },
  { key: 'glass', label: 'Glass', color: '#FFAF5F' },
];

/// Twelve months of one user's projects, stacked by kind.
///
/// Drawn as plain SVG rather than pulled from a charting library: it is a
/// dozen buckets and three series, and a dependency for that would cost more
/// in bundle size than it saves in code -- while making the styling harder to
/// keep in step with the rest of the panel.
export function ActivityChart({ months }) {
  const [hover, setHover] = React.useState(null);

  const totals = months.map(
    (m) => (m.estimation || 0) + (m.fabrication || 0) + (m.glass || 0),
  );
  const peak = Math.max(1, ...totals);
  // Round the top of the scale up to something readable, so gridlines land on
  // whole numbers instead of 3.67.
  const step = peak <= 4 ? 1 : peak <= 10 ? 2 : Math.ceil(peak / 5);
  const top = Math.ceil(peak / step) * step;
  const ticks = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);

  const W = 760;
  const H = 240;
  const padL = 38;
  const padB = 30;
  const padT = 12;
  const plotH = H - padB - padT;
  const slot = (W - padL) / Math.max(1, months.length);
  const barW = Math.min(30, slot * 0.52);
  const radius = 4;

  return (
    <div className="ua-chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="ua-chart"
        role="img"
        aria-label="Projects started per month, by kind"
      >
        {ticks.map((v) => {
          const y = padT + plotH * (1 - v / top);
          return (
            <g key={v}>
              <line
                x1={padL}
                x2={W}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray={v === 0 ? '' : '3 5'}
              />
              <text x={padL - 10} y={y + 4} className="ua-axis" textAnchor="end">
                {v}
              </text>
            </g>
          );
        })}

        {months.map((m, i) => {
          const x = padL + i * slot + (slot - barW) / 2;
          const total = totals[i];
          let cursor = padT + plotH;
          const isHover = hover === i;

          return (
            <g
              key={m.month}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* Full-height catcher so the tooltip does not flicker between
                  the short bars. */}
              <rect
                x={padL + i * slot}
                y={padT}
                width={slot}
                height={plotH}
                fill={isHover ? 'rgba(255,255,255,0.04)' : 'transparent'}
                rx="6"
              />
              {SERIES.map((s) => {
                const v = m[s.key] || 0;
                if (!v) return null;
                const h = (v / top) * plotH;
                cursor -= h;
                return (
                  <rect
                    key={s.key}
                    x={x}
                    y={cursor}
                    width={barW}
                    height={h}
                    fill={s.color}
                    rx={radius}
                    opacity={hover === null || isHover ? 1 : 0.35}
                  />
                );
              })}
              {total > 0 && (
                <text
                  x={x + barW / 2}
                  y={padT + plotH - (total / top) * plotH - 7}
                  className="ua-bar-total"
                  textAnchor="middle"
                  opacity={isHover ? 1 : 0}
                >
                  {total}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={H - 9}
                className="ua-axis"
                textAnchor="middle"
                opacity={isHover ? 1 : 0.65}
              >
                {m.month.slice(5)}
              </text>
            </g>
          );
        })}
      </svg>

      {hover !== null && totals[hover] > 0 && (
        <div className="ua-tooltip">
          <strong>{months[hover].month}</strong>
          {SERIES.map((s) =>
            months[hover][s.key] ? (
              <span key={s.key}>
                <i style={{ background: s.color }} />
                {s.label}: {months[hover][s.key]}
              </span>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
