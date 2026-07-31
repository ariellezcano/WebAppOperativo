import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from 'src/app/modelos/components/estado';
import { Results } from 'src/app/modelos/results';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'Estado';
  }

  /* =======================
   LISTAR
======================= */
  listar(
    pagina: number,
    cantidad: number,
    busqueda?: string,
  ): Observable<Results<Estado>> {
    const params: any = {
      pagina: pagina.toString(),
      tamanoPagina: cantidad.toString(),
    };

    if (busqueda) params.filtro = busqueda;

    return this.http.get<Results<Estado>>(`${this.api}/Listar`, { params });
  }

  /* =======================
   OBTENER POR ID
======================= */
  getId(idEstado: number) {
    return this.http.get<Results<Estado>>(`${this.api}/${idEstado}`);
  }

  /* =======================
   CREAR
======================= */
  insert(estado: Estado) {
    return this.http.post<Results<Estado>>(`${this.api}`, estado);
  }

  /* =======================
   EDITAR
======================= */
  update(estado: Estado) {
    return this.http.put<Results<Estado>>(
      `${this.api}/${estado.idEstado}`,
      estado,
    );
  }

  /* =======================
   ELIMINAR LÓGICO
======================= */
  delete(idEstado: number) {
    return this.http.delete<Results<any>>(`${this.api}/${idEstado}`);
  }
}
