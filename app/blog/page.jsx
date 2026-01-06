"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Nothing from "@/app/components/Nothing";
import { useBlogStore } from "@/app/store/Blog";
import styles from "@/app/style/blog.module.css";
import LoadingLogo from "@/app/components/LoadingLogo";
import BlogCard from "@/app/components/BlogCard";
import Breadcrumb from "@/app/components/Breadcrumb";
import EmptyBlogImage from "@/public/assets/emptyblog.png";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";

export default function Blog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    blogs,
    featuredBlogs,
    categories: storeCategories,
    singleBlog,
    loading,
    error,
    fetchBlogs,
    fetchFeaturedBlogs,
    fetchCategories,
    fetchSingleBlog,
  } = useBlogStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeoutRef = useRef(null);
  const initialLoadRef = useRef(true);

  const createSlug = useCallback((title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

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

  const createShareUrl = (post) => {
    const slug = createSlug(post.title);
    return `${window.location.origin}/blog/${slug}`;
  };

  const performSearch = useCallback(
    async (category = "", tag = "", query = "") => {
      setIsSearching(true);
      try {
        await fetchBlogs(category, tag, query);
      } catch (err) {
        toast.error("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [fetchBlogs]
  );

  const handleBlogNavigation = useCallback((post) => {
    const slug = createSlug(post.title);
    router.push(`/blog/${slug}`);
  }, [router, createSlug]);

  const debouncedSearch = useCallback(
    (query) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        performSearch("", "", query);
      }, 300);
    },
    [performSearch]
  );

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchBlogs(),
          fetchFeaturedBlogs(),
          fetchCategories(),
        ]);
        initialLoadRef.current = false;
      } catch (err) {
        toast.error("Failed to load initial blog data");
      }
    };

    if (initialLoadRef.current) {
      loadInitialData();
    }
  }, [fetchBlogs, fetchCategories, fetchFeaturedBlogs]);


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else if (searchQuery === "") {
      performSearch(activeCategory, "", "");
    }
  }, [searchQuery, debouncedSearch, performSearch, activeCategory]);

  useEffect(() => {
    if (activeCategory && !searchQuery) {
      performSearch(activeCategory, "", "");
    }
  }, [activeCategory, performSearch, searchQuery]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    try {
      if (activeCategory === category) {
        setActiveCategory("");
        performSearch("", "", searchQuery);
      } else {
        setActiveCategory(category);
        if (searchQuery) {
          setSearchQuery("");
        }
      }
    } catch (err) {
      toast.error("Failed to filter by category");
    }
  };

  const handleShare = async (post) => {
    try {
      const shareUrl = createShareUrl(post);

      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Blog link copied to clipboard");
      }
    } catch (err) {
      toast.error("Failed to share post");
    }
  };


  const openTelegram = () => {
    window.open("https://t.me/sportyPredictTG", "_blank");
  };

  const renderPostMeta = (post) => (
    <div className={styles.articleMeta}>
      <span>By {getAuthorName(post)}</span>
      <div className={styles.dateAndTime}>
        <span>{getFormattedDate(post)}</span>
      </div>
    </div>
  );

  const renderBlogHeader = () => (
    <div className={styles.blogBanner}>
      <div className={styles.blogHeader}>
        <div className={styles.blogContent}>
          <h1>Insights Blog</h1>
          <p>Expert insights, analysis and thoughts to educate and inform.</p>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={handleSearchInput}
            aria-label="Search blog posts"
            className={styles.searchInput}
          />
          <SearchIcon
            aria-label="search"
            alt="search"
            className={styles.searchIcon}
          />
        </div>
      </div>
    </div>
  );

  const renderTelegramSection = () => (
    <div className={styles.telegramContent}>
      <div className={styles.telegramCard}>
        <h2>Join Our Telegram Community</h2>
        <p>
          Get exclusive access to expert insights, premium content, and connect
          with fellow readers.
        </p>
        <button className={styles.telegramButton} onClick={openTelegram}>
          Join us
        </button>
      </div>
    </div>
  );

  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      if (searchQuery) return `No blog posts found for "${searchQuery}"`;
      if (activeCategory)
        return `No blog posts found in "${activeCategory}" category`;
      return "No blog posts available";
    };

    return (
      <div className={styles.blogContainer}>
        {renderBlogHeader()}
        <div className={styles.nothingContainer}>
          <Nothing
            Alt="No blog posts"
            NothingImage={EmptyBlogImage}
            Text={getEmptyMessage()}
          />
        </div>
        {renderTelegramSection()}
      </div>
    );
  };


  const featuredPost = featuredBlogs.length > 0 ? featuredBlogs[0] : null;
  const categories = storeCategories.map((cat) => cat.name || cat);

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: null },
  ];

  if (activeCategory) {
    breadcrumbItems.push({ label: activeCategory, href: null });
  }

  if (loading && blogs.length === 0 && !featuredPost && !isSearching) {
    return <LoadingLogo />;
  }

  if (blogs.length === 0 && !featuredPost && !loading && !isSearching) {
    return renderEmptyState();
  }

  return (
    <div className={styles.blogContainer}>
      {renderBlogHeader()}
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category)}
            className={`${styles.categoryCard} ${
              activeCategory === category ? styles.activeCategory : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.categoriesInnerContainer}>
        {featuredPost && !searchQuery && !activeCategory && (
          <div className={styles.featuredArticle}>
            <div className={styles.featuredImageWrapper}>
              <Image
                className={styles.featuredImage}
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                sizes="100%"
                quality={100}
                style={{ objectFit: "cover" }}
                priority={true}
              />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.category}>{featuredPost.category}</div>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              {renderPostMeta(featuredPost)}
              <button
                onClick={() => handleBlogNavigation(featuredPost)}
                className={styles.readMoreBtn}
              >
                Read Full Article
              </button>
            </div>
          </div>
        )}

        <div className={styles.blogMainContent}>
          <h2>Latest Blog Posts</h2>

          {isSearching ? (
            <div className={styles.nothingContainer}>
              <LoadingLogo />
            </div>
          ) : (
            <div className={styles.articlesContent}>
              {blogs.map((post) => (
                <BlogCard
                  key={post._id}
                  post={post}
                  onReadMore={handleBlogNavigation}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {renderTelegramSection()}
    </div>
  );
}
