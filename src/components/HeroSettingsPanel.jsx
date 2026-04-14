function SettingRow({
  checked,
  description,
  id,
  isChild = false,
  onToggle,
  title,
}) {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <article className={`hero-settings__item ${isChild ? "hero-settings__item--child" : ""}`}>
      <button
        aria-checked={checked}
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className={`hero-settings__toggle ${checked ? "hero-settings__toggle--active" : ""}`}
        onClick={onToggle}
        role="switch"
        type="button"
      >
        <span aria-hidden="true" className="hero-settings__toggle-track">
          <span className="hero-settings__toggle-thumb" />
        </span>
      </button>

      <div className="hero-settings__item-copy">
        <h3 className="hero-settings__item-title" id={titleId}>
          {title}
        </h3>
        <p className="hero-settings__item-description" id={descriptionId}>
          {description}
        </p>
      </div>
    </article>
  );
}

export default function HeroSettingsPanel({ footerItems = [], items }) {
  return (
    <section aria-labelledby="hero-settings-title" className="hero-settings">
      <div className="hero-settings__inner">
        <div className="hero-settings__heading">
          <h2 className="hero-settings__title" id="hero-settings-title">
            Hero settings
          </h2>
          <p className="hero-settings__description">
            Toggle the hero capabilities below to preview different creative and product
            setups in the live banner.
          </p>
        </div>

        <div className="hero-settings__panel">
          {items.map((item) => (
            <SettingRow key={item.id} {...item} />
          ))}
        </div>

        {footerItems.filter(Boolean).map((item) => (
          <div key={item.id} className="hero-settings__panel hero-settings__panel--single">
            <SettingRow {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}
