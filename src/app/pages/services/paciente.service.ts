import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Paciente, IResponseDataPaciente, Filtro } from "../interfaces/paciente.interface";

@Injectable({
    providedIn: 'root'
  })

  export class PacienteServices {
    token: any;
    public prefix: string = `${environment.services.pacienteService}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    public create(input: Paciente){
        const headers = new HttpHeaders().set('Ahthorization', `Bearer ` + this.token);
        let url_ = `${this.prefix}crear` ;

        return this.http.post<IResponseDataPaciente<Response>>(url_, input, {headers: headers});
    }

    public getAll(filtros: Filtro) {
        let headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token)
        .set('input', filtros.input);
        let url_ = `${this.prefix}getAll` ;

        return this.http.get<IResponseDataPaciente<Paciente[]>>(url_, {headers: headers});
    }

    public edit(input: Paciente) {
        let url_ = `${this.prefix}update` ;
        return this.http.put<IResponseDataPaciente<Response>>(url_, input);
    }

    public getById(id: number) {

        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        return this.http.get<IResponseDataPaciente<Paciente[]>>(`${this.prefix}getById/${id}`, {headers: headers});
    } 
  }