import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoEquipo } from 'src/app/modelos/components/tipoEquipo';
import { Results } from 'src/app/modelos/results';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoEquipoService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'TipoEquipo';
  }

  //LISTAR
  listar(pagina: number, cantidad: number, busqueda?: string) {
    const params: any = {
      pagina: pagina.toString(),
      tamanoPagina: cantidad.toString(),
    };

    if (busqueda) params.filtro = busqueda;

    return this.http.get<Results<TipoEquipo>>(`${this.api}/Listar`, {
      params,
    });
  }

  //OBTENER POR ID
  getId(id: number) {
    return this.http.get<Results<TipoEquipo>>(`${this.api}/${id}`);
  }

  //INSERTAR
  insert(item: TipoEquipo) {
    return this.http.post(`${this.api}`, item);
  }

  //EDITAR
  update(item: any) {
    return this.http.put(`${this.api}/${item.idTipoEquipo}`, item);
  }

  //ELIMINAR
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  //COMBO
  combo() {
    return this.http.get<TipoEquipo[]>(`${this.api}/Combo`);
  }
}
