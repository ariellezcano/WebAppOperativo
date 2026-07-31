import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from 'src/app/modelos/components/marca';
import { MarcaComboDTO } from 'src/app/modelos/relacionModelos/marcaComboDTO';
import { Results } from 'src/app/modelos/results';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'Marca';
  }

  listar(
    pagina: number,
    cantidad: number,
    busqueda?: string
  ): Observable<Results<Marca>> {
    const params: any = {
      pagina: pagina.toString(),
      tamanoPagina: cantidad.toString(),
    };

    if (busqueda) params.filtro = busqueda;

    return this.http.get<Results<Marca>>(`${this.api}/Listar`, {
      params,
    });
  }

  /* =======================
     OBTENER POR ID
  ======================= */
  getId(id: number) {
    return this.http.get<Results<Marca>>(
      `${this.api}/Obtener/${id}`
    );
  }

  /* =======================
     CREAR
  ======================= */
  insert(marca: { nombre: string }) {
    return this.http.post<Results<Marca>>(
      `${this.api}/Crear`,
      marca
    );
  }

  /* =======================
     EDITAR
  ======================= */
  update(marca: Marca) {
    return this.http.put<Results<Marca>>(
      `${this.api}/Editar`,
      marca
    );
  }

  /* =======================
     ELIMINAR LÓGICO
  ======================= */
  delete(id: number) {
    return this.http.delete<Results<any>>(
      `${this.api}/Eliminar/${id}`
    );
  }

  /* =======================
     COMBO SIMPLE
  ======================= */
  combo() {
    return this.http.get<MarcaComboDTO[]>(
      `${this.api}/Combo`
    );
  }


}
