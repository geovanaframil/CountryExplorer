import {
  Component,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-landing-ambient-audio',
  standalone: true,
  templateUrl: './landing-ambient-audio.html',
  styleUrl: './landing-ambient-audio.scss',
})
export class LandingAmbientAudio {
  @ViewChild('audioRef', { static: true }) private audioRef?: ElementRef<
    HTMLAudioElement
  >;

  readonly isPlaying = signal(false);
  readonly hasError = signal(false);

  async toggle(): Promise<void> {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;

    try {
      if (this.isPlaying()) {
        audio.pause();
        this.isPlaying.set(false);
      } else {
        await audio.play();
        this.isPlaying.set(true);
        this.hasError.set(false);
      }
    } catch {
      this.hasError.set(true);
    }
  }
}

