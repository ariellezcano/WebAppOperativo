export interface DetalleDistribucionDTO {

  idDetalle: number;

  distribucion: number;

  detalleOperativo: number;

  equipamiento: number;

  idPolicial: string | null;

  nroSerie: string | null;

  imei: string | null;

  tipoEquipo: string | null;

  modelo: string | null;

  marca: string | null;

  observacion: string | null;

  baja: boolean;

  activo: boolean;

}
