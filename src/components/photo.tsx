import Image from "next/image";
import { getPhoto } from "@/lib/photos";

/**
 * Fills its (relatively positioned) parent with the photo registered for
 * `label`, or a labelled gradient placeholder when there isn't one yet.
 */
export function Photo({
  label,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority,
  className = "",
}: {
  label: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = getPhoto(label);

  if (photo) {
    return (
      <Image
        src={`/photos/${photo.key}.jpg`}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 flex items-end justify-start bg-gradient-to-br from-deep2/90 via-deep/70 to-terra/40 ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="m-3 rounded-full bg-deep/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-od/70 backdrop-blur">
        {label}
      </span>
    </div>
  );
}
