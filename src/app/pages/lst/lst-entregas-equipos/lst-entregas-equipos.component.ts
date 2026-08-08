import { Component, OnInit } from '@angular/core';

import { PlanillaDistribucionDTO } from './../../../modelos/relacionModelos/planillaDistribucionDTO';

import { PlanillaDistribucionService } from 'src/app/services/components/planilla-distribucion.service';
import { Utils } from 'src/app/utils/utils';

declare var bootstrap: any;

@Component({
  selector: 'app-lst-entregas-equipos',
  templateUrl: './lst-entregas-equipos.component.html',
  styleUrls: ['./lst-entregas-equipos.component.scss'],
})
export class LstEntregasEquiposComponent implements OnInit {

  // =====================================================
  // LISTADO
  // =====================================================

  p!: PlanillaDistribucionDTO;

  entregas: PlanillaDistribucionDTO[] = [];

  // =====================================================
  // DETALLE SELECCIONADO
  // =====================================================

  detalleSeleccionado: PlanillaDistribucionDTO | null = null;

  editando = false;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private wsdl: PlanillaDistribucionService
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {}

  // =====================================================
  // RESULTADO DEL FILTRO
  // =====================================================

  doFound(event: PlanillaDistribucionDTO[]): void {

    this.entregas = event;

  }

  // =====================================================
  // VER DETALLE
  // =====================================================

  verDetalle(
    entrega: PlanillaDistribucionDTO
  ): void {

    this.wsdl
      .obtenerPorId(entrega.idDistribucion)
      .subscribe({

        next: (resp) => {

          if (resp.code === '200') {

            this.detalleSeleccionado =
              resp.data;

            this.abrirModalDetalle();

          } else {

            alert(
              resp.message ||
              'No se pudo obtener el detalle de la entrega'
            );

          }

        },

        error: (error) => {

          console.error(
            'Error al obtener detalle:',
            error
          );

          alert(
            'Error al obtener el detalle de la entrega'
          );

        }

      });

  }

  // =====================================================
  // ABRIR MODAL
  // =====================================================

  private abrirModalDetalle(): void {

    const modalElement =
      document.getElementById(
        'modalDetalleEntrega'
      );

    if (!modalElement) {
      return;
    }

    const modal =
      new bootstrap.Modal(modalElement);

    modal.show();

  }

  // =====================================================
  // RECEPCIONAR
  // =====================================================

  recepcionar(
    entrega: PlanillaDistribucionDTO
  ): void {

    if (entrega.estadoEntrega !== 1) {

      alert(
        'La entrega no se encuentra pendiente'
      );

      return;

    }

    const confirmar = confirm(
      '¿Está seguro de recepcionar esta entrega?'
    );

    if (!confirmar) {
      return;
    }

    this.wsdl
      .recibirEquipamiento(
        entrega.idDistribucion,
        entrega.usuarioRecibe = Number(Utils.getSession('user'))
      )
      .subscribe({

        next: (resp) => {

          if (resp.code === '200') {

            alert(
              'Entrega recepcionada correctamente'
            );

            this.cerrarModal();

            this.recargarDetalle(
              entrega.idDistribucion
            );

          } else {

            alert(
              resp.message ||
              'No se pudo recepcionar la entrega'
            );

          }

        },

        error: (error) => {

          console.error(
            'Error al recepcionar:',
            error
          );

          alert(
            'Error al recepcionar la entrega'
          );

        }

      });

  }

  // =====================================================
  // ANULAR
  // =====================================================

  anular(
    entrega: PlanillaDistribucionDTO
  ): void {

    if (entrega.estadoEntrega !== 1) {

      alert(
        'Solo se pueden anular entregas pendientes'
      );

      return;

    }

    const confirmar = confirm(
      '¿Está seguro de anular esta entrega?'
    );

    if (!confirmar) {
      return;
    }

    this.wsdl
      .eliminarLogico(entrega.idDistribucion, Number(Utils.getSession('user')))
      .subscribe({

        next: (resp) => {

          if (resp.code === '200') {

            alert(
              'Entrega anulada correctamente'
            );

            this.cerrarModal();

            this.recargarDetalle(
              entrega.idDistribucion
            );

          } else {

            alert(
              resp.message ||
              'No se pudo anular la entrega'
            );

          }

        },

        error: (error) => {

          console.error(
            'Error al anular entrega:',
            error
          );

          alert(
            'Error al anular la entrega'
          );

        }

      });

  }

  // =====================================================
  // RECARGAR DETALLE
  // =====================================================

  private recargarDetalle(
    idDistribucion: number
  ): void {

    this.wsdl
      .obtenerPorId(idDistribucion)
      .subscribe({

        next: (resp) => {

          if (resp.code === '200') {

            this.detalleSeleccionado =
              resp.data;

            // Actualizar registro de la tabla

            const index =
              this.entregas.findIndex(
                x =>
                  x.idDistribucion ===
                  idDistribucion
              );

            if (index !== -1) {

              this.entregas[index] =
                resp.data;

              this.entregas =
                [...this.entregas];

            }

          }

        },

        error: (error) => {

          console.error(
            'Error al actualizar detalle:',
            error
          );

        }

      });

  }

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  private cerrarModal(): void {

    const modalElement =
      document.getElementById(
        'modalDetalleEntrega'
      );

    if (!modalElement) {
      return;
    }

    const modal =
      bootstrap.Modal.getInstance(
        modalElement
      );

    if (modal) {

      modal.hide();

    }

  }

}