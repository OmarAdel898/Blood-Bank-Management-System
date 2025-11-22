import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { RegisterDonor } from './features/register-donor/register-donor';
import { RegisterOrg } from './features/register-org/register-org';
import { About } from './features/about/about';
import { BloodBankList } from './features/find-blood/blood-bank-list/blood-bank-list';
import { Login } from './features/login/login';
import { ForgetPassword } from './features/forget-password/forget-password';
import { OrganizationDashboardComponent } from './features/organization-dashboard/organization-dashboard';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { LatestBlog } from './features/latest-blog/latest-blog';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register-donor', component: RegisterDonor },
  { path: 'register-org', component: RegisterOrg },
  { path: 'about', component: About },
  { path: 'find-blood', component: BloodBankList },
  { path: 'login', component: Login },
  { path: 'forget-password', component: ForgetPassword },
  { path: 'latest-blog', component: LatestBlog },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'organization-dashboard', component: OrganizationDashboardComponent },
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
