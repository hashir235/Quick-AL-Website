import React from 'react';

export function ActivityChart({ months }) {
  const series = [
    { key: 'estimation', label: 'Estimation', color: '#3882E4' },
    { key: 'fabrication', label: 'Fabrication', color: '#12A594' },
    { key: 'glass', label: 'Glass', color: '#E07B39' },
  ];
  const peak = Math.max(1, ...months.map((m) => m.estimation + m.fabrication + m.glass));
  const width = 720;
  const height = 200;
  const padLeft = 34;
  const padBottom = 26;
  const plotH = height - padBottom - 10;
  const slot = (width - padLeft) / Math.max(1, months.length);
  const barW = Math.min(26, slot * 0.55);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="dash-activity-chart" role="img"
         aria-label="Projects per month">
      {[0, 0.5, 1].map((f) => {
        const y = 10 + plotH * (1 - f);
        return (
          <g key={f}>
            <line x1={padLeft} x2={width} y1={y} y2={y} stroke="rgba(255,255,255,0.12)" />
            <text x={0} y={y + 4} className="dash-chart-axis">{Math.round(peak * f)}</text>
          </g>
        );
      })}
      {months.map((m, i) => {
        const x = padLeft + i * slot + (slot - barW) / 2;
        let stackTop = 10 + plotH;
        return (
          <g key={m.month}>
            {series.map((s) => {
              const v = m[s.key] || 0;
              if (!v) return null;
              const h = (v / peak) * plotH;
              stackTop -= h;
              return (
                <rect key={s.key} x={x} y={stackTop} width={barW} height={h}
                      fill={s.color} rx="2">
                  <title>{`${m.month} — ${s.label}: ${v}`}</title>
                </rect>
              );
            })}
            <text x={x + barW / 2} y={height - 8} className="dash-chart-axis"
                  textAnchor="middle">
              {m.month.slice(5)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/// One user's own record: who they are, and how their use of the app has gone
/// month by month. Nothing here is aggregated across users.
