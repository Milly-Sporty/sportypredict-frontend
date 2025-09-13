"use client";

import { useRouter, usePathname, useParams } from "next/navigation";
import MobileDropdown from "@/app/components/MobileDropdown";
import styles from "@/app/style/mobileFilter.module.css";
import date from "date-and-time";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePredictionStore } from "@/app/store/Prediction";

import { BiWorld as CountryIcon } from "react-icons/bi";
import { TbStars as ExtraIcon } from "react-icons/tb";
import { IoFootball as SportIcon } from "react-icons/io5";
import { BiCalendar as CalendarIcon } from "react-icons/bi";

export default function MobileFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { predictions } = usePredictionStore();

  const dateInputRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const currentSport = decodeURIComponent(pathname.split("/")[1]);

  // Parse current filters from URL path
  const parseFiltersFromPath = () => {
    const pathParts = pathname.split('/');
    const sportIndex = pathParts.findIndex(part => 
      ['football', 'basketball', 'tennis', 'hockey', 'baseball', 'extra', 'bet-of-the-day'].includes(part)
    );
    
    if (sportIndex === -1) return { league: null, country: null };
    
    const dateIndex = sportIndex + 1;
    const filter1Index = dateIndex + 1;
    const filter2Index = filter1Index + 1;
    
    const filter1 = pathParts[filter1Index] ? decodeURIComponent(pathParts[filter1Index]) : null;
    const filter2 = pathParts[filter2Index] ? decodeURIComponent(pathParts[filter2Index]) : null;
    
    // Skip if it's a prediction route
    if (filter1 === 'prediction') return { league: null, country: null };
    
    // Determine which filter is league and which is country
    if (!filter1 && !filter2) {
      return { league: null, country: null };
    }
    
    // Check against available options to determine type
    const leagues = filterOptions.leagues.filter(l => l !== 'All');
    const countries = filterOptions.countries.filter(c => c !== 'All');
    
    let league = null;
    let country = null;
    
    if (filter1) {
      if (leagues.includes(filter1)) {
        league = filter1;
        if (filter2 && countries.includes(filter2)) {
          country = filter2;
        }
      } else if (countries.includes(filter1)) {
        country = filter1;
        if (filter2 && leagues.includes(filter2)) {
          league = filter2;
        }
      }
    }
    
    return { league, country };
  };

  const filterOptions = useMemo(() => {
    if (!predictions || predictions.length === 0) {
      return {
        sports: [],
        countries: [],
        leagues: [],
        tips: [],
      };
    }

    const normalizeText = (text) => {
      if (!text) return '';
      return text.toString()
        .trim()
        .replace(/\s+/g, ' ') 
        .toLowerCase()
    };

    const sportMap = new Map();
    predictions.forEach(pred => {
      if (pred.sport) {
        const originalSport = pred.sport.toString().trim();
        const normalizedKey = normalizeText(pred.sport);
        if (normalizedKey && !sportMap.has(normalizedKey)) {
          sportMap.set(normalizedKey, originalSport);
        }
      }
    });

    const countryMap = new Map();
    predictions.forEach(pred => {
      if (pred.country) {
        const originalCountry = pred.country.toString().trim();
        const normalizedKey = normalizeText(pred.country);
        if (normalizedKey && !countryMap.has(normalizedKey)) {
          countryMap.set(normalizedKey, originalCountry);
        }
      }
    });

    const leagueMap = new Map();
    predictions.forEach(pred => {
      if (pred.league) {
        const originalLeague = pred.league.toString().trim();
        const normalizedKey = normalizeText(pred.league);
        if (normalizedKey && !leagueMap.has(normalizedKey)) {
          leagueMap.set(normalizedKey, originalLeague);
        }
      }
    });

    const tipMap = new Map();
    predictions.forEach(pred => {
      if (pred.tip) {
        const originalTip = pred.tip.toString().trim();
        const normalizedKey = normalizeText(pred.tip);
        if (normalizedKey && !tipMap.has(normalizedKey)) {
          tipMap.set(normalizedKey, originalTip);
        }
      }
    });

    const sports = Array.from(sportMap.values()).sort();
    const countries = Array.from(countryMap.values()).sort();
    const leagues = Array.from(leagueMap.values()).sort();
    const tips = Array.from(tipMap.values()).sort();

    return {
      sports: sports.length > 0 ? ["All", ...sports] : [],
      countries: countries.length > 0 ? ["All", ...countries] : [],
      leagues: leagues.length > 0 ? ["All", ...leagues] : [],
      tips: tips.length > 0 ? ["All", ...tips] : [],
    };
  }, [predictions]);

  const currentFilters = parseFiltersFromPath();
  const [selectedCountry, setSelectedCountry] = useState(currentFilters.country);
  const [selectedLeague, setSelectedLeague] = useState(currentFilters.league);

  const currentDate = date.format(new Date(), "DD-MM-YYYY");
  const currentDateForInput = date.format(new Date(), "YYYY-MM-DD");

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return currentDate;
    const dateObj = new Date(dateString);
    return date.format(dateObj, "DD-MM-YYYY");
  };

  const getDateDisplayText = () => {
    const routeDate = params.date;
    if (routeDate) {
      return formatDateForDisplay(routeDate);
    }
    return currentDate;
  };

  const buildFilterURL = (newLeague, newCountry) => {
    const pathParts = pathname.split('/');
    const sportIndex = pathParts.findIndex(part => 
      ['football', 'basketball', 'tennis', 'hockey', 'baseball', 'extra', 'bet-of-the-day'].includes(part)
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

  const handleSportSelect = (sport) => {
    const newSport =
      selectedSport === sport ? null : sport === "All" ? null : sport;
    setSelectedSport(newSport);
  };

  const handleCountrySelect = (country) => {
    if (country === "All") {
      const newPath = buildFilterURL(selectedLeague, null);
      router.push(newPath);
      return;
    }

    if (selectedCountry === country) {
      const newPath = buildFilterURL(selectedLeague, null);
      router.push(newPath);
      return;
    }

    const newPath = buildFilterURL(selectedLeague, country);
    router.push(newPath);
  };

  const handleLeagueSelect = (league) => {
    if (league === "All") {
      const newPath = buildFilterURL(null, selectedCountry);
      router.push(newPath);
      return;
    }

    if (selectedLeague === league) {
      const newPath = buildFilterURL(null, selectedCountry);
      router.push(newPath);
      return;
    }

    const newPath = buildFilterURL(league, selectedCountry);
    router.push(newPath);
  };

  const handlePredictionSelect = (prediction) => {
    const newPrediction =
      selectedPrediction === prediction
        ? null
        : prediction === "All"
        ? null
        : prediction;
    setSelectedPrediction(newPrediction);
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    
    // Navigate to new date route, preserving filters
    const pathParts = pathname.split('/');
    const sportIndex = pathParts.findIndex(part => 
      ['football', 'basketball', 'tennis', 'hockey', 'baseball', 'extra', 'bet-of-the-day'].includes(part)
    );
    
    if (sportIndex !== -1) {
      const sport = pathParts[sportIndex];
      let newPath = `/${sport}/${dateValue}`;
      
      // Preserve existing filters
      if (selectedLeague && selectedCountry) {
        newPath += `/${encodeURIComponent(selectedLeague)}/${encodeURIComponent(selectedCountry)}`;
      } else if (selectedLeague) {
        newPath += `/${encodeURIComponent(selectedLeague)}`;
      } else if (selectedCountry) {
        newPath += `/${encodeURIComponent(selectedCountry)}`;
      }
      
      router.push(newPath);
    }
  };

  const handleDateContainerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (dateInputRef.current) {
      setTimeout(() => {
        dateInputRef.current.focus();
        if (dateInputRef.current.showPicker) {
          try {
            dateInputRef.current.showPicker();
          } catch (error) {
            dateInputRef.current.click();
          }
        } else {
          dateInputRef.current.click();
        }
      }, 10);
    }
  };

  const handleDateInputClick = (e) => {
    e.stopPropagation();
  };

  const handleDateInputFocus = (e) => {
    e.stopPropagation();
    if (e.target.showPicker) {
      try {
        e.target.showPicker();
      } catch (error) {}
    }
  };

  useEffect(() => {
    // Update state when URL changes
    const filters = parseFiltersFromPath();
    setSelectedCountry(filters.country);
    setSelectedLeague(filters.league);
    
    // Reset other filters when pathname changes
    setSelectedSport(null);
    setSelectedPrediction(null);
    
    // Set date from route params
    if (params.date) {
      setSelectedDate(params.date);
    } else {
      setSelectedDate(currentDateForInput);
    }
  }, [pathname, params.date, filterOptions.leagues, filterOptions.countries]);

  return (
    <div className={styles.mobileFilterContainer}>
      <div className={styles.mobileFilterHead}>
        <h1>
          {currentSport} Betting tips and
          predictions
        </h1>
      </div>
      <div className={styles.filterContainer}>
        <h1>Filter by:</h1>
        <div className={styles.filterInner}>
          <div className={styles.filterWrapper}>
            {currentSport === "extra" && filterOptions.tips.length > 1 && (
              <MobileDropdown
                options={filterOptions.tips}
                Icon={
                  <ExtraIcon className={styles.filterIcon} alt="extra icon" />
                }
                dropPlaceHolder="Prediction Type"
                onSelect={handlePredictionSelect}
                selectedValue={selectedPrediction}
              />
            )}

            {filterOptions.countries.length > 2 && (
              <MobileDropdown
                options={filterOptions.countries}
                Icon={
                  <CountryIcon
                    className={styles.filterIcon}
                    alt="country icon"
                  />
                }
                dropPlaceHolder="Country"
                onSelect={handleCountrySelect}
                selectedValue={selectedCountry}
              />
            )}

            {filterOptions.leagues.length > 2 && (
              <MobileDropdown
                options={filterOptions.leagues}
                Icon={
                  <SportIcon className={styles.filterIcon} alt="league icon" />
                }
                dropPlaceHolder="League"
                onSelect={handleLeagueSelect}
                selectedValue={selectedLeague}
              />
            )}

            {filterOptions.sports.length > 2 && (
              <MobileDropdown
                options={filterOptions.sports}
                Icon={
                  <SportIcon className={styles.filterIcon} alt="sport icon" />
                }
                dropPlaceHolder="Sport"
                onSelect={handleSportSelect}
                selectedValue={selectedSport}
              />
            )}
          </div>

          <div className={styles.filterDate} onClick={handleDateContainerClick}>
            <CalendarIcon className={styles.filterIcon} alt="calendar icon" />
            <span className={styles.dateDisplay}>{getDateDisplayText()}</span>
            <input
              ref={dateInputRef}
              type="date"
              className={styles.dateInput}
              onChange={handleDateChange}
              onClick={handleDateInputClick}
              onFocus={handleDateInputFocus}
              value={params.date || currentDateForInput}
              title="Filter by date"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 