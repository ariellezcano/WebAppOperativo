import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Estado } from 'src/app/modelos/components/estado';
import { EstadoService } from 'src/app/services/components/estado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-estado',
  templateUrl: './abm-estado.component.html',
  styleUrls: ['./abm-estado.component.scss'],
})
export class AbmEstadoComponent implements OnInit {
  item: Estado;
  editando = false;

  constructor(
    private wsdl: EstadoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.item = new Estado();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && Number(id) > 0) {
      this.editando = true;
      this.obtener(Number(id));
    } else {
      this.editando = false;
      this.item = new Estado();
    }
  }

  async obtener(id: number) {
    try {
      const re = await firstValueFrom(this.wsdl.getId(id));

      const result = JSON.parse(JSON.stringify(re));

      if (result.code == '200') {
        this.item = result.dato;
      }
    } catch {
      Swal.fire('Error', 'No se pudo obtener el registro.', 'error');
    }
  }

  async guardar() {
    try {
      const re = this.editando
        ? await firstValueFrom(this.wsdl.update(this.item))
        : await firstValueFrom(this.wsdl.insert(this.item));

      const result = JSON.parse(JSON.stringify(re));

      if (result.code == '200' || result.code == '201') {
        Swal.fire({
          icon: 'success',

          title: this.editando
            ? 'Estado actualizado correctamente'
            : 'Estado registrado correctamente',

          timer: 1500,

          showConfirmButton: false,
        });

        this.back();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch {
      Swal.fire('Error', 'No fue posible guardar el registro.', 'error');
    }
  }

  back() {
    this.router.navigate(['pages/lst_estados']);
  }
}
