"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function TermsConditions() {
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
        <h1>Terms & Conditions</h1>
      </div>

      <div className={styles.section}>
        <small>Updated in September 2025</small>
        <p>
          Service: SportyPredict — the sportypredict.com website and any related
          mobile applications (the “Service” or “Services”).
        </p>
      </div>

      <div className={styles.section}>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our services, you agree to these Terms &
          Conditions (“Terms”). If you do not agree with these terms, do not use
          our services.
        </p>
      </div>

      <div className={styles.section}>
        <h2>2. Eligibility & Age Requirement</h2>
        <ul className={styles.bulletList}>
          <li>
            You must be at least 18 years old, or the legal age of majority in
            your jurisdiction (whichever is higher), to access or use our
            services. By using SportyPredict you represent and warrant that you
            meet this requirement.
          </li>
          <li>
            If we become aware that personal data has been collected from a
            person under the required age, we will remove such data promptly.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>3. Nature of the Service / Non-operator Status</h2>
        <ul className={styles.bulletList}>
          <li>
            SportyPredict provides sports predictions, match previews,
            statistics, tips, analysis, editorial content and related
            informational services.
          </li>
          <li>
            Our service is for information and entertainment purposes only. We
            do not accept bets, handle deposits, process wagers, or act as a
            bookmaker. Any betting activity must occur on third-party platforms
            outside the Service.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>4. Premium / VIP Subscriptions (Paid Features)</h2>
        <h3>4.1 Description</h3>
        <p>
          We may offer paid subscription services (“Premium”, “VIP”,
          “Subscription” or “Paid Features”) that provide access to curated
          higher-probability selections, exclusive predictions, priority
          support, or other premium content or functionality.
        </p>
        <h3>4.2 Eligibility</h3>
        <p>
          You must be 18+ (or the legal age in your jurisdiction) to purchase or
          access Premium features. By subscribing you confirm you meet this
          requirement.
        </p>
        <h3>4.3 Billing, Auto-renewal & Payment</h3>
        <ul className={styles.bulletList}>
          <li>
            Subscriptions are billed in advance on a recurring basis (e.g.,
            monthly, quarterly, or yearly) according to the plan you select.
          </li>
          <li>
            Subscriptions automatically renew at the end of each billing period
            unless you cancel prior to renewal. By subscribing you authorize us
            and our payment processor to charge your chosen payment method.
          </li>
          <li>
            Payment processing is handled by third-party payment processors. We
            do not necessarily store full payment card numbers on our servers;
            tokenization and secure processors are used where available.
          </li>
        </ul>
        <h3>4.4 Cancellation, Refunds & Chargebacks</h3>
        <ul className={styles.bulletList}>
          <li>
            You may cancel auto-renewal at any time; cancellation prevents
            future billing but typically does not prorate or refund the current
            paid period unless required by law or our refund policy.
          </li>
          <li>
            Refunds are granted only in accordance with our{" "}
            <a href="https://sportypredict.com/refund">refund policy</a> or
            applicable consumer protection law. If you believe a billing error
            occurred contact us at contact@sportypredict.com promptly.
          </li>
          <li>
            Initiating a chargeback without first contacting us may lead to
            immediate suspension of access and recovery actions.
          </li>
        </ul>
        <h3>4.5 Access & Intellectual Property</h3>
        <ul className={styles.bulletList}>
          <li>
            Premium content remains our intellectual property (or licensed to
            the Service) and is provided to you for personal, non-commercial use
            only.
          </li>
          <li>
            You may not reproduce, publish, redistribute, sell, or share Premium
            predictions or content. Unauthorized sharing may result in
            suspension or permanent termination of access and potential legal
            action.
          </li>
        </ul>
        <h3>4.6 No Guarantee</h3>
        <p>
          Premium access provides curated or exclusive content but does not
          guarantee any outcomes. Premium content is still opinion-based and
          carries risk.
        </p>
        <h3>4.7 Termination for Misuse</h3>
        <p>
          We reserve the right to suspend or terminate Premium access where
          accounts are used fraudulently, share protected content, or otherwise
          violate these Terms.
        </p>
      </div>

      <div className={styles.section}>
        <h2>5. Affiliate Links, Advertising & Sponsored Content</h2>
        <ul className={styles.bulletList}>
          <li>
            Our services may contain affiliate links, sponsored content,
            advertisements, promotions or offers for third-party operators
            (including betting operators). Clicking an affiliate link may
            redirect you to a third-party site with its own terms and privacy
            practices.
          </li>
          <li>
            We may receive commissions or fees for referrals, clicks, or
            transactions completed through affiliate links. Affiliate
            relationships and sponsorships may be disclosed where required.
          </li>
          <li>
            You are responsible for verifying third-party licensing and legality
            in your jurisdiction before engaging with third-party services.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>6. User Accounts & Security</h2>
        <ul className={styles.bulletList}>
          <li>
            To use certain features you may create an account. You agree to
            provide accurate information and to keep your login credentials
            secure.
          </li>
          <li>
            You are responsible for all activities under your account. Notify us
            immediately if you suspect unauthorized access.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>7. Acceptable Use & Prohibited Conduct</h2>
        <p>You must not:</p>
        <ul className={styles.bulletList}>
          <li>
            Use bots, scrapers or automated tools that overload, damage or
            bypass the Service;
          </li>
          <li>
            Remove or alter any copyright, trademark or other proprietary
            notices from the Service;
          </li>
          <li>
            Impersonate others or attempt to gain unauthorized access to other
            accounts.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>8. Intellectual Property Rights</h2>
        <ul className={styles.bulletList}>
          <li>
            All content, software, designs, databases, and other materials on
            our services are owned or licensed by the operators at
            SportyPredict, and protected by copyright, trademark, and other
            laws.
          </li>
          <li>
            You may access and view content for personal, non-commercial use
            only. Any other use requires our express written consent.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>9. Accuracy of Information & No Warranties</h2>
        <ul className={styles.bulletList}>
          <li>
            We aim to provide accurate and timely content, but make no
            warranties as to the accuracy, completeness, timeliness or
            suitability of content. All predictions and tips are opinions and
            carry no guarantee.
          </li>
          <li>
            Our Services and its content are provided “as is” and “as
            available”.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>10. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, SportyPredict, its operators,
          Partners and affiliates are not liable for any direct, indirect,
          incidental, consequential, special, or exemplary damages (including
          loss of profits, data, or goodwill) arising from your use of our
          services or reliance on our content.
        </p>
      </div>

      <div className={styles.section}>
        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless SportyPredict and its
          operators from any claims, damages, losses, liabilities, costs, or
          expenses (including reasonable legal fees) that arise from your
          violation of these Terms or misuse of the Service.
        </p>
      </div>

      <div className={styles.section}>
        <h2>12. Third-party Sites & Links</h2>
        <p>
          Our services may link to third-party websites. Those sites have
          separate terms and privacy policies and we are not responsible for
          their content, policies or practices.
        </p>
      </div>

      <div className={styles.section}>
        <h2>13. Suspension & Termination</h2>
        <p>
          We may suspend or terminate access to our services (or any portion) at
          any time, with or without notice, for breach of these Terms or for
          operational reasons. Termination does not remove obligations incurred
          prior to termination.
        </p>
      </div>

      <div className={styles.section}>
        <h2>14. Changes to the Terms</h2>
        <p>
          We may revise these Terms at any time. Revised Terms take effect when
          posted. Continued use of our services following posting of revised
          Terms constitutes acceptance of the changes.
        </p>
      </div>

      <div className={styles.section}>
        <h2>15. Governing Law & Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws of Kenya (unless local law
          requires otherwise). Any dispute arising under these Terms shall be
          brought in the competent courts of Kenya, unless both parties agree to
          alternative dispute resolution.
        </p>
      </div>

      <div className={styles.section}>
        <h2>16. Contact Information</h2>
        <p>
          For questions, billing disputes, or legal notices: <br />
          Email:{" "}
          <a href="mailto:contact@sportypredict.com">
            contact@sportypredict.com
          </a>
        </p>
      </div>
    </div>
  );
}
