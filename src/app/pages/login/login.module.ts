
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginAdminComponent } from './administrativo/login-admin.component';

const routes: Routes = [
  { path: 'user/login', component: LoginComponent, title: 'Login'  },
  { path: 'admin/login', component: LoginAdminComponent, title: 'LoginAdmin'  }
];

@NgModule({
  declarations: [LoginComponent, LoginAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule {}
