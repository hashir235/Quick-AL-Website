import React from 'react';
import {
  BadgeCheck,
  Clock,
  CreditCard,
  Download,
  Gauge,
  Globe,
  LockKeyhole,
  Phone,
  Send,
  Settings,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { App } from '../../App.jsx';
import { DashBar } from './components/DashBar.jsx';
import { DashTrendChart } from './components/DashTrendChart.jsx';
import { ProjectCountCell } from './components/ProjectCountCell.jsx';
import { UserActivityPanel } from './components/UserActivityPanel.jsx';
import { dashDownloadCsv } from './lib/csv.js';
import { dashAgo, dashDate, dashNumber, dashSubscriptionRows } from './lib/format.js';
import { apiBaseUrl } from '../../lib/site.js';

export function AdminDashboardPage() {
  const [activityUser, setActivityUser] = React.useState(null);
  const [panelToken, setPanelToken] = React.useState(
    () => window.localStorage.getItem('quickalPanelToken') || '',
  );
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [summary, setSummary] = React.useState(null);
  const [manualEnabled, setManualEnabled] = React.useState(false);
  const [manualBusy, setManualBusy] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [notifType, setNotifType] = React.useState('general');
  const [notifTitle, setNotifTitle] = React.useState('');
  const [notifBody, setNotifBody] = React.useState('');
  const [notifBusy, setNotifBusy] = React.useState(false);
  const [notifMsg, setNotifMsg] = React.useState('');
  const [notifFailed, setNotifFailed] = React.useState(false);
  const [sentNotifs, setSentNotifs] = React.useState([]);
  const [deletingId, setDeletingId] = React.useState('');
  const [userList, setUserList] = React.useState([]);
  const [userTotals, setUserTotals] = React.useState(null);
  const [usersLoading, setUsersLoading] = React.useState(false);
  const [usersError, setUsersError] = React.useState('');
  const [series, setSeries] = React.useState(null);
  const [rangeDays, setRangeDays] = React.useState(30);
  const [chartMetric, setChartMetric] = React.useState('pageViews');
  const [search, setSearch] = React.useState('');
  const [sourceFilter, setSourceFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [sortKey, setSortKey] = React.useState('joined');
  const [sortDir, setSortDir] = React.useState('desc');
  const [release, setRelease] = React.useState(null);
  const [playCode, setPlayCode] = React.useState('');
  const [playName, setPlayName] = React.useState('');
  const [playMsg, setPlayMsg] = React.useState('');
  const [playBusy, setPlayBusy] = React.useState(false);
  const [playNote, setPlayNote] = React.useState('');

  const loadSummary = React.useCallback(
    async (tokenOverride) => {
      const token = tokenOverride || panelToken;
      if (!token) return;
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBaseUrl}/api/admin/panel/summary`, {
          headers: { 'x-quickal-panel-token': token },
        });
        const payload = await response.json();
        if (response.status === 401) {
          window.localStorage.removeItem('quickalPanelToken');
          setPanelToken('');
          setSummary(null);
          throw new Error('Session expired. Please log in again.');
        }
        if (!response.ok) throw new Error(payload.error || 'Analytics failed to load.');
        setSummary(payload.summary);
        setManualEnabled(Boolean(payload.settings && payload.settings.manualPaymentEnabled));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Analytics failed to load.');
      } finally {
        setLoading(false);
      }
    },
    [panelToken],
  );

  const loadUsers = React.useCallback(
    async (tokenOverride, options) => {
      const token = tokenOverride || panelToken;
      if (!token) return;
      const opts = options || {};
      setUsersLoading(true);
      setUsersError('');
      try {
        const params = new URLSearchParams();
        const q = opts.q !== undefined ? opts.q : search;
        const src = opts.source !== undefined ? opts.source : sourceFilter;
        const st = opts.status !== undefined ? opts.status : statusFilter;
        const sk = opts.sort !== undefined ? opts.sort : sortKey;
        const sd = opts.dir !== undefined ? opts.dir : sortDir;
        if (q.trim()) params.set('q', q.trim());
        if (src) params.set('source', src);
        if (st) params.set('status', st);
        params.set('sort', sk);
        params.set('dir', sd);

        const response = await fetch(
          `${apiBaseUrl}/api/admin/panel/users?${params.toString()}`,
          { headers: { 'x-quickal-panel-token': token } },
        );
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Could not load users.');
        setUserList(Array.isArray(payload.users) ? payload.users : []);
        setUserTotals(payload.totals || null);
      } catch (caught) {
        setUsersError(caught instanceof Error ? caught.message : 'Could not load users.');
      } finally {
        setUsersLoading(false);
      }
    },
    [panelToken, search, sourceFilter, statusFilter, sortKey, sortDir],
  );

  const loadRelease = React.useCallback(
    async (tokenOverride) => {
      const token = tokenOverride || panelToken;
      if (!token) return;
      try {
        const response = await fetch(`${apiBaseUrl}/api/admin/panel/release`, {
          headers: { 'x-quickal-panel-token': token },
        });
        const payload = await response.json();
        if (!response.ok) return;
        setRelease(payload);
        setPlayCode(String(payload.playStore.latestVersionCode || ''));
        setPlayName(String(payload.playStore.latestVersionName || ''));
        setPlayMsg(String(payload.playStore.updateMessage || ''));
      } catch {
        // Not fatal -- the rest of the dashboard still works.
      }
    },
    [panelToken],
  );

  async function savePlayVersion(event) {
    event.preventDefault();
    setPlayBusy(true);
    setPlayNote('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/release`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-quickal-panel-token': panelToken,
        },
        body: JSON.stringify({
          latestVersionCode: Number(playCode),
          latestVersionName: playName.trim(),
          updateMessage: playMsg.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save.');
      setRelease(payload);
      setPlayNote('Saved. Play Store users will be prompted the next time they open the app.');
    } catch (caught) {
      setPlayNote(caught instanceof Error ? caught.message : 'Could not save.');
    } finally {
      setPlayBusy(false);
    }
  }

  const loadSeries = React.useCallback(
    async (tokenOverride, days) => {
      const token = tokenOverride || panelToken;
      if (!token) return;
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/admin/panel/timeseries?days=${days || rangeDays}`,
          { headers: { 'x-quickal-panel-token': token } },
        );
        const payload = await response.json();
        if (response.ok) setSeries(payload);
      } catch {
        // The charts are a nice-to-have; the numbers above them still load.
      }
    },
    [panelToken, rangeDays],
  );

  async function toggleManualPayment() {
    const next = !manualEnabled;
    setManualBusy(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/manual-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-quickal-panel-token': panelToken,
        },
        body: JSON.stringify({ enabled: next }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not update the setting.');
      setManualEnabled(Boolean(payload.manualPaymentEnabled));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not update the setting.');
    } finally {
      setManualBusy(false);
    }
  }

  // A 401 means the 12-hour panel session ran out while this page sat open.
  // Clearing the token brings the login form back; leaving it in place gives a
  // dashboard that looks signed in but silently refuses to do anything.
  function handleExpiredSession(response) {
    if (response.status !== 401) return false;
    window.localStorage.removeItem('quickalPanelToken');
    setPanelToken('');
    setSummary(null);
    return true;
  }

  const loadNotifications = React.useCallback(
    async (tokenOverride) => {
      const token = tokenOverride || panelToken;
      if (!token) return;
      try {
        const response = await fetch(`${apiBaseUrl}/api/admin/panel/notifications`, {
          headers: { 'x-quickal-panel-token': token },
        });
        if (!response.ok) return;
        const payload = await response.json();
        setSentNotifs(payload.notifications || []);
      } catch {
        // The send form still works without the history.
      }
    },
    [panelToken],
  );

  async function sendNotification(event) {
    event.preventDefault();
    setNotifBusy(true);
    // The result belongs next to the button. It used to go into the page-wide
    // error banner at the very top, so a failure down here was invisible and
    // the whole feature looked broken.
    setNotifMsg('');
    setNotifFailed(false);
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-quickal-panel-token': panelToken,
        },
        body: JSON.stringify({
          type: notifType,
          title: notifTitle.trim(),
          body: notifBody.trim(),
        }),
      });
      if (handleExpiredSession(response)) {
        throw new Error('Session expired. Log in again and resend.');
      }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not send the notification.');
      setNotifMsg('Sent. Every app user will see it the next time they open the app.');
      setNotifTitle('');
      setNotifBody('');
      setNotifType('general');
      loadNotifications();
    } catch (caught) {
      setNotifFailed(true);
      setNotifMsg(
        caught instanceof Error ? caught.message : 'Could not send the notification.',
      );
    } finally {
      setNotifBusy(false);
    }
  }

  async function deleteNotification(id) {
    setNotifMsg('');
    setNotifFailed(false);
    setDeletingId(id);
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/panel/notifications/${id}`,
        { method: 'DELETE', headers: { 'x-quickal-panel-token': panelToken } },
      );
      if (handleExpiredSession(response)) {
        throw new Error('Session expired. Log in again.');
      }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not delete it.');
      setSentNotifs((rows) => rows.filter((row) => row.id !== id));
      setNotifMsg('Deleted. It is off every user’s app too.');
    } catch (caught) {
      setNotifFailed(true);
      setNotifMsg(caught instanceof Error ? caught.message : 'Could not delete it.');
    } finally {
      setDeletingId('');
    }
  }

  React.useEffect(() => {
    if (panelToken) {
      loadSummary();
      loadUsers();
      loadSeries();
      loadRelease();
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Typing in the search box should not fire a request per keystroke.
  React.useEffect(() => {
    if (!panelToken) return undefined;
    const timer = setTimeout(() => loadUsers(), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sourceFilter, statusFilter, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'email' ? 'asc' : 'desc');
    }
  }

  function changeRange(days) {
    setRangeDays(days);
    loadSeries(null, days);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Login failed.');
      window.localStorage.setItem('quickalPanelToken', payload.token);
      setPanelToken(payload.token);
      setPassword('');
      await loadSummary(payload.token);
      loadUsers(payload.token);
      loadSeries(payload.token);
      loadRelease(payload.token);
      loadNotifications(payload.token);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem('quickalPanelToken');
    setPanelToken('');
    setSummary(null);
    setUserList([]);
    setSeries(null);
    setUserTotals(null);
    setError('');
  }

  const visits = summary?.websiteVisits;
  const downloads = summary?.apkDownloads;
  const users = summary?.appUsers;
  const subs = summary?.subscriptions;
  const installs = summary?.installs;
  const sourceTotals = installs?.bySource || userTotals?.bySource;
  const knownSourceTotal =
    (sourceTotals?.play_store || 0) + (sourceTotals?.website_apk || 0);
  const allSourceTotal = knownSourceTotal + (sourceTotals?.unknown || 0);

  const chartMetrics = [
    { key: 'pageViews', label: 'Website visits', color: '#3882E4' },
    { key: 'uniqueVisitors', label: 'Unique visitors', color: '#7C5CFF' },
    { key: 'apkDownloads', label: 'APK downloads', color: '#18B69B' },
    { key: 'signups', label: 'New sign-ups', color: '#F0932B' },
    { key: 'activeUsers', label: 'Active users', color: '#E0508A' },
  ];
  const activeMetric =
    chartMetrics.find((m) => m.key === chartMetric) || chartMetrics[0];

  return (
    <section className="legal-page admin-page">
      <div className="legal-header">
        <p className="eyebrow"><Gauge size={18} /> Owner Admin</p>
        <h1>Analytics Dashboard</h1>
        <p>Website visits, APK downloads, app usage and active subscriptions.</p>
      </div>
      <div className="legal-body admin-body">
        {!panelToken && (
          <form className="admin-token-row dash-login" onSubmit={handleLogin}>
            <label>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                type="password"
                autoComplete="current-password"
              />
            </label>
            <button
              className="primary-button"
              type="submit"
              disabled={loading || !username.trim() || !password}
            >
              <LockKeyhole size={17} />
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>
        )}

        {error && <p className="admin-error">{error}</p>}

        {panelToken && (
          <>
            <div className="dash-toolbar">
              <span className="dash-updated">
                {summary
                  ? `Updated ${new Date(summary.generatedAt).toLocaleString()}`
                  : loading
                    ? 'Loading analytics...'
                    : ''}
              </span>
              <div className="dash-toolbar-actions">
                <button
                  type="button"
                  onClick={() => {
                    loadSummary();
                    loadUsers();
                    loadSeries();
                    loadRelease();
                    loadNotifications();
                  }}
                  disabled={loading}
                >
                  Refresh
                </button>
                <a href="/admin-payments">Payment Approvals</a>
                <button type="button" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>

            {summary && (
              <>
                <article className="dash-card glass-card dash-settings">
                  <header><CreditCard size={20} /> Payment Settings</header>
                  <div className="dash-toggle-row">
                    <div>
                      <strong>Manual bank transfer</strong>
                      <span className="dash-sub">
                        {manualEnabled
                          ? 'ON — users can pay by bank transfer and submit a reference for your approval.'
                          : 'OFF — users can only pay online (Safepay). Bank transfer is shown to them but disabled.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={manualEnabled ? 'dash-toggle dash-toggle-on' : 'dash-toggle'}
                      onClick={toggleManualPayment}
                      disabled={manualBusy}
                      aria-pressed={manualEnabled}
                    >
                      <span className="dash-toggle-knob" />
                      <span className="dash-toggle-text">
                        {manualBusy ? '…' : manualEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                </article>

                {/* The six numbers worth glancing at before anything else. */}
                <div className="dash-kpis">
                  {[
                    { label: 'Website visits', value: visits.total, sub: `${dashNumber(visits.today)} today`, icon: Globe },
                    { label: 'APK downloads', value: downloads.total, sub: `${dashNumber(downloads.today)} today`, icon: Download },
                    { label: 'Total users', value: users.totalAccounts, sub: `${dashNumber(users.newLast30Days)} new in 30 days`, icon: Smartphone },
                    { label: 'Active users', value: users.activeLast30Days, sub: 'opened the app in 30 days', icon: BadgeCheck },
                    { label: 'Paid subscriptions', value: subs.totalActive, sub: `${dashNumber(summary.trials.active)} on free trial`, icon: CreditCard },
                    { label: 'Awaiting approval', value: summary.directPayments.pending, sub: 'bank transfer requests', icon: Clock, alert: summary.directPayments.pending > 0 },
                  ].map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                      <article
                        key={kpi.label}
                        className={kpi.alert ? 'dash-kpi glass-card dash-kpi-alert' : 'dash-kpi glass-card'}
                      >
                        <span className="dash-kpi-icon"><Icon size={18} /></span>
                        <strong className="dash-kpi-num">{dashNumber(kpi.value)}</strong>
                        <span className="dash-kpi-label">{kpi.label}</span>
                        <span className="dash-kpi-sub">{kpi.sub}</span>
                      </article>
                    );
                  })}
                </div>

                {/* Play Store vs website APK -- the split the owner kept
                    having to guess at. */}
                <article className="dash-card glass-card">
                  <header><Smartphone size={20} /> Where your users came from</header>
                  <span className="dash-sub">
                    {knownSourceTotal > 0
                      ? `Of ${dashNumber(allSourceTotal)} users, ${dashNumber(knownSourceTotal)} have told us where they installed from.`
                      : 'Nobody has opened the new build yet, so no install source has been reported.'}
                  </span>
                  <div className="dash-bars">
                    {['play_store', 'website_apk', 'unknown'].map((key) => (
                      <DashBar
                        key={key}
                        label={dashSourceLabels[key]}
                        value={sourceTotals ? sourceTotals[key] : 0}
                        total={allSourceTotal}
                        color={dashSourceColors[key]}
                        note={
                          key === 'unknown'
                            ? 'They will move into the right group the next time they open an updated app.'
                            : installs
                              ? `${dashNumber(installs.activeBySource[key])} active in the last 30 days`
                              : null
                        }
                      />
                    ))}
                  </div>
                  {installs && installs.byAppVersion.length > 0 && (
                    <div className="dash-versions">
                      <span className="dash-sub">App versions in use</span>
                      <div className="dash-chip-row">
                        {installs.byAppVersion.map((row) => (
                          <span className="dash-chip" key={row.version}>
                            {row.version} <strong>{dashNumber(row.total)}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>

                {/* Totals say where you are; these say which way you are
                    heading. */}
                <article className="dash-card glass-card dash-trends">
                  <header><Gauge size={20} /> Trends</header>
                  <div className="dash-trend-controls">
                    <div className="dash-chip-row">
                      {chartMetrics.map((metric) => (
                        <button
                          key={metric.key}
                          type="button"
                          className={metric.key === chartMetric ? 'dash-chip dash-chip-on' : 'dash-chip'}
                          onClick={() => setChartMetric(metric.key)}
                          style={metric.key === chartMetric ? { borderColor: metric.color, color: metric.color } : undefined}
                        >
                          {metric.label}
                        </button>
                      ))}
                    </div>
                    <div className="dash-chip-row">
                      {[7, 30, 90].map((days) => (
                        <button
                          key={days}
                          type="button"
                          className={days === rangeDays ? 'dash-chip dash-chip-on' : 'dash-chip'}
                          onClick={() => changeRange(days)}
                        >
                          {days} days
                        </button>
                      ))}
                    </div>
                  </div>
                  <DashTrendChart
                    points={series ? series.points : null}
                    metric={activeMetric.key}
                    color={activeMetric.color}
                  />
                </article>

                <div className="dash-grid">
                  <article className="dash-card glass-card">
                    <header><Globe size={20} /> Website Visits</header>
                    <strong className="dash-num">{visits.total}</strong>
                    <span className="dash-sub">total page views</span>
                    <ul>
                      <li><span>Today</span><strong>{visits.today}</strong></li>
                      <li><span>Last 7 days</span><strong>{visits.last7Days}</strong></li>
                      <li><span>Last 30 days</span><strong>{visits.last30Days}</strong></li>
                      <li>
                        <span>Unique visitors (30 days)</span>
                        <strong>{visits.uniqueVisitors.last30Days}</strong>
                      </li>
                    </ul>
                  </article>

                  <article className="dash-card glass-card">
                    <header><Download size={20} /> APK Downloads</header>
                    <strong className="dash-num">{downloads.total}</strong>
                    <span className="dash-sub">total downloads (website APK)</span>
                    <ul>
                      <li><span>Today</span><strong>{downloads.today}</strong></li>
                      <li><span>Last 7 days</span><strong>{downloads.last7Days}</strong></li>
                      <li><span>Last 30 days</span><strong>{downloads.last30Days}</strong></li>
                    </ul>
                  </article>

                  <article className="dash-card glass-card">
                    <header><Smartphone size={20} /> App Users</header>
                    <strong className="dash-num">{users.totalAccounts}</strong>
                    <span className="dash-sub">registered accounts</span>
                    <ul>
                      <li><span>Active last 7 days</span><strong>{users.activeLast7Days}</strong></li>
                      <li><span>Active last 30 days</span><strong>{users.activeLast30Days}</strong></li>
                      <li><span>New last 30 days</span><strong>{users.newLast30Days}</strong></li>
                    </ul>
                  </article>

                  <article className="dash-card glass-card">
                    <header><Clock size={20} /> Trials &amp; Payments</header>
                    <strong className="dash-num">{summary.trials.active}</strong>
                    <span className="dash-sub">active free trials</span>
                    <ul>
                      <li><span>Trials started (total)</span><strong>{summary.trials.total}</strong></li>
                      <li>
                        <span>Pending payment requests</span>
                        <strong>{summary.directPayments.pending}</strong>
                      </li>
                    </ul>
                  </article>
                </div>

                <article className="dash-card glass-card dash-subs">
                  <header><CreditCard size={20} /> Active Subscriptions</header>
                  <strong className="dash-num">{subs.totalActive}</strong>
                  <span className="dash-sub">currently active paid subscriptions</span>
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Plan</th>
                        <th>Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashSubscriptionRows(subs.byPlan).map((row) => (
                        <tr key={`${row.provider}-${row.planId}`}>
                          <td>{dashProviderLabels[row.provider] || row.provider}</td>
                          <td>{dashPlanLabels[row.planId] || row.planId}</td>
                          <td>{row.activeCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </article>

                {/* The website APK is live the moment it is deployed; a Play
                    Store build only goes live once Google has reviewed it.
                    So the two carry separate numbers, and this is where the
                    Play one gets flipped -- after the release is actually
                    live on the store, not before. */}
                <article className="dash-card glass-card">
                  <header><Download size={20} /> Update prompts</header>
                  <span className="dash-sub">
                    What each group of users is currently being told. Users see the
                    prompt the next time they open the app.
                  </span>

                  {release && (
                    <div className="dash-release-grid">
                      <div className="dash-release-box">
                        <span className="dash-release-tag" style={{ color: dashSourceColors.website_apk }}>
                          <span className="dash-bar-dot" style={{ background: dashSourceColors.website_apk }} />
                          Website APK
                        </span>
                        <strong className="dash-release-num">
                          {release.website.latestVersionName || '—'}
                        </strong>
                        <span className="dash-kpi-sub">
                          build {release.website.latestVersionCode} · updates in-app
                        </span>
                      </div>
                      <div className="dash-release-box">
                        <span className="dash-release-tag" style={{ color: dashSourceColors.play_store }}>
                          <span className="dash-bar-dot" style={{ background: dashSourceColors.play_store }} />
                          Play Store
                        </span>
                        <strong className="dash-release-num">
                          {release.playStore.latestVersionCode > 0
                            ? release.playStore.latestVersionName || '—'
                            : 'Not set yet'}
                        </strong>
                        <span className="dash-kpi-sub">
                          {release.playStore.latestVersionCode > 0
                            ? `build ${release.playStore.latestVersionCode} · opens the store`
                            : 'nobody is being prompted'}
                        </span>
                      </div>
                    </div>
                  )}

                  <form className="notify-form" onSubmit={savePlayVersion}>
                    <p className="dash-sub" style={{ margin: 0 }}>
                      <strong>Set this only after Google has approved the release
                      and it is live on the store.</strong> Set it too early and
                      users land on a listing that still offers the old version.
                    </p>
                    <label>
                      Play Store build number
                      <input
                        value={playCode}
                        inputMode="numeric"
                        onChange={(e) => setPlayCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 33"
                      />
                    </label>
                    <label>
                      Version name
                      <input
                        value={playName}
                        maxLength={40}
                        onChange={(e) => setPlayName(e.target.value)}
                        placeholder="e.g. 1.8.3"
                      />
                    </label>
                    <label>
                      What changed
                      <textarea
                        value={playMsg}
                        maxLength={600}
                        rows={2}
                        onChange={(e) => setPlayMsg(e.target.value)}
                        placeholder="Shown to Play Store users in the update prompt."
                      />
                    </label>
                    {playNote && <p className="admin-message">{playNote}</p>}
                    <button className="primary-button" type="submit" disabled={playBusy || !playCode}>
                      <Download size={17} />
                      {playBusy ? 'Saving…' : 'Tell Play Store users'}
                    </button>
                  </form>
                </article>

                <article className="dash-card glass-card dash-notify">
                  <header><Send size={20} /> Send Notification</header>
                  <span className="dash-sub">
                    Broadcast to every app user. It appears in the app's bell icon the next time
                    they open the app (with an unread red dot until they view it).
                  </span>
                  <form className="notify-form" onSubmit={sendNotification}>
                    <label>
                      Type
                      <select
                        value={notifType}
                        onChange={(e) => setNotifType(e.target.value)}
                      >
                        <option value="general">📢 General message</option>
                        <option value="rate_update">🏷️ Rate list updated</option>
                        <option value="version_update">⬆️ App update available</option>
                      </select>
                    </label>
                    <label>
                      Title
                      <input
                        value={notifTitle}
                        maxLength={120}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        placeholder="e.g. New 2026 rates are live"
                      />
                    </label>
                    <label>
                      Message
                      <textarea
                        value={notifBody}
                        maxLength={1000}
                        rows={3}
                        onChange={(e) => setNotifBody(e.target.value)}
                        placeholder="e.g. Aluminium rates have been updated. Please refresh your rate list."
                      />
                    </label>
                    {notifMsg && (
                      <p className={notifFailed ? 'admin-error' : 'admin-message'}>
                        {notifMsg}
                      </p>
                    )}
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={notifBusy || !notifTitle.trim() || !notifBody.trim()}
                    >
                      <Send size={17} />
                      {notifBusy ? 'Sending…' : 'Send to all users'}
                    </button>
                  </form>

                  {/* Users read this same list, so deleting here takes a
                      notification off every phone -- which is what you want
                      when something went out with a wrong price or a typo. */}
                  <div className="notif-sent">
                    <h4>
                      Already sent
                      <span className="dash-count-pill">{sentNotifs.length}</span>
                    </h4>
                    {sentNotifs.length === 0 ? (
                      <p className="dash-sub">Nothing sent yet.</p>
                    ) : (
                      <ul className="notif-list">
                        {sentNotifs.map((n) => (
                          <li className="notif-row" key={n.id}>
                            <div className="notif-row-text">
                              <strong>{n.title}</strong>
                              <span>{n.body}</span>
                              <em>
                                {dashNotifTypeLabels[n.type] || n.type} ·{' '}
                                {dashAgo(n.created_at)}
                              </em>
                            </div>
                            <button
                              type="button"
                              className="notif-delete"
                              title="Delete for everyone"
                              disabled={deletingId === n.id}
                              onClick={() => deleteNotification(n.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </>
            )}

            <article className="dash-card glass-card dash-users">
              <header>
                <Smartphone size={20} /> Users
                <span className="dash-count-pill">
                  {dashNumber(userList.length)}
                  {userTotals && userList.length !== userTotals.all
                    ? ` of ${dashNumber(userTotals.all)}`
                    : ''}
                </span>
              </header>

              <div className="dash-filters">
                <label className="dash-search">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email, workshop, phone or city…"
                  />
                </label>

                <div className="dash-chip-row">
                  {[
                    { key: '', label: 'All sources' },
                    { key: 'play_store', label: dashSourceLabels.play_store },
                    { key: 'website_apk', label: dashSourceLabels.website_apk },
                    { key: 'unknown', label: dashSourceLabels.unknown },
                  ].map((option) => (
                    <button
                      key={option.key || 'all'}
                      type="button"
                      className={option.key === sourceFilter ? 'dash-chip dash-chip-on' : 'dash-chip'}
                      onClick={() => setSourceFilter(option.key)}
                    >
                      {option.label}
                      {userTotals && option.key && (
                        <strong> {dashNumber(userTotals.bySource[option.key])}</strong>
                      )}
                      {userTotals && !option.key && (
                        <strong> {dashNumber(userTotals.all)}</strong>
                      )}
                    </button>
                  ))}
                </div>

                <div className="dash-chip-row">
                  <button
                    type="button"
                    className={statusFilter === '' ? 'dash-chip dash-chip-on' : 'dash-chip'}
                    onClick={() => setStatusFilter('')}
                  >
                    Any plan
                  </button>
                  {Object.keys(userTotals?.byStatus || {}).sort().map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={status === statusFilter ? 'dash-chip dash-chip-on' : 'dash-chip'}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status} <strong>{dashNumber(userTotals.byStatus[status])}</strong>
                    </button>
                  ))}
                </div>

                <div className="dash-toolbar-actions">
                  <button type="button" onClick={() => loadUsers()} disabled={usersLoading}>
                    {usersLoading ? 'Loading…' : 'Refresh'}
                  </button>
                  <button
                    type="button"
                    onClick={() => dashDownloadCsv(userList)}
                    disabled={userList.length === 0}
                  >
                    Export CSV
                  </button>
                  {(search || sourceFilter || statusFilter) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setSourceFilter('');
                        setStatusFilter('');
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {usersError && <p className="admin-error">{usersError}</p>}

              <div className="dash-table-wrap">
                <table className="dash-table dash-table-users">
                  <thead>
                    <tr>
                      {[
                        { key: 'name', label: 'Name' },
                        { key: 'email', label: 'Email' },
                        { key: null, label: 'Workshop' },
                        { key: null, label: 'Phone' },
                        { key: null, label: 'City' },
                        { key: null, label: 'Projects' },
                        { key: null, label: 'Source' },
                        { key: null, label: 'Plan' },
                        { key: 'joined', label: 'Joined' },
                        { key: 'lastSeen', label: 'Last seen' },
                        { key: null, label: '' },
                      ].map((column) => (
                        <th
                          key={column.label}
                          className={column.key ? 'dash-th-sortable' : undefined}
                          onClick={column.key ? () => toggleSort(column.key) : undefined}
                        >
                          {column.label}
                          {column.key === sortKey && (
                            <span className="dash-sort-arrow">
                              {sortDir === 'asc' ? '▲' : '▼'}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((u) => (
                      <React.Fragment key={u.id}>
                      <tr className={activityUser?.id === u.id ? 'dash-row-open' : undefined}>
                        <td>{u.fullName || u.contractorName || '—'}</td>
                        <td className="dash-td-email">{u.email || '—'}</td>
                        <td>{u.workshopName || '—'}</td>
                        <td>{u.workshopPhone || '—'}</td>
                        {/* The chosen city, which decides their rate list.
                            This column used to show the street address, which
                            is not the same thing and not what it claimed. */}
                        <td title={u.workshopAddress || ''}>{u.city || '—'}</td>
                        <td><ProjectCountCell projects={u.projects} /></td>
                        <td>
                          <span
                            className="dash-source-tag"
                            style={{ color: dashSourceColors[u.installSource] }}
                          >
                            <span
                              className="dash-bar-dot"
                              style={{ background: dashSourceColors[u.installSource] }}
                            />
                            {dashSourceLabels[u.installSource]}
                          </span>
                          {u.appVersion && (
                            <span className="dash-version-tag">v{u.appVersion}</span>
                          )}
                        </td>
                        <td>
                          {u.subscriptionStatus}
                          {u.plan ? <span className="dash-version-tag">{u.plan}</span> : null}
                        </td>
                        <td>{dashDate(u.createdAt)}</td>
                        <td title={u.lastSeenAt ? new Date(u.lastSeenAt).toLocaleString() : ''}>
                          {dashAgo(u.lastSeenAt)}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={
                              activityUser?.id === u.id
                                ? 'dash-view-btn is-open'
                                : 'dash-view-btn'
                            }
                            onClick={() =>
                              setActivityUser(activityUser?.id === u.id ? null : u)
                            }
                          >
                            {activityUser?.id === u.id ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>
                      {/* The detail opens under the row it belongs to, so the
                          person reading it never loses which user they are
                          looking at -- which a floating panel does the moment
                          it covers the table. */}
                      {activityUser?.id === u.id && (
                        <tr className="dash-detail-row">
                          <td colSpan={11}>
                            <UserActivityPanel
                              user={u}
                              apiBaseUrl={apiBaseUrl}
                              token={panelToken}
                              onClose={() => setActivityUser(null)}
                            />
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    ))}
                    {userList.length === 0 && !usersLoading && (
                      <tr>
                        <td colSpan={11} style={{ textAlign: 'center', opacity: 0.6 }}>
                          {search || sourceFilter || statusFilter
                            ? 'No user matches these filters.'
                            : 'No users yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          </>
        )}

      </div>
    </section>
  );
}
