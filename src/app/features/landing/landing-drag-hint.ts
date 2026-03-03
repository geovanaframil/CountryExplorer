import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-landing-drag-hint',
  standalone: true,
  templateUrl: './landing-drag-hint.html',
  styleUrl: './landing-drag-hint.scss',
})
export class LandingDragHint {
  /** Quando false, a dica não é exibida (usuário já interagiu) e não volta mais. */
  @Input() visible = true;
}
