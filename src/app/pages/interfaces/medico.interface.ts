export class Medico {
    MedicoId?: number;
    EspecialidadId?: number;
    DescEspecialidad?: string;
    PerfilId?: number;
    DescPerfil?: string;
    Nombres: string;
    Apellidos: string;
    Identificacion: string;
    Email: string;
    Edad: number;
    Usuario: string;
    Telefono: string;
    Celular: string;
    Direccion: string;
    Estado: boolean;
    UsuarioCreacion?: string;
    UsuarioModificacion?: string;
}

export interface IResponseDataMedico<T> {
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