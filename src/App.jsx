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
  label: "Log in",
  href: "#hero-banner",
};

const heroContent = {
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
  { label: "Get started", href: "#hero-banner", variant: "primary" },
  { label: "Explore", href: "#hero-banner", variant: "secondary" },
];

const initialHeroSettings = {
  showDefaultHeader: false,
  mediaMode: "video",
  desktopTextAlign: "center",
  titleScale: "medium",
  goldTheme: true,
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
      goldTheme: heroSettings.goldTheme,
      titleScale: heroSettings.titleScale,
    }),
    [heroSettings.desktopTextAlign, heroSettings.goldTheme, heroSettings.titleScale],
  );

  const settingsItems = [
    {
      id: "default-header",
      title: "Header",
      description: "Use the regular DAZN header for evergreen landing pages, or switch to the countdown version during a tournament or campaign.",
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
      title: "Hero video / Photo",
      description: "The hero can use either video or a static image. The glow below the hero should adapt to whichever media type is used.",
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
      title: "Content alignment",
      description: "On desktop, hero content can be left aligned or centered. On smaller screens, content should always stay centered.",
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
      title: "Large title / Larger title",
      description: "The hero supports two approved title sizes. Use Large title for longer headlines, up to about 48 characters including spaces. Use Larger title for shorter headlines, ideally up to about 32 characters including spaces.",
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
      id: "hero-gold-theme",
      title: "Gold / Standard",
      description: "This controls how the key message is highlighted in the title and how the primary CTA looks. Use the gold style only to emphasize the most important part of the message.",
      checked: heroSettings.goldTheme,
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          goldTheme: !current.goldTheme,
        })),
      onLabel: "Gold",
      offLabel: "Standard",
    },
    {
      id: "hero-logo",
      title: "Logo",
      description: "A logo can be added above the label, but avoid using it when the creative is already busy or includes logos, badges, or small detailed elements.",
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
      description: "This is mainly used for an event date or time period, but it can also be used for an offer, promotion, or discount message.",
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
      description: "Use this when pricing needs to be shown in the hero.",
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
      id: "hero-secondary-button",
      title: "Secondary CTA",
      description: "Use this when there is a second action alongside the primary CTA.",
      checked: heroSettings.showSecondaryCta,
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          showSecondaryCta: !current.showSecondaryCta,
        })),
      onLabel: "Two",
      offLabel: "One",
    },
    {
      id: "hero-helper-text",
      title: "Helper text",
      description: "This sits below the CTA area and can be used for extra conditions, legal copy, or rights-related links.",
      checked: heroSettings.showHelperText,
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          showHelperText: !current.showHelperText,
        })),
      onLabel: "Shown",
      offLabel: "Hidden",
    },
  ];

  const carouselItem = {
    id: "hero-carousel",
    title: "Carousel",
    description: "The hero should be able to work as a slider when there are multiple promotions to show.",
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

        <HeroSettingsPanel carouselItem={carouselItem} items={settingsItems} />
      </div>
    </div>
  );
}
