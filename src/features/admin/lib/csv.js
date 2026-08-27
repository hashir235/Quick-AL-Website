import {
  Phone,
} from 'lucide-react';
import { dashSourceLabels } from './format.js';

export function dashUsersToCsv(users) {
  // City and address are different things — the city picks the rate list, the
  // address is where the workshop is — so the export carries both.
  const header = [
    'Name', 'Email', 'Workshop', 'Phone', 'City', 'Address',
    'Source', 'App version', 'Plan', 'Joined', 'Last seen',
  ];
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const lines = users.map((u) =>
    [
      u.fullName || u.contractorName || '',
      u.email || '',
      u.workshopName || '',
      u.workshopPhone || '',
      u.city || '',
      u.workshopAddress || '',
      dashSourceLabels[u.installSource] || u.installSource,
      u.appVersion || '',
      `${u.subscriptionStatus}${u.plan ? ` (${u.plan})` : ''}`,
      u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : '',
      u.lastSeenAt ? new Date(u.lastSeenAt).toISOString().slice(0, 10) : '',
    ].map(escape).join(','),
  );
  return [header.map(escape).join(','), ...lines].join('\n');
}

export function dashDownloadCsv(users) {
  const blob = new Blob([dashUsersToCsv(users)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `quickal-users-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/// The three kinds of project, side by side.
///
/// Shown as three small figures rather than one total: a shop doing forty
/// estimations and no fabrication works differently from one doing the
/// reverse, and a single number hides exactly that.
