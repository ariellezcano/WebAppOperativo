import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

import { DetalleDistribucionDTO } from 'src/app/modelos/relacionModelos/detalleDistribucionDTO';
import { DetalleDistribucionService } from 'src/app/services/components/detalle-distribucion.service';
import { PlanillaDistribucionService } from 'src/app/services/components/planilla-distribucion.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-frm-detalle-distribucion',
  templateUrl: './frm-detalle-distribucion.component.html',
  styleUrls: ['./frm-detalle-distribucion.component.scss'],
})
export class FrmDetalleDistribucionComponent implements OnInit {
  idDetalle = 0;

  item: DetalleDistribucionDTO | null = null;

  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wsdlPlanillaDistribucion: PlanillaDistribucionService,
    private wsdl: DetalleDistribucionService,
  ) {}

  async ngOnInit() {
    this.idDetalle = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idDetalle > 0) {
      await this.cargar();
    }
  }

  async cargar() {
    try {
      this.cargando = true;

      const re = await firstValueFrom(this.wsdl.obtenerPorId(this.idDetalle));

      const result = JSON.parse(JSON.stringify(re));

      if (result.code === '200' && result.data && result.data.length > 0) {
        this.item = result.data[0];
      } else {
        this.item = null;

        Swal.fire(
          'Atención',
          'No se encontró el detalle de la entrega.',
          'warning',
        );
      }
    } catch (error) {
      console.error(error);

      this.item = null;

      Swal.fire('Error', 'Ocurrió un error al cargar la entrega.', 'error');
    } finally {
      this.cargando = false;
    }
  }

  back() {
    this.router.navigate(['pages/lst_distribucion']);
  }

  async recepcionar() {
    if (!this.item) {
      return;
    }

    const usuarioRecibe = Number(Utils.getSession('user'));

    const idDetalle = this.item.idDetalle;

    const idPolicial = this.item.idPolicial ?? '';

    const confirmacion = await Swal.fire({
      title: 'Recepcionar equipo',
      html: `
      <div class="text-start">

        <p>
          Se recepcionará el equipo
          <strong>${idPolicial}</strong>.
        </p>

        <label class="form-label">
          Observación de recepción
        </label>

        <textarea
          id="observacionRecepcion"
          class="swal2-textarea"
          placeholder="Ingrese una observación..."
          maxlength="200"
        ></textarea>

      </div>
    `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Recepcionar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754',

      preConfirm: () => {
        const textarea = document.getElementById(
          'observacionRecepcion',
        ) as HTMLTextAreaElement;

        return textarea?.value?.trim() ?? '';
      },
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    const observacionRecepcion = confirmacion.value;

    try {
      const consulta = await firstValueFrom(
        this.wsdlPlanillaDistribucion.recibirEquipamiento(
          idDetalle,
          usuarioRecibe,
          observacionRecepcion,
        ),
      );

      const respuesta = JSON.parse(JSON.stringify(consulta));

      if (respuesta.code === '200') {
        await Swal.fire(
          'Correcto',
          'Equipo recepcionado correctamente.',
          'success',
        );

        await this.cargar();
      }
    } catch (error) {
      console.error(error);

      Swal.fire('Error', 'Ocurrió un error al recepcionar el equipo.', 'error');
    }
  }

  
  anular() {
    if (!this.item) {
      return;
    }

    const idDetalle = this.item.idDetalle;

    const idPolicial = this.item.idPolicial ?? '';

    const usuario = Number(Utils.getSession('user'));

    // =========================================
    // VALIDAR USUARIO
    // =========================================

    if (!usuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario no válido',
        text: 'No se pudo identificar al usuario que realiza la anulación.',
        confirmButtonText: 'Aceptar',
      });

      return;
    }

    // =========================================
    // CONFIRMAR ANULACION
    // =========================================

    Swal.fire({
      title: '¿Anular entrega?',

      html: `
      <div class="text-start">

        <p>
          Se anulará la entrega del siguiente equipo:
        </p>

        <hr>

        <p class="mb-1">
          <strong>ID Policial:</strong>
          ${idPolicial || '-'}
        </p>

        <p class="mb-1">
          <strong>Tipo:</strong>
          ${this.item.tipoEquipo ?? '-'}
        </p>

        <p class="mb-1">
          <strong>Marca:</strong>
          ${this.item.marca ?? '-'}
        </p>

        <p class="mb-0">
          <strong>Modelo:</strong>
          ${this.item.modelo ?? '-'}
        </p>

        <hr>

        <div class="alert alert-warning mb-0">
          El equipo volverá al estado
          <strong>AFECTADO OPERATIVO</strong>
          y podrá ser entregado nuevamente.
        </div>

      </div>
    `,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Sí, anular',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#dc3545',

      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      // =========================================
      // LLAMAR API
      // =========================================

      this.wsdlPlanillaDistribucion.anular(idDetalle, usuario).subscribe({
        next: (resp) => {
          if (resp.code === '200') {
            Swal.fire({
              icon: 'success',

              title: 'Entrega anulada',

              text:
                resp.message ||
                'La entrega del equipamiento fue anulada correctamente.',

              confirmButtonText: 'Aceptar',
            }).then(() => {
              // Volver al listado
              this.back();
            });
          } else {
            Swal.fire({
              icon: 'warning',

              title: 'No se pudo anular',

              text:
                resp.message ||
                'No se pudo anular la entrega del equipamiento.',

              confirmButtonText: 'Aceptar',
            });
          }
        },

        error: (error) => {
          console.error('Error al anular entrega:', error);

          const mensaje =
            error?.error?.message ||
            error?.error?.error ||
            'Ocurrió un error al anular la entrega.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonText: 'Aceptar',
          });
        },
      });
    });
  }
}
