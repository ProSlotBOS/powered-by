export interface PageMeta {
    title?: string;
    description?: string;
}
/**
 * A page's own address on the site's configured origin: the path, without its query, hash, trailing slash or a
 * literal /index.html. The same rule as facility-ui's seoPaths.pageUrl, which the facility SEO component renders.
 */
export declare function pageUrl(siteUrl: string, pathname: string): string;
/** The built page with this page's title, description and address in its head. */
export declare function pageHtml(template: string, { url, title, description }: PageMeta & {
    url: string;
}): string;
export interface WriteRouteHtmlOptions {
    distDir?: string;
    siteUrl: string;
    home?: PageMeta;
    routes?: Record<string, PageMeta>;
}
/**
 * Write the homepage's canonical into dist/index.html, then dist/<route>/index.html for each public route.
 * Returns what was written, as [{ path, url }].
 */
export declare function writeRouteHtml({ distDir, siteUrl, home, routes }: WriteRouteHtmlOptions): Array<{
    path: string;
    url: string;
}>;
