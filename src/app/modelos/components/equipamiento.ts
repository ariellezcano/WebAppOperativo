export class Equipamiento {
  idEquipamiento!: number;
  modelo!: number;
  nroSerie!: string;
  tipoEquipo!: number;
  idPolicial!: string;
  estado!: number;
  unidadPerteneciente: number | null = null;
  nombreUnidad: string | null = null;
  observacion!: string;
  fechaAlta!: any;
  usuarioAlta!: number;
  imei!: string;
  activo: boolean;

  //nombreDestino!: string;

  constructor() {
    this.activo = true;
  }
}
