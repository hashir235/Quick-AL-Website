import { App } from '../App.jsx';


// Screenshot galleries, one folder per app area (mirrors "App ss" source
// folders). import.meta.glob keeps this maintenance-free: drop new images in
// a folder and they appear on the site after a rebuild.
export function sortedShots(globResult) {
  return Object.entries(globResult)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, src]) => src);
}
export const estimationShots = sortedShots(
  import.meta.glob('./assets/screenshots/estimation/*.jpg', { eager: true, import: 'default' }),
);
export const fabricationShots = sortedShots(
  import.meta.glob('./assets/screenshots/fabrication/*.jpg', { eager: true, import: 'default' }),
);
export const glassShots = sortedShots(
  import.meta.glob('./assets/screenshots/glass/*.jpg', { eager: true, import: 'default' }),
);
export const settingsShots = sortedShots(
  import.meta.glob('./assets/screenshots/settings/*.jpg', { eager: true, import: 'default' }),
);
