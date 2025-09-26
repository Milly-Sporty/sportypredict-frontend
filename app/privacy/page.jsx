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
          This Privacy Policy explains how SportyPredict collects, uses,
          discloses and protects personal information in connection with: (a)
          the SportyPredict website (sportypredict.com) (&apos;the
          Website&apos;); and (b) the SportyPredict mobile application available
          on app stores (&apos;the App&apos;). Together these are referred to as
          our Services.
        </p>
        <p>
          Please read this policy carefully. If you do not agree with this
          Privacy Policy, please do not use our Services.
        </p>
      </div>

      <div className={styles.section}>
        <h2>1. Quick summary</h2>
        <ul className={styles.bulletList}>
          <li>
            <strong>Website:</strong> may collect personal data (email, name,
            counry) when you register, subscribe,
            contact us, or otherwise interact with the Website.
          </li>
          <li>
            <strong>App:</strong> currently does not collect personal data. The
            App provides content and in-app purchases via the app store; payment
            processing is handled by the app store (Apple / Google), not by us.
          </li>
          <li>
            <strong>One privacy policy:</strong> this single document covers
            both Website and App; sections below explain differences and how to
            exercise your rights.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>2. Data we may collect on the Website</h2>
        <p>
          When you interact with the Website, we may collect the following
          categories of personal information:
        </p>

        <h3>Account and contact information</h3>
        <ul className={styles.bulletList}>
          <li>
            Name, email address, username, profile data, and any other
            information you provide when registering or contacting support.
          </li>
        </ul>

        <h3>Billing and subscription data</h3>
        <ul className={styles.bulletList}>
          <li>
            Billing name and email address, tokenized payment reference (if you
            pay via our web checkout), subscription status and transaction
            metadata. (If you purchase via the App, the store processes payment
            and we only receive transaction metadata and subscription
            confirmation.)
          </li>
        </ul>

        <h3>Communications</h3>
        <ul className={styles.bulletList}>
          <li>
            Support requests, feedback, and other communications you send to us.
          </li>
        </ul>

        <h3>Technical & usage data</h3>
        <ul className={styles.bulletList}>
          <li>
            Operating system and version, browser type, pages visited,
            timestamps, session identifiers, referrer, and usage analytics.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>3. Data collected by the App (important)</h2>
        <ul className={styles.bulletList}>
          <li>
            The SportyPredict mobile App currently does not collect, store, or
            transmit personal data.
          </li>
          <li>
            The App does not require registration or collect contact details by
            default.
          </li>
          <li>
            If you make an in-app purchase (Premium/VIP), payment processing is
            handled by the App Store / Play Store; we do not receive payment
            card details from the store. We may receive transaction confirmation
            and subscription identifiers (Transaction ID) from the store so we
            can enable access to Premium features.
          </li>
        </ul>
        <p>
          If this behavior changes in future app releases (for example, if
          account creation is added), we will update this Privacy Policy and
          notify users where required.
        </p>
      </div>

      <div className={styles.section}>
        <h2>4. How we use personal data (Website)</h2>
        <p>We use personal data for the following purposes:</p>
        <ul className={styles.bulletList}>
          <li>
            To provide, operate and maintain the Website services and user
            accounts.
          </li>
          <li>
            To process payments and manage subscriptions (billing, receipts,
            refunds for web purchases).
          </li>
          <li>
            To send transactional communications (account notices, security
            alerts).
          </li>
          <li>
            To improve and personalize content and the user experience
            (analytics and product improvement).
          </li>
          <li>To respond to support requests and manage communications.</li>
          <li>
            To comply with legal obligations and protect rights and safety
            (fraud prevention, abuse investigations).
          </li>
        </ul>
        <p>
          <strong>Legal bases for processing</strong> (where applicable and
          dependent on your jurisdiction): contract performance (to deliver
          services), legitimate interests (service improvement, fraud
          prevention), consent (for marketing communications), and legal
          compliance.
        </p>
      </div>

      <div className={styles.section}>
        <h2>5. Cookies and tracking on the Website</h2>
        <p>We use cookies and similar technologies. Categories may include:</p>
        <ul className={styles.bulletList}>
          <li>
            <strong>Essential cookies:</strong> required for site functionality
            (login, session, security).
          </li>
          <li>
            <strong>Analytics cookies:</strong> to measure site usage, aggregate
            performance and improve the Website.
          </li>
          <li>
            <strong>Preference cookies:</strong> to remember language or display
            preferences.
          </li>
          <li>
            <strong>Advertising/measurement</strong> (if applicable): to measure
            campaign effectiveness.
          </li>
        </ul>
        <p>
          You can control cookies via your browser settings and any cookie
          banner / preference center we provide on the Website.
        </p>
      </div>

      <div className={styles.section}>
        <h2>6. Third-party services and processors</h2>
        <p>
          We use third-party service providers to run parts of the Website and
          our operations (hosting, analytics, email delivery, payment
          processors, customer support, and fraud prevention). These providers
          process data on our behalf under contractual obligations to protect
          your data.
        </p>
        <p>
          <strong>Important:</strong> For App purchases, the App Store / Play
          Store handles payment processing; please consult the store&apos;s
          privacy resources for details on how they handle your payment
          information.
        </p>
      </div>

      <div className={styles.section}>
        <h2>7. Data sharing and disclosure</h2>
        <p>We may disclose personal data:</p>
        <ul className={styles.bulletList}>
          <li>
            To service providers who help operate the Website (hosting,
            analytics, payment processors).
          </li>
          <li>
            To comply with legal obligations or respond to lawful requests from
            public authorities.
          </li>
          <li>
            To protect the rights, property or safety of SportyPredict, users or
            others.
          </li>
          <li>
            In connection with a corporate transaction (sale, merger,
            reorganization) — with notice and protections as required by law.
          </li>
        </ul>
        <p>We do not sell personal data.</p>
      </div>

      <div className={styles.section}>
        <h2>8. International transfers</h2>
        <p>
          Data collected via the Website may be processed in jurisdictions
          outside your country (for example, in the country where our service
          providers operate). Where data is transferred internationally, we use
          appropriate safeguards (contractual clauses, security measures) to
          protect personal data.
        </p>
      </div>

      <div className={styles.section}>
        <h2>9. Data retention</h2>
        <p>
          We retain personal data for as long as necessary to provide services,
          comply with legal obligations, resolve disputes, enforce our
          agreements, and for legitimate business purposes. Typical retention
          periods:
        </p>
        <ul className={styles.bulletList}>
          <li>
            <strong>Account data:</strong> while account is active + 2 years (or
            as required).
          </li>
          <li>
            <strong>Transaction records:</strong> up to 7 years for tax and
            accounting compliance.
          </li>
          <li>
            <strong>Analytics and logs:</strong> aggregated/anonymized
            indefinitely; raw logs retained for a limited period for security
            and troubleshooting.
          </li>
        </ul>
        <p>
          If you request deletion, we will remove your personal data unless
          retention is needed for legal compliance or to complete a transaction.
        </p>
      </div>

      <div className={styles.section}>
        <h2>10. Your rights and choices</h2>
        <p>Depending on your jurisdiction, you may have rights including:</p>
        <ul className={styles.bulletList}>
          <li>
            <strong>Access:</strong> request a copy of personal data held about
            you.
          </li>
          <li>
            <strong>Correction:</strong> request correction of inaccurate or
            incomplete data.
          </li>
          <li>
            <strong>Deletion:</strong> request deletion of personal data (right
            to be forgotten), subject to legal retention needs.
          </li>
          <li>
            <strong>Restriction or objection:</strong> restrict or object to
            certain processing (e.g., direct marketing).
          </li>
          <li>
            <strong>Portability:</strong> request export of personal data in a
            common, machine-readable format.
          </li>
          <li>
            <strong>Withdraw consent:</strong> where processing is based on
            consent (e.g., marketing cookies), you may withdraw consent at any
            time.
          </li>
        </ul>
        <p>
          To exercise these rights, contact us at the address below. We will
          respond in accordance with applicable law and within a reasonable time
          (typically within 30 days where required).
        </p>
      </div>

      <div className={styles.section}>
        <h2>11. How to make a data request or complaint</h2>
        <p>
          For access, correction, deletion, complaints or other privacy
          inquiries, contact:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:contact@sportypredict.com">
            contact@sportypredict.com
          </a>
          <br />
          <strong>Postal (optional):</strong> [Postal Address if any]
        </p>
        <p>
          If you are in Kenya or another jurisdiction with a data protection
          authority, you may also lodge a complaint with the relevant authority
          after contacting us.
        </p>
      </div>

      <div className={styles.section}>
        <h2>12. Security</h2>
        <p>
          We take reasonable technical and organizational measures to protect
          personal data against unauthorized access, loss or misuse (encryption,
          access controls, secure hosting). However, no method of transmission
          or storage is 100% secure. If a data breach occurs that risks user
          rights, we will notify affected users and authorities as required by
          law.
        </p>
      </div>

      <div className={styles.section}>
        <h2>13. Children&apos;s privacy</h2>
        <p>
          Our Services are not directed to children under 18. We do not
          knowingly collect personal data from minors. If we learn that we have
          collected personal data from someone under 18 without parental
          consent, we will delete it promptly.
        </p>
      </div>

      <div className={styles.section}>
        <h2>14. Links to other sites</h2>
        <p>
          The Website or App may contain links to third-party websites or
          services. This Privacy Policy does not apply to those sites. We are
          not responsible for third-party privacy practices; please review their
          privacy notices before providing personal data.
        </p>
      </div>

      <div className={styles.section}>
        <h2>15. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be posted on the Website with a revised Effective Date. If
          required by law or where we decide to be transparent, we will notify
          users of significant changes by email or in-app/website notices.
        </p>
      </div>

      <div className={styles.section}>
        <h2>16. Additional app store notes</h2>
        <ul className={styles.bulletList}>
          <li>
            The App currently does not collect personal data; the App Store /
            Play Store processes any in-app purchase payments.
          </li>
          <li>
            For refunds or billing questions related to in-app purchases, please
            follow the App Store / Google Play procedures. We can assist with
            verification when necessary.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>17. Contact</h2>
        <p>
          If you have questions about this Privacy Policy or privacy practices:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:contact@sportypredict.com">
            contact@sportypredict.com
          </a>
        </p>
      </div>
    </div>
  );
}