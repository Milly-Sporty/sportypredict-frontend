export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Allow important pages
Allow: /football
Allow: /basketball
Allow: /tennis
Allow: /day
Allow: /blog
Allow: /news
Allow: /about
Allow: /contact

# Disallow admin and private areas
Disallow: /admin
Disallow: /api
Disallow: /vip
Disallow: /_next
Disallow: /static

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