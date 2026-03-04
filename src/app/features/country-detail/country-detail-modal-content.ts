import { CommonModule } from '@angular/common';
import { Component, input, output, signal, computed, effect } from '@angular/core';
import { Country } from '../../core/services/country';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';
import type { CountryDetail as CountryDetailType } from '../../core/types/country.types';

@Component({
  selector: 'app-country-detail-modal-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-detail-modal-content.html',
  styleUrl: './country-detail-modal-content.scss',
})
export class CountryDetailModalContent {
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;

  readonly code = input.required<string>();
  readonly titleChange = output<string>();

  protected readonly country = signal<CountryDetailType | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly hasError = computed(() => !!this.error());
  protected readonly hasCountry = computed(() => !!this.country());

  constructor(private readonly countryService: Country) {
    effect(() => {
      const c = this.code();
      if (!c?.trim()) {
        this.loading.set(false);
        this.error.set('Código do país não informado.');
        this.country.set(null);
        return;
      }
      this.loading.set(true);
      this.error.set(null);
      this.country.set(null);
      this.countryService.getByCode(c).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.error) {
            this.error.set(res.error);
            this.country.set(null);
            return;
          }
          const data = res.data ?? null;
          this.country.set(data);
          if (data) {
            this.titleChange.emit(`Explorando: ${data.name.common}`);
          }
          if (!data) {
            this.error.set('País não encontrado.');
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.message ?? 'Erro ao carregar o país.');
          this.country.set(null);
        },
      });
    });
  }

  formatCurrencies(currencies: Record<string, { name: string; symbol?: string }> | undefined): string {
    if (!currencies) return '—';
    return Object.entries(currencies)
      .map(([code, info]) => `${info.name} (${code})`)
      .join(', ');
  }

  formatLanguages(languages: Record<string, string> | undefined): string {
    if (!languages) return '—';
    return Object.values(languages).join(', ');
  }
}
