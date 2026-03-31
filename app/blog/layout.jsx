export async function generateMetadata() {
  return {
    title: 'Sports Blog | Expert Insights | SportyPredict',
    description: 'Expert insights, analysis and thoughts on sports betting, predictions, and industry trends. Stay informed with the latest sports analysis.',
    keywords: 'sports blog, betting insights, sports analysis, expert predictions, sports commentary',
    authors: [{ name: 'SportyPredict' }],
    creator: 'SportyPredict',
    publisher: 'SportyPredict',
    alternates: {
      canonical: 'https://sportypredict.com/blog',
    },
    openGraph: {
      title: 'Sports Blog | Expert Insights | SportyPredict',
      description: 'Expert insights, analysis and thoughts on sports betting, predictions, and industry trends.',
      url: 'https://sportypredict.com/blog',
      siteName: 'SportyPredict',
      images: [
        {
          url: 'https://sportypredict.com/assets/banner.jpg',
          width: 1200,
          height: 630,
          alt: 'SportyPredict Blog',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sports Blog | Expert Insights | SportyPredict',
      description: 'Expert insights, analysis and thoughts on sports betting, predictions, and industry trends.',
      images: ['https://sportypredict.com/assets/banner.jpg'],
      creator: '@sportypredict',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function BlogLayout({ children }) {
  return children;
}