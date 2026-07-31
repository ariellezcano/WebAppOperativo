import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';
import { NAVBAR_CONFIG, NavbarConfig } from './navbar.config';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  usuario!: {};
  @Input() modo!: string;

  config!: NavbarConfig;

  constructor(private router: Router, private navbarService: NavbarService) {}

  ngOnInit(): void {
    const personal = JSON.parse(Utils.getSession('personal') || '{}');
    //this.rol = personal.rol || '';
    this.usuario = `${personal.apellido || ''} ${personal.nombre || ''}`;
  }

  ngOnChanges() {
    this.config = NAVBAR_CONFIG[this.modo];
  }

  logout() {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Deberá volver a iniciar sesión!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cerrar();
      }
    });
  }

  cerrar(): void {
    Utils.clearSession();
    sessionStorage.removeItem('navbarModo');
    this.navbarService.setModo('principal');
    this.router.navigate(['/login']);
  }

  volverAlPanel() {
    this.navbarService.setModo('principal');
    this.router.navigate(['/pages/principal']);
  }
}
