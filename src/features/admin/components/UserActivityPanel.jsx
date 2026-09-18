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

/// The plans the owner can put somebody on, from the price list the website
/// sells, so the panel can never offer one that does not exist. Falls back to
/// the three it has always had if an older backend does not answer.
function usePanelPlans(apiBaseUrl, token) {
  const [plans, setPlans] = React.useState(PLAN_FALLBACK);
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
  return plans;
}

/// Putting one shop on a plan, or stopping the one they are on.
///
/// There is no request to approve and no payment to check: the terms were
/// settled between the owner and the shop, and this is where that decision is
/// recorded. A plan runs from today, so "6 months" means six months from now
/// and not from the end of whatever they already had -- what that replaces is
/// printed above the buttons rather than left to be discovered.
///
/// A payment is recorded in the box below this one, which starts the plan as
/// well; these buttons are for a plan given without one.
function PlanControl({ user, plans, apiBaseUrl, token, onChanged }) {
  const [expiresAt, setExpiresAt] = React.useState(user.subscriptionExpiresAt || null);
  const [status, setStatus] = React.useState(user.subscriptionStatus || '');
  const [busy, setBusy] = React.useState('');
  const [error, setError] = React.useState('');
  const [saved, setSaved] = React.useState('');

  React.useEffect(() => {
    setExpiresAt(user.subscriptionExpiresAt || null);
    setStatus(user.subscriptionStatus || '');
  }, [user.id, user.subscriptionExpiresAt, user.subscriptionStatus]);

  // Only a different shop clears what was said. The row refreshing after a
  // change is that change landing, and wiping "Plan stopped" the moment it
  // happens left the owner wondering whether it had.
  React.useEffect(() => {
    setError('');
    setSaved('');
  }, [user.id]);

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
      if (body.stop) {
        setExpiresAt(payload.stopped > 0 ? new Date().toISOString() : expiresAt);
        setStatus(payload.stopped > 0 ? 'Expired' : status);
        setSaved(
          payload.stopped > 0
            ? `Plan stopped today.${payload.switchedOff ? ' The app has switched off for them.' : ''}`
            : 'There was no running plan to stop.',
        );
      } else {
        setExpiresAt(payload.expiresAt);
        setStatus('Subscribed');
        setSaved(
          `On ${payload.plan.title} until ${planDate(payload.expiresAt)}.` +
            (payload.switchedOn ? ' The app is switched back on for them.' : ''),
        );
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

  function stop() {
    const confirmed = window.confirm(
      `Stop ${user.fullName || user.email}'s plan today?\n\n` +
        'Every plan they have from the website ends now — given or paid — and ' +
        'the app switches off for them straight away, with a message to renew.',
    );
    if (confirmed) send({ stop: true }, 'stop');
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
                ? `Ended on ${until}.`
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
            onClick={stop}
          >
            {busy === 'stop' ? 'Stopping…' : 'Stop plan'}
          </button>
        )}
      </div>

      <p className="ua-plan-hint">
        These start a plan without a payment — to record what they paid, use
        Payment &amp; receipt below, which starts the plan too. A plan starts
        today and replaces one that is running. Starting a plan switches the
        app back on; stopping one switches it off, as any plan that ends does.
      </p>
      {error && <p className="ua-note ua-note-error">{error}</p>}
      {saved && <p className="ua-note ua-note-ok">{saved}</p>}
    </div>
  );
}

const PAYMENT_METHODS = [
  { id: 'bank_transfer', label: 'Bank transfer' },
  { id: 'jazzcash', label: 'JazzCash' },
  { id: 'easypaisa', label: 'Easypaisa' },
  { id: 'cash', label: 'Cash' },
];

/// Today in Pakistan, as the date input wants it: "2026-09-18".
function pakistanToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function formatPkr(amount) {
  return `PKR ${Math.round(Number(amount) || 0).toLocaleString('en-US')}`;
}

/// "2026-09-18" as "18 Sep 2026", without the day moving with the time zone.
function calendarDate(day) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day || ''));
  if (!match) return '';
  return new Date(Date.UTC(+match[1], +match[2] - 1, +match[3])).toLocaleDateString(
    undefined,
    { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' },
  );
}

function sentAt(value) {
  if (!value) return '';
  const at = new Date(value);
  if (Number.isNaN(at.getTime())) return '';
  return at.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function addMonths(date, months) {
  const copy = new Date(date.getTime());
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

/// Recording what a shop paid, and the receipt they get for it.
///
/// One step: the plan they paid for starts, the app switches back on, and a
/// numbered receipt is written. Sending it is a second, separate press, so the
/// receipt can be opened and checked before it reaches anyone -- and a receipt
/// with a mistake in it can still be deleted until it has been sent.
function PaymentReceipts({ user, plans, apiBaseUrl, token, onChanged }) {
  const [receipts, setReceipts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [listError, setListError] = React.useState('');
  const [planId, setPlanId] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [method, setMethod] = React.useState('bank_transfer');
  const [reference, setReference] = React.useState('');
  const [paidOn, setPaidOn] = React.useState(pakistanToday());
  const [start, setStart] = React.useState('after_current');
  const [busy, setBusy] = React.useState('');
  const [error, setError] = React.useState('');
  const [saved, setSaved] = React.useState('');

  // Another row was opened: start from that shop, not the last one's form.
  React.useEffect(() => {
    setPlanId('');
    setAmount('');
    setMethod('bank_transfer');
    setReference('');
    setPaidOn(pakistanToday());
    setStart('after_current');
    setError('');
    setSaved('');
  }, [user.id]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setListError('');
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/admin/panel/receipts?userId=${encodeURIComponent(user.id)}`,
          { headers: { 'x-quickal-panel-token': token } },
        );
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Could not load receipts.');
        if (!cancelled) setReceipts(payload.receipts || []);
      } catch (caught) {
        if (!cancelled) {
          setListError(caught instanceof Error ? caught.message : 'Could not load receipts.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user.id, apiBaseUrl, token]);

  const plan = plans.find((candidate) => candidate.id === planId) || null;
  const amountValue = Number(String(amount).replace(/[^\d]/g, '')) || 0;
  const liveUntil =
    user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt).getTime() > Date.now()
      ? new Date(user.subscriptionExpiresAt)
      : null;
  const followsCurrent = Boolean(liveUntil) && start === 'after_current';
  const periodStart = followsCurrent ? liveUntil : new Date();
  const periodEnd = plan ? addMonths(periodStart, Number(plan.durationMonths) || 0) : null;
  const canCreate = Boolean(plan) && amountValue > 0 && Boolean(paidOn) && !busy;
  const total = receipts.reduce((sum, receipt) => sum + (receipt.amountPkr || 0), 0);

  async function create(event) {
    event.preventDefault();
    if (!canCreate) return;
    setBusy('create');
    setError('');
    setSaved('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/receipts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-quickal-panel-token': token,
        },
        body: JSON.stringify({
          userId: user.id,
          planId,
          amountPkr: amountValue,
          paymentMethod: method,
          paymentReference: reference.trim(),
          paidOn,
          start: liveUntil ? start : 'today',
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not record this payment.');
      const receipt = payload.receipt;
      setReceipts((current) => [receipt, ...current]);
      setAmount('');
      setReference('');
      setPlanId('');
      setSaved(
        `Receipt ${receipt.receiptNo} made — ${receipt.planTitle} until ` +
          `${planDate(receipt.periodEndsAt)}.` +
          (payload.switchedOn ? ' The app is switched back on for them.' : '') +
          ' Check it, then press Send receipt.',
      );
      if (onChanged) onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not record this payment.');
    } finally {
      setBusy('');
    }
  }

  async function openPdf(receipt) {
    // Opened now, while the click still counts as the owner's, so the browser
    // does not treat it as a pop-up; the PDF is put into it once it arrives.
    const tab = window.open('', '_blank');
    setBusy(`pdf:${receipt.id}`);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/receipts/${receipt.id}/pdf`, {
        headers: { 'x-quickal-panel-token': token },
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Could not open the receipt.');
      }
      const url = URL.createObjectURL(await response.blob());
      if (tab) {
        tab.location.href = url;
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = `Quick-AL-Receipt-${receipt.receiptNo}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
    } catch (caught) {
      if (tab) tab.close();
      setError(caught instanceof Error ? caught.message : 'Could not open the receipt.');
    } finally {
      setBusy('');
    }
  }

  async function send(receipt) {
    const again = receipt.emailCount > 0;
    const confirmed = window.confirm(
      `${again ? 'Send receipt again' : 'Email receipt'} ${receipt.receiptNo} to ${user.email}?\n\n` +
        `${receipt.planTitle} · ${formatPkr(receipt.amountPkr)} · the PDF goes with it.`,
    );
    if (!confirmed) return;
    setBusy(`send:${receipt.id}`);
    setError('');
    setSaved('');
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/panel/receipts/${receipt.id}/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-quickal-panel-token': token,
          },
          body: '{}',
        },
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not send the receipt.');
      setReceipts((current) =>
        current.map((item) => (item.id === receipt.id ? payload.receipt : item)),
      );
      setSaved(`Receipt ${receipt.receiptNo} emailed to ${payload.sentTo}.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not send the receipt.');
    } finally {
      setBusy('');
    }
  }

  async function remove(receipt) {
    const confirmed = window.confirm(
      `Delete receipt ${receipt.receiptNo}?\n\nIt has not been sent, so nobody has it yet. ` +
        'The plan it started stays as it is — use Stop plan above if that should end too.',
    );
    if (!confirmed) return;
    setBusy(`delete:${receipt.id}`);
    setError('');
    setSaved('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/panel/receipts/${receipt.id}`, {
        method: 'DELETE',
        headers: { 'x-quickal-panel-token': token },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not delete the receipt.');
      setReceipts((current) => current.filter((item) => item.id !== receipt.id));
      setSaved(`Receipt ${receipt.receiptNo} deleted.`);
      if (onChanged) onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete the receipt.');
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="ua-pay">
      <div className="ua-pay-head">
        <div>
          <h4>Payment &amp; receipt</h4>
          <p className="ua-plan-state">
            {receipts.length > 0
              ? `${receipts.length} payment${receipts.length === 1 ? '' : 's'} recorded · ${formatPkr(total)} in total.`
              : 'Nothing recorded yet. When they pay you, write it here.'}
          </p>
        </div>
      </div>

      <form className="ua-pay-form" onSubmit={create}>
        <div className="ua-pay-field ua-pay-plans">
          <span className="ua-pay-label">Plan they paid for</span>
          <div className="ua-pay-choice" role="radiogroup" aria-label="Plan they paid for">
            {plans.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                role="radio"
                aria-checked={planId === candidate.id}
                className={planId === candidate.id ? 'ua-pay-option is-on' : 'ua-pay-option'}
                disabled={Boolean(busy)}
                onClick={() => setPlanId(candidate.id)}
              >
                {candidate.title}
              </button>
            ))}
          </div>
        </div>

        <label className="ua-pay-field">
          <span className="ua-pay-label">Amount paid (PKR)</span>
          <input
            className="ua-pay-input ua-pay-amount"
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 15000"
            value={amount}
            disabled={Boolean(busy)}
            onChange={(event) => setAmount(event.target.value.replace(/[^\d,]/g, '').slice(0, 11))}
          />
          <span className="ua-pay-sub">
            {amountValue > 0 ? formatPkr(amountValue) : ' '}
            {plan && plan.pricePkr ? ` · website price ${formatPkr(plan.pricePkr)}` : ''}
          </span>
        </label>

        <label className="ua-pay-field">
          <span className="ua-pay-label">Paid by</span>
          <select
            className="ua-pay-input"
            value={method}
            disabled={Boolean(busy)}
            onChange={(event) => setMethod(event.target.value)}
          >
            {PAYMENT_METHODS.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="ua-pay-field">
          <span className="ua-pay-label">Paid on</span>
          <input
            className="ua-pay-input"
            type="date"
            max={pakistanToday()}
            value={paidOn}
            disabled={Boolean(busy)}
            onChange={(event) => setPaidOn(event.target.value)}
          />
        </label>

        <label className="ua-pay-field ua-pay-wide">
          <span className="ua-pay-label">Transaction ID / reference (optional)</span>
          <input
            className="ua-pay-input"
            maxLength={80}
            autoComplete="off"
            placeholder="From the bank or wallet message"
            value={reference}
            disabled={Boolean(busy)}
            onChange={(event) => setReference(event.target.value)}
          />
        </label>

        {liveUntil && (
          <div className="ua-pay-field ua-pay-wide">
            <span className="ua-pay-label">
              They are already on a plan until {planDate(liveUntil)}
            </span>
            <div className="ua-pay-choice">
              <button
                type="button"
                className={start === 'after_current' ? 'ua-pay-option is-on' : 'ua-pay-option'}
                disabled={Boolean(busy)}
                onClick={() => setStart('after_current')}
              >
                Add after it ends
              </button>
              <button
                type="button"
                className={start === 'today' ? 'ua-pay-option is-on' : 'ua-pay-option'}
                disabled={Boolean(busy)}
                onClick={() => setStart('today')}
              >
                Start today, replacing it
              </button>
            </div>
          </div>
        )}

        <div className="ua-pay-foot ua-pay-wide">
          <span className="ua-pay-summary">
            {plan
              ? `${plan.title}: ${planDate(periodStart)} – ${planDate(periodEnd)}`
              : 'Choose the plan, then write the amount.'}
          </span>
          <button type="submit" className="ua-pay-make" disabled={!canCreate}>
            {busy === 'create' ? 'Making…' : 'Make receipt'}
          </button>
        </div>
      </form>

      {error && <p className="ua-note ua-note-error">{error}</p>}
      {saved && <p className="ua-note ua-note-ok">{saved}</p>}

      {loading && <p className="ua-note">Loading receipts&hellip;</p>}
      {listError && <p className="ua-note ua-note-error">{listError}</p>}
      {!loading && receipts.length > 0 && (
        <ul className="ua-receipts">
          {receipts.map((receipt) => (
            <li key={receipt.id} className="ua-receipt">
              <div className="ua-receipt-main">
                <strong className="ua-receipt-no">{receipt.receiptNo}</strong>
                <span className="ua-receipt-amount">{formatPkr(receipt.amountPkr)}</span>
                <span className="ua-receipt-meta">
                  {receipt.planTitle} · paid {calendarDate(receipt.paidOn)} ·{' '}
                  {receipt.paymentMethodLabel}
                  {receipt.paymentReference ? ` · ${receipt.paymentReference}` : ''}
                </span>
                <span className={receipt.emailCount > 0 ? 'ua-receipt-sent' : 'ua-receipt-unsent'}>
                  {receipt.emailCount > 0
                    ? `Sent to ${receipt.emailedTo} · ${sentAt(receipt.emailedAt)}` +
                      (receipt.emailCount > 1 ? ` · ${receipt.emailCount} times` : '')
                    : 'Not sent yet'}
                </span>
              </div>
              <div className="ua-receipt-actions">
                <button
                  type="button"
                  className="ua-plan-btn"
                  disabled={Boolean(busy)}
                  onClick={() => openPdf(receipt)}
                >
                  {busy === `pdf:${receipt.id}` ? 'Opening…' : 'View PDF'}
                </button>
                <button
                  type="button"
                  className="ua-plan-btn is-send"
                  disabled={Boolean(busy)}
                  onClick={() => send(receipt)}
                >
                  {busy === `send:${receipt.id}`
                    ? 'Sending…'
                    : receipt.emailCount > 0
                      ? 'Send again'
                      : 'Send receipt'}
                </button>
                {receipt.emailCount === 0 && (
                  <button
                    type="button"
                    className="ua-plan-btn is-remove"
                    disabled={Boolean(busy)}
                    onClick={() => remove(receipt)}
                  >
                    {busy === `delete:${receipt.id}` ? 'Deleting…' : 'Delete'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
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
  }, [user.id, user.blocked, user.blockMessage]);

  // As in the plan box: a refresh of this same shop keeps the confirmation.
  React.useEffect(() => {
    setError('');
    setSaved('');
  }, [user.id]);

  const trimmed = message.trim();
  const canSwitchOff = trimmed.length > 0;
  // Switched off by the server because a paid plan ran out, rather than by
  // hand. Worth saying: the fix is a payment, not a conversation.
  const planEnded = blocked && user.blocked && user.blockReason === 'plan_ended';

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
            {planEnded
              ? 'Switched off automatically — their plan ended. Recording a payment switches them back on.'
              : blocked
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
  const plans = usePanelPlans(apiBaseUrl, token);
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
        plans={plans}
        apiBaseUrl={apiBaseUrl}
        token={token}
        onChanged={onUserChanged}
      />
      <PaymentReceipts
        user={user}
        plans={plans}
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
