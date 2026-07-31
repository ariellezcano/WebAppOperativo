export class TipoEquipo {

    idTipoEquipo!: number;
    nombre!: string;
    activo: boolean;

    constructor(){
        this.activo = true;
    }
}