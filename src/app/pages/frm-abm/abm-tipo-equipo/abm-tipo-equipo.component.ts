import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TipoEquipo } from 'src/app/modelos/components/tipoEquipo';
import { TipoEquipoService } from 'src/app/services/components/tipo-equipo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-tipo-equipo',
  templateUrl: './abm-tipo-equipo.component.html',
  styleUrls: ['./abm-tipo-equipo.component.scss'],
})
export class AbmTipoEquipoComponent implements OnInit {
  item: TipoEquipo;
  editando = false;
  id!: number;

  tiposNovedad: any[] = [];

  constructor(
    private wsdl: TipoEquipoService,
    private route: Router,
    private url: ActivatedRoute,
  ) {
    this.item = new TipoEquipo();
  }

  ngOnInit(): void {
    this.id = Number(this.url.snapshot.params['id']);

    if (this.id > 0) {
      this.obtenerId();
    }
  }

  guardar() {
    if (this.id > 0 && this.editando) {
      this.editar();
    } else {
      this.crear();
    }
  }

  async obtenerId() {
    try {
      const data = await firstValueFrom(this.wsdl.getId(this.id));
      const result = JSON.parse(JSON.stringify(data));

      if (result.code === '200') {
        this.item = result.dato;
        this.editando = true;
      }
    } catch {
      Swal.fire('Error', 'No se pudo obtener los datos', 'error');
    }
  }

  async crear() {
    try {
      const data = await firstValueFrom(this.wsdl.insert(this.item));
      const result = JSON.parse(JSON.stringify(data));

      if (result.code === '201') {
        Swal.fire('Creado correctamente', '', 'success');
        this.back();
      }
    } catch {
      Swal.fire('Error', 'Error al crear', 'error');
    }
  }

  async editar() {
    //console.log("tipo de equipo", this.item)
    try {
      const data = await firstValueFrom(this.wsdl.update(this.item));

      const result = JSON.parse(JSON.stringify(data));
      console.log('editando', result);

      if (result.code === '200') {
        Swal.fire('Actualizado correctamente!!', '', 'success');
        this.back();
      }
    } catch {
      Swal.fire('Error', 'Error al actualizar', 'error');
    }
  }

  back() {
    this.route.navigate(['pages/lst_tipoEquipo']);
  }
}
