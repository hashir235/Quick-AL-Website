import React from 'react';
import { dashNumber } from '../lib/format.js';

export function DashBar({ label, value, total, color, note }) {
  const share = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="dash-bar-row">
      <div className="dash-bar-head">
        <span className="dash-bar-label">
          <span className="dash-bar-dot" style={{ background: color }} />
          {label}
        </span>
        <span className="dash-bar-value">
          <strong>{dashNumber(value)}</strong> <em>{share}%</em>
        </span>
      </div>
      <div className="dash-bar-track">
        <div className="dash-bar-fill" style={{ width: `${share}%`, background: color }} />
      </div>
      {note && <span className="dash-bar-note">{note}</span>}
    </div>
  );
}

/// Turns the user list into a CSV the owner can open in Excel.
