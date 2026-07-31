import { Component, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { FilMarcaComponent } from '../../filtros/fil-marca/fil-marca.component';
import { Router } from '@angular/router';
import { Utils } from 'src/app/utils/utils';
import { MarcaService } from 'src/app/services/components/marca.service';
import { Marca } from 'src/app/modelos/components/marca';

@Component({
  selector: 'app-lst-marca',
  templateUrl: './lst-marca.component.html',
  styleUrls: ['./lst-marca.component.scss'],
})
export class LstMarcaComponent implements OnInit {
  @ViewChild(FilMarcaComponent, { static: false })
  fil!: FilMarcaComponent;

  item: Marca;
  items: Marca[];

  rol: string = '';

  constructor(
    private wsdl: MarcaService,
    private route: Router,
  ) {
    this.item = new Marca();
    this.items = [];
  }

  ngOnInit(): void {
    const personal = Utils.getSession('personal');

    if (personal) {
      try {
        const obj = JSON.parse(personal);
        this.rol = obj.rol || '';
      } catch {
        this.rol = '';
      }
    }
  }

  doFound(event: Marca[]) {
    this.items = event;
  }

  linkear(id?: Number) {
    this.route.navigateByUrl('pages/abm_marcas/' + id);
  }

  back() {
    this.route.navigate(['pages/lst_marcas']);
  }

  async eliminar(id: number) {
    Swal.fire({
      title: 'Estás seguro de eliminar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.eliminacion(id);
      } else if (result.isDenied) {
        Swal.fire('Operacion cancelada', '', 'info');
      }
    });
  }

  async eliminacion(id: number) {
    try {
      const data = await firstValueFrom(this.wsdl.delete(id));
      const result = JSON.parse(JSON.stringify(data));
      console.log('resultado', result);
      if (result.code === '200') {
        Swal.fire('Operación realizada...', '', 'success');
        this.back();
        this.fil.filter();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch (error: any) {
      if (error.status == '500') {
        Swal.fire({
          title: 'Error al crear registro, verifique!',
          icon: 'error',
        });
      }
    }
  }

  /* =========================
   PERMISOS
========================= */

  puedeOperar(): boolean {
    return (
      this.rol === 'MANAGER' ||
      this.rol === 'DEVELOPER' ||
      this.rol === 'ADMINISTRADOR'
    );
  }

  puedeEliminar(): boolean {
    return this.rol === 'MANAGER' || this.rol === 'DEVELOPER';
  }
}
