import React from 'react';
import {
  CheckCircle2,
  LockKeyhole,
  X,
} from 'lucide-react';
import { apiBaseUrl } from '../../lib/site.js';
import { dashPlanLabels, dashProviderLabels } from './lib/format.js';

export function AdminPaymentsPage() {
  const [token, setToken] = React.useState(() => window.localStorage.getItem('quickalAdminToken') || '');
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  async function loadRequests() {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      window.localStorage.setItem('quickalAdminToken', token);
      const response = await fetch(`${apiBaseUrl}/api/subscription/direct-payment-requests/admin?status=pending`, {
        headers: { 'x-quickal-admin-token': token },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Pending payments failed to load.');
      setRequests(payload.requests || []);
      setMessage(`Loaded ${(payload.requests || []).length} pending payment request(s).`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Pending payments failed to load.');
    } finally {
      setLoading(false);
    }
  }

  async function reviewRequest(id, action) {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/subscription/direct-payment-requests/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-quickal-admin-token': token },
        body: JSON.stringify({ adminNote: action === 'approve' ? 'Payment verified' : 'Payment rejected' }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `Payment ${action} failed.`);
      setRequests((current) => current.filter((r) => r.id !== id));
      setMessage(action === 'approve' ? 'Payment approved and subscription activated.' : 'Payment rejected.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : `Payment ${action} failed.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="legal-page admin-page">
      <div className="legal-header">
        <p className="eyebrow"><LockKeyhole size={18} /> Owner Admin</p>
        <h1>Payment Approvals</h1>
        <p>Review direct website payments submitted from the Quick AL direct APK.</p>
      </div>
      <div className="legal-body admin-body">
        <div className="admin-token-row">
          <label>
            Admin token
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter DIRECT_PAYMENT_ADMIN_TOKEN"
              type="password"
            />
          </label>
          <button className="primary-button" type="button" onClick={loadRequests} disabled={loading || !token.trim()}>
            Load Pending
          </button>
        </div>
        {message && <p className="admin-message">{message}</p>}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-list">
          {requests.map((request) => (
            <article className="admin-request" key={request.id}>
              <div>
                <strong>{request.planId} - Rs {request.amountPkr}</strong>
                <span>{request.paymentMethod} / {request.paymentReference}</span>
                <span>User: {request.userId}</span>
                <span>{new Date(request.createdAt).toLocaleString()}</span>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => reviewRequest(request.id, 'approve')} disabled={loading}>
                  <CheckCircle2 size={18} /> Approve
                </button>
                <button type="button" onClick={() => reviewRequest(request.id, 'reject')} disabled={loading}>
                  <X size={18} /> Reject
                </button>
              </div>
            </article>
          ))}
          {!loading && requests.length === 0 && <p className="empty-admin">No pending payments loaded.</p>}
        </div>
      </div>
    </section>
  );
}


// Rows for the subscriptions table: always show every provider x plan combo
// (zeros included) so the owner sees the full picture, plus any unexpected
// plan ids that show up in the data.
