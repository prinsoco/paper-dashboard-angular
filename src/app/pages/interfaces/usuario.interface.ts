//Usuario
export class Usuario {
    UsuarioId: number;
    Usuario: string;
    PerfilId: number;
    Perfil: string;
    Nombres: string;
    Apellidos: string;
    Identificacion: string;
    Email: string;
    Edad: number;
    Telefono: string;
    Celular: string;
    Direccion: string;
    Estado: boolean;
}

export interface IResponseDataUsuario<T> {
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

export class Perfil {
    PerfilId?: number;
    Descripcion: string;
    Estado: boolean;
    UsuarioCreacion: string;
    UsuarioModificacion: string;
}

export class Rol {
    RolId?: number;
    Descripcion: string;
    Estado?: boolean
    UsuarioCreacion: string;
    UsuarioModificacion: string;
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

