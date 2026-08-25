import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/utils/utils';
import { DetalleDistribucionDTO } from 'src/app/modelos/relacionModelos/detalleDistribucionDTO';
import { DetalleDistribucionService } from 'src/app/services/components/detalle-distribucion.service';
import { PlanillaDistribucionService } from 'src/app/services/components/planilla-distribucion.service';
import { DetalleDistribucion } from 'src/app/modelos/components/detalleDistribucion';
import { FilDistribucionComponent } from '../../filtros/fil-distribucion/fil-distribucion.component';

@Component({
  selector: 'app-lst-detalle-distribucion',
  templateUrl: './lst-detalle-distribucion.component.html',
  styleUrls: ['./lst-detalle-distribucion.component.scss'],
})
export class LstDetalleDistribucionComponent implements OnInit {
  @ViewChild(FilDistribucionComponent, { static: false })
  fil!: FilDistribucionComponent;

  items: DetalleDistribucionDTO[];

  rol = '';

  constructor(
    private wsdl: PlanillaDistribucionService,
    private router: Router,
  ) {
    this.items = [];
  }

  ngOnInit() {
    const personal = Utils.getSession('personal');

    if (personal) {
      const obj = JSON.parse(personal);
      this.rol = obj.rol;
    }

    this.cargar();
  }

  doFound(event: DetalleDistribucionDTO[]) {
    console.log('recepcionado', event);
    this.items = event;
  }

  async cargar() {
    try {
      const re = await firstValueFrom(this.wsdl.listar());

      const result = JSON.parse(JSON.stringify(re));

      if (result.code == '200') {
        this.items = result.data;
      } else {
        this.items = [];
      }
    } catch (error) {
      console.error(error);
      this.items = [];
    }
  }

  linkear(id: number) {
    this.router.navigateByUrl('pages/frm_detalle/' + id);
  }

  // eliminar(id: number) {
  //   Swal.fire({
  //     title: '¿Eliminar detalle de distribución?',
  //     text: 'El registro dejará de estar disponible.',
  //     icon: 'warning',
  //     showDenyButton: true,
  //     confirmButtonText: 'Eliminar',
  //     denyButtonText: 'Cancelar',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.eliminacion(id);
  //     }
  //   });
  // }

  // async eliminacion(id: number) {
  //   try {
  //     const re = await firstValueFrom(this.wsdl.delete(id));

  //     const result = JSON.parse(JSON.stringify(re));

  //     if (result.code == '200') {
  //       await Swal.fire(
  //         'Correcto',
  //         'El detalle fue eliminado correctamente.',
  //         'success',
  //       );

  //       this.cargar();
  //     } else {
  //       Swal.fire(
  //         'Atención',
  //         result.message ?? 'No se pudo eliminar el registro.',
  //         'warning',
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);

  //     Swal.fire('Error', 'Ocurrió un error al eliminar el registro.', 'error');
  //   }
  // }

  recepcionar(item: any): void {
    Swal.fire({
      icon: 'question',
      title: 'Recepcionar equipamiento',

      html: `
      <div class="text-start">

        <p>
          ¿Confirma la recepción del equipamiento?
        </p>

        <hr>

        <p class="mb-1">
          <strong>Equipo:</strong>
          ${item.idPolicial ?? '-'}
        </p>

        <p class="mb-1">
          <strong>Receptor:</strong>
          ${item.apellido ?? ''}, ${item.nombre ?? ''}
        </p>

        <p class="mb-1">
          <strong>DNI:</strong>
          ${item.dni ?? '-'}
        </p>

        <p class="mb-3">
          <strong>Unidad:</strong>
          ${item.nombreUnidad ?? '-'}
        </p>

        <label class="form-label fw-semibold">
          Observación de recepción
        </label>

        <textarea
          id="observacionRecepcion"
          class="swal2-textarea"
          maxlength="200"
          placeholder="Ingrese una observación..."
        ></textarea>

      </div>
    `,

      showCancelButton: true,

      confirmButtonText: 'Sí, recepcionar',

      cancelButtonText: 'Cancelar',

      reverseButtons: true,

      preConfirm: () => {
        const textarea = document.getElementById(
          'observacionRecepcion',
        ) as HTMLTextAreaElement;

        return textarea?.value?.trim() ?? '';
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      // =========================================
      // USUARIO LOGUEADO
      // =========================================

      const usuarioRecibe = Number(Utils.getSession('user'));

      if (!usuarioRecibe) {
        Swal.fire({
          icon: 'warning',
          title: 'Usuario no válido',
          text: 'No se pudo identificar al usuario que realiza la recepción.',
          confirmButtonText: 'Aceptar',
        });

        return;
      }

      // =========================================
      // OBSERVACION
      // =========================================

      const observacionRecepcion = result.value ?? '';

      // =========================================
      // RECEPCIONAR EQUIPO
      // =========================================

      this.wsdl
        .recibirEquipamiento(
          item.idDetalle,
          usuarioRecibe,
          observacionRecepcion,
        )
        .subscribe({
          next: (resp) => {
            if (resp.code === '200') {
              Swal.fire({
                icon: 'success',
                title: 'Equipamiento recepcionado',

                text:
                  resp.message || 'La recepción fue registrada correctamente.',

                confirmButtonText: 'Aceptar',
              }).then(() => {
                // Volver a cargar listado
                this.fil.filter();
              });
            } else {
              Swal.fire({
                icon: 'warning',
                title: 'No se pudo recepcionar',

                text: resp.message || 'No se pudo registrar la recepción.',

                confirmButtonText: 'Aceptar',
              });
            }
          },

          error: (error) => {
            console.error('Error al recepcionar:', error);

            Swal.fire({
              icon: 'error',
              title: 'Error',

              text:
                error?.error?.message ||
                'Ocurrió un error al recepcionar el equipamiento.',

              confirmButtonText: 'Aceptar',
            });
          },
        });
    });
  }

  anular(item: any): void {
    Swal.fire({
      icon: 'warning',
      title: 'Anular entrega',
      html: `
      <div class="text-start">
        <p>
          ¿Está seguro que desea anular esta entrega?
        </p>

        <div class="alert alert-warning">
          El equipamiento volverá al estado
          <strong>AFECTADO OPERATIVO</strong>.
        </div>

        <p class="mb-1">
          <strong>Receptor:</strong>
          ${item.apellido}, ${item.nombre}
        </p>

        <p class="mb-1">
          <strong>DNI:</strong>
          ${item.dni}
        </p>

        <p class="mb-0">
          <strong>Unidad:</strong>
          ${item.nombreUnidad ?? '-'}
        </p>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Sí, anular entrega',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      // Reemplazar por usuario logueado
      const usuario = 1;

      this.wsdl.anular(item.idDistribucion, usuario).subscribe({
        next: (resp) => {
          if (resp === true || resp?.code === '200') {
            Swal.fire({
              icon: 'success',
              title: 'Entrega anulada',
              text: 'La entrega fue anulada correctamente y el equipamiento volvió al operativo.',
              confirmButtonText: 'Aceptar',
            });

            this.fil.filter();
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'No se pudo anular',
              text: resp?.message || 'La entrega no puede ser anulada.',
              confirmButtonText: 'Aceptar',
            });
          }
        },

        error: (error) => {
          console.error('Error al anular entrega:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error?.error?.message || 'Ocurrió un error al anular la entrega.',
            confirmButtonText: 'Aceptar',
          });
        },
      });
    });
  }

  puedeOperar() {
    return (
      this.rol == 'MANAGER' ||
      this.rol == 'ADMINISTRADOR' ||
      this.rol == 'DEVELOPER'
    );
  }

  puedeEliminar() {
    return this.rol == 'MANAGER' || this.rol == 'DEVELOPER';
  }
}
