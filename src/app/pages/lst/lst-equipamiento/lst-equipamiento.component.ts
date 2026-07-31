import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EquipamientoDTO } from 'src/app/modelos/relacionModelos/equipamientoDTO';
import { EquipamientoService } from 'src/app/services/components/equipamiento.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';
import { FilEquipamientoComponent } from '../../filtros/fil-equipamiento/fil-equipamiento.component';

@Component({
  selector: 'app-lst-equipamiento',
  templateUrl: './lst-equipamiento.component.html',
  styleUrls: ['./lst-equipamiento.component.scss'],
})
export class LstEquipamientoComponent implements OnInit {
  @ViewChild(FilEquipamientoComponent, { static: false })
  fil!: FilEquipamientoComponent;

  items: EquipamientoDTO[] = [];

  rol = '';

  constructor(
    private wsdl: EquipamientoService,

    private router: Router,
  ) {}

  ngOnInit() {
    const personal = Utils.getSession('personal');

    if (personal) {
      const obj = JSON.parse(personal);

      this.rol = obj.rol;
    }
  }

  doFound(event: EquipamientoDTO[]) {
    this.items = event;
  }

  linkear(id: number) {
    this.router.navigateByUrl('pages/abm_equipamiento/' + id);
  }

  back() {
    this.router.navigate(['pages/lst_equipo']);
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar equipamiento?',

      showDenyButton: true,

      confirmButtonText: 'Eliminar',

      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminacion(id);
      }
    });
  }

  async eliminacion(id: number) {
    const re = await firstValueFrom(this.wsdl.delete(id));

    const result = JSON.parse(JSON.stringify(re));

    if (result.code == '200') {
      Swal.fire(
        'Correcto',

        '',

        'success',
      );

      this.fil.filter();
    }
  }

  puedeOperar() {
    return (
      this.rol == 'MANAGER' ||
      this.rol == 'ADMINISTRADOR' ||
      this.rol == 'DEVELOPER'
    );
  }

  puedeEliminar() {
    return this.rol == 'MANAGER' || this.rol == 'DEVELOPER';
  }
}
