"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import styles from "@/app/style/relatedBlogPosts.module.css";
import { useBlogStore } from "@/app/store/Blog";

export default function RelatedBlogPosts({ currentBlog }) {
  const { blogs } = useBlogStore();

  const createSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const relatedPosts = useMemo(() => {
    if (!currentBlog || !blogs || blogs.length === 0) {
      return [];
    }

    // Filter out the current blog post
    const otherPosts = blogs.filter((post) => post._id !== currentBlog._id);

    if (otherPosts.length === 0) {
      return [];
    }

    // Priority-based scoring
    const scorePost = (post) => {
      let score = 0;

      // Priority 1: Same category (highest priority)
      if (
        post.category &&
        currentBlog.category &&
        post.category.toLowerCase() === currentBlog.category.toLowerCase()
      ) {
        score += 100;
      }

      // Priority 2: Overlapping tags
      if (
        post.tags &&
        currentBlog.tags &&
        Array.isArray(post.tags) &&
        Array.isArray(currentBlog.tags)
      ) {
        const currentTags = currentBlog.tags.map((t) => t.toLowerCase());
        const postTags = post.tags.map((t) => t.toLowerCase());
        const commonTags = currentTags.filter((tag) => postTags.includes(tag));
        score += commonTags.length * 30; // 30 points per matching tag
      }

      // Priority 3: Recent posts (published date)
      if (post.publishedAt || post.createdAt) {
        const postDate = new Date(post.publishedAt || post.createdAt);
        const daysSincePublished = Math.floor(
          (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        // Newer posts get higher score (max 20 points, decreasing over time)
        score += Math.max(0, 20 - daysSincePublished / 10);
      }

      return score;
    };

    // Sort by priority score and take top 4
    const sorted = otherPosts
      .map((post) => ({ ...post, priorityScore: scorePost(post) }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 4);

    return sorted;
  }, [currentBlog, blogs]);

  if (relatedPosts.length === 0) {
    return null;
  }

  const getAuthorName = (post) => {
    return post.author || "SportyPredict";
  };

  const getFormattedDate = (post) => {
    return (
      post.formattedDate ||
      new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  };

  const getReadTime = (post) => {
    return post.readTime || "5 min read";
  };

  return (
    <div className={styles.relatedContainer}>
      <h3 className={styles.relatedTitle}>Related Articles</h3>
      <div className={styles.relatedGrid}>
        {relatedPosts.map((post) => {
          const slug = createSlug(post.title);
          const postUrl = `/blog/${slug}`;
          const anchorText = `${post.title} - ${post.category}`;

          return (
            <Link
              key={post._id}
              href={postUrl}
              title={anchorText}
              className={styles.relatedCard}
            >
              <div className={styles.imageContainer}>
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.cardImage}
                  />
                )}
                <div className={styles.categoryBadge}>{post.category}</div>
              </div>

              <div className={styles.cardContent}>
                <h4 className={styles.postTitle}>{post.title}</h4>

                {post.excerpt && (
                  <p className={styles.postExcerpt}>
                    {post.excerpt.substring(0, 100)}
                    {post.excerpt.length > 100 ? "..." : ""}
                  </p>
                )}

                <div className={styles.cardFooter}>
                  <div className={styles.authorInfo}>
                    <span className={styles.author}>
                      By {getAuthorName(post)}
                    </span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.date}>{getFormattedDate(post)}</span>
                  </div>
                  <span className={styles.readTime}>{getReadTime(post)}</span>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className={styles.tagsContainer}>
                    {post.tags.slice(0, 3).map((tag, index) => (
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
