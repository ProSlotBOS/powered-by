/**
 * Each public page of a satellite gets its own HTML: its own title and canonical, before any JavaScript runs.
 *
 * Every path of a single-page site was served the homepage's head with no canonical, which Search Console reported
 * as "Duplicate without user-selected canonical" (TC Blackhawks, 2026-10-26; Bruh I Got U had the same).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pageUrl, pageHtml, writeRouteHtml } from '../dist/staticRoutes.js';

const SITE = 'https://www.example-shop.test';

test('a page is known by its own path on the configured origin', () => {
  assert.equal(pageUrl(SITE, '/'), `${SITE}/`);
  assert.equal(pageUrl(SITE, '/store/'), `${SITE}/store`);
  assert.equal(pageUrl(SITE, '/index.html'), `${SITE}/`);
  assert.equal(pageUrl(SITE, '/about?utm_source=ig#team'), `${SITE}/about`);
  assert.equal(pageUrl(`${SITE}/x/y`, '/contact'), `${SITE}/contact`);
  assert.equal(pageUrl('', '/contact'), '');
});

const TEMPLATE = `<!doctype html><html><head>
    <title>Example Shop</title>
    <meta property="og:url" content="${SITE}" />
  </head><body><div id="root"></div></body></html>`;

test('each page gets its own title and canonical, and the homepage its own canonical', () => {
  const dist = mkdtempSync(join(tmpdir(), 'static-routes-'));
  writeFileSync(join(dist, 'index.html'), TEMPLATE);
  const written = writeRouteHtml({ distDir: dist, siteUrl: SITE, routes: { '/custom-shop/baseball': { title: 'Custom Baseball Uniforms | Example', description: 'Jerseys & "pants".' } } });
  assert.deepEqual(written, [{ path: '/', url: `${SITE}/` }, { path: '/custom-shop/baseball', url: `${SITE}/custom-shop/baseball` }]);
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(home, new RegExp(`<link rel="canonical" href="${SITE}/" />`));
  assert.match(home, /<title>Example Shop<\/title>/);
  const page = readFileSync(join(dist, 'custom-shop', 'baseball', 'index.html'), 'utf8');
  assert.match(page, /<title>Custom Baseball Uniforms \| Example<\/title>/);
  assert.match(page, new RegExp(`<link rel="canonical" href="${SITE}/custom-shop/baseball" />`));
  assert.match(page, new RegExp(`<meta property="og:url" content="${SITE}/custom-shop/baseball" />`));
  assert.match(page, /<meta name="description" content="Jerseys &amp; &quot;pants&quot;\." \/>/);
  assert.equal((page.match(/rel="canonical"/g) || []).length, 1);
  assert.equal((page.match(/property="og:url"/g) || []).length, 1);
});

test('a route without a title, or a path that is not a page, is refused', () => {
  const dist = mkdtempSync(join(tmpdir(), 'static-routes-'));
  writeFileSync(join(dist, 'index.html'), TEMPLATE);
  assert.throws(() => writeRouteHtml({ distDir: dist, siteUrl: SITE, routes: { '/about': {} } }), /needs a title/);
  assert.throws(() => writeRouteHtml({ distDir: dist, siteUrl: SITE, routes: { '/../etc': { title: 'x' } } }), /Not a page path/);
  assert.equal(existsSync(join(dist, 'etc')), false);
  assert.throws(() => pageHtml('<html><head></head></html>', { url: SITE }), /no <title>/);
});

test('the CommonJS build answers the same', () => {
  const cjs = createRequire(import.meta.url)('../dist/cjs/staticRoutes.js');
  assert.equal(cjs.pageUrl(SITE, '/store/'), pageUrl(SITE, '/store/'));
  assert.equal(cjs.pageHtml(TEMPLATE, { url: `${SITE}/a`, title: 'A' }), pageHtml(TEMPLATE, { url: `${SITE}/a`, title: 'A' }));
});
