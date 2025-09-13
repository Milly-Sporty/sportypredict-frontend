"use client";

import { toast } from "sonner";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "@/app/components/Banner";
import SportCard from "@/app/components/Card";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/style/sport.module.css";
import VipResults from "@/app/components/VipResults";
import TennisInfo from "@/app/components/TennisInfo";
import FootballInfo from "@/app/components/FootballInfo";
import { createMatchSlug } from "@/app/utility/UrlSlug";
import MobileFilter from "@/app/components/MobileFilter";
import CardSkeleton from "@/app/components/CardSkeleton";
import { usePredictionStore } from "@/app/store/Prediction";
import BasketballInfo from "@/app/components/BasketballInfo";
import BetOfTheDayInfo from "@/app/components/BetOfTheDayInfo";
import EmptySportImage from "@/public/assets/emptysport.png";
import ExclusiveOffers from "@/app/components/ExclusiveOffer";
import { IoIosArrowForward as RightIcon } from "react-icons/io";
import { usePathname, useParams } from "next/navigation";

export default function Sport() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isMobile, setMobile] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const currentSport = decodeURIComponent(pathname.split("/")[1]);

  const { predictions, loading, error, fetchPredictions, clearError } =
    usePredictionStore();

  const parseFiltersFromPath = () => {
    const pathParts = pathname.split("/");
    const sportIndex = pathParts.findIndex((part) =>
      ["football", "basketball", "tennis", "bet-of-the-day"].includes(part)
    );

    if (sportIndex === -1) return { league: null, country: null };

    const dateIndex = sportIndex + 1;
    const filter1Index = dateIndex + 1;
    const filter2Index = filter1Index + 1;

    const filter1 = pathParts[filter1Index]
      ? decodeURIComponent(pathParts[filter1Index])
      : null;
    const filter2 = pathParts[filter2Index]
      ? decodeURIComponent(pathParts[filter2Index])
      : null;

    if (filter1 === "prediction") return { league: null, country: null };

    return {
      league: filter1,
      country: filter2,
    };
  };

  const currentFilters = parseFiltersFromPath();

  const renderPredictionInfo = useCallback(() => {
    switch (currentSport) {
      case "football":
        return <FootballInfo />;
      case "basketball":
        return <BasketballInfo />;
      case "tennis":
        return <TennisInfo />;
      case "bet-of-the-day":
        return <BetOfTheDayInfo />;
      default:
        return null;
    }
  }, [currentSport]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadPredictions = async () => {
      const urlDate = params.date;

      if (!urlDate) return;

      const category = currentSport.toLowerCase();
      const result = await fetchPredictions(urlDate, category);

      if (!result.success && result.message) {
        toast.error(result.message);
      }
    };

    loadPredictions();
  }, [params.date, currentSport, fetchPredictions]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const validateFilters = (filter1, filter2) => {
    if (!predictions || predictions.length === 0) {
      return { league: null, country: null };
    }

    const leagues = [
      ...new Set(predictions.map((p) => p.league).filter(Boolean)),
    ];
    const countries = [
      ...new Set(predictions.map((p) => p.country).filter(Boolean)),
    ];

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

  const validatedFilters = validateFilters(
    currentFilters.league,
    currentFilters.country
  );

  const filteredPredictions = predictions.filter((prediction) => {
    const matchesSearch =
      !searchKey ||
      prediction.teamA.toLowerCase().includes(searchKey.toLowerCase()) ||
      prediction.teamB.toLowerCase().includes(searchKey.toLowerCase()) ||
      prediction.tip.toLowerCase().includes(searchKey.toLowerCase());

    const matchesLeague =
      !validatedFilters.league ||
      prediction.league
        .toLowerCase()
        .includes(validatedFilters.league.toLowerCase());

    const matchesCountry =
      !validatedFilters.country ||
      prediction.country
        .toLowerCase()
        .includes(validatedFilters.country.toLowerCase());

    const matchesCategory =
      prediction.category.toLowerCase() === currentSport.toLowerCase();

    return matchesSearch && matchesLeague && matchesCountry && matchesCategory;
  });

  const shouldShowNothing = !loading && filteredPredictions.length === 0;

  const handleCardClick = (teamA, teamB, id) => {
    if (id === "empty" || !teamA || !teamB) return;

    let selectedDate = params.date;
    if (!selectedDate) {
      const today = new Date();
      selectedDate = today.toISOString().split("T")[0];
    }

    const matchSlug = createMatchSlug(teamA, teamB);
    const encodedSlug = encodeURIComponent(matchSlug);

    const fullUrl = `/${currentSport}/${selectedDate}/prediction/${encodedSlug}`;
    router.push(fullUrl, { scroll: false });
  };

  if (loading) {
    return (
      <div className={styles.sportContainer}>
        <Banner />
        <div className={styles.filtersContainer}>
          <MobileFilter />
        </div>
        <ExclusiveOffers />
        <div className={styles.content}>
          <CardSkeleton count={12} />
        </div>
      </div>
    );
  }

  if (shouldShowNothing) {
    const hasActiveFilters =
      validatedFilters.league || validatedFilters.country;

    return (
      <div className={styles.sportContainer}>
        <Banner />
        <div className={styles.filtersContainer}>
          <MobileFilter />
        </div>
        <ExclusiveOffers />
        <div className={styles.content}>
          <Nothing
            Alt="No prediction"
            NothingImage={EmptySportImage}
            Text={
              searchKey || hasActiveFilters
                ? `No ${currentSport} predictions match your filters${
                    params.date
                      ? ` for ${new Date(params.date).toLocaleDateString()}`
                      : ""
                  }`
                : `No ${currentSport} predictions yet! Check back later.`
            }
          />
        </div>
        {renderPredictionInfo()}
      </div>
    );
  }

  return (
    <div className={styles.sportContainer}>
      <Banner />
      <div className={styles.filtersContainer}>
        <MobileFilter />
      </div>
      <ExclusiveOffers />
      <div
        className={`${styles.content} ${
          predictions ? styles.predictionMinHeight : ""
        }`}
      >
        {filteredPredictions.map((data, index) => (
          <SportCard
            key={data._id || index}
            formationA={data.formationA}
            formationB={data.formationB}
            leagueImage={data.leagueImage}
            teamAImage={data.teamAImage}
            teamBImage={data.teamBImage}
            tip={data.tip}
            league={data.league}
            teamA={data.teamA}
            teamB={data.teamB}
            teamAscore={data.teamAscore}
            teamBscore={data.teamBscore}
            time={data.time}
            status={data.status}
            sport={data.sport}
            showScore={data.showScore}
            showBtn={data.showBtn}
            component={
              <div
                className={styles.matchPreview}
                onClick={() =>
                  handleCardClick(data.teamA, data.teamB, data._id)
                }
              >
                <span>Match Preview </span>
                <RightIcon
                  className={styles.matchArrowIcon}
                  alt="arrow icon"
                  height={20}
                />
              </div>
            }
          />
        ))}
        {isMobile && <VipResults />}
      </div>
      {renderPredictionInfo()}
    </div>
  );
}
