import { NgModule, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ViewChild   } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger, query, group } from '@angular/animations';
import { Cita } from '../../../interfaces/citas.interface';
import { PacienteServices } from '../../../services/paciente.service';
import { UtilsGeneral } from '../../../../shared/utils/utils-general';
import { Paciente } from '../../../interfaces/paciente.interface';
import { CitasServices } from '../../../services/citas.service';
import { HistorialServices } from '../../../services/historial.service';
import { FiltroHistorial, HistorialClinico } from '../../../interfaces/historial.interface';

@Component({
    selector: 'app-form-atencion',
    templateUrl: './atencion-citas.component.html',
    styleUrls: ['./atencion-citas.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AtencionCitaComponent implements OnInit{
    @Input() breadcumb: string;
    @Input() action: string;
    @Input() data: Cita;

    @Output() flagViewCards = new EventEmitter<string>();
    @ViewChild(AtencionCitaComponent) table: AtencionCitaComponent | any;

    filtrarTableForm: FormGroup;
    titleForm: string;
    activeTab: number = 1;
    atenderCita: string = "";
    htmlContentDiagnostico: string;
    htmlContentReceta: string;
    dataPaciente: Paciente;
    dataHistorial: HistorialClinico[] = [];
totFilasHistorial: number;
  pacienteForm!: FormGroup;
  recetaForm!: FormGroup;

  historialClinico: string = '';
  tipoPerfil?: string;
  userId?: number;
  user?: string;

    constructor(private fb: FormBuilder,
      private apiSerPaciente: PacienteServices,
      private apiSerCita: CitasServices,
      private apiSerHistorial: HistorialServices,
      private classGeneral: UtilsGeneral
    ) {
        
        }

    ngOnInit() {
      this.titleForm = "Paciente";
      this.validarEstadoCita();
      this.generarHtmlReceta();
      this.inicializarFormularios();
    }

    ngAfterViewInit(){
      this.cargarDatosPaciente();
    }

    viewCards(){
        this.breadcumb="";
        this.flagViewCards.emit("cancel");
    }

    viewCardsReload(){
        this.breadcumb="";
        this.flagViewCards.emit("reload");
    }

    inicializarFormularios(): void {
    this.pacienteForm = this.fb.group({
      nombres: [{ value: '', disabled: true}],
      apellidos: [{ value: '', disabled: true}],
      identificacion: [{ value: '', disabled: true}],
      email: [{ value: '', disabled: true}],
      edad: [{ value: '', disabled: true}],
      telefono: [{ value: '', disabled: true}],
      celular: [{ value: '', disabled: true}]
    });

    this.recetaForm = this.fb.group({
      medicamentos: ['', Validators.required],
      indicaciones: ['', Validators.required],
      diagnostico: ['', Validators.required],
      receta: ['', Validators.required]
    });

  }

  generarHtmlReceta(){
    this.htmlContentReceta = `
      <table style="font-family: arial, sans-serif;border-collapse: collapse;width: 100%;">
        <tr>
          <th style="border: 1px solid #ddd;padding: 8px;width: 50%;">Medicamentos</th>
          <th style="border: 1px solid #ddd;padding: 8px;width: 50%;">Instructivo</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd;padding: 8px;background-color: #ddd;"></br></td>
          <td style="border: 1px solid #ddd;padding: 8px;background-color: #ddd;"></br></td>
        </tr>
      </table>
      `;
  }

  async cargarDatosPaciente() {
    var resp = await this.apiSerPaciente.getById(this.data?.pacienteId ?? 0).toPromise()
    .then(res => {
        this.dataPaciente = res?.data ?? null;
        if(!this.dataPaciente){
          this.classGeneral.showNotification(1, "top", "right", "No existe el paciente");
          return;
        }

        this.asignarPaciente();
    })
    .catch((err) => {
        this.classGeneral.showNotification(4, "top", "right", "Error al consultar el paciente");
    });
  }

  asignarPaciente(){
    if(this.dataPaciente){
      this.pacienteForm.controls["nombres"].setValue(this.dataPaciente.nombres);
      this.pacienteForm.controls["apellidos"].setValue(this.dataPaciente.apellidos);
      this.pacienteForm.controls["identificacion"].setValue(this.dataPaciente.identificacion);
      this.pacienteForm.controls["email"].setValue(this.dataPaciente.email);
      this.pacienteForm.controls["edad"].setValue(this.dataPaciente.edad);
      this.pacienteForm.controls["telefono"].setValue(this.dataPaciente.telefono);
      this.pacienteForm.controls["celular"].setValue(this.dataPaciente.celular);
    }
  }

  cambiarTab(tab: number): void {
    this.activeTab = tab;
  }

  guardarReceta(): void {
    if (this.recetaForm.invalid) {
      this.recetaForm.markAllAsTouched();
      return;
    }

    console.log('Receta guardada:', this.recetaForm.value);
  }

  validarEstadoCita(){
    this.atenderCita = this.data.estadoCita;
  }

  async actualizarEstadoCita(estado: string){
    this.data.estadoCita = estado;
    this.data.usuarioModificacion = this.user;

    var resp = await this.apiSerCita.edit(this.data).toPromise()
    .then(res => {
        if(res["id"]+"" === "0"){
          this.classGeneral.showNotification(2, "top", "right", "Se genera la atención de la cita");
          if(estado === "PROC"){
            this.atenderCita = estado
          }
          else{
            this.atenderCita = estado
          }
        }
    })
    .catch((err) => {
        this.classGeneral.showNotification(4, "top", "right", "Error al actualizar el estado de al cita");
    });
  }

  generarHistorialClinico(){
    var newHistorial: HistorialClinico = {
        citaId: this.data.citaId,
        medicoId: this.data.medicoId,
        pacienteId: this.data.pacienteId,
        diagnostico: this.htmlContentDiagnostico,
        receta: this.htmlContentReceta,
        estado: true,
        usuarioCreacion: "admin"
    }

      var resp = this.apiSerHistorial.create(newHistorial).toPromise()
          .then(res => {
              var codigo = parseInt(res["id"]+"");
              if(codigo > 0){
                this.classGeneral.showNotification(2, "top", "right", res["message"]+"");
                this.getHistorialClinico();
              }
              else{
                this.classGeneral.showNotification(3, "top", "right", res["message"]+"");
              }
          })
          .catch((err) => {
              this.classGeneral.showNotification(4, "top", "right", "Error al crear el historial clínico");
          });
  }

  actualizarDataFlujo(estado: string){
    if(estado === "PROC"){
      this.actualizarEstadoCita(estado);
    }
    else{
      this.actualizarEstadoCita(estado);
      this.generarHistorialClinico();
    }
  }

  getHistorialClinico(){
    var filtros: FiltroHistorial = {
        citaId: this.data.citaId+"",
        medicoId: this.data.medicoId+"",
        pacienteId: this.data.pacienteId+""
    }

    var resp = this.apiSerHistorial.getAll(filtros).toPromise()
          .then(res => {
              this.dataHistorial = res.data ?? [];
              this.totFilasHistorial = this.dataHistorial.length;
          })
          .catch((err) => {
              this.classGeneral.showNotification(4, "top", "right", "Error al consultar el historial clínico");
          });
  }

  validaUserLogin(){
    const login = this.classGeneral.validaUserLogin();
    if(login){
      this.tipoPerfil = login.loginPerfil;
      this.userId = login.loginId;
      this.user = login.loginUsuario;
    }
  }

  mostrarCaracteres(texto: string): string{
    return this.classGeneral.recortarTexto(texto , 100);
  }

  regresaFechaLocal(fechaCita: string): string{
    const fecha = new Date(fechaCita);
    return this.classGeneral.fechaLocal(fechaCita);
  }

}