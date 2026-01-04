import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { CKEditorModule } from 'ng2-ckeditor';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { MedicosComponent } from '../../pages/medicos/list-medico.component';
import { FormMedicoComponent } from '../../pages/medicos/form-medico/form-medico.component';
import { ParametrosComponent } from '../../pages/configuracion/list-parametros.component';
import { NotificacionesComponent } from '../../pages/notificaciones/list-notificaciones.component';
import { FormNotificacionComponent } from '../../pages/notificaciones/form-notificacion/form-notificacion.component';
import { CalendarioComponent } from '../../pages/citas/citas-medicos.component';
import { FullCalendarModule } from "@fullcalendar/angular";
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModalCitasComponent } from '../../pages/citas/modal-citas-medico.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CKEditorModule,
    FullCalendarModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    NotifierModule,
    NgbModalModule
],
providers: [
        NotifierService
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
    FormUsuarioComponent,
    MedicosComponent,
    FormMedicoComponent,
    ParametrosComponent,
    NotificacionesComponent,
    FormNotificacionComponent,
    CalendarioComponent,
    ModalCitasComponent
  ]
})

export class AdminLayoutModule {}
