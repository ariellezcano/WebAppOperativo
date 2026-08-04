import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Operativo } from 'src/app/modelos/components/operativo';
import { OperativoService } from 'src/app/services/components/operativo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-operativo',
  templateUrl: './abm-operativo.component.html',
  styleUrls: ['./abm-operativo.component.scss'],
})
export class AbmOperativoComponent implements OnInit {
  item: Operativo;

  editando = false;

  constructor(
    private wsdl: OperativoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.item = new Operativo();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id > 0) {
      this.editando = true;

      this.obtener(id);
    }
  }

  async obtener(id: number) {
    try {
      const re = await firstValueFrom(this.wsdl.obtenerPorId(id));

      const result = JSON.parse(JSON.stringify(re));

      if (result.code === '200') {
        this.item = result.dato;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async guardar() {
    try {
      const re = this.editando
        ? await firstValueFrom(this.wsdl.editar(this.item))
        : await firstValueFrom(this.wsdl.crear(this.item));

      const result = JSON.parse(JSON.stringify(re));

      if (result.code === '200' || result.code === '201') {
        Swal.fire({
          icon: 'success',

          title: this.editando
            ? 'Operativo actualizado'
            : 'Operativo registrado',

          timer: 1500,

          showConfirmButton: false,
        });

        this.back();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible guardar el operativo.', 'error');
    }
  }

  back() {
    this.router.navigate(['pages/lst_operativos']);
  }
}
