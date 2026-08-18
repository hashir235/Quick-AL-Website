import React from 'react';
import { ActivityChart } from './ActivityChart.jsx';
import { dashAgo, dashDate } from '../lib/format.js';

export function UserActivityPanel({ user, apiBaseUrl, token, onClose }) {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/admin/panel/user-activity?userId=${encodeURIComponent(user.id)}`,
          { headers: { 'x-quickal-panel-token': token } },
        );
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Could not load activity.');
        if (!cancelled) setData(payload);
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Could not load activity.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user.id, apiBaseUrl, token]);

  const totals = data?.totals;
  // Against the thirty days before, so "busier or quieter than last month"
  // can be read without doing the arithmetic.
  const trend = totals
    ? totals.projectsLast30 - totals.projectsPrev30
    : 0;

  return (
    <div className="dash-drawer-backdrop" onClick={onClose}>
      <div className="dash-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="dash-drawer-head">
          <div>
            <h3>{user.fullName || user.contractorName || user.email}</h3>
            <p>
              {user.workshopName || 'No workshop name'}
              {user.city ? ` · ${user.city}` : ''}
              {user.email ? ` · ${user.email}` : ''}
            </p>
          </div>
          <button type="button" className="dash-view-btn" onClick={onClose}>Close</button>
        </div>

        {loading && <p className="dash-drawer-note">Loading…</p>}
        {error && <p className="dash-drawer-note dash-drawer-error">{error}</p>}

        {data && !loading && (
          <>
            <div className="dash-drawer-stats">
              <div><span>{totals.projectsAll}</span><small>Projects, all time</small></div>
              <div><span>{totals.projectsLast30}</span><small>Last 30 days</small></div>
              <div>
                <span style={{ color: trend > 0 ? '#3ddc97' : trend < 0 ? '#ff8b6b' : undefined }}>
                  {trend > 0 ? `+${trend}` : trend}
                </span>
                <small>vs 30 days before</small>
              </div>
              <div><span>{totals.windowsAll}</span><small>Windows entered</small></div>
            </div>

            <h4 className="dash-drawer-subhead">Projects started, by month</h4>
            <ActivityChart months={data.monthly} />
            <div className="dash-chart-legend">
              <span><i style={{ background: '#3882E4' }} />Estimation</span>
              <span><i style={{ background: '#12A594' }} />Fabrication</span>
              <span><i style={{ background: '#E07B39' }} />Glass</span>
            </div>

            <h4 className="dash-drawer-subhead">Months they actually worked</h4>
            <p className="dash-drawer-note">
              Projects touched that month — someone can spend a month on jobs
              opened earlier, and by new projects alone that reads as though
              they had stopped.
            </p>
            <div className="dash-worked-row">
              {data.monthly.map((m) => (
                <div key={m.month} className="dash-worked-cell" title={`${m.month}: ${m.worked}`}>
                  <div
                    className="dash-worked-fill"
                    style={{
                      height: `${Math.min(100, (m.worked / Math.max(1, ...data.monthly.map((x) => x.worked))) * 100)}%`,
                      opacity: m.worked ? 1 : 0.15,
                    }}
                  />
                  <small>{m.month.slice(5)}</small>
                </div>
              ))}
            </div>

            <div className="dash-drawer-meta">
              <span>Joined {dashDate(data.user.createdAt)}</span>
              <span>Last seen {dashAgo(data.user.lastSeenAt)}</span>
              {data.user.appVersion && <span>v{data.user.appVersion}</span>}
              {totals.lastProjectAt && (
                <span>Last project {dashAgo(totals.lastProjectAt)}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
