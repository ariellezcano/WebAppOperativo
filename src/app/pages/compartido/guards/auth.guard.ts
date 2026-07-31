import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Utils } from 'src/app/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    const personal = Utils.getSession('personal');

    if (!personal) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}