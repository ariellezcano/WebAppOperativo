export class RadioOperativo {
  idDetalleOperativo!: number;

  idEquipamiento!: number;

  idPolicial!: string;

  nroSerie!: string;

  imei?: string | null;

  tipoEquipo!: string;

  modelo!: string;

  marca?: string | null;

  turno?: string | null;

  fechaInicio?: any;

  // ==========================================
  // ESTADO DE ENTREGA
  // ==========================================

  entregado!: boolean;

  // ==========================================
  // DATOS DE LA ENTREGA ACTUAL
  // ==========================================

  idDetalleDistribucion?: number | null;

  idDistribucion?: number | null;

  fechaEntrega?: any;

  dni?: number | null;

  nombre?: string | null;

  apellido?: string | null;

  unidadRecibe?: number | null;

  nombreUnidad?: string | null;
}
