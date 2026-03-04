import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';
import { Country } from '../../core/services/country';
import { REGIONS, type Region } from '../../core/types/country.types';
import type { CountryListItem } from '../../core/types/country.types';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './country-list.html',
  styleUrl: './country-list.scss',
})
export class CountryList implements OnInit, OnDestroy {
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;
  protected readonly REGIONS = REGIONS;

  protected readonly countries = signal<CountryListItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly regionFilter = signal<Region | ''>('');

  protected readonly hasError = computed(() => !!this.error());
  protected readonly isEmpty = computed(
    () => !this.loading() && this.countries().length === 0 && !this.error()
  );

  private readonly searchInput$ = new Subject<string>();
  private subscription: Subscription | null = null;

  constructor(private readonly country: Country) {}

  ngOnInit(): void {
    this.subscription = this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.load();
      });
    this.load();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value.trim());
  }

  onRegionChange(region: string): void {
    this.regionFilter.set((region || '') as Region | '');
    this.load();
  }

  load(): void {
    const term = this.searchTerm();
    const region = this.regionFilter();
    this.loading.set(true);
    this.error.set(null);

    const request = term
      ? this.country.searchByName(term)
      : region
        ? this.country.getByRegion(region)
        : this.country.getCountries();

    request.subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.error) {
          this.error.set(res.error);
          this.countries.set([]);
          return;
        }
        let list = res.data ?? [];
        if (term && region) {
          list = list.filter((c) => c.region === region);
        }
        this.countries.set(list);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao carregar países.');
        this.countries.set([]);
      },
    });
  }
}
