import { Component, Input, OnInit } from '@angular/core';
import { CitasServices } from '../../pages/services/citas.service';

@Component({
  selector: 'app-modal-citas',
  templateUrl: './modal-citas-medico.component.html',
  styleUrls: ['./modal-citas-medico.component.scss']
})
export class ModalCitasComponent implements OnInit {

  @Input() doctorId!: number;
  @Input() fecha!: string;

  citas: any[] = [];

  constructor(private apiServices: CitasServices) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas() {
    this.apiServices.getAll(this.fecha, this.doctorId)
      .subscribe(resp => this.citas = resp.data);
  }

  validarNoDuplicado(hora: string): boolean {
    return !this.citas.some(c => c.hora === hora);
  }
}
