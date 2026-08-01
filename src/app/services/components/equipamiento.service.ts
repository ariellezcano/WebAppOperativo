import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipamiento } from 'src/app/modelos/components/equipamiento';
import { EquipamientoDTO } from 'src/app/modelos/relacionModelos/equipamientoDTO';
import { Results } from 'src/app/modelos/results';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EquipamientoService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'Equipamiento';
  }

  /* ======================================
      LISTAR
  ====================================== */

  listar(
    pagina: number,
    cantidad: number,
    busqueda?: string,
    idMarca?: number,
    idModelo?: number,
    idTipoEquipo?: number,
    idEstado?: number,
  ): Observable<Results<EquipamientoDTO>> {
    const params: any = {
      pagina: pagina.toString(),
      tamanoPagina: cantidad.toString(),
    };

    if (busqueda) params.filtro = busqueda;
    if (idMarca) params.idMarca = idMarca;
    if (idModelo) params.idModelo = idModelo;
    if (idTipoEquipo) params.idTipoEquipo = idTipoEquipo;
    if (idEstado) params.idEstado = idEstado;

    return this.http.get<Results<EquipamientoDTO>>(`${this.api}/Listar`, {
      params,
    });
  }

  /* ======================================
      OBTENER POR ID
  ====================================== */

  getId(idEquipamiento: number) {
    return this.http.get<Results<EquipamientoDTO>>(
      `${this.api}/${idEquipamiento}`,
    );
  }

  /* ======================================
      CREAR
  ====================================== */

  insert(item: Equipamiento) {
    console.log("data enviada", item)
    return this.http.post<Results<Equipamiento>>(`${this.api}`, item);
  }

  /* ======================================
      EDITAR
  ====================================== */

  update(item: Equipamiento) {
    return this.http.put<Results<Equipamiento>>(
      `${this.api}/${item.idEquipamiento}`,
      item,
    );
  }

  /* ======================================
      ELIMINAR
  ====================================== */

  delete(idEquipamiento: number) {
    return this.http.delete<Results<any>>(`${this.api}/${idEquipamiento}`);
  }
}
