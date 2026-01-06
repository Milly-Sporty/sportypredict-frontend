import Link from "next/link";
import { IoHomeOutline, IoChevronForward } from "react-icons/io5";
import styles from "@/app/style/breadcrumb.module.css";

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  // Generate BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://sportypredict.com${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
        <ol className={styles.breadcrumbList}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <li key={index} className={styles.breadcrumbItem}>
                {!isLast && item.href ? (
                  <Link
                    href={item.href}
                    className={styles.breadcrumbLink}
                    title={item.label}
                  >
                    {isFirst && <IoHomeOutline className={styles.homeIcon} />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className={styles.breadcrumbCurrent} aria-current="page">
                    {isFirst && <IoHomeOutline className={styles.homeIcon} />}
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <IoChevronForward className={styles.separator} aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
