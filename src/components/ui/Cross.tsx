type CrossProps = {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
};

/** The JPII cross glyph, matching assets/cross.svg's path. Renders with `fill: currentColor` by default so it inherits text color, or pass `color` for a fixed value. */
export function Cross({ width = 17, height = 24, className, color }: CrossProps) {
  return (
    <svg
      viewBox="0 0 100 142"
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      style={color ? { color } : undefined}
    >
      <path
        d="M38,6 L62,6 L58,18 L58,40 L80,40 L92,34 L92,62 L80,56 L58,56 L58,124 L64,136 L36,136 L42,124 L42,56 L20,56 L8,62 L8,34 L20,40 L42,40 L42,18 Z"
        fill="currentColor"
      />
    </svg>
  );
}
