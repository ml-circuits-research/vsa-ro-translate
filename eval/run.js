#!/usr/bin/env node
// Translate a test set with the current source and score it.
// node eval/run.js eval/test.json eval/outputs-test1.json
const path = require('path'), fs = require('fs');
const L = require('../src/lexicon-ro-en.js');
const { createTranslator } = require('../src/vsa-ro-en.js');
const M = require('../scripts/metrics.js');
const [inp, outp] = process.argv.slice(2);
const test = JSON.parse(fs.readFileSync(inp, 'utf8'));
const T = createTranslator(L, {}); T.warmup();
const rows = test.map(it => {
  const t0 = process.hrtime.bigint(); const r = T.translate(it.ro); const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  return { id: it.id, domain: it.domain, ro: it.ro, ref: it.ref, keys: it.keys, vsa: r.text, naive: T.translateNaive(it.ro), ms, stats: { exact: r.stats.exact, vsa: r.stats.vsa, unknown: r.stats.unknown, vsaLog: r.stats.vsaLog, confident: r.stats.confident, unknownWords: r.stats.unknownWords } };
});
const score = sys => {
  const chrF = M.chrfCorpus(rows.map(r => r[sys]), rows.map(r => r.ref));
  const rec = rows.map(r => M.slotRecall(r[sys], r.keys));
  return { chrF: +chrF.toFixed(1), slotRecall: +(100 * rec.reduce((a, b) => a + b, 0) / rows.length).toFixed(1), allSlots: +(100 * rec.filter(x => x === 1).length / rows.length).toFixed(1) };
};
const ms = rows.map(r => r.ms).sort((a, b) => a - b);
const summary = { n: rows.length, vsa: score('vsa'), naive: score('naive'), latencyMs: { median: +ms[Math.floor(ms.length / 2)].toFixed(3), p95: +ms[Math.floor(ms.length * 0.95)].toFixed(3) }, info: T.info };
if (outp) fs.writeFileSync(outp, JSON.stringify({ summary, rows }, null, 1));
console.log(path.basename(inp), JSON.stringify(summary));
