export class Operativo {
  idOperativo!: number;
  denominacion!: string;
  activo: boolean;

  constructor() {
    this.activo = true;
  }
}
