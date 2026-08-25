import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { PlanillaDistribucion } from 'src/app/modelos/components/planilla-distribucion';

@Injectable({
  providedIn: 'root',
})
export class PlanillaDistribucionService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'PlanillaDistribucion';
  }

  // =====================================================
  // LISTAR
  // =====================================================

  listar(
    pagina: number = 1,
    tamanoPagina: number = 10,
    filtro: string = '',
  ): Observable<any> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanoPagina', tamanoPagina.toString());

    if (filtro && filtro.trim() !== '') {
      params = params.set('filtro', filtro);
    }

    return this.http.get<any>(`${this.api}/Listar`, { params });
  }

  // =====================================================
  // OBTENER POR ID
  // =====================================================

  obtenerPorId(idDistribucion: number): Observable<any> {
    const params = new HttpParams().set(
      'idDistribucion',
      idDistribucion.toString(),
    );

    return this.http.get<any>(`${this.api}/ObtenerPorId`, { params });
  }

  // =====================================================
  // CREAR ENTREGA
  // =====================================================

  crear(planilla: PlanillaDistribucion): Observable<any> {
    return this.http.post<any>(`${this.api}/Crear`, planilla);
  }

  // =====================================================
  // EDITAR
  // =====================================================

  editar(planilla: PlanillaDistribucion): Observable<any> {
    return this.http.put<any>(`${this.api}/Editar`, planilla);
  }

  // =====================================================
  // BUSCAR RADIO OPERATIVO
  // =====================================================

  buscarRadioOperativo(
    idOperativo: number,
    idPolicial: string,
  ): Observable<any> {
    const params = new HttpParams()
      .set('idOperativo', idOperativo.toString())
      .set('idPolicial', idPolicial);

    return this.http.get<any>(`${this.api}/BuscarRadioOperativo`, { params });
  }

  // =====================================================
  // BUSCAR EQUIPAMIENTO DEL OPERATIVO
  // =====================================================

  buscarEquipamientoOperativo(
    idOperativo: number,
    filtro: string = '',
  ): Observable<any> {
    let params = new HttpParams().set('idOperativo', idOperativo.toString());

    if (filtro && filtro.trim() !== '') {
      params = params.set('filtro', filtro);
    }

    return this.http.get<any>(`${this.api}/BuscarEquipamientoOperativo`, {
      params,
    });
  }

  // =====================================================
  // RECIBIR EQUIPAMIENTO
  // =====================================================

  recibirEquipamiento(
    idDetalle: number,
    usuarioRecibe: number,
    observacionRecepcion: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('idDetalle', idDetalle.toString())
      .set('usuarioRecibe', usuarioRecibe.toString())
      .set('observacionRecepcion', observacionRecepcion);

    return this.http.put<any>(`${this.api}/RecibirEquipamiento`, null, {
      params,
    });
  }

  // =====================================================
  // ANULAR ENTREGA
  // =====================================================

  eliminarLogico(
    idDistribucion: number,
    usuarioRecibe: number,
  ): Observable<any> {
    const params = new HttpParams()
      .set('idDistribucion', idDistribucion.toString())
      .set('usuarioRecibe', usuarioRecibe.toString());

    return this.http.put<any>(`${this.api}/EliminarLogico`, null, { params });
  }

  // =====================================================
  // CONFIRMAR ENTREGA
  // =====================================================

  entregarEquipamiento(
    idDistribucion: number,
    usuarioEntrega: number,
  ): Observable<any> {
    const params = new HttpParams()
      .set('idDistribucion', idDistribucion.toString())
      .set('usuarioEntrega', usuarioEntrega.toString());

    return this.http.put<any>(`${this.api}/EntregarEquipamiento`, null, {
      params,
    });
  }

  // =====================================================
  // CERRAR OPERATIVO
  // =====================================================

  cerrarOperativo(idOperativo: number, usuarioBaja: number): Observable<any> {
    const params = new HttpParams()
      .set('idOperativo', idOperativo.toString())
      .set('usuarioBaja', usuarioBaja.toString());

    return this.http.put<any>(`${this.api}/CerrarOperativo`, null, { params });
  }

  anular(idDetalle: number, usuario: number): Observable<any> {
    const params = new HttpParams()
      .set('idDetalle', idDetalle.toString())
      .set('usuario', usuario.toString());

    return this.http.put<any>(`${this.api}/Anular`, null, { params });
  }
}
