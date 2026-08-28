export class MovimientoDTO {

  idMovimiento!: number;

  distribucion!: number;

  detalleDistribucion!: number | null;

  equipamiento!: number;

  idPolicial!: string;

  nroSerie!: string;

  imei!: string;

  tipoEquipo!: string;

  marca!: string;

  modelo!: string;

  fechaMovimiento!: Date;

  tipoMovimiento!: string;

  usuario!: number | null;

  nombreUsuario!: string;

  observacion!: string;

  idOperativo!: number;

  denominacionOperativo!: string;

}