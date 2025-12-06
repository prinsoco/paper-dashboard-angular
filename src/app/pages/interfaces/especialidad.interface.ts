export class Especialidad {
    EspecialidadId?: number;
    Descripcion: string;
    Observacion?: string;
    Estado?: boolean = false;
    Usuario?: string;
    UsuarioModificacion?: string;
}

export interface IResponseDataEspecialidad<T> {
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