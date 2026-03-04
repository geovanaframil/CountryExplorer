import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  output,
  effect,
  ElementRef,
  viewChild,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { uiTypography } from '../typography';
import { uiColors } from '../colors';

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements AfterViewInit {
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;

  /** Controla visibilidade do modal */
  readonly isOpen = input<boolean>(false);
  /** Título exibido no cabeçalho (para acessibilidade e visual) */
  readonly title = input<string>('');

  readonly closed = output<void>();

  protected readonly dialogRef = viewChild<ElementRef<HTMLDivElement>>('dialog');

  private previousActiveElement: HTMLElement | null = null;
  private focusTrapBound = false;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        this.previousActiveElement =
          (document.activeElement as HTMLElement) ?? null;
        setTimeout(() => this.focusFirstFocusable(), 50);
        this.bindFocusTrap();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        this.unbindFocusTrap();
        if (this.previousActiveElement?.focus) {
          this.previousActiveElement.focus();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // effect já trata abertura; bind pode ser feito no effect
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close();
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).getAttribute('data-modal-backdrop') === 'true') {
      this.close();
    }
  }

  private focusFirstFocusable(): void {
    const el = this.dialogRef()?.nativeElement;
    if (!el) return;
    const focusable = el.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }

  private bindFocusTrap(): void {
    if (this.focusTrapBound) return;
    this.focusTrapBound = true;
    document.addEventListener('keydown', this.handleFocusTrap);
  }

  private unbindFocusTrap(): void {
    this.focusTrapBound = false;
    document.removeEventListener('keydown', this.handleFocusTrap);
  }

  private readonly handleFocusTrap = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab' || !this.isOpen()) return;
    const el = this.dialogRef()?.nativeElement;
    if (!el || !el.contains(document.activeElement)) return;

    const focusable = Array.from(
      el.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((node) => {
      const style = window.getComputedStyle(node);
      return style.visibility !== 'hidden' && style.display !== 'none';
    });

    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
}
