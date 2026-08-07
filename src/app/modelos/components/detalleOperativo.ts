export class DetalleOperativo {
  idDetalleOperativo!: number;

  operativo!: number;

  equipamiento!: number;

  turno!: string;

  baja!: boolean;

  fechaInicio: any;
  fechaFin: any;

  usuarioAlta!: number;

  usuarioBaja!: number | null;

  observacion!: string;

  activo: boolean;

  constructor() {
    this.activo = true;
  }
}
