import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Catalogo, IResponseDataCatalogo, Filtro } from "../interfaces/catalogo.interface";

@Injectable({
    providedIn: 'root'
  })

  export class PacienteServices {
    token: any;
    public prefix: string = `${environment.services.catalogoService}`;
    constructor(private http: HttpClient, private route: ActivatedRoute) { this.token = localStorage.getItem("jwt"); }

    public create(input: Catalogo){
        const headers = new HttpHeaders().set('Ahthorization', `Bearer ` + this.token);
        let url_ = `${this.prefix}/crear` ;

        return this.http.post<IResponseDataCatalogo<Response>>(url_, input, {headers: headers});
    }

    public getCatalogos(filtros: Filtro) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        let url_ = `${this.prefix}/getAll` ;

        return this.http.post<IResponseDataCatalogo<Catalogo[]>>(url_, filtros, {headers: headers});
    }

    public editCatalogo(input: Catalogo) {
        let url_ = `${this.prefix}/update` ;
        return this.http.put<IResponseDataCatalogo<Response>>(url_, input);
    }

    public getById(id: number) {

        const headers = new HttpHeaders().set('Authorization', `Bearer ` + this.token); 
        return this.http.get<IResponseDataCatalogo<Catalogo[]>>(`${this.prefix}/getById/${id}`, {headers: headers});
    } 
  }