import { Component, OnInit, ViewChild, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger, query, group } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';

import { Filtro, Usuario } from '../../interfaces/usuario.interface';
import { UsuarioServices } from '../../services/usuario.service';


@Component({
    selector: 'app-usuarios',
    //moduleId: module.id,
    templateUrl: './list-usuarios.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [cardsAnimation()],
})

export class UsuariosComponent implements OnInit{
    title: string;
    arrayData: Usuario[];
    filterArray: Usuario[] | null = null;
    page: number = 1;
    pageSize: number = 10;
    totfilas: number = 0;
    filtrarTableForm: FormGroup;
    flagViewCards = true;
    flagEditView = false;
    data: Usuario;
    textDescription = "activar"
    textSpinner = "Cargando..."
    action=""
    disabled = false;
    breadcumb= "";

    constructor(private apiService: UsuarioServices,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute)
        {
            this.title = "Usuarios";
        }

    ngOnInit(){
        this.textSpinner = "Cargando...";

        this.cargarInfoFiltro();
        this.getAll();
        this.filter();
    }

    //#region: Seccion para mostrar en el grip view
    async getAll(){
        try {
            this.filterArray = [];
            this.arrayData = [];

            var filtro: Filtro = {
                input: ""
            }
            var resp = await this.apiService.getAll(filtro).toPromise();
            this.arrayData = resp?.data ?? [];
            this.filterArray = this.arrayData;
            this.totfilas = this.arrayData.length;

        } catch (error) {
            console.log(error);
        }
    }

    cargarInfoFiltro(){
      this.filtrarTableForm = this.fb.group({
            datosFiltro: ['']
        });
    }

    filter(){
        // Hook: cuando se escribe, filtrar automáticamente
        this.filtrarTableForm.get('datosFiltro')?.valueChanges.subscribe(texto => {
            this.filtrarGrid(texto);
        });
    }

    filtrarGrid(texto: string){
        if (!texto) {
            this.filterArray = this.arrayData;
            return;
        }

        texto = texto.toLowerCase();

        this.filterArray = this.arrayData.filter(item =>
            Object.values(item).some(val =>
            val != null && val.toString().toLowerCase().includes(texto)
            )
        );
    }

    //#endregion: seccion grid view

    //#region: seccion editar perfil
    public  showForm(input: Usuario | null, action: string){
        this.data = input;
        this.textSpinner = "Procesando...";
        switch (action) {
          case 'add':
              this.breadcumb="Usuario > Agregar";
              break;
          case 'view':
              this.breadcumb="Usuario > Ver";
              break;
          case 'edit':
              this.breadcumb="Usuario > Editar";
              break;
          default:
              break;
        }

        this.action = action;
        this.flagViewCards = false;
        this.flagEditView = true; 
    }

    viewCards(action:string){
        this.breadcumb="Administración > Campañas ";
        if(action=="cancel"){
          this.flagViewCards = true;
          this.flagEditView = false;
        }
        if(action=="reload"){
          this.textSpinner = "Cargando...";
          this.getAll();
          setTimeout(() => {
            this.flagViewCards = true;
            this.flagEditView = false;
          }, 1000);
  
        }
  
    }
    //#endregion: seccion editar perfil
}

export function cardsAnimation(){
    const left = [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
        group([
          query(':enter', [style({ transform: 'translateX(-100%)' }), animate('3s ease-out', style({ transform: 'translateX(0%)' }))], {
            optional: true,
          }),
          query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
            optional: true,
          }),
        ]),
      ];
    
      const right = [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
        group([
          query(':enter', [style({ transform: 'translateX(100%)' }),
          animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
            optional: true,
          }),
          query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
            optional: true,
          }),
        ]),
      ];


    const top = [
        query(':enter, :leave', style({ position: 'initial', width: '100%' }), { optional: true }),
        group([
          query(':enter', [style({ transform: 'translateY(-100%)' }), animate('.3s ease-out', style({ transform: 'translateY(0%)' }))], {
            optional: true,
          }),
          query(':leave', [style({ transform: 'translateY(0%)' }), animate('.3s ease-out', style({ transform: 'translateY(100%)' }))], {
            optional: true,
          }),
        ]),
      ];
    
      const bottom = [
        query(':enter, :leave', style({ position: 'initial', width: '100%' }), { optional: true }),
        group([
          query(':enter', [style({ transform: 'translateY(100%)' }),
          animate('.3s ease-out', style({ transform: 'translateY(0%)' }))], {
            optional: true,
          }),
          query(':leave', [style({ transform: 'translateY(0%)' }), animate('.3s ease-out', style({ transform: 'translateY(-100%)' }))], {
            optional: true,
          }),
        ]),
      ];

    return trigger('openClose', [
        state('open', style({
          height: '*',
          opacity: 1,
        })),
        state('closed', style({
          height: '*',
          opacity: 1,
        })),
        //  transition('open => closed', left),
        //  transition('closed => open', right)
        // transition('open => closed', top),
        // transition('closed => open', bottom)
        transition('open => closed', [
            style({ opacity: 0 }),
            animate(300, style({ opacity: 1 }))
        ]),
        transition('closed => open', [
            style({ opacity: 0 }),
            animate(300, style({ opacity: 1 }))
        ])
      ])
}