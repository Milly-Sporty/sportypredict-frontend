import { createMatchSlug } from '@/app/utility/UrlSlug';

function getCurrentLocalDate() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(now);
}

function getDateString(date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}

function getLocalDate(dateInput) {
  if (!dateInput) return new Date();
  return new Date(dateInput);
}

async function getMatchUrls() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_API_URL || 'https://sportypredict.com');
    
    const timestamp = Date.now();
    const apiUrl = `${baseUrl}/api/predictions/sitemap?t=${timestamp}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Sitemap-Generator',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const predictions = data.predictions || [];
    
    if (predictions.length === 0) {
      return [];
    }
    
    const matchUrls = predictions.map(prediction => {
      const teamA = prediction.teamA || prediction.homeTeam || prediction.cleanTeamA;
      const teamB = prediction.teamB || prediction.awayTeam || prediction.cleanTeamB;
      
      const slug = prediction.slug || createMatchSlug(teamA, teamB);
      
      const getSportPath = (sport, category) => {
        if (category === 'bet-of-the-day') return 'bet-of-the-day';
        if (category === 'vip') return 'vip';
        
        const sportMap = {
          'football': 'football',
          'basketball': 'basketball', 
          'tennis': 'tennis',
          'soccer': 'football'
        };
        
        return sportMap[sport?.toLowerCase()] || sportMap[category?.toLowerCase()] || 'football';
      };
      
      const sportPath = getSportPath(prediction.sport, prediction.category);
      
      const url = `https://sportypredict.com/${sportPath}/${prediction.date}/prediction/${slug}`;
      
      let lastModified;
      if (prediction.time) {
        lastModified = getLocalDate(prediction.time);
      } else if (prediction.date) {
        lastModified = getLocalDate(prediction.date);
      } else {
        lastModified = getLocalDate(prediction.updatedAt || prediction.createdAt || new Date());
      }
      
      const today = new Date();
      if (lastModified < today && prediction.date && getLocalDate(prediction.date) >= today) {
        lastModified = today;
      }
      
      return {
        url,
        lastModified,
        changeFrequency: 'daily',
        priority: 0.7,
      };
    });
    
    return matchUrls;
    
  } catch (error) {
    return [];
  }
}

async function getNewsUrls() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_API_URL || 'https://sportypredict.com');
    
    const timestamp = Date.now();
    const apiUrl = `${baseUrl}/api/news/sitemap?t=${timestamp}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Sitemap-Generator',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const articles = data.articles || [];
    
    const newsUrls = articles.map(article => {
      const slug = article.slug || article.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        url: `https://sportypredict.com/news?article=${slug}`,
        lastModified: getLocalDate(article.updatedAt || article.publishDate || article.createdAt),
        changeFrequency: 'daily',
        priority: article.featured ? 0.8 : 0.7,
      };
    });
    
    return newsUrls;
    
  } catch (error) {
    return [];
  }
}

async function getBlogUrls() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_API_URL || 'https://sportypredict.com');
    
    const timestamp = Date.now();
    const apiUrl = `${baseUrl}/api/blog/sitemap?t=${timestamp}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Sitemap-Generator',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const blogs = data.blogs || [];
    
    if (blogs.length === 0) {
      return [];
    }
    
    const blogUrls = blogs.map(blog => {
      const slug = blog.slug || blog.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        url: `https://sportypredict.com/blog?blog=${slug}`,
        lastModified: getLocalDate(blog.updatedAt || blog.publishedAt || blog.createdAt),
        changeFrequency: blog.featured ? 'weekly' : 'monthly',
        priority: blog.featured ? 0.8 : 0.6,
      };
    });
    
    return blogUrls;
    
  } catch (error) {
    return [];
  }
}

async function getCategoryUrls() {
  try {
    const categoryUrls = [];
    
    const newsCategories = ['football', 'basketball', 'tennis'];
    newsCategories.forEach(category => {
      categoryUrls.push({
        url: `https://sportypredict.com/news?category=${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
    });
    
    const blogCategories = ['Sports', 'Betting', 'Analysis', 'Tips'];
    blogCategories.forEach(category => {
      categoryUrls.push({
        url: `https://sportypredict.com/blog?category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
    
    return categoryUrls;
    
  } catch (error) {
    return [];
  }
}

async function getSportDateUrls() {
  try {
    const sportDateUrls = [];
    const sports = ['football', 'basketball', 'tennis', 'bet-of-the-day'];
    const currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      const dateStr = getDateString(date);
      
      sports.forEach(sport => {
        sportDateUrls.push({
          url: `https://sportypredict.com/${sport}/${dateStr}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });
    }
    
    return sportDateUrls;
    
  } catch (error) {
    return [];
  }
}

export default async function sitemap() {
  const baseUrl = "https://sportypredict.com";
  const currentDate = new Date();

  const mainRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const sportRoutes = [];

  const contentRoutes = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const vipRoutes = [
    {
      url: `${baseUrl}/vip`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  const staticRoutes = [
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const [matchUrls, blogUrls, newsUrls, categoryUrls, sportDateUrls] = await Promise.allSettled([
    getMatchUrls(),
    getBlogUrls(), 
    getNewsUrls(),
    getCategoryUrls(),
    getSportDateUrls()
  ]);

  const matchUrlsResult = matchUrls.status === 'fulfilled' ? matchUrls.value : [];
  const blogUrlsResult = blogUrls.status === 'fulfilled' ? blogUrls.value : [];
  const newsUrlsResult = newsUrls.status === 'fulfilled' ? newsUrls.value : [];
  const categoryUrlsResult = categoryUrls.status === 'fulfilled' ? categoryUrls.value : [];
  const sportDateUrlsResult = sportDateUrls.status === 'fulfilled' ? sportDateUrls.value : [];

  const allRoutes = [
    ...mainRoutes,
    ...sportRoutes,
    ...contentRoutes,
    ...vipRoutes,
    ...staticRoutes,
    ...categoryUrlsResult,
    ...sportDateUrlsResult,
    ...matchUrlsResult,
    ...blogUrlsResult,
    ...newsUrlsResult,
  ];

  const uniqueRoutes = [];
  const seenUrls = new Set();
  
  for (const route of allRoutes) {
    if (!seenUrls.has(route.url)) {
      seenUrls.add(route.url);
      uniqueRoutes.push(route);
    }
  }

  return uniqueRoutes;
}