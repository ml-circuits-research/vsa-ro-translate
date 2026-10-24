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
const engine = read('src/vsa-ro-en.js');
const banner = `/*! vsa-ro-translate v${pkg.version} | Romanian -> English command translator with a hyperdimensional (VSA) lexicon | MIT | https://github.com/ml-circuits-research/vsa-ro-translate */\n`;

const core = `
  var LEX = (function () { var module = { exports: {} }; ${lex}
  ; return module.exports; })();
  var ENGINE = (function () { var module = { exports: {} }; ${engine}
  ; return module.exports; })();
  var _default = null;
  function create(opts) { return ENGINE.createTranslator(LEX, opts); }
  function getDefault() { return _default || (_default = create()); }
  var api = {
    version: '${pkg.version}',
    /** Translate Romanian text to English. Returns a string. */
    translate: function (text) { return getDefault().translate(text).text; },
    /** Translate and return { text, ms, stats: { exact, vsa, unknown, vsaLog } }. */
    translateDetailed: function (text) { return getDefault().translate(text); },
    /** Word-by-word dictionary baseline (same lexicon, no VSA, no reordering). */
    translateNaive: function (text) { return getDefault().translateNaive(text); },
    /** Build the hypervector item memory now (otherwise built on first unknown word). Returns ms. */
    warmup: function () { return getDefault().warmup(); },
    /** Create an independent translator, e.g. create({ D: 4096, threshold: 0.72 }). */
    create: create,
    info: function () { return getDefault().info; },
    /** 2048-bit hypervector (Uint32Array) of a word, for visualisation. */
    encode: function (w) { return getDefault().encode(w); },
    similarity: function (a, b) { return getDefault().similarity(a, b); },
    lexicon: LEX,
    strip: ENGINE.strip
  };
`;

const umd = banner + `(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else root.VSARoTranslate = factory();
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
export { create };
export const version = api.version;
`;
write('dist/vsa-ro-translate.js', umd);
write('dist/vsa-ro-translate.mjs', esm);
write('dist/vsa-ro-translate.d.ts', `export interface TranslateStats { exact: number; vsa: number; unknown: number; vsaLog: string[] }
export interface Detailed { text: string; ms: number; stats: TranslateStats }
export interface Options { D?: number; threshold?: number; ngrams?: (number | 's')[]; firstLetter?: boolean }
export interface Translator { translate(text: string): Detailed; translateNaive(text: string): string; warmup(): number; readonly info: Record<string, unknown> }
declare const api: {
  version: string;
  translate(text: string): string;
  translateDetailed(text: string): Detailed;
  translateNaive(text: string): string;
  warmup(): number;
  create(opts?: Options): Translator;
  info(): Record<string, unknown>;
};
export default api;
export declare const translate: typeof api.translate;
export declare const translateDetailed: typeof api.translateDetailed;
export declare const translateNaive: typeof api.translateNaive;
export declare const warmup: typeof api.warmup;
export declare const create: typeof api.create;
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
    .replace('/*__METRICS__*/', () => read('scripts/metrics.js'))
    .replace('/*__DATA__*/', () => 'window.VSA_DEMO_DATA = ' + JSON.stringify(data).replace(/<\/script/gi, '<\\/script') + ';')
    .replace(/__VERSION__/g, pkg.version);
  if (process.env.BODY_OUT) fs.writeFileSync(process.env.BODY_OUT, body); // page body without a document skeleton (for embedding)
  write('docs/index.html', '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n' + body + '\n</body>\n</html>\n');
  const kb = f => (fs.statSync(path.join(root, f)).size / 1024).toFixed(1) + ' KB';
  console.log('built', ['dist/vsa-ro-translate.js', 'dist/vsa-ro-translate.min.js', 'dist/vsa-ro-translate.mjs', 'docs/index.html'].map(f => f + ' ' + kb(f)).join(', '));
})();
