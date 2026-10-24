# Evaluation data

| File | What |
|---|---|
| `dev.json` | 60 commands written while building the translator (used for debugging) |
| `test.json` | 100 commands (30 diagram, 30 edit, 25 animation, 15 enterprise) written by an independent agent before v0.1.0 was frozen. Each item: `ro`, `ref` (English reference), `keys` (slots an agent must understand, with accepted synonyms) |
| `test2.json` | 60 fresh commands (15 per domain) written by another independent agent after v0.1.1 was frozen |
| `outputs-test1.json`, `outputs-test2.json` | Current outputs with per-item stats and the run summary |
| `results.json` | All headline numbers used by the README and the demo |
| `v0.1.0/` | Frozen v0.1.0 source, its outputs and scores on `test.json`, and the blind ratings (`blind_judge.json`, 200 shuffled VSA and word-by-word outputs rated 0–3 by a separate model that saw only reference and candidate) |

Metrics: chrF and BLEU with sacreBLEU defaults (`scripts/metrics.js` reproduces sacreBLEU's chrF exactly); slot recall = share of key groups with at least one accepted alternative in the output (word-boundary match); fully correct = all slots present.

About 30% of the commands are written without diacritics and about 8% contain a realistic typo. Quoted labels and names are kept verbatim by the translator; references sometimes translate them, which the slot metric counts as a miss.
