// navbar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NavbarModo =
  | 'principal'
  | 'usuarios'
  | 'equipamiento'
  | 'movimientos'
  | 'operativo'
  | 'planillaDistribucion'
  | 'reportes';

@Injectable({ providedIn: 'root' })
export class NavbarService {
  private modoSubject = new BehaviorSubject<NavbarModo>('principal');
  modo$ = this.modoSubject.asObservable();

  // setModo(modo: NavbarModo) {
  //   this.modoSubject.next(modo);
  // }

  constructor() {
    const guardado = sessionStorage.getItem('navbarModo') as NavbarModo | null;
    this.modoSubject.next(guardado ?? 'principal');
  }

  getModo(): NavbarModo {
    return this.modoSubject.value;
  }

  setModo(modo: NavbarModo) {
    sessionStorage.setItem('navbarModo', modo);
    this.modoSubject.next(modo);
  }
}
