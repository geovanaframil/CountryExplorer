import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { uiTypography } from '../../ui/typography';
import { uiColors } from '../../ui/colors';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.scss',
})
export class CountryDetail {
  protected readonly uiTypography = uiTypography;
  protected readonly uiColors = uiColors;
}
