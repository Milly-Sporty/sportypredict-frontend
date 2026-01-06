"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import LogoImg from "@/public/assets/logoWhite.png";
import styles from "@/app/style/footer.module.css";
import { usePredictionStore } from "@/app/store/Prediction";

import {
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaPhone,
  FaInstagram,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { PiTelegramLogoDuotone as TelegramIcon } from "react-icons/pi";

export default function Footer() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const phoneNumber = "+254703147237";
  const currentYear = new Date().getFullYear();
  const { predictions } = usePredictionStore();

  // Get today's date for dynamic prediction links
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Calculate top 4 most popular leagues dynamically
  const topLeagues = useMemo(() => {
    if (!predictions || predictions.length === 0) return [];

    // Count predictions per league
    const leagueCounts = {};
    predictions.forEach((pred) => {
      if (pred.league && pred.category) {
        const key = `${pred.category}|${pred.league}`;
        if (!leagueCounts[key]) {
          leagueCounts[key] = {
            league: pred.league,
            category: pred.category,
            count: 0,
          };
        }
        leagueCounts[key].count++;
      }
    });

    // Sort by count and get top 4
    return Object.values(leagueCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [predictions]);

  const openSocialMedia = (url) => {
    window.open(url, "_blank");
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    if (message.trim() !== "") {
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
      setMessage("");
      toast.success("Redirecting to WhatsApp...");
    } else {
      toast.error("Please write a message");
    }
  };

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footerContainer}>
        <div className={styles.mainSection}>
          <div className={styles.brandSection}>
            <Image
              className={styles.logo}
              src={LogoImg}
              alt="SportyPredict Logo"
              height={60}
              priority={true}
            />
            <p className={styles.brandDesc}>
              Professional sports predictions and expert analysis across
              football, basketball, tennis, and more.
            </p>
          </div>

          <div className={styles.linksSection}>
            {/* Column 1: Sport Predictions */}
            <div className={styles.linkColumn}>
              <h4>Sport Predictions</h4>
              <Link href={`/football/${today}`} title="Today's Football Predictions">
                Football Predictions
              </Link>
              <Link href={`/basketball/${today}`} title="Today's Basketball Predictions">
                Basketball Predictions
              </Link>
              <Link href={`/tennis/${today}`} title="Today's Tennis Predictions">
                Tennis Predictions
              </Link>
              <Link href={`/bet-of-the-day/${today}`} title="Today's Bet of the Day">
                Bet of the Day
              </Link>
            </div>

            {/* Column 2: Content & Resources */}
            <div className={styles.linkColumn}>
              <h4>Content & Resources</h4>
              <Link href="/news" title="Latest Sports News">
                Sports News
              </Link>
              <Link href="/blog" title="Sports Betting Tips & Analysis">
                Sports Blog
              </Link>
              <Link href="/vip" title="VIP Predictions & Premium Tips">
                VIP Predictions
              </Link>
              <Link href="/offers" title="Special Offers & Promotions">
                Special Offers
              </Link>
            </div>

            {/* Column 3: Popular Leagues */}
            <div className={styles.linkColumn}>
              <h4>Popular Leagues</h4>
              {topLeagues.length > 0 ? (
                topLeagues.map((item, index) => {
                  // Extract display name (remove country prefix if present)
                  const displayName = item.league.includes(", ")
                    ? item.league.split(", ").slice(1).join(", ")
                    : item.league;

                  return (
                    <Link
                      key={index}
                      href={`/${item.category}/${today}/${encodeURIComponent(
                        item.league
                      )}`}
                      title={`${displayName} Predictions`}
                    >
                      {displayName}
                    </Link>
                  );
                })
              ) : (
                <>
                  <Link href={`/football/${today}`} title="Football Predictions">
                    Football
                  </Link>
                  <Link
                    href={`/basketball/${today}`}
                    title="Basketball Predictions"
                  >
                    Basketball
                  </Link>
                  <Link href={`/tennis/${today}`} title="Tennis Predictions">
                    Tennis
                  </Link>
                  <Link
                    href={`/bet-of-the-day/${today}`}
                    title="Bet of the Day"
                  >
                    Bet of the Day
                  </Link>
                </>
              )}
            </div>

            {/* Column 4: Company & Support */}
            <div className={styles.linkColumn}>
              <h4>Company & Support</h4>
              <Link href="/about" title="About SportyPredict">
                About Us
              </Link>
              <Link href="/contact" title="Contact SportyPredict">
                Contact Us
              </Link>
              <Link href="/payment" title="How to Pay for VIP">
                How to Pay
              </Link>
              <div className={styles.contactInfo}>
                <span
                  onClick={() =>
                    openSocialMedia(
                      "https://wa.me/+254703147237?text=Hi SportyPredict, I want to buy VIP subscription"
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  <FaPhone /> +254703147237
                </span>
                <span>
                  <FaEnvelope /> contact@sportypredict.com
                </span>
              </div>
            </div>

            {/* Column 5: Legal */}
            <div className={styles.linkColumn}>
              <h4>Legal</h4>
              <Link href="/terms" title="Terms & Conditions">
                Terms & Conditions
              </Link>
              <Link href="/privacy" title="Privacy Policy">
                Privacy Policy
              </Link>
              <Link href="/refund" title="Refund Policy">
                Refund Policy
              </Link>
              <Link href="/disclaimer" title="Disclaimer">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <form onSubmit={handleWhatsAppSubmit} className={styles.whatsappForm}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send us a WhatsApp message..."
              className={styles.whatsappInput}
            />
            <button type="submit" className={styles.whatsappButton}>
              <FaWhatsapp />
            </button>
          </form>

          {/* Social Media */}
          <div className={styles.socialSection}>
            <div className={styles.socialLinks}>
              <button
                className={`${styles.socialButton} ${styles.facebook}`}
                onClick={() =>
                  openSocialMedia(
                    "https://www.facebook.com/profile.php?id=100093225097104&mibextid=LQQJ4d"
                  )
                }
              >
                <FaFacebookF />
              </button>
              <button
                className={`${styles.socialButton} ${styles.whatsapp}`}
                onClick={() =>
                  openSocialMedia(
                    "https://whatsapp.com/channel/0029VaADp5iL7UVSqjrKVw2h"
                  )
                }
              >
                <FaWhatsapp />
              </button>
              <button
                className={`${styles.socialButton} ${styles.twitter}`}
                onClick={() =>
                  openSocialMedia(
                    "https://twitter.com/sportypredict?s=21&t=ordgrMn8HjrBLUy3PdpsBA"
                  )
                }
              >
                <FaXTwitter />
              </button>
              <button
                className={`${styles.socialButton} ${styles.instagram}`}
                onClick={() =>
                  openSocialMedia(
                    "https://instagram.com/sportypredict_?igshid=MTIzZWMxMTBkOA=="
                  )
                }
              >
                <FaInstagram />
              </button>
              <button
                className={`${styles.socialButton} ${styles.youtube}`}
                onClick={() =>
                  openSocialMedia("https://www.youtube.com/@Sportypredict")
                }
              >
                <FaYoutube />
              </button>
              <button
                className={`${styles.socialButton} ${styles.telegram}`}
                onClick={() => openSocialMedia("https://t.me/sportyPredictTG")}
              >
                <TelegramIcon />
              </button>
              <button
                className={`${styles.socialButton} ${styles.tiktok}`}
                onClick={() =>
                  openSocialMedia(
                    "https://www.tiktok.com/@sportypredict?_t=8dxjShAnRI5&_r=1"
                  )
                }
              >
                <FaTiktok />
              </button>
            </div>
            <div className={styles.appButtons}>
              <button
                className={styles.appButton}
                onClick={() =>
                  openSocialMedia("https://apps.apple.com/app/id6752551522")
                }
              >
                <FaApple className={styles.appIcon} />
                <div className={styles.appText}>
                  <span className={styles.appPlatform}>Download Now</span>
                  <span className={styles.comingSoon}>Available</span>
                </div>
              </button>
              <button
                className={styles.appButton}
                onClick={() =>
                  openSocialMedia(
                    "https://play.google.com/store/apps/details?id=com.sportypredict.sportypredict"
                  )
                }
              >
                <FaGooglePlay className={styles.appIcon} />
                <div className={styles.appText}>
                  <span className={styles.appPlatform}>Download Now</span>
                  <span className={styles.comingSoon}>Available</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <span>© {currentYear} SportyPredict. All rights reserved.</span>
        <div className={styles.bottomLinks}>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
