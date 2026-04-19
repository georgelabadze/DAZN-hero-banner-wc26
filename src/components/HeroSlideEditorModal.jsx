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

function SegmentedChoice({ name, onChange, options, value }) {
  return (
    <div className="hero-slide-editor__segmented" role="group" aria-label={name}>
      {options.map((option) => (
        <button
          key={`${name}-${option.value}`}
          className={`hero-slide-editor__segmented-option ${
            value === option.value ? "hero-slide-editor__segmented-option--active" : ""
          }`}
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
      <span />
    </span>
  );
}

function TextInput({
  id,
  muted = false,
  onChange,
  placeholder,
  value,
}) {
  return (
    <input
      className={`hero-slide-editor__input ${muted ? "hero-slide-editor__input--muted" : ""}`}
      id={id}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
}

function FormRow({ children, label }) {
  return (
    <div className="hero-slide-editor__row">
      <p className="hero-slide-editor__row-label">{label}</p>
      <div className="hero-slide-editor__row-value">{children}</div>
    </div>
  );
}

function ToggleRow({ checked, label, onToggle }) {
  return (
    <div className="hero-slide-editor__toggle-row">
      <p className="hero-slide-editor__row-label">{label}</p>
      <ModalToggle checked={checked} onToggle={onToggle} />
    </div>
  );
}

function Branch({ depth = 1 }) {
  return (
    <span
      aria-hidden="true"
      className={`hero-slide-editor__branch hero-slide-editor__branch--depth-${depth}`}
    />
  );
}

function NestedRow({ children, depth = 1, preview = false }) {
  return (
    <div
      className={`hero-slide-editor__nested-row ${
        preview ? "hero-slide-editor__nested-row--preview" : ""
      }`}
    >
      <Branch depth={depth} />
      <div className="hero-slide-editor__nested-content">{children}</div>
    </div>
  );
}

function getActiveAsset(slot) {
  if (!slot) {
    return null;
  }

  if (slot.file instanceof File) {
    return {
      kind: detectFileKind(slot.file),
      label: slot.file.name,
      file: slot.file,
    };
  }

  if (slot.url?.trim()) {
    return {
      kind: "image",
      label: slot.url.trim(),
      src: slot.url.trim(),
    };
  }

  if (slot.current?.src) {
    return {
      kind: slot.current.kind === "video" ? "video" : "image",
      label: slot.current.label || slot.current.src,
      poster: slot.current.poster || "",
      src: slot.current.src,
    };
  }

  return null;
}

function AssetPreview({ asset, previewRatio = "default" }) {
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
          className={`hero-slide-editor__preview-media hero-slide-editor__preview-media--${previewRatio}`}
          loop
          muted
          playsInline
          poster={asset.poster || undefined}
          src={previewSrc}
        />
      ) : (
        <img
          alt=""
          className={`hero-slide-editor__preview-media hero-slide-editor__preview-media--${previewRatio}`}
          src={previewSrc}
        />
      )}
      <span className="hero-slide-editor__preview-label">{asset.label}</span>
    </div>
  );
}

function AssetEditor({
  checked = true,
  fieldId,
  isLogo = false,
  nested = true,
  onFileChange,
  onToggle,
  onUrlChange,
  previewRatio = "default",
  showToggle = true,
  slot,
  title,
}) {
  const fileInputId = `${fieldId}-upload`;
  const activeAsset = useMemo(() => getActiveAsset(slot), [slot]);
  const assetSource = (
    <div className="hero-slide-editor__asset-source">
      <TextInput
        id={`${fieldId}-url`}
        onChange={onUrlChange}
        placeholder={isLogo ? "Paste logo image URL" : "Paste image URL"}
        value={slot.url}
      />
      <span className="hero-slide-editor__or">or</span>
      <label className="hero-slide-editor__upload-button" htmlFor={fileInputId}>
        Upload from device
      </label>
      <input
        accept={isLogo ? "image/*" : "image/*,video/*"}
        className="hero-slide-editor__file-input"
        id={fileInputId}
        onChange={onFileChange}
        type="file"
      />
    </div>
  );

  const preview = activeAsset ? (
    <AssetPreview asset={activeAsset} previewRatio={previewRatio} />
  ) : null;

  return (
    <section className="hero-slide-editor__section">
      {showToggle ? (
        <ToggleRow checked={checked} label={title} onToggle={onToggle} />
      ) : (
        <FormRow label={title}>{null}</FormRow>
      )}

      {showToggle ? (
        <>
          {nested ? <NestedRow>{assetSource}</NestedRow> : assetSource}
          {preview
            ? nested
              ? (
                <NestedRow depth={2} preview>
                  {preview}
                </NestedRow>
              )
              : <div className="hero-slide-editor__preview-row">{preview}</div>
            : null}
        </>
      ) : (
        <>
          <div className="hero-slide-editor__asset-row">{assetSource}</div>
          {preview ? <div className="hero-slide-editor__preview-row">{preview}</div> : null}
        </>
      )}
    </section>
  );
}

function CtaValueField({
  checked,
  fieldId,
  onTextChange,
  onToggle,
  placeholder,
  value,
}) {
  return (
    <>
      <NestedRow depth={2}>
        <div className="hero-slide-editor__nested-toggle-row">
          <p className="hero-slide-editor__nested-label">CTA value text</p>
          <ModalToggle checked={checked} onToggle={onToggle} />
        </div>
      </NestedRow>

      {checked ? (
        <NestedRow depth={3}>
          <TextInput
            id={fieldId}
            onChange={onTextChange}
            placeholder={placeholder}
            value={value}
          />
        </NestedRow>
      ) : null}
    </>
  );
}

function DraggableInputRow({
  draggingKey,
  fieldId,
  onChange,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  placeholder,
  value,
}) {
  return (
    <div
      className={`hero-slide-editor__draggable-input ${
        draggingKey ? "hero-slide-editor__draggable-input--dragging" : ""
      }`}
      draggable
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      onDrop={onDrop}
    >
      <DragHandle />
      <TextInput
        id={fieldId}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    </div>
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
  const [draggingTitlePart, setDraggingTitlePart] = useState("");
  const [draggingCtaPart, setDraggingCtaPart] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setDraft(createSlideEditorDraft(slide));

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
    draft.titleOrder === "accent-first" ? ["accent", "lead"] : ["lead", "accent"];

  const ctaRows =
    draft.ctaOrder === "gold-first" ? ["gold", "standard"] : ["standard", "gold"];

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

  const handleCtaRowDrop = (targetKey) => {
    if (!draggingCtaPart || draggingCtaPart === targetKey) {
      setDraggingCtaPart("");
      return;
    }

    updateDraft({
      ctaOrder: draggingCtaPart === "gold" ? "gold-first" : "standard-first",
    });
    setDraggingCtaPart("");
  };

  return createPortal(
    <div className="hero-slide-editor" role="presentation">
      <div
        aria-labelledby={`${fieldPrefix}-title`}
        aria-modal="true"
        className="hero-slide-editor__dialog"
        role="dialog"
      >
        <header className="hero-slide-editor__header">
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
        </header>

        <div className="hero-slide-editor__body">
          <div className="hero-slide-editor__content">
            <section className="hero-slide-editor__section">
              <FormRow label="Content alignment">
                <SegmentedChoice
                  name="content alignment"
                  onChange={(value) => updateDraft({ contentAlignment: value })}
                  options={[
                    { label: "Centered", value: "center" },
                    { label: "Left", value: "left" },
                  ]}
                  value={draft.contentAlignment}
                />
              </FormRow>
            </section>

            <section className="hero-slide-editor__section">
              <FormRow label="Theme">
                <SegmentedChoice
                  name="theme"
                  onChange={(value) => updateDraft({ theme: value })}
                  options={[
                    { label: "Standard", value: "standard" },
                    { label: "Gold", value: "gold" },
                  ]}
                  value={draft.theme}
                />
              </FormRow>
            </section>

            <section className="hero-slide-editor__section">
              <FormRow label="Title size">
                <SegmentedChoice
                  name="title size"
                  onChange={(value) => updateDraft({ titleSize: value })}
                  options={[
                    { label: "Large", value: "large" },
                    { label: "Larger", value: "larger" },
                  ]}
                  value={draft.titleSize}
                />
              </FormRow>
            </section>

            <section className="hero-slide-editor__section hero-slide-editor__section--stacked">
              {titleRows.map((itemKey) => {
                const isAccent = itemKey === "accent";

                return (
                  <DraggableInputRow
                    key={itemKey}
                    draggingKey={draggingTitlePart === itemKey}
                    fieldId={`${fieldPrefix}-${itemKey}`}
                    onChange={(value) =>
                      updateDraft(
                        isAccent ? { titleAccent: value } : { titleLead: value },
                      )
                    }
                    onDragEnd={() => setDraggingTitlePart("")}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={() => setDraggingTitlePart(itemKey)}
                    onDrop={() => handleTitleRowDrop(itemKey)}
                    placeholder={isAccent ? "Title accent" : "Title lead"}
                    value={isAccent ? draft.titleAccent : draft.titleLead}
                  />
                );
              })}
            </section>

            <section className="hero-slide-editor__section">
              <ToggleRow
                checked={draft.showLabel}
                label="Label"
                onToggle={() =>
                  updateDraft((current) => ({ ...current, showLabel: !current.showLabel }))
                }
              />

              {draft.showLabel ? (
                <NestedRow>
                  <div className="hero-slide-editor__inline-field">
                    <TextInput
                      id={`${fieldPrefix}-label`}
                      onChange={(value) => updateDraft({ label: value })}
                      placeholder="Label"
                      value={draft.label}
                    />
                    <div className="hero-slide-editor__inline-toggle">
                      <span className="hero-slide-editor__inline-toggle-label">gold</span>
                      <ModalToggle
                        checked={draft.showLabelGold}
                        onToggle={() =>
                          updateDraft((current) => ({
                            ...current,
                            showLabelGold: !current.showLabelGold,
                          }))
                        }
                      />
                    </div>
                  </div>
                </NestedRow>
              ) : null}
            </section>

            <section className="hero-slide-editor__section">
              <ToggleRow
                checked={draft.showSubtitle}
                label="Subtitle"
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showSubtitle: !current.showSubtitle,
                  }))
                }
              />

              {draft.showSubtitle ? (
                <NestedRow>
                  <TextInput
                    id={`${fieldPrefix}-subtitle`}
                    onChange={(value) => updateDraft({ subtitle: value })}
                    placeholder="Subtitle text"
                    value={draft.subtitle}
                  />
                </NestedRow>
              ) : null}
            </section>

            <section className="hero-slide-editor__section">
              <ToggleRow
                checked={draft.showPrice}
                label="Price"
                onToggle={() =>
                  updateDraft((current) => ({ ...current, showPrice: !current.showPrice }))
                }
              />

              {draft.showPrice ? (
                <>
                  <NestedRow>
                    <TextInput
                      id={`${fieldPrefix}-price-prefix`}
                      onChange={(value) => updateDraft({ pricePrefix: value })}
                      placeholder="Price prefix"
                      value={draft.pricePrefix}
                    />
                  </NestedRow>
                  <NestedRow>
                    <TextInput
                      id={`${fieldPrefix}-price-value`}
                      onChange={(value) => updateDraft({ priceValue: value })}
                      placeholder="Price value"
                      value={draft.priceValue}
                    />
                  </NestedRow>
                  <NestedRow>
                    <TextInput
                      id={`${fieldPrefix}-price-old`}
                      onChange={(value) => updateDraft({ priceOldPrice: value })}
                      placeholder="Old price"
                      value={draft.priceOldPrice}
                    />
                  </NestedRow>
                  <NestedRow>
                    <TextInput
                      id={`${fieldPrefix}-price-suffix`}
                      onChange={(value) => updateDraft({ priceSuffix: value })}
                      placeholder="Price suffix"
                      value={draft.priceSuffix}
                    />
                  </NestedRow>
                </>
              ) : null}
            </section>

            <section className="hero-slide-editor__section">
              <TextInput
                id={`${fieldPrefix}-primary-cta`}
                muted
                onChange={(value) => updateDraft({ primaryCtaLabel: value })}
                placeholder="Primary CTA"
                value={draft.primaryCtaLabel}
              />
            </section>

            <section className="hero-slide-editor__section">
              <ToggleRow
                checked={draft.showTwoButtons}
                label="Two buttons"
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showTwoButtons: !current.showTwoButtons,
                  }))
                }
              />

              {draft.showTwoButtons ? (
                <>
                  <NestedRow>
                    <div className="hero-slide-editor__nested-toggle-row">
                      <p className="hero-slide-editor__nested-label">Divider (or)</p>
                      <ModalToggle
                        checked={draft.showCtaDivider}
                        onToggle={() =>
                          updateDraft((current) => ({
                            ...current,
                            showCtaDivider: !current.showCtaDivider,
                          }))
                        }
                      />
                    </div>
                  </NestedRow>

                  {ctaRows.map((itemKey) => {
                    const isGold = itemKey === "gold";
                    const noteEnabled = isGold
                      ? draft.showGoldCtaValueText
                      : draft.showStandardCtaValueText;
                    const noteValue = isGold
                      ? draft.goldCtaValueText
                      : draft.standardCtaValueText;

                    return (
                      <div className="hero-slide-editor__nested-group" key={itemKey}>
                        <NestedRow>
                          <DraggableInputRow
                            draggingKey={draggingCtaPart === itemKey}
                            fieldId={`${fieldPrefix}-${itemKey}-cta`}
                            onChange={(value) =>
                              updateDraft(
                                isGold
                                  ? { primaryCtaLabel: value }
                                  : { secondaryCtaLabel: value },
                              )
                            }
                            onDragEnd={() => setDraggingCtaPart("")}
                            onDragOver={(event) => event.preventDefault()}
                            onDragStart={() => setDraggingCtaPart(itemKey)}
                            onDrop={() => handleCtaRowDrop(itemKey)}
                            placeholder={isGold ? "Gold CTA" : "Standard CTA"}
                            value={isGold ? draft.primaryCtaLabel : draft.secondaryCtaLabel}
                          />
                        </NestedRow>

                        <CtaValueField
                          checked={noteEnabled}
                          fieldId={`${fieldPrefix}-${itemKey}-cta-value`}
                          onTextChange={(value) =>
                            updateDraft(
                              isGold
                                ? { goldCtaValueText: value }
                                : { standardCtaValueText: value },
                            )
                          }
                          onToggle={() =>
                            updateDraft((current) =>
                              isGold
                                ? {
                                    ...current,
                                    showGoldCtaValueText: !current.showGoldCtaValueText,
                                    goldCtaValueText:
                                      !current.showGoldCtaValueText &&
                                      !current.goldCtaValueText?.trim()
                                        ? "Best value"
                                        : current.goldCtaValueText,
                                  }
                                : {
                                    ...current,
                                    showStandardCtaValueText:
                                      !current.showStandardCtaValueText,
                                  },
                            )
                          }
                          placeholder={isGold ? "Best value" : "Standard CTA"}
                          value={noteValue}
                        />
                      </div>
                    );
                  })}
                </>
              ) : null}
            </section>

            <section className="hero-slide-editor__section">
              <ToggleRow
                checked={draft.showHelperText}
                label="Helper text"
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showHelperText: !current.showHelperText,
                  }))
                }
              />

              {draft.showHelperText ? (
                <NestedRow>
                  <TextInput
                    id={`${fieldPrefix}-helper`}
                    onChange={(value) => updateDraft({ helperText: value })}
                    placeholder="Helper text"
                    value={draft.helperText}
                  />
                </NestedRow>
              ) : null}
            </section>

            <section className="hero-slide-editor__section">
              <ToggleRow
                checked={draft.showPpvBadge}
                label="PPV bedge"
                onToggle={() =>
                  updateDraft((current) => ({
                    ...current,
                    showPpvBadge: !current.showPpvBadge,
                  }))
                }
              />
            </section>

            <AssetEditor
              checked={draft.showLogo}
              fieldId={`${fieldPrefix}-logo`}
              isLogo
              onFileChange={(event) => {
                const [file] = Array.from(event.target.files ?? []);
                updateLogoSlot((current) => ({
                  ...current,
                  file: file ?? null,
                }));
                event.target.value = "";
              }}
              onToggle={() =>
                updateDraft((current) => ({ ...current, showLogo: !current.showLogo }))
              }
              onUrlChange={(value) =>
                updateLogoSlot((current) => ({
                  ...current,
                  file: value.trim() ? null : current.file,
                  url: value,
                }))
              }
              slot={draft.logo}
              title="Logo"
            />

            <AssetEditor
              fieldId={`${fieldPrefix}-desktop-media`}
              nested={false}
              onFileChange={(event) => {
                const [file] = Array.from(event.target.files ?? []);
                updateMediaSlot("desktop", (current) => ({
                  ...current,
                  file: file ?? null,
                }));
                event.target.value = "";
              }}
              onUrlChange={(value) =>
                updateMediaSlot("desktop", (current) => ({
                  ...current,
                  file: value.trim() ? null : current.file,
                  url: value,
                }))
              }
              previewRatio="desktop"
              showToggle={false}
              slot={draft.media.desktop}
              title="Desktop media"
            />

            <AssetEditor
              fieldId={`${fieldPrefix}-tablet-media`}
              nested={false}
              onFileChange={(event) => {
                const [file] = Array.from(event.target.files ?? []);
                updateMediaSlot("tablet", (current) => ({
                  ...current,
                  file: file ?? null,
                }));
                event.target.value = "";
              }}
              onUrlChange={(value) =>
                updateMediaSlot("tablet", (current) => ({
                  ...current,
                  file: value.trim() ? null : current.file,
                  url: value,
                }))
              }
              previewRatio="tablet"
              showToggle={false}
              slot={draft.media.tablet}
              title="Tablet media"
            />

            <AssetEditor
              fieldId={`${fieldPrefix}-mobile-media`}
              nested={false}
              onFileChange={(event) => {
                const [file] = Array.from(event.target.files ?? []);
                updateMediaSlot("mobile", (current) => ({
                  ...current,
                  file: file ?? null,
                }));
                event.target.value = "";
              }}
              onUrlChange={(value) =>
                updateMediaSlot("mobile", (current) => ({
                  ...current,
                  file: value.trim() ? null : current.file,
                  url: value,
                }))
              }
              previewRatio="mobile"
              showToggle={false}
              slot={draft.media.mobile}
              title="Mobile media"
            />
          </div>
        </div>

        <footer className="hero-slide-editor__footer">
          <button
            className="hero-slide-editor__footer-action hero-slide-editor__footer-action--ghost"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>

          <div className="hero-slide-editor__footer-actions">
            <button
              className="hero-slide-editor__footer-action hero-slide-editor__footer-action--secondary"
              onClick={() => onSaveChanges(draft)}
              type="button"
            >
              Save changes
            </button>
            <button
              className="hero-slide-editor__footer-action hero-slide-editor__footer-action--primary"
              onClick={() => onSaveAsNewSlide(draft)}
              type="button"
            >
              Save as new slide
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
