import { COMPANY } from '@/lib/constants';

export default function robots() {
  return {
    rules: [
      { userAgent:'*', allow:'/', disallow:['/velloreadmin','/api/','/offline'] },
      { userAgent:['Googlebot','Bingbot','GPTBot','OAI-SearchBot','ClaudeBot','PerplexityBot'], allow:'/', disallow:['/velloreadmin','/api/','/offline'] },
    ],
    sitemap: [`${COMPANY.domain}/sitemap.xml`,`${COMPANY.domain}/image-sitemap.xml`,`${COMPANY.domain}/video-sitemap.xml`],
    host: COMPANY.domain,
  };
}
