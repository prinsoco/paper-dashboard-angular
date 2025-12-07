export class Especialidad {
    especialidadId?: number;
    descripcion: string;
    observacion?: string;
    estado?: boolean = false;
    usuarioCreacion?: string;
    usuarioModificacion?: string;
}

export interface IResponseDataEspecialidad<T> {
    code:number;
    info:string;
    message:string;
    data: T;
}

export class Filtro{
    input?: string;
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