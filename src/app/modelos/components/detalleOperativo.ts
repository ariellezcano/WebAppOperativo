export class DetalleOperativo {
  idDetalleOperativo!: number;

  operativo!: number;

  equipamiento!: number;

  turno!: string;

  baja!: boolean;

  fechaInicio!: Date | null;

  fechaFin!: Date | null;

  usuarioAlta!: number;

  usuarioBaja!: number | null;

  observacion!: string;

  activo: boolean;

  constructor() {
    this.activo = true;
  }
}
