#!/usr/bin/env node
// Builds dist/ (UMD, ESM, minified) and the self-contained demo page docs/index.html.
// Usage: node scripts/build.js            (terser is optional: set TERSER_PATH or have it installed)
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s); };

const lex = read('src/lexicon-ro-en.js');
const enDict = read('src/dict-en.js');
const engine = read('src/vsa-translate.js');
const banner = `/*! vsa-ro-translate v${pkg.version} | Romanian (and any language you give a dictionary for) -> English command translation and spell checking with a hyperdimensional (VSA) lexicon | MIT | https://github.com/ml-circuits-research/vsa-ro-translate */\n`;

const core = `
  var LEX = (function () { var module = { exports: {} }; ${lex}
  ; return module.exports; })();
  var EN = (function () { var module = { exports: {} }; ${enDict}
  ; return module.exports; })();
  var ENGINE = (function () { var module = { exports: {} }; ${engine}
  ; return module.exports; })();
  var RO = Object.assign({ lang: 'ro', name: 'ro-builtin' }, LEX);
  /** Built-in dictionaries. Add more (e.g. dictionaries/fr.js registers dictionaries.fr). */
  var dictionaries = { ro: RO, en: EN };
  var _default = null;
  /**
   * Create a translator. options.dictionaries is the vocabulary: any number of dictionaries, any languages.
   * Default: [dictionaries.ro, dictionaries.en]. Other options: chrome ('never'|'fallback'|'prefer'), strict, D, minSim...
   */
  function create(opts) {
    opts = Object.assign({}, opts || {});
    if (!opts.dictionaries) opts.dictionaries = [dictionaries.ro, dictionaries.en];
    return ENGINE.createTranslator(opts);
  }
  function getDefault() { return _default || (_default = create()); }
  var api = {
    version: '${pkg.version}',
    /** Translate with the default translator (Romanian + English vocabulary). Returns a string. */
    translate: function (text) { return getDefault().translate(text).text; },
    /** Translate and return { text, ok, errors, corrections, language, confident, engine, source, ms, stats }. */
    translateDetailed: function (text) { return getDefault().translate(text); },
    /** Spell check against the vocabulary. */
    spellcheck: function (text) { return getDefault().spellcheck(text); },
    /** Word-by-word dictionary baseline (same lexicon, no VSA, no reordering). */
    translateNaive: function (text) { return getDefault().translateNaive(text); },
    /** Build the hypervector item memory now (otherwise built on first unknown word). Returns ms. */
    warmup: function () { return getDefault().warmup(); },
    create: create,
    dictionaries: dictionaries,
    defaults: ENGINE.DEFAULTS,
    info: function () { return getDefault().info; },
    /** hypervector (Uint32Array) of a word, for visualisation. */
    encode: function (w) { return getDefault().encode(w); },
    similarity: function (a, b) { return getDefault().similarity(a, b); },
    lexicon: LEX,
    strip: ENGINE.strip
  };
`;

const umd = banner + `(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else { root.VSARoTranslate = factory(); root.VSATranslate = root.VSARoTranslate; }
})(typeof self !== 'undefined' ? self : this, function () {
${core}
  return api;
});
`;
const esm = banner + `${core}
export default api;
export const translate = api.translate;
export const translateDetailed = api.translateDetailed;
export const translateNaive = api.translateNaive;
export const warmup = api.warmup;
export const spellcheck = api.spellcheck;
export const dictionaries = api.dictionaries;
export { create };
export const version = api.version;
`;
write('dist/vsa-ro-translate.js', umd);
write('dist/vsa-ro-translate.mjs', esm);
write('dist/vsa-ro-translate.d.ts', `/** A vocabulary for one source language. All fields are optional except lang and at least one word list. */
export interface Dictionary {
  lang: string;                    // BCP 47 code of the source language: 'ro', 'fr', 'it', ...
  name?: string;
  morphology?: 'ro' | 'none';      // 'ro' generates Romanian inflections; default 'ro' for lang 'ro', else 'none'
  /** simplest form: word -> English, or word -> { en, pos: 'n'|'v'|'adj'|'adv', plural, gender, forms, enPlural } */
  words?: Record<string, string | { en: string; pos?: string; plural?: string; gender?: string; forms?: string[]; enPlural?: string; tag?: string }> | Array<[string, string, string?]>;
  /** structured lines (same columns as the built-in lexicon) */
  nouns?: string[] | string;       // 'singular|plural|gender|english'
  verbs?: string[] | string;       // 'infinitive|class|english|form,form,...'
  adjectives?: string[] | string;  // 'm|f|mpl|fpl|english'  or  'word|english'
  functionWords?: string[] | string; // 'word|english|TAG'  TAG: DET DEM POSS QUANT ORD NUM PRON CLITIC PREP CONJ ADV NEG Q AUX INTJ
  phrases?: Record<string, string | [string, string]> | string; // 'zone de texte': 'text box'  or 'src => english | TAG' lines
  senses?: Record<string, Array<[string, string]>>;            // lemma -> [[english, 'context words ...'], ...]
}
export interface WordError { word: string; start: number; end: number; message: string; suggestions: { word: string; sim: number; edits: number; lang: string }[] }
export interface Correction { word: string; to: string; start: number; end: number; sim: number; edits: number; lang: string }
export interface Result {
  text: string | null;            // English (null in strict mode when a word is outside the vocabulary)
  ok: boolean;                    // every word is in the vocabulary (or was corrected to a word in it)
  errors: WordError[];
  corrections: Correction[];
  language: string;               // detected source language of the sentence
  confident: boolean;             // no errors and no weak corrections
  engine: 'vsa' | 'chrome';
  source: string;                 // source text with spelling corrections applied
  vsaText?: string; chromeError?: string; ms: number; stats: Record<string, unknown>;
}
export interface SpellResult { ok: boolean; text: string; language: string; errors: WordError[]; corrections: Correction[];
  tokens: { text: string; start: number; end: number; status: 'ok' | 'corrected' | 'unknown' | 'name'; lang: string | null; suggestion?: string; suggestions?: string[] }[]; ms: number }
export interface Options {
  dictionaries?: Dictionary[];
  chrome?: 'never' | 'fallback' | 'prefer';
  strict?: boolean;
  D?: number; minSim?: number; confidentSim?: number; maxSuggestions?: number; maxEdits?: number | 'auto' | 'loose';
  longWord?: number; minCorrectLength?: number; firstLetterUntil?: number; english?: 'auto' | false; chromeMonitor?: (m: EventTarget) => void;
}
export interface Translator {
  translate(text: string): Result;
  translateSync(text: string): Result;
  translateAsync(text: string, o?: { chrome?: Options['chrome'] }): Promise<Result>;
  spellcheck(text: string): SpellResult;
  translateNaive(text: string): string;
  prepareChrome(languages?: string[]): Promise<string[]>;
  chromeAvailable(): boolean;
  setOptions(o: Partial<Options>): Translator;
  knows(word: string): boolean;
  warmup(): number;
  readonly languages: string[];
  readonly options: Partial<Options>;
  readonly info: Record<string, unknown>;
}
declare const api: {
  version: string;
  translate(text: string): string;
  translateDetailed(text: string): Result;
  spellcheck(text: string): SpellResult;
  translateNaive(text: string): string;
  warmup(): number;
  create(opts?: Options): Translator;
  dictionaries: Record<string, Dictionary>;
  info(): Record<string, unknown>;
};
export default api;
export declare const translate: typeof api.translate;
export declare const translateDetailed: typeof api.translateDetailed;
export declare const spellcheck: typeof api.spellcheck;
export declare const translateNaive: typeof api.translateNaive;
export declare const warmup: typeof api.warmup;
export declare const create: typeof api.create;
export declare const dictionaries: typeof api.dictionaries;
export declare const version: string;
`);

(async () => {
  let min = umd;
  try {
    const terser = require(process.env.TERSER_PATH || 'terser');
    const r = await terser.minify(umd, { compress: { passes: 2 }, mangle: true, format: { comments: /^!/ } });
    min = r.code;
  } catch (e) { console.warn('terser not available, dist/vsa-ro-translate.min.js = unminified (' + e.message + ')'); }
  write('dist/vsa-ro-translate.min.js', min);
  // extra dictionaries, loadable on their own
  for (const f of fs.readdirSync(path.join(root, 'dictionaries')).filter(f => f.endsWith('.js'))) write('dist/dictionaries/' + f, read('dictionaries/' + f));

  // ---- demo page: inline the bundle + evaluation data so the page is a single self-contained file
  const tpl = read('scripts/demo.html');
  const data = {
    version: pkg.version,
    dev: JSON.parse(read('eval/dev.json')),
    test1: JSON.parse(read('eval/test.json')),
    test2: fs.existsSync(path.join(root, 'eval/test2.json')) ? JSON.parse(read('eval/test2.json')) : [],
    results: fs.existsSync(path.join(root, 'eval/results.json')) ? JSON.parse(read('eval/results.json')) : null,
  };
  const body = tpl
    .replace('/*__BUNDLE__*/', () => min.replace(/<\/script/gi, '<\\/script'))
    .replace('/*__DICT_FR__*/', () => read('dictionaries/fr.js').replace(/<\/script/gi, '<\\/script'))
    .replace('/*__METRICS__*/', () => read('scripts/metrics.js').replace(/<\/script/gi, '<\\/script'))
    .replace('/*__DATA__*/', () => 'window.VSA_DEMO_DATA = ' + JSON.stringify(data).replace(/<\/script/gi, '<\\/script') + ';')
    .replace(/__VERSION__/g, pkg.version);
  if (process.env.BODY_OUT) fs.writeFileSync(process.env.BODY_OUT, body); // page body without a document skeleton (for embedding)
  write('docs/index.html', '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n' + body + '\n</body>\n</html>\n');
  const kb = f => (fs.statSync(path.join(root, f)).size / 1024).toFixed(1) + ' KB';
  console.log('built', ['dist/vsa-ro-translate.js', 'dist/vsa-ro-translate.min.js', 'dist/vsa-ro-translate.mjs', 'dist/dictionaries/fr.js', 'docs/index.html'].map(f => f + ' ' + kb(f)).join(', '));
})();
