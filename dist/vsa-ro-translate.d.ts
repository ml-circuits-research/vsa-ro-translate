/** A vocabulary for one source language. All fields are optional except lang and at least one word list. */
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
