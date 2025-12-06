import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Rol, IResponseDataRol, Filtro } from "../interfaces/rolxperfil.interface";

@Injectable({
    providedIn: 'root'
  })

  export class RolPerfilServices {
    token: any;
    public prefix: string = `${environment.services.rolService}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    //Manejo de roles
    public create(input: Rol){
        const headers = new HttpHeaders().set('Ahthorization', `Bearer ` + this.token);
        let url_ = `${this.prefix}/crear` ;

        return this.http.post<IResponseDataRol<Response>>(url_, input, {headers: headers});
    }

    public getRoles(filtros: Filtro) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        let url_ = `${this.prefix}/getAll` ;

        return this.http.post<IResponseDataRol<Rol[]>>(url_, filtros, {headers: headers});
    }

    public editRol(input: Rol) {
        let url_ = `${this.prefix}/update` ;
        return this.http.put<IResponseDataRol<Response>>(url_, input);
    }

    public getById(id: number) {

        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        return this.http.get<IResponseDataRol<Rol[]>>(`${this.prefix}/getById/${id}`, {headers: headers});
    } 
  }