import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitasServices } from '../../pages/services/citas.service';
import { Cita, Citas, CitasMedico, HorariosMedico, HorasLaborales, InfoModal } from '../interfaces/citas.interface';
import { Medico } from '../interfaces/medico.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotifierService } from 'angular-notifier';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-citas',
  templateUrl: './modal-citas-medico.component.html',
  styleUrls: ['./modal-citas-medico.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalCitasComponent implements OnInit {
  @ViewChild('modalConfirmarCita') modalConfirmarCita!: NgbModal;
  @ViewChild('modalSuccess') modalSuccess!: NgbModal;
  @Input() dataInfoCitasHorario: InfoModal;
  dataForm: FormGroup;
  citas: any[] = [];
  horarioLaboral: HorasLaborales[] = [];
  horariosMedico: HorariosMedico[] = [];
  citasProgramada: CitasMedico[] = [];

  constructor(private apiServices: CitasServices,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private notifier: NotifierService,
  ) {}
hora
  ngOnInit(): void {
    this.validateForms();
    this.cargarHorarioCita();
  }

  validateForms(){
         this.dataForm = this.fb.group({
        horario: ['0']
    });

    this.dataForm.controls['horario'].setValue("0");
  }

  async cargarHorarioCita() {
    console.log("this.dataInfoCitasHorario: " + this.dataInfoCitasHorario);
    var response = await this.apiServices.getAllHorario(this.dataInfoCitasHorario.medicoId+"", this.dataInfoCitasHorario.especialidadId+"", "0", this.dataInfoCitasHorario.fechaDia).toPromise();
    this.horariosMedico = response?.data ?? [];
    const resp = this.horariosMedico.filter(r => r.medicoId === this.dataInfoCitasHorario.medicoId && 
      this.fechaLocal(r.fechaInicioLaboral) === this.dataInfoCitasHorario.fechaDia);
      
      if(resp.length > 0){
        //this.horarioLaboral = resp[0].horarioLaboral?.filter(r => this.fechaLocal(r.hora) === this.dataInfoCitasHorario.fechaDia) ?? [];
        this.horarioLaboral = resp[0].horarioLaboral?.filter(r => new Date(r.hora) > new Date()) ?? [];
      }
  }

  private fechaLocal(date: Date | string): string {
    const d = new Date(date);
    console.log(d);
    const y = d.getFullYear();
    console.log(y);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    console.log(m);
    const day = String(d.getDate()).padStart(2, '0');
    console.log(day);
    return `${y}-${m}-${day}`;
  }

  cargarCitas() {
    console.log(this.dataInfoCitasHorario);
    /*this.horarioLaboral = this.dataInfoCitasHorario.horarioLaboral.filter(r => {

        const existeCita = this.dataInfoCitasHorario.citaMedico.some(cita =>
          cita.fechaCita === r.hora &&
          cita.medicoId === r.medicoId 
        );

        return !existeCita; // ❌ excluir los que ya tienen cita
      });*/
  }

  cerrar(){
        this.modalService.dismissAll();
  }

  async agregarCita(){
        //this.spinner.show();
        const rangoCita = this.dataForm.controls['horario'].value;

        if(rangoCita != "0"){
          var itemCita = this.horarioLaboral.find(r => r.idRango == parseInt(rangoCita));
          if(new Date() > new Date(itemCita.hora)){
            this.showNotificationLabel(3, "top","right", "No se puede agendar una cita, hora actual es mayor a la hora seleccionada.");
          }
          else{
            var citaNew: Cita = {
              medicoId: itemCita.medicoId,
              pacienteId: this.dataInfoCitasHorario.pacienteId,
              usuarioCreacion: "admin",
              fechaCita: itemCita.hora
            };

            var resp = await this.apiServices.create(citaNew).toPromise()
            .then(rdata => {
                //this.spinner.hide();
                const id = rdata["id"];
                if(id === -9999 || id === -1111 || id === 0)
                {
                  this.showNotificationLabel(3, "top","right", rdata["message"]);
                }
                else{
                    this.showNotificationLabel(2, "top","right", rdata["message"]);
                    this.cerrar();
                }
                
                
            }).catch((err) => {
                //this.spinner.hide();
                this.showNotificationLabel(4, "top","right", err["message"]);
            });
          }
        }
        else{
          this.showNotificationLabel(3, "top","right", "Debe seleccionar un horario, para agendar");
        }
    }

    public showNotification( type: string, message: string ): void {
      this.notifier.notify( type, message );
    }

    showNotificationLabel(color: number, from, align, mensaje: string) {

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

async validarCita(){
    const resp = this.horariosMedico.filter(r => r.medicoId === this.dataInfoCitasHorario.medicoId && 
      this.fechaLocal(r.fechaInicioLaboral) === this.dataInfoCitasHorario.fechaDia);
      
      if(resp.length > 0){
        this.citasProgramada = resp[0].citas?.filter(r => this.fechaLocal(r.fechaCita) === this.dataInfoCitasHorario.fechaDia
                                                      && r.pacienteId === this.dataInfoCitasHorario.pacienteId) ?? [];

        if(this.citasProgramada != null && this.citasProgramada.length > 0){
          this.abrirModalConfirmacion(this.citasProgramada[0].citaId);
        }
        else{
          this.agregarCita();
        }
      }
}

abrirModalConfirmacion(citaId?: number){
  Swal.fire({
    title: 'Confirmación nueva cita',
    text: '¿Está seguro que desea cancelar la cita actual y agendar la cita con el nuevo horario?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then(result => {
    if (result.isConfirmed) {
      this.actualizarCita(citaId);
    }
  });
}

async actualizarCita(citaId?: number){
        const rangoCita = this.dataForm.controls['horario'].value;

        if(rangoCita != "0"){
          var itemCita = this.horarioLaboral.find(r => r.idRango == parseInt(rangoCita));

            var citaNew: Cita = {
              citaId: citaId,
              medicoId: itemCita.medicoId,
              pacienteId: this.dataInfoCitasHorario.pacienteId,
              usuarioModificacion: "admin",
              fechaCita: itemCita.hora,
              estadoCita: "CANC"
            };

            var resp = await this.apiServices.edit(citaNew).toPromise()
            .then(rdata => {
                //this.spinner.hide();
                if(rdata["id"] == 0)
                {
                  this.agregarCita();
                }
                
            }).catch((err) => {
                //this.spinner.hide();
                this.showNotificationLabel(4, "top","right", err["message"]);
            });
        }
        else{
          this.showNotificationLabel(3, "top","right", "Debe seleccionar un horario, para agendar");
        }
    }
}
