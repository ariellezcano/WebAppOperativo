import { Persona } from './persona';
import { Civil } from './civil';
import { Roles } from "./roles";

export class Usuario_repo {
    id!: number; /**id del usuario en repo */
    usuario!: String;/**nombre del usuario */
    persona: Persona;
    civil: Civil;
    rol: Roles;

    constructor() {
        this.rol = new Roles();
        this.persona = new Persona();
        this.civil = new Civil();
    }

}