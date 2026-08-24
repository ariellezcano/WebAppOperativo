import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

import { DetalleDistribucionDTO } from 'src/app/modelos/relacionModelos/detalleDistribucionDTO';
import { DetalleDistribucionService } from 'src/app/services/components/detalle-distribucion.service';
import { PlanillaDistribucionService } from 'src/app/services/components/planilla-distribucion.service';

@Component({
  selector: 'app-frm-detalle-distribucion',
  templateUrl: './frm-detalle-distribucion.component.html',
  styleUrls: ['./frm-detalle-distribucion.component.scss'],
})
export class FrmDetalleDistribucionComponent implements OnInit {
  idDetalle = 0;

  item: DetalleDistribucionDTO | null = null;

  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wsdlPlanillaDistribucion: PlanillaDistribucionService,
    private wsdl: DetalleDistribucionService,
  ) {}

  async ngOnInit() {
    this.idDetalle = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (this.idDetalle > 0) {
      await this.cargar();
    }
  }

  async cargar() {
    try {
      this.cargando = true;

      const re = await firstValueFrom(
        this.wsdl.obtenerPorId(this.idDetalle)
      );

      const result = JSON.parse(JSON.stringify(re));

      if (
        result.code === '200' &&
        result.data &&
        result.data.length > 0
      ) {
        this.item = result.data[0];
      } else {
        this.item = null;

        Swal.fire(
          'Atención',
          'No se encontró el detalle de la entrega.',
          'warning'
        );
      }
    } catch (error) {
      console.error(error);

      this.item = null;

      Swal.fire(
        'Error',
        'Ocurrió un error al cargar la entrega.',
        'error'
      );
    } finally {
      this.cargando = false;
    }
  }

  back() {
    this.router.navigate([
      'pages/lst_detalle_distribucion',
    ]);
  }

  recepcionar() {
    if (!this.item) {
      return;
    }

    Swal.fire({
      title: '¿Recepcionar equipo?',
      text: `Se recepcionará el equipo ${this.item.idPolicial ?? ''}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Recepcionar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754',
    }).then((result) => {
      if (result.isConfirmed) {
        // Acá después llamamos al endpoint Recepcionar
        console.log(
          'Recepcionar detalle:',
          this.item?.idDetalle
        );
      }
    });
  }

  anular() {
    if (!this.item) {
      return;
    }

    Swal.fire({
      title: '¿Anular entrega?',
      text: `Se anulará la entrega del equipo ${this.item.idPolicial ?? ''}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Anular',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        // Acá después llamamos al endpoint Anular
        console.log(
          'Anular detalle:',
          this.item?.idDetalle
        );
      }
    });
  }
}