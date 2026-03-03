import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-list.html',
  styleUrl: './country-list.scss',
})
export class CountryList {
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;
}
