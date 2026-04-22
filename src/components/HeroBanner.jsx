import { Fragment, useEffect, useRef, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import { EditIcon } from "./HeroEditorIcons";
import { useHeroGlow } from "../hooks/useHeroGlow";

const DESKTOP_BREAKPOINT = 1025;
const TABLET_BREAKPOINT = 768;
const DEFAULT_AUTOPLAY_MS = 10000;
const DEFAULT_TRANSITION_MS = 300;
const HERO_TARGET_HEIGHT_RATIO = {
  desktop: 9 / 16,
  tablet: 1,
  mobile: 16 / 9,
};

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

function buildMediaStyle(position, isHeightConstrained) {
  const normalized = typeof position === "string" ? position.trim() : "";

  return {
    objectPosition: isHeightConstrained
      ? `${getHorizontalFocus(normalized)} top`
      : normalized || "center center",
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

  const lead = typeof title?.lead === "string" ? title.lead : "";
  const accent = typeof title?.accent === "string" ? title.accent : "";
  const order = title?.order === "accent-first" ? "accent-first" : "lead-first";

  if (!lead || !accent) {
    return lead || accent;
  }

  if (order === "accent-first") {
    return (
      <>
        <span className="hero-banner__title-accent">{accent}</span>{" "}
        {lead}
      </>
    );
  }

  return (
    <>
      {lead}{" "}
      <span className="hero-banner__title-accent">{accent}</span>
    </>
  );
}

function BestValueIcon() {
  return (
    <svg
      aria-hidden="true"
      className="hero-banner__cta-note-icon"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.0703 7.76562L4.97656 6.6901C4.84288 6.55642 4.69097 6.48958 4.52083 6.48958C4.35069 6.48958 4.19878 6.55642 4.0651 6.6901C3.93142 6.82378 3.86458 6.97872 3.86458 7.15494C3.86458 7.33115 3.93142 7.4861 4.0651 7.61978L5.61458 9.16926C5.74826 9.30294 5.90017 9.36978 6.0703 9.36978C6.24044 9.36978 6.39235 9.30294 6.52603 9.16926L9.93488 5.76041C10.0686 5.62673 10.1354 5.47178 10.1354 5.29557C10.1354 5.11935 10.0686 4.9644 9.93488 4.83072C9.8012 4.69704 9.64929 4.6302 9.47915 4.6302C9.30902 4.6302 9.15711 4.69704 9.02343 4.83072L6.0703 7.76562ZM6.99999 14C6.03992 14 5.13454 13.8177 4.28385 13.4531C3.43316 13.0885 2.6888 12.5872 2.05078 11.9492C1.41276 11.3112 0.911457 10.5668 0.546874 9.71613C0.182291 8.86544 0 7.96006 0 6.99999C0 6.02777 0.182291 5.11935 0.546874 4.27473C0.911457 3.43012 1.41276 2.6888 2.05078 2.05078C2.6888 1.41276 3.43316 0.911457 4.28385 0.546874C5.13454 0.182291 6.03992 0 6.99999 0C7.97221 0 8.88063 0.182291 9.72525 0.546874C10.5699 0.911457 11.3112 1.41276 11.9492 2.05078C12.5872 2.6888 13.0885 3.43012 13.4531 4.27473C13.8177 5.11935 14 6.02777 14 6.99999C14 7.96006 13.8177 8.86544 13.4531 9.71613C13.0885 10.5668 12.5872 11.3112 11.9492 11.9492C11.3112 12.5872 10.5699 13.0885 9.72525 13.4531C8.88063 13.8177 7.97221 14 6.99999 14Z"
        fill="url(#hero-banner-best-value-gradient)"
      />
      <defs>
        <linearGradient
          id="hero-banner-best-value-gradient"
          x1="0"
          y1="0"
          x2="13.0091"
          y2="3.09359"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2AF3D" />
          <stop offset="1" stopColor="#FBED7D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PpvBadgeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="hero-banner__ppv-badge-icon"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="5" fill="url(#hero-banner-ppv-gradient)" />
      <path
        d="M12.108 11.7C12.636 11.7 13.196 11.86 13.788 12.18C14.38 12.5 14.796 12.932 15.036 13.476V20.388C14.86 20.804 14.492 21.204 13.932 21.588C13.388 21.956 12.78 22.14 12.108 22.14H11.076V28.5H8.004V11.7H12.108ZM11.628 19.332C11.916 19.332 12.092 19.188 12.156 18.9V14.94C12.092 14.668 11.916 14.532 11.628 14.532H11.076V19.332H11.628ZM20.0533 11.7C20.5813 11.7 21.1413 11.86 21.7333 12.18C22.3253 12.5 22.7413 12.932 22.9813 13.476V20.388C22.8053 20.804 22.4373 21.204 21.8773 21.588C21.3333 21.956 20.7253 22.14 20.0533 22.14H19.0213V28.5H15.9493V11.7H20.0533ZM19.5733 19.332C19.8613 19.332 20.0373 19.188 20.1013 18.9V14.94C20.0373 14.668 19.8613 14.532 19.5733 14.532H19.0213V19.332H19.5733ZM23.7266 14.244V11.7H26.7026L27.3986 24.564H27.6626L28.4066 11.7H31.3346V14.244L29.8706 28.5H25.1906L23.7266 14.244Z"
        fill="#282000"
      />
      <defs>
        <linearGradient
          id="hero-banner-ppv-gradient"
          x1="0"
          y1="0"
          x2="40"
          y2="0.00915259"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2AF3D" />
          <stop offset="1" stopColor="#FBED7D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function getSlideCtas(slide) {
  return [slide?.primaryCta, slide?.secondaryCta].filter(Boolean);
}

function getDualCtaContent(slide) {
  if (
    slide?.ctaLayout !== "dual" ||
    !slide?.primaryCta ||
    !slide?.secondaryCta
  ) {
    return null;
  }

  return {
    order: slide?.ctaOrder === "gold-first" ? "gold-first" : "standard-first",
    standard: slide.secondaryCta,
    gold: slide.primaryCta,
    showDivider: slide?.showCtaDivider !== false,
    standardNote:
      typeof slide?.standardButtonNote === "string"
        ? slide.standardButtonNote.trim()
        : "",
    goldNote:
      typeof slide?.goldButtonNote === "string" ? slide.goldButtonNote.trim() : "",
  };
}

function renderDefaultCtas(slide) {
  const ctas = getSlideCtas(slide);

  if (!ctas.length) {
    return null;
  }

  return (
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
  );
}

function renderDualCtas(slide) {
  const dualCta = getDualCtaContent(slide);

  if (!dualCta) {
    return renderDefaultCtas(slide);
  }

  const orderedItems =
    dualCta.order === "gold-first"
      ? [
          { kind: "gold", cta: dualCta.gold, note: dualCta.goldNote },
          { kind: "standard", cta: dualCta.standard, note: dualCta.standardNote },
        ]
      : [
          { kind: "standard", cta: dualCta.standard, note: dualCta.standardNote },
          { kind: "gold", cta: dualCta.gold, note: dualCta.goldNote },
        ];

  return (
    <div className="hero-banner__cta-dual" role="group" aria-label="Hero call to action options">
      {orderedItems.map((item, index) => (
        <Fragment key={`${item.kind}-${item.cta.label}`}>
          {index > 0 && dualCta.showDivider ? (
            <span className="hero-banner__cta-divider" aria-hidden="true">
              or
            </span>
          ) : null}

          <div
            className={`hero-banner__cta-highlight ${
              item.kind === "gold"
                ? "hero-banner__cta-highlight--gold"
                : "hero-banner__cta-highlight--standard"
            }`}
          >
            <a
              className={`hero-banner__cta ${
                item.kind === "gold"
                  ? "hero-banner__cta--gold"
                  : "hero-banner__cta--standard"
              }`}
              href={item.cta.href}
            >
              {item.cta.label}
            </a>

            {item.note ? (
              <span
                className={`hero-banner__cta-note ${
                  item.kind === "gold"
                    ? "hero-banner__cta-note--gold"
                    : "hero-banner__cta-note--standard"
                }`}
              >
                {item.kind === "gold" && item.note.trim().toLowerCase() === "best value" ? (
                  <BestValueIcon />
                ) : null}
                <span>{item.note}</span>
              </span>
            ) : null}
          </div>
        </Fragment>
      ))}
    </div>
  );
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
  isHeightConstrained,
  mediaRefCallback,
  phase,
  slide,
  viewportMode,
}) {
  const activeMedia = slide?.media?.[viewportMode] ?? null;
  const contentClassName =
    viewportMode === "desktop"
      ? "hero-banner__content hero-banner__content--desktop"
      : "hero-banner__content hero-banner__content--compact";
  const mediaStyle = buildMediaStyle(
    slide?.focus?.[viewportMode],
    isHeightConstrained,
  );
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
              preload="auto"
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

      {slide.ppvBadge ? (
        <div className="hero-banner__ppv-badge" aria-hidden="true">
          <PpvBadgeIcon />
        </div>
      ) : null}

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

          {slide.label ? (
            <p
              className={`hero-banner__label ${
                slide.labelTheme === "gold" ? "hero-banner__label--gold" : ""
              }`}
            >
              {slide.label}
            </p>
          ) : null}

          {slide.title ? (
            <h1 className="hero-banner__title">{renderTitle(slide.title)}</h1>
          ) : null}

          {slide.subtitle ? (
            <p className="hero-banner__subtitle">{slide.subtitle}</p>
          ) : null}

          {slide.price ? (
            <p className="hero-banner__price">{renderPrice(slide.price)}</p>
          ) : null}

          {renderDualCtas(slide)}

          {slide.helperText ? (
            <p className="hero-banner__helper">{slide.helperText}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function HeroBanner({
  deck,
  isEditorOpen = false,
  onActiveSlideChange,
  onRequestEditSlide,
  preferredActiveSlideId = null,
}) {
  const viewportMode = useViewportMode();
  const isCompactViewport = viewportMode !== "desktop";
  const shouldShowGlow = viewportMode === "desktop";
  const demoRef = useRef(null);
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const activeSlideIdRef = useRef(null);
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
  const [isHeightConstrained, setIsHeightConstrained] = useState(false);
  const [isTouchEditRevealed, setIsTouchEditRevealed] = useState(false);
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
    activeSlideIdRef.current = currentSlide?.id ?? null;
    onActiveSlideChange?.(currentSlide, activeIndex);
  }, [activeIndex, currentSlide, onActiveSlideChange]);

  useEffect(() => {
    if (!currentMedia?.src) {
      mediaRef.current = null;
    }
  }, [currentMedia]);

  useEffect(() => {
    const cardElement = cardRef.current;

    if (!cardElement || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const measureConstraint = () => {
      const targetRatio =
        HERO_TARGET_HEIGHT_RATIO[viewportMode] ?? HERO_TARGET_HEIGHT_RATIO.desktop;
      const width = cardElement.clientWidth;
      const height = cardElement.clientHeight;
      const targetHeight = width * targetRatio;
      const nextState = height < targetHeight - 1;

      setIsHeightConstrained((current) =>
        current === nextState ? current : nextState,
      );
    };

    measureConstraint();

    const observer = new ResizeObserver(() => {
      measureConstraint();
    });

    observer.observe(cardElement);

    return () => {
      observer.disconnect();
    };
  }, [viewportMode, currentSlide, totalSlides]);

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
    if (!slides.length) {
      return;
    }

    if (!hasCarousel) {
      if (activeIndex !== 0) {
        setPreviousIndex(null);
        setActiveIndex(0);
      }

      return;
    }

    const targetSlideId = preferredActiveSlideId || activeSlideIdRef.current;

    if (targetSlideId) {
      const targetIndex = slides.findIndex((slide) => slide.id === targetSlideId);

      if (targetIndex !== -1) {
        if (targetIndex !== activeIndex) {
          setCycleKey((current) => current + 1);
          setPreviousIndex(null);
          setActiveIndex(targetIndex);
        }

        return;
      }
    }

    if (activeIndex >= slides.length) {
      setActiveIndex(0);
      setPreviousIndex(null);
      setCycleKey((current) => current + 1);
    }
  }, [activeIndex, hasCarousel, preferredActiveSlideId, slides]);

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
    if (!hasCarousel || isEditorOpen) {
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
  }, [activeIndex, autoplayMs, cycleKey, hasCarousel, isEditorOpen, totalSlides]);

  useEffect(() => {
    if (!isCompactViewport || !isTouchEditRevealed) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (demoRef.current?.contains(event.target)) {
        return;
      }

      setIsTouchEditRevealed(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isCompactViewport, isTouchEditRevealed]);

  useEffect(() => {
    if (!isCompactViewport || isEditorOpen) {
      setIsTouchEditRevealed(false);
    }
  }, [isCompactViewport, isEditorOpen]);

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

  const handleRequestEdit = () => {
    setIsTouchEditRevealed(false);
    onRequestEditSlide?.(currentSlide.id);
  };

  const handleDemoClick = (event) => {
    if (!isCompactViewport || isEditorOpen || !onRequestEditSlide) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest(".hero-banner__edit-button")) {
      return;
    }

    if (target.closest("a, button, input, textarea, select, label")) {
      return;
    }

    setIsTouchEditRevealed((current) => !current);
  };

  return (
    <section
      ref={demoRef}
      aria-label="Hero banner"
      className={[
        "hero-banner-demo",
        `hero-banner-demo--${viewportMode}`,
        isTouchEditRevealed ? "hero-banner-demo--edit-revealed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleDemoClick}
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
          {onRequestEditSlide ? (
            <button
              aria-label="Edit visible slide"
              className={[
                "hero-banner__edit-button",
                "hero-banner__edit-button--right",
                currentSlide.ppvBadge ? "hero-banner__edit-button--right-offset" : "",
                isTouchEditRevealed ? "hero-banner__edit-button--visible" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={handleRequestEdit}
              type="button"
            >
              <EditIcon />
            </button>
          ) : null}

          {exitingSlide ? (
            <HeroBannerSlide
              isHeightConstrained={isHeightConstrained}
              key={`${exitingSlide.id}-exit-${cycleKey}`}
              mediaRefCallback={setActiveMediaRef}
              phase="exit"
              slide={exitingSlide}
              viewportMode={viewportMode}
            />
          ) : null}

          <HeroBannerSlide
            isHeightConstrained={isHeightConstrained}
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
