import { Injectable } from '@angular/core';
import axios, { type AxiosInstance } from 'axios';
import type { CountryDetail, CountryListItem } from '../types/country.types';

const BASE_URL = 'https://restcountries.com/v3.1';

/** Campos permitidos no endpoint /all (máx. 10). */
const LIST_FIELDS = [
  'name',
  'capital',
  'region',
  'subregion',
  'population',
  'flags',
  'cca2',
  'cca3',
].join(',');

@Injectable({
  providedIn: 'root',
})
export class CountryApiService {
  private readonly client: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { Accept: 'application/json' },
  });

  /** Todos os países (com campos limitados para lista). */
  async getAll(): Promise<CountryListItem[]> {
    const { data } = await this.client.get<CountryListItem[]>(
      `/all?fields=${LIST_FIELDS}`
    );
    return data;
  }

  /** Busca por nome (comum ou oficial). */
  async getByName(name: string): Promise<CountryListItem[]> {
    if (!name?.trim()) return this.getAll();
    const { data } = await this.client.get<CountryListItem[]>(
      `/name/${encodeURIComponent(name.trim())}`
    );
    return data;
  }

  /** Filtro por região (Africa, Americas, Asia, Europe, Oceania). */
  async getByRegion(region: string): Promise<CountryListItem[]> {
    if (!region?.trim()) return this.getAll();
    const { data } = await this.client.get<CountryListItem[]>(
      `/region/${encodeURIComponent(region.trim())}`
    );
    return data;
  }

  /** Um país por código (cca2, cca3, etc.) — resposta completa para detalhe. */
  async getByCode(code: string): Promise<CountryDetail | null> {
    if (!code?.trim()) return null;
    const { data } = await this.client.get<CountryDetail | CountryDetail[]>(
      `/alpha/${encodeURIComponent(code.trim())}`
    );
    const country = Array.isArray(data) ? data[0] : data;
    return country ?? null;
  }
}
