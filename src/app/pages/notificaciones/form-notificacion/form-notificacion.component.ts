import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { NotifierService } from 'angular-notifier';
//import { NgxSpinnerService } from 'ngx-spinner';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger, query, group } from '@angular/animations';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
//CKEDITOR
import { CKEditorComponent } from 'ng2-ckeditor';
//import { tree } from 'd3';
import { ToastrService } from "ngx-toastr";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Notificaciones, FiltroNoti, FilterString } from '../../interfaces/notificacion.interface';
import { environment } from '../../../../environments/environment';
import { NotificacionesServices } from '../../services/notificacion.service';

@Component({
    selector: 'app-form-notificacion',
    templateUrl: './form-notificacion.component.html',
    encapsulation: ViewEncapsulation.None
})

export class FormNotificacionComponent implements OnInit {
    @Input() breadcumb: string = "";
    @Input() action: string = "";
    @Input() data: Notificaciones;

    @Output() flagViewCards = new EventEmitter<string>();
    @ViewChild(FormNotificacionComponent) table: FormNotificacionComponent | any;
    
    titleForm : string;
    active = 1;
    dataForm: FormGroup;
    htmlPreview: SafeHtml;
    valueContentCorreo: string;

    //ckeditor
  myTextarea2 = "";
  myTextarea3 = "";
  @ViewChild('dataContainer') dataContainer: ElementRef | any;

  @ViewChild('myTextArea') myTextArea: ElementRef | any;

  @ViewChild('myTextArea') _textArea: ElementRef | any;

  ckeConfig: CKEDITOR.config;
  @ViewChild('ckeditor1', { static: false }) ckeditor1: CKEditorComponent;

    constructor(
        private fb: FormBuilder,
        private apiService: NotificacionesServices,
        private toastr: ToastrService,
        private sanitizer: DomSanitizer) {
            this.titleForm = "Agregar";
    }

    ngOnInit() {
       console.log("Formulario");
        this.validateForms();

        this.ckeConfig = {

      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      removePlugins: 'exportpdf',
      width: '100%',
      height: '500px',
      toolbarGroups: [
          { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
          { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
          { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
          { name: 'forms' },
          '/',
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
          { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
          { name: 'links' },
          { name: 'insert' },
          '/',
          { name: 'styles' },
          { name: 'colors' },
          { name: 'tools' },
          { name: 'others' },
          { name: 'about' }
      ],
      removeButtons: "ExportPdf,Preview,Print,Cut,Copy,PasteText,Undo,Redo,Checkbox,TextField,Textarea,Select,Button,ImageButton,HiddenField,PasteFromWord,NewPage,ElementsPath,Save,Templates,Find,Replace,Scayt,SelectAll,Form,Radio"
    };
    }

    Configuracion(editor: CKEDITOR.editor){
    if(editor){
      editor.config.height = "400";
      editor.config.allowedContent = true;
      editor.config.toolbarGroups = [
          { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
          { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
          { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
          { name: 'forms' },
          '/',
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
          { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
          { name: 'links' },
          { name: 'insert' },
          '/',
          { name: 'styles' },
          { name: 'colors' },
          { name: 'tools' },
          { name: 'others' },
          { name: 'about' }
      ];
      editor.config.removeButtons = "ExportPdf,Preview,Print,Cut,Copy,PasteText,Undo,Redo,Checkbox,TextField,Textarea,Select,Button,ImageButton,HiddenField,PasteFromWord,NewPage,ElementsPath,Save,Templates,Find,Replace,Scayt,SelectAll,Form,Radio";
    } 
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
                    codigo: ['', [Validators.required]],
                    tipo: ['', [Validators.required]],
                    canal: ['', [Validators.required]]
                });
                break;
            case 'edit':
                this.active = 1;
                this.titleForm = "Editar";
                this.dataForm = this.fb.group({
                    codigo: [this.data.codigo, [Validators.required]],
                    tipo: [this.data.tipo, [Validators.required]],
                    canal: [this.data.canal, [Validators.required]]
                });
                break;
            default:
                break;
        }
    }

    async createRegistro(){
        var insertarData: Notificaciones = {
            notificacionId : 0,
            codigo : this.dataForm.controls['codigo'].value,
            tipo : this.dataForm.controls['tipo'].value,
            canal : this.dataForm.controls['canal'].value,
            plantilla : this.valueContentCorreo,
            usuarioCreacion : "admin",
            estado: true
        }

        var resp = await this.apiService.create(insertarData).toPromise()
        .then(res => {
            if(res && res["id"] != "0"){
                this.showNotification(2, "top", "right", res["message"]);//"success", );
                this.flagViewCards.emit("reload");
            }
        })
        .catch((err) => {
            this.showNotification(4, "top","right", "Error al registrar la información");
        });
        
    }

    async editRegistro(){
        var editData: Notificaciones = {
            notificacionId: this.data.notificacionId,
            codigo : this.dataForm.controls['codigo'].value,
            tipo : this.dataForm.controls['tipo'].value,
            canal : this.dataForm.controls['canal'].value,
            plantilla : this.valueContentCorreo,
            usuarioCreacion : "admin",
            usuarioModificacion : "admin",
            estado: true
        }

        var resp = await this.apiService.edit(editData).toPromise()
        .then(res => {
            if(res && res["id"] != "0"){
                this.showNotification(2, "top", "right", res["message"]);
                this.flagViewCards.emit("reload");
            }
        })
        .catch((err) => {
            this.showNotification(4, "top", "right", "Error al editar el registro");
        });
    }

    async resetearClave(){
        
    }

    preview(event: KeyboardEvent){
      const htmlbase = this.dataForm.controls["plantilla"].value;
    
      this.myTextarea3 = htmlbase;
      this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(htmlbase);
    }

    showNotification(color: number, from, align, mensaje: string) {

    switch (color) {
      case 1:
        this.toastr.info(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 2:
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 3:
        this.toastr.warning(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 4:
        this.toastr.error(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 5:
        this.toastr.show(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-primary alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      default:
        break;
    }
  }

  soloNumeros(event: KeyboardEvent) {
        const pattern = /^[0-9]$/;
        const inputChar = event.key;

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
}