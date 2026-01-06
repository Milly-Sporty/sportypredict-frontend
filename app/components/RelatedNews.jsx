"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import styles from "@/app/style/relatedNews.module.css";
import { useNewsStore } from "@/app/store/News";

export default function RelatedNews({ currentArticle }) {
  const { articles } = useNewsStore();

  const createSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const relatedArticles = useMemo(() => {
    if (!currentArticle || !articles || articles.length === 0) {
      return [];
    }

    // Filter out the current article
    const otherArticles = articles.filter(
      (article) => article._id !== currentArticle._id
    );

    if (otherArticles.length === 0) {
      return [];
    }

    // Priority-based scoring
    const scoreArticle = (article) => {
      let score = 0;

      // Priority 1: Same category (highest priority)
      if (
        article.category &&
        currentArticle.category &&
        article.category.toLowerCase() === currentArticle.category.toLowerCase()
      ) {
        score += 100;
      }

      // Priority 2: Overlapping tags
      if (
        article.tags &&
        currentArticle.tags &&
        Array.isArray(article.tags) &&
        Array.isArray(currentArticle.tags)
      ) {
        const currentTags = currentArticle.tags.map((t) => t.toLowerCase());
        const articleTags = article.tags.map((t) => t.toLowerCase());
        const commonTags = currentTags.filter((tag) =>
          articleTags.includes(tag)
        );
        score += commonTags.length * 30; // 30 points per matching tag
      }

      // Priority 3: Recent articles (published date)
      if (article.publishDate || article.createdAt) {
        const articleDate = new Date(article.publishDate || article.createdAt);
        const daysSincePublished = Math.floor(
          (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        // Newer articles get higher score (max 20 points, decreasing over time)
        score += Math.max(0, 20 - daysSincePublished / 10);
      }

      return score;
    };

    // Sort by priority score and take top 4
    const sorted = otherArticles
      .map((article) => ({ ...article, priorityScore: scoreArticle(article) }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 4);

    return sorted;
  }, [currentArticle, articles]);

  if (relatedArticles.length === 0) {
    return null;
  }

  const getAuthorName = (article) => {
    return (
      article.authorName || article.author?.username || "SportyPredict"
    );
  };

  const getFormattedDate = (article) => {
    return (
      article.formattedDate ||
      new Date(
        article.publishDate || article.createdAt
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  };

  const getReadTime = (article) => {
    return article.readTime || "5 min read";
  };

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className={styles.relatedContainer}>
      <h3 className={styles.relatedTitle}>Related News</h3>
      <div className={styles.relatedGrid}>
        {relatedArticles.map((article) => {
          const slug = createSlug(article.title);
          const articleUrl = `/news/${slug}`;
          const anchorText = `${article.title} - ${formatCategory(
            article.category
          )} News`;

          return (
            <Link
              key={article._id}
              href={articleUrl}
              title={anchorText}
              className={styles.relatedCard}
            >
              <div className={styles.imageContainer}>
                {article.image && (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.cardImage}
                  />
                )}
                <div className={styles.categoryBadge}>
                  {formatCategory(article.category)}
                </div>
              </div>

              <div className={styles.cardContent}>
                <h4 className={styles.articleTitle}>{article.title}</h4>

                {article.summary && (
                  <p className={styles.articleSummary}>
                    {article.summary.substring(0, 100)}
                    {article.summary.length > 100 ? "..." : ""}
                  </p>
                )}

                <div className={styles.cardFooter}>
                  <div className={styles.authorInfo}>
                    <span className={styles.author}>
                      By {getAuthorName(article)}
                    </span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.date}>
                      {getFormattedDate(article)}
                    </span>
                  </div>
                  <span className={styles.readTime}>
                    {getReadTime(article)}
                  </span>
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className={styles.tagsContainer}>
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
