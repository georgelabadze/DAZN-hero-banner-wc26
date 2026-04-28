export default function SectionDivider({ className = "", variant = "accent" }) {
  const dividerClassName = [
    "section-divider",
    `section-divider--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div aria-hidden="true" className={dividerClassName} />;
}
