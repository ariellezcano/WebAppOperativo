import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DetalleOperativo } from 'src/app/modelos/components/detalleOperativo';
import { DetalleOperativoService } from 'src/app/services/components/detalle-operativo.service';
import { EquipamientoService } from 'src/app/services/components/equipamiento.service';
import { OperativoService } from 'src/app/services/components/operativo.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-detalle-operativo',
  templateUrl: './abm-detalle-operativo.component.html',
  styleUrls: ['./abm-detalle-operativo.component.scss'],
})
export class AbmDetalleOperativoComponent implements OnInit {
  detalle: DetalleOperativo = new DetalleOperativo();

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
    private operativoService: OperativoService,
  ) {}

  ngOnInit(): void {
    this.idOperativo = Number(this.route.snapshot.paramMap.get('id'));

    this.cargarDisponibles();
    this.cargarOperativo();
    this.cargarAsignados();

    const hoy = new Date().toISOString().split('T')[0];

    this.detalle.fechaInicio = hoy;
    this.detalle.fechaFin = hoy;
  }

  cargarOperativo() {
    this.operativoService.obtenerPorId(this.idOperativo).subscribe({
      next: (resp: any) => {
        const data = JSON.parse(JSON.stringify(resp));

        this.operativo = data.dato;
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  cargarDisponibles() {
    this.service.equiposDisponibles().subscribe({
      next: (resp: any) => {
        let data = JSON.parse(JSON.stringify(resp));

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
        let data = JSON.parse(JSON.stringify(resp));

        console.log('Asignados', data);

        this.equiposOperativo = data.data;
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  async agregar(equipo: any) {
    if (!this.detalle.fechaInicio) {
      Swal.fire('Atención', 'Debe ingresar la fecha de inicio.', 'warning');
      return;
    }

    if (!this.detalle.fechaFin) {
      Swal.fire('Atención', 'Debe ingresar la fecha de fin.', 'warning');
      return;
    }

    if (new Date(this.detalle.fechaFin) < new Date(this.detalle.fechaInicio)) {
      Swal.fire(
        'Atención',
        'La fecha fin no puede ser menor a la fecha de inicio.',
        'warning',
      );
      return;
    }

    if (!this.detalle.turno) {
      Swal.fire('Atención', 'Debe seleccionar un turno.', 'warning');
      return;
    }

    const detalle = new DetalleOperativo();

    detalle.operativo = this.idOperativo;
    detalle.equipamiento = equipo.idEquipamiento;

    detalle.turno = this.detalle.turno;
    detalle.fechaInicio = this.detalle.fechaInicio;
    detalle.fechaFin = this.detalle.fechaFin;
    detalle.observacion = this.detalle.observacion;

    detalle.usuarioAlta = Number(Utils.getSession('user'));

    try {
      const data = await firstValueFrom(this.service.insert(detalle));
      const result = JSON.parse(JSON.stringify(data));

      if (result.code === '201') {
        Swal.fire('Éxito', result.message, 'success');

        await this.cargarDisponibles();
        await this.cargarAsignados();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch (error: any) {
      console.error(error);

      Swal.fire('Error', 'No fue posible asignar el equipamiento.', 'error');
    }
  }

  quitar(item: any) {
    if (!confirm('¿Liberar equipo del operativo?')) return;

    this.service.delete(item.idDetalleOperativo, 1).subscribe({
      next: (resp: any) => {
        let data = JSON.parse(JSON.stringify(resp));

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
