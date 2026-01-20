import { Component, OnInit, ViewChild, ViewEncapsulation  } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger, query, group } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';

import { Filtro, Cita, FiltroCitaAsig } from '../../interfaces/citas.interface';
import { CitasServices } from '../../services/citas.service';
import { UtilsGeneral } from '../../../shared/utils/utils-general';
import { Especialidad, FiltroEspecialidad } from '../../interfaces/especialidad.interface';
import { EspecialidadServices } from '../../services/especialidad.service';
import { FiltroMedico, Medico } from '../../interfaces/medico.interface';
import { MedicoServices } from '../../services/medico.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-citas-asignadas',
    templateUrl: './citas-asignadas.component.html',
    encapsulation: ViewEncapsulation.None,
        animations: [cardsAnimation()],
})

export class CitasAsignadasComponent implements OnInit{
    title: string;
    arrayData: Cita[];
    filterArray: Cita[] | null = null;
    listEspecialidad: Especialidad[] = [];
    listMedicos: Medico[] = [];
    page: number = 1;
    pageSize: number = 10;
    totfilas: number = 0;
    filtrarTableForm: FormGroup;
    flagViewCards = true;
    flagEditView = false;
    data: Cita;
    textDescription = "activar"
    textSpinner = "Cargando..."
    action=""
    disabled = false;
    breadcumb= "";
    tipoPerfil?: string;
    userId?: number;
    fechaInvalida: boolean = false;
    infoCita?: string;

    constructor(private apiService: CitasServices,
        private apiServEsp: EspecialidadServices,
        private apiServMed: MedicoServices,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private classGeneral: UtilsGeneral)
        {
            this.title = "Citas";
        }

    ngOnInit(){
        this.validaUserLogin();
        this.cargarInfoFiltros();
        this.getEspecialidades();
        this.getCitasAll();
    }

    cargarInfoFiltros(){
      const fIni = new Date();
      const fFin = new Date();

      fIni.setDate(fIni.getDate() - 2); // 👈 suma 5 días
      fFin.setDate(fFin.getDate() + 5); // 👈 suma 5 días

      const fIniStr = fIni.toISOString().substring(0, 10);
      const fFinStr = fFin.toISOString().substring(0, 10);

      this.filtrarTableForm = this.fb.group({
        especialidad: ['0'],
        medico: ['0'],
        fechaInicio: [fIniStr],
        fechaFin: [fFinStr]
    }, { validators: this.fechaInicioMenorQueFin });

    this.filtrarTableForm.controls['especialidad'].setValue("0");
    this.filtrarTableForm.controls['medico'].setValue("0");

    if(this.tipoPerfil === "M"){
        this.filtrarTableForm.get('especialidad')?.disable();
        this.filtrarTableForm.get('medico')?.disable();
    }
    else{
        this.filtrarTableForm.get('especialidad')?.enable();
        this.filtrarTableForm.get('medico')?.enable();
    }
  }

  getEspecialidades(){
    var filtroEsp: FiltroEspecialidad = {
            input: "",
            combo: "S"
        }

    this.apiServEsp.getAll(filtroEsp).subscribe(r => {
      this.listEspecialidad = r?.data ?? []
      console.log(r);
    });
        
  }

  onItemSelectEspecialidad(item: any) {
    console.log(item);
    if(item.target != undefined)
    {
      const value = (item.target as HTMLSelectElement).value;
      console.log('Especialidad seleccionada:', value);
      if(value === "0"){
        this.listMedicos = [];
        return;
      }

      this.cargarMedicos(value);
    }
  }

  cargarMedicos(especialidadId: string){
      if(especialidadId != "0")
      {
        var filtroMed: FiltroMedico = {
            input: "",
            combo: "S",
            especialidadId: especialidadId === "-1" ? null : especialidadId
        }
  
        this.apiServMed.getAll(filtroMed).subscribe(r => {
          this.listMedicos = r?.data ?? []
          console.log(r);
          if(this.listMedicos.length == 0)
          {
            this.classGeneral.showNotification(3, "top","right", "No existen médicos para la especialidad seleccionada.");
            //this.showNotification(3, "top","right", "No existen médicos para la especialidad seleccionada.");
          }
        });
      }
    }

    async getCitasAll(){
        const especialidadId = this.filtrarTableForm.controls["especialidad"].value;
        const medicoId = this.filtrarTableForm.controls["medico"].value;
        const fInicio = this.filtrarTableForm.controls["fechaInicio"].value;
        const fFin = this.filtrarTableForm.controls["fechaFin"].value;

        var filtroCita: FiltroCitaAsig = {
          input: "",
          combo: "N",
          estadoCita: this.tipoPerfil === "M" ? "ASIG" : "",
          fechaInicio: fInicio,
          fechaFin: fFin,
          medicoId: this.tipoPerfil === "M" ? this.userId : medicoId,
          paciente: this.tipoPerfil === "P" ? this.userId : 0,
          especialidadId: this.tipoPerfil === "P" ? 0 : especialidadId,
      }

      this.apiService.getAll(filtroCita).subscribe(r => {
        this.filterArray = r.data ?? [];
        this.arrayData = this.filterArray;
        this.totfilas = this.arrayData.length;
        if(this.arrayData.length == 0)
        {
          this.classGeneral.showNotification(3, "top","right", "No existen citas configuradas.");
        }
      });
    }

 // 🔹 Validador cruzado dentro del mismo .ts
  fechaInicioMenorQueFin: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFin')?.value;

    if (!inicio || !fin) return null;

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    if(fechaInicio > fechaFin) { 
        this.fechaInvalida = true;
        this.classGeneral.showNotification(3, "top","right", "FechaInicio no puede ser mayor a la FechaFin.")
    }
    else{
        this.fechaInvalida = false;
    }

    // 2️⃣ Validar que la diferencia no sea mayor a 2 meses
    const diferenciaMeses =
        (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 +
        (fechaFin.getMonth() - fechaInicio.getMonth());

    if (diferenciaMeses > 2) {
        this.fechaInvalida = true;
        this.classGeneral.showNotification(
        3, "top","right", "El rango entre FechaInicio y FechaFin no puede ser mayor a 2 meses."
        );
    }
    else{
        this.fechaInvalida = false;
    }

  }

  regresaFechaLocal(fechaCita: string): string{
    const fecha = new Date(fechaCita);
    return this.classGeneral.fechaLocal(fechaCita);
  }

  abrirModalInfoCita(cita: Cita | null){

    if(cita){
        const fechaCita = new Date(cita.fechaCita);
        const fechaDia = new Date();
        if(fechaCita > fechaDia){
            this.infoCita = "Le recordamos que usted tiene una cita programada para el día " + this.classGeneral.fechaLocal(fechaCita) + " a las " + this.classGeneral.obtenerHora(fechaCita) + ". Por favor, preséntese 30 minutos antes para realizar el proceso de registro. Gracias.";
        }
        else{
            this.infoCita = "Su cita del día " + this.classGeneral.fechaLocal(fechaCita) + " a las " + this.classGeneral.obtenerHora(fechaCita) + " ya fue registrada y actualmente se encuentra en estado " + cita.descEstadoCita + ".";
        }
         

        Swal.fire({
        title: 'Datos Cita',
        text: this.infoCita,
        icon: 'info',
        showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            reverseButtons: true
        });
    }
  }

  cleanFilters(): void{
    this.cargarInfoFiltros();
    this.getCitasAll();
  }

  cargarDatosActualizar() {
    this.getCitasAll();
  }

  validaUserLogin(){
    const login = this.classGeneral.validaUserLogin();
    if(login){
      this.tipoPerfil = login.loginPerfil;
      this.userId = login.loginId;
    }

    if(this.tipoPerfil === "A")
    {
        this.classGeneral.cerrarSesion();
    }
  }

  //#region Métodos para llamar a la pantalla de atención para citas
  public  showForm(input: Cita | null, action: string){
          this.data = input;
          this.textSpinner = "Procesando...";
          switch (action) {
            case 'atender':
                this.breadcumb= input.paciente;
                break;
            default:
                break;
          }
  
          this.action = action;
          this.flagViewCards = false;
          this.flagEditView = true; 
      }

      viewCards(action:string){
        this.breadcumb="";
        if(action=="cancel"){
          this.flagViewCards = true;
          this.flagEditView = false;
        }
        if(action=="reload"){
          this.textSpinner = "Cargando...";
         this.getCitasAll();
          setTimeout(() => {
            this.flagViewCards = true;
            this.flagEditView = false;
          }, 1000);
  
        }
  
    }
  //#endregion
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