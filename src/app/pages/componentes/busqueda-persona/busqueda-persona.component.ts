import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Usuarios } from 'src/app/modelos/index.models';
import { UsuarioRol } from 'src/app/modelos/relacionModelos/usuarioRol';
import { RegistroUsuarioService } from 'src/app/services/components/registro-usuario.service';
import { UsuarioService } from 'src/app/services/components/usuario.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-busqueda-persona',
  templateUrl: './busqueda-persona.component.html',
  styleUrls: ['./busqueda-persona.component.scss'],
})
export class BusquedaPersonaComponent implements OnInit {
  @Output()
  filter: EventEmitter<Usuarios> = new EventEmitter<Usuarios>();

  cargando: Boolean = false;
  procesando: Boolean;
  public search!: string;
  public crit = '';
  public id: any;
  public result: any;
  public rol: any;

  public nombre: string = 'Estadistísticas Policiales (SUED)';
  public url: string = 'https://10.125.31.214/sued/';
  public activoSistema: boolean = true;

  itemBaja!: number;
  item: UsuarioRol;

  constructor(
    private route: Router,
    private wsdl: RegistroUsuarioService,
    private wsdlUsuario: UsuarioService
  ) {
    this.procesando = false;
    this.cargando = false;
    this.item = new UsuarioRol();
  }

  ngOnInit() {}

  public async list() {
    try {
      this.cargando = true;
      this.procesando = true;
      if (this.search != undefined || this.search != '') {
        this.crit = this.search;
      }
      let data = await this.wsdl.BusquedaPorDni(this.crit).then();
      this.result = JSON.parse(JSON.stringify(data));
      if (this.result.code === '200') {
        //console.log("este viene de policia digital:", this.result.data)
        this.id = this.result.data.id_repo;
        //console.log("id policia digital", this.id)
        if(this.id > 0){
          this.verificarUsuario();
        }
        
      } else if (this.result.code == 204) {
        Swal.fire({
          title: 'El usuario no existe!',
          text: 'Si el usuario que está por habilitrar es Personal Policial, por favor comuniquece con el área de Sistemas!, pero si el usuario es Personal Civil, puede crearlo. Al presionar el botón crear, le redirigira al formulario para su creación, pero si ya fue creado debera registrarse en el sistema REPO',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Crear!',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.route.navigate(['/lst-usuarios/abm/0']);
          }
        });
      } else if (this.result.code === '205') {
        this.search = '';
        Swal.fire({
          title: 'El usuario no existe!',
          text: 'Deberá registrarse en el sistema REPO',
          icon: 'warning',
        });
      } else {
        this.filter.emit();
        this.procesando = false;
        this.cargando = false;
        Utils.showToas(this.result.msg, 'error');
      }
    } catch (error) {
      this.procesando = false;
      this.cargando = false;
      Utils.showToas('Error', 'error');
    } finally {
      this.procesando = false;
      this.cargando = false;
    }
  }

  async verificarUsuario() {
    try {
      //console.log("persona", this.id);
      let data1 = await firstValueFrom(this.wsdlUsuario.getId(this.id));
      //alert(data1);
      const result1 = JSON.parse(JSON.stringify(data1));
      if (result1.code === '200') {
        this.item = result1.dato;
        //console.log("verifico contra mi bd", this.item)
        //console.log('this.item', this.item);
        if (this.item.baja) {
          Swal.fire({
            title: 'El usuario se encuentra dado de baja',
            text: 'DESEA HABILITARLO!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si!',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.editBaja();
            }
          });
        } else {
          this.search = '';
          Swal.fire({
            title: 'El usuario ya se encuentra habilitado!',
            showClass: {
              popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',
            },
          });
        }
      }
    } catch (error: any) {
      // Acá se atrapan los 404 o cualquier otro error HTTP
      if (error.status === 404) {
       // const result1 = error.error; // tu objeto JSON del backend
        //alert('AQUI ESTOY'); //ahora sí se va a mostrar
        this.filter.emit(this.result.data);
        this.cargando = false;
        this.procesando = false;
      } else {
        console.error('Error inesperado:', error);
      }
    }
  }

  async editBaja() {
    //fecha y id de quien da de baja
    //this.item.usuarioRepo = Number(Utils.getSession('user'));
    
    this.item.baja = false;
    let data2 = await firstValueFrom(
      this.wsdlUsuario.patch(this.item.idUsuario, this.item)
    );
   // console.log("data 2", data2)
    const result2 = JSON.parse(JSON.stringify(data2));

    if (result2.code === "200") {
      try {
        let data = await this.wsdl
          .patchSistemaHabilitados(
            this.item.usuarioRepo,
            this.nombre,
            this.url,
            this.activoSistema
          )
          .then();
        let res = JSON.parse(JSON.stringify(data));
        if (res.code == 200) {
          console.log("Personal Habilitado");
        }
      } catch (error) {
        ////console.log("respuestaerror", error);
      }

      Swal.fire(
        'Operación Exitosa!',
        'El usuario ha sido habilitado correctamente!',
        'success'
      );
      
      this.back();
    }
  }

  back() {
    this.route.navigate(['pages/lst_usuario']);
  }
}
