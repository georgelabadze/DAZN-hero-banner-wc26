function SettingRow({
  checked,
  description,
  id,
  onToggle,
  title,
}) {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <article className="hero-setting">
      <button
        aria-checked={checked}
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className={`hero-setting__switch ${checked ? "hero-setting__switch--on" : ""}`}
        onClick={onToggle}
        role="switch"
        type="button"
      >
        <span aria-hidden="true" className="hero-setting__switchTrack">
          <span className="hero-setting__switchThumb" />
        </span>
      </button>

      <div className="hero-setting__copy">
        <h3 className="hero-setting__title" id={titleId}>
          {title}
        </h3>
        <p className="hero-setting__description" id={descriptionId}>
          {description}
        </p>
      </div>
    </article>
  );
}

export default function HeroSettingsPanel({ carouselItem, items }) {
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

        {carouselItem ? (
          <div className="hero-settings__panel hero-settings__panel--single">
            <SettingRow {...carouselItem} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
