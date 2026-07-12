/**
 * Optimized Cloudinary image URL builder.
 * Appends auto-format, auto-quality, and width transformations
 * to reduce payload size by 40-70% on average.
 */
export function optimizedImageUrl(url, width = 900) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  // Prevent double-transformation
  if (url.includes('/f_auto') || url.includes('/q_auto')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${Math.max(160, Math.round(width))}/`);
}
