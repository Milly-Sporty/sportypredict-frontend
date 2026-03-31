const API_URL = process.env.NEXT_PUBLIC_SERVER_API;

function createSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getBlogData(slug) {
  try {
    if (!API_URL) return null;

    const response = await fetch(`${API_URL}/blog`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) return null;

    const data = await response.json();
    const blogs = data.blogs || [];
    const blog = blogs.find(b => createSlug(b.title) === slug);

    return blog || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  const fallbackTitle = slug
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Blog Post';

  if (!blog) {
    return {
      title: `${fallbackTitle} | SportyPredict Blog`,
      description: "Expert sports betting tips, analysis and insights from SportyPredict.",
    };
  }

  const canonicalUrl = `https://sportypredict.com/blog/${slug}`;
  const author = blog.author || "SportyPredict";
  const publishedDate = blog.publishedAt || blog.createdAt;
  const modifiedDate = blog.updatedAt || publishedDate;

  return {
    title: `${blog.title} | SportyPredict Blog`,
    description: blog.excerpt || blog.description || `Read ${blog.title} on SportyPredict`,
    keywords: blog.tags ? blog.tags.join(", ") : `${blog.category}, sports betting, predictions`,
    authors: [{ name: author }],
    creator: author,
    publisher: "SportyPredict",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.description,
      url: canonicalUrl,
      siteName: "SportyPredict",
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: [author],
      section: blog.category,
      tags: blog.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || blog.description,
      images: [blog.image],
      creator: "@SportyPredict",
    },
    robots: blog.isIndexed !== false
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        },
  };
}

export default async function BlogPostLayout({ children, params }) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  const blogPostingSchema = blog ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://sportypredict.com/blog/${slug}`,
    url: `https://sportypredict.com/blog/${slug}`,
    headline: blog.title,
    description: blog.excerpt || blog.description || `Read ${blog.title} on SportyPredict`,
    image: {
      "@type": "ImageObject",
      url: blog.image,
      width: 1200,
      height: 630,
    },
    author: {
      "@type": blog.author ? "Person" : "Organization",
      name: blog.author || "SportyPredict",
    },
    publisher: {
      "@type": "Organization",
      name: "SportyPredict",
      logo: {
        "@type": "ImageObject",
        url: "https://sportypredict.com/assets/logo.png",
      },
    },
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sportypredict.com/blog/${slug}`,
    },
    articleSection: blog.category,
    keywords: blog.tags ? blog.tags.join(", ") : "",
    isAccessibleForFree: true,
    ...(blog.readTime && { timeRequired: `PT${blog.readTime.replace(/\D/g, '')}M` }),
  } : null;

  const breadcrumbSchema = blog ? {
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
        name: "Blog",
        item: "https://sportypredict.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.category,
        item: `https://sportypredict.com/blog?category=${blog.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: blog.title,
        item: `https://sportypredict.com/blog/${slug}`,
      },
    ],
  } : null;

  return (
    <>
      {blogPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
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
