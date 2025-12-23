export interface Citas {
  doctorId: number;
  fecha: string; // yyyy-MM-dd
  hora: string;  // HH:mm
  paciente: string;
}

export interface IResponseDataCita<T> {
    code:number;
    info:string;
    message:string;
    data: T;
}

export class Filtro{
    input?: string;
}

export class Horarios{
    doctorId?: number;
    dias?: string[];
    rangos?: {
      desde: string;
      hasta: string;
    }[];
}

//Horarios
export class HorariosMedico
{
    medicoId?: number;
    nombre?: string;
    especialidadId?: number;
    especialidad?: string;
    foto?: string;
    horarioTexto?: string;
    fechaInicioLaboral?: Date;
    fechaFinalLaboral?: Date;
    diasAtencion?: string[] = [];
    horarioLaboral?: HorasLaborales[] = [];
}

export class HorasLaborales
{
    idRango?: number;
    medicoId?: number;
    nombre?: string;
    hora?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
}