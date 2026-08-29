import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from 'src/app/services/navbar.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-panel-seleccion',
  templateUrl: './panel-seleccion.component.html',
  styleUrls: ['./panel-seleccion.component.scss'],
})
export class PanelSeleccionComponent implements OnInit, OnDestroy {

  rol: string = '';

  fechaActual: Date = new Date();

  private intervalo!: any;

  constructor(
    private router: Router,
    private navbarService: NavbarService
  ) {}

  ngOnInit(): void {
    const personalString = Utils.getSession('personal');

    if (personalString) {
      const personal = JSON.parse(personalString);

      this.rol = personal.rol?.trim().toUpperCase() || '';
    }

    this.fechaActual = new Date();

    this.intervalo = setInterval(() => {
      this.fechaActual = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  irAUsuarios(): void {
    this.navbarService.setModo('usuarios');
    this.router.navigate(['/pages/lst_usuario']);
  }

  irAMovimientos(): void {
    this.navbarService.setModo('movimientos');
    this.router.navigate(['/pages/lst_movimientos']);
  }

  volverAlPanel(): void {
    this.navbarService.setModo('principal');
    this.router.navigate(['/pages/principal']);
  }

  irAPlanillas(): void {
    this.navbarService.setModo('planillaDistribucion');
    this.router.navigate(['/pages/abm_entrega_equipo']);
  }

  irAEquipamientos(): void {
    this.navbarService.setModo('equipamiento');
    this.router.navigate(['/pages/lst_equipos']);
  }

  irAOperativos(): void {
    this.navbarService.setModo('operativo');
    this.router.navigate(['/pages/lst_operativos']);
  }

  irAReportes(): void {
    this.navbarService.setModo('reportes');
    this.router.navigate(['/pages/panel_reportes']);
  }
}