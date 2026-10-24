# vsa-ro-translate

Fast, offline **Romanian → English** translation of technical and agentic commands (diagram editors, design/editing tools, animation timelines, enterprise apps), built on a **Vector Symbolic Architecture** (hyperdimensional computing) lexicon.

- Runs in any browser, Node or a WebView: one 76 KB script (28 KB gzipped), no model download, no server.
- Under a millisecond per command (median 0.2–0.4 ms on a laptop).
- Robust to missing diacritics, common typos and unseen inflections, thanks to a 2048-bit hypervector memory of ~5,500 word forms.
- Tells you when it is unsure (`stats.confident`), so you can route those commands to a neural translator.
- Output is plain, sometimes telegraphic English: *"Add a 2 px gray border to the box and move the Start node by 20 pixels to the right"*.

**Live demo:** <https://ml-circuits-research.github.io/vsa-ro-translate/> (GitHub Pages, from `docs/`). The demo shows how every word was resolved, draws the hypervectors, and runs a side-by-side benchmark against Chrome's built-in translator when your browser has it.

## Quick start

Browser, one script tag:

```html
<script src="https://cdn.jsdelivr.net/gh/ml-circuits-research/vsa-ro-translate@v0.1.1/dist/vsa-ro-translate.min.js"></script>
<script>
  VSARoTranslate.translate('Șterge toate săgețile roșii');   // "Delete all the red arrows"
</script>
```

ES module:

```js
import { translate, translateDetailed } from
  'https://cdn.jsdelivr.net/gh/ml-circuits-research/vsa-ro-translate@v0.1.1/dist/vsa-ro-translate.mjs';

const r = translateDetailed('Exporta diagarma ca PDF');  // note the typo and missing diacritics
r.text;               // "Export the diagram as PDF"
r.stats.confident;    // true
r.stats.vsaLog;       // ["diagarma→diagrama (0.76)"]
```

Node (no dependencies):

```bash
npm install github:ml-circuits-research/vsa-ro-translate#v0.1.1
```
```js
const { translate } = require('vsa-ro-translate');
```

Or download `vsa-ro-translate.min.js` from the [latest release](https://github.com/ml-circuits-research/vsa-ro-translate/releases/latest) and include it directly.

### Hybrid: VSA first, neural fallback when unsure

```js
async function toEnglish(ro) {
  const r = VSARoTranslate.translateDetailed(ro);
  if (r.stats.confident || !('Translator' in self)) return r.text;
  // Chrome/Edge desktop on-device translator; needs a user gesture the first time
  const t = await Translator.create({ sourceLanguage: 'ro', targetLanguage: 'en' });
  return t.translate(ro);
}
```

## API

| Call | Returns |
|---|---|
| `translate(text)` | English string |
| `translateDetailed(text)` | `{ text, ms, stats }`. `stats.confident`, `stats.unknownWords`, `stats.weakMatches`, `stats.tokens` (how each word was resolved: `exact`, `vsa`, `phrase`, `label`, `unknown`), `stats.vsaLog` |
| `translateNaive(text)` | Word-by-word baseline with the same lexicon (for comparison) |
| `warmup()` | Builds the hypervector memory now (otherwise built on the first unknown word, ~0.25 s). Returns ms |
| `create({ D, threshold, confidentSim })` | An independent translator. Defaults: `D: 2048`, `threshold: 0.70`, `confidentSim: 0.75` |
| `encode(word)`, `similarity(a, b)` | The word's hypervector (`Uint32Array`) and the Hamming similarity of two words |

## Results

All test commands were written by independent agents that never saw the lexicon. A **slot** is something an agent needs in order to act correctly (the action, the object, a value, a unit, a direction). chrF and BLEU use sacreBLEU defaults against human-style references.

**Fresh set, 60 commands, written after v0.1.1 was frozen (the clean number):**

| System | chrF | BLEU | Slots kept | Fully correct |
|---|---:|---:|---:|---:|
| **VSA v0.1.1** | **67.1** | **43.3** | **78%** | **32%** |
| VSA v0.1.0 | 66.0 | | 77% | 30% |
| Same lexicon, word by word | 50.2 | 20.0 | 73% | 22% |

**First held-out set, 100 commands (v0.1.0 frozen before it was opened):**

| System | chrF | BLEU | Slots kept | Fully correct |
|---|---:|---:|---:|---:|
| **VSA v0.1.0** | **72.3** | **49.7** | **93%** | **73%** |
| Same lexicon, word by word | 52.7 | 24.6 | 87% | 52% |
| Copy the Romanian source | 25.9 | 3.1 | 18% | 0% |
| VSA v0.1.1 (fixes made after reading this set's errors, optimistic) | 76.7 | 55.6 | 97% | 86% |

Blind rating of the first set by a separate model that saw only the reference and the candidate (0 = wrong, 1 = partly wrong, 2 = correct but telegraphic, 3 = natural): **85%** of VSA translations would make an agent do the right thing (scores 2–3) and 33% read naturally, vs 62% and 3% for word-by-word.

**Confidence flag (fresh set):** half the commands are flagged confident. Those keep 87% of slots and 50% are fully correct. The other half keep 69% and 13% are fully correct. Routing the second half to a neural translator is the intended hybrid.

**Robustness (60 dev commands):** output is unchanged for 60/60 when diacritics are removed, and for 34/60 when diacritics are removed *and* one letter is swapped (word by word: 1/60). On synthetic single-letter typos the memory recovers the right word 445/515 times (wrong word 8/515) and falsely matches 9/68 words that are not in the lexicon. That is why weak matches lower the confidence flag.

**Where it fails:** words outside the ~800-lemma lexicon pass through in Romanian (`vânzări`, `rutare`, `tichete`, `roți`). It is a closed-vocabulary tool. Grow `src/lexicon-ro-en.js` with your product's command vocabulary and it improves directly.

### Compared with neural translators

Chrome's built-in [Translator API](https://developer.chrome.com/docs/ai/translator-api) (desktop Chrome 138+, Edge) and Firefox's Bergamot models translate open-domain text far better than a lexicon can. Mozilla's tiny ro→en model is about 17 MB and scores 39.9 BLEU on the general-domain FLORES benchmark ([model metadata](https://github.com/mozilla/firefox-translations-models)), which is not comparable with the command sets here. The development environment for this release could not download either model, so **the head-to-head runs in your browser**: open the demo in desktop Chrome and press *Run the comparison* to get chrF, slot recall and latency for VSA, Chrome and the hybrid on the same 160 commands.

What VSA brings next to them: no download (76 KB vs tens of MB), every browser including mobile Safari and in-app WebViews, sub-millisecond latency, deterministic terminology (your lexicon decides that *strat* is *layer*), and names and labels kept verbatim.

## How it works

1. **Tokenize** Romanian, split clitics (`mută-l` → *move it*), keep numbers with units, times, file names, hex colors and quoted labels.
2. **Lexical lookup in a VSA item memory.** Each known word form is a 2048-bit hypervector: the majority bundle of its character bigrams and trigrams, where an n-gram is the XOR of permuted character vectors (`ρ²(a) ⊕ ρ(b) ⊕ c`). Exact forms hit directly; anything else is cleaned up to the nearest stored vector (Hamming distance, restricted to the same first letter, accepted at similarity ≥ 0.70). Bundling is bit-sliced: per-bit counters are kept as bit planes and updated with word-wide ripple-carry adders.
3. **Word sense** for ambiguous lemmas: each sense has a prototype bundled from context lemmas; the sentence's context vectors vote by superposed similarity.
4. **Phrases and order rules** (symbolic, ~350 lines): multiword expressions (*cadru cheie* → *keyframe*, *trimite în spate* → *send to back*), noun–adjective swap, genitives (*culoarea textului* → *the color of the text*), datives, prepositions by verb context (*cu 20 px* → *by*, *cu 3 coloane* → *with*), questions (*Cum export…?* → *How do I export…?*), verb-subject inversion in subordinate clauses.

VSA does the memory and the sense choice. Grammar is rules. That division is deliberate: hypervectors are good at robust association, not at generating fluent word order.

## Repository

```
src/lexicon-ro-en.js     lexicon: verbs, nouns, adjectives, function words, phrases, sense contexts
src/vsa-ro-en.js         engine: hypervectors, item memory, analysis, rule layer
dist/                    built bundles (UMD, minified, ESM, .d.ts)
docs/index.html          self-contained demo page (GitHub Pages)
eval/                    test sets, outputs, scores, blind ratings (eval/v0.1.0 = frozen first release)
scripts/build.js         builds dist/ and the demo page
scripts/calibrate.js     threshold calibration: synthetic typos vs out-of-lexicon words
scripts/robustness.js    diacritics and typo robustness on the dev set
test/smoke.js            regression tests
```

```bash
npm run build      # dist/ and docs/index.html (terser optional: TERSER_PATH=…)
npm test
npm run eval       # translates and scores eval/test.json and eval/test2.json
```

## Extending

- **More vocabulary:** add lines to `NOUNS`, `VERBS` (`infinitive|class|english|irregular forms`), `ADJ` or `MWE`. Inflected forms are generated; the hypervector memory covers the rest.
- **Other source languages:** the engine is language-agnostic at the memory level; a new source language needs its own lexicon file and its word-order rules (Italian, Spanish, French and Portuguese are closest to the Romanian rules).

## Pe scurt (RO)

Traducere rapidă română → engleză pentru comenzi tehnice (diagrame, editare, animații, aplicații enterprise), direct în browser. Un singur script de 76 KB, fără model de descărcat, sub o milisecundă pe comandă. Folosește o memorie hiperdimensională (VSA) ca să recunoască cuvintele scrise fără diacritice, cu greșeli de tastare sau la forme flexionate. Engleza rezultată e uneori telegrafică, dar inteligibilă. Când nu e sigur, o spune (`stats.confident`), ca să poți trimite comanda unui traducător neural (de ex. API-ul Translator din Chrome). Pe un set nou de 60 de comenzi păstrează 78% din informațiile necesare unui agent. Pe primul set de 100 de comenzi, 85% din traduceri sunt executabile corect.

## License

MIT
