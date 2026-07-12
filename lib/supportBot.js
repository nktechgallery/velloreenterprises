import { COMPANY } from './constants';

const intents = [
  { words: ['hello','hi','hey','start'], reply: `Hello! I’m the Vellore Enterprises safety assistant. I can help with products, AMC service, quotations, delivery, or connect you with our team.` },
  { words: ['price','cost','quote','quotation','discount'], reply: 'Pricing depends on equipment type, capacity, quantity, and installation requirements. Add products to the inquiry cart for a quotation, or tell me what equipment and quantity you need.' },
  { words: ['amc','maintenance','service','refill','inspection'], reply: 'Our AMC plans cover scheduled inspections, refilling coordination, readiness reports, equipment testing, and priority support. You can request a tailored plan from the AMC page.' },
  { words: ['extinguisher','abc','co2','foam','fire cylinder'], reply: 'We supply certified ABC, CO₂, foam, and water-based extinguishers for different fire classes. Share the premises type and approximate area so our team can recommend the right units.' },
  { words: ['alarm','detector','smoke','warning'], reply: 'We provide smoke detectors and fire-alarm systems for offices, factories, institutions, and residential facilities, including installation and testing support.' },
  { words: ['delivery','stock','available','availability'], reply: 'Availability varies by model and quantity. Share the product name or code and required quantity; an administrator can confirm current stock and delivery timing.' },
  { words: ['emergency','urgent','fire'], reply: `For an active emergency, call local emergency services immediately. For urgent equipment support, call ${COMPANY.phoneDisplay}.` },
  { words: ['human','agent','admin','person','representative'], reply: 'I’ve marked this conversation for our support team. An administrator can join this chat when available. You may continue adding details here.' },
  { words: ['location','address','where'], reply: `${COMPANY.name} is located at ${COMPANY.addressLine}, ${COMPANY.cityLine}.` },
  { words: ['hours','open','timing'], reply: `Our regular business hours are ${COMPANY.hours}.` },
];

export function supportBotReply(message) {
  const normalized = String(message || '').toLowerCase();
  const match = intents.find((intent) => intent.words.some((word) => normalized.includes(word)));
  return match?.reply || 'Thanks for the details. I can help you find equipment, request an AMC, prepare a quotation, or connect you with an administrator. Please mention the product, site type, and quantity you need.';
}

export function wantsHuman(message) {
  return /human|agent|admin|person|representative|call me|contact me/i.test(String(message || ''));
}
