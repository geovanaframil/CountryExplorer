import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { uiColors } from './ui/colors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
  <main [ngClass]="uiColors.background.appShell">
    <router-outlet></router-outlet>
  </main>
`
})
export class App {
  protected readonly title = signal('country-explorer');
  protected readonly uiColors = uiColors;
}
