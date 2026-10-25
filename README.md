# vsa-ro-translate

Translation to English and spell checking of technical and agentic commands (diagram editors, design and editing tools, animation timelines, enterprise apps), **over a vocabulary you choose**, built on a **Vector Symbolic Architecture** (hyperdimensional computing) memory.

- **Your vocabulary is the input.** Pass any number of dictionaries, in any languages. Romanian and English are built in; French ships as an example.
- **Spell checking over that vocabulary.** Typos, missing diacritics and inflections are corrected. Words that are not in the vocabulary are reported as errors with suggestions, never silently guessed.
- **Mixed language.** "Mută layer-ul selectat on top" is understood; English sentences are only spell checked.
- **Optional Chrome fallback.** Use only VSA, let Chrome's on-device translator handle what VSA is unsure about, or prefer Chrome whenever it exists.
- Runs in any browser, Node or WebView: one 97 KB script (35 KB gzipped), no model download. Median 0.2–2 ms per command on a laptop (under a millisecond when every word is known; each unknown word costs about 2 ms of search).

**Live demo:** <https://ml-circuits-research.github.io/vsa-ro-translate/>. Type in any loaded language, change the settings, add your own words, see the spell check and the hypervectors, and benchmark against Chrome's translator if your browser has it.

## Quick start

```html
<script src="https://cdn.jsdelivr.net/gh/ml-circuits-research/vsa-ro-translate@v0.2.0/dist/vsa-ro-translate.min.js"></script>
<script>
  VSARoTranslate.translate('Șterge toate săgețile roșii');   // "Delete all the red arrows"
</script>
```

ES module: `import VSA, { create, dictionaries } from 'https://cdn.jsdelivr.net/gh/ml-circuits-research/vsa-ro-translate@v0.2.0/dist/vsa-ro-translate.mjs'`.
Node: `npm install github:ml-circuits-research/vsa-ro-translate#v0.2.0`, then `require('vsa-ro-translate')`.
Or download the files from the [latest release](https://github.com/ml-circuits-research/vsa-ro-translate/releases/latest).

## Your vocabulary as a parameter

The translator knows exactly the dictionaries you pass to `create()`:

```js
const { create, dictionaries } = VSARoTranslate;

const t = create({
  dictionaries: [
    dictionaries.ro,          // built-in Romanian command vocabulary (optional)
    dictionaries.en,          // English base, for mixed Romanian-English text (optional)
    myVocabulary,             // your product's words, any language
  ],
});
```

Leave `dictionaries` out to get `[dictionaries.ro, dictionaries.en]`. Pass only your own dictionary to make the translator know nothing else: every other word becomes an error.

### Dictionary format

A dictionary is plain data. Only `lang` and one word list are required.

```js
const myVocabulary = {
  lang: 'ro',                  // source language (BCP 47): 'ro', 'fr', 'it', 'de', ...
  name: 'acme',
  // simplest: word -> English. Romanian nouns get their articles and cases generated.
  words: {
    tichet:  { en: 'ticket', plural: 'tichete' },
    sprint:  { en: 'sprint', plural: 'sprinturi' },
    escalada: { en: 'escalate', pos: 'v' },        // Romanian verb: conjugation generated
    urgent:  { en: 'urgent', pos: 'adj' },
    'tichet de suport': 'support ticket',          // several words = a phrase
  },
};
```

| Field | Format | Notes |
|---|---|---|
| `lang` | `'ro'` | Source language code. Used for language detection and for Chrome. |
| `words` | `{ word: 'english' }` or `{ word: { en, pos, plural, gender, forms, enPlural } }` | `pos`: `n` (default), `v`, `adj`, `adv`. `forms`: extra inflected forms. A key with spaces is a phrase. |
| `nouns` | `['singular\|plural\|gender\|english', ...]` | Same columns as the built-in lexicon. English plural override: `english;pl=people`. |
| `verbs` | `['infinitive\|class\|english\|form,form,...']` | Romanian classes: `ez`, `esc`, `a`, `e`, `i`, `irr`; `-` to guess. Other languages: list the forms. |
| `adjectives` | `['m\|f\|mpl\|fpl\|english']` or `['word\|english']` | |
| `functionWords` | `['word\|english\|TAG']` | TAG: `DET DEM POSS QUANT ORD NUM PRON CLITIC PREP CONJ ADV NEG Q AUX INTJ`. Use an empty English to drop a word (French `des\|\|DET`). |
| `phrases` | `{ 'zone de texte': 'text box' }` or `{ src: [english, TAG] }` | Matched on lemmas, so inflected phrases match too. |
| `senses` | `{ lemma: [['english', 'context words ...'], ...] }` | Word-sense choice by VSA context vectors. |
| `morphology` | `'ro'` or `'none'` | Default `'ro'` for `lang: 'ro'`, otherwise `'none'` (forms are listed explicitly). |

`dictionaries/fr.js` is a complete example for another language. It generates French verb forms with a few lines of code, which is fine: the engine only sees the resulting data.

### Any number of languages

```js
// <script src=".../dist/dictionaries/fr.js"> registers dictionaries.fr
const t = create({ dictionaries: [dictionaries.ro, dictionaries.fr, dictionaries.en, myItalian] });
t.translate('Ne supprime pas la légende').text;   // "Don't delete the legend"   (language: 'fr')
t.translate('Mută layer-ul selectat la stânga').text;   // "Move the selected layer to the left" (language: 'ro')
```

Each sentence's language is decided by the words that exist in only one dictionary. Romanian with English terms stays Romanian, and a sentence that is mostly English is kept as typed, with spelling fixed and stray foreign words translated. Romanian has a full set of word-order rules. Other languages get generic rules (adjective after noun, articles, *de/of* compounds, negation, questions), which suit Romance languages; the French example reaches 74% of command slots on its first run (see Results).

## Settings

```js
const t = create({
  dictionaries: [...],
  chrome: 'never',      // 'never'    VSA only
                        // 'fallback' Chrome's on-device translator when VSA is not confident
                        // 'prefer'   Chrome whenever it is available, VSA otherwise
  strict: false,        // true: text = null when a word is outside the vocabulary
});
t.setOptions({ chrome: 'fallback', strict: true });   // change at runtime
```

| Option | Default | Meaning |
|---|---|---|
| `chrome` | `'never'` | When to use Chrome's [Translator API](https://developer.chrome.com/docs/ai/translator-api) (desktop Chrome 138+, Edge). Only `translateAsync` uses it. |
| `strict` | `false` | Return no translation when a word is unknown (errors are always reported). |
| `minSim` | `0.64` | Minimum hypervector similarity for a spelling correction. |
| `maxEdits` | `'auto'` | Edits allowed for a correction: 1, or 2 for words of `longWord` (10)+ letters. A number, or `'loose'` (1/2/3 by length). |
| `minCorrectLength` | `5` | Shorter unknown words are reported, never corrected. |
| `firstLetterUntil` | `7` | Shorter words are not corrected by replacing their first letter. |
| `confidentSim` | `0.75` | Corrections below this similarity, or with 2 edits, make the result "not confident". |
| `maxSuggestions` | `3` | Suggestions per unknown word. |
| `D` | `2048` | Hypervector size; `1024` is about as accurate and 40% faster. |

Chrome needs a user gesture to download a language model, so call `t.prepareChrome()` from a click handler once. English sentences are never sent to Chrome, and Chrome receives the spell-corrected text. If Chrome is missing or cannot handle the language, `translateAsync` returns the VSA result with `chromeError` set.

## API

```js
const r = t.translate(text);            // VSA only, synchronous
const r = await t.translateAsync(text); // honours the chrome setting
```

| Field | Meaning |
|---|---|
| `text` | English, or `null` in strict mode when a word is unknown |
| `ok` | every word is in the vocabulary (exactly or after a correction) |
| `errors` | `[{ word, start, end, message, suggestions: [{ word, sim, edits, lang }] }]` |
| `corrections` | `[{ word, to, start, end, sim, edits, lang }]` |
| `language` | detected source language |
| `confident` | no errors and no weak corrections; the signal `chrome: 'fallback'` uses |
| `engine` | `'vsa'` or `'chrome'` (then `vsaText` holds the VSA output) |
| `source` | the input with spelling corrections applied |

```js
const s = t.spellcheck('Seteaza opacitaea stratului seletat');
s.text;     // "Seteaza opacitatea stratului selectat"
s.tokens;   // [{ text, start, end, status: 'ok' | 'corrected' | 'unknown' | 'name', suggestion, suggestions, lang }]
s.errors;   // words outside the vocabulary
```

Also: `t.knows(word)`, `t.languages`, `t.warmup()` (build the memory now instead of on the first unknown word), `t.info`, `t.encode(word)`, `t.similarity(a, b)`, `t.translateNaive(text)` (word-by-word baseline). The default instance is available as `VSARoTranslate.translate(text)` (returns a string), `translateDetailed`, `spellcheck`.

Names and labels are kept as written: quoted text (`nodul „Aprobare”`), capitalised words after a noun (`nodul Start`), mixed-case brands (`iPhone`), file names, times, hex colors.

## Results

All test commands were written by independent agents that never saw the dictionaries. A **slot** is something an agent needs in order to act (the action, the object, a value, a unit, a direction). chrF and BLEU use sacreBLEU defaults.

**Romanian, fresh set (60 commands, written after v0.1.1 was frozen):**

| System | chrF | Slots kept | Fully correct |
|---|---:|---:|---:|
| **VSA v0.2.0** | **67.1** | **78%** | **32%** |
| VSA v0.1.0 | 66.0 | 77% | 30% |
| Same vocabulary, word by word | 50.1 | 73% | 22% |

**Romanian, first held-out set (100 commands):** v0.1.0 frozen before the set was opened: chrF 72.3, 93% slots, 73% fully correct (word by word: 52.7 / 87% / 52%). A blind rater judged 85% of VSA translations executable, vs 62% word by word. v0.2.0, after error analysis on this set: chrF 77.2, 97%, 87%.

**Mixed Romanian–English (40) and French (30), written before v0.2.0:**

| Set | chrF | Slots kept | Fully correct |
|---|---:|---:|---:|
| Mixed, first run of the frozen engine | 76.9 | 79% | 35% |
| Mixed, after fixes from its errors | 78.8 | 80% | 38% |
| Mixed, word by word | 60.9 | 83% | 40% |
| French (example dictionary), first run | 67.8 | 74% | 30% |
| French, after fixes | 80.3 | 82% | 47% |
| French, word by word | 60.0 | 75% | 40% |

The sentence language was detected correctly for all 70 sentences (34 Romanian, 6 English, 30 French). On the mixed set word by word keeps a few more slots, mostly because some test answers accept only singular forms (`edge`) where VSA writes the correct plural.

**Spelling** (`scripts/calibrate-spell.js`: 700 synthetic single-letter typos of vocabulary words, 94 real Romanian words that are not in the vocabulary):

| | Default | Loose (`maxEdits: 'loose'`, no safety rules) |
|---|---:|---:|
| Typos corrected to the right word | 76% | 93% |
| Typos reported as unknown (with suggestions) | 20% | 0% |
| Typos corrected to a wrong word | 3% | 6% |
| Unknown words wrongly "corrected" into vocabulary words | 6 / 94 | 71 / 94 |

The default prefers an error to a guess: `tichete` (not in the vocabulary) is reported, not turned into `etichete`. The safety rules: one edit (two for long words), no correction that adds or removes a prefix (`neconectate` ≠ `conectate`), no first-letter replacement in short words, no cross-language correction of short words.

**Robustness (60 dev commands):** output unchanged for 60/60 without diacritics, and for 55/60 without diacritics plus one swapped letter (word by word: 1/60).

**Confidence:** on the fresh Romanian set, 47% of commands are confident; they keep 88% of slots and 50% are fully correct, vs 70% and 16% for the rest. That second group is what `chrome: 'fallback'` sends to Chrome.

### Compared with Chrome

Chrome's on-device translator handles open vocabulary far better than a dictionary can. Mozilla's comparable tiny ro→en model is about 17 MB ([model metadata](https://github.com/mozilla/firefox-translations-models)). The development environment could not download either model, so the head-to-head runs in your browser: open the demo in desktop Chrome and press *Run the comparison*. VSA's place next to them: no download, every browser including mobile, sub-millisecond, deterministic terminology, errors instead of guesses, and labels kept verbatim.

## How it works

1. **Tokenize**: clitics (`mută-l`), elisions (`l'image`), inversions (`puis-je`), loanwords with Romanian articles (`layer-ul`), numbers with units, times, file names, colors, quoted labels.
2. **Vocabulary memory (VSA)**: every word form of every dictionary is a 2048-bit hypervector, the majority bundle of its character bigrams and trigrams (`n-gram = ρ²(a) ⊕ ρ(b) ⊕ c`), built with bit-sliced counters.
3. **Language vote**: words that exist in only one dictionary decide the sentence language.
4. **Spelling**: unknown words are compared with the whole memory by Hamming distance; the closest 24 are re-ranked by edit distance (OSA), length and language, as in [vsa-spell](https://github.com/ml-circuits-research/vsa-spell), then accepted only under the safety rules above.
5. **Word sense** for ambiguous lemmas by superposed context vectors.
6. **Phrases and word order**: multiword expressions, then rules (Romanian set, generic Romance set) for noun phrases, genitives, clitics, prepositions, light verbs (`dă-i un resize` → *resize*), questions and negation.

From vsa-spell this project takes the n-gram encoding, bit-sliced bundling, the OSA re-rank and the idea of decoding over the user's dictionary. Its Double Metaphone (English-only phonetics), the 16 MB context models and the Harper grammar layer are not used, to stay dependency-free and small.

## Repository

```
src/vsa-translate.js       engine: dictionaries, hypervector memory, spelling, language vote, rules, Chrome
src/lexicon-ro-en.js       built-in Romanian dictionary
src/dict-en.js             built-in English base (function words, product terms)
dictionaries/fr.js         French example dictionary
dist/                      bundles (UMD, minified, ESM, .d.ts) and dist/dictionaries/
docs/index.html            demo page (GitHub Pages)
eval/                      test sets, outputs, results.json, frozen first runs (v0.1.0/, v0.2-firstlook/)
scripts/                   build, calibrate-spell, robustness, metrics
test/                      smoke tests and Chrome-policy tests (simulated Translator API)
```

```bash
npm run build      # dist/ and docs/index.html (terser optional: TERSER_PATH=…)
npm test
node eval/summarize.js   # re-runs every evaluation, writes eval/results.json
```

## Pe scurt (RO)

Traducere în engleză și corectare ortografică pentru comenzi tehnice, **pe vocabularul tău**. Dai la inițializare oricâte dicționare, în oricâte limbi (română și engleză incluse, franceză ca exemplu). Cuvintele care nu sunt în vocabular sunt raportate ca erori, cu sugestii, nu ghicite. Înțelege textul amestecat română–engleză. Din setări alegi dacă poate folosi traducătorul din Chrome: niciodată, doar când VSA nu e sigur, sau oricând există. Un singur script de 97 KB, fără model de descărcat, câteva milisecunde pe comandă (sub una când toate cuvintele sunt cunoscute).

## License

MIT
