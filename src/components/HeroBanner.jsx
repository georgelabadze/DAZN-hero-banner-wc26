import { useEffect, useMemo, useRef, useState } from "react";
import HeroCarouselDots from "./HeroCarouselDots";
import { useHeroGlow } from "../hooks/useHeroGlow";

const DESKTOP_MIN = 1025;
const TABLET_MIN = 768;

function getViewportMode(width) {
  if (width >= DESKTOP_MIN) {
    return "desktop";
  }

  if (width >= TABLET_MIN) {
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

function buildImageStyle(position) {
  return {
    objectPosition: position ?? "center center",
  };
}

function normalizeMedia(media, images, alt) {
  if (media) {
    return {
      desktop: {
        kind: media.desktop?.kind ?? "image",
        src: media.desktop?.src ?? "",
        poster: media.desktop?.poster,
        alt: media.desktop?.alt ?? alt,
      },
      tablet: {
        kind: media.tablet?.kind ?? "image",
        src: media.tablet?.src ?? "",
        poster: media.tablet?.poster,
        alt: media.tablet?.alt ?? alt,
      },
      mobile: {
        kind: media.mobile?.kind ?? "image",
        src: media.mobile?.src ?? "",
        poster: media.mobile?.poster,
        alt: media.mobile?.alt ?? alt,
      },
    };
  }

  return {
    desktop: {
      kind: "image",
      src: images?.desktop ?? "",
      alt,
    },
    tablet: {
      kind: "image",
      src: images?.tablet ?? "",
      alt,
    },
    mobile: {
      kind: "image",
      src: images?.mobile ?? "",
      alt,
    },
  };
}

function renderPrice(price) {
  if (typeof price === "string") {
    return price;
  }

  return (
    <>
      {price.prefix ? <span className="hero-banner__priceMeta">{price.prefix}</span> : null}
      <span className="hero-banner__priceValue">{price.value}</span>
      {price.oldPrice || price.suffix ? (
        <span className="hero-banner__priceTrail">
          {price.oldPrice ? (
            <span className="hero-banner__priceMeta hero-banner__priceMeta--crossed">
              {price.oldPrice}
            </span>
          ) : null}
          {price.suffix ? <span className="hero-banner__priceMeta">{price.suffix}</span> : null}
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
      <span className="hero-banner__titleAccent">{title.accent}</span>
    </>
  );
}

export default function HeroBanner({
  alt,
  carousel = { activeIndex: 2, totalSlides: 8 },
  copy,
  cta,
  focus = {},
  images,
  layout = {},
  media,
}) {
  const viewportMode = useViewportMode();
  const demoRef = useRef(null);
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const desktopAlign = layout.desktopAlign ?? "left";
  const goldTheme = layout.goldTheme ?? false;
  const titleScale = layout.titleScale ?? "default";
  const hasCarousel = Boolean(carousel);

  const normalizedMedia = useMemo(() => normalizeMedia(media, images, alt), [alt, images, media]);

  const activeMedia = useMemo(() => {
    if (viewportMode === "desktop") {
      return normalizedMedia.desktop;
    }

    if (viewportMode === "tablet") {
      return normalizedMedia.tablet;
    }

    return normalizedMedia.mobile;
  }, [normalizedMedia.desktop, normalizedMedia.mobile, normalizedMedia.tablet, viewportMode]);

  const glowStyle = useHeroGlow({
    cardRef,
    demoRef,
    media: activeMedia,
    mediaRef,
  });
  const imageStyle = buildImageStyle(focus[viewportMode]);
  const ctas = (Array.isArray(cta) ? cta : cta ? [cta] : []).filter(Boolean);
  const heroClassName = [
    `hero-banner hero-banner--${viewportMode}`,
    hasCarousel ? "hero-banner--with-carousel" : "",
    goldTheme ? "hero-banner--gold" : "hero-banner--standard",
    titleScale === "medium" ? "hero-banner--title-medium" : "",
    viewportMode === "desktop" && desktopAlign === "center" ? "hero-banner--desktop-center" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const contentClassName =
    viewportMode === "desktop"
      ? "hero-banner__content hero-banner__content--desktop"
      : "hero-banner__content hero-banner__content--compact";

  useEffect(() => {
    if (activeMedia.kind !== "video") {
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
  }, [activeMedia.kind, activeMedia.src]);

  return (
    <section
      ref={demoRef}
      aria-labelledby="hero-banner-title"
      className={`hero-demo hero-demo--${viewportMode}`}
      style={glowStyle}
    >
      <div aria-hidden className="hero-demo__glow" />

      <div className="hero-demo__frame">
        <article
          id="hero-banner"
          ref={cardRef}
          className={heroClassName}
        >
          <div aria-hidden className="hero-banner__scrim" />
          <div className="hero-banner__media">
            {activeMedia.kind === "video" ? (
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
                style={imageStyle}
              >
                <source src={activeMedia.src} />
              </video>
            ) : (
              <img
                ref={mediaRef}
                alt={activeMedia.alt ?? alt}
                className={`hero-banner__image hero-banner__image--${viewportMode}`}
                src={activeMedia.src}
                style={imageStyle}
              />
            )}
          </div>

          <div className={contentClassName}>
            <div className="hero-banner__contentMeasure">
              {copy.logo?.src ? (
                <div className="hero-banner__logoSlot">
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
              {copy.price ? <p className="hero-banner__price">{renderPrice(copy.price)}</p> : null}
              {ctas.length ? (
                <div className="hero-banner__ctaGroup">
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
              {copy.helperText ? <p className="hero-banner__helper">{copy.helperText}</p> : null}
            </div>
          </div>

          {carousel ? (
            <HeroCarouselDots
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
