import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Especialidad, IResponseDataEspecialidad, Filtro } from "../interfaces/especialidad.interface";

@Injectable({
    providedIn: 'root'
  })

  export class EspecialidadServices {
    token: any;
    public prefix: string = `${environment.services.especialidadService}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    public create(input: Especialidad){
        const headers = new HttpHeaders().set('Ahthorization', `Bearer ` + this.token);
        let url_ = `${this.prefix}/crear` ;

        return this.http.post<IResponseDataEspecialidad<Response>>(url_, input, {headers: headers});
    }

    public getEspecialidades(filtros: Filtro) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        let url_ = `${this.prefix}/getAll` ;

        return this.http.post<IResponseDataEspecialidad<Especialidad[]>>(url_, filtros, {headers: headers});
    }

    public editEspecialidad(input: Especialidad) {
        let url_ = `${this.prefix}/update` ;
        return this.http.put<IResponseDataEspecialidad<Response>>(url_, input);
    }

    public getById(id: number) {

        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        return this.http.get<IResponseDataEspecialidad<Especialidad[]>>(`${this.prefix}/getById/${id}`, {headers: headers});
    } 
  }