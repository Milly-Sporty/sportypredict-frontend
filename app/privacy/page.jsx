"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function PrivacyPolicy() {
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
        <h1>Privacy Policy</h1>
      </div>

      <div className={styles.section}>
        <small>Updated in September 2025</small>
        <p>
          This Privacy Policy explains how we collect, use, disclose and protect
          personal data in connection with our services.
        </p>
      </div>

      <div className={styles.section}>
        <h2>1. Who Controls Your Data</h2>
        <p>
          The operators of SportyPredict control the processing of personal data
          collected via our services. For privacy requests contact{" "}
          <a href="mailto:contact@sportypredict.com">
            contact@sportypredict.com
          </a>
          .
        </p>
      </div>

      <div className={styles.section}>
        <h2>2. Data We Collect</h2>
        <h3>A. Data you provide:</h3>
        <ul className={styles.bulletList}>
          <li>Account registration data (name, email, username, password).</li>
          <li>
            Contact and billing details (email, billing address, payment tokens)
            when you subscribe or purchase Paid Features.
          </li>
          <li>Communications you send (support requests, feedback).</li>
        </ul>
        <h3>B. Automatically collected data:</h3>
        <ul className={styles.bulletList}>
          <li>
            Device and technical data (device type, operating system, browser,
            unique device identifiers).
          </li>
          <li>
            Usage data (pages viewed, features used, timestamps).
          </li>
          <li>IP address and approximate location derived from IP.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>3. How We Use Your Data (Purposes & Legal Bases)</h2>
        <ul className={styles.bulletList}>
          <li>To provide and maintain our services (performance of contract).</li>
          <li>
            To process payments and manage subscriptions (performance of
            contract).
          </li>
          <li>
            To personalize content and improve the Service (legitimate interest).
          </li>
          <li>
            To send transactional communications such as account notices and
            billing receipts (performance of contract / legitimate interest).
          </li>
          <li>
            To send marketing communications when you consent (consent). You may
            opt out at any time.
          </li>
          <li>
            To prevent fraud, abuse and to ensure security (legitimate interest
            / legal compliance).
          </li>
          <li>To comply with legal obligations (legal compliance).</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>4. Payments & Billing Data (Premium / VIP)</h2>
        <ul className={styles.bulletList}>
          <li>
            Payments are processed by third-party providers (e.g., Google
            Playstore, Skrill, Paystack). We may store minimal billing metadata
            (transaction ID, amount, date, subscription status) and tokenized
            identifiers. We do not store full card numbers unless explicitly
            disclosed and secured by certified processors.
          </li>
          <li>
            Transaction records are retained for tax, compliance and
            fraud-prevention purposes (generally up to 7 years or as required by
            law). Account metadata is kept while your account is active plus
            additional period as required.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>5. Sharing & Disclosure of Data</h2>
        <p>We may share data with:</p>
        <ul className={styles.bulletList}>
          <li>
            Service providers (hosting, analytics, payment processors,
            email/service providers) under contractual terms.
          </li>
          <li>
            Legal & safety — when required by law, regulation or to protect
            rights, safety or property.
          </li>
        </ul>
        <p>We do not sell personal data.</p>
      </div>

      <div className={styles.section}>
        <h2>6. International Transfers</h2>
        <p>
          Data may be processed outside your country of residence. Where
          transfers occur we apply appropriate safeguards (e.g., contractual
          clauses) to protect personal data.
        </p>
      </div>

      <div className={styles.section}>
        <h2>7. Data Retention & Deletion Requests</h2>
        <ul className={styles.bulletList}>
          <li>
            Personal data is retained as long as necessary to deliver the
            Service, for legal compliance, fraud prevention and dispute
            resolution.
          </li>
          <li>
            To request access, correction, restriction, deletion or portability
            of your personal data, contact{" "}
            <a href="mailto:contact@sportypredict.com">
              contact@sportypredict.com
            </a>
            . We will respond within 30 days or as required by law.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>8. Your Rights</h2>
        <p>
          Subject to local law, you may have rights to: access, delete, restrict
          or object to processing, and data portability. To exercise rights
          contact{" "}
          <a href="mailto:contact@sportypredict.com">contact@sportypredict.com</a>.
          You may also lodge a complaint with your local data protection
          authority.
        </p>
      </div>

      <div className={styles.section}>
        <h2>9. Security Measures</h2>
        <p>
          We implement reasonable technical and organizational measures (secure
          hosting, encryption, access controls). However, no system is perfectly
          secure and we cannot guarantee absolute security.
        </p>
      </div>

      <div className={styles.section}>
        <h2>10. Children’s Privacy</h2>
        <p>
          Our services are directed to children under 18. We do not knowingly
          collect data from minors. If such data is discovered, we will delete
          it promptly.
        </p>
      </div>

      <div className={styles.section}>
        <h2>11. Cookies & Tracking</h2>
        <ul className={styles.bulletList}>
          <li>Essential cookies: required for core functionality.</li>
          <li>
            Analytics cookies: help us measure and improve the Service (e.g.,
            Google Analytics).
          </li>
          <li>
            Advertising/affiliate cookies: used to serve and measure campaigns.
          </li>
        </ul>
        <p>
          You can manage cookie preferences via your browser or our cookie
          controls.
        </p>
      </div>

      <div className={styles.section}>
        <h2>12. Marketing Communications & Opt-Out</h2>
        <p>
          We may send promotional email if you consent. You may opt out at any
          time via the unsubscribe link or by contacting{" "}
          <a href="mailto:contact@sportypredict.com">contact@sportypredict.com</a>
          .
        </p>
      </div>

      <div className={styles.section}>
        <h2>13. Changes to this Privacy Policy</h2>
        <p>
          We may update the Privacy Policy periodically. Material changes will
          be posted with an updated effective date and, where required, notified
          to users.
        </p>
      </div>

      <div className={styles.section}>
        <h2>14. Contact for Privacy Requests</h2>
        <p>
          Email:{" "}
          <a href="mailto:contact@sportypredict.com">contact@sportypredict.com</a>
        </p>
      </div>
    </div>
  );
}
