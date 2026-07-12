import crypto from 'crypto';

const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple in-memory rate limiter
const requestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    requestCounts.set(ip, { windowStart: now, count: 1 });
    // Clean old entries periodically
    if (requestCounts.size > 1000) {
      for (const [key, val] of requestCounts) {
        if (now - val.windowStart > RATE_LIMIT_WINDOW_MS) requestCounts.delete(key);
      }
    }
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(request) {
  if (!API_SECRET) {
    return Response.json({ error: 'Cloudinary API secret not configured' }, { status: 500 });
  }

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'vellore_products';

  // String to sign: alphabetical order of params
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha256')
    .update(paramsToSign + API_SECRET)
    .digest('hex');

  return Response.json(
    { timestamp, signature, folder, serverTime: new Date(timestamp * 1000).toISOString() },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    }
  );
}
