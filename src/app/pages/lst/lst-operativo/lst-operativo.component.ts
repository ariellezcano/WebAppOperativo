import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Operativo } from 'src/app/modelos/components/operativo';
import { OperativoService } from 'src/app/services/components/operativo.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';
import { FilOperativoComponent } from '../../filtros/fil-operativo/fil-operativo.component';
import { PlanillaDistribucionService } from 'src/app/services/components/planilla-distribucion.service';

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
    private wsdlPlanilla: PlanillaDistribucionService,
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

  async cerrarOperativo(item: Operativo): Promise<void> {
  const usuarioBaja = Number(Utils.getSession('user'));

  if (!usuarioBaja) {
    Swal.fire({
      icon: 'warning',
      title: 'Usuario no válido',
      text: 'No se pudo identificar al usuario.',
      confirmButtonText: 'Aceptar',
    });

    return;
  }

  const confirmacion = await Swal.fire({
    title: '¿Cerrar operativo?',

    html: `
      <div class="text-start">

        <p>
          Se cerrará el operativo:
        </p>

        <p class="fw-bold">
          ${item.denominacion}
        </p>

        <div class="alert alert-warning">
          El sistema verificará que no existan
          equipos pendientes de recepción.
        </div>

        <div class="alert alert-info mb-0">
          Los equipos afectados al operativo
          volverán al estado
          <strong>DISPONIBLE</strong>.
        </div>

      </div>
    `,

    icon: 'warning',

    showCancelButton: true,

    confirmButtonText: 'Sí, cerrar',

    cancelButtonText: 'Cancelar',

    confirmButtonColor: '#fd7e14',

    reverseButtons: true,
  });

  if (!confirmacion.isConfirmed) {
    return;
  }

  try {
    const re = await firstValueFrom(
      this.wsdlPlanilla.cerrarOperativo(
        item.idOperativo!,
        usuarioBaja,
      ),
    );

    const result = JSON.parse(JSON.stringify(re));

    if (result.code === '200') {
      await Swal.fire({
        icon: 'success',
        title: 'Operativo cerrado',
        text:
          result.message ||
          'Operativo cerrado correctamente.',
        confirmButtonText: 'Aceptar',
      });

      // =====================================
      // RECARGAR FILTRO / LISTADO
      // SIN HACER F5
      // =====================================

      await this.fil.filter();

      return;
    }

    Swal.fire({
      icon: 'warning',
      title: 'No se puede cerrar',
      text:
        result.message ||
        'No se pudo cerrar el operativo.',
      confirmButtonText: 'Aceptar',
    });
  } catch (error: any) {
    console.error(
      'Error cerrando operativo:',
      error,
    );

    let mensaje =
      'No se pudo cerrar el operativo.';

    if (error?.error) {
      try {
        const err =
          typeof error.error === 'string'
            ? JSON.parse(error.error)
            : error.error;

        mensaje =
          err?.message ||
          mensaje;
      } catch {
        mensaje =
          error.error?.message ||
          mensaje;
      }
    }

    Swal.fire({
      icon: 'warning',
      title:
        'No se puede cerrar el operativo',
      text: mensaje,
      confirmButtonText: 'Aceptar',
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
