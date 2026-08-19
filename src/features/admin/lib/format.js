import React from 'react';

export function dashSubscriptionRows(byPlan) {
  const rows = [];
  const seen = new Set();
  Object.keys(dashProviderLabels).forEach((provider) => {
    Object.keys(dashPlanLabels).forEach((planId) => {
      const found = (byPlan || []).find(
        (row) => row.provider === provider && row.planId === planId,
      );
      seen.add(`${provider}:${planId}`);
      rows.push({ provider, planId, activeCount: found ? found.activeCount : 0 });
    });
  });
  (byPlan || []).forEach((row) => {
    if (!seen.has(`${row.provider}:${row.planId}`)) {
      rows.push(row);
    }
  });
  return rows;
}

// Where a user's copy of the app came from. "Unknown" is shown honestly rather
// than guessed at: it means that user has not yet opened a build new enough to
// report its own install source.
export const dashNotifTypeLabels = {
  general: '📢 General',
  rate_update: '🏷️ Rate list',
  version_update: '⬆️ App update',
};

export const dashSourceLabels = {
  play_store: 'Play Store',
  website_apk: 'Website APK',
  unknown: 'Not known yet',
};
export const dashSourceColors = {
  play_store: '#3882E4',
  website_apk: '#18B69B',
  unknown: '#9AA7B8',
};

export function dashNumber(value) {
  return Number(value || 0).toLocaleString('en-US');
}

export function dashDate(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString();
}

/// Days since a timestamp, in words. Owners read "3 days ago" far faster than
/// they read a date.
export function dashAgo(value) {
  if (!value) return 'never';
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return 'never';
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? 'a month ago' : `${months} months ago`;
}

/// A small area chart drawn as plain SVG.
///
/// The site carries no charting library and does not need one for this: a
/// single series over a run of days is a path and a fill.
export const dashProviderLabels = {
  google_play: 'Play Store',
  direct_website: 'Website (direct)',
};
export const dashPlanLabels = {
  monthly: 'Monthly - 1 month',
  quarterly: 'Quarterly - 3 months',
  yearly: 'Yearly - 1 year',
};
