"use client";

import { toast } from "sonner";
import Nothing from "@/app/components/Nothing";
import { useNewsStore } from "@/app/store/News";
import NewsCard from "@/app/components/NewsCard";
import Dropdown from "@/app/components/Dropdown";
import Breadcrumb from "@/app/components/Breadcrumb";
import styles from "@/app/style/blog.module.css";
import LoadingLogo from "@/app/components/LoadingLogo";
import EmptyNewsImg from "@/public/assets/emptynews.png";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";

export default function SportsNews() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    articles,
    loading,
    error,
    categories,
    fetchArticles,
    fetchNewsByCategory,
    searchNews,
    clearError,
  } = useNewsStore();

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
    return post.authorName || post.author?.username || "Unknown Author";
  };

  const getFormattedDate = (post) => {
    return (
      post.formattedDate ||
      new Date(post.publishDate || post.createdAt).toLocaleDateString()
    );
  };

  const getReadTime = (post) => {
    return post.readTime || "5 min read";
  };

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const createShareUrl = (post) => {
    const slug = createSlug(post.title);
    return `${window.location.origin}/news/${slug}`;
  };

  const loadData = useCallback(
    async (category = "", search = "") => {
      setIsSearching(true);
      try {
        if (search && search.trim() !== "") {
          await searchNews(search.trim());
        } else if (category && category !== "") {
          await fetchNewsByCategory(category);
        } else {
          await fetchArticles();
        }
      } catch (err) {
        toast.error("Failed to load articles");
      } finally {
        setIsSearching(false);
      }
    },
    [fetchArticles, fetchNewsByCategory, searchNews]
  );

  const handleNewsNavigation = useCallback((post) => {
    const slug = createSlug(post.title);
    router.push(`/news/${slug}`);
  }, [router, createSlug]);

  const debouncedSearch = useCallback(
    (query) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        loadData("", query);
      }, 300);
    },
    [loadData]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await loadData();
        initialLoadRef.current = false;
      } catch (err) {
        toast.error("Failed to load initial news data");
      }
    };

    if (initialLoadRef.current) {
      loadInitialData();
    }
  }, [loadData]);


  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else if (searchQuery === "") {
      loadData(activeCategory, "");
    }
  }, [searchQuery, debouncedSearch, loadData, activeCategory]);

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

  const handleCategorySelect = (category) => {
    try {
      const newCategory = activeCategory === category.name ? "" : category.name;
      setActiveCategory(newCategory);

      if (searchQuery) {
        setSearchQuery("");
      }

      loadData(newCategory, "");
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
          text: post.summary || "Check out this sports news article",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Article link copied to clipboard");
      }
    } catch (err) {
      toast.error("Failed to share post");
    }
  };


  const renderNewsHeader = () => (
    <div className={styles.blogBanner}>
      <div className={styles.blogHeader}>
        <div className={styles.blogContent}>
          <h1>Sports News</h1>
          <p>Your ultimate source for sports news and updates</p>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={handleSearchInput}
            aria-label="Search news"
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

  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      if (searchQuery) return `No news found for "${searchQuery}"`;
      if (activeCategory)
        return `No news found in "${activeCategory}" category`;
      return "No news available";
    };

    return (
      <div className={styles.blogContainer}>
        {renderNewsHeader()}
        <div className={styles.nothingContainer}>
          <Nothing
            Alt="No news available"
            NothingImage={EmptyNewsImg}
            Text={getEmptyMessage()}
          />
        </div>
      </div>
    );
  };


  const categoryOptions = categories.map((category) => ({
    name: category,
    code: category,
  }));

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "News", href: null },
  ];

  if (activeCategory) {
    breadcrumbItems.push({ label: formatCategory(activeCategory), href: null });
  }

  if ((loading || isSearching) && articles.length === 0) {
    return (
      <div className={styles.nothingContainer}>
        <LoadingLogo />
      </div>
    );
  }

  if (articles.length === 0 && !loading && !isSearching) {
    return renderEmptyState();
  }

  return (
    <div className={styles.blogContainer}>
      {renderNewsHeader()}
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.dropdownContainerWp}>
        <h2>Latest Sports News</h2>
        <div className={styles.dropdownContainerInner}>
          <Dropdown
            options={categoryOptions}
            onSelect={handleCategorySelect}
            dropPlaceHolder={activeCategory || "All Categories"}
          />
        </div>
      </div>

      <div className={styles.blogMainContent}>
        {loading || isSearching ? (
          <div className={styles.nothingContainer}>
            <LoadingLogo />
          </div>
        ) : (
          <div className={styles.articlesContent}>
            {articles.map((post) => (
              <NewsCard
                key={post._id}
                post={post}
                onReadMore={handleNewsNavigation}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
