import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { RegisterDonor } from './features/register-donor/register-donor';
import { RegisterOrg } from './features/register-org/register-org';
import { About } from './features/about/about';
import { BloodBankList } from './features/find-blood/blood-bank-list/blood-bank-list';
import { Login } from './features/login/login';
import { ForgetPassword } from './features/forget-password/forget-password';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register-donor', component: RegisterDonor },
  { path: 'register-org', component: RegisterOrg },
  { path: 'about', component: About },
  { path: 'find-blood', component: BloodBankList },
  { path: 'login', component: Login },
  { path: 'forget-password', component: ForgetPassword },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
