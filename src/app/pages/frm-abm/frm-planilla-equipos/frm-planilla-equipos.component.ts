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

  tipoPlanilla: 'ENTREGADAS' | 'AFECTADAS' = 'ENTREGADAS';

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
    if (this.tipoPlanilla === 'AFECTADAS' && !this.idOperativo) {
      await Swal.fire(
        'Atención',
        'Debe seleccionar un operativo para generar la planilla en blanco.',
        'warning',
      );

      return;
    }

    if (
      this.tipoPlanilla === 'ENTREGADAS' &&
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

      // ==========================================
      // NOMBRE OPERATIVO
      // ==========================================

      this.actualizarNombreOperativo();

      let re: any;

      // ==========================================
      // PLANILLA DE RADIOS ENTREGADAS
      // ==========================================

      if (this.tipoPlanilla === 'ENTREGADAS') {
        re = await firstValueFrom(
          this.wsdlReporte.radiosEntregadas(
            this.idOperativo,
            this.fechaDesde,
            this.fechaHasta,
            this.estadoEntrega,
            this.filtroEquipo,
            this.filtroPersona,
          ),
        );
      }

      // ==========================================
      // PLANILLA EN BLANCO
      // ==========================================
      else {
        re = await firstValueFrom(
          this.wsdlReporte.radiosAfectadasOperativo(
            Number(this.idOperativo),
            this.filtroEquipo,
          ),
        );
      }

      const resultado = JSON.parse(JSON.stringify(re));

      if (
        resultado.code === '200' &&
        resultado.data &&
        resultado.data.length > 0
      ) {
        this.items = resultado.data;

        return;
      }

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
        } catch {}
      }

      await Swal.fire('Error', mensaje, 'error');
    } finally {
      this.cargando = false;
    }
  }

  actualizarNombreOperativo(): void {
    this.nombreOperativo = '';

    if (!this.idOperativo) {
      return;
    }

    const operativo = this.operativos.find(
      (x) => Number(x.idOperativo) === Number(this.idOperativo),
    );

    this.nombreOperativo = operativo?.denominacion ?? '';
  }

  cambioTipoPlanilla(): void {
    this.items = [];

    this.consultaRealizada = false;

    if (this.tipoPlanilla === 'AFECTADAS') {
      this.fechaDesde = null;

      this.fechaHasta = null;

      this.estadoEntrega = null;

      this.filtroPersona = '';
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
