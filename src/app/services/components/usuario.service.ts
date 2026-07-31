import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Results } from 'src/app/modelos/results';
import { Usuarios } from 'src/app/modelos/components/usuarios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class UsuarioService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = environment.URL + 'Usuario';
  }

  getList(pagina: number, cantidad: number, busqueda?: string) {
    const params = {
      pagina: pagina.toString(),
      tamanoPagina: cantidad.toString(),
      nombre: busqueda ?? '',
    };

    return this.http.get<Results<Usuarios>>(`${this.api}/Listar`, { params });
  }

  getId(id: number) {
    //console.log('servicio', id);
    return this.http.get(this.api + '/' + id);
  }

  insert(evento: any) {
    return this.http.post(this.api, evento);
  }

  update(id: number, evento: any) {
    return this.http.put(this.api + '/' + id, evento);
  }

  patch(id: number, evento: any) {
    return this.http.patch(this.api + '/' + id, evento);
  }

  delete(id: number, usuarioBaja: number) {
    console.log('servicio:', id, usuarioBaja);
    return this.http.delete(`${this.api}/${id},${usuarioBaja}`);
  }
}
