import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Results } from 'src/app/modelos/results';
import { DetalleOperativoDTO } from 'src/app/modelos/relacionModelos/detalle-operativo-dto';
import { EquipamientoDTO } from 'src/app/modelos/relacionModelos/equipamientoDTO';
import { DetalleOperativo } from 'src/app/modelos/components/detalleOperativo';

@Injectable({
  providedIn: 'root'
})
export class DetalleOperativoService {

  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'DetalleOperativo';
  }

  /*==================================
  LISTAR
  ==================================*/

  listar(
    pagina: number,
    cantidad: number,
    busqueda?: string
  ): Observable<Results<DetalleOperativoDTO>> {

    const params: any = {
      pagina: pagina.toString(),
      tamanoPagina: cantidad.toString()
    };

    if (busqueda) {
      params.filtro = busqueda;
    }

    return this.http.get<Results<DetalleOperativoDTO>>(
      `${this.api}/Listar`,
      { params }
    );
  }

  /*==================================
  LISTAR POR OPERATIVO
  ==================================*/

  listarPorOperativo(idOperativo: number) {

    return this.http.get<Results<DetalleOperativoDTO>>(
      `${this.api}/Operativo/${idOperativo}`
    );

  }

  /*==================================
  EQUIPOS DISPONIBLES
  ==================================*/

  equiposDisponibles(
    pagina: number,
    cantidad: number,
    busqueda?: string
  ) {

    let params = new HttpParams()
      .set('pagina', pagina)
      .set('tamanoPagina', cantidad);

    if (busqueda) {
      params = params.set('filtro', busqueda);
    }

    return this.http.get<Results<EquipamientoDTO>>(
      `${this.api}/EquiposDisponibles`,
      { params }
    );

  }

  /*==================================
  OBTENER POR ID
  ==================================*/

  getId(idDetalleOperativo: number) {

    return this.http.get<Results<DetalleOperativoDTO>>(
      `${this.api}/${idDetalleOperativo}`
    );

  }

  /*==================================
  INSERTAR
  ==================================*/

  insert(item: DetalleOperativo) {

    return this.http.post<Results<DetalleOperativo>>(
      `${this.api}`,
      item
    );

  }

  /*==================================
  EDITAR
  ==================================*/

  update(item: DetalleOperativo) {

    return this.http.put<Results<DetalleOperativo>>(
      `${this.api}/${item.idDetalleOperativo}`,
      item
    );

  }

  /*==================================
  ELIMINAR (BAJA)
  ==================================*/

  delete(
    idDetalleOperativo: number,
    usuarioBaja: number
  ) {

    const params = new HttpParams()
      .set('usuarioBaja', usuarioBaja);

    return this.http.delete<Results<any>>(
      `${this.api}/${idDetalleOperativo}`,
      { params }
    );

  }

}