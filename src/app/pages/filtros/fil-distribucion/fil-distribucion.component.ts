import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { DetalleDistribucionDTO } from 'src/app/modelos/relacionModelos/detalleDistribucionDTO';

import { DetalleDistribucionService } from 'src/app/services/components/detalle-distribucion.service';

@Component({
  selector: 'app-fil-distribucion',
  templateUrl: './fil-distribucion.component.html',
  styleUrls: ['./fil-distribucion.component.scss'],
})
export class FilDistribucionComponent implements OnInit {
  @Output()
  emmit = new EventEmitter<DetalleDistribucionDTO[]>();

  items: DetalleDistribucionDTO[] = [];

  busqueda = '';

  paginaActual = 1;

  totalPaginas = 1;

  totalRegistros = 0;

  limit = 10;

  limits = [10, 20, 30, 40, 50];

  cargando = false;

  /*
   * Sirve para evitar que una petición vieja
   * pise el resultado de una petición nueva.
   */
  private numeroConsulta = 0;

  constructor(private wsdl: DetalleDistribucionService) {}

  ngOnInit(): void {
    this.filter();
  }

  // =========================================
  // PAGINACION
  // =========================================

  setPage(accion: 'anterior' | 'siguiente'): void {
    if (accion === 'anterior' && this.paginaActual > 1) {
      this.paginaActual--;
    }

    if (accion === 'siguiente' && this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }

    this.filter();
  }

  // =========================================
  // CAMBIO CANTIDAD
  // =========================================

  cambioCantidad(): void {
    this.paginaActual = 1;

    this.filter();
  }

  // =========================================
  // CAMBIO BUSQUEDA
  // =========================================

  cambioBusqueda(): void {
    this.paginaActual = 1;

    this.filter();
  }

  // =========================================
  // FILTRAR
  // =========================================

  async filter(): Promise<void> {
    const consultaActual = ++this.numeroConsulta;

    try {
      this.cargando = true;

      const result = await firstValueFrom(
        this.wsdl.listar(this.paginaActual, this.limit, this.busqueda),
      );

      /*
       * Si mientras esperaba esta respuesta
       * se hizo otra consulta, ignoramos esta.
       */
      if (consultaActual !== this.numeroConsulta) {
        return;
      }

      console.log('LISTAR DETALLE DISTRIBUCION:', result);

      if (result && result.code === '200') {
        this.items = [...(result.data ?? [])];

        this.totalPaginas = result.totalPaginas > 0 ? result.totalPaginas : 1;

        this.totalRegistros = result.totalRegistros ?? 0;
      } else {
        this.items = [];

        this.paginaActual = 1;

        this.totalPaginas = 1;

        this.totalRegistros = 0;
      }

      /*
       * Emitimos un array nuevo.
       */
      this.emmit.emit([...this.items]);
    } catch (error) {
      console.error('Error Listar DetalleDistribucion:', error);

      if (consultaActual !== this.numeroConsulta) {
        return;
      }

      this.items = [];

      this.paginaActual = 1;

      this.totalPaginas = 1;

      this.totalRegistros = 0;

      this.emmit.emit([]);
    } finally {
      if (consultaActual === this.numeroConsulta) {
        this.cargando = false;
      }
    }
  }
}
