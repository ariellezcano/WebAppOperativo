import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'Reportes';
  }

  // =====================================================
  // REPORTE GENERAL DE RADIOS ENTREGADAS
  // =====================================================

  radiosEntregadas(
    idOperativo: number | null,
    fechaDesde: string | null,
    fechaHasta: string | null,
    estadoEntrega: number | null,
    filtroEquipo: string | null,
    filtroPersona: string | null,
  ): Observable<any> {
    let params = new HttpParams();

    // =====================================================
    // OPERATIVO
    // =====================================================

    if (idOperativo !== null && idOperativo > 0) {
      params = params.set('idOperativo', idOperativo.toString());
    }

    // =====================================================
    // FECHA DESDE
    // =====================================================

    if (fechaDesde && fechaDesde.trim() !== '') {
      params = params.set('fechaDesde', fechaDesde);
    }

    // =====================================================
    // FECHA HASTA
    // =====================================================

    if (fechaHasta && fechaHasta.trim() !== '') {
      params = params.set('fechaHasta', fechaHasta);
    }

    // =====================================================
    // ESTADO ENTREGA
    // =====================================================

    if (estadoEntrega !== null && estadoEntrega > 0) {
      params = params.set('estadoEntrega', estadoEntrega.toString());
    }

    // =====================================================
    // FILTRO EQUIPO
    // =====================================================

    if (filtroEquipo && filtroEquipo.trim() !== '') {
      params = params.set('filtroEquipo', filtroEquipo.trim());
    }

    // =====================================================
    // FILTRO PERSONA
    // =====================================================

    if (filtroPersona && filtroPersona.trim() !== '') {
      params = params.set('filtroPersona', filtroPersona.trim());
    }

    // =====================================================
    // PETICION
    // =====================================================

    return this.http.get<any>(`${this.api}/RadiosEntregadas`, {
      params,
    });
  }
}
