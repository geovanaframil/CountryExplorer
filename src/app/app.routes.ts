import { Routes } from '@angular/router';
import { LandingScene } from './features/landing/landing-scene';
import { CountryList } from './features/country-list/country-list';
import { CountryDetail } from './features/country-detail/country-detail';

export const routes: Routes = [
  {
    path: '',
    component: LandingScene,
  },
  {
    path: 'countries',
    component: CountryList,
  },
  {
    path: 'country/:code',
    component: CountryDetail,
  },
];
