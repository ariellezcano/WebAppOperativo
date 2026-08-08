import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Persona } from 'src/app/modelos/components/persona';
import { Usuarios } from 'src/app/modelos/index.models';
import { RegistroUsuarioService } from 'src/app/services/components/registro-usuario.service';
import { UsuarioService } from 'src/app/services/index.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-fil-busqueda-policia',
  templateUrl: './fil-busqueda-policia.component.html',
  styleUrls: ['./fil-busqueda-policia.component.scss']
})
export class FilBusquedaPoliciaComponent implements OnInit {

  @Output()
    filter: EventEmitter<Persona> = new EventEmitter<Persona>();
  
    cargando: Boolean = false;
    procesando: Boolean;
    public search!: string;
    public crit = '';
    public id: any;
    public result: any;
    public rol: any;
  
    public nombre: string = 'Sistema de Gestión DTI';
    public url: string = 'https://policiadigital.chaco.gob.ar/gestionDTI/#/';
    public activoSistema: boolean = true;
  
    item: Usuarios;
  
    constructor(
      private wsdl: RegistroUsuarioService,
    ) {
      this.procesando = false;
      this.cargando = false;
      this.item = new Usuarios();
    }
  
    ngOnInit() {}
  
    public async buscar() {
      try {
        this.cargando = true;
        this.procesando = true;
        if (this.search != undefined || this.search != '') {
          this.crit = this.search;
        }
        let data = await this.wsdl.BusquedaPorDni(this.crit).then();
        //console.log("data buscada", data)
        let result = JSON.parse(JSON.stringify(data));
        //console.log("result", data)
        if (result.code === '200') {
          
          // let data = result.data.id_persona;
          //console.log("resultado de la busqueda", data)
          this.filter.emit(result);
          this.cargando = false;
          this.procesando = false;
          
        }
      } catch (error) {
       // console.log("error", error);
        this.procesando = false;
        this.cargando = false;
        Utils.showToas('Error', 'error');
      } finally {
        this.procesando = false;
        this.cargando = false;
      }
    }

}
