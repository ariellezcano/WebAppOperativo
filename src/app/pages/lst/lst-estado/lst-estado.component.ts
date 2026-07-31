import { Component, OnInit, ViewChild } from '@angular/core';
import { FilEstadoComponent } from '../../filtros/fil-estado/fil-estado.component';
import { Estado } from 'src/app/modelos/components/estado';
import { EstadoService } from 'src/app/services/components/estado.service';
import { Router } from '@angular/router';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-lst-estado',
  templateUrl: './lst-estado.component.html',
  styleUrls: ['./lst-estado.component.scss'],
})
export class LstEstadoComponent implements OnInit {
  @ViewChild(FilEstadoComponent, { static: false })
  fil!: FilEstadoComponent;

  item: Estado;
  items: Estado[];

  rol: string = '';

  constructor(
    private wsdl: EstadoService,
    private router: Router,
  ) {
    this.item = new Estado();
    this.items = [];
  }

  ngOnInit(): void {
    const personal = Utils.getSession('personal');

    if (personal) {
      try {
        const obj = JSON.parse(personal);
        this.rol = obj.rol;
      } catch {
        this.rol = '';
      }
    }
  }

  doFound(event: Estado[]) {
    this.items = event;
  }

  linkear(id?: number) {
    this.router.navigateByUrl('pages/abm_estados/' + id);
  }

  back() {
    this.router.navigate(['pages/lst_estados']);
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Desea eliminar el registro?',

      showDenyButton: true,

      confirmButtonText: 'Eliminar',

      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminacion(id);
      }
    });
  }

  async eliminacion(id: number) {
    try {
      const re = await firstValueFrom(this.wsdl.delete(id));

      const result = JSON.parse(JSON.stringify(re));

      if (result.code == '200') {
        Swal.fire('Correcto', '', 'success');

        this.fil.filter();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch {
      Swal.fire('Error', 'No fue posible eliminar', 'error');
    }
  }

  puedeOperar(): boolean {
    return (
      this.rol == 'MANAGER' ||
      this.rol == 'ADMINISTRADOR' ||
      this.rol == 'DEVELOPER'
    );
  }

  puedeEliminar(): boolean {
    return this.rol == 'MANAGER' || this.rol == 'DEVELOPER';
  }
}
