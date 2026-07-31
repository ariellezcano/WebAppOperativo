export class EquipamientoDTO {
  idEquipamiento!: number;
  modelo!: number;
  nombreModelo!: string;
  idMarca!: number;
  nombreMarca!: string;
  nroSerie!: string;
  tipoEquipo!: number;
  nombreTipoEquipo!: string;
  idPolicial!: string;
  estado!: number;
  nombreEstado!: string;
  unidadPerteneciente!: number;
  nombreUnidad!: string;
  fechaAlta: any;
  usuarioAlta!: number;
  nombreUsuarioAlta!: string;
  imei!: string;
  observacion!: string;
  activo: Boolean;

  constructor() {
    this.activo = true;
  }
}
