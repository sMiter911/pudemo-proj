import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'edit-profile', component: AccountComponent },
  { path: 'profile', component: AccountDetailsComponent },
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: '**', redirectTo: 'profile', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
