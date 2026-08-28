import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { MovimientoDTO } from 'src/app/modelos/relacionModelos/movimientoDTO';

import { Operativo } from 'src/app/modelos/components/operativo';

import { OperativoService } from 'src/app/services/components/operativo.service';
import { MovimientosService } from 'src/app/services/components/movimientos.service';

@Component({
  selector: 'app-fil-movimientos',
  templateUrl: './fil-movimientos.component.html',
  styleUrls: ['./fil-movimientos.component.scss'],
})
export class FilMovimientosComponent implements OnInit {
  @Output()
  emmit = new EventEmitter<MovimientoDTO[]>();

  items: MovimientoDTO[] = [];

  // =========================================
  // OPERATIVOS
  // =========================================

  operativos: Operativo[] = [];

  idOperativo: number | null = null;

  // =========================================
  // MOVIMIENTO
  // =========================================

  tipoMovimiento: string | null = null;

  tiposMovimiento = ['ENTREGA', 'RECEPCION', 'ANULACION'];

  // =========================================
  // BUSQUEDA
  // =========================================

  busqueda = '';

  // =========================================
  // PAGINACION
  // =========================================

  paginaActual = 1;

  totalPaginas = 1;

  totalRegistros = 0;

  limit = 10;

  limits = [10, 20, 30, 40, 50];

  cargando = false;

  private numeroConsulta = 0;

  constructor(
    private wsdl: MovimientosService,

    private wsdlOperativo: OperativoService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarOperativos();

    await this.filter();
  }

  // =========================================
  // OPERATIVOS
  // =========================================

  async cargarOperativos(): Promise<void> {
    try {
      const result = await firstValueFrom(this.wsdlOperativo.combo());

      if (result && result.code === '200') {
        this.operativos = [...(result.data ?? [])];
      } else {
        this.operativos = [];
      }
    } catch (error) {
      console.error('Error cargando operativos:', error);

      this.operativos = [];
    }
  }

  cambioOperativo(): void {
    this.paginaActual = 1;

    this.filter();
  }

  cambioTipoMovimiento(): void {
    this.paginaActual = 1;

    this.filter();
  }

  cambioBusqueda(): void {
    this.paginaActual = 1;

    this.filter();
  }

  cambioCantidad(): void {
    this.paginaActual = 1;

    this.filter();
  }

  setPage(accion: 'anterior' | 'siguiente'): void {
    if (accion === 'anterior' && this.paginaActual > 1) {
      this.paginaActual--;
    }

    if (accion === 'siguiente' && this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }

    this.filter();
  }

  async filter(): Promise<void> {
    const consultaActual = ++this.numeroConsulta;

    try {
      this.cargando = true;

      const result = await firstValueFrom(
        this.wsdl.listar(
          this.paginaActual,
          this.limit,
          this.busqueda,
          this.idOperativo,
          this.tipoMovimiento,
        ),
      );

      if (consultaActual !== this.numeroConsulta) {
        return;
      }

      if (result && result.code === '200') {
        this.items = [...(result.data ?? [])];

        this.totalRegistros = result.totalRegistros ?? 0;

        this.totalPaginas = result.totalPaginas > 0 ? result.totalPaginas : 1;
      } else {
        this.items = [];

        this.totalRegistros = 0;

        this.totalPaginas = 1;
      }

      this.emmit.emit([...this.items]);
    } catch (error) {
      console.error('Error listando movimientos:', error);

      if (consultaActual !== this.numeroConsulta) {
        return;
      }

      this.items = [];

      this.totalRegistros = 0;

      this.totalPaginas = 1;

      this.emmit.emit([]);
    } finally {
      if (consultaActual === this.numeroConsulta) {
        this.cargando = false;
      }
    }
  }
}
