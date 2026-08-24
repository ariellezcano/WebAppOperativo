import { DetalleDistribucion } from './detalleDistribucion';

export class PlanillaDistribucion {
  idDistribucion!: number;

  fechaEntrega: any;

  idPersona!: number;

  dni?: number | null;

  nombre?: string | null;

  apellido?: string | null;

  unidadRecibe!: number;

  nombreUnidad!: string;

  estadoEntrega!: number;

  usuarioEntrega!: number;

  usuarioRecibe?: number | null;

  fechaRecepcion?: Date | null;

  baja?: boolean;

  observacion?: string | null;

  activo: boolean;

  // Lista de radios entregadas
  detalles: DetalleDistribucion[];

  constructor() {
    this.activo = true;
    this.detalles = [];
  }
}
