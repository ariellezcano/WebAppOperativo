import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovimientosService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'Movimiento';
  }

  listar(
    pagina: number,
    tamanoPagina: number,
    filtro: string,
    idOperativo: number | null,
    tipoMovimiento: string | null,
  ): Observable<any> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanoPagina', tamanoPagina.toString());

    if (filtro && filtro.trim() !== '') {
      params = params.set('filtro', filtro.trim());
    }

    if (idOperativo !== null && idOperativo > 0) {
      params = params.set('idOperativo', idOperativo.toString());
    }

    if (tipoMovimiento && tipoMovimiento.trim() !== '') {
      params = params.set('tipoMovimiento', tipoMovimiento.trim());
    }

    return this.http.get<any>(`${this.api}/Listar`, { params });
  }
}
