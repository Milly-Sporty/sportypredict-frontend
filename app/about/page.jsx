"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function About() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.section}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.termsContainer}>
      <div className={styles.termHeader}>
        <h1>About SportyPredict</h1>
      </div>

      <div className={styles.section}>
        <p>
          SportyPredict is a trusted source of sports predictions, match
          analysis, and expert tips across football, basketball, and tennis.
          Our mission is to help you approach sports prediction with confidence,
          transparency, and responsibility.
        </p>
      </div>

      <div className={styles.section}>
        <h2>What We Offer</h2>
        <ul className={styles.bulletList}>
          <li>
            Carefully analyzed match previews, statistical insights, and betting
            tips designed for clarity and value.
          </li>
          <li>A user friendly interface that works well on both desktop and mobile.</li>
          <li>
            A Premium / VIP Plan for curated, high probability selections and
            exclusive tips.
          </li>
          <li>Both Android and iOS Mobile Apps.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Why Choose SportyPredict</h2>
        <ul className={styles.bulletList}>
          <li>
            Predictions based on thorough statistical data, research, and expert
            evaluation.
          </li>
          <li>
            Collaboration with licensed bookmakers and trusted operators —
            choosing to place bets remains your decision.
          </li>
          <li>
            We aim to make predictions that stand out for their reliability,
            while reminding users that no tip is fail proof.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Responsible Use</h2>
        <ul className={styles.bulletList}>
          <li>
            You must be 18 years or older (or the legal age in your area) to use
            betting-related content.
          </li>
          <li>
            Predictions are not guarantees — injuries, match events, and weather
            can affect outcomes.
          </li>
          <li>
            Betting involves risk; gamble responsibly and never wager more than
            you can afford to lose.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Tips for Stake Management</h2>
        <ul className={styles.bulletList}>
          <li>
            Select 1–3 games per bet slip rather than including every tip in one
            ticket.
          </li>
          <li>
            VIP / Premium plans provide more exclusive selections, but outcomes
            remain uncertain.
          </li>
          <li>
            Use our content to make informed choices — not as a substitute for
            your own judgment or legal advice.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Our Commitment to the Community</h2>
        <ul className={styles.bulletList}>
          <li>
            We keep your data safe and respect your privacy. Contact us anytime
            with questions about our methods, data use, or content.
          </li>
          <li>
            We are transparent about our success rates and claims. Any percentage
            or “guarantee” is illustrative, not a promise.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Contact</h2>
        <p>Email: contact@sportypredict.com</p>
      </div>
    </div>
  );
}
