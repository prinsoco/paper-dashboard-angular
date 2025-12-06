import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Usuario, IResponseDataUsuario, Filtro } from "../interfaces/usuario.interface";

@Injectable({
    providedIn: 'root'
  })

  export class PacienteServices {
    token: any;
    public prefix: string = `${environment.services.usuarioService}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    public create(input: Usuario){
        const headers = new HttpHeaders().set('Ahthorization', `Bearer ` + this.token);
        let url_ = `${this.prefix}/crear` ;

        return this.http.post<IResponseDataUsuario<Response>>(url_, input, {headers: headers});
    }

    public getUsuarios(filtros: Filtro) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        let url_ = `${this.prefix}/getAll` ;

        return this.http.post<IResponseDataUsuario<Usuario[]>>(url_, filtros, {headers: headers});
    }

    public editUsuario(input: Usuario) {
        let url_ = `${this.prefix}/update` ;
        return this.http.put<IResponseDataUsuario<Response>>(url_, input);
    }

    public getById(id: number) {

        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        return this.http.get<IResponseDataUsuario<Usuario[]>>(`${this.prefix}/getById/${id}`, {headers: headers});
    } 
  }