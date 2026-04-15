import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildStaticHeroDeckForDisplay,
  buildHeroDeckForDisplay,
  HERO_GITHUB_URL,
  HERO_RESOURCE_LINKS,
  heroDefaultSettings,
  siteHeaderActions,
  siteHeaderCountdownCta,
  siteHeaderCountdownTarget,
  siteHeaderEventBrand,
  SITE_HEADER_LOGO_URL,
} from "./config/heroDemoConfig";
import HeroBanner from "./components/HeroBanner";
import HeroFooterLinks from "./components/HeroFooterLinks";
import HeroSlideEditorModal from "./components/HeroSlideEditorModal";
import HeroSettingsPanel from "./components/HeroSettingsPanel";
import SiteHeader from "./components/SiteHeader";
import {
  buildHeroSlideFromDraft,
  getBlobUrlsFromSlide,
} from "./utils/heroSlideEditor";

function toggleBooleanSetting(setState, key) {
  setState((current) => ({
    ...current,
    [key]: !current[key],
  }));
}

export default function App() {
  const [heroSettings, setHeroSettings] = useState(heroDefaultSettings);
  const [slideOverridesById, setSlideOverridesById] = useState({});
  const [customSlides, setCustomSlides] = useState([]);
  const [sessionDeckMode, setSessionDeckMode] = useState(null);
  const [activeSlideId, setActiveSlideId] = useState(null);
  const [preferredActiveSlideId, setPreferredActiveSlideId] = useState(null);
  const [editorTargetSlideId, setEditorTargetSlideId] = useState(null);
  const [isSlideEditorOpen, setIsSlideEditorOpen] = useState(false);
  const customSlideCounterRef = useRef(1);
  const trackedBlobUrlsRef = useRef(new Set());
  const baseHeroDeck = useMemo(
    () => buildHeroDeckForDisplay(heroSettings),
    [heroSettings],
  );
  const staticHeroDeck = useMemo(
    () => buildStaticHeroDeckForDisplay(heroSettings),
    [heroSettings],
  );
  const deckSource = useMemo(() => {
    const shouldUseStaticSessionDeck =
      heroSettings.showCarousel &&
      sessionDeckMode === "static" &&
      customSlides.length > 0;

    if (shouldUseStaticSessionDeck) {
      return {
        ...staticHeroDeck,
        mode: "carousel",
      };
    }

    return baseHeroDeck;
  }, [
    baseHeroDeck,
    customSlides.length,
    heroSettings.showCarousel,
    sessionDeckMode,
    staticHeroDeck,
  ]);
  const activeHeroDeck = useMemo(() => {
    const baseSlides = deckSource.slides.map(
      (slide) => slideOverridesById[slide.id] ?? slide,
    );
    const nextSlides =
      deckSource.mode === "carousel"
        ? [...baseSlides, ...customSlides]
        : baseSlides;

    return {
      ...deckSource,
      mode: deckSource.mode,
      slides: nextSlides,
    };
  }, [customSlides, deckSource, slideOverridesById]);
  const editorTargetSlide = useMemo(() => {
    const requestedSlideId = editorTargetSlideId || activeSlideId;

    if (!requestedSlideId) {
      return activeHeroDeck.slides[0] ?? null;
    }

    return (
      activeHeroDeck.slides.find((slide) => slide.id === requestedSlideId) ??
      activeHeroDeck.slides[0] ??
      null
    );
  }, [activeHeroDeck.slides, activeSlideId, editorTargetSlideId]);

  useEffect(() => {
    const activeUrls = new Set(
      [...Object.values(slideOverridesById), ...customSlides].flatMap((slide) =>
        getBlobUrlsFromSlide(slide),
      ),
    );

    trackedBlobUrlsRef.current.forEach((url) => {
      if (activeUrls.has(url)) {
        return;
      }

      URL.revokeObjectURL(url);
      trackedBlobUrlsRef.current.delete(url);
    });

    activeUrls.forEach((url) => {
      trackedBlobUrlsRef.current.add(url);
    });
  }, [customSlides, slideOverridesById]);

  useEffect(
    () => () => {
      trackedBlobUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      trackedBlobUrlsRef.current.clear();
    },
    [],
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
      id: "hero-two-buttons",
      title: "Two buttons",
      description:
        "Use this when the hero needs a standard button plus a highlighted gold button with an `or` divider between them.",
      checked: heroSettings.showTwoButtons,
      onToggle: () => toggleBooleanSetting(setHeroSettings, "showTwoButtons"),
    },
    {
      id: "hero-ppv-badge",
      title: "PPV badge",
      description:
        "Adds the PPV badge to the top-right corner of the banner.",
      checked: heroSettings.showPpvBadge,
      onToggle: () => toggleBooleanSetting(setHeroSettings, "showPpvBadge"),
    },
    ...(heroSettings.showTwoButtons
      ? [
          {
            id: "hero-best-value",
            title: "Best value",
            description:
              "Adds a small `Best value` note below the gold button when the two-button layout is active.",
            checked: heroSettings.showBestValue,
            isChild: true,
            onToggle: () => toggleBooleanSetting(setHeroSettings, "showBestValue"),
          },
        ]
      : []),
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

  const closeSlideEditor = () => {
    setIsSlideEditorOpen(false);
    setEditorTargetSlideId(null);
  };

  const buildEditedSlide = (draft, slideId) => {
    const slideIndex = activeHeroDeck.slides.findIndex((slide) => slide.id === slideId);

    return buildHeroSlideFromDraft({
      draft,
      slideId,
      slideIndex: slideIndex === -1 ? activeHeroDeck.slides.length : slideIndex,
      sourceSlide: editorTargetSlide,
    });
  };

  const handleSaveSlideChanges = (draft) => {
    if (!editorTargetSlide) {
      return;
    }

    const nextSlide = buildEditedSlide(draft, editorTargetSlide.id);
    const isCustomSlide = customSlides.some((slide) => slide.id === nextSlide.id);

    if (isCustomSlide) {
      setCustomSlides((current) =>
        current.map((slide) => (slide.id === nextSlide.id ? nextSlide : slide)),
      );
    } else {
      setSlideOverridesById((current) => ({
        ...current,
        [nextSlide.id]: nextSlide,
      }));
    }

    setPreferredActiveSlideId(nextSlide.id);
    closeSlideEditor();
  };

  const handleSaveAsNewSlide = (draft) => {
    if (!editorTargetSlide) {
      return;
    }

    const nextSlideId = `custom-slide-${customSlideCounterRef.current++}`;
    const nextSlide = buildEditedSlide(draft, nextSlideId);

    setCustomSlides((current) => [...current, nextSlide]);

    if (!heroSettings.showCarousel) {
      setSessionDeckMode("static");
      setHeroSettings((current) => ({
        ...current,
        showCarousel: true,
      }));
    }

    setPreferredActiveSlideId(nextSlide.id);
    closeSlideEditor();
  };

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
          isEditorOpen={isSlideEditorOpen}
          onActiveSlideChange={(slide) => {
            const nextSlideId = slide?.id ?? null;

            setActiveSlideId(nextSlideId);

            if (preferredActiveSlideId && nextSlideId === preferredActiveSlideId) {
              setPreferredActiveSlideId(null);
            }
          }}
          onRequestEditSlide={(slideId) => {
            setEditorTargetSlideId(slideId);
            setIsSlideEditorOpen(true);
          }}
          preferredActiveSlideId={preferredActiveSlideId}
        />

        <HeroSettingsPanel footerItems={footerItems} items={settingsItems} />
        <HeroFooterLinks
          githubUrl={HERO_GITHUB_URL}
          resourceLinks={HERO_RESOURCE_LINKS}
        />
        <HeroSlideEditorModal
          isOpen={isSlideEditorOpen}
          onClose={closeSlideEditor}
          onSaveAsNewSlide={handleSaveAsNewSlide}
          onSaveChanges={handleSaveSlideChanges}
          slide={editorTargetSlide}
        />
      </div>
    </div>
  );
}
