export class Equipamiento {
  idEquipamiento!: number;
  modelo!: number;
  nroSerie!: string;
  tipoEquipo!: number;
  idPolicial!: string;
  estado!: number;
  unidadPerteneciente!: number;
  nombreUnidad!: string;
  observacion!: string;
  fechaAlta!: any;
  usuarioAlta!: number;
  imei!: string;
  activo: boolean;

  constructor() {
    this.activo = true;
  }
}
