export async function generateMetadata({ params }) {
  const { date, filters, sport } = await params;
  
  const sportName = sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : 'Sport';
  const sportLower = sport ? sport.toLowerCase() : 'sport';
  
  const filter1 = filters && filters[0] ? decodeURIComponent(filters[0]) : null;
  const filter2 = filters && filters[1] ? decodeURIComponent(filters[1]) : null;
  
  const matchDate = date ? new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  }) : 'Today';
  
  let title = `${sportName} Betting Tips & Predictions - ${matchDate}`;
  let description = `Get the best ${sportLower} betting tips and predictions for ${matchDate}. Expert analysis and free daily tips.`;
  let url = `https://sportypredict.com/${sportLower}/${date}`;
  
  if (filter1 && filter2) {
    title = `${sportName} Betting Tips - ${filter1} ${filter2} - ${matchDate}`;
    description = `${sportName} betting predictions for ${filter1} in ${filter2} on ${matchDate}. Expert tips and analysis.`;
    url = `https://sportypredict.com/${sportLower}/${date}/${encodeURIComponent(filter1)}/${encodeURIComponent(filter2)}`;
  } else if (filter1) {
    title = `${sportName} Betting Tips - ${filter1} - ${matchDate}`;
    description = `${sportName} betting predictions for ${filter1} on ${matchDate}. Expert analysis and free tips.`;
    url = `https://sportypredict.com/${sportLower}/${date}/${encodeURIComponent(filter1)}`;
  }
  
  const generateKeywords = (sport, filter1, filter2) => {
    const baseKeywords = [
      `${sport} betting tips`,
      `${sport} predictions`,
      `${sport} betting`,
      "sports betting tips"
    ];
    
    if (filter1) baseKeywords.push(`${filter1} predictions`);
    if (filter2) baseKeywords.push(`${filter2} ${sport}`);
    
    const sportSpecificKeywords = {
      football: ["soccer predictions", "football tips", "match result", "over under goals"],
      basketball: ["NBA predictions", "basketball tips", "point spread", "over under points"],
      tennis: ["ATP predictions", "WTA tips", "tennis betting", "match winner"],
      'bet-of-the-day': ["daily tip", "sure bet", "best bet today", "expert tip"]
    };
    
    if (sportSpecificKeywords[sport]) {
      baseKeywords.push(...sportSpecificKeywords[sport]);
    }
    
    return baseKeywords.filter(Boolean);
  };
  
  return {
    title: `${title} | SportyPredict`,
    description,
    keywords: generateKeywords(sportLower, filter1, filter2),
    
    openGraph: {
      title,
      description,
      url,
      siteName: 'SportyPredict',
      images: [{
        url: "https://sportypredict.com/assets/banner.png",
        width: 1200,
        height: 630,
        alt: `${sportName} Betting Tips - SportyPredict`,
      }]
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    
    alternates: {
      canonical: url,
    }
  };
}

export default async function Layout({ children, params }) {
  const { date, filters, sport } = await params;
  
  const sportName = sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : 'Sport';
  const sportLower = sport ? sport.toLowerCase() : 'sport';
  const filter1 = filters && filters[0] ? decodeURIComponent(filters[0]) : null;
  const filter2 = filters && filters[1] ? decodeURIComponent(filters[1]) : null;
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SportyPredict",
    url: "https://sportypredict.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://sportypredict.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://sportypredict.com"
    },
    {
      "@type": "ListItem",
      position: 2,
      name: `${sportName} Tips`,
      item: `https://sportypredict.com/${sportLower}/${date}`
    }
  ];
  
  if (filter1) {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 3,
      name: filter1,
      item: `https://sportypredict.com/${sportLower}/${date}/${encodeURIComponent(filter1)}`
    });
  }
  
  if (filter2) {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 4,
      name: filter2,
      item: `https://sportypredict.com/${sportLower}/${date}/${encodeURIComponent(filter1)}/${encodeURIComponent(filter2)}`
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs
  };

  const sportsEventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${sportName} Betting Predictions${filter1 ? ` - ${filter1}` : ''}${filter2 ? ` ${filter2}` : ''}`,
    description: `Daily ${sportLower} betting tips and predictions for ${date}${filter1 ? ` featuring ${filter1}` : ''}${filter2 ? ` in ${filter2}` : ''}`,
    sport: sportName,
    startDate: new Date(date).toISOString(),
    location: {
      "@type": "VirtualLocation",
      url: `https://sportypredict.com/${sportLower}/${date}${filter1 ? `/${encodeURIComponent(filter1)}` : ''}${filter2 ? `/${encodeURIComponent(filter2)}` : ''}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, breadcrumbSchema, sportsEventSchema])
        }}  
      />
      {children}
    </>
  );
}