// Chrome setting with a simulated Translator API: node test/chrome-policy.js
const assert = require('assert');
let created = 0, calls = 0;
globalThis.self = { Translator: {
  availability: async ({ sourceLanguage }) => sourceLanguage === 'ro' ? 'available' : 'unavailable',
  create: async () => { created++; return { translate: async s => { calls++; return '[chrome] ' + s; } }; },
} };
const api = require('../dist/vsa-ro-translate.js');
(async () => {
  const t = api.create();
  const sure = 'Adaugă un cerc roșu', unsure = 'Șterge tichetele vechi';
  // never: VSA only
  t.setOptions({ chrome: 'never' });
  assert.strictEqual((await t.translateAsync(unsure)).engine, 'vsa');
  // fallback: Chrome only when VSA is not confident
  t.setOptions({ chrome: 'fallback' });
  assert.strictEqual((await t.translateAsync(sure)).engine, 'vsa');
  const fb = await t.translateAsync(unsure);
  assert.strictEqual(fb.engine, 'chrome'); assert.strictEqual(fb.text, '[chrome] Șterge tichetele vechi'); assert.ok(fb.vsaText && !fb.ok);
  // prefer: Chrome whenever available
  t.setOptions({ chrome: 'prefer' });
  assert.strictEqual((await t.translateAsync(sure)).engine, 'chrome');
  // English sentences are never sent to Chrome
  assert.strictEqual((await t.translateAsync('Move the layer to the left')).engine, 'vsa');
  // corrected source is what Chrome receives
  const c = await t.translateAsync('Exporta diagarma ca PDF');
  assert.strictEqual(c.text, '[chrome] Exporta diagramă ca PDF');
  // unavailable language pair -> VSA with chromeError
  const fr = api.create({ dictionaries: [require('../dist/dictionaries/fr.js'), api.dictionaries.en], chrome: 'prefer' });
  const x = await fr.translateAsync('Ajoute un cercle');
  assert.strictEqual(x.engine, 'vsa'); assert.ok(/cannot translate fr/.test(x.chromeError));
  assert.strictEqual(created, 1, 'one Chrome translator per language, cached');
  console.log('chrome policy tests passed (translator created', created, 'time, calls', calls + ')');
})().catch(e => { console.error('FAIL', e); process.exit(1); });
