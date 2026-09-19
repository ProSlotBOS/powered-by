export interface PoweredByHtmlOptions {
    /**
     * The site's vertical line, e.g. "Custom Athletic Facility & Sports Academy
     * Operating System". Rendered beneath the link and outside the anchor. Pass
     * nothing to omit it.
     */
    tagline?: string;
    /** Tooltip on the link. Not the anchor text — that stays brand-only. */
    title?: string;
    /** Inline style for the wrapper, since pre-rendered pages carry no stylesheet. */
    wrapperStyle?: string;
    /** Inline style for the anchor. */
    linkStyle?: string;
    /**
     * Inline style for the brand name inside the anchor. Sites that highlight
     * "PROSLOT BOS" against the surrounding label need this, and without it
     * adopting the kit would visibly flatten their footer.
     */
    nameStyle?: string;
    /** Inline style for the tagline. */
    taglineStyle?: string;
}
export declare function renderPoweredByHtml(options?: PoweredByHtmlOptions): string;
