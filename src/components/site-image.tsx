import Image from "next/image";

/**
 * Real photo for an image slot. The parent element must be `position:
 * relative` (or `absolute`) with a defined size — same contract as the
 * PlaceholderImage it replaces.
 */
export function SiteImage({
  file,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  file: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={`/images/${file}`}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}
