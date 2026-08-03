import Image from "next/image";
import { coverFor } from "@/lib/blog";

/**
 * Resolves to (in order): frontmatter `cover` → public/blog-covers/<slug>.png
 * → a gradient placeholder with the article's initial. Same rules for card
 * thumbnails and the article-page hero — pass a bigger `sizes` for the hero.
 */
export function ArticleCover({
  article,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  article: { slug: string; title: string; cover?: string };
  priority?: boolean;
  sizes?: string;
}) {
  const src = coverFor(article);
  if (src) {
    return (
      <Image
        src={src}
        alt={article.title}
        fill
        sizes={sizes}
        className="object-cover"
        unoptimized
        priority={priority}
      />
    );
  }
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card via-bg to-card"
    >
      <span className="display text-6xl sm:text-8xl text-accent/25 select-none">
        {article.title.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
