import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Perfil, IResponseDataGeneral, Filtro } from "../interfaces/rolxperfil.interface";

@Injectable({
    providedIn: 'root'
  })

  export class PerfilServices {
    token: any;
    public prefix: string = `${environment.services.perfilService}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    public create(input: Perfil){
            const headers = new HttpHeaders().set('Ahthorization', `Bearer ` + this.token);
            let url_ = `${this.prefix}crear` ;
    
            return this.http.post(url_, input, {headers: headers});
        }
    
        public getAll(filtros: Filtro) {
            let headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token)
            let url_ = `${this.prefix}getAll` ;
    
            return this.http.get<IResponseDataGeneral<Perfil[]>>(url_, {headers: headers});
        }
    
        public edit(input: Perfil) {
            let url_ = `${this.prefix}update` ;
            return this.http.put(url_, input);
        }
    
        public getById(id: number) {
    
            const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
            return this.http.get<IResponseDataGeneral<Perfil[]>>(`${this.prefix}getById/${id}`, {headers: headers});
        }
  }