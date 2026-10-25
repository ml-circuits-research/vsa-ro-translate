Translation to English and spell checking of technical and agentic commands over **the vocabulary you pass in**: any number of dictionaries, any languages (Romanian and English built in, French as an example), with a hyperdimensional (VSA) memory. Words outside the vocabulary are reported as errors with suggestions. Optional Chrome on-device translator: never, only when VSA is unsure, or whenever available.

```html
<script src="https://cdn.jsdelivr.net/gh/ml-circuits-research/vsa-ro-translate@v0.2.0/dist/vsa-ro-translate.min.js"></script>
<script>
  const t = VSARoTranslate.create({
    dictionaries: [VSARoTranslate.dictionaries.ro, VSARoTranslate.dictionaries.en,
                   { lang: 'ro', words: { tichet: { en: 'ticket', plural: 'tichete' } } }],
    chrome: 'fallback',
  });
  t.translate('Închide tichetul vechi').text;   // "Close the old ticket"
  t.spellcheck('Seteaza opacitaea stratului').text;
</script>
```

**Assets**: `vsa-ro-translate.min.js` (UMD, global `VSARoTranslate`), `vsa-ro-translate.mjs` (ES module), `vsa-ro-translate.d.ts`, `fr.js` (French dictionary), `vsa-ro-en-demo.html` (self-contained demo).

**Results** (independent test sets, details in the README): fresh Romanian set chrF 67.1, 78% of command slots kept; French with the example dictionary 74% of slots on the first run; language detected correctly for all 70 mixed/French sentences; spelling: 76% of typos corrected, 20% reported with suggestions, and only 6 of 94 unknown words wrongly corrected.

Live demo: https://ml-circuits-research.github.io/vsa-ro-translate/
