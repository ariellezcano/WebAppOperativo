import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Marca } from 'src/app/modelos/components/marca';
import { Modelo } from 'src/app/modelos/components/modelo';
import { MarcaComboDTO } from 'src/app/modelos/relacionModelos/marcaComboDTO';
import { MarcaService } from 'src/app/services/components/marca.service';
import { ModeloService } from 'src/app/services/components/modelo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-modelo',
  templateUrl: './abm-modelo.component.html',
  styleUrls: ['./abm-modelo.component.scss']
})
export class AbmModeloComponent implements OnInit {

   item: Modelo;
   marca: MarcaComboDTO[];
    editando = false;
    unidades: string[] = [];
    id!: number;
  
    constructor(
      private wsdl: ModeloService,
      private wsdlMarca: MarcaService,
      private route: Router,
      private url: ActivatedRoute
    ) {
      this.item = new Modelo();
      this.marca = [];
    }
  
    ngOnInit(): void {
      this.id = this.url.snapshot.params['id'];
      this.ObtenerId();
      this.cargarComboMarcas();
    }
  
    guardar() {
      if (Number(this.id) > 0 && this.editando) {
        this.editar();
      } else {
        this.crear();
      }
    }
  
    async ObtenerId() {
      try {
        const data = await firstValueFrom(this.wsdl.getId(Number(this.id)));
        console.log("data")
        const result = JSON.parse(JSON.stringify(data));
        //console.log('find id', result);
  
        if (result.code === '200') {
          this.item = result.dato;
          this.editando = true;
        }
      } catch (error: any) {
        //console.log("error", error)
        if (error.status === 500) {
          Swal.fire({
            title: 'Error al obtener el registro',
            text: 'Ocurrió un error inesperado. Verifique!',
            icon: 'error',
          });
        }
      }
    }
  
    async editar() {
      try {
        const data = await firstValueFrom(this.wsdl.update(this.item));
        const result = JSON.parse(JSON.stringify(data));
  
        if (result.code === '200') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registro actualizado correctamente',
            showConfirmButton: false,
            timer: 1500,
          });
          this.back();
        } else {
          Swal.fire('Atención', result.message, 'warning');
        }
      } catch (error: any) {
        if (error.status == '500') {
          Swal.fire({
            title: 'Error al editar registro, verifique!',
            icon: 'error',
          });
        }
      }
    }
  
    async crear() {
      try {
        const data = await firstValueFrom(this.wsdl.post(this.item));
        const result = JSON.parse(JSON.stringify(data));
  
        if (result.code === '201') {
          Swal.fire({
            title: 'FELICITACIONES!',
            text: 'Registro creado correctamente!',
            icon: 'success',
          });
        }
  
        this.back();
      } catch (error: any) {
        if (error.status === 500) {
          Swal.fire({
            title: 'Error al insertar el registro',
            text: 'Ocurrió un error inesperado. Verifique!',
            icon: 'error',
          });
        }
      }
    }

    cargarComboMarcas(): void {
  this.wsdlMarca.combo().subscribe({
    next: (resp) => {
      this.marca = resp;
    },
    error: (error) => {
      console.error('Error al cargar combo de marcas', error);
    }
  });
}
  
    marcaSeleccionado(generico: Marca| null) {
      if (!generico) {
        this.item.marca = null;
        return;
      }
  
      this.item.marca = generico.idMarca;
      this.item.nombreMarca = generico.nombre;
    }
  
    back() {
      this.route.navigate(['pages/lst_modelos']);
    }

}
