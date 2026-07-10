import crypto from 'crypto';

const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  if (!API_SECRET) {
    return Response.json({ error: 'Cloudinary API secret not configured' }, { status: 500 });
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
