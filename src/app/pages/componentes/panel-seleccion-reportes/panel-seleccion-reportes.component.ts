import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-seleccion-reportes',
  templateUrl: './panel-seleccion-reportes.component.html',
  styleUrls: ['./panel-seleccion-reportes.component.scss'],
})
export class PanelSeleccionReportesComponent {
  constructor(private router: Router) {}

  // =========================================
  // REPORTE GENERAL
  // =========================================

  irReporteGeneral(): void {
    this.router.navigate(['pages/reporte_radios_entregadas']);
  }

  // =========================================
  // REPORTE INDIVIDUAL
  // =========================================

  irReporteIndividual(): void {
    this.router.navigate(['pages/reporte_equipo']);
  }
}
