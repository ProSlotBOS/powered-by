"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageUrl = pageUrl;
exports.pageHtml = pageHtml;
exports.writeRouteHtml = writeRouteHtml;
/**
 * Per-page HTML for a satellite's public pages, written after `vite build`.
 *
 * Firebase Hosting answers every path of a single-page site with dist/index.html, so before JavaScript runs every
 * page carries the homepage's <title> and no canonical of its own. Search Console filed TC Blackhawks' pages as
 * "Duplicate without user-selected canonical" (2026-10-26), and the nightly check found the same on Bruh I Got U.
 * writeRouteHtml writes dist/<route>/index.html from the built index.html with that page's own title, description,
 * canonical, og: and twitter: url/title/description, and gives the homepage its canonical. Pair it with
 * "trailingSlash": false in firebase.json, so /classes serves dist/classes/index.html and /classes/ redirects to
 * /classes. Node only: import it from '@proslotbosllc/powered-by/static-routes' in a build script, never a page.
 *
 *   import { writeRouteHtml } from '@proslotbosllc/powered-by/static-routes';
 *   writeRouteHtml({ distDir: 'dist', siteUrl: 'https://www.example.com',
 *     routes: { '/classes': { title: 'Classes | Example' } } });
 */
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * A page's own address on the site's configured origin: the path, without its query, hash, trailing slash or a
 * literal /index.html. The same rule as facility-ui's seoPaths.pageUrl, which the facility SEO component renders.
 */
function pageUrl(siteUrl, pathname) {
    if (!siteUrl)
        return '';
    let origin;
    try {
        origin = new URL(siteUrl).origin;
    }
    catch {
        return siteUrl;
    }
    let p = (pathname || '/').split(/[?#]/)[0].replace(/\/index\.html$/i, '/');
    if (p.length > 1)
        p = p.replace(/\/+$/, '');
    return `${origin}${p || '/'}`;
}
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ROUTE_SHAPE = /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/;
/** Replace the <meta> whose `attr` is `key` (attribute order aside), or add it before </head>. */
function setMeta(html, attr, key, value) {
    const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
    const re = new RegExp(`<meta\\b[^>]*\\b${attr}=["']${key}["'][^>]*>`, 'i');
    return re.test(html) ? html.replace(re, () => tag) : html.replace(/<\/head>/i, () => `    ${tag}\n  </head>`);
}
function setCanonical(html, url) {
    const tag = `<link rel="canonical" href="${esc(url)}" />`;
    const re = /<link\b[^>]*\brel=["']canonical["'][^>]*>/i;
    return re.test(html) ? html.replace(re, () => tag) : html.replace(/<\/head>/i, () => `    ${tag}\n  </head>`);
}
/** The built page with this page's title, description and address in its head. */
function pageHtml(template, { url, title, description }) {
    if (!/<title>[\s\S]*?<\/title>/i.test(template))
        throw new Error('The built index.html has no <title> to replace.');
    if (!/<\/head>/i.test(template))
        throw new Error('The built index.html has no </head>.');
    let html = template;
    if (title) {
        html = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${esc(title)}</title>`);
        html = setMeta(html, 'property', 'og:title', title);
        html = setMeta(html, 'name', 'twitter:title', title);
    }
    if (description) {
        html = setMeta(html, 'name', 'description', description);
        html = setMeta(html, 'property', 'og:description', description);
        html = setMeta(html, 'name', 'twitter:description', description);
    }
    html = setCanonical(html, url);
    html = setMeta(html, 'property', 'og:url', url);
    html = setMeta(html, 'name', 'twitter:url', url);
    return html;
}
/**
 * Write the homepage's canonical into dist/index.html, then dist/<route>/index.html for each public route.
 * Returns what was written, as [{ path, url }].
 */
function writeRouteHtml({ distDir = 'dist', siteUrl, home = {}, routes = {} }) {
    if (!siteUrl)
        throw new Error("writeRouteHtml needs the site's siteUrl.");
    const indexPath = node_path_1.default.join(distDir, 'index.html');
    const template = node_fs_1.default.readFileSync(indexPath, 'utf8');
    const written = [];
    const homeUrl = pageUrl(siteUrl, '/');
    node_fs_1.default.writeFileSync(indexPath, pageHtml(template, { url: homeUrl, ...home }), 'utf8');
    written.push({ path: '/', url: homeUrl });
    for (const [route, meta] of Object.entries(routes)) {
        if (!ROUTE_SHAPE.test(route))
            throw new Error(`Not a page path: ${route}`);
        if (!meta || !meta.title)
            throw new Error(`${route} needs a title: a page without one would carry the homepage's.`);
        const url = pageUrl(siteUrl, route);
        const outDir = node_path_1.default.join(distDir, ...route.slice(1).split('/'));
        node_fs_1.default.mkdirSync(outDir, { recursive: true });
        node_fs_1.default.writeFileSync(node_path_1.default.join(outDir, 'index.html'), pageHtml(template, { url, ...meta }), 'utf8');
        written.push({ path: route, url });
    }
    return written;
}
