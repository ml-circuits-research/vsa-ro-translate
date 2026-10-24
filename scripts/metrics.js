// Evaluation metrics shared by the Node eval and the demo page.
// chrF follows sacreBLEU defaults (char n-grams 1..6, beta = 2, whitespace removed, corpus-level statistics).
(function (root) {
  function ngrams(s, n) { const m = new Map(); for (let i = 0; i + n <= s.length; i++) { const g = s.substr(i, n); m.set(g, (m.get(g) || 0) + 1); } return m; }
  function chrfCorpus(hyps, refs, N = 6, beta = 2) {
    const st = []; for (let n = 1; n <= N; n++) st.push({ match: 0, hyp: 0, ref: 0 });
    for (let k = 0; k < hyps.length; k++) {
      const h = hyps[k].replace(/\s+/g, ''), r = refs[k].replace(/\s+/g, '');
      for (let n = 1; n <= N; n++) {
        const hg = ngrams(h, n), rg = ngrams(r, n); let m = 0, th = 0, tr = 0;
        for (const [g, c] of hg) { th += c; if (rg.has(g)) m += Math.min(c, rg.get(g)); }
        for (const c of rg.values()) tr += c;
        st[n - 1].match += m; st[n - 1].hyp += th; st[n - 1].ref += tr;
      }
    }
    let P = 0, R = 0, eff = 0;
    for (const s of st) { if (s.hyp > 0 && s.ref > 0) { P += s.match / s.hyp; R += s.match / s.ref; eff++; } }
    if (!eff) return 0; P /= eff; R /= eff;
    if (P + R === 0) return 0;
    return 100 * (1 + beta * beta) * P * R / (beta * beta * P + R);
  }
  function norm(s) { return ' ' + s.toLowerCase().replace(/[^a-z0-9#%"\- ]/g, ' ') + ' '; }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function slotOk(out, group) { const o = norm(out); return group.some(alt => new RegExp('(?<![a-z0-9])' + esc(alt.toLowerCase().trim()) + '(?![a-z0-9])').test(o)); }
  function slotRecall(out, keys) { return keys.filter(g => slotOk(out, g)).length / keys.length; }
  const API = { chrfCorpus, slotOk, slotRecall };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.VSAMetrics = API;
})(typeof window !== 'undefined' ? window : globalThis);
