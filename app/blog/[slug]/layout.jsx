const API_URL = process.env.NEXT_PUBLIC_SERVER_API;

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

// Fetch blog data for metadata generation
async function getBlogData(slug) {
  try {
    // Fetch all blogs to find the one matching the slug
    const response = await fetch(`${API_URL}/api/blog/all`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const blogs = data.blogs || [];

    // Find blog by matching slug
    const blog = blogs.find(b => createSlug(b.title) === slug);

    return blog || null;
  } catch (error) {
    console.error("Failed to fetch blog data for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const blog = await getBlogData(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found | SportyPredict",
      description: "The requested blog post could not be found.",
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

export default async function BlogPostLayout({ children, params }) {
  const { slug } = params;
  const blog = await getBlogData(slug);

  // Generate BlogPosting schema
  const blogPostingSchema = blog ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || blog.description,
    image: blog.image,
    author: {
      "@type": "Organization",
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
  } : null;

  // Generate BreadcrumbList schema
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
