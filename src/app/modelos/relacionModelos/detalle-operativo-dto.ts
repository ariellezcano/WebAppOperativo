export class DetalleOperativoDTO {
  idDetalleOperativo!: number;

  operativo!: number;
  nombreOperativo!: string;

  equipamiento!: number;

  idPolicial!: string;

  idMarca!: number;
  nombreMarca!: string;

  idModelo!: number;
  nombreModelo!: string;

  idTipoEquipo!: number;
  nombreTipoEquipo!: string;

  turno!: string;

  fechaInicio!: Date | null;
  fechaFin!: Date | null;

  observacion!: string;

  usuarioAlta!: number;
  nombreUsuarioAlta!: string;

  usuarioBaja!: number | null;
  nombreUsuarioBaja!: string;

  baja!: boolean;

  activo!: boolean;

  constructor() {
    this.idDetalleOperativo = 0;

    this.operativo = 0;
    this.nombreOperativo = '';

    this.equipamiento = 0;

    this.idPolicial = '';

    this.idMarca = 0;
    this.nombreMarca = '';

    this.idModelo = 0;
    this.nombreModelo = '';

    this.idTipoEquipo = 0;
    this.nombreTipoEquipo = '';

    this.turno = '';

    this.fechaInicio = null;
    this.fechaFin = null;

    this.observacion = '';

    this.usuarioAlta = 0;
    this.nombreUsuarioAlta = '';

    this.usuarioBaja = null;
    this.nombreUsuarioBaja = '';

    this.baja = false;

    this.activo = true;
  }
}
