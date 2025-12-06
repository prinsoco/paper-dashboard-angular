export class Perfil {
    PerfilId?: number;
    Descripcion: string;
    Estado: boolean;
    UsuarioCreacion: string;
    UsuarioModificacion: string;
}

export interface IResponseDataPerfil<T> {
    code:number;
    info:string;
    message:string;
    data: T;
}

export class Rol {
    RolId?: number;
    Descripcion: string;
    Estado?: boolean
    UsuarioCreacion: string;
    UsuarioModificacion: string;
}

export interface IResponseDataRol<T> {
    code:number;
    info:string;
    message:string;
    data: T;
}

export class Menu {
    IdMenu: number;
    Menu: string;
    IdRol: number;
    Rol: string;
    Path: string;
    Icono: string;
    Class: string;
}

export interface IResponseDataMenu<T> {
    code:number;
    info:string;
    message:string;
    data: T;
}

export class Filtro{
    tipo?: string;
    codigo?: string;
    estado?: boolean;
}

export class Response{
    mensaje?: string;
    accion: number;
    proceso?: string;
    datos: FilterString[];
}

export class FilterString{
    codigo?: string;
}

