import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { RegisterDonor } from './features/register-donor/register-donor';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register-donor', component: RegisterDonor },
];
