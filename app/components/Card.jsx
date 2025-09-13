"use client";

import Image from "next/image";
import { useMemo } from "react";
import styles from "@/app/style/card.module.css";
import { displayInLocalTime } from "@/app/utility/timezone";

export default function SportCard({
  formationA = ["L", "W", "D", "L", "W"],
  formationB =  ["L", "W", "D", "L", "W"],
  leagueImage,
  teamAImage,
  teamBImage,
  tip = "0",
  league,
  teamA,
  teamB,
  teamAscore,
  teamBscore,
  time,
  status,
  sport,
  showScore,
  showBtn,
  component,
}) {
  const formattedTime = useMemo(() => {
    return displayInLocalTime(time, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }, [time]);

  const getFormationColorClass = (formation) => {
    switch (formation.toUpperCase()) {
      case "W":
        return styles.win;
      case "D":
        return styles.draw;
      case "L":
        return styles.lose;
      default:
        return styles.defaultColor;
    }
  };

  const getStatusClassName = (status) => {
    const statusClasses = {
      win: styles.statusWon,
      won: styles.statusWon,
      loss: styles.statusLoss,
      refund: styles.statusRefund,
      cancelled: styles.statusCancelled,
      postponed: styles.statusPostponed,
      draw: styles.statusPending,
      pending: styles.statusPending,
    };
    return statusClasses[status] || styles.statusDefault;
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardTop}>
        <div className={styles.leagueInfo}>
          <Image
            src={leagueImage}
            alt={`${league} image`}
            width={20}
            height={20}
            priority={true}
            className={styles.leagueImage}
          />
          <h1>{league}</h1>
        </div>
        <div className={styles.cardStatus}>
          <span className={status ? getStatusClassName(status) : ""}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : ""}
          </span>
        </div>
      </div>
      <div className={styles.cardMiddle}>
        <div className={styles.teamContainer}>
          <div className={styles.teamInner}>
            <Image
              src={teamAImage}
              alt={`${teamA} image`}
              priority={true}
              width={40}
              height={40}
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
          <h3>[{formattedTime.split(' ')[1] || formattedTime}]</h3>
          {showScore ? "" : <h1>VS</h1>}
          {sport === "Extra" ? "" : component}
        </div>
        <div className={styles.teamContainer}>
          {showScore ? <h1>{teamBscore}</h1> : ""}
          <div className={styles.teamInner}>
            <Image
              src={teamBImage}
              alt={`${teamB} image`}
              priority={true}
              width={40}
              height={40}
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
      <div className={styles.tipContainer}>
        <h2>Tip:</h2>
        <h4>{tip}</h4>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.formation}>
          {formationA.map((result, index) => (
            <div
              key={index}
              className={`${styles.formationCircle} ${getFormationColorClass(
                result
              )}`}
            >
              <span>{result.toUpperCase()}</span>
            </div>
          ))}
        </div>
        <h4>Recent Form</h4>
        <div className={styles.formation}>
          {formationB.map((result, index) => (
            <div
              key={index}
              className={`${styles.formationCircle} ${getFormationColorClass(
                result
              )}`}
            >
              <span> {result.toUpperCase()} </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}