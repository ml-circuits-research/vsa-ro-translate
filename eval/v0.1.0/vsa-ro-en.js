// VSA (hyperdimensional) Romanian -> English command translator.
// Runs in the browser or Node. No model download: lexicon + code only.
//
// What is VSA here (and what is not):
//  * Lexical item memory: every known Romanian word form is a binary hypervector
//    built from character trigrams (trigram = rho^2(c1) XOR rho(c2) XOR c3, bundled
//    by majority). Unknown spellings (no diacritics, typos, unseen inflections) are
//    resolved by nearest-neighbour cleanup in Hamming space.
//  * Word-sense choice: each ambiguous lemma has sense prototypes = bundles of
//    context-lemma hypervectors; the sentence context is compared against them.
//  * Phrases and Romanian->English word order are handled by a small symbolic rule
//    layer (noun-adjective swap, genitives, clitics, prepositions, questions).
(function (root) {
'use strict';

// ---------------------------------------------------------------- utilities
function strip(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function fnv(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
function popcnt(x) {
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return (((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24;
}

// ---------------------------------------------------------------- hypervectors
function makeHD(D) {
  const W = D >>> 5;
  function rand(seedStr) {
    let s = fnv(seedStr) || 1;
    const v = new Uint32Array(W);
    for (let i = 0; i < W; i++) { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; v[i] = s; }
    return v;
  }
  function rot(v, k) { // permutation rho^k: rotate by k words
    const o = new Uint32Array(W);
    for (let i = 0; i < W; i++) o[(i + k) % W] = v[i];
    return o;
  }
  function ham(a, b) {
    let d = 0;
    for (let i = 0; i < W; i++) d += popcnt(a[i] ^ b[i]);
    return d;
  }
  function sim(a, b) { return 1 - ham(a, b) / D; }
  const tie = rand('__tie__');
  // Bit-sliced majority: per-bit counters kept as bit planes, updated with ripple-carry adders
  // on whole 32-bit words (≈30x faster than counting bit by bit). Used when all weights are 1.
  function bundleSliced(vecs) {
    const P = 7, planes = [];
    for (let p = 0; p < P; p++) planes.push(new Uint32Array(W));
    for (const v of vecs) {
      for (let i = 0; i < W; i++) {
        let carry = v[i];
        for (let p = 0; p < P && carry; p++) { const pl = planes[p]; const nc = pl[i] & carry; pl[i] ^= carry; carry = nc; }
      }
    }
    const total = vecs.length, T = total >> 1, out = new Uint32Array(W);
    for (let i = 0; i < W; i++) {
      let gt = 0, eq = 0xFFFFFFFF;
      for (let b = P - 1; b >= 0; b--) {
        const pb = planes[b][i];
        if ((T >> b) & 1) eq &= pb; else { gt |= eq & pb; eq &= ~pb; }
      }
      out[i] = (total & 1 ? gt : (gt | (eq & tie[i]))) >>> 0;
    }
    return out;
  }
  function bundle(vecs, weights) {
    if ((!weights || weights.every(x => x === 1)) && vecs.length < 127) return bundleSliced(vecs);
    const cnt = new Int32Array(D);
    let total = 0;
    for (let k = 0; k < vecs.length; k++) {
      const v = vecs[k], w = weights ? weights[k] : 1;
      total += w;
      for (let i = 0; i < W; i++) {
        let x = v[i]; const base = i << 5;
        for (let b = 0; b < 32; b++) { if (x & 1) cnt[base + b] += w; x >>>= 1; }
      }
    }
    const out = new Uint32Array(W);
    for (let i = 0; i < W; i++) {
      let word = 0; const base = i << 5;
      for (let b = 0; b < 32; b++) {
        const c = cnt[base + b] * 2;
        const bit = c > total ? 1 : c < total ? 0 : (tie[i] >>> b) & 1;
        word |= bit << b;
      }
      out[i] = word >>> 0;
    }
    return out;
  }
  return { D, W, rand, rot, ham, sim, bundle };
}

// ---------------------------------------------------------------- English morphology
const IRR_PL = { child: 'children', person: 'people', axis: 'axes', series: 'series', datum: 'data', half: 'halves', mouse: 'mice', index: 'indices', vertex: 'vertices' };
function enPlural(w) {
  const parts = w.split(' '); const last = parts.pop();
  let p;
  if (IRR_PL[last]) p = IRR_PL[last];
  else if (/(s|x|z|ch|sh)$/.test(last)) p = last + 'es';
  else if (/[^aeiou]y$/.test(last)) p = last.slice(0, -1) + 'ies';
  else p = last + 's';
  return parts.concat(p).join(' ');
}
const IRR_PART = { make: 'made', put: 'put', cut: 'cut', set: 'set', draw: 'drawn', write: 'written', show: 'shown', hide: 'hidden', choose: 'chosen', bring: 'brought', take: 'taken', send: 'sent', find: 'found', run: 'run', begin: 'begun', become: 'become', see: 'seen', give: 'given', tell: 'told', keep: 'kept', leave: 'left', build: 'built', go: 'gone', have: 'had', be: 'been', can: 'been able to', split: 'split', fit: 'fit', undo: 'undone', redo: 'redone', 'find out': 'found out', stay: 'stayed', lose: 'lost', read: 'read', 'speed up': 'sped up', 'slow down': 'slowed down', 'make sure': 'made sure', spin: 'spun' };
const DOUBLE = new Set(['stop', 'cut', 'set', 'drag', 'run', 'pin', 'put', 'begin', 'drop', 'crop', 'skip', 'trim', 'snap', 'tag', 'zip', 'flip', 'plan', 'wrap', 'grab', 'swap', 'ship', 'spin', 'shop', 'chop']);
function enInflect(base, form) {
  if (IRR_PART[base] && form === 'part') return IRR_PART[base];
  const parts = base.split(' '); let v = parts[0]; const rest = parts.slice(1);
  if (form === 'part') {
    if (IRR_PART[v]) v = IRR_PART[v];
    else if (DOUBLE.has(v)) v = v + v.slice(-1) + 'ed';
    else if (/e$/.test(v)) v = v + 'd';
    else if (/[^aeiou]y$/.test(v)) v = v.slice(0, -1) + 'ied';
    else v = v + 'ed';
  } else if (form === 'ing') {
    if (DOUBLE.has(v)) v = v + v.slice(-1) + 'ing';
    else if (/[^e]e$/.test(v) && v !== 'be') v = v.slice(0, -1) + 'ing';
    else v = v + 'ing';
  } else if (form === '3sg') {
    const irr = { be: 'is', have: 'has', can: 'can', must: 'must', do: 'does', go: 'goes' };
    if (irr[v]) v = irr[v];
    else if (/(s|x|z|ch|sh|o)$/.test(v)) v = v + 'es';
    else if (/[^aeiou]y$/.test(v)) v = v.slice(0, -1) + 'ies';
    else v = v + 's';
  }
  return [v].concat(rest).join(' ');
}

// ---------------------------------------------------------------- Romanian form generation
function guessNounFeats(f, lemma) {
  if (/lor$/.test(f)) return { num: 'pl', def: true, gen: true };
  if (/(ul|ua|a)$/.test(f) && f !== lemma) return { num: 'sg', def: true };
  if (/(ului|ei|ii)$/.test(f)) return { num: 'sg', def: true, gen: true };
  if (/le$/.test(f)) return { num: 'pl', def: true };
  return { num: 'sg', def: false };
}
function nounForms(lemma, pl, g) {
  const F = [];
  F.push([lemma, { num: 'sg', def: false }]);
  if (pl && pl !== lemma) F.push([pl, { num: 'pl', def: false }]);
  else if (pl === lemma) F[0][1] = { num: 'sg', def: false, alsoPl: true };
  let def = null;
  if (g === 'f') {
    if (/ă$/.test(lemma)) def = lemma.slice(0, -1) + 'a';
    else if (/ie$/.test(lemma)) def = lemma.slice(0, -1) + 'a';
    else if (/e$/.test(lemma)) def = lemma + 'a';
    else if (/a$/.test(lemma)) def = lemma; // stânga, dreapta
  } else {
    if (/[ăa]$/.test(lemma)) def = null;
    else if (/u$/.test(lemma)) def = lemma + 'l';
    else if (/e$/.test(lemma)) def = lemma + 'le';
    else if (/o$/.test(lemma)) def = lemma + 'ul';
    else def = lemma + 'ul';
  }
  if (def) F.push([def, { num: 'sg', def: true }]);
  // genitive singular
  let gen = null;
  if (g === 'f') {
    if (/ie$/.test(lemma)) gen = lemma + 'i';
    else if (pl && /[ie]$/.test(pl)) gen = pl + 'i';
  } else if (def) {
    gen = /e$/.test(lemma) ? lemma + 'lui' : def + 'ui';
  }
  if (gen) F.push([gen, { num: 'sg', def: true, gen: true }]);
  if (pl) {
    const defPl = (g === 'm' && /i$/.test(pl)) ? pl + 'i' : pl + 'le';
    F.push([defPl, { num: 'pl', def: true }]);
    F.push([pl + 'lor', { num: 'pl', def: true, gen: true }]);
  }
  return F;
}
function guessVerbFeats(f) {
  if (/(ați|eți|iți|âți)$/.test(f)) return ['2pl', 'imp'];
  if (/(ând|ind)$/.test(f)) return ['ger'];
  if (f.length > 3 && /(at|it|ut|ât|s|ns)$/.test(f)) return ['part', 'fin'];
  return ['fin', 'imp'];
}
function verbForms(inf, cls, extras) {
  const F = [[inf, ['inf']]];
  const st = inf.slice(0, -1);
  if (cls === 'ez') {
    F.push([st + 'ez', ['fin', '1sg']], [st + 'ezi', ['fin']], [st + 'ează', ['fin', 'imp', '3sg']], [st + 'ăm', ['fin']],
      [st + 'ați', ['2pl', 'imp']], [st + 'eze', ['subj']], [st + 'at', ['part']], [st + 'ând', ['ger']]);
  } else if (cls === 'esc') {
    F.push([st + 'esc', ['fin', '1sg']], [st + 'ești', ['fin']], [st + 'ește', ['fin', 'imp', '3sg']], [st + 'im', ['fin']],
      [st + 'iți', ['2pl', 'imp']], [st + 'ească', ['subj']], [st + 'it', ['part']], [st + 'ind', ['ger']]);
  } else if (cls === 'a') {
    F.push([st, ['fin', '1sg']], [st + 'ă', ['fin', 'imp', '3sg']], [st + 'ăm', ['fin']], [st + 'ați', ['2pl', 'imp']],
      [st + 'e', ['subj']], [st + 'at', ['part']], [st + 'ând', ['ger']]);
  } else if (cls === 'e') {
    F.push([st, ['fin', '1sg']], [st + 'i', ['fin']], [inf, ['fin', 'imp', '3sg']], [st + 'em', ['fin']], [st + 'eți', ['2pl', 'imp']],
      [st + 'ă', ['subj']], [st + 'ând', ['ger']]);
  } else if (cls === 'i') {
    F.push([st, ['fin', '1sg']], [st + 'im', ['fin']], [st + 'iți', ['2pl', 'imp']], [st + 'it', ['part']], [st + 'ind', ['ger']]);
  }
  for (const x of extras) F.push([x, guessVerbFeats(x)]);
  // participles used as adjectives agree in gender/number: rezolvat -> rezolvată, rezolvați, rezolvate
  for (const [f, feats] of F.slice()) {
    if (!feats.includes('part')) continue;
    let m;
    if ((m = /^(.*)(at|it|ut|ât)$/.exec(f))) { const b = m[1], v = m[2][0]; F.push([b + v + 'tă', ['part', 'adj']], [b + v + 'ți', ['part', 'adj']], [b + v + 'te', ['part', 'adj']]); }
    else if (/s$/.test(f)) F.push([f + 'ă', ['part', 'adj']], [f.slice(0, -1) + 'și', ['part', 'adj']], [f + 'e', ['part', 'adj']]);
  }
  return F;
}
function adjForms(m, f, mpl, fpl) {
  const F = [[m, { g: 'm', num: 'sg' }], [f, { g: 'f', num: 'sg' }], [mpl, { num: 'pl' }], [fpl, { num: 'pl' }]];
  // definite forms (used after nouns rarely, and as substantives)
  if (!/[aăeiouâî]$/.test(m)) F.push([m + 'ul', { g: 'm', num: 'sg', def: true }]);
  if (/ă$/.test(f)) F.push([f.slice(0, -1) + 'a', { g: 'f', num: 'sg', def: true }]);
  return F;
}

// ---------------------------------------------------------------- lexicon loading
function parseLines(txt) { return txt.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')); }

function createTranslator(LEX, opts) {
  opts = Object.assign({ D: 2048, threshold: 0.70, ngrams: [2, 3], firstLetter: true }, opts || {});
  const HD = makeHD(opts.D);
  const t0 = (typeof performance !== 'undefined' ? performance : Date).now();

  const surf = new Map();   // stripped surface -> [analysis]
  const lemmaInfo = new Map();
  function addForm(surface, an) {
    const key = strip(surface);
    an.orig = surface.toLowerCase();
    if (!surf.has(key)) surf.set(key, []);
    const arr = surf.get(key);
    // merge identical lemma+pos analyses
    const ex = arr.find(a => a.pos === an.pos && a.lemma === an.lemma && a.tag === an.tag);
    if (ex) {
      if (an.pos === 'V') ex.feats = Array.from(new Set(ex.feats.concat(an.feats)));
      else if (an.pos === 'N' || an.pos === 'A') {
        if (!!ex.feats.def !== !!an.feats.def) ex.feats.def = 'amb';
        if (ex.feats.num !== an.feats.num) ex.feats.alsoPl = true;
      }
      return;
    }
    arr.push(an);
  }

  for (const l of parseLines(LEX.VERBS)) {
    const [inf, cls, en, extra] = l.split('|');
    const lemma = strip(inf);
    const ex = extra ? extra.split(',').map(s => s.trim()).filter(Boolean) : [];
    lemmaInfo.set(lemma + ':V', { en });
    for (const [s, feats] of verbForms(inf, cls, ex)) addForm(s, { pos: 'V', lemma, en, feats: feats.slice() });
  }
  for (const l of parseLines(LEX.NOUNS)) {
    const p = l.split('|');
    const [lem, pl, g, enRaw] = p;
    const lemma = strip(lem);
    let en = enRaw, enPl = null;
    const m = /^(.*);pl=(.*)$/.exec(enRaw);
    if (m) { en = m[1]; enPl = m[2]; }
    if (lemmaInfo.has(lemma + ':N')) continue;
    lemmaInfo.set(lemma + ':N', { en });
    const forms = nounForms(lem, pl, g);
    if (p[4]) for (const x of p[4].split(',')) forms.push([x.trim(), guessNounFeats(strip(x.trim()), lemma)]);
    for (const [s, feats] of forms) addForm(s, { pos: 'N', lemma, en, enPl, feats: Object.assign({}, feats) });
  }
  for (const l of parseLines(LEX.ADJ)) {
    const [m, f, mpl, fpl, en] = l.split('|');
    const lemma = strip(m);
    for (const [s, feats] of adjForms(m, f, mpl, fpl)) addForm(s, { pos: 'A', lemma, en, feats });
  }
  const funcSet = new Set();
  for (const l of parseLines(LEX.FUNC)) {
    const [s, en, tag] = l.split('|');
    if (s.includes(' ')) continue;
    funcSet.add(strip(s));
    addForm(s, { pos: 'F', tag, lemma: strip(s), en, feats: {} });
  }
  // MWEs: list of word arrays (stripped)
  const MWES = parseLines(LEX.MWE).map(l => {
    const [ro, rest] = l.split('=>');
    const [en, tag] = rest.split('|').map(s => s.trim());
    return { words: ro.trim().split(/\s+/).map(strip), en, tag };
  }).sort((a, b) => b.words.length - a.words.length);
  const mweByFirst = new Map();
  for (const m of MWES) { const k = m.words[0]; if (!mweByFirst.has(k)) mweByFirst.set(k, []); mweByFirst.get(k).push(m); }

  // ---------- VSA item memory over content-word surface forms
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789#-';
  const C = {}, C1 = {}, C2 = {};
  for (const ch of alphabet) { C[ch] = HD.rand('char:' + ch); C1[ch] = HD.rot(C[ch], 1); C2[ch] = HD.rot(C[ch], 2); }
  const CR = {};
  function charv(ch, t) {
    const k = ch + t;
    if (!CR[k]) { if (!C[ch]) C[ch] = HD.rand('char:' + ch); CR[k] = t === 0 ? C[ch] : HD.rot(C[ch], t); }
    return CR[k];
  }
  const NG = opts.ngrams || [2, 3], STEMW = opts.stemWeight || 1;
  function encodeWord(key) {
    const s = '#' + key + '#';
    const vecs = [], w = [];
    for (const n of NG) {
      if (n === 's') { // skip-bigram (c_i, c_i+2): tolerant to transpositions/substitutions
        for (let i = 0; i + 3 <= s.length; i++) {
          const a = charv(s[i], 3), b = charv(s[i + 2], 0), v = new Uint32Array(HD.W);
          for (let k = 0; k < HD.W; k++) v[k] = a[k] ^ b[k];
          vecs.push(v); w.push(1);
        }
        continue;
      }
      for (let i = 0; i + n <= s.length; i++) {
        // n-gram = rho^(n-1)(c1) XOR ... XOR rho^0(cn)   (permutation encodes position inside the n-gram)
        const v = new Uint32Array(HD.W);
        for (let t = 0; t < n; t++) { const cv = charv(s[i + t], n - 1 - t); for (let k = 0; k < HD.W; k++) v[k] ^= cv[k]; }
        vecs.push(v); w.push(i < 2 ? STEMW : 1);
      }
    }
    return HD.bundle(vecs, w);
  }
  const itemKeys = [], itemVecs = [], byFirst = new Map();
  let memoryMs = null;
  function ensureMemory() {
    if (memoryMs !== null) return;
    const tm = (typeof performance !== 'undefined' ? performance : Date).now();
    for (const [key, ans] of surf) {
      if (key.length < 4) continue;
      if (!ans.some(a => a.pos !== 'F')) continue;
      itemKeys.push(key); itemVecs.push(encodeWord(key));
      const f = key[0]; if (!byFirst.has(f)) byFirst.set(f, []); byFirst.get(f).push(itemKeys.length - 1);
    }
    memoryMs = Math.round((typeof performance !== 'undefined' ? performance : Date).now() - tm);
  }
  // ---------- VSA sense prototypes
  const lemmaVecCache = new Map();
  function lemmaVec(k) { if (!lemmaVecCache.has(k)) lemmaVecCache.set(k, HD.rand('lemma:' + k)); return lemmaVecCache.get(k); }
  const SENSES = {};
  for (const lem in LEX.SENSES) {
    SENSES[lem] = LEX.SENSES[lem].map(([en, ctx]) => ({ en, ctx: ctx.split(/\s+/).filter(Boolean).map(lemmaVec) }));
  }
  const buildMs = (typeof performance !== 'undefined' ? performance : Date).now() - t0;

  function cleanup(key) {
    ensureMemory();
    const q = encodeWord(key);
    let best = -1, bi = -1, second = -1;
    const pool = opts.firstLetter === false ? itemVecs.map((_, i) => i) : (byFirst.get(key[0]) || []);
    for (const i of pool) {
      const s = HD.sim(q, itemVecs[i]);
      if (s > best) { second = best; best = s; bi = i; } else if (s > second) second = s;
    }
    return { key: itemKeys[bi], sim: best, margin: best - second };
  }

  // ---------------------------------------------------------------- tokenizer
  const CLITIC_SUFFIX = new Set(['l', 'o', 'i', 'le', 'mi', 'ti', 'ne', 'va', 'ma', 'te', 'se', 'si', 'ii', 'li']);
  const LOAN_SUFFIX = { ul: { num: 'sg', def: true }, ului: { num: 'sg', def: true, gen: true }, uri: { num: 'pl' }, urile: { num: 'pl', def: true }, urilor: { num: 'pl', def: true, gen: true }, ul_: {}, lui: { num: 'sg', def: true, gen: true }, le: { num: 'pl', def: true }, a: { num: 'sg', def: true }, ei: { num: 'sg', def: true, gen: true }, i: { num: 'pl' }, ii: { num: 'pl', def: true }, ilor: { num: 'pl', def: true, gen: true }, rile: { num: 'pl', def: true } };
  function tokenize(text) {
    const toks = [];
    const re = /"[^"]*"|„[^”"]*[”"]|“[^”]*”|«[^»]*»|'[^']{2,}'|#[0-9a-fA-F]{3,8}\b|\d+(?:[.,]\d+)?(?:-(?:lea|a))?(?:\s?(?:%|px|ms|pt|fps|deg|°))?(?![\p{L}\d])|\d+(?:[.,]\d+)?[\p{L}]+|[\p{L}\d_]+(?:-[\p{L}\d_]+)*|[.,!?;:()]/gu;
    let m;
    while ((m = re.exec(text))) {
      const t = m[0];
      if (/^["„“«']/.test(t)) { toks.push({ kind: 'LIT', text: '"' + t.slice(1, -1) + '"', quoted: true }); continue; }
      if (/^#[0-9a-f]/i.test(t)) { toks.push({ kind: 'LIT', text: t, hex: true }); continue; }
      if (/^\d+-(lea|a)$/.test(t)) { const n = parseInt(t); toks.push({ kind: 'ORDN', text: t, en: 'the ' + n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th') }); continue; }
      if (/^\d/.test(t)) { toks.push({ kind: 'NUMLIT', text: t.replace(/(\d),(\d)/, '$1.$2') }); continue; }
      if (/^[.,!?;:()]$/.test(t)) { toks.push({ kind: 'PUNCT', text: t }); continue; }
      // hyphenated forms
      if (t.includes('-')) {
        const parts = t.split('-');
        const lp = strip(parts[0]);
        // într-un, dintr-o, printr-un
        if (/^(intr|dintr|printr)$/.test(lp) && parts.length === 2) {
          toks.push({ kind: 'W', text: lp === 'intr' ? 'în' : lp === 'dintr' ? 'din' : 'prin' });
          toks.push({ kind: 'W', text: parts[1] });
          continue;
        }
        // pre-verbal clitic + aux: l-am, i-am, s-a, s-o, n-am, mi-a
        if (['l', 'i', 's', 'n', 'mi', 'ti', 'v', 'ne', 'le', 'm'].includes(lp) && parts.length === 2) {
          const map = { l: '-l', i: '-i', s: 'se', n: 'nu', mi: '-mi', ti: '-ți', v: '-vă', ne: '-ne', le: '-le', m: '-mă' };
          if (lp === 's' && strip(parts[1]) === 'o') { toks.push({ kind: 'W', text: 'să' }); toks.push({ kind: 'W', text: '-o' }); continue; }
          toks.push({ kind: 'W', text: map[lp] }); toks.push({ kind: 'W', text: parts[1] }); continue;
        }
        if (lp === 'nu' && parts.length === 2) { toks.push({ kind: 'W', text: 'nu' }); toks.push({ kind: 'W', text: '-' + parts[1] }); continue; }
        if (lp === 'sa' && parts.length === 2) { toks.push({ kind: 'W', text: 'să' }); toks.push({ kind: 'W', text: '-' + parts[1] }); continue; }
        // known hyphenated word (prim-plan, e-mail, de-a)
        if (surf.has(strip(t))) { toks.push({ kind: 'W', text: t }); continue; }
        const last = strip(parts[parts.length - 1]);
        const head = parts.slice(0, -1).join('-');
        // verb + clitic(s): mută-l, adaugă-i, dă-mi-l
        if (CLITIC_SUFFIX.has(last) && parts.length >= 2) {
          let k = parts.length - 1;
          const cl = [];
          while (k > 0 && CLITIC_SUFFIX.has(strip(parts[k]))) { cl.unshift('-' + parts[k]); k--; }
          const base = parts.slice(0, k + 1).join('-');
          // loanword + article ambiguity (e.g. "PDF-ul" handled below); clitics only after lowercase words
          if (!/^[A-Z0-9]+$/.test(base)) {
            toks.push({ kind: 'W', text: base });
            for (const c of cl) toks.push({ kind: 'W', text: c });
            continue;
          }
        }
        // loanword/acronym + Romanian article: PDF-ul, layer-ul, mouse-ului, SVG-uri
        if (LOAN_SUFFIX[last] && parts.length >= 2) {
          toks.push({ kind: 'W', text: head, loanFeats: LOAN_SUFFIX[last] });
          continue;
        }
        toks.push({ kind: 'W', text: t });
        continue;
      }
      toks.push({ kind: 'W', text: t });
    }
    let first = true;
    for (const t of toks) {
      if (t.kind === 'PUNCT' && /[.!?]/.test(t.text)) { first = true; continue; }
      if (t.kind === 'W') { t.first = first; t.cap = /^\p{Lu}/u.test(t.text) && !/^\p{Lu}+$/u.test(t.text) ; t.acr = /^[\p{Lu}\d]{2,}$/u.test(t.text); first = false; }
      else if (t.kind !== 'PUNCT') first = false;
    }
    return toks;
  }

  // ---------------------------------------------------------------- lexical analysis
  const CLITIC_EN = { '-l': ['it', 'acc'], '-o': ['it', 'acc'], '-le': ['them', 'acc'], '-i': ['it', 'dat?'], '-ii': ['it', 'dat?'], '-li': ['them', 'acc'], '-mi': ['me', 'dat'], '-ti': ['you', 'dat'], '-ne': ['us', 'dat'], '-va': ['you', 'dat'], '-ma': ['me', 'acc'], '-te': ['you', 'acc'], '-se': ['', 'refl'], '-si': ['', 'refl'] };
  function analyze(tok, stats) {
    const key = strip(tok.text);
    if (key.startsWith('-')) {
      const c = CLITIC_EN[key];
      return [{ pos: 'F', tag: 'POSTCLITIC', lemma: key, en: c ? c[0] : 'it', feats: { kase: c ? c[1] : 'acc' } }];
    }
    if (tok.loanFeats) {
      const hit = surf.get(key);
      const n = hit && hit.find(a => a.pos === 'N');
      if (n) return [Object.assign({}, n, { feats: Object.assign({}, n.feats, tok.loanFeats) })];
      return [{ pos: 'N', lemma: key, en: tok.text, enPl: /^[A-Z0-9]+$/.test(tok.text) ? tok.text + 's' : null, feats: Object.assign({}, tok.loanFeats), loan: true }];
    }
    if (tok.acr && !surf.has(key)) { stats.unknown++; return [{ pos: 'LIT', lemma: key, en: tok.text, feats: {}, unknown: true, acr: true }]; }
    if (surf.has(key)) {
      stats.exact++;
      let ans = surf.get(key).map(a => Object.assign({}, a, { feats: Array.isArray(a.feats) ? a.feats.slice() : Object.assign({}, a.feats), how: 'exact' }));
      // diacritics-aware preference: if input carried diacritics, prefer analyses with the same spelling
      const low = tok.text.toLowerCase();
      if (low !== key) {
        const same = ans.filter(a => a.orig === low);
        if (same.length) ans = same.concat(ans.filter(a => a.orig !== low && a.pos !== 'F'));
      } else if (key === 'ca') {
        ans = ans.filter(a => a.tag !== 'CONJ').concat(ans.filter(a => a.tag === 'CONJ'));
      }
      return ans;
    }
    if (key.length >= 4 && !(tok.cap && !tok.first)) {
      const c = cleanup(key);
      const thr = key.length <= 5 ? opts.threshold + 0.04 : opts.threshold;
      if (c.sim >= thr) {
        stats.vsa++;
        stats.vsaLog.push(tok.text + '→' + c.key + ' (' + c.sim.toFixed(2) + ')');
        stats.vsaPairs.push([tok.text, c.key, c.sim]);
        return surf.get(c.key).filter(a => a.pos !== 'F').map(a => Object.assign({}, a, { feats: Array.isArray(a.feats) ? a.feats.slice() : Object.assign({}, a.feats), how: 'vsa', sim: c.sim }));
      }
    }
    stats.unknown++;
    return [{ pos: 'LIT', lemma: key, en: tok.text, feats: {}, unknown: true, label: tok.cap && !tok.first }];
  }

  const isNounish = a => a && (a.pos === 'N' || a.pos === 'LIT' && !a.quoted);
  function has(cands, pred) { return cands && cands.some(pred); }

  // choose one analysis per token using local context
  function choose(items) {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.cands.length === 1) { it.a = it.cands[0]; continue; }
      const prev = items[i - 1], next = items[i + 1];
      const prevA = prev && (prev.a || prev.cands[0]);
      const pc = prev ? prev.cands : null, nc = next ? next.cands : null;
      const clauseStart = !prev || prev.kind === 'PUNCT' || (prevA && prevA.pos === 'F' && (prevA.tag === 'CONJ' || prevA.tag === 'INTJ'));
      let best = null, bs = -1e9;
      it.cands.forEach((a, idx) => {
        let s = -idx * 0.1;
        const tg = a.pos === 'F' ? a.tag : a.pos;
        if (tg === 'V') {
          if (clauseStart) s += 3;
          if (prevA && prevA.pos === 'F' && (prevA.tag === 'PART' || prevA.tag === 'Q' || prevA.tag === 'NEG' || prevA.tag === 'AUX')) s += 3;
          if (prevA && (prevA.pos === 'N' || prevA.pos === 'F' && /^(DET|PREP|NUM|DEM|ORD|QUANT)$/.test(prevA.tag))) s -= 2;
          if (a.feats.includes && a.feats.includes('part') && prevA && prevA.pos === 'N') s += 2.5;
        }
        if (tg === 'N') {
          if (prevA && prevA.pos === 'F' && /^(DET|PREP|NUM|DEM|ORD|QUANT|GENART|DETGEN|DEMGEN)$/.test(prevA.tag)) s += 3;
          if (prevA && (prevA.pos === 'V' || prevA.pos === 'N')) s += 1;
          if (prevA && prevA.pos === 'F' && prevA.tag === 'PART') s -= 3;
          if (clauseStart) s -= 1;
        }
        if (tg === 'A') {
          if (prevA && (prevA.pos === 'N' || prevA.pos === 'LIT')) s += 2.5;
          if (has(nc, x => x.pos === 'N') && !(prevA && prevA.pos === 'N')) s -= 0.5;
        }
        if (tg === 'ADV') {
          if (prevA && (prevA.pos === 'V' || prevA.pos === 'F' && prevA.tag === 'POSTCLITIC')) s += 3;
          const nx2 = items[i + 2];
          if (next && strip(next.text) === 'si' && nx2 && nx2.cands.some(x => x.pos === 'F' && x.tag === 'ADV') && it.cands.some(x => x.pos === 'A')) s += 3;
          const pp = items[i - 2];
          if (prev && strip(prev.text) === 'si' && pp && pp.a && pp.a.pos === 'F' && pp.a.tag === 'ADV') s += 4;
          if (next && strip(next.text) === 'si' && nx2 && nx2.cands.some(x => x.pos === 'F' && x.tag === 'ADV') && it.cands.some(x => x.pos === 'A')) s += 1.5;
          if (prevA && prevA.pos === 'N') s -= 1;
        }
        if (tg === 'NUM' && has(nc, x => x.pos === 'N')) s += 2;
        if (tg === 'PRON' && has(nc, x => x.pos === 'V')) s += 1;
        if (tg === 'DET' && has(nc, x => x.pos === 'N' || x.pos === 'A' || x.pos === 'LIT')) s += 3;
        if (tg === 'CLITIC' && has(nc, x => x.pos === 'V')) s += 2;
        if (tg === 'POSS' && prevA && prevA.pos === 'N') s += 3;
        if (tg === 'POSS' && has(nc, x => x.pos === 'V')) s -= 3;
        if (tg === 'PART' && has(nc, x => x.pos === 'V' || x.pos === 'F' && x.tag === 'CLITIC' || x.pos === 'F' && x.tag === 'POSTCLITIC')) s += 4;
        if (tg === 'GENART') { if (prevA && (prevA.pos === 'N' || prevA.pos === 'A')) s += 2; }
        if (tg === 'AUX' && has(nc, x => x.pos === 'V')) s += 2;
        if (a.pos === 'V' && a.lemma === 'avea' && has(nc, x => x.pos === 'V' && x.feats.includes && x.feats.includes('part'))) s += 3;
        if (a.how === 'vsa' && a.sim) s += a.sim;
        if (s > bs) { bs = s; best = a; }
      });
      it.a = best;
    }
  }

  // ---------------------------------------------------------------- MWE merge
  function mweMatch(items, i) {
    const first = items[i];
    const keys = k => {
      const s = new Set([strip(k.text)]);
      for (const a of k.cands) s.add(a.lemma);
      return s;
    };
    const cand = new Set();
    for (const k of keys(first)) if (mweByFirst.has(k)) for (const m of mweByFirst.get(k)) cand.add(m);
    for (const m of Array.from(cand).sort((a, b) => b.words.length - a.words.length)) {
      let j = i, w = 0; const clitics = [];
      while (w < m.words.length && j < items.length) {
        const it = items[j];
        if (it.kind === 'W' && strip(it.text).startsWith('-') && w > 0 && m.tag === 'V') { clitics.push(it); j++; continue; }
        if (it.kind !== 'W' || !keys(it).has(m.words[w])) break;
        w++; j++;
      }
      if (w === m.words.length) {
        // features of last noun (number) for N-type MWEs
        let feats = {};
        const lastIt = items[j - 1];
        const lastN = lastIt.cands.find(a => a.pos === 'N');
        if (m.tag === 'N') {
          const headIt = items[i];
          const hn = headIt.cands.find(a => a.pos === 'N');
          feats = Object.assign({}, hn ? hn.feats : {}, lastN && lastN.feats && lastN.feats.def ? { def: true } : {});
        }
        return { end: j, m, clitics, feats };
      }
    }
    return null;
  }

  // ---------------------------------------------------------------- rendering
  const PRED_VERBS = new Set(['face', 'colora', 'seta', 'transforma', 'lasa', 'pastra', 'umple', 'vopsi']);
  const TO_VERBS = new Set(['exporta', 'salva', 'descarca', 'converti', 'schimba', 'seta', 'traduce', 'modifica', 'trece', 'publica', 'muta', 'trimite', 'adauga', 'insera']);
  const INTO_VERBS = new Set(['imparti', 'transforma', 'grupa', 'trage', 'combina', 'imbina']);
  const BY_VERBS = new Set(['mari', 'micsora', 'creste', 'scadea', 'reduce', 'muta', 'deplasa', 'roti', 'intarzia', 'accelera', 'incetini', 'misca', 'glisa', 'lungi', 'scurta']);
  const AT_NOUNS = new Set(['secunda', 'minut', 'inceput', 'sfarsit', 'final', 'milisecunda', 'cadru', 'pas', 'ora', 'momentul', 'moment']);
  const ON_NOUNS = new Set(['clic', 'click', 'hover', 'incarcare', 'deschidere', 'apasare', 'pagina', 'panza', 'ecran', 'canvas', 'slide', 'diapozitiv', 'planse', 'plansa']);
  const QUANTITY_NOUNS = new Set(['jumatate', 'sfert', 'treime', 'procent', 'numar', 'total', 'majoritate', 'lista', 'grup', 'set', 'serie', 'colectie', 'multime']);
  const ATTR_NOUNS = new Set(['latime', 'inaltime', 'dimensiune', 'marime', 'durata', 'viteza', 'opacitate', 'rezolutie', 'grosime', 'valoare', 'unghi', 'rotatie']);
  const UNIT_NOUNS = new Set(['pixel', 'grad', 'procent', 'punct', 'secunda', 'milisecunda', 'minut', 'nivel']);
  const LINK_VERBS = new Set(['lega', 'conecta', 'atasa', 'ancora', 'uni', 'fixa']);
  const FROM_VERBS = new Set(['importa', 'elimina', 'sterge', 'scoate', 'extrage', 'copia', 'descarca', 'incarca', 'muta', 'decupa', 'taia', 'exclude', 'genera']);
  const PERSON_VERB = { vreau: 'I want', vrem: 'we want', vrei: 'do you want', doresc: 'I want', dorim: 'we want', pot: 'can I', poti: 'can you', puteti: 'can you', poate: 'can', putem: 'can we', trebuie: 'need to' };

  function senseOf(a, ctxVecs) {
    const S = SENSES[a.lemma];
    if (!S || S.length < 2 || !ctxVecs.length) return null;
    // VSA: score = sum over context items of similarity to sense prototype items (superposition dot product)
    let best = 0, bs = -Infinity;
    S.forEach((s, idx) => {
      let score = 0;
      for (const c of ctxVecs) for (const p of s.ctx) score += (HD.D - 2 * HD.ham(c, p));
      score = score / HD.D;
      if (score > bs + 0.5) { bs = score; best = idx; }
    });
    return bs > 0.5 ? S[best].en : S[0].en;
  }

  function translate(text) {
    const stats = { exact: 0, vsa: 0, unknown: 0, vsaLog: [], vsaPairs: [] };
    const t1 = (typeof performance !== 'undefined' ? performance : Date).now();
    const toks = tokenize(text);
    let items = toks.map(t => {
      if (t.kind === 'W') return Object.assign(t, { cands: analyze(t, stats) });
      return Object.assign(t, { cands: [] });
    });
    for (let i = 1; i < items.length; i++) {
      const it = items[i], pv = items[i - 1];
      if (it.kind === 'W' && it.cap && !it.first && pv.kind === 'W' && pv.cands.some(a => a.pos === 'N') && it.cands.some(a => a.pos !== 'F')) {
        it.cands = [{ pos: 'LIT', lemma: strip(it.text), en: it.text, feats: {}, label: true }];
      }
    }
    // MWE merge
    const merged = [];
    for (let i = 0; i < items.length;) {
      const it = items[i];
      if (it.kind === 'W') {
        const mm = mweMatch(items, i);
        if (mm) {
          const tag = mm.m.tag;
          const pos = tag === 'N' ? 'N' : tag === 'V' ? 'V' : tag === 'ADJ' ? 'A' : 'F';
          const a = { pos, tag: pos === 'F' ? tag : undefined, lemma: mm.m.words.join('_'), en: mm.m.en, feats: pos === 'V' ? ['imp', 'fin', '3sg'] : (mm.feats || {}), mwe: true };
          if (pos === 'N') a.enPl = enPlural(mm.m.en);
          merged.push({ kind: 'W', text: items.slice(i, mm.end).map(x => x.text).join(' '), cands: [a], a });
          for (const c of mm.clitics) merged.push(c);
          i = mm.end; continue;
        }
      }
      merged.push(it); i++;
    }
    items = merged;
    choose(items);
    // context vectors for VSA sense disambiguation
    const ctxLemmas = items.filter(x => x.a && x.a.pos !== 'F' && x.a.pos !== 'LIT').map(x => x.a.lemma);
    for (const it of items) {
      if (!it.a || !SENSES[it.a.lemma]) continue;
      const ctx = ctxLemmas.filter(l => l !== it.a.lemma).map(lemmaVec);
      const en = senseOf(it.a, ctx);
      if (en) it.a = Object.assign({}, it.a, { en });
    }
    const out = renderAll(items);
    const ms = (typeof performance !== 'undefined' ? performance : Date).now() - t1;
    return { text: out, stats, ms };
  }

  function renderAll(items) {
    // split into clauses at CONJ / PUNCT
    const words = [];
    let clause = [];
    const flush = () => { if (clause.length) words.push(...renderClause(clause)); clause = []; };
    for (const it of items) {
      if (it.kind === 'PUNCT') { flush(); words.push({ p: it.text }); continue; }
      const a = it.a;
      if (a && a.pos === 'F' && (a.tag === 'CONJ' || a.tag === 'INTJ' || a.tag === 'Q' && a.lemma === 'cand' && clause.length)) { flush(); words.push(a.en); continue; }
      clause.push(it);
    }
    flush();
    return finish(words);
  }

  function finish(words) {
    let s = '';
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (w === null || w === undefined || w === '' || w === '·') continue;
      if (typeof w === 'object') {
        if (w.p === '(') s += (s ? ' ' : '') + '(';
        else s = s.replace(/\s+$/, '') + w.p;
        continue;
      }
      s += (s && !s.endsWith('(') ? ' ' : '') + w;
    }
    // a/an
    s = s.replace(/\b([Aa]) (\S+)/g, (m, a, w) => {
      const lw = w.toLowerCase().replace(/^["„]/, '');
      let vowel = /^[aeio]/.test(lw) || /^u(?!s|n[iy]|ni|ser|r)/.test(lw) || /^h(our|onest)/.test(lw);
      if (/^(one|uni|use|user|euro|once)/.test(lw)) vowel = false;
      if (/^[A-Z]{2,}/.test(w.replace(/^["„]/, ''))) vowel = /^[AEFHILMNORSX]/.test(w.replace(/^["„]/, ''));
      if (/^\d/.test(lw)) vowel = /^(8|11|18|80)/.test(lw);
      return (vowel ? (a === 'A' ? 'An' : 'an') : a) + ' ' + w;
    });
    s = s.replace(/\bthe the\b/g, 'the').replace(/\s+/g, ' ').trim();
    s = s.replace(/\bto to\b/g, 'to').replace(/\bof of\b/g, 'of');
    if (s) s = s[0].toUpperCase() + s.slice(1);
    return s;
  }

  function nounEn(a, plural) {
    if (plural) return a.enPl || (a.loan ? a.en : enPlural(a.en));
    return a.en;
  }

  function renderClause(items) {
    const out = [];
    let i = 0;
    let lastVerb = null;     // lemma of the last verb rendered in this clause
    let subjectSeen = false; // a noun/pronoun before the verb
    let pendingDative = null;   // words to emit after the next object NP ("to the box")
    let dativeFromClitic = false;
    let datNext = false;
    let pendingPreClitics = [];
    let negPending = false;
    let modalPrev = false;   // previous verb was a modal (can/must) -> drop "to"
    let wantPrev = false;
    let qPrev = null;        // previous token was a question word
    let auxHave = null;
    let futPending = false;
    let prevWasAdvMwe = false;
    const A = k => items[k] && items[k].a;
    const K = k => items[k] && items[k].kind;
    const isLabelLit = x => x && (x.quoted || x.label || x.acr);

    function emptyNP() { return { dets: [], nums: [], adjs: [], head: null, post: [], gens: [], preLits: [], lits: [], poss: null, dem: null, compounds: [] }; }

    function parseNP(j, inPP) {
      const np = emptyNP(); np.start = j;
      // pre-head
      while (j < items.length) {
        const it = items[j], a = it.a;
        if (it.kind === 'NUMLIT') { np.nums.push(it.text); j++; if (A(j) && A(j).pos === 'F' && A(j).lemma === 'de') j++; continue; }
        if (it.kind === 'ORDN') { np.dets.push(it.en); j++; continue; }
        if (!a) break;
        if (a.pos === 'F' && /^(DET|DEM|QUANT|ORD|NUM|DETGEN|DEMGEN|CEL)$/.test(a.tag)) {
          if (a.tag === 'NUM') np.nums.push(a.en); else np.dets.push(a.en);
          if (a.tag === 'CEL') np.cel = true;
          if (a.tag === 'QUANT' && /^(ceilalti|celelalte)$/.test(a.lemma)) np.othersPl = true;
          j++;
          if (a.tag === 'NUM' && A(j) && A(j).pos === 'F' && A(j).lemma === 'de') j++;
          continue;
        }
        if (a.pos === 'F' && a.tag === 'GENART' && (K(j + 1) === 'ORDN' || A(j + 1) && A(j + 1).pos === 'F' && A(j + 1).tag === 'ORD')) { j++; continue; }
        if (a.pos === 'F' && a.tag === 'QUANT' && a.mwe) { np.dets.push(a.en); j++; continue; }
        break;
      }
      // head
      const h = items[j];
      if (h && h.a && (h.a.pos === 'N' || (h.a.pos === 'LIT' && !isLabelLit(h.a) && !h.quoted))) { np.head = h.a; j++; }
      else if (h && (h.kind === 'LIT' || h.a && isLabelLit(h.a))) {
        // label/acronym directly followed by a noun? ("PDF-ul" is a head; "Start nodul" is rare) -> treat as head
        np.head = { pos: 'LIT', en: h.text, feats: h.a ? h.a.feats : {}, label: true }; j++;
      }
      else if (h && h.a && h.a.pos === 'A' && (np.dets.length || np.nums.length || inPP)) { np.adjs.push(h.a.en); j++; }
      else if (h && h.a && h.a.pos === 'V' && h.a.feats.includes && h.a.feats.includes('part') && np.cel) { np.adjs.push(enInflect(h.a.en, 'part')); j++; }
      // post-head
      while (j < items.length && (np.head || np.lits.length || np.cel)) {
        const it = items[j], a = it.a;
        if (it.kind === 'LIT' || a && isLabelLit(a)) {
          const txt = it.text;
          if (it.hex) np.lits.push(txt); else np.preLits.push(txt);
          j++; continue;
        }
        if (it.kind === 'NUMLIT' && np.head && !(A(j + 1) && A(j + 1).pos === 'N')) { np.lits.push(it.text); np.numLabel = true; j++; continue; }
        if (!a) break;
        if (a.pos === 'A') { (np.head ? np.post : np.adjs).push(a); j++; continue; }
        if (a.pos === 'V' && a.feats.includes && a.feats.includes('part') && (a.feats.includes('adj') || !a.feats.includes('imp'))) { (np.head ? np.post : np.adjs).push(np.head ? { en: enInflect(a.en, 'part'), part: true } : enInflect(a.en, 'part')); j++; continue; }
        if (!np.head) break;
        if (a.pos === 'F' && a.tag === 'POSS') { np.poss = a.en; j++; continue; }
        if (a.pos === 'F' && a.tag === 'DEM') { np.dem = a.en; j++; continue; }
        if (a.pos === 'F' && a.lemma === 'de' && np.head.pos === 'N' && items[j + 1] && (items[j + 1].kind === 'NUMLIT' || A(j + 1) && A(j + 1).pos === 'F' && A(j + 1).tag === 'NUM')) {
          const m = [items[j + 1].kind === 'NUMLIT' ? items[j + 1].text : A(j + 1).en]; j += 2;
          if (A(j) && A(j).pos === 'F' && A(j).lemma === 'de') j++;
          if (items[j] && (A(j) && (A(j).pos === 'N' && UNIT_NOUNS.has(A(j).lemma) || A(j).pos === 'LIT' && !isLabelLit(A(j)) && /^(px|ms|s|pt|em|rem|fps|deg)$/i.test(items[j].text)))) {
            const u = A(j); m.push(u.pos === 'N' ? nounEn(u, !/^(1|one)$/.test(m[0])) : items[j].text); j++;
          }
          if (ATTR_NOUNS.has(np.head.lemma)) np.lits.push('of', ...m); else np.measure = m;
          continue;
        }
        if (a.pos === 'F' && a.lemma === 'de' && np.head.pos === 'N' && A(j + 1) && (A(j + 1).pos === 'N' && A(j + 1).feats.def !== true && !A(j + 1).feats.gen || A(j + 1).pos === 'LIT' && !isLabelLit(A(j + 1)))) {
          const comp = A(j + 1);
          if (comp.pos === 'N' && comp.feats.num === 'pl' && !comp.mwe) { const g = emptyNP(); g.head = comp; g.bare = true; np.gens.push({ of: 'of', np: g }); }
          else if (/^(jumatate|sfert|treime)$/.test(np.head.lemma)) { const g = emptyNP(); g.head = comp; g.dets = ['a']; np.gens.push({ of: 'of', np: g }); }
          else np.compounds.push(comp.pos === 'LIT' ? comp.en : nounEn(comp, false));
          j += 2;
          while (A(j) && A(j).pos === 'A' && !np.compounds.length) { np.post.push(A(j)); j++; }
          continue;
        }
        if (a.pos === 'N' && a.feats.gen === true) { const g = parseNP(j, false); np.gens.push({ of: 'of', np: g }); j = g.end; continue; }
        if (a.pos === 'N' && a.mwe && a.feats && a.feats.gen) { const g = parseNP(j, false); np.gens.push({ of: 'of', np: g }); j = g.end; continue; }
        if (a.pos === 'F' && a.tag === 'GENART' && A(j + 1) && (A(j + 1).pos === 'N' || A(j + 1).pos === 'F' && /^(DEMGEN|DETGEN|ORD)$/.test(A(j + 1).tag) || A(j + 1).pos === 'LIT')) {
          const g = parseNP(j + 1, false); np.gens.push({ of: 'of', np: g }); j = g.end; continue;
        }
        if (a.pos === 'F' && (a.tag === 'DEMGEN' || a.tag === 'DETGEN')) { const g = parseNP(j, false); np.gens.push({ of: '', np: g }); j = g.end; continue; }
        if (a.pos === 'F' && a.tag === 'GENPRON') {
          if (items[j + 1] && (items[j + 1].kind === 'LIT' || A(j + 1) && A(j + 1).pos === 'LIT')) { const g = emptyNP(); g.preLits = [items[j + 1].text]; np.gens.push({ of: 'of', np: g }); j += 2; continue; }
          np.poss = 'its'; j++; continue;
        }
        break;
      }
      np.end = j;
      return np;
    }

    function renderNP(np, ctx) {
      const w = [];
      const head = np.head;
      const pl = head && (head.feats.num === 'pl' || (np.nums.length && !/^(1|one|unu)$/.test(np.nums[np.nums.length - 1])));
      const predicative = ctx && ctx.predicative && np.post.length && head && head.feats.def;
      const hasDef = head && head.feats.def;
      if (np.dem) w.push(np.dem === 'this' && pl ? 'these' : np.dem === 'that' && pl ? 'those' : np.dem);
      else if (np.poss) w.push(np.poss);
      else if (np.dets.length) {
        for (const d of np.dets) w.push(d === 'all' && hasDef ? (pl ? 'all the' : 'the whole') : d);
      } else if (head && head.pos === 'N' && (hasDef || head.feats.gen) && !np.nums.length && !np.numLabel) w.push('the');
      else if (head && head.pos === 'N' && np.nums.length && head.feats.def === true) w.push('the');
      else if (head && ctx && ctx.addThe && !np.nums.length && !np.numLabel && head.pos === 'N' && head.feats.num !== 'pl' && !QUANTITY_NOUNS.has(head.lemma)) w.push('the');
      w.push(...np.nums);
      if (np.measure) w.push(...np.measure);
      w.push(...np.adjs);
      if (!predicative) for (const p of np.post) w.push(p.en);
      w.push(...np.preLits);
      w.push(...np.compounds);
      if (head) w.push(head.pos === 'LIT' ? head.en : nounEn(head, pl));
      else if (np.cel && (np.adjs.length || np.post.length)) w.push('one');
      if (!head && np.othersPl && w.length && w[w.length - 1] === 'the other') w[w.length - 1] = 'the others';
      w.push(...np.lits);
      if (predicative) for (const p of np.post) w.push(p.en);
      for (const g of np.gens) { if (g.of) w.push(g.of); w.push(...renderNP(g.np, { addThe: !g.np.bare })); }
      return w;
    }

    function prepEn(a, k) {
      const nx = items[k + 1], na = nx && nx.a;
      const prevA = A(k - 1);
      const nxNum = nx && (nx.kind === 'NUMLIT' || na && na.pos === 'F' && na.tag === 'NUM');
      const nxLemma = na ? na.lemma : '';
      switch (a.lemma) {
        case 'de':
          if (prevA && prevA.pos === 'F' && prevA.tag === 'NUM' || K(k - 1) === 'NUMLIT') return null;
          if (prevA && prevA.pos === 'A' && /er$/.test(prevA.en)) return 'than';
          if (lastVerb && LINK_VERBS.has(lastVerb)) return 'to';
          if (na && na.pos === 'F' && na.tag === 'ADV') return 'from';
          return 'of';
        case 'la':
          if (nxNum) return 'to';
          if (na && AT_NOUNS.has(nxLemma)) return 'at';
          if (na && /^(clic|click|hover|incarcare|deschidere|apasare)$/.test(nxLemma)) return 'on';
          return 'to';
        case 'in':
          if (lastVerb && INTO_VERBS.has(lastVerb)) return 'into';
          if (lastVerb && /^(exporta|salva|descarca|converti|schimba|traduce|seta|modifica)$/.test(lastVerb)) return 'to';
          return 'in';
        case 'pe':
          if (na && (na.pos === 'F' && /^(PRON|CEL|DEM)$/.test(na.tag) || isLabelLit(na) && nx.cap)) return null;
          return 'on';
        case 'cu': {
          if (nx && nx.kind === 'NUMLIT' && /(px|%|ms|pt|deg|°)$/.test(nx.text)) return 'by';
          if (nxNum) {
            const unit = A(k + 2) && A(k + 2).pos === 'N' ? A(k + 2) : (A(k + 3) && A(k + 3).pos === 'N' ? A(k + 3) : null);
            if (unit && UNIT_NOUNS.has(unit.lemma)) return 'by';
            if (!unit && lastVerb && BY_VERBS.has(lastVerb)) return 'by';
          }
          if (lastVerb && LINK_VERBS.has(lastVerb)) return 'to';
          return 'with';
        }
        case 'din':
          if (prevA && prevA.pos === 'N' && QUANTITY_NOUNS.has(prevA.lemma)) return 'of';
          if (prevA && prevA.pos === 'F' && /^(QUANT|NUM|ORD)$/.test(prevA.tag)) return 'of';
          if (lastVerb && FROM_VERBS.has(lastVerb)) return 'from';
          if (prevA && (prevA.pos === 'N' || prevA.pos === 'LIT')) return 'in';
          return 'from';
        case 'dintre':
          if (prevA && prevA.pos === 'F' && /^(QUANT|NUM|ORD)$/.test(prevA.tag)) return 'of';
          return 'between';
        case 'prin':
          if (lastVerb && LINK_VERBS.has(lastVerb)) return 'with';
          return 'through';
        case 'ca': return 'as';
        default: return a.en;
      }
    }

    function renderVerb(k) {
      const it = items[k], a = it.a;
      const key = strip(it.text);
      let words = [];
      let form = 'base';
      const feats = Array.isArray(a.feats) ? a.feats : [];
      if (PERSON_VERB[key] && !a.mwe) {
        let s = PERSON_VERB[key];
        if (negPending) { s = s.replace(/^can I$/, "can't I").replace(/^can you$/, "can't you").replace(/^I want$/, "I don't want").replace(/^need to$/, "don't need to"); negPending = false; }
        words.push(s);
        modalPrev = /can|need/.test(s); wantPrev = /want/.test(s);
        lastVerb = a.lemma;
        return words;
      }
      if (a.lemma === 'fi' && !a.mwe) {
        const be = { sunt: 'are', este: 'is', e: 'is', esti: 'are', suntem: 'are', sunteti: 'are', fie: 'be', fi: 'be', fost: 'been', fii: 'be' }[key] || 'is';
        words.push(be); if (negPending) { words.push('not'); negPending = false; }
        lastVerb = 'fi'; qPrev = null; return words;
      }
      if (a.lemma === 'avea' && !a.mwe) {
        const nxa = A(k + 1);
        if (nxa && nxa.pos === 'V' && nxa.feats.includes && nxa.feats.includes('part')) {
          auxHave = { am: 'I have', ai: 'you have', a: 'has', au: 'have', ati: 'you have', avem: 'we have' }[key] || 'have';
          return [];
        }
        words.push({ am: 'I have', ai: 'you have', are: 'has', au: 'have', avem: 'we have', aveti: 'you have' }[key] || 'have');
        lastVerb = 'avea'; return words;
      }
      if (auxHave) { words.push(auxHave); form = 'part'; auxHave = null; }
      else if (feats.includes('ger') && !feats.includes('imp')) form = 'ing';
      else if (subjectSeen && !qPrev && feats.includes('3sg') && !modalPrev && !wantPrev && !futPending) form = '3sg';
      if (negPending) {
        if (form === '3sg') { words.push("doesn't"); form = 'base'; }
        else words.push("don't");
        negPending = false;
      }
      if (qPrev && /^(how|where|why)$/.test(qPrev) && form === 'base' && !modalPrev) words.push('do I');
      words.push(form === 'base' ? a.en : enInflect(a.en, form));
      modalPrev = false; wantPrev = false; futPending = false; qPrev = null;
      lastVerb = a.lemma;
      for (const c of pendingPreClitics) words.push(c);
      pendingPreClitics = [];
      return words;
    }

    function emitNP(np, ctx, k) {
      const prevA = A(k - 1);
      // bare dative right after the verb (or after a doubling clitic): indirect object -> "to X" after the direct object
      if (np.head && np.head.pos === 'N' && np.head.feats.gen === true && (datNext || prevA && prevA.pos === 'V' && lastVerb)) {
        pendingDative = ['to'].concat(renderNP(np, ctx)); dativeFromClitic = false; datNext = false;
        return;
      }
      datNext = false;
      if (dativeFromClitic && np.gens.length) {
        const g = np.gens.pop();
        out.push(...renderNP(np, ctx));
        out.push('to', ...renderNP(g.np, { addThe: true }));
        pendingDative = null; dativeFromClitic = false;
        return;
      }
      if (prevWasAdvMwe && np.head && np.head.feats.gen === true) out.push('of');
      out.push(...renderNP(np, ctx));
      if (pendingDative) { out.push(...pendingDative); pendingDative = null; dativeFromClitic = false; }
    }

    while (i < items.length) {
      const it = items[i];
      const a = it.a;
      const wasAdvMwe = prevWasAdvMwe; prevWasAdvMwe = false;
      if (it.kind === 'NUMLIT' || it.kind === 'ORDN' || it.kind === 'LIT' && !a) {
        const np = parseNP(i, false);
        if (np.end === i) { out.push(it.text); i++; continue; }
        prevWasAdvMwe = wasAdvMwe; emitNP(np, {}, i); prevWasAdvMwe = false; qPrev = null; i = np.end;
        continue;
      }
      if (!a) { out.push(it.text); i++; continue; }
      const tg = a.pos === 'F' ? a.tag : a.pos;
      if (tg === 'V') {
        out.push(...renderVerb(i)); i++;
        // post-verbal clitics
        while (A(i) && A(i).pos === 'F' && A(i).tag === 'POSTCLITIC') {
          const c = A(i);
          if (c.feats.kase === 'refl') { i++; continue; }
          if (c.feats.kase === 'dat?') {
            const nx = A(i + 1);
            if (nx && nx.pos === 'N' && nx.feats.gen === true) { datNext = true; i++; continue; }
            const objFollows = items[i + 1] && (items[i + 1].kind === 'NUMLIT' || nx && (nx.pos === 'N' || nx.pos === 'A' || nx.pos === 'F' && /^(DET|NUM|QUANT|DEM|ORD|CEL)$/.test(nx.tag)));
            if (objFollows) { pendingDative = ['to it']; dativeFromClitic = true; } else out.push('them');
          } else if (A(i + 1) && A(i + 1).pos === 'F' && A(i + 1).lemma === 'pe') {
            // clitic doubling: "ascunde-l pe cel original" -> hide the original one
          } else out.push(c.en);
          i++;
        }
        continue;
      }
      if (tg === 'N' || tg === 'LIT' || /^(DET|DEM|QUANT|ORD|NUM|DETGEN|DEMGEN|CEL)$/.test(tg) || (tg === 'A' && (A(i + 1) && A(i + 1).pos === 'N'))) {
        const prevA = A(i - 1);
        const predicative = lastVerb && PRED_VERBS.has(lastVerb) && prevA && prevA.pos === 'V';
        const addThe = prevA && prevA.pos === 'F' && prevA.tag === 'PREP' && (prevA.mwe || /^(in|pe|la|din|sub|peste|langa|deasupra|dintre|intre|spre|catre|prin|dupa)$/.test(prevA.lemma));
        const np = parseNP(i, !!addThe);
        if (np.end === i) { out.push(a.en); i++; continue; }
        prevWasAdvMwe = wasAdvMwe;
        emitNP(np, { predicative, addThe }, i);
        prevWasAdvMwe = false;
        if (!lastVerb) subjectSeen = true;
        qPrev = qPrev && np.head ? null : qPrev;
        i = np.end;
        continue;
      }
      if (tg === 'A') { out.push(a.en); i++; continue; }
      if (tg === 'PREP') { const e = prepEn(a, i); if (e) out.push(e); i++; continue; }
      if (tg === 'GENART') { out.push('of'); i++; continue; }
      if (tg === 'GENPRON') { out.push('its'); i++; continue; }
      if (tg === 'PART') { // să
        const lastOut = out[out.length - 1];
        const drop = modalPrev || out.length === 0 || /^(how to|should|will)$/.test(lastOut || '') || (lastVerb && /^(face|lasa)$/.test(lastVerb));
        if (!drop) out.push('to');
        i++; continue;
      }
      if (tg === 'NEG') {
        if (a.mwe) { out.push(a.en); i++; continue; }
        negPending = true; i++;
        if (!(A(i) && (A(i).pos === 'V' || A(i).pos === 'F' && (A(i).tag === 'CLITIC' || A(i).tag === 'POSTCLITIC')))) { out.push('not'); negPending = false; }
        continue;
      }
      if (tg === 'CLITIC' || tg === 'POSTCLITIC') {
        if (a.lemma === 'se' || a.feats && a.feats.kase === 'refl') { i++; continue; }
        if (A(i + 1) && A(i + 1).pos === 'V') { pendingPreClitics.push(a.en); i++; continue; }
        out.push(a.en); i++; continue;
      }
      if (tg === 'PRON') { out.push(a.en); subjectSeen = true; i++; continue; }
      if (tg === 'Q') { out.push(a.en); qPrev = a.en; i++; continue; }
      if (tg === 'QV') { out.push(a.en); qPrev = null; if (/how to/.test(a.en)) modalPrev = true; lastVerb = lastVerb || 'q'; i++; continue; }
      if (tg === 'VMOD') { out.push(a.en); modalPrev = /should|possible/.test(a.en); wantPrev = /like/.test(a.en); i++; continue; }
      if (tg === 'AUX') { out.push(a.en); futPending = true; modalPrev = true; i++; continue; }
      if (tg === 'POSS') { out.push(a.en); i++; continue; }
      if (tg === 'ADV') {
        if (a.lemma === 'mai' && A(i + 1) && A(i + 1).pos === 'V') { out.push('also'); i++; continue; }
        out.push(a.en); if (a.mwe) prevWasAdvMwe = true; i++; continue;
      }
      out.push(a.en); i++;
    }
    if (pendingDative) out.push(...pendingDative.filter(x => x !== 'to it' || !dativeFromClitic || true));
    if (pendingPreClitics.length) out.push(...pendingPreClitics);
    return out;
  }

  // ---------------------------------------------------------------- naive baseline (exact dictionary, word by word)
  function translateNaive(text) {
    const toks = tokenize(text);
    const w = [];
    for (const t of toks) {
      if (t.kind === 'PUNCT') { w.push({ p: t.text }); continue; }
      if (t.kind !== 'W') { w.push(t.text); continue; }
      const k = strip(t.text);
      const ans = surf.get(k.replace(/^-/, ''));
      if (k.startsWith('-')) { const c = CLITIC_EN[k]; w.push(c ? c[0] : ''); continue; }
      if (!ans) { w.push(t.text); continue; }
      const a = ans[0];
      w.push(a.pos === 'N' && a.feats.num === 'pl' ? nounEn(a, true) : a.en);
    }
    return finish(w);
  }

  return {
    translate, translateNaive, tokenize,
    warmup() { ensureMemory(); return memoryMs; },
    get info() { return { D: opts.D, threshold: opts.threshold, forms: surf.size, itemMemory: itemVecs.length, mwes: MWES.length, lexiconMs: Math.round(buildMs), memoryMs }; },
    _cleanup: cleanup,
  };
}

const API = { createTranslator, strip };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.VSATranslator = API;
})(typeof window !== 'undefined' ? window : globalThis);
