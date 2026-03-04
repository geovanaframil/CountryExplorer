import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { LandingGlobe3d } from './landing-globe-3d';
import { LandingAmbientAudio } from './landing-ambient-audio';
import { LandingDragHint } from './landing-drag-hint';
import { ButtonComponent } from '../../ui/button/button.component';
import { ModalComponent } from '../../ui/modal/modal.component';
import { CountryListModalContent } from '../country-list/country-list-modal-content';
import { CountryDetailModalContent } from '../country-detail/country-detail-modal-content';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';

@Component({
  selector: 'app-landing-scene',
  standalone: true,
  imports: [
    CommonModule,
    LandingGlobe3d,
    LandingAmbientAudio,
    LandingDragHint,
    ButtonComponent,
    ModalComponent,
    CountryListModalContent,
    CountryDetailModalContent,
  ],
  templateUrl: './landing-scene.html',
  styleUrl: './landing-scene.scss',
})
export class LandingScene {
  readonly isInteracting = signal(false);
  /** Só vira true quando o usuário clica/arrasta no globo; a dica some e não volta mais. */
  readonly hintDismissed = signal(false);
  /** Controla abertura do modal de lista de países */
  readonly showCountriesModal = signal(false);
  /** Modal de detalhe do país (abre ao selecionar um país na lista) */
  readonly showDetailModal = signal(false);
  /** Código do país selecionado para o modal de detalhe */
  readonly selectedCountryCode = signal('');
  /** Título do modal de detalhe (atualizado quando o país carrega) */
  readonly detailModalTitle = signal('Carregando…');

  // Tokens de design
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;

  private setInteracting(): void {
    if (!this.isInteracting()) {
      this.isInteracting.set(true);
    }
  }

  @HostListener('mousemove')
  @HostListener('touchstart')
  onAmbientInteraction(): void {
    this.setInteracting();
  }

  /** Chamado quando o usuário interage com o globo. */
  onGlobeInteraction(): void {
    this.setInteracting();
    this.hintDismissed.set(true);
  }

  onCountrySelected(code: string): void {
    this.showCountriesModal.set(false);
    this.showDetailModal.set(true);
    this.selectedCountryCode.set(code);
    this.detailModalTitle.set('Carregando…');
  }

  onDetailBack(): void {
    this.showDetailModal.set(false);
    this.showCountriesModal.set(true);
  }

  onDetailClosed(): void {
    this.showDetailModal.set(false);
    this.showCountriesModal.set(false);
  }
}

