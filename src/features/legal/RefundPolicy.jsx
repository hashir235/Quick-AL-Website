import React from 'react';
import {
  Send,
} from 'lucide-react';
import { LegalLayout } from '../../components/LegalLayout.jsx';
import { apiRefundUrl, supportEmail } from '../../lib/site.js';

export function RefundPolicy() {
  return (
    <LegalLayout
      eyebrow="Payments"
      title="Refund Policy"
      intro="Clear and simple rules for Quick AL subscription payments."
    >
      <h2>All payments are final</h2>
      <p>
        Quick AL subscription payments are final and non-refundable. When a subscription is
        activated, the service is considered delivered for the paid period.
      </p>
      <h2>The one exception</h2>
      <p>
        If you have paid and the app does not work because of a technical problem on our side,
        you can request a refund review. In this case the refund request will be considered.
      </p>
      <h2>How to request a refund review</h2>
      <ol>
        <li>Email <a href={`mailto:${supportEmail}`}>{supportEmail}</a> from the email address registered to your Quick AL account.</li>
        <li>Use the subject line: <strong>Refund Request</strong>.</li>
        <li>Include your payment reference / transaction ID and a short description of the problem.</li>
        <li>Send the request within 7 days of the payment.</li>
      </ol>
      <p>
        We respond to refund requests within 3 working days. If a refund is approved, it is
        returned to the original payment method.
      </p>
      <h2>Google Play purchases</h2>
      <p>
        Subscriptions bought through Google Play follow Google Play&apos;s own refund process,
        handled by Google.
      </p>
      <h2>Official policy</h2>
      <p>
        The current official policy is available at <a href={apiRefundUrl}>{apiRefundUrl}</a>.
      </p>
    </LegalLayout>
  );
}
