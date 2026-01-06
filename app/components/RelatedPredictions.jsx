"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import styles from "@/app/style/relatedPredictions.module.css";
import { createMatchSlug } from "@/app/utility/UrlSlug";
import { usePredictionStore } from "@/app/store/Prediction";
import { displayInLocalTime } from "@/app/utility/timezone";

export default function RelatedPredictions({ currentPrediction }) {
  const { predictions } = usePredictionStore();

  const relatedPredictions = useMemo(() => {
    if (!currentPrediction || !predictions || predictions.length === 0) {
      return [];
    }

    // Filter out the current prediction
    const otherPredictions = predictions.filter(
      (pred) => pred._id !== currentPrediction._id
    );

    if (otherPredictions.length === 0) {
      return [];
    }

    // Priority-based scoring
    const scorePrediction = (pred) => {
      let score = 0;

      // Priority 1: Same league (highest priority)
      if (
        pred.league &&
        currentPrediction.league &&
        pred.league.toLowerCase() === currentPrediction.league.toLowerCase()
      ) {
        score += 100;
      }

      // Priority 2: Same sport, different league
      if (
        pred.category &&
        currentPrediction.category &&
        pred.category.toLowerCase() === currentPrediction.category.toLowerCase()
      ) {
        score += 50;
      }

      // Priority 3: Same date
      if (pred.date && currentPrediction.date && pred.date === currentPrediction.date) {
        score += 25;
      }

      // Slight preference for matches with similar status (upcoming/live)
      if (pred.status === currentPrediction.status) {
        score += 5;
      }

      return score;
    };

    // Sort by priority score and take top 4
    const sorted = otherPredictions
      .map((pred) => ({ ...pred, priorityScore: scorePrediction(pred) }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 4);

    return sorted;
  }, [currentPrediction, predictions]);

  if (relatedPredictions.length === 0) {
    return null;
  }

  const formatSportName = (sport) => {
    if (sport === "bet-of-the-day") {
      return "Bet of the Day";
    }
    return sport.charAt(0).toUpperCase() + sport.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "";
    return displayInLocalTime(time, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className={styles.relatedContainer}>
      <h3 className={styles.relatedTitle}>Related Predictions</h3>
      <div className={styles.relatedGrid}>
        {relatedPredictions.map((prediction) => {
          const matchSlug = createMatchSlug(prediction.teamA, prediction.teamB);
          const predictionUrl = `/${prediction.category}/${prediction.date}/prediction/${matchSlug}`;
          const anchorText = `${prediction.teamA} vs ${prediction.teamB} - ${prediction.league} Prediction`;
          const formattedTime = formatTime(prediction.time);

          return (
            <Link
              key={prediction._id}
              href={predictionUrl}
              title={anchorText}
              className={styles.relatedCard}
            >
              {/* Card Top - League Info */}
              <div className={styles.cardTop}>
                <div className={styles.leagueInfo}>
                  {prediction.leagueImage && (
                    <Image
                      src={prediction.leagueImage}
                      alt={prediction.league}
                      width={20}
                      height={20}
                      className={styles.leagueImage}
                      priority={true}
                    />
                  )}
                  <h1 className={styles.leagueName}>{prediction.league}</h1>
                </div>
              </div>

              {/* Card Middle - Teams */}
              <div className={styles.cardMiddle}>
                {/* Team A */}
                <div className={styles.teamContainer}>
                  <div className={styles.teamInner}>
                    {prediction.teamAImage && (
                      <Image
                        src={prediction.teamAImage}
                        alt={prediction.teamA}
                        width={40}
                        height={40}
                        priority={true}
                        className={`${styles.teamImage} ${
                          prediction.category === "tennis" ||
                          prediction.category === "basketball"
                            ? styles.circularShape
                            : ""
                        }`}
                      />
                    )}
                    <h2>{prediction.teamA}</h2>
                  </div>
                </div>

                {/* VS & Time */}
                <div className={styles.matchInfo}>
                  {formattedTime && (
                    <h3>[{formattedTime.split(" ")[1] || formattedTime}]</h3>
                  )}
                  <h1>VS</h1>
                </div>

                {/* Team B */}
                <div className={styles.teamContainer}>
                  <div className={styles.teamInner}>
                    {prediction.teamBImage && (
                      <Image
                        src={prediction.teamBImage}
                        alt={prediction.teamB}
                        width={40}
                        height={40}
                        priority={true}
                        className={`${styles.teamImage} ${
                          prediction.category === "tennis" ||
                          prediction.category === "basketball"
                            ? styles.circularShape
                            : ""
                        }`}
                      />
                    )}
                    <h2>{prediction.teamB}</h2>
                  </div>
                </div>
              </div>

              {/* Card Footer - Date Info */}
              <div className={styles.cardFooter}>
                <span className={styles.matchDate}>
                  {formatDate(prediction.date)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
