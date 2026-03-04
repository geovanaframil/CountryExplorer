import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, of } from 'rxjs';
import { CountryApiService } from './country-api.service';
import type { CountryDetail, CountryListItem, Region } from '../types/country.types';

export interface CountryListResult {
  data: CountryListItem[] | null;
  error: string | null;
}

export interface CountryDetailResult {
  data: CountryDetail | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private readonly api: CountryApiService) {}

  /** Lista todos os países. */
  getCountries(): Observable<CountryListResult> {
    return from(this.api.getAll()).pipe(
      map((data) => ({ data, error: null })),
      catchError((err) =>
        of({
          data: null,
          error: this.messageFromError(err),
        })
      )
    );
  }

  /** Busca países por nome em tempo real. */
  searchByName(name: string): Observable<CountryListResult> {
    return from(this.api.getByName(name)).pipe(
      map((data) => ({ data, error: null })),
      catchError((err) => {
        if (err?.response?.status === 404) {
          return of({ data: [], error: null });
        }
        return of({
          data: null,
          error: this.messageFromError(err),
        });
      })
    );
  }

  /** Filtra países por região. */
  getByRegion(region: Region | ''): Observable<CountryListResult> {
    if (!region) return this.getCountries();
    return from(this.api.getByRegion(region)).pipe(
      map((data) => ({ data, error: null })),
      catchError((err) =>
        of({
          data: null,
          error: this.messageFromError(err),
        })
      )
    );
  }

  /** Um país por código (para página de detalhe). */
  getByCode(code: string): Observable<CountryDetailResult> {
    return from(this.api.getByCode(code)).pipe(
      map((data) => ({ data, error: null })),
      catchError((err) =>
        of({
          data: null,
          error: this.messageFromError(err),
        })
      )
    );
  }

  private messageFromError(err: unknown): string {
    if (err && typeof err === 'object' && 'message' in err) {
      return String((err as { message: string }).message);
    }
    return 'Ocorreu um erro ao carregar os dados. Tente novamente.';
  }
}
