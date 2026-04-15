import { createHeroRuntimeSlide } from "../config/heroDemoConfig";

function getTitleParts(title) {
  if (!title) {
    return { lead: "", accent: "", order: "lead-first" };
  }

  if (typeof title === "string") {
    return { lead: title, accent: "", order: "lead-first" };
  }

  return {
    lead: typeof title.lead === "string" ? title.lead : "",
    accent: typeof title.accent === "string" ? title.accent : "",
    order: title.order === "accent-first" ? "accent-first" : "lead-first",
  };
}

function getPriceParts(price) {
  if (!price) {
    return {
      prefix: "",
      value: "",
      oldPrice: "",
      suffix: "",
    };
  }

  if (typeof price === "string") {
    return {
      prefix: "",
      value: price,
      oldPrice: "",
      suffix: "",
    };
  }

  return {
    prefix: typeof price.prefix === "string" ? price.prefix : "",
    value: typeof price.value === "string" ? price.value : "",
    oldPrice: typeof price.oldPrice === "string" ? price.oldPrice : "",
    suffix: typeof price.suffix === "string" ? price.suffix : "",
  };
}

function getAssetLabel(src) {
  if (typeof src !== "string" || !src.trim()) {
    return "";
  }

  const [withoutHash] = src.split("#");
  const [withoutQuery] = withoutHash.split("?");
  const parts = withoutQuery.split("/");

  return parts[parts.length - 1] || src;
}

function getDefaultSourceMode(hasCurrentAsset) {
  return hasCurrentAsset ? "current" : "upload";
}

function createEditableMediaSlot(mediaItem) {
  const hasCurrentAsset = Boolean(mediaItem?.src);

  return {
    file: null,
    sourceMode: getDefaultSourceMode(hasCurrentAsset),
    url: "",
    alt: typeof mediaItem?.alt === "string" ? mediaItem.alt : "",
    current: hasCurrentAsset
      ? {
          alt: typeof mediaItem.alt === "string" ? mediaItem.alt : "",
          kind: mediaItem.kind === "video" ? "video" : "image",
          label: getAssetLabel(mediaItem.src),
          poster: typeof mediaItem.poster === "string" ? mediaItem.poster : "",
          src: mediaItem.src,
        }
      : null,
  };
}

function createEditableLogoSlot(logo) {
  const hasCurrentAsset = Boolean(logo?.src);

  return {
    file: null,
    sourceMode: getDefaultSourceMode(hasCurrentAsset),
    url: "",
    alt: typeof logo?.alt === "string" ? logo.alt : "",
    current: hasCurrentAsset
      ? {
          alt: typeof logo.alt === "string" ? logo.alt : "",
          label: getAssetLabel(logo.src),
          src: logo.src,
        }
      : null,
  };
}

export function detectFileKind(file) {
  if (!file) {
    return "image";
  }

  if (typeof file.type === "string" && file.type.startsWith("video/")) {
    return "video";
  }

  return "image";
}

function buildMediaPayload(slot) {
  if (slot?.sourceMode === "upload" && slot?.file instanceof File) {
    return {
      url: URL.createObjectURL(slot.file),
      alt: slot.alt?.trim() || slot.file.name || "",
      kind: detectFileKind(slot.file),
    };
  }

  if (slot?.sourceMode === "link" && slot?.url?.trim()) {
    return {
      url: slot.url.trim(),
      alt: slot.alt?.trim() || "",
      kind: "image",
    };
  }

  if (slot?.sourceMode === "current" && slot?.current?.src) {
    return {
      url: slot.current.src,
      posterUrl: slot.current.poster || "",
      alt: slot.alt?.trim() || slot.current.alt || "",
      kind: slot.current.kind,
    };
  }

  return null;
}

function buildLogoPayload(showLogo, logo) {
  if (!showLogo) {
    return null;
  }

  if (logo?.sourceMode === "upload" && logo?.file instanceof File) {
    return {
      url: URL.createObjectURL(logo.file),
      alt: logo.alt?.trim() || logo.file.name || "",
    };
  }

  if (logo?.sourceMode === "link" && logo?.url?.trim()) {
    return {
      url: logo.url.trim(),
      alt: logo.alt?.trim() || "",
    };
  }

  if (logo?.sourceMode === "current" && logo?.current?.src) {
    return {
      url: logo.current.src,
      alt: logo.alt?.trim() || logo.current.alt || "",
    };
  }

  return null;
}

export function createSlideEditorDraft(slide) {
  const title = getTitleParts(slide?.title);
  const price = getPriceParts(slide?.price);

  return {
    contentAlignment:
      slide?.layout?.contentAlignment === "left" ? "left" : "center",
    theme: slide?.layout?.theme === "standard" ? "standard" : "gold",
    titleSize: slide?.layout?.titleSize === "larger" ? "larger" : "large",
    titleLead: title.lead,
    titleAccent: title.accent,
    titleOrder: title.order,
    showSubtitle: Boolean(slide?.subtitle),
    subtitle: typeof slide?.subtitle === "string" ? slide.subtitle : "",
    showPrice: Boolean(slide?.price),
    pricePrefix: price.prefix,
    priceValue: price.value,
    priceOldPrice: price.oldPrice,
    priceSuffix: price.suffix,
    showLogo: Boolean(slide?.logo?.src),
    logo: createEditableLogoSlot(slide?.logo),
    showLabel: Boolean(slide?.label),
    label: typeof slide?.label === "string" ? slide.label : "",
    primaryCtaLabel:
      typeof slide?.primaryCta?.label === "string" ? slide.primaryCta.label : "",
    showTwoButtons:
      slide?.ctaLayout === "dual" && Boolean(slide?.secondaryCta?.label),
    secondaryCtaLabel:
      typeof slide?.secondaryCta?.label === "string"
        ? slide.secondaryCta.label
        : "",
    showBestValue: Boolean(slide?.goldButtonNote),
    bestValueText:
      typeof slide?.goldButtonNote === "string" && slide.goldButtonNote.trim()
        ? slide.goldButtonNote
        : "Best value",
    showHelperText: Boolean(slide?.helperText),
    helperText: typeof slide?.helperText === "string" ? slide.helperText : "",
    showPpvBadge: Boolean(slide?.ppvBadge),
    media: {
      desktop: createEditableMediaSlot(slide?.media?.desktop),
      tablet: createEditableMediaSlot(slide?.media?.tablet),
      mobile: createEditableMediaSlot(slide?.media?.mobile),
    },
  };
}

export function buildHeroSlideFromDraft({
  draft,
  slideId,
  sourceSlide,
  slideIndex = 0,
}) {
  const primaryHref = sourceSlide?.primaryCta?.href || "#hero-banner";
  const secondaryHref = sourceSlide?.secondaryCta?.href || "#hero-banner";
  const titleLead = typeof draft.titleLead === "string" ? draft.titleLead.trim() : "";
  const titleAccent =
    typeof draft.titleAccent === "string" ? draft.titleAccent.trim() : "";

  return createHeroRuntimeSlide(
    {
      id: slideId,
      layout: {
        contentAlignment: draft.contentAlignment === "left" ? "left" : "center",
        theme: draft.theme === "standard" ? "standard" : "gold",
        titleSize: draft.titleSize === "larger" ? "larger" : "large",
      },
      ctaLayout: draft.showTwoButtons ? "dual" : "single",
      focus: sourceSlide?.focus,
      media: {
        desktop: buildMediaPayload(draft.media?.desktop),
        tablet: buildMediaPayload(draft.media?.tablet),
        mobile: buildMediaPayload(draft.media?.mobile),
      },
      ppvBadge: Boolean(draft.showPpvBadge),
      logo: buildLogoPayload(draft.showLogo, draft.logo),
      label: draft.showLabel ? draft.label : "",
      title: {
        lead: titleLead,
        accent: titleAccent,
        order: draft.titleOrder === "accent-first" ? "accent-first" : "lead-first",
        size: draft.titleSize,
      },
      subtitle: draft.showSubtitle ? draft.subtitle : "",
      price: draft.showPrice
        ? {
            prefix: draft.pricePrefix,
            value: draft.priceValue,
            oldPrice: draft.priceOldPrice,
            suffix: draft.priceSuffix,
          }
        : null,
      primaryCta: {
        label: draft.primaryCtaLabel,
        href: primaryHref,
      },
      secondaryCta: draft.showTwoButtons
        ? {
            label: draft.secondaryCtaLabel,
            href: secondaryHref,
          }
        : null,
      goldButtonNote:
        draft.showTwoButtons && draft.showBestValue
          ? draft.bestValueText?.trim() || "Best value"
          : "",
      helperText: draft.showHelperText ? draft.helperText : "",
    },
    slideIndex,
  );
}

export function getBlobUrlsFromSlide(slide) {
  const urls = [];

  if (slide?.logo?.src?.startsWith("blob:")) {
    urls.push(slide.logo.src);
  }

  ["desktop", "tablet", "mobile"].forEach((viewport) => {
    const mediaItem = slide?.media?.[viewport];

    if (mediaItem?.src?.startsWith("blob:")) {
      urls.push(mediaItem.src);
    }

    if (mediaItem?.poster?.startsWith("blob:")) {
      urls.push(mediaItem.poster);
    }
  });

  return urls;
}
