export async function generateMetadata({ params }) {
  const { date, sport } = await params;
  
  // Capitalize sport name for display
  const sportName = sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : 'Sport';
  
  const matchDate = date ? new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  }) : 'Today';
  
  // Sport-specific metadata configurations
  const sportConfigs = {
    football: {
      keywords: [
        "football betting tips", "soccer predictions", "football tips",
        "Premier League predictions", "Champions League tips", 
        "Over/Under goals", "Both teams to score", "Match result predictions"
      ],
      description: `Get the best football betting tips and predictions for ${matchDate}. Expert analysis on Premier League, Champions League, and more. Free daily football tips.`
    },
    basketball: {
      keywords: [
        "basketball betting tips", "basketball predictions", "NBA tips",
        "NCAA predictions", "basketball betting", "NBA predictions",
        "Over/Under points", "Point spread", "Moneyline predictions"
      ],
      description: `Get the best basketball betting tips and predictions for ${matchDate}. Expert analysis on NBA, NCAA, and more. Free daily basketball tips.`
    },
    tennis: {
      keywords: [
        "tennis betting tips", "tennis predictions", "ATP tips",
        "WTA predictions", "Grand Slam predictions", "tennis betting",
        "Match winner", "Set betting", "Tennis handicap predictions"
      ],
      description: `Get the best tennis betting tips and predictions for ${matchDate}. Expert analysis on ATP, WTA, and Grand Slam matches. Free daily tennis tips.`
    },
    'bet-of-the-day': {
      keywords: [
        "bet of the day", "daily betting tip", "best bet today",
        "sure bet", "accumulator tip", "daily predictions",
        "expert betting tip", "today's best bet", "guaranteed tip"
      ],
      description: `Today's best betting tip for ${matchDate}. Our experts' most confident prediction with detailed analysis. Don't miss our bet of the day.`
    }
  };

  const config = sportConfigs[sport] || {
    keywords: [`${sport} betting tips`, `${sport} predictions`, `${sport} betting`],
    description: `Get the best ${sport} betting tips and predictions for ${matchDate}. Expert analysis and free daily ${sport} tips.`
  };
  
  return {
    title: `${sportName} Betting Tips & Predictions - ${matchDate}`,
    description: config.description,
    keywords: config.keywords,
    
    openGraph: {
      title: `${sportName} Betting Tips & Predictions - ${matchDate} | SportyPredict`,
      description: config.description,
      url: `https://sportypredict.com/${sport}/${date}`,
      images: [{
        url: "https://sportypredict.com/assets/banner.png",
        width: 1200,
        height: 630,
        alt: `${sportName} Betting Tips - SportyPredict`,
      }]
    },
    
    twitter: {
      title: `${sportName} Betting Tips & Predictions - ${matchDate}`,
      description: `Get the best ${sport} betting tips and predictions for ${matchDate} from our experts.`,
    },
    
    alternates: {
      canonical: `https://sportypredict.com/${sport}/${date}`,
    }
  };
}

// Dynamic schema generators
const generateWebsiteSchema = (sport, date) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `SportyPredict ${sport.charAt(0).toUpperCase() + sport.slice(1)} Tips`,
  url: `https://sportypredict.com/${sport}/${date}`,
  description: `Expert ${sport} betting tips and predictions`,
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

const generateSportsEventSchema = (sport, date) => ({
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Betting Predictions`,
  description: `Daily ${sport} betting tips and predictions for ${date}`,
  sport: sport.charAt(0).toUpperCase() + sport.slice(1),
  startDate: new Date(date).toISOString(),
  location: {
    "@type": "VirtualLocation",
    url: `https://sportypredict.com/${sport}/${date}`
  }
});

const generateBreadcrumbSchema = (sport, date) => {
  const sportDisplayName = sport === 'bet-of-the-day' 
    ? 'Bet of the Day' 
    : sport.charAt(0).toUpperCase() + sport.slice(1) + ' Tips';
    
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sportypredict.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: sportDisplayName,
        item: `https://sportypredict.com/${sport}/${date}`
      }
    ]
  };
};

import ClientLayout from "@/app/[sport]/clientLayout";

export default async function SportLayout({ children, params }) {
  const { date, sport } = await params;
  
  const websiteSchema = generateWebsiteSchema(sport, date);
  const sportsEventSchema = generateSportsEventSchema(sport, date);
  const breadcrumbSchema = generateBreadcrumbSchema(sport, date);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, sportsEventSchema, breadcrumbSchema])
        }}
      />
      
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}