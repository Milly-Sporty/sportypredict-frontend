import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { IoMdShare } from "react-icons/io";
import { FaRegClock } from "react-icons/fa";
import styles from "@/app/style/articleCard.module.css";

export default function BlogCard({
  post,
  onReadMore,
  onShare,
  className = "",
}) {
  const handleImageError = () => {
    toast.error(`Failed to load image for: ${post.title}`);
  };

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
  const blogUrl = `/blog/${slug}`;

  return (
    <Link
      href={blogUrl}
      className={`${styles.articleCard} ${className}`}
      title={`${post.title} - ${post.category}`}
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

      </div>
      <div className={styles.articleContent}>
        <div className={styles.articleHeader}>
          <span>{post.category}</span>
          <IoMdShare
            onClick={handleShare}
            className={styles.shareIcon}
            alt="Share icon"
            aria-label="Share icon"
          />
        </div>
        <h3>
          {post.title}
          <div className={styles.readMoreBtnT}>
            Read More
          </div>
        </h3>
      </div>
    </Link>
  );
}
