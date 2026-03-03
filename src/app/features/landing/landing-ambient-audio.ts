import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';

@Component({
  selector: 'app-landing-ambient-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-ambient-audio.html',
  styleUrl: './landing-ambient-audio.scss',
})
export class LandingAmbientAudio implements AfterViewInit, OnDestroy {
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;

  @ViewChild('audioRef', { static: true }) private audioRef?: ElementRef<
    HTMLAudioElement
  >;

  readonly isPlaying = signal(false);
  readonly hasError = signal(false);

  private boundOnPlay = () => this.isPlaying.set(true);
  private boundOnPause = () => this.isPlaying.set(false);
  private boundOnEnded = () => this.isPlaying.set(false);
  private boundOnError = () => this.hasError.set(true);

  ngAfterViewInit(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;
    audio.addEventListener('play', this.boundOnPlay);
    audio.addEventListener('pause', this.boundOnPause);
    audio.addEventListener('ended', this.boundOnEnded);
    audio.addEventListener('error', this.boundOnError);
  }

  ngOnDestroy(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;
    audio.removeEventListener('play', this.boundOnPlay);
    audio.removeEventListener('pause', this.boundOnPause);
    audio.removeEventListener('ended', this.boundOnEnded);
    audio.removeEventListener('error', this.boundOnError);
  }

  async toggle(): Promise<void> {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;

    try {
      if (this.isPlaying()) {
        audio.pause();
      } else {
        this.hasError.set(false);
        await audio.play();
      }
    } catch {
      this.hasError.set(true);
    }
  }
}

