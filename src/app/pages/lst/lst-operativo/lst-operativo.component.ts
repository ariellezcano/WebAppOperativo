import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Operativo } from 'src/app/modelos/components/operativo';
import { OperativoService } from 'src/app/services/components/operativo.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';
import { FilOperativoComponent } from '../../filtros/fil-operativo/fil-operativo.component';

@Component({
  selector: 'app-lst-operativo',
  templateUrl: './lst-operativo.component.html',
  styleUrls: ['./lst-operativo.component.scss'],
})
export class LstOperativoComponent implements OnInit {
  @ViewChild(FilOperativoComponent, { static: false })
  fil!: FilOperativoComponent;

  items: Operativo[] = [];

  rol = '';

  constructor(
    private wsdl: OperativoService,
    private router: Router,
  ) {}

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

  doFound(event: Operativo[]) {
    this.items = event;
  }

  linkear(id?: number) {
    this.router.navigateByUrl('pages/abm_operativos/' + id);
  }

  back() {
    this.router.navigate(['pages/lst_operativos']);
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Está seguro de eliminar este operativo?',

      showDenyButton: true,

      confirmButtonText: 'Eliminar',

      denyButtonText: 'Cancelar',

      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminacion(id);
      } else if (result.isDenied) {
        Swal.fire('Operación cancelada', '', 'info');
      }
    });
  }

  async eliminacion(id: number) {
    try {
      const data = await firstValueFrom(this.wsdl.eliminar(id));

      const result = JSON.parse(JSON.stringify(data));

      if (result.code === '200') {
        Swal.fire({
          icon: 'success',

          title: 'Operación realizada correctamente',

          timer: 1500,

          showConfirmButton: false,
        });

        this.fil.filter();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',

        title: 'Error',

        text: 'No se pudo eliminar el operativo.',
      });
    }
  }

  /* ===============================
            PERMISOS
  =============================== */

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

  equipamientos(id: number) {
    this.router.navigate(['pages/abm_detalle_operativo', id]);
  }
}
