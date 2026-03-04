import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Country } from '../../core/services/country';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';
import type { CountryDetail as CountryDetailType } from '../../core/types/country.types';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.scss',
})
export class CountryDetail implements OnInit {
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;

  protected readonly country = signal<CountryDetailType | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly hasError = computed(() => !!this.error());
  protected readonly hasCountry = computed(() => !!this.country());

  constructor(
    private readonly route: ActivatedRoute,
    private readonly countryService: Country
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (!code) {
      this.loading.set(false);
      this.error.set('Código do país não informado.');
      return;
    }
    this.countryService.getByCode(code).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.error) {
          this.error.set(res.error);
          this.country.set(null);
          return;
        }
        this.country.set(res.data ?? null);
        if (!res.data) {
          this.error.set('País não encontrado.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao carregar o país.');
        this.country.set(null);
      },
    });
  }

  /** Moedas formatadas (nome + código). */
  formatCurrencies(currencies: Record<string, { name: string; symbol?: string }> | undefined): string {
    if (!currencies) return '—';
    return Object.entries(currencies)
      .map(([code, info]) => `${info.name} (${code})`)
      .join(', ');
  }

  /** Idiomas em lista. */
  formatLanguages(languages: Record<string, string> | undefined): string {
    if (!languages) return '—';
    return Object.values(languages).join(', ');
  }
}
