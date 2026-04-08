import { useEffect, useRef, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import { useHeroGlow } from "../hooks/useHeroGlow";

const DESKTOP_BREAKPOINT = 1025;
const TABLET_BREAKPOINT = 768;

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

function buildMediaStyle(position) {
  return {
    objectPosition: position ?? "center center",
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

export default function HeroBanner({
  alt,
  carousel = null,
  copy,
  cta,
  focus = {},
  layout = {},
  media,
}) {
  const viewportMode = useViewportMode();
  const demoRef = useRef(null);
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const hasCarousel = Boolean(carousel);
  const contentAlignment = layout.contentAlignment ?? "left";
  const theme = layout.theme ?? "standard";
  const titleSize = layout.titleSize ?? "larger";
  const activeMedia = media?.[viewportMode];
  const ctas = (Array.isArray(cta) ? cta : cta ? [cta] : []).filter(Boolean);
  const glowStyle = useHeroGlow({
    cardRef,
    demoRef,
    media: activeMedia,
    mediaRef,
  });
  const mediaStyle = buildMediaStyle(focus[viewportMode]);
  const bannerClassName = [
    "hero-banner",
    `hero-banner--${viewportMode}`,
    hasCarousel ? "hero-banner--has-carousel" : "",
    theme === "gold" ? "hero-banner--theme-gold" : "hero-banner--theme-standard",
    titleSize === "large"
      ? "hero-banner--title-large"
      : "hero-banner--title-larger",
    viewportMode === "desktop" && contentAlignment === "center"
      ? "hero-banner--align-center"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const contentClassName =
    viewportMode === "desktop"
      ? "hero-banner__content hero-banner__content--desktop"
      : "hero-banner__content hero-banner__content--compact";

  useEffect(() => {
    if (activeMedia?.kind !== "video") {
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
  }, [activeMedia]);

  return (
    <section
      ref={demoRef}
      aria-labelledby="hero-banner-title"
      className={`hero-banner-demo hero-banner-demo--${viewportMode}`}
      style={glowStyle}
    >
      <div aria-hidden className="hero-banner-demo__glow" />

      <div className="hero-banner-demo__frame">
        <article
          id="hero-banner"
          ref={cardRef}
          className={bannerClassName}
        >
          <div aria-hidden className="hero-banner__scrim" />

          <div className="hero-banner__media">
            {activeMedia?.kind === "video" ? (
              <video
                ref={mediaRef}
                aria-label={activeMedia.alt ?? alt}
                autoPlay
                className={`hero-banner__video hero-banner__video--${viewportMode}`}
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
                ref={mediaRef}
                alt={activeMedia?.alt ?? alt}
                className={`hero-banner__image hero-banner__image--${viewportMode}`}
                src={activeMedia?.src}
                style={mediaStyle}
              />
            )}
          </div>

          <div className={contentClassName}>
            <div className="hero-banner__content-measure">
              {copy.logo?.src ? (
                <div className="hero-banner__logo-slot">
                  <img
                    alt={copy.logo.alt ?? ""}
                    className="hero-banner__logo"
                    src={copy.logo.src}
                  />
                </div>
              ) : null}

              {copy.label ? <p className="hero-banner__label">{copy.label}</p> : null}

              <h1 className="hero-banner__title" id="hero-banner-title">
                {renderTitle(copy.title)}
              </h1>

              <p className="hero-banner__subtitle">{copy.subtitle}</p>

              {copy.price ? (
                <p className="hero-banner__price">{renderPrice(copy.price)}</p>
              ) : null}

              {ctas.length ? (
                <div className="hero-banner__cta-group">
                  {ctas.map((item) => (
                    <a
                      key={`${item.label}-${item.variant ?? "primary"}`}
                      className={`hero-banner__cta hero-banner__cta--${item.variant ?? "primary"}`}
                      href={item.href}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ) : null}

              {copy.helperText ? (
                <p className="hero-banner__helper">{copy.helperText}</p>
              ) : null}
            </div>
          </div>

          {carousel ? (
            <HeroCarousel
              activeIndex={carousel.activeIndex}
              className="hero-banner__carousel"
              totalSlides={carousel.totalSlides}
            />
          ) : null}
        </article>
      </div>
    </section>
  );
}
