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
function toLines(x) {
  if (!x) return [];
  if (typeof x === 'string') return parseLines(x);
  return x.map(e => Array.isArray(e) ? e.join('|') : String(e)).map(s => s.trim()).filter(Boolean);
}
const now = () => (typeof performance !== 'undefined' ? performance : Date).now();
// optimal string alignment (Damerau) distance, as in ml-circuits-research/vsa-spell
function osa(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let p2 = new Array(n + 1), p1 = new Array(n + 1), c = new Array(n + 1);
  for (let j = 0; j <= n; j++) p1[j] = j;
  for (let i = 1; i <= m; i++) {
    c[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(p1[j] + 1, c[j - 1] + 1, p1[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
      c[j] = v;
    }
    [p2, p1, c] = [p1, c, p2];
  }
  return p1[n];
}
function guessRoGender(w) { return /[ăae]$/.test(w) ? 'f' : 'n'; }
function guessRoClass(inf) { return /[eâ]a$/.test(inf) ? 'irr' : /a$/.test(inf) ? 'ez' : /[iî]$/.test(inf) ? 'esc' : 'e'; }
function posToTag(p) { p = String(p || 'n').toLowerCase(); return p[0] === 'v' ? 'V' : p.startsWith('adj') || p === 'a' ? 'ADJ' : p.startsWith('adv') ? 'ADV' : p.startsWith('prep') ? 'PREP' : p.startsWith('conj') ? 'CONJ' : 'N'; }

const DEFAULTS = {
  D: 2048, ngrams: [2, 3],
  english: 'auto',        // derive an English vocabulary from the dictionaries' translations (for mixed text)
  target: 'en',
  minSim: 0.64,           // spell: minimum hypervector similarity of the best candidate (calibrated: scripts/calibrate-spell.js)
  confidentSim: 0.75,     // corrections below this similarity (or with 2+ edits) lower `confident`
  wEd: 0.08, wLen: 0.02, wLang: 0.03,   // spell rerank: edit distance, length difference, same-language bonus
  maxSuggestions: 3,
  minCorrectLength: 5,    // shorter unknown words are reported, never auto-corrected
  firstLetterUntil: 7,    // words shorter than this are not corrected by replacing their first letter
  maxEdits: 'auto',       // 'auto': 1 edit, 2 for words of `longWord`+ letters; or a number; 'loose' = 1/2/3 by length
  longWord: 10,
  chrome: 'never',        // 'never' | 'fallback' (Chrome when VSA is unsure) | 'prefer' (Chrome whenever available)
  strict: false,          // true: return text = null when a word is outside the vocabulary
};

function createTranslator(a1, a2) {
  // createTranslator(options)  or legacy createTranslator(lexicon, options)
  let opts;
  if (a1 && (a1.VERBS || a1.NOUNS || a1.FUNC) && !a1.dictionaries) opts = Object.assign({}, a2 || {}, { dictionaries: [a1] });
  else opts = Object.assign({}, a1 || {});
  if (opts.threshold && !opts.minSim) opts.minSim = opts.threshold;
  opts = Object.assign({}, DEFAULTS, opts);
  const dictionaries = (opts.dictionaries || []).filter(Boolean);
  if (!dictionaries.length) throw new Error('vsa-translate: no vocabulary. Pass options.dictionaries, e.g. [dictionaries.ro, dictionaries.en, myVocabulary]');
  const HD = makeHD(opts.D);
  const t0 = now();

  const surf = new Map();   // stripped surface -> [analysis]
  const lemmaInfo = new Set();
  const langs = [];
  const MWE_LINES = [];
  const SENSES_RAW = {};
  const dictInfo = [];
  function addForm(surface, an) {
    const key = strip(surface);
    if (!key) return;
    an.orig = surface.toLowerCase();
    if (!surf.has(key)) surf.set(key, []);
    const arr = surf.get(key);
    const ex = arr.find(a => a.pos === an.pos && a.lemma === an.lemma && a.tag === an.tag && a.lang === an.lang);
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

  function compile(dict) {
    const lang = String(dict.lang || 'ro').toLowerCase();
    if (!langs.includes(lang)) langs.push(lang);
    const ro = (dict.morphology || (lang === 'ro' ? 'ro' : 'none')) === 'ro';
    const before = surf.size;
    const seen = k => { if (lemmaInfo.has(k)) return true; lemmaInfo.add(k); return false; };
    for (const l of toLines(dict.VERBS || dict.verbs)) {
      const [inf, cls0, en, extra] = l.split('|').map(s => (s || '').trim());
      if (!inf || !en) continue;
      const lemma = strip(inf), ex = extra ? extra.split(',').map(s => s.trim()).filter(Boolean) : [];
      const cls = cls0 && cls0 !== '-' ? cls0 : (ro ? guessRoClass(inf) : 'irr');
      const forms = ro ? verbForms(inf, cls, ex) : [[inf, ['inf', 'imp', 'fin']]].concat(ex.map(x => [x, ['fin', 'imp', '3sg']]));
      for (const [s, feats] of forms) addForm(s, { pos: 'V', lemma, en, feats: feats.slice(), lang });
    }
    function addNoun(p) {
      const [lem, pl0, g0, enRaw, extra] = p;
      if (!lem || !enRaw) return;
      const lemma = strip(lem);
      if (seen(lang + ':N:' + lemma)) return;
      let en = enRaw, enPl = null;
      const m = /^(.*);pl=(.*)$/.exec(enRaw);
      if (m) { en = m[1]; enPl = m[2]; }
      const pl = pl0 && pl0 !== '-' ? pl0 : null, g = g0 && g0 !== '-' ? g0 : (ro ? guessRoGender(lem) : 'n');
      const forms = ro ? nounForms(lem, pl, g) : [[lem, { num: 'sg' }]].concat(pl && pl !== lem ? [[pl, { num: 'pl' }]] : []);
      if (extra) for (const x of extra.split(',').map(s => s.trim()).filter(Boolean)) forms.push([x, ro ? guessNounFeats(strip(x), lemma) : { num: 'sg' }]);
      for (const [s, feats] of forms) addForm(s, { pos: 'N', lemma, en, enPl, feats: Object.assign({ g }, feats), lang });
    }
    for (const l of toLines(dict.NOUNS || dict.nouns)) addNoun(l.split('|').map(s => (s || '').trim()));
    function addAdj(p) {
      let m, f, mpl, fpl, en;
      if (p.length >= 5) [m, f, mpl, fpl, en] = p; else { m = p[0]; en = p[p.length - 1]; f = mpl = fpl = m; }
      if (!m || !en || m === en && p.length < 2) return;
      const lemma = strip(m);
      const forms = ro && p.length >= 5 ? adjForms(m, f, mpl, fpl) : [[m, { g: 'm', num: 'sg' }], [f, { g: 'f', num: 'sg' }], [mpl, { num: 'pl' }], [fpl, { num: 'pl' }]];
      for (const [s, feats] of forms) if (s) addForm(s, { pos: 'A', lemma, en, feats, lang });
    }
    for (const l of toLines(dict.ADJ || dict.adjectives)) addAdj(l.split('|').map(s => (s || '').trim()));
    for (const l of toLines(dict.FUNC || dict.functionWords)) {
      const [s, en, tag] = l.split('|').map(x => (x || '').trim());
      if (!s) continue;
      if (/\s/.test(s)) { MWE_LINES.push({ src: s, en, tag: tag || 'ADV', lang }); continue; }
      addForm(s, { pos: 'F', tag: (tag || 'ADV').toUpperCase(), lemma: strip(s), en, feats: {}, lang });
    }
    // simple vocabulary: { word: 'english' } | { word: { en, pos, plural, gender, forms, tag } } | [[word, english, pos], ...]
    const W = dict.words;
    const entries = !W ? [] : Array.isArray(W)
      ? W.map(e => Array.isArray(e) ? [e[0], { en: e[1], pos: e[2] }] : [e.word || e.src, e])
      : Object.entries(W).map(([k, v]) => [k, typeof v === 'string' ? { en: v } : v]);
    for (const [src0, e] of entries) {
      const src = String(src0 || '').trim();
      if (!src || !e || !e.en) continue;
      if (/\s/.test(src)) { MWE_LINES.push({ src, en: e.en, tag: posToTag(e.pos), lang }); continue; }
      const pos = String(e.pos || 'n').toLowerCase();
      if (e.tag || pos === 'f' || pos === 'func') addForm(src, { pos: 'F', tag: String(e.tag || 'ADV').toUpperCase(), lemma: strip(src), en: e.en, feats: {}, lang });
      else if (pos[0] === 'v') {
        const lemma = strip(src);
        const forms = ro ? verbForms(src, e.class || guessRoClass(src), e.forms || []) : [[src, ['inf', 'imp', 'fin']]].concat((e.forms || []).map(x => [x, ['fin', 'imp', '3sg']]));
        for (const [s, feats] of forms) addForm(s, { pos: 'V', lemma, en: e.en, feats: feats.slice(), lang });
      } else if (pos.startsWith('adj') || pos === 'a') {
        const fs = e.forms || [];
        addAdj(fs.length >= 3 ? [src, fs[0], fs[1], fs[2], e.en] : [src].concat(fs).concat([e.en]));
      } else if (pos.startsWith('adv')) addForm(src, { pos: 'F', tag: 'ADV', lemma: strip(src), en: e.en, feats: {}, lang });
      else addNoun([src, e.plural || '', e.gender || '', e.en + (e.enPlural ? ';pl=' + e.enPlural : ''), (e.forms || []).join(',')]);
    }
    const P = dict.MWE || dict.phrases;
    if (typeof P === 'string') {
      for (const l of parseLines(P)) {
        const [src, rest] = l.split('=>'); if (!rest) continue;
        const [en, tag] = rest.split('|').map(s => s.trim());
        MWE_LINES.push({ src: src.trim(), en, tag: tag || 'N', lang });
      }
    } else if (Array.isArray(P)) {
      for (const e of P) { const [src, en, tag] = Array.isArray(e) ? e : [e.src, e.en, e.tag]; if (src && en) MWE_LINES.push({ src, en, tag: tag || 'N', lang }); }
    } else if (P) {
      for (const [src, v] of Object.entries(P)) {
        const en = typeof v === 'string' ? v : Array.isArray(v) ? v[0] : v.en;
        const tag = typeof v === 'string' ? 'N' : Array.isArray(v) ? v[1] : v.tag;
        if (en) MWE_LINES.push({ src, en, tag: tag ? (/^[a-z]/.test(tag) ? posToTag(tag) : tag) : 'N', lang });
      }
    }
    Object.assign(SENSES_RAW, dict.SENSES || dict.senses || {});
    dictInfo.push({ name: dict.name || lang, lang, forms: surf.size - before });
  }
  for (const d of dictionaries) compile(d);

  // English vocabulary derived from every translation in the dictionaries, so mixed RO-EN text is understood
  function deriveEnglish() {
    if (!langs.includes('en')) langs.push('en');
    const add = (w, an) => { if (!w || !/^[a-z][a-z'-]*$/i.test(w)) return; addForm(w, Object.assign({ lemma: strip(w), en: w, lang: 'en', derived: true }, an)); };
    const src = [];
    for (const ans of surf.values()) for (const a of ans) if (a.lang !== 'en' && a.en && a.pos !== 'F') src.push(a);
    for (const l of MWE_LINES) if (l.lang !== 'en' && l.en) src.push({ pos: l.tag === 'V' ? 'V' : l.tag === 'ADJ' ? 'A' : l.tag === 'N' ? 'N' : 'X', en: l.en });
    const done = new Set();
    for (const a of src) {
      const k = a.pos + ':' + a.en + ':' + (a.enPl || '');
      if (done.has(k)) continue; done.add(k);
      const words = a.en.toLowerCase().replace(/^(the|a|an) /, '').split(/\s+/).filter(Boolean);
      if (!words.length) continue;
      if (a.pos === 'N') {
        const head = words[words.length - 1], pl = a.enPl ? a.enPl.toLowerCase().split(/\s+/).pop() : enPlural(head);
        add(head, { pos: 'N', feats: { num: 'sg' }, enPl: pl });
        if (pl !== head) add(pl, { pos: 'N', feats: { num: 'pl' }, enPl: pl, lemma: strip(head) });
        for (const w of words.slice(0, -1)) add(w, { pos: 'A', feats: {} });
      } else if (a.pos === 'V') {
        const v = words[0];
        add(v, { pos: 'V', feats: ['inf', 'imp', 'fin'] });
        add(enInflect(v, '3sg'), { pos: 'V', feats: ['fin', '3sg'], lemma: strip(v) });
        add(enInflect(v, 'ing'), { pos: 'V', feats: ['ger'], lemma: strip(v) });
        add(enInflect(v, 'part'), { pos: 'V', feats: ['part', 'adj'], lemma: strip(v) });
        for (const w of words.slice(1)) add(w, { pos: 'F', tag: 'ADV', feats: {} });
      } else if (a.pos === 'A') for (const w of words) add(w, { pos: 'A', feats: {} });
    }
  }
  if (opts.english === 'auto' && opts.target === 'en') deriveEnglish();

  // MWEs: list of word arrays (stripped)
  const COLORS = ['rosu', 'albastru', 'verde', 'galben', 'gri', 'mov', 'violet', 'roz', 'maro', 'portocaliu', 'turcoaz', 'cenusiu'];
  for (const c of COLORS) {
    const en = (surf.get(c) || []).find(a => a.pos === 'A' && a.lang === 'ro');
    if (!en) continue;
    MWE_LINES.push({ src: c + ' deschis', en: 'light ' + en.en, tag: 'ADJ', lang: 'ro' }, { src: c + ' inchis', en: 'dark ' + en.en, tag: 'ADJ', lang: 'ro' }, { src: c + ' aprins', en: 'bright ' + en.en, tag: 'ADJ', lang: 'ro' });
  }
  const MWES = MWE_LINES.map(l => ({ words: String(l.src).trim().split(/\s+/).map(strip), en: l.en, tag: l.tag, lang: l.lang }))
    .filter(m => m.words.length > 1 || m.words[0])
    .sort((a, b) => b.words.length - a.words.length);
  const mweByFirst = new Map();
  for (const m of MWES) { const k = m.words[0]; if (!mweByFirst.has(k)) mweByFirst.set(k, []); mweByFirst.get(k).push(m); }

  // ---------- VSA item memory over the vocabulary's surface forms
  const C = {}, CR = {};
  function charv(ch, t) {
    const k = ch + t;
    if (!CR[k]) { if (!C[ch]) C[ch] = HD.rand('char:' + ch); CR[k] = t === 0 ? C[ch] : HD.rot(C[ch], t); }
    return CR[k];
  }
  const NG = opts.ngrams || [2, 3];
  function encodeWord(key) {
    const s = '#' + key + '#';
    const vecs = [];
    for (const n of NG) {
      if (n === 's') { // skip-bigram (c_i, c_i+2)
        for (let i = 0; i + 3 <= s.length; i++) {
          const a = charv(s[i], 3), b = charv(s[i + 2], 0), v = new Uint32Array(HD.W);
          for (let k = 0; k < HD.W; k++) v[k] = a[k] ^ b[k];
          vecs.push(v);
        }
        continue;
      }
      for (let i = 0; i + n <= s.length; i++) {
        // n-gram = rho^(n-1)(c1) XOR ... XOR rho^0(cn)   (permutation encodes position inside the n-gram)
        const v = new Uint32Array(HD.W);
        for (let t = 0; t < n; t++) { const cv = charv(s[i + t], n - 1 - t); for (let k = 0; k < HD.W; k++) v[k] ^= cv[k]; }
        vecs.push(v);
      }
    }
    return HD.bundle(vecs);
  }
  let itemKeys = [], itemVecs = [], itemLangs = [];
  let memoryMs = null;
  function ensureMemory() {
    if (memoryMs !== null) return;
    const tm = now();
    for (const [key, ans] of surf) {
      if (key.length < 3 || /^-/.test(key)) continue;
      if (key.length < 4 && ans.every(a => a.pos === 'F')) continue;
      itemKeys.push(key); itemVecs.push(encodeWord(key)); itemLangs.push(Array.from(new Set(ans.map(a => a.lang))));
    }
    memoryMs = Math.round(now() - tm);
  }
  // ---------- VSA sense prototypes
  const lemmaVecCache = new Map();
  function lemmaVec(k) { if (!lemmaVecCache.has(k)) lemmaVecCache.set(k, HD.rand('lemma:' + k)); return lemmaVecCache.get(k); }
  const SENSES = {};
  for (const lem in SENSES_RAW) {
    SENSES[lem] = SENSES_RAW[lem].map(([en, ctx]) => ({ en, ctx: String(ctx || '').split(/\s+/).filter(Boolean).map(s => lemmaVec(strip(s))) }));
  }
  const buildMs = now() - t0;

  // ---------- spelling: Hamming top-K in the item memory, reranked by edit distance (vsa-spell style)
  function spell(key, domLang) {
    ensureMemory();
    const q = encodeWord(key), K = 24, N = itemVecs.length;
    const topI = new Int32Array(K).fill(-1), topS = new Float64Array(K).fill(-1);
    for (let i = 0; i < N; i++) {
      const s = HD.sim(q, itemVecs[i]);
      if (s > topS[K - 1]) { let j = K - 1; while (j > 0 && topS[j - 1] < s) { topS[j] = topS[j - 1]; topI[j] = topI[j - 1]; j--; } topS[j] = s; topI[j] = i; }
    }
    const cands = [];
    for (let j = 0; j < K; j++) {
      const i = topI[j]; if (i < 0) continue;
      const w = itemKeys[i], ed = osa(key, w), lg = itemLangs[i];
      const score = topS[j] - opts.wEd * ed - opts.wLen * Math.abs(w.length - key.length) + (domLang && lg.includes(domLang) ? opts.wLang : 0);
      cands.push({ key: w, sim: topS[j], ed, langs: lg, score });
    }
    cands.sort((a, b) => b.score - a.score);
    // safety rules: a correction must not change meaning by adding/removing a prefix or the first letter
    // (neconectate -> conectate, tichete -> etichete), and must stay in the sentence language for short words
    const safe = c => {
      if (key.length < opts.minCorrectLength) return false;
      const d = Math.abs(c.key.length - key.length);
      if (d >= 1 && (key.endsWith(c.key) || c.key.endsWith(key))) return false;
      if (domLang && !c.langs.includes(domLang) && key.length < 6) return false;
      if (key.length < opts.firstLetterUntil && c.key[0] !== key[0] && c.key.length === key.length) return false; // pista -> lista, ventes -> lentes
      return true;
    };
    for (const c of cands) c.safe = safe(c);
    const best = cands[0];
    const maxEd = typeof opts.maxEdits === 'number' ? opts.maxEdits : opts.maxEdits === 'loose' ? (key.length <= 4 ? 1 : key.length <= 7 ? 2 : 3) : (key.length >= opts.longWord ? 2 : 1);
    const accepted = !!best && best.safe && best.ed <= maxEd && best.sim >= opts.minSim;
    return { accepted, best, cands, maxEd };
  }
  function cleanup(key) { const s = spell(key); return s.best ? { key: s.best.key, sim: s.best.sim, ed: s.best.ed, accepted: s.accepted } : { key: null, sim: 0 }; }

  // ---------------------------------------------------------------- tokenizer
  const CLITIC_SUFFIX = new Set(['l', 'o', 'i', 'le', 'mi', 'ti', 'ne', 'va', 'ma', 'te', 'se', 'si', 'ii', 'li']);
  const LOAN_SUFFIX = { ul: { num: 'sg', def: true }, ului: { num: 'sg', def: true, gen: true }, uri: { num: 'pl' }, urile: { num: 'pl', def: true }, urilor: { num: 'pl', def: true, gen: true }, ul_: {}, lui: { num: 'sg', def: true, gen: true }, le: { num: 'pl', def: true }, a: { num: 'sg', def: true }, ei: { num: 'sg', def: true, gen: true }, i: { num: 'pl' }, ii: { num: 'pl', def: true }, ilor: { num: 'pl', def: true, gen: true }, rile: { num: 'pl', def: true } };
  function tokenize(text) {
    const toks = [];
    const re = /\b\d{1,2}:\d{2}\b|[\p{L}\d_-]+\.(?:csv|pdf|svg|png|jpe?g|json|xml|xlsx?|docx?|pptx?|txt|html?|md|gif|mp4|zip)\b|[\p{L}\d]+(?:_[\p{L}\d]+)+|"[^"]*"|„[^”"]*[”"]|“[^”]*”|«[^»]*»|(?<![\p{L}\d])'[^']{2,}'|#[0-9a-fA-F]{3,8}\b|\d+(?:[.,]\d+)?(?:-(?:lea|a))?(?:\s?(?:%|px|ms|pt|fps|deg|°))?(?![\p{L}\d])|\d+(?:[.,]\d+)?[\p{L}]+|[\p{L}\d_]+(?:['’][\p{L}]+)*(?:-[\p{L}\d_]+)*|[.,!?;:()]/gu;
    let m;
    while ((m = re.exec(text))) {
      const n0 = toks.length, t = m[0];
      pushMatch(t.replace(/’/g, "'"));
      // character offsets of each produced token inside the original text
      let cur = 0;
      for (let q = n0; q < toks.length; q++) {
        const part = toks[q].text.replace(/^-/, '').replace(/^"|"$/g, '');
        const at = t.replace(/’/g, "'").toLowerCase().indexOf(part.toLowerCase(), cur);
        if (at >= 0 && part) { toks[q].start = m.index + at; toks[q].end = m.index + at + part.length; cur = at + part.length; }
        else { toks[q].start = m.index; toks[q].end = m.index + t.length; }
      }
    }
    function pushMatch(t) {
      // elision: l'image, dell'oggetto, d'animation -> article + word (when the article is in a dictionary)
      const el = /^(\p{L}{1,4}')(\p{L}[\p{L}'-]*)$/u.exec(t);
      if (el && surf.has(strip(el[1]))) { toks.push({ kind: 'W', text: el[1] }); pushMatch(el[2]); return; }

      if (/^\d{1,2}:\d{2}$/.test(t)) { toks.push({ kind: 'LIT', text: t, time: true }); return; }
      if (/\.[a-z0-9]{2,4}$/i.test(t) && !/^\d/.test(t) || /_/.test(t)) { toks.push({ kind: 'LIT', text: t, ident: true }); return; }
      if (/^["„“«']/.test(t)) { toks.push({ kind: 'LIT', text: '"' + t.slice(1, -1).trim() + '"', quoted: true }); return; }
      if (/^#[0-9a-f]/i.test(t)) { toks.push({ kind: 'LIT', text: t, hex: true }); return; }
      if (/^\d+-(lea|a)$/.test(t)) { const n = parseInt(t); toks.push({ kind: 'ORDN', text: t, en: 'the ' + n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th') }); return; }
      if (/^\d/.test(t)) { toks.push({ kind: 'NUMLIT', text: t.replace(/(\d),(\d)/, '$1.$2') }); return; }
      if (/^[.,!?;:()]$/.test(t)) { toks.push({ kind: 'PUNCT', text: t }); return; }
      // hyphenated forms
      if (t.includes('-')) {
        const parts = t.split('-');
        const lp = strip(parts[0]);
        // într-un, dintr-o, printr-un
        if (/^(intr|dintr|printr)$/.test(lp) && parts.length === 2) {
          toks.push({ kind: 'W', text: lp === 'intr' ? 'în' : lp === 'dintr' ? 'din' : 'prin' });
          toks.push({ kind: 'W', text: parts[1] });
          return;
        }
        // pre-verbal clitic + aux: l-am, i-am, s-a, s-o, n-am, mi-a
        if (['l', 'i', 's', 'n', 'mi', 'ti', 'v', 'ne', 'le', 'm'].includes(lp) && parts.length === 2) {
          const map = { l: '-l', i: '-i', s: 'se', n: 'nu', mi: '-mi', ti: '-ți', v: '-vă', ne: '-ne', le: '-le', m: '-mă' };
          if (lp === 's' && strip(parts[1]) === 'o') { toks.push({ kind: 'W', text: 'să' }); toks.push({ kind: 'W', text: '-o' }); return; }
          toks.push({ kind: 'W', text: map[lp] }); toks.push({ kind: 'W', text: parts[1] }); return;
        }
        if (lp === 'nu' && parts.length === 2) { toks.push({ kind: 'W', text: 'nu' }); toks.push({ kind: 'W', text: '-' + parts[1] }); return; }
        if (lp === 'sa' && parts.length === 2) { toks.push({ kind: 'W', text: 'să' }); toks.push({ kind: 'W', text: '-' + parts[1] }); return; }
        // known hyphenated word (prim-plan, e-mail, de-a)
        if (surf.has(strip(t))) { toks.push({ kind: 'W', text: t }); return; }
        const last = strip(parts[parts.length - 1]);
        const head = parts.slice(0, -1).join('-');
        // other languages: verb-pronoun inversion / enclitics (puis-je, envoie-le, est-ce)
        const headAns = surf.get(strip(head)), lastAns = surf.get(last);
        if (headAns && lastAns && !headAns.some(a => a.lang === 'ro') && lastAns.some(a => a.pos === 'F' && a.lang !== 'ro')) {
          toks.push({ kind: 'W', text: head }); toks.push({ kind: 'W', text: parts[parts.length - 1] }); return;
        }
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
            return;
          }
        }
        // loanword/acronym + Romanian article: PDF-ul, layer-ul, mouse-ului, SVG-uri
        if (LOAN_SUFFIX[last] && parts.length >= 2) {
          toks.push({ kind: 'W', text: head, loanFeats: LOAN_SUFFIX[last] });
          return;
        }
        toks.push({ kind: 'W', text: t });
        return;
      }
      toks.push({ kind: 'W', text: t });
    
    }
    let first = true;
    for (const t of toks) {
      if (t.kind === 'PUNCT' && /[.!?]/.test(t.text)) { first = true; continue; }
      if (t.kind === 'W') { t.first = first; t.cap = /^\p{Lu}/u.test(t.text) && !/^\p{Lu}+$/u.test(t.text) || /\p{Ll}\p{Lu}/u.test(t.text); t.acr = /^[\p{Lu}\d]{2,}$/u.test(t.text); if (/\p{Ll}\p{Lu}/u.test(t.text)) t.first = false; first = false; }
      else if (t.kind !== 'PUNCT') first = false;
    }
    return toks;
  }

  // ---------------------------------------------------------------- lexical analysis
  const CLITIC_EN = { '-l': ['it', 'acc'], '-o': ['it', 'acc'], '-le': ['them', 'acc'], '-i': ['it', 'dat?'], '-ii': ['it', 'dat?'], '-li': ['them', 'acc'], '-mi': ['me', 'dat'], '-ti': ['you', 'dat'], '-ne': ['us', 'dat'], '-va': ['you', 'dat'], '-ma': ['me', 'acc'], '-te': ['you', 'acc'], '-se': ['', 'refl'], '-si': ['', 'refl'] };
  const copyA = (a, extra) => Object.assign({}, a, { feats: Array.isArray(a.feats) ? a.feats.slice() : Object.assign({}, a.feats) }, extra || {});
  function exactAnalyze(tok, stats) {
    const key = strip(tok.text);
    if (key.startsWith('-')) {
      const c = CLITIC_EN[key];
      return [{ pos: 'F', tag: 'POSTCLITIC', lemma: key, en: c ? c[0] : 'it', feats: { kase: c ? c[1] : 'acc' }, lang: 'ro' }];
    }
    if (tok.loanFeats) {
      const hit = surf.get(key);
      const n = hit && hit.find(a => a.pos === 'N');
      if (n) { stats.exact++; return [copyA(n, { feats: Object.assign({}, n.feats, tok.loanFeats), how: 'exact' })]; }
      return null;
    }
    if (tok.acr && !surf.has(key)) return [{ pos: 'LIT', lemma: key, en: tok.text, feats: {}, acr: true }];
    if (!surf.has(key)) return null;
    stats.exact++;
    let ans = surf.get(key).map(a => copyA(a, { how: 'exact' }));
    const low = tok.text.toLowerCase();
    if (low !== key) {
      const same = ans.filter(a => a.orig === low);
      if (same.length) ans = same.concat(ans.filter(a => a.orig !== low && a.pos !== 'F'));
    } else if (key === 'ca') {
      ans = ans.filter(a => a.tag !== 'CONJ').concat(ans.filter(a => a.tag === 'CONJ'));
    }
    return ans;
  }
  function spellAnalyze(tok, stats, domLang) {
    const key = strip(tok.text);
    if (tok.loanFeats) { // unknown loanword with a Romanian article: keep it as a noun
      return [{ pos: 'N', lemma: key, en: tok.text, enPl: /^[A-Z0-9]+$/.test(tok.text) ? tok.text + 's' : null, feats: Object.assign({}, tok.loanFeats), loan: true, unknown: !/^[A-Z0-9]+$/.test(tok.text) }];
    }
    if (key.length >= 3 && !(tok.cap && !tok.first) && /\p{L}/u.test(key)) {
      const sp = spell(key, domLang);
      tok.spell = sp;
      if (sp.accepted) {
        stats.vsa++;
        stats.vsaLog.push(tok.text + '→' + sp.best.key + ' (' + sp.best.sim.toFixed(2) + ')');
        stats.vsaPairs.push([tok.text, sp.best.key, sp.best.sim]);
        let ans = surf.get(sp.best.key).filter(a => a.pos !== 'F' || key.length >= 4);
        const pref = ans.filter(a => a.lang === domLang);
        if (pref.length) ans = pref;
        if (ans.length) return ans.map(a => copyA(a, { how: 'vsa', sim: sp.best.sim, ed: sp.best.ed, match: sp.best.key }));
      }
    }
    stats.unknown++;
    return [{ pos: 'LIT', lemma: key, en: tok.text, feats: {}, unknown: true, label: tok.cap && !tok.first }];
  }
  function analyzeAll(text, stats) {
    const items = tokenize(text).map(t => Object.assign(t, { cands: t.kind === 'W' ? exactAnalyze(t, stats) : [] }));
    // sentence language: vote of the words that exist in exactly one language
    const votes = {};
    for (const it of items) {
      if (it.kind !== 'W' || !it.cands) continue;
      const ls = new Set(it.cands.map(a => a.lang).filter(Boolean));
      if (ls.size === 1) { const l = ls.values().next().value; votes[l] = (votes[l] || 0) + 1; }
    }
    let dom = langs[0], bestV = -1;
    for (const l of langs) if ((votes[l] || 0) > bestV) { bestV = votes[l] || 0; dom = l; }
    // words inside a known phrase ("fondu entrant") are known even if not listed alone
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind !== 'W') continue;
      const mm = mweMatchRaw(items, i);
      if (mm) for (let q = i; q < mm; q++) if (!items[q].cands) { items[q].cands = [{ pos: 'LIT', lemma: strip(items[q].text), en: items[q].text, feats: {}, inPhrase: true }]; items[q].inMwe = true; }
    }
    for (const it of items) if (it.kind === 'W' && !it.cands) it.cands = spellAnalyze(it, stats, dom);
    // a word that exists in several languages takes the sentence language's readings
    for (const it of items) {
      if (it.kind !== 'W' || it.cands.length < 2) continue;
      const pref = it.cands.filter(a => a.lang === dom || !a.lang);
      if (pref.length && pref.length < it.cands.length) it.cands = pref;
    }
    return { items, dom, votes };
  }
  function matchCase(src, w) {
    if (!w) return src;
    if (/^[\p{Lu}\d]{2,}$/u.test(src)) return w.toUpperCase();
    if (/^\p{Lu}/u.test(src)) return w[0].toUpperCase() + w.slice(1);
    return w;
  }
  function displayForm(key) { const a = (surf.get(key) || [])[0]; return a ? a.orig : key; }
  function report(text, items) {
    const errors = [], corrections = [];
    let src = '', last = 0;
    for (const it of items) {
      if (it.kind !== 'W' || !it.cands || !it.cands.length) continue;
      const a = it.cands[0];
      if (a.unknown && !a.label && !a.acr && /\p{L}{2,}/u.test(it.text)) {
        const sug = it.spell ? it.spell.cands.slice(0, opts.maxSuggestions).map(c => ({ word: displayForm(c.key), sim: +c.sim.toFixed(3), edits: c.ed, lang: c.langs[0] })) : [];
        errors.push({ word: it.text, start: it.start, end: it.end, message: 'Unknown word "' + it.text + '": not in the vocabulary', suggestions: sug });
      } else if (a.how === 'vsa') {
        const to = matchCase(it.text, a.orig || displayForm(a.match));
        corrections.push({ word: it.text, to, start: it.start, end: it.end, sim: +a.sim.toFixed(3), edits: a.ed, lang: a.lang });
        if (it.start != null) { src += text.slice(last, it.start) + to; last = it.end; }
      }
    }
    src += text.slice(last);
    return { errors, corrections, source: src };
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
          // gender agreement: a masculine-form adjective cannot modify a feminine singular noun (and vice versa) -> adverb reading
          if (prevA && prevA.pos === 'N' && prevA.feats.num === 'sg' && a.feats.num === 'sg' && a.feats.g && prevA.feats.g &&
              ((prevA.feats.g === 'f') !== (a.feats.g === 'f')) && it.cands.some(x => x.pos === 'F' && x.tag === 'ADV')) s -= 4;
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
  // phrase match on surface forms only (before analysis): returns end index or 0
  function mweMatchRaw(items, i) {
    const k0 = strip(items[i].text);
    const ms = mweByFirst.get(k0); if (!ms) return 0;
    for (const m of ms) {
      let j = i, w = 0;
      while (w < m.words.length && j < items.length && items[j].kind === 'W' && strip(items[j].text) === m.words[w]) { w++; j++; }
      if (w === m.words.length && m.words.length > 1) return j;
    }
    return 0;
  }
  function mweMatch(items, i) {
    const first = items[i];
    const keys = k => {
      const s = new Set([strip(k.text)]);
      for (const a of (k.cands || [])) s.add(a.lemma);
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
  const INTO_VERBS = new Set(['imparti', 'transforma', 'grupa', 'trage', 'combina', 'imbina', 'importa', 'insera']);
  const SET_VERBS = new Set(['seta', 'schimba', 'modifica', 'mari', 'micsora', 'creste', 'scadea', 'reduce', 'stabili', 'pune', 'ajusta', 'limita']);
  const WORDLIKE = new Set(['cuvant', 'text', 'fraza', 'fisier', 'folder', 'dosar', 'eticheta', 'nume', 'titlu', 'mesaj', 'termen', 'valoare', 'camp', 'coloana', 'tab', 'fila', 'proiect', 'raport', 'document']);
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
    const t1 = now();
    const an = analyzeAll(String(text || ''), stats);
    let items = an.items;
    const dom = an.dom;
    const rep = report(String(text || ''), items);
    if (dom === opts.target) return finishResult(renderTarget(items), items, rep, dom, stats, t1);
    for (let i = 1; i < items.length; i++) {
      const it = items[i], pv = items[i - 1];
      const listCtx = pv.kind === 'PUNCT' && /^[:,]$/.test(pv.text) && items.slice(0, i).some(x => x.kind === 'PUNCT' && x.text === ':');
      if (it.kind === 'W' && it.cap && !it.first && (listCtx || pv.kind === 'W' && pv.cands.some(a => a.pos === 'N')) && it.cands.some(a => a.pos !== 'F')) {
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
          const a = { pos, tag: pos === 'F' ? tag : undefined, lemma: mm.m.words.join('_'), en: mm.m.en, feats: pos === 'V' ? ['imp', 'fin', '3sg'] : (mm.feats || {}), mwe: true, lang: mm.m.lang };
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
    return finishResult(renderAll(items), items, rep, dom, stats, t1);
  }
  function tokenReport(items) {
    return items.map(it => {
      if (it.kind === 'PUNCT') return { text: it.text, how: 'punct' };
      if (it.kind !== 'W') return { text: it.text, how: 'literal' };
      const a = it.a || it.cands[0] || {};
      const how = a.mwe ? 'phrase' : a.how === 'vsa' ? 'vsa' : a.label || a.acr ? 'label' : a.unknown ? 'unknown' : 'exact';
      return { text: it.text, how, lemma: a.lemma, pos: a.pos === 'F' ? a.tag : a.pos, en: a.en, sim: a.sim, edits: a.ed, match: a.match, lang: a.lang, start: it.start, end: it.end };
    });
  }
  function finishResult(out, items, rep, dom, stats, t1) {
    stats.tokens = tokenReport(items);
    // confidence for routing: unknown words or weak corrections -> let a neural fallback handle it
    stats.unknownWords = rep.errors.map(e => e.word);
    stats.weakMatches = rep.corrections.filter(c => c.sim < opts.confidentSim || c.edits >= 2).map(c => c.word);
    stats.confident = stats.unknownWords.length === 0 && stats.weakMatches.length === 0;
    const ms = now() - t1;
    return {
      text: opts.strict && rep.errors.length ? null : out,
      ok: rep.errors.length === 0, errors: rep.errors, corrections: rep.corrections,
      language: dom, confident: stats.confident, engine: 'vsa', source: rep.source, ms, stats,
    };
  }
  // sentence already in the target language (English): keep it, fix spelling, translate stray foreign words
  function renderTarget(items) {
    choose(items);
    const w = [];
    for (const it of items) {
      if (it.kind === 'PUNCT') { w.push({ p: it.text }); continue; }
      if (it.kind !== 'W') { w.push(it.text); continue; }
      const a = it.a || it.cands[0];
      if (!a || a.unknown || a.pos === 'LIT') { w.push(it.text); continue; }
      if (a.lang === opts.target) w.push(a.how === 'vsa' ? matchCase(it.text, a.orig) : it.text);
      else if (a.pos === 'F' && (a.tag === 'POSTCLITIC' || a.tag === 'CLITIC')) { if (a.en && a.en !== '·') w.push(a.en); }
      else w.push(a.pos === 'N' && a.feats.num === 'pl' ? nounEn(a, true) : a.en);
    }
    return finish(w);
  }
  function spellcheck(text) {
    const stats = { exact: 0, vsa: 0, unknown: 0, vsaLog: [], vsaPairs: [] };
    const t1 = now();
    const { items, dom } = analyzeAll(String(text || ''), stats);
    const rep = report(String(text || ''), items);
    const tokens = items.filter(it => it.kind === 'W' || it.kind === 'LIT').map(it => {
      const a = it.cands && it.cands[0] || {};
      const status = it.kind === 'LIT' || a.label || a.acr ? 'name' : a.unknown ? 'unknown' : a.how === 'vsa' ? 'corrected' : 'ok';
      const t = { text: it.text, start: it.start, end: it.end, status, lang: a.lang || null };
      if (status === 'corrected') { t.suggestion = matchCase(it.text, a.orig); t.sim = +a.sim.toFixed(3); t.edits = a.ed; }
      if (it.spell && status !== 'ok') t.suggestions = it.spell.cands.slice(0, opts.maxSuggestions).map(c => matchCase(it.text, displayForm(c.key)));
      return t;
    });
    return { ok: rep.errors.length === 0, text: rep.source, language: dom, errors: rep.errors, corrections: rep.corrections, tokens, ms: now() - t1 };
  }
  // ---------------------------------------------------------------- optional Chrome on-device translator
  const chromeCache = new Map();
  function chromeAvailable() { return typeof self !== 'undefined' && !!self && 'Translator' in self; }
  function chromeFor(lang) {
    if (!chromeCache.has(lang)) {
      chromeCache.set(lang, (async () => {
        const av = await self.Translator.availability({ sourceLanguage: lang, targetLanguage: opts.target });
        if (av === 'unavailable') throw new Error('Chrome cannot translate ' + lang + ' to ' + opts.target + ' on this device');
        return self.Translator.create({ sourceLanguage: lang, targetLanguage: opts.target, monitor: opts.chromeMonitor });
      })().catch(e => { chromeCache.delete(lang); throw e; }));
    }
    return chromeCache.get(lang);
  }
  async function translateAsync(text, o) {
    const policy = (o && o.chrome) || opts.chrome;
    const r = translate(text);
    if (policy === 'never' || !chromeAvailable() || r.language === opts.target) return r;
    if (policy === 'fallback' && r.confident) return r;
    try {
      const tr = await chromeFor(r.language);
      const t1 = now();
      const out = await tr.translate(r.source);
      return Object.assign({}, r, { text: out, vsaText: r.text, engine: 'chrome', chromeMs: now() - t1 });
    } catch (e) {
      return Object.assign({}, r, { chromeError: String(e && e.message || e) });
    }
  }
  // call from a click handler: Chrome needs a user gesture to download a language model
  function prepareChrome(languages) {
    if (!chromeAvailable()) return Promise.reject(new Error('The Translator API is not available in this browser'));
    return Promise.all((languages || langs.filter(l => l !== opts.target)).map(l => chromeFor(l).then(() => l)));
  }

  function renderAll(items) {
    // split into clauses at CONJ / PUNCT
    const words = [];
    let clause = [];
    let sub = false;
    const flush = () => { if (clause.length) words.push(...renderClause(clause, { sub })); clause = []; sub = false; };
    for (const it of items) {
      if (it.kind === 'PUNCT') { flush(); words.push({ p: it.text }); continue; }
      const a = it.a;
      if (a && a.pos === 'F' && (a.tag === 'CONJ' || a.tag === 'INTJ' || a.tag === 'Q' && a.lemma === 'cand' && clause.length)) {
        flush(); words.push(a.en);
        sub = /^(before|after|when|while|until|if|so that|because)$/.test(a.en) || a.lemma === 'cand';
        continue;
      }
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

  function renderClause(items, ctxClause) {
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
    let lastVerbIdx = -1, lastVerbEn = null, subjectNot3 = false;
    const A = k => items[k] && items[k].a;
    const K = k => items[k] && items[k].kind;
    const isLabelLit = x => x && (x.quoted || x.label || x.acr);

    function emptyNP() { return { dets: [], nums: [], adjs: [], head: null, post: [], gens: [], preLits: [], lits: [], poss: null, dem: null, compounds: [] }; }

    function parseNP(j, inPP, isGen) {
      const np = emptyNP(); np.start = j; np.isGen = !!isGen;
      // pre-head
      while (j < items.length) {
        const it = items[j], a = it.a;
        if (it.kind === 'NUMLIT') { np.nums.push(it.text); j++; if (A(j) && A(j).pos === 'F' && A(j).lemma === 'de') j++; continue; }
        if (it.kind === 'ORDN') { np.dets.push(it.en); j++; continue; }
        if (!a) break;
        if (a.pos === 'F' && /^(DET|DEM|QUANT|ORD|NUM|DETGEN|DEMGEN|CEL|UNUL)$/.test(a.tag)) {
          if (a.tag === 'NUM') np.nums.push(a.en); else if (a.tag === 'UNUL') np.dets.push('a'); else np.dets.push(a.en);
          if (a.tag === 'CEL' || a.tag === 'UNUL') { np.cel = true; np.celPl = /^(cei|cele)$/.test(a.lemma); }
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
          if (it.hex || it.time || it.ident || (it.quoted || a && a.quoted) && np.head && np.head.lemma && WORDLIKE.has(np.head.lemma)) np.lits.push(txt); else np.preLits.push(txt);
          if (it.time && np.head && np.head.lemma === 'ora') np.timeOnly = true;
          j++; continue;
        }
        if (it.kind === 'NUMLIT' && np.head && !(A(j + 1) && A(j + 1).pos === 'N')) { np.lits.push(it.text); np.numLabel = true; j++; continue; }
        if (!a) break;
        if (a.pos === 'A') {
          if (np.isGen && np.head && np.head.feats && a.feats && a.feats.num && np.head.feats.num && a.feats.num !== np.head.feats.num && !np.head.feats.alsoPl) break;
          (np.head ? np.post : np.adjs).push(a); j++; continue;
        }
        if (a.pos === 'V' && a.feats.includes && a.feats.includes('part') && (a.feats.includes('adj') || !a.feats.includes('imp'))) { (np.head ? np.post : np.adjs).push(np.head ? { en: enInflect(a.en, 'part'), part: true } : enInflect(a.en, 'part')); j++; continue; }
        if (!np.head && np.cel && a.pos === 'F' && a.lemma === 'de' && A(j + 1) && A(j + 1).pos === 'N') { np.compounds.push(nounEn(A(j + 1), false)); j += 2; continue; }
        if (!np.head) break;
        if (a.pos === 'F' && a.tag === 'POSS') { np.poss = a.en; j++; continue; }
        if (a.pos === 'F' && a.tag === 'DEM') { np.dem = a.en; j++; continue; }
        if (a.pos === 'F' && a.lemma === 'de' && a.lang === 'ro' && np.head.pos === 'N' && items[j + 1] && (items[j + 1].kind === 'NUMLIT' || A(j + 1) && A(j + 1).pos === 'F' && A(j + 1).tag === 'NUM')) {
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
        if (a.pos === 'N' && a.feats.gen === true) { const g = parseNP(j, false, true); np.gens.push({ of: 'of', np: g }); j = g.end; continue; }
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
      if (np.timeOnly) return np.lits.slice();
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
      else if (np.cel && (np.adjs.length || np.post.length || np.compounds.length)) w.push(np.celPl ? 'ones' : 'one');
      if (!head && np.othersPl && w.length && w[w.length - 1] === 'the other') w[w.length - 1] = 'the others';
      w.push(...np.lits);
      if (predicative) for (const p of np.post) w.push(p.en);
      for (const g of np.gens) { if (g.of) w.push(g.of); w.push(...renderNP(g.np, { addThe: !g.np.bare })); }
      return w;
    }

    function prepEn(a, k) {
      if (a.lang && a.lang !== 'ro') {
        if (a.en === 'of' && lastVerb) {
          const nx = items[k + 1], u = A(k + 2);
          const unitAfter = u && u.pos === 'N' && /^(pixels?|degrees?|percent|points?|seconds?|milliseconds?)$/.test(u.en);
          if (nx && (nx.kind === 'NUMLIT' && (/(px|%|°|deg)$/.test(nx.text) || unitAfter) || nx.a && nx.a.tag === 'NUM' && unitAfter) && !(A(k - 1) && A(k - 1).pos === 'N' && !/^(move|rotate|increase|decrease|reduce|shift|scale|enlarge|delay)$/.test(lastVerbEn || ''))) return 'by';
        }
        return a.en && a.en !== '·' ? a.en : null;
      }
      const nx = items[k + 1], na = nx && nx.a;
      const prevA = A(k - 1);
      const nxNum = nx && (nx.kind === 'NUMLIT' || na && na.pos === 'F' && na.tag === 'NUM');
      const nxLemma = na ? na.lemma : '';
      switch (a.lemma) {
        case 'de':
          if (prevA && prevA.pos === 'F' && prevA.tag === 'NUM' || K(k - 1) === 'NUMLIT') return null;
          if (nxNum && A(k + 2) && A(k + 2).lemma === 'oara') return null; // de 3 ori -> 3 times
          if (prevA && prevA.pos === 'A' && /er$/.test(prevA.en)) return 'than';
          if (lastVerb && LINK_VERBS.has(lastVerb)) return 'to';
          if (na && na.pos === 'F' && na.tag === 'ADV') return 'from';
          return 'of';
        case 'la': {
          const unitAfter = A(k + 2) && A(k + 2).pos === 'N' ? A(k + 2).lemma : '';
          if (nxNum && /^(secunda|milisecunda|minut|ora)$/.test(unitAfter) && !(lastVerb && SET_VERBS.has(lastVerb))) return 'at';
          if (nx && nx.kind === 'NUMLIT' && /s$/.test(nx.text) && !(lastVerb && SET_VERBS.has(lastVerb))) return 'at';
          if (nxNum) return 'to';
          if (na && AT_NOUNS.has(nxLemma)) return 'at';
          if (na && /^(clic|click|hover|incarcare|deschidere|apasare)$/.test(nxLemma)) return 'on';
          return 'to';
        }
        case 'in':
          if (nxNum) return 'in';
          if (lastVerb && INTO_VERBS.has(lastVerb)) return 'into';
          if (lastVerb && /^(exporta|salva|descarca|converti|schimba|traduce|seta|modifica|muta|deplasa|redenumi|trimite|copia)$/.test(lastVerb)) return 'to';
          return 'in';
        case 'pe':
          if (na && (na.pos === 'F' && /^(PRON|CEL|UNUL)$/.test(na.tag) || isLabelLit(na) && nx.cap)) return null;
          if (na && na.pos === 'F' && /^(QUANT|DEM)$/.test(na.tag) && prevA && (prevA.pos === 'V' || prevA.pos === 'F' && prevA.tag === 'POSTCLITIC') && !(A(k + 2) && A(k + 2).pos === 'N')) return null;
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

    function renderVerb(k, force3sg) {
      const it = items[k], a = it.a;
      const key = strip(it.text);
      let words = [];
      let form = 'base';
      const feats = Array.isArray(a.feats) ? a.feats : [];
      if (PERSON_VERB[key] && !a.mwe && a.lang === 'ro') {
        let s = PERSON_VERB[key];
        if (negPending) { s = s.replace(/^can I$/, "can't I").replace(/^can you$/, "can't you").replace(/^I want$/, "I don't want").replace(/^need to$/, "don't need to"); negPending = false; }
        words.push(s);
        modalPrev = /can|need/.test(s); wantPrev = /want/.test(s);
        lastVerb = a.lemma;
        return words;
      }
      if (a.lemma === 'fi' && !a.mwe && a.lang === 'ro') {
        const be = { sunt: 'are', este: 'is', e: 'is', esti: 'are', suntem: 'are', sunteti: 'are', fie: 'be', fi: 'be', fost: 'been', fii: 'be' }[key] || 'is';
        words.push(be); if (negPending) { words.push('not'); negPending = false; }
        lastVerb = 'fi'; qPrev = null; return words;
      }
      if (a.lemma === 'avea' && !a.mwe && a.lang === 'ro') {
        const nxa = A(k + 1);
        if (nxa && nxa.pos === 'V' && nxa.feats.includes && nxa.feats.includes('part')) {
          auxHave = { am: 'I have', ai: 'you have', a: 'has', au: 'have', ati: 'you have', avem: 'we have' }[key] || 'have';
          return [];
        }
        words.push({ am: 'I have', ai: 'you have', are: 'has', au: 'have', avem: 'we have', aveti: 'you have' }[key] || 'have');
        lastVerb = 'avea'; return words;
      }
      const modalEn = /^(can|must|should|will|would|could)$/.test(a.en);
      if (auxHave) { words.push(auxHave); form = 'part'; auxHave = null; }
      else if (qPrev === 'who' && feats.includes('3sg')) form = '3sg';
      else if (feats.includes('ger') && !feats.includes('imp')) form = 'ing';
      else if (force3sg || subjectSeen && !subjectNot3 && !qPrev && feats.includes('3sg') && !modalPrev && !wantPrev && !futPending && !modalEn) form = '3sg';
      if (negPending) {
        if (form === '3sg') { words.push("doesn't"); form = 'base'; }
        else words.push("don't");
        negPending = false;
      }
      if (qPrev && /^(how|where|why)$/.test(qPrev) && form === 'base' && !modalPrev && !modalEn) words.push('do I');
      words.push(form === 'base' ? a.en : enInflect(a.en, form));
      modalPrev = modalEn; wantPrev = false; futPending = false; qPrev = null;
      lastVerb = a.lemma; lastVerbEn = a.en;
      // clitic doubling "nu le modifica pe cele..." -> drop the clitic
      if (A(k + 1) && A(k + 1).pos === 'F' && A(k + 1).lemma === 'pe') pendingPreClitics = [];
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
      if (tg === 'V' && a.lang === 'ro' && (a.lemma === 'da' || a.lemma === 'face') && !a.mwe) {
        let j = i + 1;
        while (A(j) && A(j).pos === 'F' && A(j).tag === 'POSTCLITIC') j++;
        if (A(j) && A(j).pos === 'F' && A(j).tag === 'DET') j++;
        const xIt = items[j], xv = xIt && xIt.kind === 'W' ? (surf.get(strip(xIt.text)) || []).find(x => x.lang === 'en' && x.pos === 'V') : null;
        if (xv) {
          if (negPending) { out.push("don't"); negPending = false; }
          out.push(xv.en); lastVerb = xv.lemma; lastVerbEn = xv.en; lastVerbIdx = out.length - 1;
          i = j + 1;
          if (A(i) && A(i).pos === 'F' && /^(la|pe)$/.test(A(i).lemma) && A(i).lang === 'ro') i++; // object marker
          continue;
        }
      }
      if (tg === 'V') {
        // subordinate clause with verb-subject order: "înainte să apară logo-ul" -> before the logo appears
        if (ctxClause && ctxClause.sub && !lastVerb && !subjectSeen && Array.isArray(a.feats) && (a.feats.includes('subj') || a.feats.includes('3sg') || a.feats.includes('fin')) && A(i + 1) && A(i + 1).pos === 'N' && A(i + 1).feats.def) {
          const np = parseNP(i + 1, false);
          out.push(...renderNP(np, {}));
          subjectSeen = true;
          const vw = renderVerb(i, true); out.push(...vw);
          i = np.end; continue;
        }
        if (modalPrev && /possible/.test(out[out.length - 1] || '')) out.push('to');
        const vw = renderVerb(i); lastVerbIdx = out.length + vw.length - 1; out.push(...vw); i++;
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
      if (tg === 'N' || tg === 'LIT' || /^(DET|DEM|QUANT|ORD|NUM|DETGEN|DEMGEN|CEL|UNUL)$/.test(tg) || (tg === 'A' && (A(i + 1) && A(i + 1).pos === 'N'))) {
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
      if (tg === 'GENART') { if (!(A(i + 1) && A(i + 1).pos === 'V')) out.push('of'); i++; continue; }
      if (tg === 'GENPRON') { out.push('its'); i++; continue; }
      if (tg === 'PART') { // să
        const lastOut = out[out.length - 1];
        if (lastVerb && /^(pune|lasa)$/.test(lastVerb) && lastVerbIdx >= 0) { out[lastVerbIdx] = lastVerb === 'pune' ? 'make' : 'let'; i++; continue; }
        if (!lastVerb && subjectSeen && out.length) { out.push('should'); modalPrev = true; i++; continue; }
        const drop = modalPrev || out.length === 0 || /^(how to|should|will)$/.test(lastOut || '') || (lastVerb && /^(face|lasa)$/.test(lastVerb)) || lastVerbEn === 'make';
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
      if (tg === 'PRON') {
        if (qPrev && /^(how|where|why)$/.test(qPrev) && a.en === 'I' && A(i + 1) && A(i + 1).pos === 'V') { out.push('do'); qPrev = null; }
        out.push(a.en); subjectSeen = true; subjectNot3 = /^(I|we|you|they)$/.test(a.en); i++; continue;
      }
      if (tg === 'Q') {
        const pa = A(i - 1);
        if (a.lemma === 'care' && pa && (pa.pos === 'N' || pa.pos === 'LIT')) { out.push('that'); subjectSeen = true; lastVerb = null; i++; continue; }
        out.push(a.en); qPrev = a.en; i++; continue;
      }
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

  const RUNTIME = ['chrome', 'strict', 'minSim', 'confidentSim', 'maxSuggestions', 'maxEdits', 'longWord', 'minCorrectLength', 'firstLetterUntil', 'wEd', 'wLen', 'wLang', 'chromeMonitor'];
  return {
    /** Translate with VSA only (synchronous). */
    translate, translateSync: translate,
    /** Translate honouring the `chrome` setting (may call Chrome's on-device Translator API). */
    translateAsync,
    /** Spell check against the vocabulary: per-word status, errors with suggestions, corrected source text. */
    spellcheck,
    translateNaive, tokenize, prepareChrome, chromeAvailable,
    /** Change runtime settings: chrome, strict, minSim, confidentSim, maxSuggestions. */
    setOptions(o) { for (const k of RUNTIME) if (o && k in o) opts[k] = o[k]; return this; },
    get options() { const o = {}; for (const k of RUNTIME.concat(['D', 'target', 'english'])) o[k] = opts[k]; return o; },
    get languages() { return langs.slice(); },
    /** true if the word (any inflected form) is in the vocabulary */
    knows(word) { return surf.has(strip(word)); },
    warmup() { ensureMemory(); return memoryMs; },
    /** hypervector of a (normalised) word, and its similarity to another word: for visualisation */
    encode(word) { return encodeWord(strip(word)); },
    similarity(a, b) { return HD.sim(encodeWord(strip(a)), encodeWord(strip(b))); },
    get info() { return { D: opts.D, languages: langs.slice(), dictionaries: dictInfo.slice(), forms: surf.size, itemMemory: itemVecs.length, phrases: MWES.length, lexiconMs: Math.round(buildMs), memoryMs }; },
    _cleanup: cleanup, _spell: spell,
  };
}

const API = { createTranslator, strip, osa, DEFAULTS };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.VSATranslateEngine = API;
})(typeof window !== 'undefined' ? window : globalThis);
