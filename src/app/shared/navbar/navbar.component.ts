import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    userName?: string;

    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;

    constructor(location:Location, private renderer : Renderer2, private element : ElementRef, private router: Router) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit(){
        this.validaUserLogin();
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });
    }
    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return 'MediCare / ' + this.listTitles[item].title;
          }
      }
      return 'MediCare / ' + titlee;
    }
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
      }
      sidebarOpen() {
          const toggleButton = this.toggleButton;
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          setTimeout(function(){
              toggleButton.classList.add('toggled');
          }, 500);

          html.classList.add('nav-open');
          if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
          }
          this.sidebarVisible = true;
      };
      sidebarClose() {
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          if (window.innerWidth < 991) {
            setTimeout(function(){
              mainPanel.style.position = '';
            }, 500);
          }
          this.toggleButton.classList.remove('toggled');
          this.sidebarVisible = false;
          html.classList.remove('nav-open');
      };
      collapse(){
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        console.log(navbar);
        if (!this.isCollapsed) {
          navbar.classList.remove('navbar-transparent');
          navbar.classList.add('bg-white');
        }else{
          navbar.classList.add('navbar-transparent');
          navbar.classList.remove('bg-white');
        }

      }

      validaUserLogin(){
        const usuario = localStorage.getItem('loginUsuario');
        const perfil = localStorage.getItem('loginPerfil');
        const time = localStorage.getItem('time');

        if(usuario && perfil){
            this.userName = usuario;
            console.log("Time: " + time);
            this.validarSesionLogin(time, perfil);
        }
        else{
          this.router.navigate(["/user/login"]);
        }
      }

      validarSesionLogin(date?: string, perfil?: string): void {
        if (date){
          const fecha = this.parseCustomDate(date);
          if (fecha < new Date()) {
            localStorage.clear();
            console.log("Time convertido: " + fecha);
            console.log("Fecha del sistema: " + new Date());
            if(perfil && perfil === "P"){
                this.router.navigate(["/user/login"]);
            }
            else{
              this.router.navigate(["/admin/login"]);
            }
          }
        }
      }

      cerrarSesion(){
        const usuario = localStorage.getItem('loginUsuario');
        const perfil = localStorage.getItem('loginPerfil');
        localStorage.clear();
        if(perfil && perfil === "P"){
                this.router.navigate(["/user/login"]);
            }
            else{
              this.router.navigate(["/admin/login"]);
            }
        
      }

      parseCustomDate(dateStr: string): Date | null {
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
      }


}
