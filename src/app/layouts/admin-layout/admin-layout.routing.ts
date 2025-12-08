import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { PacientesComponent } from '../../pages/paciente/list-pacientes.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { EspecialidadesComponent } from '../../pages/especialidad/list-especialidades.component';
import { PerfilesComponent } from '../../pages/perfil/list-perfil.component';
import { RolesComponent } from '../../pages/rol/list-rol.component';
import { UsuariosComponent } from '../../pages/usuarios/list-usuarios.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user',           component: UserComponent },
    { path: 'pacientes',          component: PacientesComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'especialidades',          component: EspecialidadesComponent },
    { path: 'perfiles',          component: PerfilesComponent },
    { path: 'roles',          component: RolesComponent },
    { path: 'usuarios',          component: UsuariosComponent },
];
