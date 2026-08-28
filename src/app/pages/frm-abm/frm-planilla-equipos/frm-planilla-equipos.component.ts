import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

import { ReportesService } from 'src/app/services/reportes.service';
import { OperativoService } from 'src/app/services/components/operativo.service';

@Component({
  selector: 'app-frm-planilla-equipos',
  templateUrl: './frm-planilla-equipos.component.html',
  styleUrls: ['./frm-planilla-equipos.component.scss'],
})
export class FrmPlanillaEquiposComponent implements OnInit {
  // =====================================================
  // OPERATIVOS
  // =====================================================

  operativos: any[] = [];

  // =====================================================
  // FILTROS
  // =====================================================

  idOperativo: number | null = null;

  fechaDesde: string | null = null;

  fechaHasta: string | null = null;

  estadoEntrega: number | null = null;

  filtroEquipo = '';

  filtroPersona = '';

  // =====================================================
  // REPORTE
  // =====================================================

  items: any[] = [];

  cargando = false;

  consultaRealizada = false;

  nombreOperativo = '';

  fechaReporte = new Date();

  constructor(
    private router: Router,
    private wsdlReporte: ReportesService,
    private wsdlOperativo: OperativoService,
  ) {}

  // =====================================================
  // INICIO
  // =====================================================

  async ngOnInit(): Promise<void> {
    await this.cargarOperativos();
  }

  // =====================================================
  // CARGAR OPERATIVOS
  // =====================================================

  async cargarOperativos(): Promise<void> {
    try {
      const re = await firstValueFrom(this.wsdlOperativo.combo());

      const resultado = JSON.parse(JSON.stringify(re));

      if (resultado.code === '200' && resultado.data) {
        this.operativos = resultado.data;
      } else {
        this.operativos = [];
      }
    } catch (error) {
      console.error('Error al cargar operativos:', error);

      this.operativos = [];
    }
  }

  // =====================================================
  // CONSULTAR REPORTE
  // =====================================================

  async consultar(): Promise<void> {
    // =========================================
    // VALIDAR FECHAS
    // =========================================

    if (
      this.fechaDesde &&
      this.fechaHasta &&
      this.fechaDesde > this.fechaHasta
    ) {
      await Swal.fire(
        'Atención',
        'La fecha desde no puede ser mayor que la fecha hasta.',
        'warning',
      );

      return;
    }

    try {
      this.cargando = true;

      this.consultaRealizada = true;

      this.items = [];

      this.nombreOperativo = '';

      // =========================================
      // CONSULTAR API
      // =========================================

      const re = await firstValueFrom(
        this.wsdlReporte.radiosEntregadas(
          this.idOperativo,
          this.fechaDesde,
          this.fechaHasta,
          this.estadoEntrega,
          this.filtroEquipo,
          this.filtroPersona,
        ),
      );

      const resultado = JSON.parse(JSON.stringify(re));

      // =========================================
      // RESULTADO CORRECTO
      // =========================================

      if (
        resultado.code === '200' &&
        resultado.data &&
        resultado.data.length > 0
      ) {
        this.items = resultado.data;

        // =====================================
        // NOMBRE OPERATIVO
        // =====================================

        if (this.idOperativo) {
          // Primero intentamos tomarlo
          // desde el resultado.

          this.nombreOperativo = this.items[0]?.operativo ?? '';

          // Si por algún motivo no vino
          // desde backend, lo buscamos
          // en el combo.

          if (!this.nombreOperativo) {
            const operativo = this.operativos.find(
              (x) => Number(x.idOperativo) === Number(this.idOperativo),
            );

            this.nombreOperativo = operativo?.denominacion ?? '';
          }
        }

        return;
      }

      // =========================================
      // SIN RESULTADOS
      // =========================================

      this.items = [];
    } catch (error: any) {
      console.error('Error al consultar reporte:', error);

      this.items = [];

      let mensaje = 'Ocurrió un error al consultar el reporte.';

      if (error?.error) {
        try {
          const respuesta =
            typeof error.error === 'string'
              ? JSON.parse(error.error)
              : error.error;

          if (respuesta?.message) {
            mensaje = respuesta.message;
          }
        } catch {
          // Dejamos mensaje genérico.
        }
      }

      await Swal.fire('Error', mensaje, 'error');
    } finally {
      this.cargando = false;
    }
  }

  // =====================================================
  // LIMPIAR FILTROS
  // =====================================================

  limpiarFiltros(): void {
    this.idOperativo = null;

    this.fechaDesde = null;

    this.fechaHasta = null;

    this.estadoEntrega = null;

    this.filtroEquipo = '';

    this.filtroPersona = '';

    this.items = [];

    this.nombreOperativo = '';

    this.consultaRealizada = false;
  }

  // =====================================================
  // CAMBIO DE OPERATIVO
  // =====================================================

  cambioOperativo(): void {
    this.items = [];

    this.consultaRealizada = false;

    this.nombreOperativo = '';

    if (!this.idOperativo) {
      return;
    }

    const operativo = this.operativos.find(
      (x) => Number(x.idOperativo) === Number(this.idOperativo),
    );

    if (operativo) {
      this.nombreOperativo = operativo.denominacion ?? '';
    }
  }

  // =====================================================
  // NOMBRE PERSONA
  // =====================================================

  persona(item: any): string {
    if (item?.persona) {
      return item.persona;
    }

    const apellido = item?.apellido ?? '';

    const nombre = item?.nombre ?? '';

    if (apellido && nombre) {
      return `${apellido}, ${nombre}`;
    }

    return `${apellido} ${nombre}`.trim();
  }

  // =====================================================
  // MARCA / MODELO
  // =====================================================

  marcaModelo(item: any): string {
    const marca = item?.marca ?? '';

    const modelo = item?.modelo ?? '';

    const resultado = `${marca} ${modelo}`.trim();

    return resultado || '-';
  }

  // =====================================================
  // DENOMINACION
  // =====================================================

  denominacion(item: any): string {
    return item?.idPolicial ?? '-';
  }

  // =====================================================
  // ESTADO TEXTO
  // =====================================================

  estadoTexto(): string {
    switch (this.estadoEntrega) {
      case 1:
        return 'ACTUALMENTE ENTREGADAS';

      case 2:
        return 'RECEPCIONADAS';

      case 3:
        return 'ANULADAS';

      default:
        return 'TODAS LAS ENTREGAS';
    }
  }

  // =====================================================
  // VOLVER
  // =====================================================

  volver(): void {
    this.router.navigate(['pages/panel_reportes']);
  }

  // =====================================================
  // IMPRIMIR
  // =====================================================

  imprimir(): void {
    if (!this.items || this.items.length === 0) {
      Swal.fire('Atención', 'No existen registros para imprimir.', 'warning');

      return;
    }

    window.print();
  }
}
