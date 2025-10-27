import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { RegisterDonor } from './features/register-donor/register-donor';
import { RegisterOrg } from './features/register-org/register-org';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register-donor', component: RegisterDonor },
  { path: 'register-org', component: RegisterOrg },
];
