import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  other_header: any;
  api;

  constructor(private http: HttpClient) {
    this.api = environment.URLUnidades + 'unidad';
    //this.api = "http://10.125.31.241:3000/unidad/";
  }
  /* particularidad de la entidad */

  getList(page: number, limit: number) {
    this.other_header = Utils.getHeader();

    return this.http
      .get(this.api + '?page=' + page + '&limit=' + limit, {
        headers: this.other_header,
      })
      .toPromise()
      .catch((err: any) => {
        return {
          code: 500,
          data: err.message,
          msg: 'Error en el servicio',
        };
      });
  }

  getCriteria(criteria: string, page: number, limit: number) {
    this.other_header = Utils.getHeader();
    return this.http
      .get(
        this.api + '/find/' + criteria + '?page=' + page + '&limit=' + limit,
        { headers: this.other_header }
      )
      .toPromise()
      .catch((err: any) => {
        return {
          code: 500,
          data: err.message,
          msg: 'Error en el servicio',
        };
      });
  }

  doFind(id: number) {
    this.other_header = Utils.getHeader();

    return this.http
      .get(this.api + '/' + id, { headers: this.other_header })
      .toPromise()
      .catch((err: any) => {
        return {
          code: 500,
          data: err.message,
          msg: 'Error en el servicio',
        };
      });
  }

  doInsert(evento: object) {
    this.other_header = Utils.getHeader();

    return this.http
      .post(this.api + '/', evento, { headers: this.other_header })
      .toPromise()
      .catch((err: any) => {
        //console.log(err);
        return {
          code: 500,
          data: err.message,
          msg: 'Error en el servicio',
        };
      });
  }

  doUpdate(evento: object, id: number) {
    this.other_header = Utils.getHeader();

    return this.http
      .put(this.api + '/' + id, evento, { headers: this.other_header })
      .toPromise()
      .catch((err: any) => {
        //console.log(err);
        return {
          code: 500,
          data: err.message,
          msg: 'Error en el servicio',
        };
      });
  }

  doDelete(id: number) {
    this.other_header = Utils.getHeader();

    return this.http
      .delete(this.api + '/' + id, { headers: this.other_header })
      .toPromise()
      .catch((err: any) => {
        return {
          code: 500,
          data: err.message,
          msg: 'Error en el servicio',
        };
      });
  }
}
