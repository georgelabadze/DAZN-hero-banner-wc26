import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./HeroEditorIcons";
import {
  createSlideEditorDraft,
  detectFileKind,
} from "../utils/heroSlideEditor";

function useFilePreviewUrl(file) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!(file instanceof File)) {
      setPreviewUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);

    setPreviewUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [file]);

  return previewUrl;
}

function ModalToggle({ checked, onToggle }) {
  return (
    <button
      aria-checked={checked}
      className={`hero-slide-editor__toggle ${checked ? "hero-slide-editor__toggle--active" : ""}`}
      onClick={onToggle}
      role="switch"
      type="button"
    >
      <span className="hero-slide-editor__toggle-track">
        <span className="hero-slide-editor__toggle-thumb" />
      </span>
    </button>
  );
}

function EditorRow({
  children,
  control = null,
  description = "",
  isChild = false,
  title = "",
}) {
  return (
    <article
      className={`hero-slide-editor__row ${isChild ? "hero-slide-editor__row--child" : ""}`}
    >
      {control ? <div className="hero-slide-editor__row-control">{control}</div> : null}

      <div className="hero-slide-editor__row-content">
        {title ? <h3 className="hero-slide-editor__row-title">{title}</h3> : null}
        {description ? (
          <p className="hero-slide-editor__row-description">{description}</p>
        ) : null}
        {children}
      </div>
    </article>
  );
}

function TextInput({
  id,
  onChange,
  placeholder,
  rows = 1,
  value,
}) {
  if (rows > 1) {
    return (
      <textarea
        className="hero-slide-editor__textarea"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    );
  }

  return (
    <input
      className="hero-slide-editor__input"
      id={id}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
}

function SegmentedChoice({ name, onChange, options, value }) {
  return (
    <div className="hero-slide-editor__segmented" role="group" aria-label={name}>
      {options.map((option) => (
        <button
          key={`${name}-${option.value}`}
          className={`hero-slide-editor__segmented-option ${value === option.value ? "hero-slide-editor__segmented-option--active" : ""}`}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function DragHandle() {
  return (
    <span aria-hidden="true" className="hero-slide-editor__drag-handle">
      <span />
      <span />
    </span>
  );
}

function getActiveAsset(slot) {
  if (!slot) {
    return null;
  }

  if (slot.sourceMode === "upload" && slot.file instanceof File) {
    return {
      kind: detectFileKind(slot.file),
      label: slot.file.name,
      file: slot.file,
    };
  }

  if (slot.sourceMode === "link" && slot.url?.trim()) {
    return {
      kind: "image",
      label: slot.url.trim(),
      src: slot.url.trim(),
    };
  }

  if (slot.sourceMode === "current" && slot.current?.src) {
    return {
      kind: slot.current.kind === "video" ? "video" : "image",
      label: slot.current.label || slot.current.src,
      poster: slot.current.poster || "",
      src: slot.current.src,
    };
  }

  return null;
}

function AssetPreview({ asset }) {
  const uploadPreviewUrl = useFilePreviewUrl(asset?.file);

  if (!asset) {
    return null;
  }

  const previewSrc = asset.file ? uploadPreviewUrl : asset.src;

  if (!previewSrc) {
    return null;
  }

  return (
    <div className="hero-slide-editor__preview">
      {asset.kind === "video" ? (
        <video
          autoPlay
          className="hero-slide-editor__preview-media"
          loop
          muted
          playsInline
          poster={asset.poster || undefined}
          src={previewSrc}
        />
      ) : (
        <img
          alt=""
          className="hero-slide-editor__preview-media"
          src={previewSrc}
        />
      )}
      <span className="hero-slide-editor__preview-label">{asset.label}</span>
    </div>
  );
}

function AssetSourceFields({
  fieldPrefix,
  onClearUpload,
  onFileChange,
  onModeChange,
  onUrlChange,
  slot,
  title,
  type,
}) {
  const inputId = `${fieldPrefix}-${title.toLowerCase().replace(/\s+/g, "-")}-file`;
  const urlId = `${fieldPrefix}-${title.toLowerCase().replace(/\s+/g, "-")}-url`;
  const activeAsset = useMemo(() => getActiveAsset(slot), [slot]);
  const isLogo = type === "logo";

  return (
    <>
      <SegmentedChoice
        name={`${title} source`}
        onChange={onModeChange}
        options={[
          { label: "Keep current", value: "current" },
          { label: "Add link", value: "link" },
          { label: "Upload from device", value: "upload" },
        ]}
        value={slot.sourceMode}
      />

      {slot.sourceMode === "link" ? (
        <TextInput
          id={urlId}
          onChange={onUrlChange}
          placeholder={isLogo ? "Paste logo image URL" : "Paste background image URL"}
          value={slot.url}
        />
      ) : null}

      {slot.sourceMode === "upload" ? (
        <div className="hero-slide-editor__media-actions">
          <label className="hero-slide-editor__upload-button" htmlFor={inputId}>
            {isLogo ? "Upload logo" : "Upload image or video"}
          </label>
          <input
            className="hero-slide-editor__file-input"
            id={inputId}
            accept={isLogo ? "image/*" : "image/*,video/*"}
            onChange={onFileChange}
            type="file"
          />
          {slot.file ? (
            <button
              className="hero-slide-editor__secondary-action"
              onClick={onClearUpload}
              type="button"
            >
              Reset upload
            </button>
          ) : null}
        </div>
      ) : null}

      {activeAsset ? <AssetPreview asset={activeAsset} /> : null}
    </>
  );
}

export default function HeroSlideEditorModal({
  isOpen,
  onClose,
  onSaveAsNewSlide,
  onSaveChanges,
  slide,
}) {
  const fieldPrefix = useId();
  const [draft, setDraft] = useState(() => createSlideEditorDraft(slide));
  const [isDirty, setIsDirty] = useState(false);
  const [draggingTitlePart, setDraggingTitlePart] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setDraft(createSlideEditorDraft(slide));
    setIsDirty(false);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, slide]);

  if (!isOpen || !slide) {
    return null;
  }

  const updateDraft = (updater) => {
    setDraft((current) =>
      typeof updater === "function" ? updater(current) : { ...current, ...updater },
    );
    setIsDirty(true);
  };

  const updateMediaSlot = (viewport, updater) => {
    updateDraft((current) => ({
      ...current,
      media: {
        ...current.media,
        [viewport]:
          typeof updater === "function"
            ? updater(current.media[viewport])
            : {
                ...current.media[viewport],
                ...updater,
              },
      },
    }));
  };

  const updateLogoSlot = (updater) => {
    updateDraft((current) => ({
      ...current,
      logo:
        typeof updater === "function"
          ? updater(current.logo)
          : {
              ...current.logo,
              ...updater,
            },
    }));
  };

  const titleRows =
    draft.titleOrder === "accent-first"
      ? ["accent", "lead"]
      : ["lead", "accent"];

  const handleTitleRowDrop = (targetKey) => {
    if (!draggingTitlePart || draggingTitlePart === targetKey) {
      setDraggingTitlePart("");
      return;
    }

    updateDraft({
      titleOrder: draggingTitlePart === "accent" ? "accent-first" : "lead-first",
    });
    setDraggingTitlePart("");
  };

  return createPortal(
    <div className="hero-slide-editor" role="presentation">
      <div
        aria-labelledby={`${fieldPrefix}-title`}
        aria-modal="true"
        className="hero-slide-editor__dialog"
        role="dialog"
      >
        <div className="hero-slide-editor__header">
          <h2 className="hero-slide-editor__title" id={`${fieldPrefix}-title`}>
            Edit slide
          </h2>

          <button
            aria-label="Close slide editor"
            className="hero-slide-editor__close"
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="hero-slide-editor__body">
          <EditorRow title="Content alignment">
            <SegmentedChoice
              name="content alignment"
              onChange={(value) => updateDraft({ contentAlignment: value })}
              options={[
                { label: "Centered", value: "center" },
                { label: "Left", value: "left" },
              ]}
              value={draft.contentAlignment}
            />
          </EditorRow>

          <EditorRow title="Theme">
            <SegmentedChoice
              name="theme"
              onChange={(value) => updateDraft({ theme: value })}
              options={[
                { label: "Gold", value: "gold" },
                { label: "Standard", value: "standard" },
              ]}
              value={draft.theme}
            />
          </EditorRow>

          <EditorRow title="Title size">
            <SegmentedChoice
              name="title size"
              onChange={(value) => updateDraft({ titleSize: value })}
              options={[
                { label: "Large", value: "large" },
                { label: "Larger", value: "larger" },
              ]}
              value={draft.titleSize}
            />
          </EditorRow>

          {titleRows.map((itemKey) => {
            const isAccent = itemKey === "accent";

            return (
              <article
                key={itemKey}
                className={`hero-slide-editor__row hero-slide-editor__row--draggable ${
                  draggingTitlePart === itemKey
                    ? "hero-slide-editor__row--dragging"
                    : ""
                }`}
                draggable
                onDragEnd={() => setDraggingTitlePart("")}
                onDragOver={(event) => event.preventDefault()}
                onDragStart={() => setDraggingTitlePart(itemKey)}
                onDrop={() => handleTitleRowDrop(itemKey)}
              >
                <div className="hero-slide-editor__row-control">
                  <DragHandle />
                </div>

                <div className="hero-slide-editor__row-content">
                  <h3 className="hero-slide-editor__row-title">
                    {isAccent ? "Title accent" : "Title lead"}
                  </h3>
                  <TextInput
                    id={`${fieldPrefix}-${isAccent ? "title-accent" : "title-lead"}`}
                    onChange={(value) =>
                      updateDraft(
                        isAccent ? { titleAccent: value } : { titleLead: value },
                      )
                    }
                    placeholder={
                      isAccent
                        ? "experience only on DAZN"
                        : "There’s whole World Cup"
                    }
                    rows={2}
                    value={isAccent ? draft.titleAccent : draft.titleLead}
                  />
                </div>
              </article>
            );
          })}

          <EditorRow
            control={
              <ModalToggle
                checked={draft.showLabel}
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showLabel: !current.showLabel,
                  }))
                }
              />
            }
            title="Label"
          />

          {draft.showLabel ? (
            <EditorRow isChild title="Label text">
              <TextInput
                id={`${fieldPrefix}-label`}
                onChange={(value) => updateDraft({ label: value })}
                placeholder="11 jun - 19 jul 2026"
                value={draft.label}
              />
            </EditorRow>
          ) : null}

          <EditorRow
            control={
              <ModalToggle
                checked={draft.showSubtitle}
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showSubtitle: !current.showSubtitle,
                  }))
                }
              />
            }
            title="Subtitle"
          />

          {draft.showSubtitle ? (
            <EditorRow isChild title="Subtitle text">
              <TextInput
                id={`${fieldPrefix}-subtitle`}
                onChange={(value) => updateDraft({ subtitle: value })}
                placeholder="Access all 104 matches live in 4K HDR..."
                rows={3}
                value={draft.subtitle}
              />
            </EditorRow>
          ) : null}

          <EditorRow
            control={
              <ModalToggle
                checked={draft.showPrice}
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showPrice: !current.showPrice,
                  }))
                }
              />
            }
            title="Price"
          />

          {draft.showPrice ? (
            <>
              <EditorRow isChild title="Price prefix">
                <TextInput
                  id={`${fieldPrefix}-price-prefix`}
                  onChange={(value) => updateDraft({ pricePrefix: value })}
                  placeholder="From"
                  value={draft.pricePrefix}
                />
              </EditorRow>

              <EditorRow isChild title="Price value">
                <TextInput
                  id={`${fieldPrefix}-price-value`}
                  onChange={(value) => updateDraft({ priceValue: value })}
                  placeholder="$19.99"
                  value={draft.priceValue}
                />
              </EditorRow>

              <EditorRow isChild title="Old price">
                <TextInput
                  id={`${fieldPrefix}-price-old`}
                  onChange={(value) => updateDraft({ priceOldPrice: value })}
                  placeholder="$29.99"
                  value={draft.priceOldPrice}
                />
              </EditorRow>

              <EditorRow isChild title="Price suffix">
                <TextInput
                  id={`${fieldPrefix}-price-suffix`}
                  onChange={(value) => updateDraft({ priceSuffix: value })}
                  placeholder="/month"
                  value={draft.priceSuffix}
                />
              </EditorRow>
            </>
          ) : null}

          <EditorRow title={draft.showTwoButtons ? "Gold button label" : "Primary CTA label"}>
            <TextInput
              id={`${fieldPrefix}-primary-cta`}
              onChange={(value) => updateDraft({ primaryCtaLabel: value })}
              placeholder="Get started"
              value={draft.primaryCtaLabel}
            />
          </EditorRow>

          <EditorRow
            control={
              <ModalToggle
                checked={draft.showTwoButtons}
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showTwoButtons: !current.showTwoButtons,
                  }))
                }
              />
            }
            title="Two buttons"
          />

          {draft.showTwoButtons ? (
            <>
              <EditorRow isChild title="Standard button label">
                <TextInput
                  id={`${fieldPrefix}-secondary-cta`}
                  onChange={(value) => updateDraft({ secondaryCtaLabel: value })}
                  placeholder="Explore"
                  value={draft.secondaryCtaLabel}
                />
              </EditorRow>

              <EditorRow
                control={
                  <ModalToggle
                    checked={draft.showBestValue}
                    onToggle={() =>
                      updateDraft((current) => ({
                        ...current,
                        showBestValue: !current.showBestValue,
                        bestValueText:
                          !current.showBestValue && !current.bestValueText?.trim()
                            ? "Best value"
                            : current.bestValueText,
                      }))
                    }
                  />
                }
                isChild
                title="Best value"
              />

              {draft.showBestValue ? (
                <EditorRow isChild title="Best value text">
                  <TextInput
                    id={`${fieldPrefix}-best-value`}
                    onChange={(value) => updateDraft({ bestValueText: value })}
                    placeholder="Best value"
                    value={draft.bestValueText}
                  />
                </EditorRow>
              ) : null}
            </>
          ) : null}

          <EditorRow
            control={
              <ModalToggle
                checked={draft.showHelperText}
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showHelperText: !current.showHelperText,
                  }))
                }
              />
            }
            title="Helper text"
          />

          {draft.showHelperText ? (
            <EditorRow isChild title="Helper text copy">
              <TextInput
                id={`${fieldPrefix}-helper`}
                onChange={(value) => updateDraft({ helperText: value })}
                placeholder="Cancel anytime..."
                rows={3}
                value={draft.helperText}
              />
            </EditorRow>
          ) : null}

          <EditorRow
            control={
              <ModalToggle
                checked={draft.showPpvBadge}
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showPpvBadge: !current.showPpvBadge,
                  }))
                }
              />
            }
            title="PPV badge"
          />

          <EditorRow
            control={
              <ModalToggle
                checked={draft.showLogo}
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showLogo: !current.showLogo,
                  }))
                }
              />
            }
            title="Logo"
          />

          {draft.showLogo ? (
            <EditorRow isChild title="Logo source">
              <AssetSourceFields
                fieldPrefix={fieldPrefix}
                onClearUpload={() =>
                  updateLogoSlot((current) => ({
                    ...current,
                    file: null,
                  }))
                }
                onFileChange={(event) => {
                  const [file] = Array.from(event.target.files ?? []);
                  updateLogoSlot((current) => ({
                    ...current,
                    file: file ?? null,
                    sourceMode: "upload",
                  }));
                  event.target.value = "";
                }}
                onModeChange={(value) =>
                  updateLogoSlot((current) => ({
                    ...current,
                    sourceMode: value,
                  }))
                }
                onUrlChange={(value) =>
                  updateLogoSlot((current) => ({
                    ...current,
                    sourceMode: "link",
                    url: value,
                  }))
                }
                slot={draft.logo}
                title="Logo"
                type="logo"
              />
            </EditorRow>
          ) : null}

          <EditorRow
            title="Desktop media"
          >
            <AssetSourceFields
              fieldPrefix={fieldPrefix}
              onClearUpload={() =>
                updateMediaSlot("desktop", (current) => ({
                  ...current,
                  file: null,
                }))
              }
              onFileChange={(event) => {
                const [file] = Array.from(event.target.files ?? []);
                updateMediaSlot("desktop", (current) => ({
                  ...current,
                  file: file ?? null,
                  sourceMode: "upload",
                }));
                event.target.value = "";
              }}
              onModeChange={(value) =>
                updateMediaSlot("desktop", (current) => ({
                  ...current,
                  sourceMode: value,
                }))
              }
              onUrlChange={(value) =>
                updateMediaSlot("desktop", (current) => ({
                  ...current,
                  sourceMode: "link",
                  url: value,
                }))
              }
              slot={draft.media.desktop}
              title="Desktop media"
              type="media"
            />
          </EditorRow>

          <EditorRow
            title="Tablet media"
          >
            <AssetSourceFields
              fieldPrefix={fieldPrefix}
              onClearUpload={() =>
                updateMediaSlot("tablet", (current) => ({
                  ...current,
                  file: null,
                }))
              }
              onFileChange={(event) => {
                const [file] = Array.from(event.target.files ?? []);
                updateMediaSlot("tablet", (current) => ({
                  ...current,
                  file: file ?? null,
                  sourceMode: "upload",
                }));
                event.target.value = "";
              }}
              onModeChange={(value) =>
                updateMediaSlot("tablet", (current) => ({
                  ...current,
                  sourceMode: value,
                }))
              }
              onUrlChange={(value) =>
                updateMediaSlot("tablet", (current) => ({
                  ...current,
                  sourceMode: "link",
                  url: value,
                }))
              }
              slot={draft.media.tablet}
              title="Tablet media"
              type="media"
            />
          </EditorRow>

          <EditorRow
            title="Mobile media"
          >
            <AssetSourceFields
              fieldPrefix={fieldPrefix}
              onClearUpload={() =>
                updateMediaSlot("mobile", (current) => ({
                  ...current,
                  file: null,
                }))
              }
              onFileChange={(event) => {
                const [file] = Array.from(event.target.files ?? []);
                updateMediaSlot("mobile", (current) => ({
                  ...current,
                  file: file ?? null,
                  sourceMode: "upload",
                }));
                event.target.value = "";
              }}
              onModeChange={(value) =>
                updateMediaSlot("mobile", (current) => ({
                  ...current,
                  sourceMode: value,
                }))
              }
              onUrlChange={(value) =>
                updateMediaSlot("mobile", (current) => ({
                  ...current,
                  sourceMode: "link",
                  url: value,
                }))
              }
              slot={draft.media.mobile}
              title="Mobile media"
              type="media"
            />
          </EditorRow>
        </div>

        <div className="hero-slide-editor__footer">
          <button
            className="hero-slide-editor__button hero-slide-editor__button--ghost"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="hero-slide-editor__button hero-slide-editor__button--secondary"
            onClick={() => onSaveAsNewSlide(draft)}
            type="button"
          >
            Save as new slide
          </button>
          <button
            className="hero-slide-editor__button hero-slide-editor__button--primary"
            onClick={() => onSaveChanges(draft)}
            type="button"
          >
            {isDirty ? "Save changes" : "Save current slide"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
