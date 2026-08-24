export interface DetalleDistribucionDTO {

  idDetalle: number;

  distribucion: number;

  detalleOperativo: number;

  equipamiento: number;

  idPolicial?: string;

  nroSerie?: string;

  imei?: string;

  tipoEquipo?: string;

  marca?: string;

  modelo?: string;

  observacion?: string;

  baja: boolean;

  activo: boolean;

  fechaEntrega?: Date;

  idPersona?: number;

  dni?: number;

  nombre?: string;

  apellido?: string;

  unidadRecibe?: number;

  nombreUnidad?: string;

  estadoEntrega?: number;

  usuarioEntrega?: number;

  usuarioRecibe?: number;

  fechaRecepcion?: Date;

  observacionEntrega?: string;

}
