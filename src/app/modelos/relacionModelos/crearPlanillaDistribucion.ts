export interface CrearPlanillaDistribucion {
  idPersona: number;

  dni?: number | null;

  nombre?: string;

  apellido?: string;

  unidadRecibe: number;

  usuarioEntrega: number;

  observacion?: string;

  nombreUnidad: string;

  detalles: DetalleEntrega[];
}

export interface DetalleEntrega {
  detalleOperativo: number;

  equipamiento: number;

  observacion?: string;
}
