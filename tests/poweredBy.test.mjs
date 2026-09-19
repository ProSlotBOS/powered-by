/**
 * The credit used to live as a hand-copied block in fourteen repositories, and
 * it drifted. HomeTeam's pre-rendered copy and its React copy disagreed about
 * where the tagline sat, so a change to the component shipped green and altered
 * nothing a crawler or a visitor actually saw. These tests exist so the two
 * outputs here cannot come apart the same way, and so the attributes that were
 * wrong for years cannot quietly return.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { PoweredBy } from '../dist/PoweredBy.js';
import { renderPoweredByHtml } from '../dist/renderPoweredByHtml.js';
import { PROSLOT_HREF, PROSLOT_REL } from '../dist/constants.js';

const TAGLINE = 'Custom Athletic Facility & Sports Academy Operating System';

const reactHtml = (props = {}) =>
  renderToStaticMarkup(React.createElement(PoweredBy, props));

/** Everything between <a ...> and </a> — i.e. exactly what anchors the link. */
const anchorInnerText = (html) => {
  const m = /<a\b[^>]*>([\s\S]*?)<\/a>/.exec(html);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null;
};
const relOf = (html) => (/<a\b[^>]*\brel="([^"]*)"/.exec(html) || [])[1];
const hrefOf = (html) => (/<a\b[^>]*\bhref="([^"]*)"/.exec(html) || [])[1];

describe('rel — the attributes that were wrong for years', () => {
  for (const [name, html] of [
    ['react', reactHtml({ tagline: TAGLINE })],
    ['html', renderPoweredByHtml({ tagline: TAGLINE })],
  ]) {
    test(`${name}: nofollow is present`, () => {
      assert.match(relOf(html), /\bnofollow\b/);
    });
    test(`${name}: noopener is present`, () => {
      assert.match(relOf(html), /\bnoopener\b/);
    });
    test(`${name}: noreferrer is absent, so the click stays attributable`, () => {
      assert.doesNotMatch(relOf(html), /\bnoreferrer\b/);
    });
    test(`${name}: href carries the attribution tag`, () => {
      assert.match(html, /utm_source=client-footer/);
      assert.match(html, /utm_medium=referral/);
    });
  }

  test('the shared rel constant itself never regains noreferrer', () => {
    assert.doesNotMatch(PROSLOT_REL, /noreferrer/);
  });
});

describe('the tagline stays out of the anchor', () => {
  // Keeping it inside made the anchor text a keyword-rich phrase repeated
  // sitewide across every site this firm builds — the clearest manipulation
  // signal a footer link can send.
  test('react: anchor text is brand-only', () => {
    assert.equal(anchorInnerText(reactHtml({ tagline: TAGLINE })), 'POWERED BY PROSLOT BOS');
  });

  test('html: anchor text is brand-only', () => {
    assert.equal(anchorInnerText(renderPoweredByHtml({ tagline: TAGLINE })), 'POWERED BY PROSLOT BOS');
  });

  test('the tagline is still rendered, just outside the link', () => {
    const r = reactHtml({ tagline: TAGLINE });
    const h = renderPoweredByHtml({ tagline: TAGLINE });
    assert.ok(r.includes('Sports Academy Operating System'), 'react dropped the tagline');
    assert.ok(h.includes('Sports Academy Operating System'), 'html dropped the tagline');
  });

  test('omitting the tagline renders the credit alone, not an empty element', () => {
    assert.doesNotMatch(renderPoweredByHtml(), /<div[^>]*><\/div>/);
    assert.equal(anchorInnerText(renderPoweredByHtml()), 'POWERED BY PROSLOT BOS');
  });
});

describe('the two renderers agree', () => {
  const r = reactHtml({ tagline: TAGLINE });
  const h = renderPoweredByHtml({ tagline: TAGLINE });

  test('same anchor text', () => {
    assert.equal(anchorInnerText(r), anchorInnerText(h));
  });

  test('same rel', () => {
    assert.equal(relOf(r), relOf(h));
  });

  test('same destination once entities are decoded', () => {
    const decode = (s) => s.replace(/&amp;/g, '&');
    assert.equal(decode(hrefOf(r)), decode(hrefOf(h)));
    assert.equal(decode(hrefOf(h)), PROSLOT_HREF);
  });
});

describe('the pre-rendered string is safe to drop into a page', () => {
  test('ampersands in the href are entity-encoded', () => {
    // Several pre-render scripts interpolate this with no escaping of their
    // own, and a bare & in an attribute is invalid HTML.
    assert.match(renderPoweredByHtml(), /utm_source=client-footer&amp;utm_medium=referral/);
    assert.doesNotMatch(renderPoweredByHtml(), /utm_source=client-footer&utm_medium/);
  });

  test('a tagline cannot inject markup', () => {
    const out = renderPoweredByHtml({ tagline: '<script>alert(1)</script>' });
    assert.doesNotMatch(out, /<script>/);
    assert.match(out, /&lt;script&gt;/);
  });

  test('never wrapped in noscript — crawlers discount that as page content', () => {
    assert.doesNotMatch(renderPoweredByHtml({ tagline: TAGLINE }), /noscript/i);
  });

  test('reproduces an adopting site byte for byte', () => {
    // The exact string hometeamfacility.com served before it adopted the kit.
    // Adoption must be a no-op on the page; if this drifts, some site's footer
    // is about to change appearance for no reason anyone asked for.
    const expected =
      '<div style="margin-top:12px;">' +
      '<a href="https://www.proslotbos.com/?utm_source=client-footer&amp;utm_medium=referral&amp;utm_campaign=powered_by"' +
      ' target="_blank" rel="noopener nofollow" style="color:#94a3b8;text-decoration:none;">' +
      'POWERED BY <strong style="color:#cbd5e1;">PROSLOT BOS</strong></a>' +
      '<div style="font-size:11px;color:#64748b;letter-spacing:0.05em;margin-top:2px;">' +
      'CUSTOM ATHLETIC FACILITY &amp; SPORTS ACADEMY OPERATING SYSTEM</div></div>';
    assert.equal(
      renderPoweredByHtml({
        tagline: 'CUSTOM ATHLETIC FACILITY & SPORTS ACADEMY OPERATING SYSTEM',
        nameStyle: 'color:#cbd5e1;',
      }),
      expected
    );
  });
});
