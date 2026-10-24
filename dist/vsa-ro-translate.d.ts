export interface TranslateStats { exact: number; vsa: number; unknown: number; vsaLog: string[] }
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
