import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UsuarioRol } from 'src/app/modelos/relacionModelos/usuarioRol';
import { UsuarioService } from 'src/app/services/components/usuario.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';
import { FilUsuariosComponent } from '../../filtros/fil-usuarios/fil-usuarios.component';

@Component({
  selector: 'app-lst-usuarios',
  templateUrl: './lst-usuarios.component.html',
  styleUrls: ['./lst-usuarios.component.scss']
})
export class LstUsuariosComponent implements OnInit {

   @ViewChild(FilUsuariosComponent, { static: false })
  fil!: FilUsuariosComponent;

  item: UsuarioRol;
  items: UsuarioRol[];
  rol: string;
  constructor(private wsdl: UsuarioService, private route: Router) {
    this.item = new UsuarioRol();
    this.items = [];
    this.rol = '';
  }

  ngOnInit(): void {
    //this.rol = JSON.parse(''+ Utils.getSession('personal')).rol;
  }

  async eliminar(id: any) {
    console.log("id", id)
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Estás seguro?',
        text: 'El registro no se podra recuperar!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar!',
        cancelButtonText: 'Cancelar!',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            
            let usuarioBaja = Number(Utils.getSession('user'));
            const res: any = await firstValueFrom(this.wsdl.delete(id, usuarioBaja));
            const Json = JSON.parse(JSON.stringify(res));

            if (Json.code === '200') {
              this.fil.filter();

              swalWithBootstrapButtons.fire(
                'Eliminado exitosamente!',
                'Tu registro ya no existe.',
                'success'
              );
            }
          } catch (err) {
            console.error('Error al eliminar:', err);
            swalWithBootstrapButtons.fire(
              'Error',
              'No se pudo eliminar el registro.',
              'error'
            );
          }
        }
      });
  }

  

  async editar(id: number, item: any) {
    try {
      let data = await firstValueFrom(this.wsdl.update(id, item));
      const result = JSON.parse(JSON.stringify(data));

      if(result.code === '200'){
        
      }


    } catch (error) {}
  }

  doFound(event: UsuarioRol[]) {
    //console.log('llegue');
    this.items = event;
  }

  linkear(id?: Number) {
    this.route.navigateByUrl('lst-marcas/abm/' + id);
  }

  back() {
    this.route.navigate(['principal']);
  }

  habilitarUsuario() {
    this.route.navigate(['/pages/habilitar_usuario']);
  }

}
