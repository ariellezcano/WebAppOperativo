import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { lastValueFrom } from 'rxjs';

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

  constructor(
    private wsdl: DetalleDistribucionService,
  ) {}

  ngOnInit() {
    this.filter();
  }

  setPage(page: number, accion: string) {
    this.paginaActual = page;

    if (accion === 'siguiente') {
      this.paginaActual++;
    }

    if (accion === 'anterior') {
      this.paginaActual--;
    }

    this.filter();
  }

  cambioCantidad() {
    this.paginaActual = 1;
    this.filter();
  }

  cambioBusqueda() {
    this.paginaActual = 1;
    this.filter();
  }

  async filter() {
    try {
      const data = await lastValueFrom(
        this.wsdl.listar(
          this.paginaActual,
          this.limit,
          this.busqueda,
        ),
      );

      const result = JSON.parse(JSON.stringify(data));
      console.log("result", result)
      if (result.code === '200') {
        this.items = result.data ?? [];

        this.totalPaginas = result.totalPaginas ?? 1;
        this.totalRegistros = result.totalRegistros ?? 0;
      } else {
        this.items = [];
        this.totalPaginas = 1;
        this.totalRegistros = 0;
      }

      this.emmit.emit(this.items);
    } catch (error) {
      console.error(error);

      this.items = [];
      this.totalPaginas = 1;
      this.totalRegistros = 0;

      this.emmit.emit(this.items);
    }
  }
}