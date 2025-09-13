"use client";

import Image from "next/image";
import { useMemo, useEffect, useState } from "react";
import { useAdvertStore } from "@/app/store/Advert";
import styles from "@/app/style/singlecard.module.css";
import { displayInLocalTime } from "@/app/utility/timezone";

export default function SingleCard({
  leagueImage,
  teamAImage,
  teamBImage,
  tip = "",
  league,
  teamA,
  teamB,
  teamAscore,
  teamBscore,
  time,
  status,
  sport,
  showScore,
}) {
  const { adverts, fetchAdverts, loading } = useAdvertStore();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const cardBannerAds = adverts.filter((ad) => ad.location === "CardBanner");
  const currentAd = cardBannerAds[currentAdIndex];

  const formattedTime = useMemo(() => {
    const formattedDateTime = displayInLocalTime(time, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return formattedDateTime.split(' ')[1] || formattedDateTime;
  }, [time]);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  useEffect(() => {
    if (cardBannerAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % cardBannerAds.length
        );
      }, 5000); // Change ad every 5 seconds

      return () => clearInterval(interval);
    }
  }, [cardBannerAds.length]);

  const handleAdClick = () => {
    if (currentAd?.link) {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  };

  const renderAdBanner = () => {
    if (!currentAd) {
      return null;
    }

    if (loading) {
      return (
        <div className={`${styles.adBanner} skeleton`}>
          <div className={styles.adBannerImage}></div>
        </div>
      );
    }

    return (
      <div
        className={styles.adBanner}
        onClick={handleAdClick}
        style={{ cursor: currentAd.link ? "pointer" : "default" }}
      >
        <Image
          className={styles.advertImage}
          src={currentAd.image}
          alt={currentAd.title || "Advertisement"}
          fill
          sizes="100%"
          quality={100}
          objectFit="contain"
          priority={true}
        />
      </div>
    );
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardTop}>
        <div className={styles.leagueInfo}>
          <Image
            src={leagueImage}
            alt={`${league} image`}
            width={35}
            height={35}
            priority={true}
            className={styles.leagueImage}
          />
          <h1>{league}</h1>
        </div>
      
      </div>

      <div className={styles.cardMiddle}>
        <div className={styles.teamContainer}>
          <div className={styles.teamInner}>
            <Image
              src={teamAImage}
              alt={`${teamA} image`}
              priority={true}
              width={65}
              height={65}
              className={`${styles.teamImage} ${
                sport === "Tennis" || sport === "Basketball"
                  ? styles.circularShape
                  : ""
              }`}
            />
            <h2>{teamA}</h2>
          </div>
          {showScore ? <h1>{teamAscore}</h1> : ""}
        </div>

        <div className={styles.matchInfo}>
          <h3>[{formattedTime}]</h3>
          {showScore ? "" : <h1>VS</h1>}
          {renderAdBanner()}
        </div>

        <div className={styles.teamContainer}>
          {showScore ? <h1>{teamBscore}</h1> : ""}
          <div className={styles.teamInner}>
            <Image
              src={teamBImage}
              alt={`${teamB} image`}
              priority={true}
              width={65}
              height={65}
              className={`${styles.teamImage} ${
                sport === "Tennis" || sport === "Basketball"
                  ? styles.circularShape
                  : ""
              }`}
            />
            <h2>{teamB}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}