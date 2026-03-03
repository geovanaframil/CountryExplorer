import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { LandingGlobe3d } from './landing-globe-3d';
import { LandingAmbientAudio } from './landing-ambient-audio';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';

@Component({
  selector: 'app-landing-scene',
  standalone: true,
  imports: [CommonModule, LandingGlobe3d, LandingAmbientAudio],
  templateUrl: './landing-scene.html',
  styleUrl: './landing-scene.scss',
})
export class LandingScene {
  readonly isInteracting = signal(false);

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

  onGlobeInteraction(): void {
    this.setInteracting();
  }
}

