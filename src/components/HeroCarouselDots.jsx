import { useEffect, useMemo, useState } from "react";

const AUTOPLAY_DURATION_MS = 10000;

function getVisibleCount(totalSlides) {
  return Math.max(1, totalSlides);
}

export default function HeroCarouselDots({
  activeIndex = 2,
  className = "",
  totalSlides = 8,
}) {
  const visibleCount = getVisibleCount(totalSlides);
  const normalizedInitialIndex = Math.max(0, Math.min(activeIndex, visibleCount - 1));
  const [currentIndex, setCurrentIndex] = useState(normalizedInitialIndex);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    setCurrentIndex(normalizedInitialIndex);
    setCycleKey((current) => current + 1);
  }, [normalizedInitialIndex]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCurrentIndex((current) => (current + 1) % visibleCount);
      setCycleKey((current) => current + 1);
    }, AUTOPLAY_DURATION_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentIndex, cycleKey, visibleCount]);

  const dots = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, index) => ({
        index,
        active: index === currentIndex,
      })),
    [currentIndex, visibleCount],
  );

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setCycleKey((current) => current + 1);
  };

  return (
    <div
      aria-label="Carousel pagination preview"
      className={`hero-carousel-dots ${className}`.trim()}
      role="group"
    >
      <div className="hero-carousel-dots__inner">
        {dots.map((dot) => (
          <button
            aria-label={`Go to slide ${dot.index + 1}`}
            aria-pressed={dot.active}
            className={[
              "hero-carousel-dots__dot",
              "hero-carousel-dots__dot--md",
              dot.active ? "hero-carousel-dots__dot--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={`hero-carousel-dot-${dot.index}`}
            onClick={() => handleDotClick(dot.index)}
            type="button"
          >
            <span
              className="hero-carousel-dots__dotInner"
              key={dot.active ? `hero-carousel-dot-inner-${dot.index}-${cycleKey}` : undefined}
              style={
                dot.active
                  ? { animationDuration: `${AUTOPLAY_DURATION_MS}ms` }
                  : undefined
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}
