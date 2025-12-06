export class Catalogo {
    CatalogoId?: number;
    Tipo: string;
    Codigo: string;
    Descripcion: string;
    Estado: boolean;
    Usuario?: string;
    UsuarioModificacion?: string;
}


export interface IResponseDataCatalogo<T> {
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