import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Console } from 'console';
import { firstValueFrom } from 'rxjs';
import { Marca } from 'src/app/modelos/components/marca';
import { MarcaService } from 'src/app/services/components/marca.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-marca',
  templateUrl: './abm-marca.component.html',
  styleUrls: ['./abm-marca.component.scss'],
})
export class AbmMarcaComponent implements OnInit {
  item: Marca;
  editando = false;

  constructor(
    private wsdl: MarcaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.item = new Marca();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && Number(id) > 0) {
      this.editando = true;
      this.obtener(Number(id));
    } else {
      this.editando = false;
      this.item = new Marca(); // limpio para alta
    }
  }

  async obtener(id: number) {
    const re = await firstValueFrom(this.wsdl.getId(id));
    const result = JSON.parse(JSON.stringify(re));

    if (result.code === "200") {
      console.log(result)
      this.item = result.dato;
      //this.editando = true;
    }
  }

  async guardar() {
    try {
     // console.log('editando', this.editando);
      const re = this.editando
        ? await firstValueFrom(this.wsdl.update(this.item))
        : await firstValueFrom(this.wsdl.insert(this.item));

      const result = JSON.parse(JSON.stringify(re));

      if (result.code === "201" || result.code === "200") {
        Swal.fire({
          icon: 'success',
          title:
            result.code === "201"
              ? 'Guardado correctamente'
              : 'Actualizado correctamente',
          timer: 1500,
          showConfirmButton: false,
        });

        this.back();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar la marca', 'error');
    }
  }

  back() {
    this.router.navigate(['pages/lst_marcas']);
  }
}
