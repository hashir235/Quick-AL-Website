import React from 'react';

import { dashAgo, dashDate } from '../lib/format.js';
import { ActivityChart } from './ActivityChart.jsx';

/// One user's own record, opened under their row.
///
/// Everything here is that user's: who they are, what they have built, and how
/// their use of the app has moved month by month. Nothing is averaged against
/// anyone else, because the question this answers is "what is this shop
/// doing?" and a comparison would only blur it.
export function UserActivityPanel({ user, apiBaseUrl, token }) {
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
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : 'Could not load activity.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user.id, apiBaseUrl, token]);

  const totals = data?.totals;
  // Against the thirty days before it, so "busier or quieter than last month"
  // reads off the panel without anyone doing the arithmetic.
  const trend = totals ? totals.projectsLast30 - totals.projectsPrev30 : 0;
  const months = data?.monthly || [];
  const activeMonths = months.filter((m) => m.worked > 0).length;

  const identity = [
    ['Name', user.fullName || user.contractorName],
    ['Email', user.email],
    ['Workshop', user.workshopName],
    ['Phone', user.workshopPhone],
    ['City', user.city],
    ['Address', user.workshopAddress],
    ['Plan', user.plan || user.subscriptionStatus],
    ['App version', user.appVersion ? `v${user.appVersion}` : ''],
    ['Joined', dashDate(user.createdAt)],
    ['Last seen', dashAgo(user.lastSeenAt)],
  ].filter(([, value]) => value);

  return (
    <div className="ua-panel">
      <div className="ua-identity">
        {identity.map(([label, value]) => (
          <div key={label} className="ua-identity-item">
            <span className="ua-identity-label">{label}</span>
            <span className="ua-identity-value">{value}</span>
          </div>
        ))}
      </div>

      {loading && <p className="ua-note">Loading this user&rsquo;s record&hellip;</p>}
      {error && <p className="ua-note ua-note-error">{error}</p>}

      {data && !loading && (
        <>
          <div className="ua-stats">
            <ActivityStat
              value={totals.projectsAll}
              label="Projects, all time"
              sub={
                totals.lastProjectAt
                  ? `latest ${dashAgo(totals.lastProjectAt)}`
                  : 'none yet'
              }
            />
            <ActivityStat value={totals.projectsLast30} label="Last 30 days" />
            <ActivityStat
              value={trend > 0 ? `+${trend}` : String(trend)}
              label="vs 30 days before"
              tone={trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'}
            />
            <ActivityStat value={totals.windowsAll} label="Windows entered" />
            <ActivityStat
              value={`${activeMonths}/12`}
              label="Months worked"
              sub="months with any activity"
            />
          </div>

          <div className="ua-chart-block">
            <div className="ua-chart-head">
              <h4>Projects started</h4>
              <div className="ua-legend">
                <span><i style={{ background: '#4C8DFF' }} />Estimation</span>
                <span><i style={{ background: '#17C3B2' }} />Fabrication</span>
                <span><i style={{ background: '#FFAF5F' }} />Glass</span>
              </div>
            </div>
            <ActivityChart months={months} />
          </div>

          <div className="ua-chart-block">
            <div className="ua-chart-head">
              <h4>Months they actually worked</h4>
            </div>
            <p className="ua-note ua-note-quiet">
              Projects touched in that month. Someone can spend a month on jobs
              opened earlier, and counting new projects alone would read as
              though they had stopped.
            </p>
            <WorkedStrip months={months} />
          </div>
        </>
      )}
    </div>
  );
}

function ActivityStat({ value, label, sub, tone }) {
  return (
    <div className="ua-stat">
      <span className={tone ? `ua-stat-value ua-stat-${tone}` : 'ua-stat-value'}>
        {value}
      </span>
      <span className="ua-stat-label">{label}</span>
      {sub && <span className="ua-stat-sub">{sub}</span>}
    </div>
  );
}

/// A twelve-month heat strip. Colour depth carries the amount, so a glance
/// shows the busy stretches and the gaps without reading a single number.
function WorkedStrip({ months }) {
  const peak = Math.max(1, ...months.map((m) => m.worked));
  return (
    <div className="ua-worked">
      {months.map((m) => {
        const ratio = m.worked / peak;
        return (
          <div key={m.month} className="ua-worked-cell">
            <div
              className="ua-worked-box"
              style={{
                background: m.worked
                  ? `rgba(76, 141, 255, ${0.18 + ratio * 0.72})`
                  : 'rgba(255,255,255,0.05)',
              }}
              title={`${m.month}: ${m.worked} project${m.worked === 1 ? '' : 's'} touched`}
            >
              {m.worked > 0 && <span>{m.worked}</span>}
            </div>
            <small>{m.month.slice(5)}</small>
          </div>
        );
      })}
    </div>
  );
}
