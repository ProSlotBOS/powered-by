# @proslotbosllc/powered-by

The "Powered by ProSlot BOS" footer credit, as one component and one
HTML-string renderer built from the same constants.

## Why this exists

The credit was hand-copied into fourteen site repositories, and it drifted.
By September 2026 the copies disagreed about where the tagline sat, which
meant the anchor text differed between sites, and HomeTeam's pre-rendered
markup had diverged from its own React component — so a fix committed to the
component shipped green and changed nothing a crawler or a visitor saw. All
fourteen also carried `rel="noopener noreferrer nofollow"`, and the
`noreferrer` had been silently anonymising every click into Direct traffic for
as long as the credit had existed.

Depend on this package. Do not copy the markup out of it.

## Install

Pinned to a commit, the same way the other kits are consumed:

```
npm install github:ProSlotBOS/powered-by#<sha>
```

## Use — in a React footer

Styling belongs to the site. Every class name is a prop and every one defaults
to nothing, so the credit inherits whatever footer it lands in rather than
imposing a look on it.

```tsx
import { PoweredBy } from '@proslotbosllc/powered-by';

<PoweredBy
  tagline="Custom Athletic Facility & Sports Academy Operating System"
  className="flex flex-col items-center md:items-end"
  linkClassName="text-xs font-bold text-slate-300 hover:text-white"
  nameClassName="text-white font-black"
  taglineClassName="text-[10px] text-slate-400 uppercase"
/>
```

## Use — in a pre-render script

This is the path that matters for search: a crawler that does not run
JavaScript sees only the pre-rendered HTML.

```js
import { renderPoweredByHtml } from '@proslotbosllc/powered-by';

const credit = renderPoweredByHtml({
  tagline: 'Custom Athletic Facility & Sports Academy Operating System',
});
```

The returned string is already entity-encoded, because several pre-render
scripts interpolate it with no escaping pass of their own. It carries no
React import, so it works in the CommonJS build scripts as well as the ESM
ones. Inject it into the real page body — never inside `<noscript>`, which
crawlers discount as page content.

## What is deliberate, and should not be "tidied up"

**`nofollow` stays.** This credit sits in the footer template of every site
ProSlot builds. A sitewide templated link repeated across a dozen sites by the
same firm is what Google describes as a link scheme; it passes no meaningful
authority either way, and removing the `nofollow` would only make the pattern
look manipulative. The way to earn authority from a client is one followed,
in-content link on a real page — not this.

**`noreferrer` is gone on purpose.** It stripped the Referer header. Its
removal, plus the UTM on the href, is what makes a click through the credit
measurable at all.

**The tagline renders outside the anchor.** Keeping it inside made the anchor
text a keyword-rich phrase repeated sitewide across every site this firm
builds, which is the clearest manipulation signal a footer link can send.
Brand-only anchor text costs nothing and keeps the credit harmless if a link
is ever made followed.

Each of these is pinned by a test, including one asserting the two renderers
produce the same anchor text, rel and destination.
