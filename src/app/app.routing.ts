import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(x => x.AdminLayoutModule)
  }]},
  {
    path: '**',
    redirectTo: 'dashboard'
  },
  {
    path: '',
    children: [
        {
      loadChildren: () => import('./pages/login/login.module').then(x => x.LoginModule)
        }]
  }
]


@NgModule({
  imports: [
    // IMPORTANTE: sin { useHash: true }
    RouterModule.forRoot(AppRoutes, {
      // Opcional: comportamiento de scroll amigable
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      useHash: true  
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

