# Changelog

## 0.2.0
- **Vocabulary as a parameter**: `create({ dictionaries: [...] })` takes any number of dictionaries in any languages (`words`, `nouns`, `verbs`, `adjectives`, `functionWords`, `phrases`, `senses`). Built-in `dictionaries.ro` and `dictionaries.en`; `dictionaries/fr.js` as an example of another language.
- **Spell checking over the vocabulary** (`spellcheck()`, and inside `translate()`): Hamming search in the hypervector memory with an OSA edit-distance re-rank (from vsa-spell), calibrated safety rules, errors with suggestions for words outside the vocabulary, `strict` mode.
- **Mixed language**: per-sentence language vote; English vocabulary derived from the dictionaries; English sentences are only spell checked; Romanian light verbs with English nouns (`dă-i un resize`).
- **Chrome setting**: `chrome: 'never' | 'fallback' | 'prefer'`, `translateAsync()`, `prepareChrome()`, cached translators per language.
- Results objects now carry `ok`, `errors`, `corrections`, `language`, `confident`, `engine`, `source`. `VSARoTranslate.translate(text)` still returns a string.
- New test sets: mixed Romanian–English (40), French (30); first runs frozen in `eval/v0.2-firstlook/`.


## 0.1.1
- Confidence signal: `stats.confident`, `stats.unknownWords`, `stats.weakMatches`, per-token report in `stats.tokens`.
- Lexicon and rule fixes from error analysis of the first held-out set: gender agreement (adjective vs adverb), times and file names, auxiliary *a* (*a modificat*), *de N ori*, jussive *să*, verb-subject inversion after *înainte să / după ce / când*, colour shades (*galben deschis*), relative *care*, clitic doubling, *unul/una*, new words (*culoar*, *rază*, *calculator*, *diferență*, *retrage*, *expira*, *ieri*…).
- Lazy, bit-sliced construction of the hypervector memory (~0.25 s, previously ~0.6 s at load).
- `encode(word)` and `similarity(a, b)` for visualisation.
- Fresh 60-command test set (`eval/test2.json`), written after this version was frozen.

## 0.1.0
- First version, frozen before the first held-out test set was opened. Results in `eval/v0.1.0/`.
