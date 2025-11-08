import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { RegisterDonor } from './features/register-donor/register-donor';
import { RegisterOrg } from './features/register-org/register-org';
import { About } from './features/about/about';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register-donor', component: RegisterDonor },
  { path: 'register-org', component: RegisterOrg },
  { path: 'about', component: About },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top', // 👈✨ السطر المهم هنا
      anchorScrolling: 'enabled', // (اختياري) لو عندك روابط داخل الصفحة نفسها #
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
