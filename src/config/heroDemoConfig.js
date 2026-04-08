import blueprintDesktopImage from "../../assets/hero/blueprint-desktop.png";
import blueprintMobileImage from "../../assets/hero/blueprint-mobile.png";
import blueprintTabletImage from "../../assets/hero/blueprint-tablet.png";
import desktopImage from "../../assets/hero/desktop.png";
import heroLogo from "../../assets/hero/logo.png";
import mobileImage from "../../assets/hero/mobile.png";
import tabletImage from "../../assets/hero/tablet.png";
import desktopVideo from "../../assets/hero/video-example-desktop.mov";
import mobileVideo from "../../assets/hero/video-example-mobile.mov";
import tabletVideo from "../../assets/hero/video-example-tablet.mov";

export const CREATIVE_GUIDELINES_URL = "/documentation.html";
export const HERO_GITHUB_URL =
  "https://github.com/georgelabadze/DAZN-hero-banner-wc26.git";
export const SITE_HEADER_LOGO_URL = "https://static.dazndn.com/logos/dazn.svg";

export const siteHeaderActions = [
  { label: "Explore", variant: "secondary" },
  { label: "Log in", variant: "primary" },
];

export const siteHeaderCountdownTarget = "2026-06-11T00:00:00Z";

export const siteHeaderEventBrand = {
  logoSrc: heroLogo,
  title: "FIFA World Cup 2026™",
  subtitle: "11 June - 19 July 2026",
};

export const siteHeaderCountdownCta = {
  label: "Log in",
  href: "#hero-banner",
};

export const heroContent = {
  logo: {
    src: heroLogo,
    alt: "FIFA World Cup 26 logo",
  },
  label: "11 jun - 19 jul 2026",
  title: {
    lead: "There's whole World Cup",
    accent: "experience only on DAZN",
  },
  subtitle: "Access all 104 matches live in 4K HDR across USA, Canada, and Mexico.",
  price: {
    prefix: "From",
    value: "$19.99",
    oldPrice: "$29.99",
    suffix: "/month",
  },
  helperText:
    "Cancel anytime. Selected events and availability may vary by territory.",
};

export const heroMediaSets = {
  blueprint: {
    desktop: {
      kind: "image",
      src: blueprintDesktopImage,
      alt: "FIFA World Cup hero blueprint image for desktop.",
    },
    tablet: {
      kind: "image",
      src: blueprintTabletImage,
      alt: "FIFA World Cup hero blueprint image for tablet.",
    },
    mobile: {
      kind: "image",
      src: blueprintMobileImage,
      alt: "FIFA World Cup hero blueprint image for mobile.",
    },
  },
  photo: {
    desktop: {
      kind: "image",
      src: desktopImage,
      alt: "FIFA World Cup hero image for desktop.",
    },
    tablet: {
      kind: "image",
      src: tabletImage,
      alt: "FIFA World Cup hero image for tablet.",
    },
    mobile: {
      kind: "image",
      src: mobileImage,
      alt: "FIFA World Cup hero image for mobile.",
    },
  },
  video: {
    desktop: {
      kind: "video",
      src: desktopVideo,
      poster: desktopImage,
      alt: "FIFA World Cup hero video for desktop.",
    },
    tablet: {
      kind: "video",
      src: tabletVideo,
      poster: tabletImage,
      alt: "FIFA World Cup hero video for tablet.",
    },
    mobile: {
      kind: "video",
      src: mobileVideo,
      poster: mobileImage,
      alt: "FIFA World Cup hero video for mobile.",
    },
  },
};

export const heroFocus = {
  desktop: "center 50%",
  tablet: "center 42%",
  mobile: "center 40%",
};

export const heroCarousel = {
  totalSlides: 4,
  activeIndex: 0,
};

export const heroCtas = [
  { label: "Get started", href: "#hero-banner", variant: "primary" },
  { label: "Explore", href: "#hero-banner", variant: "secondary" },
];

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
