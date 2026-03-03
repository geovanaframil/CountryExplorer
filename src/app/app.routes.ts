import { Routes } from '@angular/router';
import { LandingScene } from './features/landing/landing-scene';
import { CountryDetail } from './features/country-detail/country-detail';

export const routes: Routes = [
  {
    path: '',
    component: LandingScene,
  },
  {
    path: 'country/:code',
    component: CountryDetail,
  },
];
