export default function SectionDivider({ className = "", variant = "accent" }) {
  const dividerClassName = [
    "section-divider",
    `section-divider--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div aria-hidden="true" className={dividerClassName}>
      <span className="section-divider__line" />
      <span className="section-divider__glow" />
      <span className="section-divider__accent" />
    </div>
  );
}
