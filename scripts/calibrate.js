// Calibrate VSA cleanup threshold: genuine typo/inflection variants vs. out-of-lexicon words
const L = require('../src/lexicon-ro-en.js');
const { createTranslator, strip } = require('../src/vsa-ro-en.js');
const D = +(process.env.D || 2048);
const T = createTranslator(L, { D, ngrams: JSON.parse(process.env.NG||"[2,3]"), stemWeight: +(process.env.SW||1), firstLetter: process.env.FL!=="0" });
// gather lexicon surface forms by lemma via a lightweight re-parse
const forms = [];
for (const line of L.NOUNS.split('\n').map(s=>s.trim()).filter(Boolean)) { const [lem,pl]=line.split('|'); forms.push([strip(lem),strip(lem)]); if(pl) forms.push([strip(pl),strip(lem)]); }
for (const line of L.VERBS.split('\n').map(s=>s.trim()).filter(Boolean)) { const [inf,,,ex]=line.split('|'); forms.push([strip(inf),strip(inf)]); if(ex) for(const f of ex.split(',')) forms.push([strip(f),strip(inf)]); }
let seed=7; const rnd=()=>{seed^=seed<<13;seed>>>=0;seed^=seed>>>17;seed^=seed<<5;seed>>>=0;return seed/4294967296;};
const abc='abcdefghijklmnoprstuvz';
function typo(w){const i=1+Math.floor(rnd()*(w.length-2));const t=Math.floor(rnd()*4);
 if(t===0)return w.slice(0,i)+w.slice(i+1); if(t===1)return w.slice(0,i)+abc[Math.floor(rnd()*abc.length)]+w.slice(i+1);
 if(t===2)return w.slice(0,i)+w[i+1]+w[i]+w.slice(i+2); return w.slice(0,i)+abc[Math.floor(rnd()*abc.length)]+w.slice(i);}
const lemmaOf = new Map(forms.map(([f,l])=>[f,l]));
const gen=[]; 
for (let k=0;k<600;k++){const [f,l]=forms[Math.floor(rnd()*forms.length)]; if(f.length<5)continue; const v=typo(f); if(lemmaOf.has(v))continue; const c=T._cleanup(v); gen.push({v,f,best:c.key,sim:c.sim,margin:c.margin,ok:c.key&&(c.key.startsWith(l.slice(0,Math.max(3,l.length-3)))||lemmaOf.get(c.key)===l)});}
const impost=('marketing beneficiar original financiar resurse umane vanzari angajat furnizare evaluare strategic bugetul trimestru ' +
 'pipeline deploy commit merge branch figma notion jira slack teams sharepoint confluence dropdown tooltip sidebar navbar breadcrumb ' +
 'ease-in-out cubic bezier spring overshoot keyframes opacity scale translate rotate skew ' +
 'gheorghe ionescu bucuresti cluj timisoara brasov aprobat manager director contabilitate juridic achizitii logistica productie ' +
 'calatorie vacanta mancare masina pisica caine copac munte apa soare ploaie zapada ' +
 'algoritm retea neuronala vector simbolic hiperdimensional').split(/\s+/).filter(w=>w.length>=4 && !lemmaOf.has(strip(w)));
const imp = impost.map(w=>{const c=T._cleanup(strip(w)); return {v:w,best:c.key,sim:c.sim,margin:c.margin};});
function lenOK(a,b){const r=a.length/b.length; return r>=0.75&&r<=1.33;}
for (const thr of [0.62,0.64,0.66,0.68,0.70,0.72,0.75]) {
  const acc = gen.filter(g=>g.sim>=thr && lenOK(g.v,g.best));
  const correct = acc.filter(g=>g.ok).length;
  const fp = imp.filter(g=>g.sim>=thr && lenOK(g.v,g.best)).length;
  console.log(`thr ${thr}: typos accepted ${acc.length}/${gen.length} (correct ${correct}, wrong ${acc.length-correct}) | out-of-lexicon false matches ${fp}/${imp.length}`);
}
console.log('impostors sorted:', imp.sort((a,b)=>b.sim-a.sim).slice(0,12).map(x=>`${x.v}->${x.best} ${x.sim.toFixed(2)}`).join(', '));
