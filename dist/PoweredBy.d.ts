import React from 'react';
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
    className?: string;
    linkClassName?: string;
    labelClassName?: string;
    nameClassName?: string;
    taglineClassName?: string;
}
export declare function PoweredBy({ tagline, className, linkClassName, labelClassName, nameClassName, taglineClassName, }: PoweredByProps): React.JSX.Element;
