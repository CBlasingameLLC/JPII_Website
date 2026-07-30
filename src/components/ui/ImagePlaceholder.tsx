import Image from "next/image";
import { Cross } from "@/components/ui/Cross";
import { cn } from "@/lib/cn";

type ImagePlaceholderProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Replaces the design draft's <image-slot> prototype element. Until a real
 * photo exists, renders the navy-and-gold ornamental fallback the design
 * handoff specifies rather than stock photography ("a campus ministry site
 * with stock photos of strangers actively works against the message").
 * Same `src`/`alt` prop shape as next/image so swapping a real photo in
 * later is a one-line change.
 */
export function ImagePlaceholder({
  src,
  alt,
  className,
  sizes = "100vw",
  priority,
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-navy-deep",
        className
      )}
      role="img"
      aria-label={alt}
    >
      <Cross width={40} height={57} color="#C8A24B" className="opacity-70" />
    </div>
  );
}
