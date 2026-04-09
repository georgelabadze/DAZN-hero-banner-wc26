import { useMemo } from "react";

const AUTOPLAY_DURATION_MS = 10000;

function getVisibleCount(totalSlides) {
  return Math.max(1, totalSlides);
}

export default function HeroCarousel({
  activeIndex = 0,
  autoplayMs = AUTOPLAY_DURATION_MS,
  className = "",
  cycleKey = 0,
  onSelect,
  totalSlides = 8,
}) {
  const visibleCount = getVisibleCount(totalSlides);
  const normalizedActiveIndex = Math.max(0, Math.min(activeIndex, visibleCount - 1));

  const dots = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, index) => ({
        index,
        active: index === normalizedActiveIndex,
      })),
    [normalizedActiveIndex, visibleCount],
  );

  return (
    <div
      aria-label="Carousel pagination preview"
      className={`hero-carousel ${className}`.trim()}
      role="group"
    >
      <div className="hero-carousel__track">
        {dots.map((dot) => (
          <button
            aria-label={`Go to slide ${dot.index + 1}`}
            aria-pressed={dot.active}
            className={[
              "hero-carousel__dot",
              dot.active ? "hero-carousel__dot--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={`hero-carousel-${dot.index}`}
            onClick={() => onSelect?.(dot.index)}
            type="button"
          >
            <span
              className="hero-carousel__dot-indicator"
              key={dot.active ? `hero-carousel-indicator-${dot.index}-${cycleKey}` : undefined}
              style={dot.active ? { animationDuration: `${autoplayMs}ms` } : undefined}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
