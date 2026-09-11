import React from 'react';

import { dashAgo, dashDate, dashSourceLabels } from '../lib/format.js';
import { ActivityChart } from './ActivityChart.jsx';

/// One user's own record, opened under their row.
///
/// Everything here is that user's: who they are, what they have built, and how
/// their use of the app has moved month by month. Nothing is averaged against
/// anyone else, because the question this answers is "what is this shop
/// doing?" and a comparison would only blur it.
const PLAN_FALLBACK = [
  { id: 'quarterly', title: '3 Months', durationMonths: 3 },
  { id: 'halfyearly', title: '6 Months', durationMonths: 6 },
  { id: 'yearly', title: '1 Year', durationMonths: 12 },
];

function planDate(value) {
  if (!value) return '';
  const at = new Date(value);
  if (Number.isNaN(at.getTime())) return '';
  return at.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/// Putting one shop on a plan.
///
/// There is no request to approve and no payment to check: the terms were
/// settled between the owner and the shop, and this is where that decision is
/// recorded. A plan runs from today, so "6 months" means six months from now
/// and not from the end of whatever they already had -- what that replaces is
/// printed above the buttons rather than left to be discovered.
function PlanControl({ user, apiBaseUrl, token, onChanged }) {
  const [plans, setPlans] = React.useState(PLAN_FALLBACK);
  const [expiresAt, setExpiresAt] = React.useState(user.subscriptionExpiresAt || null);
  const [status, setStatus] = React.useState(user.subscriptionStatus || '');
  const [busy, setBusy] = React.useState('');
  const [error, setError] = React.useState('');
  const [saved, setSaved] = React.useState('');

  React.useEffect(() => {
    setExpiresAt(user.subscriptionExpiresAt || null);
    setStatus(user.subscriptionStatus || '');
    setError('');
    setSaved('');
  }, [user.id, user.subscriptionExpiresAt, user.subscriptionStatus]);

  // The price list the website actually sells, so the panel can never offer a
  // plan that does not exist. Falls back to the three it has always had if an
  // older backend does not answer.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/admin/panel/plans`, {
          headers: { 'x-quickal-panel-token': token },
        });
        const payload = await response.json();
        if (!cancelled && response.ok && Array.isArray(payload.plans) && payload.plans.length) {
          setPlans(payload.plans);
        }
      } catch {
        // Keep the fallback.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, token]);

  async function send(body, label) {
    setBusy(label);
    setError('');
    setSaved('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/user-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-quickal-panel-token': token,
        },
        body: JSON.stringify({ userId: user.id, ...body }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not change the plan.');
      if (body.revoke) {
        setExpiresAt(null);
        setStatus('No plan');
        setSaved(payload.removed ? 'Granted plan removed.' : 'There was no granted plan to remove.');
      } else {
        setExpiresAt(payload.expiresAt);
        setStatus('Subscribed');
        setSaved(`On ${payload.plan.title} until ${planDate(payload.expiresAt)}.`);
      }
      // The row under this panel carries the status and its colour, and both
      // have just changed.
      if (onChanged) onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not change the plan.');
    } finally {
      setBusy('');
    }
  }

  const until = planDate(expiresAt);
  const live = expiresAt && new Date(expiresAt).getTime() > Date.now();

  return (
    <div className="ua-plan">
      <div className="ua-plan-head">
        <div>
          <h4>Subscription</h4>
          <p className="ua-plan-state">
            {live
              ? `Subscribed until ${until}.`
              : until
                ? `Expired on ${until}.`
                : `${status || 'No plan'} — nothing granted yet.`}
          </p>
        </div>
      </div>

      <div className="ua-plan-actions">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className="ua-plan-btn"
            disabled={Boolean(busy)}
            onClick={() => send({ planId: plan.id }, plan.id)}
          >
            {busy === plan.id ? 'Starting…' : `Start ${plan.title}`}
          </button>
        ))}
        {live && (
          <button
            type="button"
            className="ua-plan-btn is-remove"
            disabled={Boolean(busy)}
            onClick={() => send({ revoke: true }, 'revoke')}
          >
            {busy === 'revoke' ? 'Removing…' : 'Remove granted plan'}
          </button>
        )}
      </div>

      <p className="ua-plan-hint">
        A plan starts today. Granting one while another is running replaces it,
        so the remaining time is given up — the date above says what that is.
        Only a plan granted here can be removed; one they paid for is untouched.
      </p>
      {error && <p className="ua-note ua-note-error">{error}</p>}
      {saved && <p className="ua-note ua-note-ok">{saved}</p>}
    </div>
  );
}

/// Switching one shop off, with the reason they will read.
///
/// The switch and the message sit together because neither is any use alone:
/// an account switched off with no reason sends somebody to the phone with
/// nothing to go on, and a message with nothing switched off is never seen.
/// So the message is required before the switch will go off, and the button
/// says so rather than failing afterwards.
function AccountAccessControl({ user, apiBaseUrl, token, onChanged }) {
  const [blocked, setBlocked] = React.useState(Boolean(user.blocked));
  const [message, setMessage] = React.useState(user.blockMessage || '');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [saved, setSaved] = React.useState('');

  // A different row was opened: start again from that user's own state rather
  // than leaving the last one's message in the box.
  React.useEffect(() => {
    setBlocked(Boolean(user.blocked));
    setMessage(user.blockMessage || '');
    setError('');
    setSaved('');
  }, [user.id, user.blocked, user.blockMessage]);

  const trimmed = message.trim();
  const canSwitchOff = trimmed.length > 0;

  async function apply(nextBlocked) {
    setBusy(true);
    setError('');
    setSaved('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/user-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-quickal-panel-token': token,
        },
        body: JSON.stringify({
          userId: user.id,
          blocked: nextBlocked,
          message: trimmed,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not change access.');
      setBlocked(Boolean(payload.user.blocked));
      setMessage(payload.user.blockMessage || '');
      // The row behind this panel still shows the old state until the list is
      // reloaded, so say what happened here rather than leaving it ambiguous.
      setSaved(
        payload.user.blocked
          ? 'Account switched off. They will see your message on next open.'
          : 'Account switched back on.',
      );
      // The row shows an "off" tag, which has just appeared or gone.
      if (onChanged) onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not change access.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={blocked ? 'ua-access is-blocked' : 'ua-access'}>
      <div className="ua-access-head">
        <div>
          <h4>App access</h4>
          <p className="ua-access-state">
            {blocked
              ? 'Switched off — this shop cannot use the app.'
              : 'On — this shop can use the app normally.'}
          </p>
        </div>
        <button
          type="button"
          className={blocked ? 'ua-switch is-off' : 'ua-switch is-on'}
          role="switch"
          aria-checked={!blocked}
          aria-label="App access"
          disabled={busy || (!blocked && !canSwitchOff)}
          title={
            !blocked && !canSwitchOff
              ? 'Write the message this shop will see before switching them off'
              : undefined
          }
          onClick={() => apply(!blocked)}
        >
          <span className="ua-switch-knob" />
        </button>
      </div>

      <label className="ua-access-label" htmlFor={`block-msg-${user.id}`}>
        Message shown to this shop
      </label>
      <textarea
        id={`block-msg-${user.id}`}
        className="ua-access-message"
        rows={3}
        maxLength={1000}
        placeholder="e.g. Your payment for August has not cleared. Please contact us on 0300-0000000 to restore access."
        value={message}
        disabled={busy}
        onChange={(event) => setMessage(event.target.value)}
      />
      <div className="ua-access-foot">
        <span className="ua-access-hint">
          {blocked
            ? 'Edit the message and press Update to change what they read.'
            : 'Required before the account can be switched off.'}
        </span>
        {blocked && (
          <button
            type="button"
            className="ua-access-update"
            disabled={busy || !canSwitchOff}
            onClick={() => apply(true)}
          >
            Update message
          </button>
        )}
      </div>
      {error && <p className="ua-note ua-note-error">{error}</p>}
      {saved && <p className="ua-note ua-note-ok">{saved}</p>}
    </div>
  );
}

export function UserActivityPanel({ user, apiBaseUrl, token, onUserChanged }) {
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

  // App opens. An older backend answers without this block, so every field is
  // defaulted rather than assumed -- the panel should still render for
  // whoever is looking at it mid-deploy.
  const views = {
    total: data?.views?.total ?? 0,
    last7: data?.views?.last7 ?? 0,
    last30: data?.views?.last30 ?? 0,
    daily: data?.views?.daily ?? [],
  };
  // Counting began the day this shipped; before that there is no record, and
  // a chart that starts at zero without saying why reads as "they stopped
  // using it".
  const countingSince = COUNTING_STARTED_ON;

  const identity = [
    ['Name', user.fullName || user.contractorName],
    ['Email', user.email],
    ['Workshop', user.workshopName],
    ['Phone', user.workshopPhone],
    ['City', user.city],
    ['Address', user.workshopAddress],
    ['Plan', user.plan || user.subscriptionStatus],
    // Which of the two apps this person is on *now*. People move between the
    // Play build and the website APK, and the row this panel opens under
    // already says so -- but the panel is where you look when you want one
    // shop's full picture, so it has to answer it too.
    ['App', dashSourceLabels[user.installSource] || ''],
    ['App version', user.appVersion ? `v${user.appVersion}` : ''],
    ['Joined', dashDate(user.createdAt)],
    ['Last seen', dashAgo(user.lastSeenAt)],
  ].filter(([, value]) => value);

  return (
    <div className="ua-panel">
      <PlanControl
        user={user}
        apiBaseUrl={apiBaseUrl}
        token={token}
        onChanged={onUserChanged}
      />
      <AccountAccessControl
        user={user}
        apiBaseUrl={apiBaseUrl}
        token={token}
        onChanged={onUserChanged}
      />

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
              <h4>App opens</h4>
              <div className="ua-legend">
                <span>{views.total} total</span>
                <span>{views.last7} in 7 days</span>
                <span>{views.last30} in 30 days</span>
              </div>
            </div>
            <p className="ua-note ua-note-quiet">
              One count each time the app is opened. Counting started on{' '}
              {countingSince}, so anything before that is not in here.
            </p>
            <DailyViewsChart daily={views.daily} />
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

/// The day counting began. Before this date there is no record of app opens,
/// and a chart that simply starts at zero would read as a shop that stopped
/// using the app rather than one we had not started counting yet.
const COUNTING_STARTED_ON = '1 September 2026';

/// Thirty days of app opens, one bar a day.
///
/// Bars rather than a line: opening the app is a discrete thing that happened
/// a whole number of times, and a line drawn between two days implies values
/// in between that nobody recorded. Quiet days keep their slot so a gap looks
/// like a gap.
function DailyViewsChart({ daily }) {
  if (!daily.length) {
    return <p className="ua-note ua-note-quiet">No opens recorded yet.</p>;
  }
  const peak = Math.max(1, ...daily.map((d) => d.views));
  return (
    <div className="ua-views">
      {daily.map((d) => {
        const ratio = d.views / peak;
        return (
          <div key={d.day} className="ua-views-cell" title={`${d.day}: ${d.views} open${d.views === 1 ? '' : 's'}`}>
            <div className="ua-views-track">
              <div
                className="ua-views-bar"
                style={{
                  // A day with opens always shows something, however small its
                  // share of the peak -- a one-pixel bar reads as zero.
                  height: d.views ? `${Math.max(8, ratio * 100)}%` : '2px',
                  background: d.views
                    ? 'rgba(76, 141, 255, 0.85)'
                    : 'rgba(255,255,255,0.10)',
                }}
              />
            </div>
            <small>{d.day.slice(8)}</small>
          </div>
        );
      })}
    </div>
  );
}
