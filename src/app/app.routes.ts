import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { RegisterDonor } from './features/register-donor/register-donor';
import { RegisterOrg } from './features/register-org/register-org';
import { About } from './features/about/about';
import { BloodBankList } from './features/find-blood/blood-bank-list/blood-bank-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register-donor', component: RegisterDonor },
  { path: 'register-org', component: RegisterOrg },
  { path: 'about', component: About },
  { path: 'find-blood', component: BloodBankList },
];
