/**
 * Every property of the "Powered by ProSlot BOS" credit that must not vary
 * between sites, in one place. The React component and the HTML-string renderer
 * both build from these, so the two can never disagree the way the hand-written
 * copies did.
 */
/** Where the credit points, already carrying its attribution tag. */
export const PROSLOT_HREF = 'https://www.proslotbos.com/?utm_source=client-footer&utm_medium=referral&utm_campaign=powered_by';
/**
 * `nofollow` is deliberate and should stay. This credit sits in the footer
 * template of every site ProSlot builds, and a sitewide templated link repeated
 * across a dozen sites by the same firm is what Google describes as a link
 * scheme. It passes no meaningful authority either way; dropping the nofollow
 * would only make the pattern look manipulative.
 *
 * `noreferrer` is deliberately absent. It strips the Referer header, so for
 * years every click through this credit arrived in ProSlot BOS analytics as
 * Direct and there was no way to tell whether the credit sent anyone at all.
 * `noopener` stays, for the security reason it exists.
 */
export const PROSLOT_REL = 'noopener nofollow';
export const PROSLOT_TARGET = '_blank';
/**
 * The anchor text, and only the anchor text.
 *
 * Each site also shows a vertical-specific tagline ("Custom Print Shop, Online
 * Design Studio & Merch Operating System" and so on). That tagline renders
 * OUTSIDE the anchor, on purpose: keeping it inside made the anchor text a
 * keyword-rich phrase repeated across every site this firm builds, which is the
 * single clearest manipulation signal a sitewide footer link can send. It costs
 * nothing to keep the anchor brand-only, and it means the credit stays harmless
 * if a link is ever made followed.
 */
export const PROSLOT_LABEL = 'POWERED BY';
export const PROSLOT_NAME = 'PROSLOT BOS';
/**
 * The standard sector lines — the vertical tagline each site shows beneath the
 * credit. Sites name their sector instead of typing the wording, so every
 * league shows the same line, every facility the same line, and so on; the
 * league line alone had been hand-copied into eight repositories. A site with
 * a genuinely bespoke line can still pass `tagline`, which wins over `sector`.
 *
 * Wording is kept exactly as it already appears on the live sites, so a site
 * switching from `tagline` to `sector` changes nothing a visitor or crawler
 * sees. Add a sector here when ProSlot enters a new one.
 */
export const PROSLOT_SECTORS = {
    league: 'Custom Sports League, Tournament & Schedule Builder Operating System',
    facility: 'Custom Athletic Facility & Sports Academy Operating System',
    training: 'Custom Baseball Training & Athlete Management Software',
    club: 'Custom Youth Baseball Club & Team Management Operating System',
    apparel: 'Custom Apparel, Uniform & Team Store Operating System',
    print: 'Custom Print Shop, Online Design Studio & Merch Operating System',
    advisory: 'Custom Admissions Consulting, Client Portal & Advisory Operating System',
    school: 'Custom Private School, Admissions & Digital Campus Operating System',
    // A Montessori program that is not a school (Kingdom Montessori, 2026-09-30).
    montessori: 'Custom Montessori Program, Admissions & Digital Campus Operating System',
};
/** The line a credit shows: an explicit tagline wins, else the sector's line. */
export const resolveTagline = (tagline, sector) => tagline || (sector ? PROSLOT_SECTORS[sector] : undefined);
