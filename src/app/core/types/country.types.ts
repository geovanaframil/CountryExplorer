/**
 * Tipos baseados na API REST Countries v3.1
 * @see https://restcountries.com/
 */

export interface CountryName {
  common: string;
  official: string;
  nativeName?: Record<string, { official: string; common: string }>;
}

export interface CountryFlags {
  png: string;
  svg: string;
  alt?: string;
}

export interface CurrencyInfo {
  name: string;
  symbol?: string;
}

export type Currencies = Record<string, CurrencyInfo>;
export type Languages = Record<string, string>;

/** Campos mínimos para item da lista (endpoint /all com fields) */
export interface CountryListItem {
  name: CountryName;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  flags: CountryFlags;
  cca2: string;
  cca3: string;
}

/** Resposta completa do endpoint /alpha/{code} para detalhe */
export interface CountryDetail extends CountryListItem {
  capital?: string[];
  subregion?: string;
  tld?: string[];
  currencies?: Currencies;
  languages?: Languages;
  borders?: string[];
  latlng?: [number, number];
  area?: number;
  timezones?: string[];
  demonyms?: Record<string, { f: string; m: string }>;
  independent?: boolean;
  unMember?: boolean;
  capitalInfo?: { latlng?: [number, number] };
}

export const REGIONS = [
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania',
] as const;

export type Region = (typeof REGIONS)[number];
