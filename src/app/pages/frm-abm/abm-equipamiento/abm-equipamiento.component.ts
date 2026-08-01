import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Equipamiento } from 'src/app/modelos/components/equipamiento';
import { Estado } from 'src/app/modelos/components/estado';
import { Marca } from 'src/app/modelos/components/marca';
import { Modelo } from 'src/app/modelos/components/modelo';
import { TipoEquipo } from 'src/app/modelos/components/tipoEquipo';
import { Unidad } from 'src/app/modelos/components/unidad';
import { MarcaComboDTO } from 'src/app/modelos/relacionModelos/marcaComboDTO';
import { EquipamientoService } from 'src/app/services/components/equipamiento.service';
import { EstadoService } from 'src/app/services/components/estado.service';
import { MarcaService } from 'src/app/services/components/marca.service';
import { ModeloService } from 'src/app/services/components/modelo.service';
import { TipoEquipoService } from 'src/app/services/components/tipo-equipo.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-equipamiento',
  templateUrl: './abm-equipamiento.component.html',
  styleUrls: ['./abm-equipamiento.component.scss'],
})
export class AbmEquipamientoComponent implements OnInit {
  item: Equipamiento;

  editando = false;

  marcas: MarcaComboDTO[] = [];
  modelos: Modelo[] = [];
  tipos: TipoEquipo[] = [];
  estados: Estado[] = [];

  marca = 0;

  constructor(
    private wsdl: EquipamientoService,

    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private tipoService: TipoEquipoService,
    private estadoService: EstadoService,

    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.item = new Equipamiento();
  }

  ngOnInit(): void {
    this.cargarCombos();

    const id = this.route.snapshot.paramMap.get('id');

    if (id && Number(id) > 0) {
      this.editando = true;

      this.obtener(Number(id));
    }
  }

  async cargarCombos() {
    this.marcas = await firstValueFrom(this.marcaService.combo());

    this.tipos = await firstValueFrom(this.tipoService.combo());

    this.estados = await firstValueFrom(this.estadoService.combo());
    //console.log(this.estados);
  }

  async cambioMarca() {
    this.modelos = [];

    this.item.modelo = 0;

    if (this.marca > 0) {
      const re = await firstValueFrom(
        this.modeloService.comboMarca(this.marca),
      );

      //console.log('Respuesta modelos:', re);

      this.modelos = re.dato;
    }
  }

  async obtener(id: number) {
    const re = await firstValueFrom(this.wsdl.getId(id));

    const result = JSON.parse(JSON.stringify(re));

    if (result.code == '200') {
      this.item = result.dato;

      // Cargo la marca solamente para mostrar el combo

      const modelo = await firstValueFrom(
        this.modeloService.getId(this.item.modelo),
      );

      const m = JSON.parse(JSON.stringify(modelo));

      if (m.code == '200') {
        this.marca = m.dato.marca;

        await this.cambioMarca();
      }
    }
  }

  async guardar() {
    this.item.usuarioAlta = Number(Utils.getSession('user'));
    try {
      const re = this.editando
        ? await firstValueFrom(this.wsdl.update(this.item))
        : await firstValueFrom(this.wsdl.insert(this.item));

      const result = JSON.parse(JSON.stringify(re));
      console.log('result', result);

      if (result.code == '200' || result.code == '201') {
        Swal.fire({
          icon: 'success',

          title: 'Guardado correctamente',

          timer: 1500,

          showConfirmButton: false,
        });

        this.back();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch (error) {
      console.error(error);

      Swal.fire('Error', 'No se pudo guardar el equipamiento', 'error');
    }
  }

  // estadoCambio(valor: any) {
  //   console.log('Estado seleccionado:', valor);
  // }

  unidadSeleccionada(unidad: Unidad | null) {
    if (!unidad) {
      this.item.unidadPerteneciente = null;
      this.item.nombreUnidad = null;
      return;
    }

    this.item.unidadPerteneciente = unidad.id;
    this.item.nombreUnidad = unidad.nombre;
  }

  back() {
    this.router.navigate(['pages/lst_equipos']);
  }
}
