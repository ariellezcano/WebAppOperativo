import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Estado } from 'src/app/modelos/components/estado';
import { TipoEquipo } from 'src/app/modelos/components/tipoEquipo';
import { EquipamientoDTO } from 'src/app/modelos/relacionModelos/equipamientoDTO';
import { MarcaComboDTO } from 'src/app/modelos/relacionModelos/marcaComboDTO';
import { MarcaModeloDTO } from 'src/app/modelos/relacionModelos/marcaModeloDTO';
import { EquipamientoService } from 'src/app/services/components/equipamiento.service';
import { EstadoService } from 'src/app/services/components/estado.service';
import { MarcaService } from 'src/app/services/components/marca.service';
import { ModeloService } from 'src/app/services/components/modelo.service';
import { TipoEquipoService } from 'src/app/services/components/tipo-equipo.service';

@Component({
  selector: 'app-fil-equipamiento',
  templateUrl: './fil-equipamiento.component.html',
  styleUrls: ['./fil-equipamiento.component.scss'],
})
export class FilEquipamientoComponent implements OnInit {
  @Output()
  emmit = new EventEmitter<EquipamientoDTO[]>();

  items: EquipamientoDTO[] = [];

  marcas: MarcaComboDTO[] = [];
  modelos: MarcaModeloDTO[] = [];
  estados: Estado[] = [];
  tipos: TipoEquipo[] = [];

  busqueda = '';

  idMarca: number | null = null;
  idModelo: number | null = null;
  idTipoEquipo: number | null = null;
  idEstado: number | null = null;

  paginaActual = 1;
  totalPaginas = 1;
  totalRegistros = 0;

  limit = 10;
  limits = [10, 20, 30];

  constructor(
    private wsdl: EquipamientoService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private estadoService: EstadoService,
    private tipoService: TipoEquipoService,
  ) {}

  async ngOnInit() {
    await this.cargarCombos();

    this.filter();
  }

  async cargarCombos() {
    this.marcas = await lastValueFrom(this.marcaService.combo());

    this.modelos = await lastValueFrom(this.modeloService.combo());

    this.estados = await lastValueFrom(this.estadoService.combo());

    this.tipos = await lastValueFrom(this.tipoService.combo());
  }

  cambioMarca() {
    this.idModelo = null;

    this.filter();
  }

  setPage(page: number, accion: string) {
    this.paginaActual = page;

    if (accion == 'siguiente') this.paginaActual++;

    if (accion == 'anterior') this.paginaActual--;

    this.filter();
  }

  async filter() {
    try {
      const data = await lastValueFrom(
        this.wsdl.listar(
          this.paginaActual,

          this.limit,

          this.busqueda,

          this.idMarca ?? undefined,

          this.idModelo ?? undefined,

          this.idTipoEquipo ?? undefined,

          this.idEstado ?? undefined,
        ),
      );

      const result = JSON.parse(JSON.stringify(data));

      if (result.code == '200') {
        this.items = result.data;

        this.totalPaginas = result.totalPaginas;

        this.totalRegistros = result.totalRegistros;
      } else {
        this.items = [];

        this.totalPaginas = 1;

        this.totalRegistros = 0;
      }

      this.emmit.emit(this.items);
    } catch (error) {
      console.error(error);
    }
  }
}
