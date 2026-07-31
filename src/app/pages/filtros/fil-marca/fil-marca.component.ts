import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Marca } from 'src/app/modelos/components/marca';
import { MarcaService } from 'src/app/services/components/marca.service';

@Component({
  selector: 'app-fil-marca',
  templateUrl: './fil-marca.component.html',
  styleUrls: ['./fil-marca.component.scss'],
})
export class FilMarcaComponent implements OnInit {
  @Output() emmit: EventEmitter<Marca[]> = new EventEmitter();

  busqueda: any;
  items: Marca[];

  paginaAnterior!: number;
  anterior: boolean;
  paginaActual: number;
  siguiente: boolean;
  paginaSiguiente!: number;
  totalRegistros!: number;
  totalPaginas!: number;
  public limit: any;
  public limits: Number[] = [10, 20, 30];

  constructor(private wsdl: MarcaService) {
    this.busqueda = '';
    this.items = [];

    this.limit = 10;
    this.paginaActual = 1;
    this.siguiente = false;
    this.anterior = false;
  }

  ngOnInit(): void {
    this.filter();
  }

  setPage(page: any, estado: any) {
    this.paginaActual = page;
    if (estado == 'siguiente') {
      this.paginaSiguiente = this.paginaActual + 1;
      this.paginaActual = this.paginaSiguiente;
    }
    if (estado == 'anterior') {
      this.paginaAnterior = this.paginaActual - 1;
      this.paginaActual = this.paginaAnterior;
    }
    this.filter();
  }

  async filter() {
    try {
      const tieneBusqueda = this.busqueda && this.busqueda.trim() !== '';

      // No loguees el Observable, loguea el resultado después de esperar
      const data$ = this.wsdl.listar(
        this.paginaActual,
        this.limit,
        tieneBusqueda ? this.busqueda : undefined,
      );

      // Espera a que el Observable emita
      const result = await lastValueFrom(data$);
      const Json = JSON.parse(JSON.stringify(result));

      //console.log('Resultado real:', Json); // Aquí vas a ver code, data, etc.

      if (Json.code === '200') {
        this.items = Json.data ?? [];
        //console.log("items:", this.items)
        this.totalRegistros = Json.totalRegistros;
        this.totalPaginas = Json.totalPaginas;
      } else if (result.code === '204') {
        //console.log('aca estoyss');
        this.items = [];
        this.totalRegistros = 0;
        this.totalPaginas = 1;
      }

      this.emmit.emit(this.items);
    } catch (error) {
      console.error('Error en filter():', error);
    }
  }
}
