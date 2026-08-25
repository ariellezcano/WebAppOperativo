export class DetalleDistribucionDTO {
  // DETALLE
  idDetalle!: number;

  distribucion!: number;

  detalleOperativo!: number;

  equipamiento!: number;

  observacion?: string;

  estadoDetalle!: number;

  usuarioRecibeDetalle!: string | null;

  fechaRecepcionDetalle!: Date | null;

  usuarioAnula!: string | null;

  fechaAnulacion!: Date | null;

  baja!: boolean;

  activo!: boolean;

  // EQUIPAMIENTO
  idPolicial?: string;

  nroSerie?: string;

  imei?: string;

  tipoEquipo?: string;

  marca?: string;

  modelo?: string;

  // PLANILLA DISTRIBUCION
  fechaEntrega?: Date;

  idPersona?: number;

  dni?: number;

  nombre?: string;

  apellido?: string;

  unidadRecibe?: number;

  nombreUnidad?: string;

  estadoPlanilla!: number;

  usuarioEntrega?: number;

  usuarioRecibePlanilla!: number | null;

  fechaRecepcionPlanilla!: Date | null;

  observacionEntrega?: string;
}
