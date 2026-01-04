import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard',         icon:'nc-bank',       class: '' },
    //{ path: '/icons',         title: 'Icons',             icon:'nc-diamond',    class: '' },
    //{ path: '/maps',          title: 'Maps',              icon:'nc-pin-3',      class: '' },
    //{ path: '/notifications', title: 'Notifications',     icon:'nc-bell-55',    class: '' },
    //{ path: '/user',          title: 'User Profile',      icon:'nc-single-02',  class: '' },
    { path: '/pacientes',         title: 'Pacientes',        icon:'nc-badge',    class: '' },
    { path: '/especialidades',       title: 'Especialidades',    icon:'nc-sound-wave',  class: '' },
    { path: '/perfiles',       title: 'Perfiles',    icon:'nc-settings-gear-65',  class: '' },
    { path: '/roles',       title: 'Roles',    icon:'nc-settings-gear-65',  class: '' },
    { path: '/usuarios',       title: 'Usuarios',    icon:'nc-circle-10',  class: '' },
    { path: '/medicos',       title: 'Médicos',    icon:'nc-ambulance',  class: '' },
    { path: '/parametros',       title: 'Parámetros',    icon:'nc-tile-56',  class: '' },
    { path: '/notificaciones',       title: 'Plantillas',    icon:'nc-paper',  class: '' },
    { path: '/citas',       title: 'Citas',    icon:'nc-paper',  class: '' },
    //{ path: '/typography',    title: 'Typography',        icon:'nc-caps-small', class: '' },
    //{ path: '/upgrade',       title: 'Upgrade to PRO',    icon:'nc-spaceship',  class: 'active-pro' }
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
