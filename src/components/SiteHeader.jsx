import { useEffect, useState } from "react";

function padCountdownValue(value) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function getCountdownParts(target) {
  const targetTimestamp = new Date(target).getTime();
  const nowTimestamp = Date.now();
  const difference = Math.max(0, targetTimestamp - nowTimestamp);
  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: padCountdownValue(Math.floor(totalSeconds / 86400)),
    hours: padCountdownValue(Math.floor((totalSeconds % 86400) / 3600)),
    mins: padCountdownValue(Math.floor((totalSeconds % 3600) / 60)),
    secs: padCountdownValue(totalSeconds % 60),
  };
}

function useCountdown(target) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(target));

  useEffect(() => {
    setCountdown(getCountdownParts(target));

    const intervalId = window.setInterval(() => {
      setCountdown(getCountdownParts(target));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [target]);

  return countdown;
}

function SiteHeaderAction({ action }) {
  return (
    <button
      className={`site-header__action-button site-header__action-button--${action.variant}`}
      type="button"
    >
      {action.label}
    </button>
  );
}

function CountdownUnit({ label, value }) {
  return (
    <div className="site-header__timer-unit">
      <span className="site-header__timer-value">{value}</span>
      <span className="site-header__timer-label">{label}</span>
    </div>
  );
}

function CountdownTimer({ countdown }) {
  return (
    <div className="site-header__timer">
      <CountdownUnit label="days" value={countdown.days} />
      <CountdownUnit label="hours" value={countdown.hours} />
      <CountdownUnit label="mins" value={countdown.mins} />
      <CountdownUnit label="secs" value={countdown.secs} />
    </div>
  );
}

function DefaultSiteHeader({ actions, logoSrc }) {
  return (
    <header className="site-header site-header--default">
      <span className="site-header__brand-logo" aria-label="DAZN">
        <img src={logoSrc} alt="" />
      </span>

      <div className="site-header__actions">
        {actions.map((action) => (
          <SiteHeaderAction key={action.label} action={action} />
        ))}
      </div>
    </header>
  );
}

function CountdownSiteHeader({
  countdownCta,
  countdownTarget,
  eventBrand,
  logoSrc,
}) {
  const countdown = useCountdown(countdownTarget);
  const ctaLabel = countdownCta?.label ?? "Log in";
  const ctaHref = countdownCta?.href;

  const ctaContent = ctaHref ? (
    <a className="site-header__countdown-cta" href={ctaHref}>
      {ctaLabel}
    </a>
  ) : (
    <button className="site-header__countdown-cta" type="button">
      {ctaLabel}
    </button>
  );

  return (
    <header className="site-header site-header--countdown">
      <div className="site-header__countdown-left">
        <span className="site-header__brand-logo" aria-label="DAZN">
          <img src={logoSrc} alt="" />
        </span>

        <span aria-hidden="true" className="site-header__countdown-divider" />

        <div className="site-header__event">
          {eventBrand?.logoSrc ? (
            <span className="site-header__event-logo" aria-hidden="true">
              <img src={eventBrand.logoSrc} alt="" />
            </span>
          ) : null}

          <div className="site-header__event-copy">
            <p className="site-header__event-title">{eventBrand?.title}</p>
            <p className="site-header__event-subtitle">{eventBrand?.subtitle}</p>
          </div>
        </div>

        <div className="site-header__mobile-timer" aria-hidden="true">
          <CountdownTimer countdown={countdown} />
        </div>
      </div>

      <div className="site-header__countdown-right">
        <div className="site-header__desktop-timer">
          <CountdownTimer countdown={countdown} />
        </div>
        {ctaContent}
      </div>
    </header>
  );
}

export default function SiteHeader({
  actions,
  countdownCta,
  countdownTarget,
  eventBrand,
  logoSrc,
  variant = "default",
}) {
  if (variant === "countdown") {
    return (
      <CountdownSiteHeader
        countdownCta={countdownCta}
        countdownTarget={countdownTarget}
        eventBrand={eventBrand}
        logoSrc={logoSrc}
      />
    );
  }

  return <DefaultSiteHeader actions={actions} logoSrc={logoSrc} />;
}
