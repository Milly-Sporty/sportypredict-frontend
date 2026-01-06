"use client";

import Image from "next/image";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { notFound } from "next/navigation";
import { useNewsStore } from "@/app/store/News";
import styles from "@/app/style/blog.module.css";
import LoadingLogo from "@/app/components/LoadingLogo";
import Breadcrumb from "@/app/components/Breadcrumb";
import { useEffect, useState, useCallback } from "react";
import { FaFacebookF, FaInstagram, FaRegClock } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import RelatedNews from "@/app/components/RelatedNews";

export default function NewsArticlePage({ params }) {
  const { slug } = params;
  const { articles, fetchArticles } = useNewsStore();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  const createSlug = useCallback((title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  const findArticleBySlug = useCallback(
    (targetSlug) => {
      return articles.find((art) => createSlug(art.title) === targetSlug);
    },
    [articles, createSlug]
  );

  const getAuthorName = (article) => {
    return article.authorName || article.author?.username || "SportyPredict";
  };

  const getFormattedDate = (article) => {
    return (
      article.formattedDate ||
      new Date(article.publishDate || article.createdAt).toLocaleDateString()
    );
  };

  const getReadTime = (article) => {
    return article.readTime || "5 min read";
  };

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const createShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/news/${slug}`;
  }, [slug]);

  const handleSocialShare = async (platform) => {
    try {
      const shareUrl = createShareUrl();
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(
        `${article.title} - ${article.summary || "Sports News"}`
      );

      const socialUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        instagram: null,
      };

      if (platform === "instagram") {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Article link copied! You can now paste it on Instagram");
        return;
      }

      const socialShareUrl = socialUrls[platform];
      if (!socialShareUrl) {
        throw new Error("Unsupported platform");
      }

      window.open(socialShareUrl, "_blank", "width=600,height=400");
    } catch (err) {
      toast.error("Failed to share on social media");
    }
  };

  useEffect(() => {
    const loadNewsArticle = async () => {
      setLoading(true);
      try {
        // Ensure articles are loaded
        if (articles.length === 0) {
          await fetchArticles();
        }

        // Find the article by slug
        const foundArticle = findArticleBySlug(slug);

        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setNotFoundError(true);
        }
      } catch (error) {
        console.error("Failed to load news article:", error);
        toast.error("Failed to load news article");
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    };

    loadNewsArticle();
  }, [slug, articles, fetchArticles, findArticleBySlug]);

  if (loading) {
    return (
      <div className={styles.blogContainer}>
        <LoadingLogo />
      </div>
    );
  }

  if (notFoundError || !article) {
    notFound();
  }

  const renderSocialShareButtons = () => (
    <div className={styles.socialShareLinks}>
      {["facebook", "twitter", "instagram"].map((platform) => {
        const icons = {
          facebook: FaFacebookF,
          twitter: FaXTwitter,
          instagram: FaInstagram,
        };
        const Icon = icons[platform];

        return (
          <button
            key={platform}
            onClick={() => handleSocialShare(platform)}
            aria-label={`Share on ${platform}`}
            className={styles.socialIconBtn}
          >
            <Icon
              className={styles.socialIcon}
              alt={platform}
              aria-label={platform}
            />
          </button>
        );
      })}
    </div>
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    { label: formatCategory(article.category), href: `/news?category=${article.category}` },
    { label: article.title, href: null },
  ];

  return (
    <div className={styles.blogContainer}>
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles.sideSlideContent}>
        <div className={styles.sideSlideContentHeader}>
          {article.tags && article.tags.length > 0 && (
            <div className={styles.articleTags}>
              {article.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
          {renderSocialShareButtons()}
        </div>

        <div className={styles.sideSlideImageContainer}>
          <Image
            className={styles.sideSlideImage}
            src={article.image}
            alt={article.title}
            fill
            sizes="100%"
            quality={100}
            style={{ objectFit: "cover" }}
            priority={true}
          />
        </div>

        <div className={styles.sideSlideInnerContentDetails}>
          <div className={styles.SideSlideFooter}>
            <div className={styles.dateAndTime}>
              <span>
                <FaRegClock /> {getReadTime(article)}
              </span>
            </div>
            <span>{getFormattedDate(article)}</span>
          </div>
          <div className={styles.authorContainer}>
            <span className={styles.category}>
              {formatCategory(article.category)}
            </span>
            <span>By {getAuthorName(article)}</span>
          </div>
          <h1 className={styles.sideSlideTitle}>{article.title}</h1>
          <div
            className={styles.sideSlideInnerContent}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                article.content || article.summary
              ),
            }}
          />
        </div>
      </div>

      <RelatedNews currentArticle={article} />
    </div>
  );
}
