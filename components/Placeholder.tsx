import Link from "next/link";

export interface PlaceholderLink {
  label: string;
  href: string;
  external?: boolean;
}

interface Props {
  title: string;
  eyebrow?: string | null;
  intro?: string | null;
  /** Child routes, so every page stays reachable while the design is rebuilt. */
  links?: PlaceholderLink[];
  linksLabel?: string;
}

/**
 * Interim page shell. The prototype's visual layer was removed on 13 Nov 2026; every route keeps loading its data and
 * metadata through this shell until it is rebuilt to the approved Figma design (docs/AdamasTech_Master_Build_Prompt_v2.md).
 */
export function Placeholder({ title, eyebrow, intro, links, linksLabel = "In this section" }: Props) {
  return (
    <article className="placeholder container-site">
      {eyebrow && <p className="placeholder-eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {intro && <p className="placeholder-intro">{intro}</p>}
      <p className="placeholder-note">This page is being rebuilt to the approved design. Its content is loaded from the database and will be laid out in a later round.</p>
      {links && links.length > 0 && (
        <nav aria-label={linksLabel}>
          <h2>{linksLabel}</h2>
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                ) : (
                  <Link href={l.href}>{l.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
