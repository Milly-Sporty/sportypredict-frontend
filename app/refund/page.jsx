"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function RefundPolicy() {
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
        <h1>Refund & Cancellations Policy</h1>
      </div>

      <div className={styles.section}>
        <small>Updated in September 2025</small>
        <p>
          Applies to: Premium / VIP subscriptions, one-off digital purchases,
          trials and any paid features offered via the Service.
        </p>
      </div>

      <div className={styles.section}>
        <h2>1. Scope</h2>
        <p>
          This policy applies to all paid digital products offered through
          SportPredict, including recurring subscriptions (Premium / VIP),
          one-off purchases (reports, packs, special content). It explains
          eligibility for refunds, how to request them, and how refunds are
          processed.
        </p>
      </div>

      <div className={styles.section}>
        <h2>2. Core Principles</h2>
        <ul className={styles.bulletList}>
          <li>
            Paid content offered by SportyPredict is digital and informational
            in nature. Purchases grant access to exclusive predictions and
            content but do not guarantee outcomes.
          </li>
          <li>
            Subscriptions automatically renew until cancelled; cancellations
            stop future billing but typically do not prorate or refund the
            current paid period unless required by law or by this policy.
          </li>
          <li>
            Refunds are exceptional and issued only in alignment with this
            policy, consumer-protection law, or at our discretion.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>3. Cancellations & Auto-renewal</h2>
        <ul className={styles.bulletList}>
          <li>
            <strong>How to cancel:</strong> Subscribers may cancel auto-renewal
            via (Google Playstore or Apple AppStore).
          </li>
          <li>
            <strong>Effect of cancellation:</strong> Cancellation prevents
            future billing. Access to Premium content usually continues until
            the end of the paid billing period. We do not generally provide
            partial-period refunds for time already used unless otherwise
            stated.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>4. Refund Eligibility — When Refunds May Be Considered</h2>
        <p>
          We consider refund requests on a case-by-case basis. Common valid
          reasons include:
        </p>
        <ul className={styles.bulletList}>
          <li>Duplicate billing or obvious technical billing errors.</li>
          <li>
            Failure of Service access due to a verified technical issue on our
            side that prevented the purchaser from accessing paid content for a
            material portion of the purchased period.
          </li>
          <li>Unauthorized charges where fraud is proven.</li>
        </ul>
        <p>We do not generally refund for:</p>
        <ul className={styles.bulletList}>
          <li>Change of mind after content has been delivered and accessed.</li>
          <li>
            Disappointment with content results (predictions not successful).
          </li>
          <li>
            Failure to cancel prior to the next billing cycle (unless otherwise
            required by law).
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>5. How to Request a Refund</h2>
        <p>
          To request a refund, provide the following to{" "}
          <a href="mailto:contact@sportypredict.com">
            contact@sportypredict.com
          </a>
          :
        </p>
        <ul className={styles.bulletList}>
          <li>Your full name and account email;</li>
          <li>Transaction ID, payment date and amount (if available);</li>
          <li>
            A concise description of the issue and the remedy you seek (refund,
            partial refund, or account credit).
          </li>
        </ul>
        <p>
          We will acknowledge receipt within 3 business days and aim to resolve
          requests within 14 business days (longer if investigation is
          required). If more time is needed we will notify you of the expected
          timeframe.
        </p>
      </div>

      <div className={styles.section}>
        <h2>6. Processing Refunds</h2>
        <ul className={styles.bulletList}>
          <li>
            Approved refunds are processed through the original payment method
            where possible. Timing depends on your bank or payment provider and
            may take 5–15 business days to appear.
          </li>
          <li>
            For payments processed by a third-party payment provider (e.g.,
            Paystack), refunds are subject to that provider’s processing times
            and policies.
          </li>
          <li>
            In cases of in-app purchases made via Apple App Store or Google Play
            Store, refunds are handled by the platform — see section 8 below.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>7. Chargebacks & Disputes</h2>
        <ul className={styles.bulletList}>
          <li>
            If you file a chargeback with your bank or card issuer without first
            contacting us, your access may be suspended pending investigation,
            and we may seek recovery of funds, including legal remedies where
            appropriate.
          </li>
          <li>
            If you believe a charge was unauthorized or erroneous, please
            contact us immediately at{" "}
            <a href="mailto:contact@sportypredict.com">
              contact@sportypredict.com
            </a>{" "}
            so we can investigate and attempt to resolve the problem directly.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>8. In-App Purchases (Apple App Store / Google Play)</h2>
        <ul className={styles.bulletList}>
          <li>
            If you purchased subscriptions or digital content via an app store
            (Apple or Google), the platform’s billing system usually governs
            refunds:
          </li>
          <li>
            <strong>Apple App Store:</strong> Refunds and purchase issues are
            handled through Apple’s refund process (Report a Problem). We can
            assist with verification, but Apple controls the refund.
          </li>
          <li>
            <strong>Google Play:</strong> Similar — refunds are handled via
            Google Play’s support and refund mechanisms.
          </li>
          <li>
            For platform purchases, please follow the app-store refund flow
            first. If the platform refuses a refund and you believe the refusal
            is incorrect, contact us with evidence; we may escalate or provide a
            goodwill remedy at our discretion.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>9. Partial Refunds & Account Credits</h2>
        <p>
          We may, at our discretion, offer partial refunds, pro-rata refunds, or
          account credit as an alternative to a full refund depending on the
          circumstances (e.g., partial service outage). Any such offer is not an
          admission of liability.
        </p>
      </div>

      <div className={styles.section}>
        <h2>10. Taxes & Fees</h2>
        <p>
          Refunds do not generally include taxes or fees retained by payment
          processors or financial institutions. If applicable regional taxes
          were charged, refunded amounts will be adjusted according to tax law
          and processor rules.
        </p>
      </div>

      <div className={styles.section}>
        <h2>11. Legal Rights & Consumer Protection</h2>
        <p>
          This policy does not limit your statutory rights under applicable
          consumer-protection laws. Where local law provides stronger rights
          (e.g., mandatory refund periods), we comply with such law.
        </p>
      </div>

      <div className={styles.section}>
        <h2>12. Fraud Prevention & Abuse</h2>
        <p>
          We reserve the right to refuse refunds where fraud, abuse, or pattern
          misuse is suspected (e.g., serial refunds, account sharing to
          circumvent subscription rules).
        </p>
      </div>

      <div className={styles.section}>
        <h2>13. Changes to the Policy</h2>
        <p>
          We may update this Refund & Cancellations Policy. Material changes
          will be posted at{" "}
          <a href="https://sportypredict.com/">SportyPredict.com</a> with an
          updated effective date.
        </p>
      </div>

      <div className={styles.section}>
        <h2>14. Contact & Escalation</h2>
        <p>
          For all refund or billing inquiries:
          <br />
          Email:{" "}
          <a href="mailto:contact@sportypredict.com">
            contact@sportypredict.com
          </a>
        </p>
        <p>
          When contacting us, include as much information as possible
          (transaction ID, account email, screenshots, and a clear description
          of the issue) to speed resolution.
        </p>
        <p>
          If you are unsatisfied with our resolution and you are located in a
          jurisdiction that offers a consumer-protection authority (such as
          Kenya’s relevant authority), you may escalate the complaint to the
          appropriate body after exhausting our internal process.
        </p>
      </div>
    </div>
  );
}
