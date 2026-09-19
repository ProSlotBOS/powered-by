import { PROSLOT_HREF, PROSLOT_LABEL, PROSLOT_NAME, PROSLOT_REL, PROSLOT_TARGET, } from './constants.js';
/**
 * The credit as an HTML string, for the build-time pre-render scripts.
 *
 * Deliberately free of React. These are consumed by each site's
 * `generate-static-routes` script, and those are plain Node — some ESM, some
 * still CommonJS — so anything that dragged in `react-dom/server` would not
 * import cleanly across all of them.
 *
 * This path is the one that actually matters for search. A crawler that does
 * not execute JavaScript sees only the pre-rendered HTML, so a site whose
 * credit exists solely in a React component shows no reference to ProSlot at
 * all in its raw markup — which is exactly the state several sites were in
 * before their pre-render scripts were added. Parity between this and the React
 * component is asserted in the tests rather than left to discipline.
 */
const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const DEFAULT_WRAPPER_STYLE = 'margin-top:12px;';
const DEFAULT_LINK_STYLE = 'color:#94a3b8;text-decoration:none;';
const DEFAULT_TAGLINE_STYLE = 'font-size:11px;color:#64748b;letter-spacing:0.05em;margin-top:2px;';
export function renderPoweredByHtml(options = {}) {
    const { tagline, title, wrapperStyle = DEFAULT_WRAPPER_STYLE, linkStyle = DEFAULT_LINK_STYLE, nameStyle, taglineStyle = DEFAULT_TAGLINE_STYLE, } = options;
    // The href is entity-encoded here rather than by the caller: several of the
    // pre-render scripts drop this straight into a template literal with no
    // escaping pass of their own, and a bare & in an attribute is invalid HTML.
    const anchor = `<a href="${escapeHtml(PROSLOT_HREF)}" target="${PROSLOT_TARGET}" rel="${PROSLOT_REL}"` +
        (title ? ` title="${escapeHtml(title)}"` : '') +
        ` style="${linkStyle}">` +
        `${PROSLOT_LABEL} <strong${nameStyle ? ` style="${nameStyle}"` : ''}>${PROSLOT_NAME}</strong>` +
        `</a>`;
    const taglineHtml = tagline
        ? `<div style="${taglineStyle}">${escapeHtml(tagline)}</div>`
        : '';
    return `<div style="${wrapperStyle}">${anchor}${taglineHtml}</div>`;
}
