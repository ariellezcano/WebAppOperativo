import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from 'src/app/services/navbar.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-panel-seleccion',
  templateUrl: './panel-seleccion.component.html',
  styleUrls: ['./panel-seleccion.component.scss'],
})
export class PanelSeleccionComponent implements OnInit {
  
  constructor(
    private router: Router,
    private navbarService: NavbarService,
  ) {}

  rol: string = '';


  fechaActual: Date = new Date();

  private intervalo!: any;


  ngOnDestroy(): void {

    clearInterval(this.intervalo);

  }

  ngOnInit(): void {
    const personalString = Utils.getSession('personal');

    if (personalString) {
      const personal = JSON.parse(personalString);
      this.rol = personal.rol;
    }

    this.fechaActual = new Date();

    this.intervalo = setInterval(() => {
      this.fechaActual = new Date();
    }, 1000);
  }

  irAUsuarios() {
    this.navbarService.setModo('usuarios');
    this.router.navigate(['/pages/lst_usuario']);
  }


  irAMovimientos() {
    this.navbarService.setModo('movimientos');
    this.router.navigate(['/pages/lst_movimientos']);
  }

  volverAlPanel() {
    this.navbarService.setModo('principal');
    this.router.navigate(['/pages/principal']);
  }

  irAPlanillas() {
    this.navbarService.setModo('planillaDistribucion');
    this.router.navigate(['/pages/abm_entrega_equipo']);
  }

  irAEquipamientos() {
    this.navbarService.setModo('equipamiento');
    this.router.navigate(['/pages/lst_equipos']);
  }

  irAOperativos() {
    this.navbarService.setModo('operativo');
    this.router.navigate(['/pages/lst_operativos']);
  }

  irAReportes() {
    this.navbarService.setModo('reportes');
    this.router.navigate(['/pages/panel_reportes']);
  }
}
