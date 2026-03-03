import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { LandingGlobe3d } from './landing-globe-3d';
import { LandingAmbientAudio } from './landing-ambient-audio';
import { LandingDragHint } from './landing-drag-hint';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';

@Component({
  selector: 'app-landing-scene',
  standalone: true,
  imports: [CommonModule, LandingGlobe3d, LandingAmbientAudio, LandingDragHint],
  templateUrl: './landing-scene.html',
  styleUrl: './landing-scene.scss',
})
export class LandingScene {
  readonly isInteracting = signal(false);
  /** Só vira true quando o usuário clica/arrasta no globo; a dica some só então e não volta mais. */
  readonly hintDismissed = signal(false);

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

  /** Chamado quando o usuário interage com o globo (clique ou arraste no canvas). */
  onGlobeInteraction(): void {
    this.setInteracting();
    this.hintDismissed.set(true);
  }
}

