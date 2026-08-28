import { FilMovimientosComponent } from './../../filtros/fil-movimientos/fil-movimientos.component';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { MovimientoDTO } from 'src/app/modelos/relacionModelos/movimientoDTO';

@Component({
  selector: 'app-lst-movimientos',
  templateUrl: './lst-movimientos.component.html',
  styleUrls: ['./lst-movimientos.component.scss'],
})
export class LstMovimientosComponent implements OnInit {
  @ViewChild(FilMovimientosComponent, {
    static: false,
  })
  fil!: FilMovimientosComponent;

  items: MovimientoDTO[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  // =========================================
  // RECIBIR RESULTADO DEL FILTRO
  // =========================================

  doFound(event: MovimientoDTO[]): void {
    console.log("data", event)
    this.items = event;
  }

  // =========================================
  // VOLVER
  // =========================================

  back(): void {
    this.router.navigate(['pages/lst_movimientos']);
  }

  // =========================================
  // CLASE SEGUN TIPO MOVIMIENTO
  // =========================================

  claseMovimiento(tipo: string): string {
    switch (tipo?.toUpperCase()) {
      case 'ENTREGA':
        return 'bg-primary';

      case 'RECEPCION':
        return 'bg-success';

      case 'ANULACION':
        return 'bg-danger';

      default:
        return 'bg-secondary';
    }
  }

  // =========================================
  // TEXTO TIPO MOVIMIENTO
  // =========================================

  textoMovimiento(tipo: string): string {
    switch (tipo?.toUpperCase()) {
      case 'ENTREGA':
        return 'ENTREGA';

      case 'RECEPCION':
        return 'RECEPCIÓN';

      case 'ANULACION':
        return 'ANULACIÓN';

      default:
        return tipo || '-';
    }
  }
}
