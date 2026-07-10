export const COMPANY = {
  name: 'Vellore Enterprises',
  tagline: 'Advanced fire protection for modern facilities',
  phoneDisplay: '+91 80722 64972',
  phoneHref: '+918072264972',
  phoneRaw: '918072264972',
  secondaryPhoneDisplay: '+91 90874 05584',
  secondaryPhoneHref: '+919087405584',
  email: 'velloreenterprises7@gmail.com',
  domain: 'https://www.velloreenterprises.in',
  addressLine: '164, Vellore Road, Kangeyanallur',
  cityLine: 'Vellore, Tamil Nadu 632006',
  instagram: 'https://www.instagram.com/vellore_enterprises',
  hours: 'Mon - Sat, 9:00 AM - 6:00 PM',
};

export const PRODUCT_CATEGORIES = [
  'Fire Extinguishers',
  'Fire Alarms',
  'Hydrant Systems',
  'Suppression Systems',
  'Fire Stop',
  'Safety Gear',
];

export const CATEGORY_ICONS = {
  'Fire Extinguishers': 'FE',
  'Fire Alarms': 'FA',
  'Hydrant Systems': 'HY',
  'Suppression Systems': 'SP',
  'Fire Stop': 'FS',
  'Safety Gear': 'SG',
};

export const SERVICES = [
  'Fire extinguishers',
  'Fire alarm systems',
  'Hydrant systems',
  'Suppression systems',
  'Fire stop solutions',
  'Annual maintenance',
  'Refilling and pressure testing',
  'Safety audits and training',
];

export const INDUSTRIES = [
  'Factories',
  'Hospitals',
  'Schools',
  'Commercial towers',
  'Warehouses',
  'Hotels',
  'Residential communities',
  'Government facilities',
];

export const ADMIN_EMAILS = ['velloreenterprises7@gmail.com'];

export const buildWhatsAppUrl = (message) =>
  `https://wa.me/${COMPANY.phoneRaw}?text=${encodeURIComponent(message)}`;

export const productSlug = (product) => {
  if (product?.slug) return product.slug;
  const base = product?.name || product?.code || product?.id || 'product';
  return String(base)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
