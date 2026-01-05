import { NextResponse } from 'next/server';
import sitemap from '../sitemap';

// Force dynamic rendering - never cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const sitemapData = await sitemap();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapData.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified instanceof Date ? item.lastModified.toISOString() : item.lastModified}</lastmod>
    <changefreq>${item.changeFrequency || 'daily'}</changefreq>
    <priority>${item.priority || 0.5}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=0, must-revalidate',
        'CDN-Cache-Control': 'public, s-maxage=0',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=0',
      },
    });
  } catch (error) {
    console.error('[Sitemap Route] Error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
