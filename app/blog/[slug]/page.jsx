"use client";

import Image from "next/image";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { notFound } from "next/navigation";
import { useBlogStore } from "@/app/store/Blog";
import styles from "@/app/style/blog.module.css";
import LoadingLogo from "@/app/components/LoadingLogo";
import Breadcrumb from "@/app/components/Breadcrumb";
import { useEffect, useState, useCallback } from "react";
import { FaFacebookF, FaInstagram, FaRegClock } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import RelatedBlogPosts from "@/app/components/RelatedBlogPosts";

export default function BlogPostPage({ params }) {
  const { slug } = params;
  const { blogs, featuredBlogs, fetchBlogs, fetchFeaturedBlogs, fetchSingleBlog } = useBlogStore();

  const [post, setPost] = useState(null);
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

  const findBlogBySlug = useCallback(
    (targetSlug) => {
      const allBlogs = [...blogs, ...featuredBlogs];
      return allBlogs.find((blog) => createSlug(blog.title) === targetSlug);
    },
    [blogs, featuredBlogs, createSlug]
  );

  const getAuthorName = (post) => {
    return post.author || post.author || "Unknown Author";
  };

  const getFormattedDate = (post) => {
    return (
      post.formattedDate ||
      new Date(post.publishedAt || post.createdAt).toLocaleDateString()
    );
  };

  const getReadTime = (post) => {
    return post.readTime || "5 min read";
  };

  const createShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/blog/${slug}`;
  }, [slug]);

  const handleSocialShare = async (platform) => {
    try {
      const shareUrl = createShareUrl();
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(`${post.title} - ${post.excerpt}`);

      const socialUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        instagram: null,
      };

      if (platform === "instagram") {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Blog link copied! You can now paste it on Instagram");
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
    const loadBlogPost = async () => {
      setLoading(true);
      try {
        if (blogs.length === 0 && featuredBlogs.length === 0) {
          await Promise.all([fetchBlogs(), fetchFeaturedBlogs()]);
        }
        let foundBlog = findBlogBySlug(slug);
        if (foundBlog && foundBlog._id) {
          try {
            const detailedPost = await fetchSingleBlog(foundBlog._id);
            foundBlog = detailedPost || foundBlog;
          } catch (fetchError) {
            console.error("Failed to fetch detailed blog:", fetchError);
          }
        }

        if (foundBlog) {
          setPost(foundBlog);
        } else {
          setNotFoundError(true);
        }
      } catch (error) {
        console.error("Failed to load blog post:", error);
        toast.error("Failed to load blog post");
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPost();
  }, [slug, blogs, featuredBlogs, fetchBlogs, fetchFeaturedBlogs, fetchSingleBlog, findBlogBySlug]);

  if (loading) {
    return (
      <div className={styles.blogContainer}>
        <LoadingLogo />
      </div>
    );
  }

  if (notFoundError || !post) {
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
    { label: "Blog", href: "/blog" },
    { label: post.category, href: `/blog?category=${post.category}` },
    { label: post.title, href: null },
  ];

  return (
    <div className={styles.blogContainer}>
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles.sideSlideContent}>
        <div className={styles.sideSlideContentHeader}>
          {post.tags && post.tags.length > 0 && (
            <div className={styles.articleTags}>
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
          {renderSocialShareButtons()}
        </div>

        <div className={styles.sideSlideImageContainer}>
          <Image
            className={styles.sideSlideImage}
            src={post.image}
            alt={post.title}
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
                <FaRegClock /> {getReadTime(post)}
              </span>
            </div>
            <span>{getFormattedDate(post)}</span>
          </div>
          <div className={styles.authorContainer}>
            <span className={styles.category}>{post.category}</span>
            <span>By {getAuthorName(post)}</span>
          </div>
          <h1 className={styles.sideSlideTitle}>{post.title}</h1>
          <div
            className={styles.sideSlideInnerContent}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.content),
            }}
          />
        </div>
      </div>

      <RelatedBlogPosts currentBlog={post} />
    </div>
  );
}
