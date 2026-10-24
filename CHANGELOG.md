# Changelog

## 0.1.1
- Confidence signal: `stats.confident`, `stats.unknownWords`, `stats.weakMatches`, per-token report in `stats.tokens`.
- Lexicon and rule fixes from error analysis of the first held-out set: gender agreement (adjective vs adverb), times and file names, auxiliary *a* (*a modificat*), *de N ori*, jussive *să*, verb-subject inversion after *înainte să / după ce / când*, colour shades (*galben deschis*), relative *care*, clitic doubling, *unul/una*, new words (*culoar*, *rază*, *calculator*, *diferență*, *retrage*, *expira*, *ieri*…).
- Lazy, bit-sliced construction of the hypervector memory (~0.25 s, previously ~0.6 s at load).
- `encode(word)` and `similarity(a, b)` for visualisation.
- Fresh 60-command test set (`eval/test2.json`), written after this version was frozen.

## 0.1.0
- First version, frozen before the first held-out test set was opened. Results in `eval/v0.1.0/`.
