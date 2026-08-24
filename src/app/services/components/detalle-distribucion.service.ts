import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DetalleDistribucionService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'DetalleDistribucion';
  }

  listar(
    pagina: number = 1,
    tamanoPagina: number = 10,
    filtro: string = '',
  ): Observable<any> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanoPagina', tamanoPagina.toString());

    if (filtro && filtro.trim() !== '') {
      params = params.set('filtro', filtro.trim());
    }

    return this.http.get<any>(`${this.api}/Listar`, { params });
  }

  obtenerPorId(
  idDetalle: number,
): Observable<any> {
  const params =
    new HttpParams()
      .set(
        'idDetalle',
        idDetalle.toString(),
      );

  return this.http.get<any>(
    `${this.api}/ObtenerPorId`,
    { params },
  );
}
}
