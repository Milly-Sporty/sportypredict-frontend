"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function Disclaimer() {
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
        <h1>Disclaimer</h1>
      </div>
      <div className={styles.section}>
        <small>Updated in September 2025</small>
      </div>
      <div className={styles.section}>
        <h2>1. Informational & Entertainment Purpose Only</h2>
        <p>
          All content provided at SportyPredict—including predictions, tips,
          statistical models, match previews, and editorial materials—is for
          informational and entertainment purposes only.
        </p>
      </div>

      <div className={styles.section}>
        <h2>2. No Guarantee of Outcomes</h2>
        <p>
          Predictions and selections are opinions and do not guarantee success.
          Any decision to place bets or otherwise act on content is solely your
          responsibility. You acknowledge that gambling involves risk and you
          should never wager more than you can afford to lose.
        </p>
      </div>

      <div className={styles.section}>
        <h2>3. Premium / VIP Content</h2>
        <p>
          Premium or VIP paid selections and content are offered as exclusive
          informational material. Purchase of such content does not change the
          nature of the Service into a betting operator, nor does it guarantee
          any financial outcome. Premium content remains opinion-based.
        </p>
      </div>

      <div className={styles.section}>
        <h2>4. Not a Bookmaker or Payment Provider</h2>
        <p>
          SportyPredict does not accept bets, process wagers, or handle gambling
          transactions. Any transactions related to betting are executed on
          third-party platforms and are governed by those operators’ terms and
          licensing.
        </p>
      </div>

      <div className={styles.section}>
        <h2>5. Affiliate Links & Third-Party Operators</h2>
        <p>
          Our services may contain links to or promotions of third-party
          betting. operators. We are not responsible for the practices,
          licensing, or content of third-party sites. Verify third-party
          licensing and legality before engaging with external operators.
        </p>
      </div>

      <div className={styles.section}>
        <h2>6. Responsible Gambling & Help Resources</h2>
        <p>
          If you choose to gamble, do so responsibly. If you suspect gambling is
          causing harm or addiction, seek professional support. Example
          resources (region availability may vary):
        </p>
        <ul>
          <li>
            GamCare{" "}
            <a href="https://www.gamcare.org.uk" target="_blank">
              https://www.gamcare.org.uk
            </a>
          </li>
          <li>
            BeGambleAware{" "}
            <a href="https://www.begambleaware.org" target="_blank">
              https://www.begambleaware.org
            </a>
          </li>
          <li>
            Gamblers Anonymous{" "}
            <a href="https://www.gamblersanonymous.org" target="_blank">
              https://www.gamblersanonymous.org
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>7. No Professional Advice</h2>
        <p>
          Our content does not constitute financial, legal or professional advice.
          Consult qualified professionals for such matters.
        </p>
      </div>

      <div className={styles.section}>
        <h2>8. Limitation of Liability</h2>
        <p>
          To the extent permitted by law, SportyPredict and its operators disclaim
          liability for any losses, damages or costs arising from your use of or
          reliance on the content.
        </p>
      </div>

      <div className={styles.section}>
        <h2>9. Contact</h2>
        <p>
          If you have questions or want to report inaccurate content:{" "}
          <a href="mailto:contact@sportypredict.com">
            contact@sportypredict.com
          </a>
        </p>
      </div>
    </div>
  );
}
