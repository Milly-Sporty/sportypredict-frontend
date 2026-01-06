import Link from "next/link";
import Image from "next/image";
import { IoMdShare } from "react-icons/io";
import styles from "@/app/style/newsCard.module.css";

export default function NewsCard({ post, onReadMore, onShare }) {
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(post);
    }
  };

  // Create slug from title
  const createSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const slug = createSlug(post.title);
  const newsUrl = `/news/${slug}`;
  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Link
      href={newsUrl}
      className={styles.articleCard}
      title={`${post.title} - ${formatCategory(post.category)}`}
    >
      <div className={styles.articleImageWrapper}>
        <Image
          className={styles.articleImage}
          src={post.image}
          alt={post.title}
          fill
          sizes="100%"
          quality={100}
          style={{
            objectFit: "cover",
          }}
          priority={true}
        />
        <div className={styles.dateAndTime}>
          <span>
            {post.formattedDate ||
              new Date(post.publishDate || post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className={styles.articleContent}>
        <div className={styles.articleHeader}>
          <span>{formatCategory(post.category)}</span>
          <IoMdShare
            onClick={handleShare}
            className={styles.shareIcon}
            alt="Share icon"
            aria-label="Share icon"
          />
        </div>
        <h3>{post.title} <div className={styles.readMoreBtn}>
            Read More
          </div></h3>
      </div>
    </Link>
  );
}
