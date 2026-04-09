import { useEffect, useRef, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import { useHeroGlow } from "../hooks/useHeroGlow";

const DESKTOP_BREAKPOINT = 1025;
const TABLET_BREAKPOINT = 768;
const DEFAULT_AUTOPLAY_MS = 10000;
const DEFAULT_TRANSITION_MS = 300;

function getViewportMode(width) {
  if (width >= DESKTOP_BREAKPOINT) {
    return "desktop";
  }

  if (width >= TABLET_BREAKPOINT) {
    return "tablet";
  }

  return "mobile";
}

function useViewportMode() {
  const [mode, setMode] = useState(() =>
    typeof window === "undefined" ? "desktop" : getViewportMode(window.innerWidth),
  );

  useEffect(() => {
    const handleResize = () => {
      const nextMode = getViewportMode(window.innerWidth);
      setMode((current) => (current === nextMode ? current : nextMode));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return mode;
}

function getHorizontalFocus(position) {
  const normalized = typeof position === "string" ? position.trim() : "";

  if (!normalized) {
    return "center";
  }

  const [firstToken = "center"] = normalized.split(/\s+/);

  if (firstToken === "top" || firstToken === "bottom") {
    return "center";
  }

  return firstToken;
}

function buildMediaStyle(position) {
  return {
    objectPosition: `${getHorizontalFocus(position)} top`,
  };
}

function renderPrice(price) {
  if (typeof price === "string") {
    return price;
  }

  return (
    <>
      {price.prefix ? (
        <span className="hero-banner__price-meta">{price.prefix}</span>
      ) : null}
      <span className="hero-banner__price-value">{price.value}</span>
      {price.oldPrice || price.suffix ? (
        <span className="hero-banner__price-trail">
          {price.oldPrice ? (
            <span className="hero-banner__price-meta hero-banner__price-meta--crossed">
              {price.oldPrice}
            </span>
          ) : null}
          {price.suffix ? (
            <span className="hero-banner__price-meta">{price.suffix}</span>
          ) : null}
        </span>
      ) : null}
    </>
  );
}

function renderTitle(title) {
  if (typeof title === "string") {
    return title;
  }

  return (
    <>
      {title.lead}{" "}
      <span className="hero-banner__title-accent">{title.accent}</span>
    </>
  );
}

function getSlideCtas(slide) {
  return [slide?.primaryCta, slide?.secondaryCta].filter(Boolean);
}

function getSlideClassName(viewportMode, slide, phase) {
  const layout = slide?.layout ?? {};

  return [
    "hero-banner__slide",
    `hero-banner--${viewportMode}`,
    layout.theme === "gold"
      ? "hero-banner--theme-gold"
      : "hero-banner--theme-standard",
    layout.titleSize === "large"
      ? "hero-banner--title-large"
      : "hero-banner--title-larger",
    viewportMode === "desktop" && layout.contentAlignment === "center"
      ? "hero-banner--align-center"
      : "",
    phase === "enter" ? "hero-banner__slide--entering" : "",
    phase === "exit" ? "hero-banner__slide--exiting" : "",
    phase === "current" ? "hero-banner__slide--current" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function HeroBannerSlide({
  mediaRefCallback,
  phase,
  slide,
  viewportMode,
}) {
  const activeMedia = slide?.media?.[viewportMode] ?? null;
  const ctas = getSlideCtas(slide);
  const contentClassName =
    viewportMode === "desktop"
      ? "hero-banner__content hero-banner__content--desktop"
      : "hero-banner__content hero-banner__content--compact";
  const mediaStyle = buildMediaStyle(slide?.focus?.[viewportMode]);
  const slideClassName = getSlideClassName(viewportMode, slide, phase);
  const shouldBindMediaRef = phase !== "exit";

  return (
    <div
      aria-hidden={phase === "exit" ? "true" : undefined}
      className={slideClassName}
    >
      <div aria-hidden className="hero-banner__scrim" />

      <div className="hero-banner__media">
        {activeMedia?.src ? (
          activeMedia.kind === "video" ? (
            <video
              ref={shouldBindMediaRef ? mediaRefCallback : undefined}
              aria-label={activeMedia.alt || undefined}
              autoPlay
              className={`hero-banner__video hero-banner__video--${viewportMode}`}
              crossOrigin="anonymous"
              loop
              muted
              playsInline
              poster={activeMedia.poster}
              preload="metadata"
              style={mediaStyle}
            >
              <source src={activeMedia.src} />
            </video>
          ) : (
            <img
              ref={shouldBindMediaRef ? mediaRefCallback : undefined}
              alt={activeMedia.alt ?? ""}
              className={`hero-banner__image hero-banner__image--${viewportMode}`}
              crossOrigin="anonymous"
              src={activeMedia.src}
              style={mediaStyle}
            />
          )
        ) : null}
      </div>

      <div className={contentClassName}>
        <div className="hero-banner__content-measure">
          {slide.logo?.src ? (
            <div className="hero-banner__logo-slot">
              <img
                alt={slide.logo.alt ?? ""}
                className="hero-banner__logo"
                src={slide.logo.src}
              />
            </div>
          ) : null}

          {slide.label ? <p className="hero-banner__label">{slide.label}</p> : null}

          {slide.title ? (
            <h1 className="hero-banner__title">{renderTitle(slide.title)}</h1>
          ) : null}

          {slide.subtitle ? (
            <p className="hero-banner__subtitle">{slide.subtitle}</p>
          ) : null}

          {slide.price ? (
            <p className="hero-banner__price">{renderPrice(slide.price)}</p>
          ) : null}

          {ctas.length ? (
            <div className="hero-banner__cta-group">
              {ctas.map((item) => (
                <a
                  key={`${slide.id}-${item.label}-${item.variant ?? "primary"}`}
                  className={`hero-banner__cta hero-banner__cta--${item.variant ?? "primary"}`}
                  href={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}

          {slide.helperText ? (
            <p className="hero-banner__helper">{slide.helperText}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function HeroBanner({ deck }) {
  const viewportMode = useViewportMode();
  const shouldShowGlow = viewportMode === "desktop";
  const demoRef = useRef(null);
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const slides = Array.isArray(deck?.slides) ? deck.slides.filter(Boolean) : [];
  const autoplayMs = Number.isFinite(deck?.autoplayMs)
    ? deck.autoplayMs
    : DEFAULT_AUTOPLAY_MS;
  const transitionMs = Number.isFinite(deck?.transitionMs)
    ? deck.transitionMs
    : DEFAULT_TRANSITION_MS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);
  const [cycleKey, setCycleKey] = useState(0);
  const totalSlides = slides.length;
  const hasCarousel =
    deck?.mode === "carousel" && totalSlides > 1;
  const currentSlide = slides[activeIndex] ?? slides[0] ?? null;
  const currentMedia = currentSlide?.media?.[viewportMode] ?? null;
  const glowStyle = useHeroGlow({
    cardRef,
    demoRef,
    media: shouldShowGlow ? currentMedia : null,
    mediaRef,
  });
  const bannerClassName = [
    "hero-banner",
    `hero-banner--${viewportMode}`,
    hasCarousel ? "hero-banner--has-carousel" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const exitingSlide =
    previousIndex !== null && previousIndex !== activeIndex
      ? slides[previousIndex] ?? null
      : null;
  const setActiveMediaRef = (node) => {
    if (node) {
      mediaRef.current = node;
    }
  };

  useEffect(() => {
    if (!currentMedia?.src) {
      mediaRef.current = null;
    }
  }, [currentMedia]);

  useEffect(() => {
    if (currentMedia?.kind !== "video") {
      return;
    }

    const videoElement = mediaRef.current;

    if (!(videoElement instanceof HTMLVideoElement)) {
      return;
    }

    videoElement.muted = true;
    videoElement.defaultMuted = true;

    const playback = videoElement.play?.();
    playback?.catch(() => {});
  }, [currentMedia]);

  useEffect(() => {
    setActiveIndex(0);
    setPreviousIndex(null);
    setCycleKey((current) => current + 1);
  }, [deck]);

  useEffect(() => {
    if (!hasCarousel) {
      setPreviousIndex(null);
      setActiveIndex(0);
    }
  }, [hasCarousel]);

  useEffect(() => {
    if (activeIndex <= totalSlides - 1) {
      return;
    }

    setActiveIndex(0);
    setPreviousIndex(null);
  }, [activeIndex, totalSlides]);

  useEffect(() => {
    if (previousIndex === null || previousIndex === activeIndex) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousIndex(null);
    }, transitionMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeIndex, previousIndex, transitionMs]);

  useEffect(() => {
    if (!hasCarousel) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextIndex = (activeIndex + 1) % totalSlides;
      setCycleKey((current) => current + 1);
      setPreviousIndex(activeIndex);
      setActiveIndex(nextIndex);
    }, autoplayMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeIndex, autoplayMs, cycleKey, hasCarousel, totalSlides]);

  if (!currentSlide) {
    return null;
  }

  const handleSelectSlide = (nextIndex) => {
    if (!hasCarousel) {
      return;
    }

    const normalizedIndex =
      ((nextIndex % totalSlides) + totalSlides) % totalSlides;

    setCycleKey((current) => current + 1);

    if (normalizedIndex === activeIndex) {
      setPreviousIndex(null);
      return;
    }

    setPreviousIndex(activeIndex);
    setActiveIndex(normalizedIndex);
  };

  return (
    <section
      ref={demoRef}
      aria-label="Hero banner"
      className={`hero-banner-demo hero-banner-demo--${viewportMode}`}
      style={shouldShowGlow ? glowStyle : undefined}
    >
      {shouldShowGlow ? (
        <div aria-hidden className="hero-banner-demo__glow" />
      ) : null}

      <div className="hero-banner-demo__frame">
        <article
          id="hero-banner"
          ref={cardRef}
          className={bannerClassName}
          style={{ "--hero-transition-duration": `${transitionMs}ms` }}
        >
          {exitingSlide ? (
            <HeroBannerSlide
              key={`${exitingSlide.id}-exit-${cycleKey}`}
              mediaRefCallback={setActiveMediaRef}
              phase="exit"
              slide={exitingSlide}
              viewportMode={viewportMode}
            />
          ) : null}

          <HeroBannerSlide
            key={
              exitingSlide
                ? `${currentSlide.id}-enter-${cycleKey}`
                : `${currentSlide.id}-current`
            }
            mediaRefCallback={setActiveMediaRef}
            phase={exitingSlide ? "enter" : "current"}
            slide={currentSlide}
            viewportMode={viewportMode}
          />

          {hasCarousel ? (
            <HeroCarousel
              activeIndex={activeIndex}
              autoplayMs={autoplayMs}
              className="hero-banner__carousel"
              cycleKey={cycleKey}
              onSelect={handleSelectSlide}
              totalSlides={totalSlides}
            />
          ) : null}
        </article>
      </div>
    </section>
  );
}
