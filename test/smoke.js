// Minimal regression tests: node test/smoke.js
const assert = require('assert');
const api = require('../dist/vsa-ro-translate.js');
const cases = [
  ['Adaugă un dreptunghi albastru în colțul din stânga sus', 'Add a blue rectangle in the top left corner'],
  ['muta caseta selectata cu 20 de pixeli la dreapta', 'Move the selected box by 20 pixels to the right'],
  ['Setează durata animației la 2 secunde', 'Set the duration of the animation to 2 seconds'],
  ['Cum export prezentarea în PDF?', 'How do I export the presentation to PDF?'],
  ['Adaugă-i casetei un chenar gri de 2 px', 'Add a 2 px gray border to the box'],
  ['Fă cercul roșu și mai mare', 'Make the circle red and larger'],
];
let fail = 0;
for (const [ro, en] of cases) {
  const out = api.translate(ro);
  try { assert.strictEqual(out, en); console.log('ok  ', ro); } catch (e) { fail++; console.log('FAIL', ro, '\n     got:', out, '\n     exp:', en); }
}
// robustness: missing diacritics and one typo
assert.strictEqual(api.translate('Seteaza durata animatiei la 2 secunde'), 'Set the duration of the animation to 2 seconds');
// typo recovered by the hypervector memory, with a strong match -> confident
let r = api.translateDetailed('Exporta diagarma ca PDF');
assert.strictEqual(r.text, 'Export the diagram as PDF'); assert.ok(r.stats.vsa === 1 && r.stats.confident);
// recovered but weak match -> translated, yet flagged for a fallback
r = api.translateDetailed('Aliniaza nodruile la stanga');
assert.strictEqual(r.text, 'Align the nodes to the left'); assert.strictEqual(r.stats.confident, false);
// not recovered (letter swap near the start) -> passed through and flagged
r = api.translateDetailed('Adagua un cerc rosu');
assert.deepStrictEqual(r.stats.unknownWords, ['Adagua']); assert.strictEqual(r.stats.confident, false);
console.log(fail ? fail + ' failures' : 'all smoke tests passed', '| version', api.version);
process.exit(fail ? 1 : 0);
