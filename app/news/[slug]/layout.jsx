const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.sportypredict.com";

// Helper function to create slug from title
function createSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fetch news article data for metadata generation
async function getNewsData(slug) {
  try {
    // Fetch all news articles to find the one matching the slug
    const response = await fetch(`${API_URL}/api/news`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const articles = data.news || data.articles || [];

    // Find article by matching slug
    const article = articles.find(a => createSlug(a.title) === slug);

    return article || null;
  } catch (error) {
    console.error("Failed to fetch news data for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const article = await getNewsData(slug);

  if (!article) {
    return {
      title: "News Article Not Found | SportyPredict",
      description: "The requested news article could not be found.",
    };
  }

  const canonicalUrl = `https://sportypredict.com/news/${slug}`;
  const author = article.authorName || article.author?.username || "SportyPredict";
  const publishedDate = article.publishDate || article.createdAt;
  const modifiedDate = article.updatedAt || publishedDate;

  return {
    title: `${article.title} | SportyPredict News`,
    description: article.summary || article.description || `Read ${article.title} on SportyPredict`,
    keywords: article.tags ? article.tags.join(", ") : `${article.category}, sports news, latest sports updates`,
    authors: [{ name: author }],
    creator: author,
    publisher: "SportyPredict",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary || article.description,
      url: canonicalUrl,
      siteName: "SportyPredict",
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: [author],
      section: article.category,
      tags: article.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary || article.description,
      images: [article.image],
      creator: "@SportyPredict",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function NewsArticleLayout({ children, params }) {
  const { slug } = params;
  const article = await getNewsData(slug);

  // Generate NewsArticle schema
  const newsArticleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary || article.description,
    image: article.image,
    author: {
      "@type": "Organization",
      name: article.authorName || article.author?.username || "SportyPredict",
    },
    publisher: {
      "@type": "Organization",
      name: "SportyPredict",
      logo: {
        "@type": "ImageObject",
        url: "https://sportypredict.com/assets/logo.png",
      },
    },
    datePublished: article.publishDate || article.createdAt,
    dateModified: article.updatedAt || article.publishDate || article.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sportypredict.com/news/${slug}`,
    },
    articleSection: article.category,
    keywords: article.tags ? article.tags.join(", ") : "",
  } : null;

  // Generate BreadcrumbList schema
  const breadcrumbSchema = article ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sportypredict.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "News",
        item: "https://sportypredict.com/news",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.category.charAt(0).toUpperCase() + article.category.slice(1),
        item: `https://sportypredict.com/news?category=${article.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: `https://sportypredict.com/news/${slug}`,
      },
    ],
  } : null;

  return (
    <>
      {newsArticleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {children}
    </>
  );
}
