import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { uiTypography } from '../typography';
import { uiColors } from '../colors';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;

  /** Estilo do botão: primary (emerald gamificado), secondary, ghost */
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);

  readonly clicked = output<void>();

  protected get variantClasses(): string {
    const v = this.variant();
    switch (v) {
      case 'primary':
        return [
          'bg-emerald-500 text-slate-950',
          'hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
          'border border-emerald-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]',
        ].join(' ');
      case 'secondary':
        return [
          'bg-slate-800/80 text-slate-100 border border-slate-600/80',
          'hover:bg-slate-700/80 hover:border-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        ].join(' ');
      case 'ghost':
        return [
          'bg-transparent text-slate-300 border border-slate-700/50',
          'hover:bg-slate-800/50 hover:text-emerald-400/90 hover:border-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        ].join(' ');
      default:
        return '';
    }
  }
}
