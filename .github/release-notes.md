Romanian → English translation of technical and agentic commands (diagrams, editing, animation, enterprise), in the browser, with a hyperdimensional (VSA) lexicon. No model download, under a millisecond per command.

**Use it**

```html
<script src="https://cdn.jsdelivr.net/gh/ml-circuits-research/vsa-ro-translate@v0.1.1/dist/vsa-ro-translate.min.js"></script>
<script>VSARoTranslate.translate('Exportă diagrama ca PDF') // "Export the diagram as PDF"</script>
```

or download `vsa-ro-translate.min.js` below. `translateDetailed()` adds `stats.confident` so you can route unsure commands to a neural translator (e.g. Chrome's Translator API).

**Assets**
- `vsa-ro-translate.min.js`: browser/Node UMD, global `VSARoTranslate` (76 KB, 28 KB gzipped)
- `vsa-ro-translate.mjs`: ES module
- `vsa-ro-translate.d.ts`: TypeScript types
- `vsa-ro-en-demo.html`: the self-contained demo page (open it in desktop Chrome to compare with Chrome's built-in translator)

**Results** (independent test sets, details in the README)
- Fresh 60 commands, never seen: chrF 67.1, 78% of command slots kept, 32% fully correct (word-by-word with the same lexicon: 50.2 / 73% / 22%).
- First 100 commands, v0.1.0 frozen: chrF 72.3, 93% slots, 73% fully correct; a blind rater judged 85% of translations executable.
- Commands outside the ~800-lemma vocabulary pass through in Romanian and are flagged not confident.
