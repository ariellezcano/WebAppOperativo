import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operativo } from 'src/app/modelos/components/operativo';
import { Results } from 'src/app/modelos/results';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OperativoService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'Operativo';
  }

  /* ===========================
     LISTAR
     =========================== */
  listar(
    pagina: number,
    cantidad: number,
    busqueda?: string,
  ): Observable<Results<Operativo>> {
    const params: any = {
      pagina: pagina.toString(),
      tamanoPagina: cantidad.toString(),
    };

    if (busqueda) {
      params.filtro = busqueda;
    }

    return this.http.get<Results<Operativo>>(`${this.api}/Listar`, {
      params,
    });
  }

  /* ===========================
     OBTENER POR ID
     =========================== */
  obtenerPorId(idOperativo: number): Observable<Results<Operativo>> {
    return this.http.get<Results<Operativo>>(`${this.api}/${idOperativo}`);
  }

  /* ===========================
     CREAR
     =========================== */
  crear(operativo: Operativo): Observable<Results<Operativo>> {
    return this.http.post<Results<Operativo>>(this.api, operativo);
  }

  /* ===========================
     EDITAR
     =========================== */
  editar(operativo: Operativo): Observable<Results<Operativo>> {
    return this.http.put<Results<Operativo>>(
      `${this.api}/${operativo.idOperativo}`,
      operativo,
    );
  }

  /* ===========================
     ELIMINAR LÓGICO
     =========================== */
  eliminar(idOperativo: number): Observable<Results<Operativo>> {
    return this.http.delete<Results<Operativo>>(`${this.api}/${idOperativo}`);
  }

  combo(): Observable<any> {
    return this.http.get<any>(`${this.api}/Combo`);
  }
}
