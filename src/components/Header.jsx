import { useEffect, useMemo, useState } from "react";

function padUnit(value) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function getCountdownParts(target) {
  const targetTimestamp = new Date(target).getTime();
  const nowTimestamp = Date.now();
  const difference = Math.max(0, targetTimestamp - nowTimestamp);

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return {
    days: padUnit(days),
    hours: padUnit(hours),
    mins: padUnit(mins),
    secs: padUnit(secs),
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

function DefaultHeader({ actions, logoSrc }) {
  return (
    <header className="header-module__header___1mgxU header-module__header--default">
      <span className="tp-brand-logo" aria-label="DAZN">
        <img src={logoSrc} alt="" />
      </span>

      <div className="header-module__buttonsContainer___OUMUU">
        {actions.map((action) => (
          <button
            key={action.label}
            className={`tp-button tp-button-${action.variant}`}
            type="button"
          >
            {action.label}
          </button>
        ))}
      </div>
    </header>
  );
}

function CountdownUnit({ label, value }) {
  return (
    <div className="countdown-header__unit">
      <span className="countdown-header__value">{value}</span>
      <span className="countdown-header__label">{label}</span>
    </div>
  );
}

function CountdownHeader({ countdownCta, countdownTarget, eventBrand, logoSrc }) {
  const countdown = useCountdown(countdownTarget);
  const ctaLabel = countdownCta?.label ?? "Get started";
  const ctaHref = countdownCta?.href;
  const countdownTimer = (
    <div className="countdown-header__timer">
      <CountdownUnit label="days" value={countdown.days} />
      <CountdownUnit label="hours" value={countdown.hours} />
      <CountdownUnit label="mins" value={countdown.mins} />
      <CountdownUnit label="secs" value={countdown.secs} />
    </div>
  );

  const ctaContent = ctaHref ? (
    <a className="countdown-header__cta" href={ctaHref}>
      {ctaLabel}
    </a>
  ) : (
    <button className="countdown-header__cta" type="button">
      {ctaLabel}
    </button>
  );

  return (
    <header className="header-module__header___1mgxU header-module__header--countdown">
      <div className="countdown-header__left">
        <span className="tp-brand-logo countdown-header__brand" aria-label="DAZN">
          <img src={logoSrc} alt="" />
        </span>

        <span aria-hidden="true" className="countdown-header__divider" />

        <div className="countdown-header__event">
          {eventBrand?.logoSrc ? (
            <span className="countdown-header__eventLogo" aria-hidden="true">
              <img src={eventBrand.logoSrc} alt="" />
            </span>
          ) : null}

          <div className="countdown-header__eventCopy">
            <p className="countdown-header__eventTitle">{eventBrand?.title}</p>
            <p className="countdown-header__eventSubtitle">{eventBrand?.subtitle}</p>
          </div>
        </div>

        <div className="countdown-header__mobileTimer" aria-hidden="true">
          {countdownTimer}
        </div>
      </div>

      <div className="countdown-header__right">
        <div className="countdown-header__desktopTimer">{countdownTimer}</div>

        {ctaContent}
      </div>
    </header>
  );
}

export default function Header({
  actions,
  countdownCta,
  countdownTarget,
  eventBrand,
  logoSrc,
  variant = "default",
}) {
  const resolvedVariant = useMemo(
    () => (variant === "countdown" ? "countdown" : "default"),
    [variant],
  );

  if (resolvedVariant === "countdown") {
    return (
      <CountdownHeader
        countdownCta={countdownCta}
        countdownTarget={countdownTarget}
        eventBrand={eventBrand}
        logoSrc={logoSrc}
      />
    );
  }

  return <DefaultHeader actions={actions} logoSrc={logoSrc} />;
}
