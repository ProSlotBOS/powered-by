/**
 * Four of the sites that consume this kit have a CommonJS pre-render script
 * (BoysOfSummer, LongIslandStanMusial, bluechipcollegeleague and
 * eastcoastyouthbaseball all lack "type": "module"), so the package ships a
 * CommonJS build alongside the ESM one. Node 22 can require() an ESM graph and
 * older Node cannot, which makes an ESM-only package a build that works on one
 * CI runner and fails on another — not a failure mode worth leaving in place
 * for a footer.
 *
 * Two builds is two chances to drift, which is the exact problem this kit was
 * written to end. These tests hold them together.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import * as esm from '../dist/index.js';

const require = createRequire(import.meta.url);
const cjs = require('../dist/cjs/index.js');

const TAGLINE = 'Custom Athletic Facility & Sports Academy Operating System';

describe('the CommonJS build matches the ESM build', () => {
  test('both entry points expose the same names', () => {
    const names = (m) => Object.keys(m).filter((k) => k !== 'default').sort();
    assert.deepEqual(names(cjs), names(esm));
  });

  test('renderPoweredByHtml agrees byte for byte', () => {
    for (const opts of [
      {},
      { tagline: TAGLINE },
      { tagline: TAGLINE, title: 'ProSlot BOS', nameStyle: 'color:#cbd5e1;' },
      { tagline: '<script>alert(1)</script>' },
    ]) {
      assert.equal(cjs.renderPoweredByHtml(opts), esm.renderPoweredByHtml(opts));
    }
  });

  test('the constants are identical', () => {
    assert.equal(cjs.PROSLOT_HREF, esm.PROSLOT_HREF);
    assert.equal(cjs.PROSLOT_REL, esm.PROSLOT_REL);
    assert.equal(cjs.PROSLOT_NAME, esm.PROSLOT_NAME);
    assert.equal(cjs.PROSLOT_LABEL, esm.PROSLOT_LABEL);
  });

  test('the React component is reachable from CommonJS too', () => {
    assert.equal(typeof cjs.PoweredBy, 'function');
  });
});
