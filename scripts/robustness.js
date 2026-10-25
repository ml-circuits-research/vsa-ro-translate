// Robustness: same dev sentences (a) without diacritics, (b) with one typo in a content word
const L = require('../src/lexicon-ro-en.js'), EN = require('../src/dict-en.js');
const { createTranslator, strip } = require('../src/vsa-translate.js');
const T = createTranslator({ dictionaries: [Object.assign({ lang: 'ro' }, L), EN] });
const set = require(process.argv[2] || '../eval/dev.json').map(x => Array.isArray(x) ? x[0] : x.ro);
const noDia = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
let seed = 11; const rnd = () => { seed ^= seed << 13; seed >>>= 0; seed ^= seed >>> 17; seed ^= seed << 5; seed >>>= 0; return seed / 4294967296; };
function typo(s) { const ws = s.split(' '); const idx = ws.map((w, i) => [w, i]).filter(([w]) => /^[a-zăâîșț]{6,}$/i.test(w)); if (!idx.length) return s;
  const [w, i] = idx[Math.floor(rnd() * idx.length)]; const k = 2 + Math.floor(rnd() * (w.length - 3)); ws[i] = w.slice(0, k) + w[k + 1] + w[k] + w.slice(k + 2); return ws.join(' '); }
let same = 0, sameT = 0, sameN = 0, sameNT = 0;
for (const ro of set) {
  const base = T.translate(ro).text, nb = T.translateNaive(ro);
  const a = T.translate(noDia(ro)).text, ty = typo(noDia(ro)), b = T.translate(ty).text;
  if (a === base) same++; if (b === base) sameT++;
  if (T.translateNaive(noDia(ro)) === nb) sameN++; if (T.translateNaive(ty) === nb) sameNT++;
  if (b !== base && process.env.V) console.log('TYPO', ty, '\n  ', b, '\n  ', base);
}
console.log(`VSA   : identical output without diacritics ${same}/${set.length}, with diacritics stripped + 1 typo ${sameT}/${set.length}`);
console.log(`naive : identical output without diacritics ${sameN}/${set.length}, with diacritics stripped + 1 typo ${sameNT}/${set.length}`);
