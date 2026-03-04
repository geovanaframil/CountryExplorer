import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  output,
  signal,
  viewChild,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { uiColors } from '../colors';

export interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-ui-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  protected readonly uiColors = uiColors;
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly options = input<DropdownOption[]>([]);
  readonly value = input<string>('');
  readonly placeholder = input<string>('Selecione...');

  readonly valueChange = output<string>();

  protected readonly open = signal(false);
  protected readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  protected get selectedLabel(): string {
    const v = this.value();
    const opt = this.options().find((o) => o.value === v);
    return opt?.label ?? this.placeholder();
  }

  protected select(option: DropdownOption): void {
    this.valueChange.emit(option.value);
    this.open.set(false);
  }

  protected toggle(): void {
    this.open.update((o) => !o);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.hostRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
