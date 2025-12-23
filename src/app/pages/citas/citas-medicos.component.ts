import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { HttpClient } from '@angular/common/http';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Doctor } from '../interfaces/medico.interface';
import { CitasServices } from '../services/citas.service';
import { Horarios, HorariosMedico } from '../interfaces/citas.interface';
import { ModalCitasComponent } from '../citas/modal-citas-medico.component';
import { NumberSymbol } from '@angular/common';

@Component({
  selector: 'app-calendario',
  templateUrl: './citas-medicos.component.html',
  styleUrls: ['./citas-medicos.component.scss'],
})
export class CalendarioComponent implements OnInit {

  doctores: Doctor[] = [];
  feriados: string[] = [];
  meses: string[] = [];
  horarios: Horarios[] = [];
  citas: any[] = [];
  horariosMedico: HorariosMedico[] = [];

  calendarOptions!: CalendarOptions;

  constructor(private apiServices: CitasServices) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.configurarCalendarioInitial();
    this.generarHorarios(0,0);
    
  }

  cargarDatos() {
    /*this.apiServices.getDoctores().subscribe(r => {
      //this.doctores = r;
      console.log(r);
    });*/
    this.doctores = [
      {
        id: 1,
        nombre: 'Dr. Juan Pérez',
        especialidad: 'Cardiología',
        foto: 'assets/img/logo-small.png',
        horarioTexto: '09:00 - 13:00 / 15:00 - 19:00',
        diasAtencion: [1,2,3,4,5,15,16,17]
      },
      {
        id: 2,
        nombre: 'Dra. Ana Torres',
        especialidad: 'Pediatría',
        foto: 'assets/img/logo-small.png',
        horarioTexto: '08:00 - 14:00',
        diasAtencion: [1,3,5,19]
      }
    ];
    
    /*this.apiServices.getFeriados().subscribe(r => {
      //this.feriados = r;
      console.log(r);
    });*/
    this.feriados = [
      "2025-01-01",
      "2025-05-01",
      "2025-12-25",
      "2025-12-19",
      "2026-01-01",
      "2026-01-02"
    ]

    this.apiServices.getMes().subscribe(r => {
      //this.meses = r;
      console.log(r);
    });

    this.apiServices.getHorarios().subscribe(r => {
      //this.horarios = r;
      console.log(r);
    });

    this.citas = [
      { doctorId: 1, fecha: '2025-03-05', hora: '09:00', paciente: 'Carlos M.' },
      { doctorId: 1, fecha: '2025-03-05', hora: '10:00', paciente: 'María G.' }
    ];

  }

  generarHorarios(medicoId: number, especialidadId: number){
    this.apiServices.getAllHorario(medicoId, especialidadId).subscribe(response => {
      this.horariosMedico = response.data;
      console.log(this.horariosMedico);
      this.configurarCalendarioDato();
    }, err => {
      console.error(err);
    });
  }

  configurarCalendarioDato() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: 'dayGridWeek',
      locale: 'es',
      height: '500px',

      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: '' // user can switch between the two
      },

      allDaySlot: false,
      displayEventTime: false,

      events: this.generarEventos(),

      eventClick: (info) => {
        const doctorId = info.event.extendedProps['doctorId'];
        const fecha = info.event.startStr;
        this.abrirModal(doctorId, fecha);
      },

      eventContent: this.renderDoctorEvent.bind(this),
      dayCellDidMount: (arg) => {
        const fecha = arg.date.toISOString().substring(0, 10);
        if (this.feriados.includes(fecha)) {
          const styleDay = arg.el.classList.value?.split(' ');
          //styleDay.forEach(r => arg.el.classList.replace(r.trim(), ''));
          for (let index = 0; index < styleDay.length; index++) {
            const element = styleDay[index];
            arg.el.classList.remove(element);
          }
          //arg.el.classList.replace(styleDay, 'fc-dia-feriado');
          arg.el.classList.add('fc-dia-feriado');
        }
      }
    };
  }

  configurarCalendarioInitial() {
    /*this.calendarOptions = {
      initialView: 'dayGridMonth',
      locale: 'es',
      showNonCurrentDates: false,
      fixedWeekCount: false,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      dayCellDidMount: (info) => {
        if (this.feriados.includes(info.date.toISOString().split('T')[0])) {
          info.el.classList.add('dia-bloqueado');
        }
      },
      plugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin
      ]
    };*/
    /*this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: 'dayGridMonth',
      locale: 'es',
      height: 'auto',

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },

      displayEventTime: false,
      dayMaxEvents: false,

      events: this.generarEventos(),

      eventClick: (info) => {
        const doctorId = info.event.extendedProps['doctorId'];
        const fecha = info.event.startStr;
        this.abrirModal(doctorId, fecha);
      },

      eventContent: this.renderDoctorEvent.bind(this)
    };*/
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: 'dayGridWeek',
      locale: 'es',
      height: '500px',

      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: '' // user can switch between the two
      },

      allDaySlot: false,
      displayEventTime: false
    };
  }

  colorCalender(): string{
      return "#FFFFFF"
  }

  generarEventos(): any[] {
    const eventos: any[] = [];
    const hoy = new Date();
    let anio = hoy.getFullYear();
    let mes = hoy.getMonth();

    for (let cont = 0; cont <= 2; cont++) {

      if(cont > 0)
      {
        anio = mes === 12 ? anio + 1 : anio;
        mes = mes === 12 ? 1 : mes + 1;
      }

      const diasMes = new Date(anio, mes, 0).getDate();

      console.log("anio: " + anio);
      console.log("mes: " + mes);
      console.log("diasMes: " + diasMes);

      for (let d = 1; d <= diasMes; d++) {
        const fecha = new Date(anio, mes - 1, d);
        const diaSemana = fecha.getDay()+"";

        console.log("fecha: " + fecha);
        console.log("diaSemana: " + diaSemana);

        this.horariosMedico.forEach(doc => {
          console.log("doc: " + doc);
          if(this.fechaLocal(doc.fechaInicioLaboral) === this.fechaLocal(fecha))
          {
            if (doc.diasAtencion.includes(diaSemana)) {
              const citasDia = this.citas.filter(c =>
                c.doctorId === doc.medicoId &&
                c.fecha === fecha.toISOString().substring(0, 10)
              );

              eventos.push({
                title: doc.nombre,
                start: fecha,
                allDay: true,
                extendedProps: {
                  doctorId: doc.medicoId,
                  especialidad: doc.especialidad,
                  foto: doc.foto,
                  horario: doc.horarioTexto,
                  totalCitas: citasDia.length,
                  fechaCalendario: fecha
                }
              });
            }
          }
        });
        /*this.doctores.forEach(doc => {
          if (doc.diasAtencion.includes(diaSemana)) {
            const citasDia = this.citas.filter(c =>
              c.doctorId === doc.id &&
              c.fecha === fecha.toISOString().substring(0, 10)
            );

            eventos.push({
              title: doc.nombre,
              start: fecha,
              allDay: true,
              extendedProps: {
                doctorId: doc.id,
                especialidad: doc.especialidad,
                foto: doc.foto,
                horario: doc.horarioTexto,
                totalCitas: citasDia.length
              }
            });
          }
        });*/
      }
    }
    return eventos;
  }

 /* eventosPorDia() {
  const eventos: any[] = [];

  this.diasCalendario.forEach(fecha => {
    this.doctores.forEach(doc => {
      if (this.doctorAtiendeEseDia(doc, fecha)) {
        const citasDia = this.obtenerCitas(doc.id, fecha);

        eventos.push({
          title: doc.nombre,
          start: fecha,
          allDay: true,
          extendedProps: {
            doctorId: doc.id,
            especialidad: doc.especialidad,
            foto: doc.foto,
            horario: doc.horarioTexto,
            totalCitas: citasDia.length
          }
        });
      }
    });
  });

  return eventos;
}*/

  renderDoctorEvent(arg: any) {
    const { foto, especialidad, horario, totalCitas, fechaCalendario } = arg.event.extendedProps;

    return {
      html: `
        <div class="doctor-card">
          <img src="${foto}" style="width: 45px;" />
          <div class="info">
            <strong>${arg.event.title}</strong>
            <small>${especialidad}</small>
            <small>${horario}</small>
            <span class="badge">${totalCitas} citas</span>
          </div>
        </div>
      `
    };
  }

  abrirModal(doctorId: number, fecha: string) {
    /*const citasDia = this.citas.filter(c =>
      c.doctorId === doctorId &&
      c.fecha === fecha.substring(0, 10)
    );

    this.dialog.open(ModalCitasComponent, {
      width: '450px',
      data: { citas: citasDia }
    });*/
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

}
