"use strict";
/**
 * Every property of the "Powered by ProSlot BOS" credit that must not vary
 * between sites, in one place. The React component and the HTML-string renderer
 * both build from these, so the two can never disagree the way the hand-written
 * copies did.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROSLOT_NAME = exports.PROSLOT_LABEL = exports.PROSLOT_TARGET = exports.PROSLOT_REL = exports.PROSLOT_HREF = void 0;
/** Where the credit points, already carrying its attribution tag. */
exports.PROSLOT_HREF = 'https://www.proslotbos.com/?utm_source=client-footer&utm_medium=referral&utm_campaign=powered_by';
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
exports.PROSLOT_REL = 'noopener nofollow';
exports.PROSLOT_TARGET = '_blank';
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
exports.PROSLOT_LABEL = 'POWERED BY';
exports.PROSLOT_NAME = 'PROSLOT BOS';
