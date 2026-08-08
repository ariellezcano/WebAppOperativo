export class DetalleDistribucion {
  idDetalle!: number;

  distribucion!: number;

  detalleOperativo!: number;

  equipamiento!: number;

  observacion?: string | null;

  baja?: boolean;

  activo: boolean;

  constructor() {
    this.activo = true;
  }
}
