import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Medico, IResponseDataMedico, Filtro } from "../interfaces/medico.interface";

@Injectable({
    providedIn: 'root'
  })

  export class MedicoServices {
    token: any;
    public prefix: string = `${environment.services.medicoService}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    public create(input: Medico){
        const headers = new HttpHeaders().set('Ahthorization', `Bearer ` + this.token);
        let url_ = `${this.prefix}/crear` ;

        return this.http.post<IResponseDataMedico<Response>>(url_, input, {headers: headers});
    }

    public getMedicos(filtros: Filtro) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        let url_ = `${this.prefix}/getAll` ;

        return this.http.post<IResponseDataMedico<Medico[]>>(url_, filtros, {headers: headers});
    }

    public editMedico(input: Medico) {
        let url_ = `${this.prefix}/update` ;
        return this.http.put<IResponseDataMedico<Response>>(url_, input);
    }

    public getById(id: number) {

        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        return this.http.get<IResponseDataMedico<Medico[]>>(`${this.prefix}/getById/${id}`, {headers: headers});
    } 
  }