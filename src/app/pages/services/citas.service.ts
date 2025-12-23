import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Citas, IResponseDataCita, Filtro, Horarios, HorariosMedico } from "../interfaces/citas.interface";
import { Doctor } from "../interfaces/medico.interface";

@Injectable({
    providedIn: 'root'
  })

  export class CitasServices {
    token: any;
    public prefix: string = `${environment.services.horarioServices}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    public getDoctores() {
    return this.http.get<Doctor[]>('assets/data/doctores.json');
  }

  public getHorarios() {
    return this.http.get<Horarios[]>('assets/data/horarios.json');
  }

  public getFeriados() {
    return this.http.get<string[]>('assets/data/feriados.json');
  }

  public getMes() {
    return this.http.get<string[]>('assets/data/meses.json');
  }

  public getAll(fecha: string, doctorId: number) {
          let headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token);
          let url_ = `${this.prefix}getAll` ;
  
          return this.http.get<IResponseDataCita<Citas[]>>(url_, {headers: headers});
      }

   public getAllHorario(medicoId: number, especialidadId: number) {
          let headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token)
          .set('medicoId', medicoId+"")
          .set('especialidadId', especialidadId+"");
          let url_ = `${this.prefix}getAll` ;
  
          return this.http.get<IResponseDataCita<HorariosMedico[]>>(url_, {headers: headers});
      }
}