export function SectionHeader({
  eyebrow,
  title,
  text
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-muted">{text}</p>}
    </div>
  );
}
