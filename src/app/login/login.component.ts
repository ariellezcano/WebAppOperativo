import { Component, OnInit } from '@angular/core';
import { Utils } from '../utils/utils';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioRol } from '../modelos/relacionModelos/usuarioRol';
import { RegistroUsuarioService } from '../services/components/registro-usuario.service';
import { UsuarioService } from '../services/components/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  anioActual = new Date().getFullYear();

  item: UsuarioRol;

  id: number = 0;
  datosPersonal: any;

  form = this.fb.group({
    usuario: ['', Validators.required],
    contrasenia: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private wsdlRegistro: RegistroUsuarioService,
    private wsdlUsuario: UsuarioService,
  ) {
    this.item = new UsuarioRol();
  }

  ngOnInit(): void {}

  async login() {
    if (this.form.invalid) return;

    const { usuario, contrasenia } = this.form.value;
    try {
      // Buscar el usuario logeado en Policia Digital
      let res = await this.wsdlRegistro.getLogin(usuario, contrasenia);
      const jsonData = JSON.parse(JSON.stringify(res));

      if (jsonData.code == 200) {
        //console.log(jsonData)
        this.id = jsonData.data;
        
        // Si el usuario existe se procede a buscar al mismo usuario
        // en la base de datos del sistema
        if (this.id > 0) {
          this.login2();
        }
      } else if (jsonData.code == 204) {
        Swal.fire({
          icon: 'error',
          title: 'Alerta...',
          text: 'Usted no se encuentra registrado en el Sistema RePO',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Un error ha ocurrido',
          text: jsonData.msg,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        icon: 'error',
        text: 'Un error ha ocurrido',
      });
    }
  }

  // login a la base de datos del sistema
  async login2() {
    //this.id = 3908;
    try {
      let data$ = this.wsdlUsuario.getId(this.id);
      const result = await lastValueFrom(data$);
      const Json = JSON.parse(JSON.stringify(result));
      console.log("json", Json)
      if (Json.code == 200) {
        this.item = Json.dato;
        // console.log("login 2", this.item)
        if (!this.item.baja && this.item.activo) {
          this.datosPersonal = {
            apellido: this.item.apellido,
            nombre: this.item.nombre,
            rol: this.item.rol,
          };

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          });
          Toast.fire({
            icon: 'success',
            title: 'Bienvenido Sr/a: ' + this.item.apellido,
          });

          // guardar en local storage
          Utils.setSession('personal', JSON.stringify(this.datosPersonal));
          Utils.setSession('user', JSON.stringify(this.item.idUsuario));

          // redirección a la pagina principal
          this.router.navigate(['/pages/principal']);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Alerta...',
            text: 'Usuario dado de baja, contáctese con el administrador del sistema!',
          });
        }
      } else if (Json.code == 401) {
        Swal.fire(
          'Usuario no habilitado',
          'Por favor contáctese con el administrador del sistema para generar su usuario',
          'info',
        );
      } else {
        Swal.fire('Oops...', Json.msg, 'error');
      }
    } catch (error) {
      Swal.fire('Oops...', 'Algo salio mal vuelva a intentar ', 'error');
    }
  }
}
