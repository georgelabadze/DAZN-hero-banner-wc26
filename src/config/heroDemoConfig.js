import heroBannerData from "../data/hero-banner-data.json";

export const CREATIVE_GUIDELINES_URL = "/documentation.html";
export const HERO_GITHUB_URL =
  "https://github.com/georgelabadze/DAZN-hero-banner-wc26.git";
export const SITE_HEADER_LOGO_URL = "https://static.dazndn.com/logos/dazn.svg";
export const HERO_LOCAL_URLS = {
  blueprintDesktop: "/hero/blueprint-desktop.png",
  blueprintMobile: "/hero/blueprint-mobile.png",
  blueprintTablet: "/hero/blueprint-tablet.png",
  desktopPhoto: "/hero/desktop.png",
  desktopVideo: "/hero/video-example-desktop.mov",
  logo: "/hero/logo.png",
  mobilePhoto: "/hero/mobile.png",
  mobileVideo: "/hero/video-example-mobile.mov",
  tabletPhoto: "/hero/tablet.png",
  tabletVideo: "/hero/video-example-tablet.mov",
};

const DEFAULT_AUTOPLAY_MS = 10000;
const DEFAULT_FOCUS = {
  desktop: "center 50%",
  tablet: "center 42%",
  mobile: "center 40%",
};
const DEFAULT_LAYOUT = {
  contentAlignment: "center",
  theme: "gold",
  titleSize: "large",
};
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".m4v", ".webm", ".ogg", ".ogv", ".m3u8"];

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUrl(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLayout(layout = {}) {
  return {
    contentAlignment: layout.contentAlignment === "left" ? "left" : "center",
    theme: layout.theme === "standard" ? "standard" : "gold",
    titleSize: layout.titleSize === "larger" ? "larger" : "large",
  };
}

function normalizeTitleSize(value) {
  return value === "larger" ? "larger" : "large";
}

function normalizeFocus(focus = {}) {
  return {
    desktop: normalizeText(focus.desktop) || DEFAULT_FOCUS.desktop,
    tablet: normalizeText(focus.tablet) || DEFAULT_FOCUS.tablet,
    mobile: normalizeText(focus.mobile) || DEFAULT_FOCUS.mobile,
  };
}

function getPathWithoutQuery(url) {
  const trimmedUrl = normalizeUrl(url);

  if (!trimmedUrl) {
    return "";
  }

  const [withoutHash] = trimmedUrl.split("#");
  const [withoutQuery] = withoutHash.split("?");

  return withoutQuery.toLowerCase();
}

function detectMediaKind(mediaItem) {
  if (normalizeUrl(mediaItem?.posterUrl)) {
    return "video";
  }

  const path = getPathWithoutQuery(mediaItem?.url);

  if (VIDEO_EXTENSIONS.some((extension) => path.endsWith(extension))) {
    return "video";
  }

  return "image";
}

function normalizeMediaItem(mediaItem) {
  const src = normalizeUrl(mediaItem?.url);

  if (!src) {
    return null;
  }

  const poster = normalizeUrl(mediaItem?.posterUrl);

  return {
    kind: detectMediaKind(mediaItem),
    src,
    ...(poster ? { poster } : {}),
    alt: normalizeText(mediaItem?.alt),
  };
}

function normalizeMediaSet(media = {}) {
  return {
    desktop: normalizeMediaItem(media.desktop),
    tablet: normalizeMediaItem(media.tablet),
    mobile: normalizeMediaItem(media.mobile),
  };
}

function normalizeLogo(logo) {
  const src = normalizeUrl(logo?.url);

  if (!src) {
    return null;
  }

  return {
    src,
    alt: normalizeText(logo.alt),
  };
}

function normalizeTitle(title) {
  if (typeof title === "string") {
    return {
      content: normalizeText(title),
      size: null,
    };
  }

  if (!title || typeof title !== "object") {
    return {
      content: "",
      size: null,
    };
  }

  const lead = normalizeText(title.lead);
  const accent = normalizeText(title.accent);
  const size = normalizeText(title.size);

  if (lead && accent) {
    return {
      content: { lead, accent },
      size: size ? normalizeTitleSize(size) : null,
    };
  }

  return {
    content: lead || accent || "",
    size: size ? normalizeTitleSize(size) : null,
  };
}

function normalizePrice(price) {
  if (!price) {
    return null;
  }

  if (typeof price === "string") {
    return normalizeText(price) || null;
  }

  const nextPrice = {
    prefix: normalizeText(price.prefix),
    value: normalizeText(price.value),
    oldPrice: normalizeText(price.oldPrice),
    suffix: normalizeText(price.suffix),
  };

  return nextPrice.value || nextPrice.oldPrice || nextPrice.prefix || nextPrice.suffix
    ? nextPrice
    : null;
}

function normalizeCta(cta, variant) {
  if (!cta?.label) {
    return null;
  }

  return {
    label: normalizeText(cta.label),
    href: normalizeText(cta.href) || "#hero-banner",
    variant,
  };
}

function normalizeSlide(slide, index) {
  const title = normalizeTitle(slide.title);
  const layout = normalizeLayout(slide.layout);

  return {
    id: normalizeText(slide.id) || `slide-${index + 1}`,
    layout: {
      ...layout,
      titleSize: title.size ?? layout.titleSize,
    },
    focus: normalizeFocus(slide.focus),
    media: normalizeMediaSet(slide.media),
    logo: normalizeLogo(slide.logo),
    label: normalizeText(slide.label),
    title: title.content,
    subtitle: normalizeText(slide.subtitle),
    price: normalizePrice(slide.price),
    primaryCta: normalizeCta(slide.primaryCta, "primary"),
    secondaryCta: normalizeCta(slide.secondaryCta, "secondary"),
    helperText: normalizeText(slide.helperText),
  };
}

const fallbackSlide = normalizeSlide(
  {
    id: "fallback-slide",
    layout: DEFAULT_LAYOUT,
    focus: DEFAULT_FOCUS,
    media: {
      desktop: {
        url: HERO_LOCAL_URLS.desktopVideo,
        posterUrl: HERO_LOCAL_URLS.desktopPhoto,
        alt: "FIFA World Cup hero video for desktop.",
      },
      tablet: {
        url: HERO_LOCAL_URLS.tabletVideo,
        posterUrl: HERO_LOCAL_URLS.tabletPhoto,
        alt: "FIFA World Cup hero video for tablet.",
      },
      mobile: {
        url: HERO_LOCAL_URLS.mobileVideo,
        posterUrl: HERO_LOCAL_URLS.mobilePhoto,
        alt: "FIFA World Cup hero video for mobile.",
      },
    },
    logo: {
      url: HERO_LOCAL_URLS.logo,
      alt: "FIFA World Cup 26 logo",
    },
    label: "11 jun - 19 jul 2026",
    title: {
      lead: "There's whole World Cup",
      accent: "experience only on DAZN",
      size: "large",
    },
    subtitle:
      "Access all 104 matches live in 4K HDR across USA, Canada, and Mexico.",
    price: {
      prefix: "From",
      value: "$19.99",
      oldPrice: "$29.99",
      suffix: "/month",
    },
    primaryCta: {
      label: "Get started",
      href: "#hero-banner",
    },
    secondaryCta: {
      label: "Explore",
      href: "#hero-banner",
    },
    helperText:
      "Cancel anytime. Selected events and availability may vary by territory.",
  },
  0,
);

function normalizeDeck(rawDeck) {
  const rawSlides = Array.isArray(rawDeck?.slides) ? rawDeck.slides : [];
  const slides = rawSlides.map((slide, index) => normalizeSlide(slide, index));

  return {
    mode: rawDeck?.mode === "single" ? "single" : "carousel",
    autoplayMs: Number.isFinite(rawDeck?.autoplayMs)
      ? rawDeck.autoplayMs
      : DEFAULT_AUTOPLAY_MS,
    transitionMs: Number.isFinite(rawDeck?.transitionMs)
      ? rawDeck.transitionMs
      : 300,
    slides: slides.length ? slides : [fallbackSlide],
  };
}

const heroPreviewMediaSets = {
  blueprint: normalizeMediaSet({
    desktop: {
      url: HERO_LOCAL_URLS.blueprintDesktop,
      alt: "FIFA World Cup hero blueprint image for desktop.",
    },
    tablet: {
      url: HERO_LOCAL_URLS.blueprintTablet,
      alt: "FIFA World Cup hero blueprint image for tablet.",
    },
    mobile: {
      url: HERO_LOCAL_URLS.blueprintMobile,
      alt: "FIFA World Cup hero blueprint image for mobile.",
    },
  }),
  photo: normalizeMediaSet({
    desktop: {
      url: HERO_LOCAL_URLS.desktopPhoto,
      alt: "FIFA World Cup hero image for desktop.",
    },
    tablet: {
      url: HERO_LOCAL_URLS.tabletPhoto,
      alt: "FIFA World Cup hero image for tablet.",
    },
    mobile: {
      url: HERO_LOCAL_URLS.mobilePhoto,
      alt: "FIFA World Cup hero image for mobile.",
    },
  }),
  video: normalizeMediaSet({
    desktop: {
      url: HERO_LOCAL_URLS.desktopVideo,
      posterUrl: HERO_LOCAL_URLS.desktopPhoto,
      alt: "FIFA World Cup hero video for desktop.",
    },
    tablet: {
      url: HERO_LOCAL_URLS.tabletVideo,
      posterUrl: HERO_LOCAL_URLS.tabletPhoto,
      alt: "FIFA World Cup hero video for tablet.",
    },
    mobile: {
      url: HERO_LOCAL_URLS.mobileVideo,
      posterUrl: HERO_LOCAL_URLS.mobilePhoto,
      alt: "FIFA World Cup hero video for mobile.",
    },
  }),
};

function buildSingleSlideDeck(baseSlide, settings) {
  const previewMedia =
    settings.showCreativeBlueprint
      ? heroPreviewMediaSets.blueprint
      : heroPreviewMediaSets[settings.mediaMode] ?? baseSlide.media;

  return {
    ...heroBannerDeck,
    mode: "single",
    slides: [
      {
        ...baseSlide,
        layout: {
          ...baseSlide.layout,
          contentAlignment: settings.contentAlignment,
          theme: settings.theme,
          titleSize: settings.titleSize,
        },
        media: previewMedia,
        logo: settings.showLogo ? baseSlide.logo : null,
        label: settings.showLabel ? baseSlide.label : "",
        price: settings.showPrice ? baseSlide.price : null,
        secondaryCta: settings.showSecondaryCta ? baseSlide.secondaryCta : null,
        helperText: settings.showHelperText ? baseSlide.helperText : "",
      },
    ],
  };
}

export const heroBannerDeck = normalizeDeck(heroBannerData);

export const siteHeaderActions = [
  { label: "Explore", variant: "secondary" },
  { label: "Log in", variant: "primary" },
];

export const siteHeaderCountdownTarget = "2026-06-11T00:00:00Z";

export const siteHeaderEventBrand = {
  logoSrc: HERO_LOCAL_URLS.logo,
  title: "FIFA World Cup 2026™",
  subtitle: "11 June - 19 July 2026",
};

export const siteHeaderCountdownCta = {
  label: "Log in",
  href: "#hero-banner",
};

export function buildHeroDeckForDisplay(settings) {
  const shouldUseCarousel =
    settings.showCarousel &&
    heroBannerDeck.mode === "carousel" &&
    heroBannerDeck.slides.length > 1;

  if (shouldUseCarousel) {
    return heroBannerDeck;
  }

  return buildSingleSlideDeck(heroBannerDeck.slides[0] ?? fallbackSlide, settings);
}

export const heroDefaultSettings = {
  contentAlignment: "center",
  headerMode: "countdown",
  mediaMode: "video",
  showCarousel: false,
  showCreativeBlueprint: false,
  showHelperText: false,
  showLabel: false,
  showLogo: false,
  showPrice: false,
  showSecondaryCta: false,
  theme: "gold",
  titleSize: "large",
};
