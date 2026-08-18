import React from 'react';
import {
  Trash2,
} from 'lucide-react';
import { LegalLayout } from '../../components/LegalLayout.jsx';
import { apiDeleteUrl, supportEmail } from '../../lib/site.js';

export function DeleteAccount() {
  return (
    <LegalLayout
      eyebrow="Account"
      title="Delete Account Instructions"
      intro="Quick AL users can request account deletion and removal of associated account data."
    >
      <div className="delete-callout">
        <Trash2 size={26} />
        <div>
          <strong>Delete account request</strong>
          <span>Use the official delete account page or contact support with your registered email.</span>
        </div>
      </div>
      <h2>How to request deletion</h2>
      <ol>
        <li>Open the official delete account page: <a href={apiDeleteUrl}>{apiDeleteUrl}</a>.</li>
        <li>Enter or provide the email or account information used in Quick AL.</li>
        <li>Submit the request and wait for support confirmation.</li>
      </ol>
      <h2>Alternative support request</h2>
      <p>
        You can email <a href={`mailto:${supportEmail}`}>{supportEmail}</a> with the subject
        "Quick AL Delete Account" and include your registered email address.
      </p>
      <h2>What may be deleted</h2>
      <p>
        Account profile information and related app records may be deleted according to the official
        policy and any legal, billing, or security requirements.
      </p>
    </LegalLayout>
  );
}
