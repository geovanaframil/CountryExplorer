import { Injectable } from '@angular/core';

/**
 * Usa Web Audio API para não depender de arquivos externos.
 */
@Injectable({
  providedIn: 'root',
})
export class ClickSoundService {
  private ctx: AudioContext | null = null;

  /** Toca um "toc" suave (ex.: ao passar o mouse em um item). */
  playToc(): void {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = this.ctx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignora se AudioContext não for suportado ou bloqueado (ex.: autoplay policy)
    }
  }
}
