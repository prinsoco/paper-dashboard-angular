import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger, query, group } from '@angular/animations';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { tree } from 'd3';

import { Paciente, Filtro, FilterString,  } from '../../../pages/interfaces/paciente.interface';
import { environment } from '../../../../environments/environment';
import { PacienteServices } from '../../../pages/services/paciente.service';

@Component({
    selector: 'app-form-paciente',
    templateUrl: './form-paciente.component.html',
    encapsulation: ViewEncapsulation.None
})

export class FormPacienteComponent implements OnInit {
    @Input() breadcumb: string = "";
    @Input() action: string = "";
    @Input() data: Paciente;

    @Output() flagViewCards = new EventEmitter<string>();
    @ViewChild(FormPacienteComponent) table: FormPacienteComponent | any;
    
    titleForm : string;
    active = 1;
    dataForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private apiService: PacienteServices) {
    }

    ngOnInit() {
       console.log("Formulario");
    }

     viewCards(){
        this.breadcumb="Administración > Intermediarios";
        this.flagViewCards.emit("cancel");
    }

    validateForms(){
        switch (this.action) {
            case 'add':
                this.active = 1;
                this.titleForm = "Agregar";
                this.dataForm = this.fb.group({
                    nombres: ['Vanessa', [Validators.required]],
                    apellidos: ['Aguas', [Validators.required]],
                    identificacion: ['0999999999', [Validators.required]],
                    usuario: ['usumedicare', [Validators.required]],
                    email: ['tu@correo.com', [Validators.required]],
                    edad: ['18'],
                    telefono: ['2334238'],
                    celular: ['0923342389'],
                    direccion: ['Centro - Sur']
                });
                break;
            case 'edit':
                this.active = 1;
                this.titleForm = "Editar";
                this.dataForm = this.fb.group({
                    nombres: [this.data.nombres, [Validators.required]],
                    apellidos: [this.data.apellidos, [Validators.required]],
                    identificacion: [this.data.identificacion, [Validators.required]],
                    usuario: [this.data.usuario, [Validators.required]],
                    email: [this.data.email, [Validators.required]],
                    edad: [this.data.edad],
                    telefono: [this.data.telefono],
                    celular: [this.data.celular],
                    direccion: [this.data.direccion]
                });
                break;
            default:
                break;
        }
    }

    async createRegistro(){
        var intermediario: Paciente = {
            pacienteId : 0,
            nombres : this.dataForm.controls['nombres'].value,
            apellidos : this.dataForm.controls['apellidos'].value,
            identificacion : this.dataForm.controls['identificacion'].value,
            usuario : this.dataForm.controls['usuario'].value.replace(',','.'),
            email : this.dataForm.controls['email'].value,
            edad : this.dataForm.controls['edad'].value,
            telefono : this.dataForm.controls['telefono'].value,
            celular : this.dataForm.controls['celular'].value,
            direccion : this.dataForm.controls['direccion'].value,
            estado: true
        }

        var resp = await this.apiService.create(intermediario).toPromise()
        .then(res => {
            /*if(res && res["id"] != "0"){
                this.showNotification("success", res["message"]);
                this.flagViewCards.emit("reload");
            }*/
        })
        .catch((err) => {
           // this.showNotification("error", "Error al crear un Intermediario");
        });
        
    }

    async editRegistro(){
        var inter: Paciente = {
            pacienteId: this.data.pacienteId,
            nombres : this.dataForm.controls['nombres'].value,
            apellidos : this.dataForm.controls['apellidos'].value,
            identificacion : this.dataForm.controls['identificacion'].value,
            usuario : this.dataForm.controls['usuario'].value.replace(',','.'),
            email : this.dataForm.controls['email'].value,
            edad : this.dataForm.controls['edad'].value,
            telefono : this.dataForm.controls['telefono'].value,
            celular : this.dataForm.controls['celular'].value,
            direccion : this.dataForm.controls['direccion'].value,
            estado: true
        }

        var resp = await this.apiService.edit(inter).toPromise()
        .then(res => {
            /*if(res && res["id"] != "0"){
                this.showNotification("success", res["message"]);
                this.flagViewCards.emit("reload");
            }*/
        })
        .catch((err) => {
            //this.showNotification("error", "Error al editar un Intermediario");
        });
    }

    async resetearClave(){
        
    }
}