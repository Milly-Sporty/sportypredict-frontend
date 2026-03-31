export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Allow important content pages
Allow: /football/
Allow: /basketball/
Allow: /tennis/
Allow: /bet-of-the-day/
Allow: /blog/
Allow: /news/
Allow: /about
Allow: /contact
Allow: /offers
Allow: /vip

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/
Disallow: /authentication/
Disallow: /payment/

# Sitemap location
Sitemap: https://sportypredict.com/sitemap.xml

# Crawl delay
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}