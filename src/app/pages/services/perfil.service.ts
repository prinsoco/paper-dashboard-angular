import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Perfil, IResponseDataPerfil, Filtro } from "../interfaces/rolxperfil.interface";

@Injectable({
    providedIn: 'root'
  })

  export class RolPerfilServices {
    token: any;
    public prefix: string = `${environment.services.perfilService}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    //Manejo de roles
    public create(input: Perfil){
        const headers = new HttpHeaders().set('Ahthorization', `Bearer ` + this.token);
        let url_ = `${this.prefix}/crear` ;

        return this.http.post<IResponseDataPerfil<Response>>(url_, input, {headers: headers});
    }

    public getPerfiles(filtros: Filtro) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        let url_ = `${this.prefix}/getAll` ;

        return this.http.post<IResponseDataPerfil<Perfil[]>>(url_, filtros, {headers: headers});
    }

    public editPerfil(input: Perfil) {
        let url_ = `${this.prefix}/update` ;
        return this.http.put<IResponseDataPerfil<Response>>(url_, input);
    }

    public getById(id: number) {

        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        return this.http.get<IResponseDataPerfil<Perfil[]>>(`${this.prefix}/getById/${id}`, {headers: headers});
    } 
  }