import { useMemo, useState } from "react";
import desktopImage from "../assets/hero/desktop.png";
import heroLogo from "../assets/hero/logo.png";
import mobileImage from "../assets/hero/mobile.png";
import tabletImage from "../assets/hero/tablet.png";
import desktopVideo from "../assets/hero/video-example-desktop.mov";
import mobileVideo from "../assets/hero/video-example-mobile.mov";
import tabletVideo from "../assets/hero/video-example-tablet.mov";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import HeroSettingsPanel from "./components/HeroSettingsPanel";

const headerActions = [
  { label: "Explore", variant: "secondary" },
  { label: "Log in", variant: "primary" },
];

const headerCountdownTarget = "2026-06-11T00:00:00Z";

const headerEventBrand = {
  logoSrc: heroLogo,
  title: "FIFA World Cup 2026™",
  subtitle: "11 June - 19 July 2026",
};

const headerCountdownCta = {
  label: "Get started",
  href: "#hero-banner",
};

const heroContent = {
  logo: {
    src: heroLogo,
    alt: "FIFA World Cup 26 logo",
  },
  label: "11 jun - 19 jul 2026",
  title: "There's whole World Cup experience only on DAZN",
  subtitle: "Access all 104 matches live in 4K HDR across USA, Canada, and Mexico.",
  price: {
    prefix: "From",
    value: "$19.99",
    oldPrice: "$29.99",
    suffix: "/month",
  },
  helperText: "Cancel anytime. Selected events and availability may vary by territory.",
};

const heroVideoMedia = {
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
};

const heroPhotoMedia = {
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
};

const heroFocus = {
  desktop: "center 50%",
  tablet: "center 42%",
  mobile: "center 40%",
};

const heroCarousel = {
  totalSlides: 4,
  activeIndex: 0,
};

const heroCtas = [
  { label: "Start Watching", href: "#hero-banner", variant: "primary" },
  { label: "Explore", href: "#hero-banner", variant: "secondary" },
];

const initialHeroSettings = {
  showDefaultHeader: false,
  mediaMode: "video",
  desktopTextAlign: "center",
  titleScale: "medium",
  showLogo: false,
  showLabel: false,
  showPrice: false,
  showHelperText: false,
  showSecondaryCta: false,
  showCarousel: false,
};

export default function App() {
  const [heroSettings, setHeroSettings] = useState(initialHeroSettings);

  const activeHeroMedia =
    heroSettings.mediaMode === "video" ? heroVideoMedia : heroPhotoMedia;

  const activeHeroCopy = useMemo(
    () => ({
      ...heroContent,
      helperText: heroSettings.showHelperText ? heroContent.helperText : "",
      label: heroSettings.showLabel ? heroContent.label : "",
      logo: heroSettings.showLogo ? heroContent.logo : null,
      price: heroSettings.showPrice ? heroContent.price : null,
    }),
    [
      heroSettings.showHelperText,
      heroSettings.showLabel,
      heroSettings.showLogo,
      heroSettings.showPrice,
    ],
  );

  const activeHeroCtas = useMemo(
    () =>
      heroSettings.showSecondaryCta ? heroCtas : heroCtas.filter((item) => item.variant !== "secondary"),
    [heroSettings.showSecondaryCta],
  );

  const heroLayout = useMemo(
    () => ({
      desktopAlign: heroSettings.desktopTextAlign,
      titleScale: heroSettings.titleScale,
    }),
    [heroSettings.desktopTextAlign, heroSettings.titleScale],
  );

  const settingsItems = [
    {
      id: "default-header",
      title: "Default header",
      description: "Switch between the simple DAZN header and the countdown header variant.",
      checked: heroSettings.showDefaultHeader,
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          showDefaultHeader: !current.showDefaultHeader,
        })),
      onLabel: "Default",
      offLabel: "Countdown",
    },
    {
      id: "hero-media-mode",
      title: "Hero video vs Photo",
      description: "Switch the live hero across all breakpoints between motion and still artwork.",
      checked: heroSettings.mediaMode === "video",
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          mediaMode: current.mediaMode === "video" ? "photo" : "video",
        })),
      onLabel: "Video",
      offLabel: "Photo",
    },
    {
      id: "hero-text-center",
      title: "Text center",
      description: "Desktop only. Centers the entire content stack and removes the left-biased scrim treatment.",
      checked: heroSettings.desktopTextAlign === "center",
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          desktopTextAlign: current.desktopTextAlign === "center" ? "left" : "center",
        })),
      onLabel: "Center",
      offLabel: "Left",
    },
    {
      id: "hero-medium-text",
      title: "Medium text",
      description: "Scales the hero title down from the default display size while keeping the same responsive logic.",
      checked: heroSettings.titleScale === "medium",
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          titleScale: current.titleScale === "medium" ? "default" : "medium",
        })),
      onLabel: "Medium",
      offLabel: "Default",
    },
    {
      id: "hero-logo",
      title: "Logo toggle",
      description: "Shows or hides the championship logo slot above the label.",
      checked: heroSettings.showLogo,
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          showLogo: !current.showLogo,
        })),
      onLabel: "Shown",
      offLabel: "Hidden",
    },
    {
      id: "hero-label",
      title: "Label",
      description: "Shows or hides the date chip below the logo slot.",
      checked: heroSettings.showLabel,
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          showLabel: !current.showLabel,
        })),
      onLabel: "Shown",
      offLabel: "Hidden",
    },
    {
      id: "hero-price",
      title: "Price",
      description: "Shows or hides the pricing row below the subtitle.",
      checked: heroSettings.showPrice,
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          showPrice: !current.showPrice,
        })),
      onLabel: "Shown",
      offLabel: "Hidden",
    },
    {
      id: "hero-helper-text",
      title: "Helper text",
      description: "Shows or hides the supporting text below the CTA group.",
      checked: heroSettings.showHelperText,
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          showHelperText: !current.showHelperText,
        })),
      onLabel: "Shown",
      offLabel: "Hidden",
    },
    {
      id: "hero-secondary-button",
      title: "Two buttons",
      description: "Shows or hides the secondary Explore CTA while keeping the primary action visible.",
      checked: heroSettings.showSecondaryCta,
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          showSecondaryCta: !current.showSecondaryCta,
        })),
      onLabel: "Two",
      offLabel: "One",
    },
  ];

  const carouselItem = {
    id: "hero-carousel",
    title: "Carousel",
    description: "Shows or hides the bottom carousel pagination prototype on the hero banner.",
    checked: heroSettings.showCarousel,
    onToggle: () =>
      setHeroSettings((current) => ({
        ...current,
        showCarousel: !current.showCarousel,
      })),
    onLabel: "On",
    offLabel: "Off",
  };

  return (
    <div className="app-shell">
      <div className="app-shell__inner">
        <Header
          countdownCta={headerCountdownCta}
          countdownTarget={headerCountdownTarget}
          eventBrand={headerEventBrand}
          logoSrc="https://static.dazndn.com/logos/dazn.svg"
          actions={headerActions}
          variant={heroSettings.showDefaultHeader ? "default" : "countdown"}
        />

        <HeroBanner
          alt="FIFA World Cup hero media inside the DAZN banner."
          carousel={heroSettings.showCarousel ? heroCarousel : null}
          copy={activeHeroCopy}
          cta={activeHeroCtas}
          focus={heroFocus}
          layout={heroLayout}
          media={activeHeroMedia}
        />

        <section aria-labelledby="upcoming-events-title" className="hero-followup">
          <div className="hero-followup__inner">
            <h2 className="hero-followup__title" id="upcoming-events-title">
              Upcoming events
            </h2>
          </div>
        </section>

        <HeroSettingsPanel carouselItem={carouselItem} items={settingsItems} />
      </div>
    </div>
  );
}
