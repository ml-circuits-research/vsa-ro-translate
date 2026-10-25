// Regression tests: node test/smoke.js
const assert = require('assert');
const api = require('../dist/vsa-ro-translate.js');
const fr = require('../dist/dictionaries/fr.js');
let fail = 0;
const eq = (got, exp, label) => { try { assert.strictEqual(got, exp); console.log('ok  ', label || exp); } catch (e) { fail++; console.log('FAIL', label || '', '\n     got:', got, '\n     exp:', exp); } };

// 1. default translator (Romanian + English vocabulary)
eq(api.translate('Adaugă un dreptunghi albastru în colțul din stânga sus'), 'Add a blue rectangle in the top left corner');
eq(api.translate('muta caseta selectata cu 20 de pixeli la dreapta'), 'Move the selected box by 20 pixels to the right');
eq(api.translate('Cum export prezentarea în PDF?'), 'How do I export the presentation to PDF?');
eq(api.translate('Adaugă-i casetei un chenar gri de 2 px'), 'Add a 2 px gray border to the box');

// 2. spelling: corrected, flagged, unknown
let r = api.translateDetailed('Exporta diagarma ca PDF');
eq(r.text, 'Export the diagram as PDF'); assert.ok(r.ok && r.corrections[0].to === 'diagramă');
r = api.translateDetailed('Adagua un cerc rosu');
eq(r.text, 'Add a red circle', 'first-letter-region typo recovered (Adagua)');
r = api.translateDetailed('Sterge tichetele vechi');
assert.ok(!r.ok && r.errors[0].word === 'tichetele', 'unknown word must be an error, not a guess'); console.log('ok   unknown word reported:', r.errors[0].message);
const sc = api.spellcheck('Seteaza opacitaea la 50% pe stratul seletat');
eq(sc.text, 'Seteaza opacitatea la 50% pe stratul selectat', 'spellcheck returns corrected source');

// 3. mixed Romanian-English and English sentences
eq(api.translate('Mută layer-ul selectat la stânga'), 'Move the selected layer to the left');
eq(api.translate('Dă-i un resize la container-ul principal'), 'Resize the main container');
r = api.translateDetailed('Move the selcted layer to the left');
eq(r.language, 'en', 'English sentence detected'); eq(r.text, 'Move the selected layer to the left');

// 4. vocabulary as a parameter: custom words, strict mode
const t = api.create({ dictionaries: [api.dictionaries.ro, api.dictionaries.en, { lang: 'ro', name: 'acme', words: { tichet: { en: 'ticket', plural: 'tichete' }, 'tichet de suport': 'support ticket' } }], strict: true });
eq(t.translate('Șterge tichetele vechi').text, 'Delete the old tickets');
eq(t.translate('Deschide un tichet de suport').text, 'Open a support ticket');
eq(t.translate('Sterge cutiuta').text, null, 'strict mode: unknown word -> no text');

// 5. any language: French dictionary
const f = api.create({ dictionaries: [fr, api.dictionaries.en] });
eq(f.translate('Ajoute un rectangle bleu en haut à gauche').text, 'Add a blue rectangle top left');
eq(f.translate('Ne supprime pas la légende').text, "Don't delete the legend");
eq(f.translate('Suprime le calque vert').corrections[0].to, 'Supprime');

// 6. Chrome setting without Chrome (Node): falls back to VSA
t.setOptions({ chrome: 'prefer', strict: false });
t.translateAsync('Adaugă un cerc').then(x => {
  eq(x.engine, 'vsa', 'chrome=prefer without Translator API -> VSA');
  console.log(fail ? fail + ' failures' : 'all smoke tests passed', '| version', api.version);
  process.exit(fail ? 1 : 0);
});
