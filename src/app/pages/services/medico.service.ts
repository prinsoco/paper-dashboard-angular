import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Medico, IResponseDataMedico, Filtro, FiltroMedico } from "../interfaces/medico.interface";

@Injectable({
    providedIn: 'root'
  })

  export class MedicoServices {
    token: any;
    public prefix: string = `${environment.services.medicoService}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    public create(input: Medico){
        const headers = new HttpHeaders().set('Ahthorization', `Bearer ` + this.token);
        let url_ = `${this.prefix}crear` ;

        return this.http.post(url_, input, {headers: headers});
    }

    public getAll(filtroMed: FiltroMedico) {
        let headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token)
        .set('input', filtroMed?.input ?? "")
        .set('especialidadId', filtroMed?.especialidadId ?? "")
        .set('combo', filtroMed?.combo ?? "")
        .set('identificacion', filtroMed?.identificacion ?? "");

        let url_ = `${this.prefix}getAll` ;

        return this.http.get<IResponseDataMedico<Medico[]>>(url_, {headers: headers});
    }

    public edit(input: Medico) {
        let url_ = `${this.prefix}update` ;
        return this.http.put(url_, input);
    }

    public getById(id: number) {

        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        return this.http.get<IResponseDataMedico<Medico[]>>(`${this.prefix}getById/${id}`, {headers: headers});
    } 

    public getByUser(user: string) {
    
        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token)
        .set('user', user); 
        return this.http.get<IResponseDataMedico<Medico>>(`${this.prefix}getByUser`, {headers: headers});
    }
}