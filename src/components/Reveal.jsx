import React from 'react';
import {
  Calculator,
  Layers3,
  PackageCheck,
  ReceiptText,
  Scissors,
  Settings,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { estimationShots, fabricationShots, glassShots, settingsShots } from '../lib/screenshots.js';

export function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const features = [
  {
    icon: Calculator,
    title: 'Window Estimation',
    text: 'Prepare aluminium window estimates with measurements, materials, and cost details in one flow.',
  },
  {
    icon: Scissors,
    title: 'Cutting Reports',
    text: 'Generate fabrication and glass cutting reports that are easier for workshop teams to follow.',
  },
  {
    icon: Layers3,
    title: 'Glass Optimization',
    text: 'Plan glass sheet cutting with optimization support to reduce waste and improve shop efficiency.',
  },
  {
    icon: PackageCheck,
    title: 'Material Reports',
    text: 'Create material lists for aluminium sections, glass, accessories, and project requirements.',
  },
  {
    icon: ReceiptText,
    title: 'Invoices',
    text: 'Make customer invoices and share professional PDF documents from your Android phone.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Access',
    text: 'Accounts, subscriptions, privacy information, and deletion support are clearly handled.',
  },
];

// Keep in step with directWebsiteSubscriptionPlans in the API's config.js --
// this page is only the shop window, the app reads its prices from there.
const plans = [
  {
    name: '3 Months',
    price: 'Rs 1,800',
    note: 'Good for trying Quick AL through direct website access.',
  },
  {
    name: '6 Months',
    price: 'Rs 3,200',
    discount: 'Save Rs 400',
    note: 'Balanced plan for regular estimation and reports.',
    highlighted: true,
  },
  {
    name: '1 Year',
    price: 'Rs 6,000',
    discount: 'Save Rs 1,200',
    note: 'Best value for established aluminium and glass businesses.',
  },
];

const screenshotCategories = [
  {
    id: 'estimation',
    title: 'Estimation',
    blurb:
      'Window selection, size input, optimization, rates, material table, and the final bill.',
    icon: Calculator,
    shots: estimationShots,
  },
  {
    id: 'fabrication',
    title: 'Fabrication',
    blurb:
      'Production-ready windows, cutting workflow, and fabrication reports for the workshop.',
    icon: Wrench,
    shots: fabricationShots,
  },
  {
    id: 'glass',
    title: 'Glass',
    blurb:
      'Glass cutting table and sheet optimization with waste tracking.',
    icon: Layers3,
    shots: glassShots,
  },
  {
    id: 'settings',
    title: 'Settings',
    blurb:
      'Company info, estimation rules, fabrication margins, and payment preferences.',
    icon: Settings,
    shots: settingsShots,
  },
];
