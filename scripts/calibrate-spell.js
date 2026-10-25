// Calibrate the speller: synthetic typos (any position) vs. real words outside the vocabulary.
// node scripts/calibrate-spell.js [D]
const L = require('../src/lexicon-ro-en.js'), EN = require('../src/dict-en.js');
const E = require('../src/vsa-translate.js');
const D = +(process.argv[2] || 2048);
const T = E.createTranslator({ D, dictionaries: [Object.assign({ lang: 'ro' }, L), EN] });
T.warmup();
// vocabulary forms with their lemmas (from the translator itself)
const forms = [];
const seen = new Set();
for (const line of (L.NOUNS + L.VERBS).split('\n').map(s => s.trim()).filter(Boolean)) {
  const p = line.split('|'); const cand = [p[0], p[1]].concat(p[3] && line.split('|').length > 4 ? [] : []);
  for (const w of cand) { const k = E.strip(w || ''); if (k.length >= 4 && !seen.has(k) && T.knows(k) && !/[^a-z]/.test(k)) { seen.add(k); forms.push(k); } }
}
let seed = 12345; const rnd = () => { seed ^= seed << 13; seed >>>= 0; seed ^= seed >>> 17; seed ^= seed << 5; seed >>>= 0; return seed / 4294967296; };
const abc = 'abcdefghijlmnoprstuvz';
function typo(w) {
  const i = Math.floor(rnd() * w.length), t = Math.floor(rnd() * 4);
  if (t === 0) return w.slice(0, i) + w.slice(i + 1);
  if (t === 1) return w.slice(0, i) + abc[Math.floor(rnd() * abc.length)] + w.slice(i + 1);
  if (t === 2 && i < w.length - 1) return w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
  return w.slice(0, i) + abc[Math.floor(rnd() * abc.length)] + w.slice(i);
}
const lemmaOf = w => new Set((T._lemmas ? [] : []));
const sample = [];
while (sample.length < 700) { const w = forms[Math.floor(rnd() * forms.length)]; const v = typo(w); if (v !== w && !T.knows(v) && v.length >= 3) sample.push([v, w]); }
const OOV = `vanzari productie rutare tichete roti tura pista colaj munte orizont neconectate neplatite apartine discreta proportional
fix liber banner mockup beneficiar financiar marketing angajat furnizare evaluare strategic buget trimestru achizitii logistica
contabilitate juridic salariu concediu pontaj factura chitanta cheltuieli venituri profit pierdere clientela vanzator cumparator
oferta licitatie stoc depozit transport livrare curier comanda retur garantie reclamatie suport abonament pachet tarif reducere
calendar programare intalnire sedinta agenda prezenta absenta raportare indicatori performanta obiective strategie viziune misiune
pisica caine copac apa soare ploaie zapada vacanta mancare masina drum oras sat munte mare rau padure floare iarba
algoritm retea neuronala vector simbolic hiperdimensional antrenare inferenta model parametru gradient
rata conversie regiune trend crestere scadere medie mediana procentaj distributie histograma`.split(/\s+/).filter(w => w.length >= 4 && !T.knows(w));
function run(o) {
  T.setOptions(o);
  let ok = 0, wrong = 0, miss = 0;
  for (const [v, w] of sample) {
    const s = T._spell(v, 'ro');
    if (!s.accepted) { miss++; continue; }
    // correct if the suggestion is the original form or another form of the same lemma
    const a = T.translate(s.best.key).stats.tokens[0], b = T.translate(w).stats.tokens[0];
    if (s.best.key === w || a && b && a.lemma === b.lemma) ok++; else wrong++;
  }
  let fp = 0; const fps = [];
  for (const w of OOV) { const s = T._spell(w, 'ro'); if (s.accepted) { fp++; fps.push(w + '→' + s.best.key); } }
  return { ok, wrong, miss, fp, n: sample.length, nOOV: OOV.length, fps };
}
const grid = [];
for (const firstLetterUntil of [7]) grid.push({ maxEdits: 'auto', longWord: 10, minSim: 0.64, wEd: 0.08, minCorrectLength: 5, firstLetterUntil });
console.log('D', D, '| typo samples', sample.length, '| out-of-vocabulary words', OOV.length);
for (const g of grid) {
  const r = run(g);
  console.log(JSON.stringify(g), `recovered ${(100 * r.ok / r.n).toFixed(1)}%  wrong ${(100 * r.wrong / r.n).toFixed(1)}%  unrecovered ${(100 * r.miss / r.n).toFixed(1)}%  | false corrections of unknown words ${r.fp}/${r.nOOV}`);
}
const best = run(JSON.parse(process.env.SHOW || '{"minSim":0.66,"wEd":0.08}'));
console.log('false corrections at', process.env.SHOW || 'default', best.fps.join(', '));
