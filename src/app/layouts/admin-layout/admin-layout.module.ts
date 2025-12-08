import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { PacientesComponent }           from '../../pages/paciente/list-pacientes.component';
import { FormPacienteComponent } from '../../pages/paciente/form-paciente/form-paciente.component';
import { TypographyComponent }      from '../../pages/typography/typography.component';
import { IconsComponent }           from '../../pages/icons/icons.component';
import { MapsComponent }            from '../../pages/maps/maps.component';
import { NotificationsComponent }   from '../../pages/notifications/notifications.component';
import { UpgradeComponent }         from '../../pages/upgrade/upgrade.component';
import { EspecialidadesComponent }           from '../../pages/especialidad/list-especialidades.component';
import { PerfilesComponent } from '../../pages/perfil/list-perfil.component';
import { RolesComponent } from '../../pages/rol/list-rol.component';
import { UsuariosComponent } from '../../pages/usuarios/list-usuarios.component';
import { FormUsuarioComponent } from '../../pages/usuarios/form-usuarios/form-usuarios.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    PacientesComponent,
    FormPacienteComponent,
    EspecialidadesComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    PerfilesComponent,
    RolesComponent,
    UsuariosComponent,
    FormUsuarioComponent
  ]
})

export class AdminLayoutModule {}
