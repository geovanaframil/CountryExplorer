import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  output,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';
import { Country } from '../../core/services/country';
import { ClickSoundService } from '../../core/services/click-sound.service';
import { REGIONS, type Region } from '../../core/types/country.types';
import type { CountryListItem } from '../../core/types/country.types';
import { DropdownComponent, type DropdownOption } from '../../ui/dropdown/dropdown.component';

const CHUNK_SIZE = 24;

@Component({
  selector: 'app-country-list-modal-content',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './country-list-modal-content.html',
  styleUrl: './country-list-modal-content.scss',
})
export class CountryListModalContent implements OnInit, OnDestroy {
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;
  protected readonly REGIONS = REGIONS;
  readonly countrySelected = output<string>();

  protected readonly regionOptions: DropdownOption[] = [
    { value: '', label: 'Todas as regiões' },
    ...REGIONS.map((r) => ({ value: r, label: r })),
  ];

  protected readonly allCountries = signal<CountryListItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly regionFilter = signal<Region | ''>('');
  /** Quantidade de itens a exibir (lazy loading) */
  protected readonly displayedCount = signal(CHUNK_SIZE);

  protected readonly filteredCountries = computed(() => {
    const list = this.allCountries();
    const term = this.searchTerm().toLowerCase().trim();
    const region = this.regionFilter();
    if (!term && !region) return list;
    return list.filter((c) => {
      const matchName =
        !term ||
        c.name.common.toLowerCase().includes(term) ||
        c.name.official.toLowerCase().includes(term);
      const matchRegion = !region || c.region === region;
      return matchName && matchRegion;
    });
  });

  protected readonly visibleCountries = computed(() =>
    this.filteredCountries().slice(0, this.displayedCount())
  );

  protected readonly hasMore = computed(
    () =>
      this.visibleCountries().length < this.filteredCountries().length
  );

  protected readonly hasError = computed(() => !!this.error());
  protected readonly isEmpty = computed(
    () =>
      !this.loading() &&
      this.filteredCountries().length === 0 &&
      !this.error()
  );

  private readonly searchInput$ = new Subject<string>();
  private subscription: Subscription | null = null;
  private scrollSubscription: Subscription | null = null;

  protected readonly scrollContainer = viewChild<ElementRef<HTMLElement>>(
    'scrollContainer'
  );
  protected readonly loadMoreSentinel = viewChild<ElementRef<HTMLElement>>(
    'loadMoreSentinel'
  );

  private intersectionObserver: IntersectionObserver | null = null;

  constructor(
    private readonly country: Country,
    private readonly clickSound: ClickSoundService
  ) {
    effect(() => {
      const sentinel = this.loadMoreSentinel()?.nativeElement;
      const hasMore = this.hasMore();
      if (!sentinel || !hasMore) return;
      this.intersectionObserver?.disconnect();
      const scrollEl = this.scrollContainer()?.nativeElement ?? null;
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && this.hasMore()) {
            this.displayedCount.update((n) =>
              Math.min(n + CHUNK_SIZE, this.filteredCountries().length)
            );
          }
        },
        { root: scrollEl, rootMargin: '100px', threshold: 0 }
      );
      this.intersectionObserver.observe(sentinel);
      return () => this.intersectionObserver?.disconnect();
    });
  }

  ngOnInit(): void {
    this.subscription = this.searchInput$
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.displayedCount.set(CHUNK_SIZE);
      });
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.scrollSubscription?.unsubscribe();
    this.intersectionObserver?.disconnect();
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value.trim());
  }

  onRegionChange(region: string): void {
    this.regionFilter.set((region || '') as Region | '');
    this.displayedCount.set(CHUNK_SIZE);
  }

  onCountryCardMouseEnter(): void {
    this.clickSound.playToc();
  }

  selectCountry(code: string): void {
    this.countrySelected.emit(code);
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);
    this.country.getCountries().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.error) {
          this.error.set(res.error);
          this.allCountries.set([]);
          return;
        }
        this.allCountries.set(res.data ?? []);
        this.displayedCount.set(CHUNK_SIZE);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao carregar países.');
        this.allCountries.set([]);
      },
    });
  }

  onScroll(): void {
    const el = this.scrollContainer()?.nativeElement;
    if (!el || !this.hasMore()) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const threshold = 120;
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      this.displayedCount.update((n) =>
        Math.min(n + CHUNK_SIZE, this.filteredCountries().length)
      );
    }
  }
}
