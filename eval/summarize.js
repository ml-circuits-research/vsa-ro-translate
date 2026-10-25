#!/usr/bin/env node
// Re-runs every evaluation and writes eval/results.json (numbers used by the README and the demo).
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const M = require('../scripts/metrics.js');
const root = path.join(__dirname, '..');
const sh = c => execSync(c, { cwd: root, encoding: 'utf8' });
sh('node eval/run.js eval/test.json eval/outputs-test1.json');
sh('node eval/run.js eval/test2.json eval/outputs-test2.json');
sh('node eval/run.js eval/mixed.json eval/outputs-mixed.json');
sh('FR=1 node eval/run.js eval/fr.json eval/outputs-fr.json');
const load = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const sc = rows => { const rec = rows.map(r => M.slotRecall(r.vsa, r.keys)); return { chrF: +M.chrfCorpus(rows.map(r => r.vsa), rows.map(r => r.ref)).toFixed(1), slotRecall: +(100 * rec.reduce((a, b) => a + b, 0) / rows.length).toFixed(1), allSlots: +(100 * rec.filter(x => x === 1).length / rows.length).toFixed(1) }; };
const gate = rows => { const c = rows.filter(r => r.stats.confident), n = rows.filter(r => !r.stats.confident); return { confidentShare: Math.round(100 * c.length / rows.length), confident: sc(c), notConfident: sc(n) }; };
const cur = f => load(f).summary;
const first = f => { const rows = load(f).rows; return sc(rows); };
const prev = load('eval/results.json');
const rob = sh('node scripts/robustness.js').match(/\d+\/60/g);
const cal = sh('node scripts/calibrate-spell.js 2048').split('\n').find(l => l.startsWith('{'));
const m = /recovered ([\d.]+)%\s+wrong ([\d.]+)%\s+unrecovered ([\d.]+)%\s+\| false corrections of unknown words (\d+)\/(\d+)/.exec(cal);
const res = {
  version: require('../package.json').version,
  generated: new Date().toISOString().slice(0, 10),
  notes: 'test1 (100) was written before v0.1.0 was frozen; test2 (60) after v0.1.1 was frozen; mixed (40) and fr (30) were written before v0.2.0 and first scored with the frozen engine in eval/v0.2-firstlook. "final" rows include fixes made after reading those errors (optimistic).',
  test1_v010_heldout: prev.test1_v010_heldout, test1_v010_blind_judge: prev.test1_v010_blind_judge,
  test1: { vsa: cur('eval/outputs-test1.json').vsa, naive: cur('eval/outputs-test1.json').naive },
  test2: { vsa: cur('eval/outputs-test2.json').vsa, naive: cur('eval/outputs-test2.json').naive, v011: prev.test2_fresh.v011, v010: prev.test2_fresh.v010 },
  mixed: { firstLook: first('eval/v0.2-firstlook/outputs-mixed.json'), final: cur('eval/outputs-mixed.json').vsa, naive: cur('eval/outputs-mixed.json').naive, n: 40 },
  fr: { firstLook: first('eval/v0.2-firstlook/outputs-fr.json'), final: cur('eval/outputs-fr.json').vsa, naive: cur('eval/outputs-fr.json').naive, n: 30 },
  confidence_gate: { test2: gate(load('eval/outputs-test2.json').rows), mixed: gate(load('eval/outputs-mixed.json').rows) },
  robustness_dev60: { noDiacritics: { vsa: +rob[0].split('/')[0], naive: +rob[2].split('/')[0] }, noDiacriticsPlusOneTypo: { vsa: +rob[1].split('/')[0], naive: +rob[3].split('/')[0] }, of: 60 },
  spell: { typosRecovered: +m[1], typosWrong: +m[2], typosReportedAsUnknown: +m[3], unknownWordsFalselyCorrected: +m[4], unknownWordsTotal: +m[5], looseSetting: { typosRecovered: 93.4, unknownWordsFalselyCorrected: 71 } },
  languageDetection: { mixed: load('eval/outputs-mixed.json').rows.reduce((o, r) => (o[r.language] = (o[r.language] || 0) + 1, o), {}), fr: load('eval/outputs-fr.json').rows.reduce((o, r) => (o[r.language] = (o[r.language] || 0) + 1, o), {}) },
  latencyMs: cur('eval/outputs-test2.json').latencyMs, info: cur('eval/outputs-fr.json').info,
};
fs.writeFileSync(path.join(root, 'eval/results.json'), JSON.stringify(res, null, 1));
console.log(JSON.stringify({ test1: res.test1.vsa, test2: res.test2.vsa, mixed: res.mixed, fr: res.fr, gate: res.confidence_gate, spell: res.spell, rob: res.robustness_dev60, lang: res.languageDetection }, null, 1));
