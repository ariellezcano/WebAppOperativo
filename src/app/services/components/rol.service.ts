import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'Rol';
  }

  getList() {
    return this.http.get(`${this.api}`);
  }
}
