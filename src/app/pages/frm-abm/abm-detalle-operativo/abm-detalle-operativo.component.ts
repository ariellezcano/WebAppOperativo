import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleOperativo } from 'src/app/modelos/components/detalleOperativo';
import { DetalleOperativoService } from 'src/app/services/components/detalle-operativo.service';
import { EquipamientoService } from 'src/app/services/components/equipamiento.service';

@Component({
  selector: 'app-abm-detalle-operativo',
  templateUrl: './abm-detalle-operativo.component.html',
  styleUrls: ['./abm-detalle-operativo.component.scss'],
})
export class AbmDetalleOperativoComponent implements OnInit {
  idOperativo!: number;

  operativo: any;

  turno: string = '';

  observacion: string = '';

  equiposDisponibles: any[] = [];

  equiposOperativo: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DetalleOperativoService,
  ) {}

  ngOnInit(): void {
    this.idOperativo = Number(this.route.snapshot.paramMap.get('id'));

    this.cargarDisponibles();

    this.cargarAsignados();
  }

  cargarDisponibles() {
    this.service.equiposDisponibles(1, 100).subscribe({
      next: (resp: any) => {
        let data = JSON.parse(resp);

        console.log('Disponibles', data);

        this.equiposDisponibles = data.data;
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  cargarAsignados() {
    this.service.listarPorOperativo(this.idOperativo).subscribe({
      next: (resp: any) => {
        let data = JSON.parse(resp);

        console.log('Asignados', data);

        this.equiposOperativo = data.data;
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  agregar(item: any) {
    if (!this.turno) {
      alert('Seleccione turno');
      return;
    }

    let detalle = new DetalleOperativo();

    detalle.operativo = this.idOperativo;

    detalle.equipamiento = item.idEquipamiento;

    detalle.turno = this.turno;

    detalle.observacion = this.observacion;

    detalle.usuarioAlta = 1;

    this.service.insert(detalle).subscribe({
      next: (resp: any) => {
        let data = JSON.parse(resp);

        if (data.code == '201') {
          alert(data.message);

          this.cargarDisponibles();

          this.cargarAsignados();
        }
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  quitar(item: any) {
    if (!confirm('¿Liberar equipo del operativo?')) return;

    this.service.delete(item.idDetalleOperativo, 1).subscribe({
      next: (resp: any) => {
        let data = JSON.parse(resp);

        alert(data.message);

        this.cargarDisponibles();

        this.cargarAsignados();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  back() {
    this.router.navigate(['/operativos']);
  }
}
