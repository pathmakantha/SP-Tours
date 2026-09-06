export function PlaceholderImage({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
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
