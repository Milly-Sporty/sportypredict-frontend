"use client";

import { toast } from "sonner";
import Image from "next/image";
import DOMPurify from "dompurify";
import { useEffect, useState} from "react";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/style/single.module.css";
import Loading from "@/app/components/LoadingLogo";
import { useAdvertStore } from "@/app/store/Advert";
import SingleCard from "@/app/components/SingleCard";
import OfferCard from "@/app/components/SingleOfferCard";
import { usePredictionStore } from "@/app/store/Prediction";
import EmptySportImage from "@/public/assets/emptysport.png";
import { parseMatchSlug, teamNamesMatch } from "@/app/utility/UrlSlug";
import { usePathname } from "next/navigation";

export default function SingleSport() {
  const [activeTab, setActiveTab] = useState("preview"); 
  const [selectedTeam, setSelectedTeam] = useState(0); 
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const currentSport = pathParts[1];
  const selectedDate = pathParts[2];
  const slug = pathParts[4] || "";

  const { teamA: teamAFromUrl, teamB: teamBFromUrl } = parseMatchSlug(slug);

  const {
    singlePrediction: match,
    loading: isLoading,
    error,
    fetchSinglePrediction,
    clearError,
  } = usePredictionStore();

  const { adverts, fetchAdverts, loading: advertLoading } = useAdvertStore();

  const innerBannerAds = adverts.filter((ad) => ad.location === "InnerBanner");
  const currentAd = innerBannerAds[currentAdIndex];

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  useEffect(() => {
    if (innerBannerAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % innerBannerAds.length
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [innerBannerAds.length]);

  const getSportCategory = (sport) => {
    const sportCategoryMap = {
      football: "football",
      basketball: "basketball", 
      tennis: "tennis",
      extra: "extra",
      'bet-of-the-day': "bet-of-the-day",
      vip: "vip",
    };

    return (
      sportCategoryMap[sport?.toLowerCase()] ||
      sport?.toLowerCase() ||
      "football"
    );
  };

  useEffect(() => {
    const loadSinglePrediction = async () => {
      clearError();

      if (!teamAFromUrl || !teamBFromUrl) {
        toast.error("Invalid team names in URL");
        return;
      }

      if (!currentSport) {
        toast.error("Sport category is missing");
        return;
      }

      if (!selectedDate) {
        toast.error("Date parameter is missing");
        return;
      }

      try {
        const category = getSportCategory(currentSport);

        const result = await fetchSinglePrediction(
          category,
          teamAFromUrl,
          teamBFromUrl,
          selectedDate
        );

        if (!result.success && result.message) {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error("Failed to load match details");
      }
    };

    if (teamAFromUrl && teamBFromUrl && currentSport && selectedDate) {
      loadSinglePrediction();
    }
  }, [
    currentSport,
    fetchSinglePrediction,
    clearError,
    teamAFromUrl,
    teamBFromUrl,
    selectedDate,
    slug,
  ]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const calculateTeamStats = (formation) => {
    if (!Array.isArray(formation)) return { wins: 0, draws: 0, losses: 0 };

    const wins = formation.filter((f) => f.toLowerCase() === "w").length;
    const draws = formation.filter((f) => f.toLowerCase() === "d").length;
    const losses = formation.filter((f) => f.toLowerCase() === "l").length;

    return { wins, draws, losses };
  };

  const getFormationColorClass = (formation) => {
    switch (formation?.toLowerCase()) {
      case "w":
        return styles.win;
      case "d":
        return styles.draw;
      case "l":
        return styles.lose;
      default:
        return styles.defaultColor;
    }
  };

  const getTeamImageClass = (sport) => {
    return `${styles.teamImage} ${
      sport === "Tennis" || sport === "Basketball" ? styles.circularShape : ""
    }`;
  };

  const shouldHideDraws = () => {
    const sport = match?.sport?.toLowerCase() || "";
    return sport.includes("basketball") || sport.includes("tennis");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAdClick = () => {
    if (currentAd?.link) {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  };

  const renderPredictionInfo = () => {
    if (!match?.tip) return null;

    return (
      <div className={styles.tipCard}>
        <div className={styles.tipHeader}>
          <span>Our Recommended Tip</span>
        </div>
        <div className={styles.tipValue}>
          {match.tip}
        </div>
      </div>
    );
  };

  const InnerBannerAdsSection = () => {
    if (!currentAd || advertLoading) {
      return null;
    }

    return (
      <div className={styles.advertCardContainer}>
        <div className={styles.infoHeader}>
          <h3>Sponsored</h3>
        </div>
        <div className={styles.advertCard} onClick={handleAdClick}>
          <Image
            className={styles.advertImage}
            src={currentAd.image}
            alt={currentAd.title}
            fill
            sizes="100%"
            quality={100}
            style={{
              objectFit: "cover",
            }}
            priority={true}
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.singleSportEmpty}>
        <Loading />
      </div>
    );
  }

  if (!match) {
    return (
      <div className={styles.singleSportEmpty}>
        <Nothing
          Alt="No predictions"
          NothingImage={EmptySportImage}
          Text={"No predictions details available for this match"}
        />
      </div>
    );
  }

  const isCorrectMatch = teamNamesMatch(match.teamA, teamAFromUrl) && 
                         teamNamesMatch(match.teamB, teamBFromUrl);
  
  if (!isCorrectMatch) {
  }

  const statsA = calculateTeamStats(match.formationA);
  const statsB = calculateTeamStats(match.formationB);
  const currentStats = selectedTeam === 0 ? statsA : statsB;
  const currentFormation = selectedTeam === 0 ? match.formationA : match.formationB;
  const currentTeamName = selectedTeam === 0 ? match.teamA : match.teamB;
  const currentTeamImage = selectedTeam === 0 ? match.teamAImage : match.teamBImage;

  return (
    <div className={styles.singleSportContainer}>
      <div className={styles.singleSportWrapper}>
        <SingleCard
          leagueImage={match.leagueImage}
          teamAImage={match.teamAImage}
          teamBImage={match.teamBImage}
          tip={match.tip}
          league={match.league}
          teamA={match.teamA}
          teamB={match.teamB}
          teamAscore={match.teamAscore}
          teamBscore={match.teamBscore}
          time={match.time}
          status={match.status}
          sport={match.sport}
          showScore={match.showScore}
          showBtn={false}
        />

        <div className={styles.tabsNavigation}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "preview" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("preview")}
          >
            Preview
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "stats" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("stats")}
          >
            Stats
          </button>
        </div>

        <div className={styles.tabContent}>
          <div
            className={`${styles.tabPanel} ${
              activeTab === "preview" ? styles.activePanel : ""
            }`}
          >
            <div className={styles.previewCard}>
              <div className={styles.matchAnalysis}>
                {match?.description ? (
                  <div
                    className={styles.htmlContent}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(match.description),
                    }}
                  />
                ) : (
                  <p>No match preview available.</p>
                )}
              </div>
              {renderPredictionInfo()}
            </div>
          </div>

          <div
            className={`${styles.tabPanel} ${
              activeTab === "stats" ? styles.activePanel : ""
            }`}
          >
            <div className={styles.statsCard}>
              <div className={styles.teamSelector}>
                <button
                  className={`${styles.teamSelectorButton} ${
                    selectedTeam === 0 ? styles.activeTeam : ""
                  }`}
                  onClick={() => setSelectedTeam(0)}
                >
                  <div className={styles.teamSelectorContent}>
                    {match.teamAImage && (
                      <Image
                        src={match.teamAImage}
                        alt={match.teamA}
                        width={24}
                        height={24}
                        className={getTeamImageClass(match.sport)}
                      />
                    )}
                    <span>{match.teamA}</span>
                  </div>
                </button>
                <button
                  className={`${styles.teamSelectorButton} ${
                    selectedTeam === 1 ? styles.activeTeam : ""
                  }`}
                  onClick={() => setSelectedTeam(1)}
                >
                  <div className={styles.teamSelectorContent}>
                    {match.teamBImage && (
                      <Image
                        src={match.teamBImage}
                        alt={match.teamB}
                        width={24}
                        height={24}
                        className={getTeamImageClass(match.sport)}
                      />
                    )}
                    <span>{match.teamB}</span>
                  </div>
                </button>
              </div>

              <div className={styles.teamStatsCard}>
                <div className={styles.formationIndicators}>
                  {currentFormation?.map((result, idx) => (
                    <div
                      key={`formation-${idx}`}
                      className={`${styles.formationCircle} ${getFormationColorClass(result)}`}
                      title={
                        result.toUpperCase() === "W"
                          ? "Win"
                          : result.toUpperCase() === "D"
                          ? "Draw"
                          : "Loss"
                      }
                    >
                      <span>{result.toUpperCase()}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.statsSection}>
                  <div className={styles.statItem}>
                    <div className={styles.statHeader}>
                      <span>Wins</span>
                      <span>
                        {currentStats.wins}/{currentFormation?.length || 0} (
                        {currentFormation?.length > 0
                          ? Math.round((currentStats.wins / currentFormation.length) * 100)
                          : 0}
                        %)
                      </span>
                    </div>
                    <div className={styles.statBar}>
                      <div
                        className={`${styles.statBarFill} ${styles.win}`}
                        style={{
                          width: `${
                            currentFormation?.length > 0
                              ? (currentStats.wins / currentFormation.length) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {!shouldHideDraws() && (
                    <div className={styles.statItem}>
                      <div className={styles.statHeader}>
                        <span>Draws</span>
                        <span>
                          {currentStats.draws}/{currentFormation?.length || 0} (
                          {currentFormation?.length > 0
                            ? Math.round((currentStats.draws / currentFormation.length) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className={styles.statBar}>
                        <div
                          className={`${styles.statBarFill} ${styles.draw}`}
                          style={{
                            width: `${
                              currentFormation?.length > 0
                                ? (currentStats.draws / currentFormation.length) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className={styles.statItem}>
                    <div className={styles.statHeader}>
                      <span>Losses</span>
                      <span>
                        {currentStats.losses}/{currentFormation?.length || 0} (
                        {currentFormation?.length > 0
                          ? Math.round((currentStats.losses / currentFormation.length) * 100)
                          : 0}
                        %)
                      </span>
                    </div>
                    <div className={styles.statBar}>
                      <div
                        className={`${styles.statBarFill} ${styles.lose}`}
                        style={{
                          width: `${
                            currentFormation?.length > 0
                              ? (currentStats.losses / currentFormation.length) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sideContent}>
        <div className={styles.infoCard}>
          <div className={styles.infoHeader}>
            <h3>Betting Signup Offers</h3>
          </div>
          <OfferCard />
        </div>
        <InnerBannerAdsSection />
      </div>
    </div>
  );
}