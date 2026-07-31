import { Component, OnInit, ViewChild } from '@angular/core';
import { FilTipoEquipoComponent } from '../../filtros/fil-tipo-equipo/fil-tipo-equipo.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { Utils } from 'src/app/utils/utils';
import { TipoEquipo } from 'src/app/modelos/components/tipoEquipo';
import { TipoEquipoService } from 'src/app/services/components/tipo-equipo.service';

@Component({
  selector: 'app-lst-tipo-equipo',
  templateUrl: './lst-tipo-equipo.component.html',
  styleUrls: ['./lst-tipo-equipo.component.scss'],
})
export class LstTipoEquipoComponent implements OnInit {
  @ViewChild(FilTipoEquipoComponent, { static: false })
  fil!: FilTipoEquipoComponent;

  item: TipoEquipo;
  items: TipoEquipo[];
  rol: string = '';

  constructor(
    private wsdl: TipoEquipoService,
    private route: Router,
  ) {
    this.item = new TipoEquipo();
    this.items = [];
  }

  ngOnInit(): void {
    const personal = Utils.getSession('personal');

    if (personal) {
      try {
        const obj = JSON.parse(personal);
        this.rol = obj.rol || '';
      } catch {
        this.rol = '';
      }
    }
  }

  doFound(event: TipoEquipo[]) {
    this.items = event;
  }

  linkear(id?: Number) {
    this.route.navigateByUrl('pages/abm_tipoEquipo/' + id);
  }

  back() {
    this.route.navigate(['pages/lst_tipoEquipo']);
  }

  async eliminar(id: number) {
    Swal.fire({
      title: 'Estás seguro de eliminar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.eliminacion(id);
      } else if (result.isDenied) {
        Swal.fire('Operacion cancelada', '', 'info');
      }
    });
  }

  async eliminacion(id: number) {
    try {
      const data = await firstValueFrom(this.wsdl.delete(id));
      const result = JSON.parse(JSON.stringify(data));
      console.log('resultado', result);
      if (result.code === '200') {
        Swal.fire('Operación realizada...', '', 'success');
        this.back();
        this.fil.filter();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch (error: any) {
      if (error.status == '500') {
        Swal.fire({
          title: 'Error al crear registro, verifique!',
          icon: 'error',
        });
      }
    }
  }

  /* =========================
   PERMISOS
========================= */

  puedeOperar(): boolean {
    return (
      this.rol === 'MANAGER' ||
      this.rol === 'DEVELOPER' ||
      this.rol === 'ADMINISTRADOR'
    );
  }

  puedeEliminar(): boolean {
    return this.rol === 'MANAGER' || this.rol === 'DEVELOPER';
  }
}
