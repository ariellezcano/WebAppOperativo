import { Component, OnInit } from '@angular/core';
import { NavbarModo, NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

 modoNavbar: NavbarModo = 'principal';

  constructor(private navbarService: NavbarService) {
    this.navbarService.modo$.subscribe(modo => {
      this.modoNavbar = modo;
    });
  }

  ngOnInit(): void {
  }

}
