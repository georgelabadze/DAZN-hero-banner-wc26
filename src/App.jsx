import { useMemo, useState } from "react";
import {
  buildHeroDeckForDisplay,
  CREATIVE_GUIDELINES_URL,
  HERO_GITHUB_URL,
  heroDefaultSettings,
  siteHeaderActions,
  siteHeaderCountdownCta,
  siteHeaderCountdownTarget,
  siteHeaderEventBrand,
  SITE_HEADER_LOGO_URL,
} from "./config/heroDemoConfig";
import HeroBanner from "./components/HeroBanner";
import HeroFooterLinks from "./components/HeroFooterLinks";
import HeroSettingsPanel from "./components/HeroSettingsPanel";
import SiteHeader from "./components/SiteHeader";

function toggleBooleanSetting(setState, key) {
  setState((current) => ({
    ...current,
    [key]: !current[key],
  }));
}

export default function App() {
  const [heroSettings, setHeroSettings] = useState(heroDefaultSettings);
  const activeHeroDeck = useMemo(
    () => buildHeroDeckForDisplay(heroSettings),
    [heroSettings],
  );

  const allSettingsItems = [
    {
      id: "header-mode",
      title: "Header",
      description:
        "Use the regular DAZN header for evergreen landing pages, or switch to the countdown version during a tournament or campaign.",
      checked: heroSettings.headerMode === "default",
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          headerMode: current.headerMode === "default" ? "countdown" : "default",
        })),
    },
    {
      id: "hero-media-mode",
      title: "Hero video / Photo",
      description:
        "The hero can use either video or a static image. The glow below the hero should adapt to whichever media type is used.",
      checked: heroSettings.mediaMode === "video",
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          mediaMode: current.mediaMode === "video" ? "photo" : "video",
        })),
    },
    {
      id: "hero-content-alignment",
      title: "Content alignment",
      description:
        "On desktop, hero content can be left aligned or centered. On smaller screens, content should always stay centered.",
      checked: heroSettings.contentAlignment === "center",
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          contentAlignment:
            current.contentAlignment === "center" ? "left" : "center",
        })),
    },
    {
      id: "hero-title-size",
      title: "Large title / Larger title",
      description:
        "The hero supports two approved title sizes. Use Large title for longer headlines, up to about 48 characters including spaces. Use Larger title for shorter headlines, ideally up to about 32 characters including spaces.",
      checked: heroSettings.titleSize === "large",
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          titleSize: current.titleSize === "large" ? "larger" : "large",
        })),
    },
    {
      id: "hero-theme",
      title: "Gold / Standard",
      description:
        "This controls how the key message is highlighted in the title and how the primary CTA looks. Use the gold style only to emphasize the most important part of the message.",
      checked: heroSettings.theme === "gold",
      onToggle: () =>
        setHeroSettings((current) => ({
          ...current,
          theme: current.theme === "gold" ? "standard" : "gold",
        })),
    },
    {
      id: "hero-logo",
      title: "Logo",
      description:
        "A logo can be added above the label, but avoid using it when the creative is already busy or includes logos, badges, or small detailed elements.",
      checked: heroSettings.showLogo,
      onToggle: () => toggleBooleanSetting(setHeroSettings, "showLogo"),
    },
    {
      id: "hero-label",
      title: "Label",
      description:
        "This is mainly used for an event date or time period, but it can also be used for an offer, promotion, or discount message.",
      checked: heroSettings.showLabel,
      onToggle: () => toggleBooleanSetting(setHeroSettings, "showLabel"),
    },
    {
      id: "hero-price",
      title: "Price",
      description: "Use this when pricing needs to be shown in the hero.",
      checked: heroSettings.showPrice,
      onToggle: () => toggleBooleanSetting(setHeroSettings, "showPrice"),
    },
    {
      id: "hero-secondary-cta",
      title: "Secondary CTA",
      description:
        "Use this when there is a second action alongside the primary CTA.",
      checked: heroSettings.showSecondaryCta,
      onToggle: () => toggleBooleanSetting(setHeroSettings, "showSecondaryCta"),
    },
    {
      id: "hero-helper-text",
      title: "Helper text",
      description:
        "This sits below the CTA area and can be used for extra conditions, legal copy, or rights-related links.",
      checked: heroSettings.showHelperText,
      onToggle: () => toggleBooleanSetting(setHeroSettings, "showHelperText"),
    },
  ];

  const allFooterItems = [
    {
      id: "hero-carousel",
      title: "Carousel",
      description:
        "The hero should be able to work as a slider when there are multiple promotions to show.",
      checked: heroSettings.showCarousel,
      onToggle: () => toggleBooleanSetting(setHeroSettings, "showCarousel"),
    },
    {
      id: "hero-creative-blueprint",
      title: "Creative Blueprint",
      description:
        "Switches the hero to the blueprint artwork set for desktop, tablet, and mobile.",
      checked: heroSettings.showCreativeBlueprint,
      onToggle: () =>
        toggleBooleanSetting(setHeroSettings, "showCreativeBlueprint"),
    },
  ];

  const settingsItems = heroSettings.showCarousel
    ? allSettingsItems.filter((item) => item.id === "header-mode")
    : allSettingsItems;

  const footerItems = heroSettings.showCarousel
    ? allFooterItems.filter((item) => item.id === "hero-carousel")
    : allFooterItems;

  return (
    <div className="app-shell">
      <div className="app-shell__inner">
        <SiteHeader
          actions={siteHeaderActions}
          countdownCta={siteHeaderCountdownCta}
          countdownTarget={siteHeaderCountdownTarget}
          eventBrand={siteHeaderEventBrand}
          logoSrc={SITE_HEADER_LOGO_URL}
          variant={heroSettings.headerMode}
        />

        <HeroBanner
          deck={activeHeroDeck}
        />

        <HeroSettingsPanel footerItems={footerItems} items={settingsItems} />
        <HeroFooterLinks
          creativeGuidelinesUrl={CREATIVE_GUIDELINES_URL}
          githubUrl={HERO_GITHUB_URL}
        />
      </div>
    </div>
  );
}
