import React from 'react';
import {
  PROSLOT_HREF,
  PROSLOT_LABEL,
  PROSLOT_NAME,
  PROSLOT_REL,
  PROSLOT_TARGET,
} from './constants.js';

/**
 * The "Powered by ProSlot BOS" credit, as rendered in a live page.
 *
 * Styling is left entirely to the consuming site. Each footer this sits in is
 * bespoke — different palettes, different alignment, light and dark — and a
 * component that imposed its own look would either fight every host or flatten
 * them all into the same footer. The class names below are the only knobs, and
 * every one defaults to nothing.
 *
 * The tagline renders as a sibling of the anchor rather than inside it. See
 * constants.ts for why that placement is load-bearing rather than cosmetic.
 */
export interface PoweredByProps {
  /** The site's vertical line. Omit to render the credit alone. */
  tagline?: string;
  /** Tooltip on the link. Not the anchor text — that stays brand-only. */
  title?: string;
  className?: string;
  linkClassName?: string;
  labelClassName?: string;
  nameClassName?: string;
  taglineClassName?: string;
}

export function PoweredBy({
  tagline,
  title,
  className,
  linkClassName,
  labelClassName,
  nameClassName,
  taglineClassName,
}: PoweredByProps) {
  return (
    <div className={className}>
      <a
        href={PROSLOT_HREF}
        target={PROSLOT_TARGET}
        rel={PROSLOT_REL}
        title={title}
        className={linkClassName}
      >
        <span className={labelClassName}>{PROSLOT_LABEL} </span>
        <strong className={nameClassName}>{PROSLOT_NAME}</strong>
      </a>
      {tagline ? <div className={taglineClassName}>{tagline}</div> : null}
    </div>
  );
}
