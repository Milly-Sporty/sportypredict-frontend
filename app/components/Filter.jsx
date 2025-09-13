"use client";

import Image from "next/image";
import { useCallback } from "react";
import { useAuthStore } from "@/app/store/Auth";
import { useState, useEffect, useMemo } from "react";
import styles from "@/app/style/filter.module.css";
import VipResults from "@/app/components/VipResults";
import { useRouter, usePathname, useParams,  } from "next/navigation";
import { usePredictionStore } from "@/app/store/Prediction";

export default function FilterComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { predictions } = usePredictionStore();
  const { isVip, isAuth, isVipActive } = useAuthStore();

  const isVipPage = pathname.startsWith("/vip");



  const filterOptions = useMemo(() => {
  if (!predictions || predictions.length === 0) {
    return {
      countries: [],
      leagues: [],
      leagueImages: {},
    };
  }

  // Process countries with proper normalization
  const countryMap = new Map();
  predictions.forEach(pred => {
    if (pred.country) {
      const originalCountry = pred.country.toString().trim(); // Trim whitespace
      const normalizedKey = originalCountry.toLowerCase(); // Use trimmed version for key
      if (normalizedKey && !countryMap.has(normalizedKey)) {
        countryMap.set(normalizedKey, originalCountry);
      }
    }
  });

  // Process leagues with proper normalization  
  const leagueMap = new Map();
  predictions.forEach(pred => {
    if (pred.league) {
      const originalLeague = pred.league.toString().trim(); // Trim whitespace
      const normalizedKey = originalLeague.toLowerCase(); // Use trimmed version for key
      if (normalizedKey && !leagueMap.has(normalizedKey)) {
        leagueMap.set(normalizedKey, originalLeague);
      }
    }
  });

  const countries = Array.from(countryMap.values()).sort();
  const leagues = Array.from(leagueMap.values()).sort();

  const leagueImages = {};
  predictions.forEach((pred) => {
    if (pred.league && pred.leagueImage) {
      const normalizedLeague = pred.league.toString().trim(); // Trim whitespace
      if (normalizedLeague && !leagueImages[normalizedLeague]) {
        leagueImages[normalizedLeague] = pred.leagueImage;
      }
    }
  });

  return {
    countries,
    leagues,
    leagueImages,
  };
}, [predictions]);

const parseFiltersFromPath = useCallback(() => {
  const pathParts = pathname.split('/');
  // Expected structure: /sport/date/[filter1]/[filter2]
  const sportIndex = pathParts.findIndex(part => 
    ['football', 'basketball', 'tennis', 'hockey', 'baseball', 'extra', 'bet-of-the-day'].includes(part)
  );
  
  if (sportIndex === -1) return { league: null, country: null };
  
  const dateIndex = sportIndex + 1;
  const filter1Index = dateIndex + 1;
  const filter2Index = filter1Index + 1;
  
  const filter1 = pathParts[filter1Index] ? decodeURIComponent(pathParts[filter1Index]).trim() : null;
  const filter2 = pathParts[filter2Index] ? decodeURIComponent(pathParts[filter2Index]).trim() : null;
  
  // Determine which filter is league and which is country
  if (!filter1 && !filter2) {
    return { league: null, country: null };
  }
  
  // Check against available options to determine type (case-insensitive comparison)
  const leagues = filterOptions.leagues;
  const countries = filterOptions.countries;
  
  let league = null;
  let country = null;
  
  // Helper function for matching
  const findMatch = (value, array) => {
    if (!value) return null;
    return array.find(item => 
      item.trim().toLowerCase() === value.trim().toLowerCase()
    );
  };
  
  if (filter1) {
    const matchedLeague = findMatch(filter1, leagues);
    const matchedCountry = findMatch(filter1, countries);
    
    if (matchedLeague) {
      league = matchedLeague;
      if (filter2) {
        const matchedCountry2 = findMatch(filter2, countries);
        if (matchedCountry2) {
          country = matchedCountry2;
        }
      }
    } else if (matchedCountry) {
      country = matchedCountry;
      if (filter2) {
        const matchedLeague2 = findMatch(filter2, leagues);
        if (matchedLeague2) {
          league = matchedLeague2;
        }
      }
    }
  }
  
  return { league, country };
}, [pathname, filterOptions.leagues, filterOptions.countries]);




  const currentFilters = parseFiltersFromPath();
  const [selectedLeague, setSelectedLeague] = useState(currentFilters.league);
  const [selectedCountry, setSelectedCountry] = useState(currentFilters.country);

  // Update state when URL changes
  useEffect(() => {
    const filters = parseFiltersFromPath();
    setSelectedLeague(filters.league);
    setSelectedCountry(filters.country);
  }, [pathname, filterOptions.leagues, filterOptions.countries, parseFiltersFromPath]);

  const buildFilterURL = (newLeague, newCountry) => {
    const pathParts = pathname.split('/');
    const sportIndex = pathParts.findIndex(part => 
      ['football', 'basketball', 'tennis', 'bet-of-the-day'].includes(part)
    );
    
    if (sportIndex === -1) return pathname;
    
    const sport = pathParts[sportIndex];
    const date = pathParts[sportIndex + 1];
    
    let newPath = `/${sport}/${date}`;
    
    // Add filters to path if they exist
    if (newLeague && newCountry) {
      newPath += `/${encodeURIComponent(newLeague)}/${encodeURIComponent(newCountry)}`;
    } else if (newLeague) {
      newPath += `/${encodeURIComponent(newLeague)}`;
    } else if (newCountry) {
      newPath += `/${encodeURIComponent(newCountry)}`;
    }
    
    return newPath;
  };

  const handleLeagueSelection = (leagueName) => {
    const newLeague = selectedLeague === leagueName ? null : leagueName;
    const newPath = buildFilterURL(newLeague, selectedCountry);
    router.push(newPath);
  };

  const handleCountrySelection = (countryName) => {
    const newCountry = selectedCountry === countryName ? null : countryName;
    const newPath = buildFilterURL(selectedLeague, newCountry);
    router.push(newPath);
  };

  const renderFilterSection = (type, title) => {
    const isLeagueSection = type === "leagues";

    const allItems = isLeagueSection
      ? filterOptions.leagues
      : filterOptions.countries;

    const selectedItem = isLeagueSection ? selectedLeague : selectedCountry;
    const items = selectedItem ? [selectedItem] : allItems;

    return (
      <div className={styles.filterWrapperInner}>
        <div className={styles.filterHeader}>
          <h1>{title}</h1>
          {selectedItem && (
            <span
              onClick={() => {
                if (isLeagueSection) {
                  const newPath = buildFilterURL(null, selectedCountry);
                  router.push(newPath);
                } else {
                  const newPath = buildFilterURL(selectedLeague, null);
                  router.push(newPath);
                }
              }}
            >
              Clear Filter
            </span>
          )}
        </div>
        <div className={styles.leagueFilterContainer}>
          {items.length > 0 ? (
            items.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${styles.leagueCard} ${
                    (
                      isLeagueSection
                        ? selectedLeague === item
                        : selectedCountry === item
                    )
                      ? styles.selectedCard
                      : ""
                  }`}
                  onClick={() =>
                    isLeagueSection
                      ? handleLeagueSelection(item)
                      : handleCountrySelection(item)
                  }
                >
                  {isLeagueSection && (
                    <Image
                      className={styles.leagueImg}
                      priority={true}
                      src={filterOptions.leagueImages[item]}
                      alt={item}
                      height={50}
                      width={50}
                    />
                  )}
                  <div className={styles.leagueCardText}>
                    <h2>{item}</h2>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noResults}>
              No {isLeagueSection ? "leagues" : "countries"} found
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.filterContainer}>
      <VipResults />

      {(!isVipPage || (isVip && isAuth && isVipActive)) && (
        <div className={styles.filterWrapper}>
          {filterOptions.leagues.length >= 2 &&
            renderFilterSection("leagues", "Filter Leagues")}
          {filterOptions.countries.length >= 2 &&
            renderFilterSection("countries", "Filter Countries")}
        </div>
      )} 
    </div>
  );
}