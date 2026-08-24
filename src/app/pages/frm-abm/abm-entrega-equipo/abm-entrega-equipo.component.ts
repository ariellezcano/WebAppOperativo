import { Component, OnInit } from '@angular/core';

import { Operativo } from 'src/app/modelos/components/operativo';
import { PlanillaDistribucion } from 'src/app/modelos/components/planilla-distribucion';
import { RadioOperativo } from 'src/app/modelos/relacionModelos/radioOperativo';

import { OperativoService } from 'src/app/services/components/operativo.service';
import { PlanillaDistribucionService } from 'src/app/services/components/planilla-distribucion.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-entrega-equipo',
  templateUrl: './abm-entrega-equipo.component.html',
  styleUrls: ['./abm-entrega-equipo.component.scss'],
})
export class AbmEntregaEquipoComponent implements OnInit {
  // =====================================================
  // OPERATIVOS
  // =====================================================

  operativos: Operativo[] = [];

  operativo: Operativo = new Operativo();

  // =====================================================
  // UNIDAD
  // =====================================================

  //nombreUnidad: string = '';

  // =====================================================
  // PLANILLA DE DISTRIBUCIÓN
  // =====================================================

  item: PlanillaDistribucion = this.nuevaPlanilla();

  // =====================================================
  // EQUIPAMIENTO
  // =====================================================

  equipos: RadioOperativo[] = [];

  equiposSeleccionados: RadioOperativo[] = [];

  filtro: string = '';

  idOperativo: number = 0;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private service: PlanillaDistribucionService,
    private operativoService: OperativoService,
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.cargarOperativos();
  }

  // =====================================================
  // NUEVA PLANILLA
  // =====================================================

  nuevaPlanilla(): PlanillaDistribucion {
    return {
      idDistribucion: 0,

      fechaEntrega: new Date(),

      idPersona: 0,

      dni: null,

      nombre: '',

      apellido: '',

      unidadRecibe: 0,

      nombreUnidad: '',

      estadoEntrega: 1,

      usuarioEntrega: 1,

      usuarioRecibe: null,

      fechaRecepcion: null,

      baja: false,

      observacion: '',

      activo: true,

      detalles: [],
    };
  }

  // =====================================================
  // BUSCAR PERSONA
  // =====================================================

  doFound(data: any): void {
    //console.log('persona encontrada', data);
    if (data && data.code === '200') {
      this.item.idPersona = data.data.id_persona;

      this.item.apellido = data.data.apellido;

      this.item.nombre = data.data.nombre;

      this.item.dni = data.data.DNI;
    }
  }

  // =====================================================
  // CARGAR OPERATIVOS
  // =====================================================

  cargarOperativos(): void {
    this.operativoService.combo().subscribe({
      next: (resp) => {
        //console.log('resp', resp);
        if (resp) {
          this.operativos = resp;
        } else {
          this.operativos = [];
        }
      },

      error: (error) => {
        console.error('Error al cargar operativos:', error);

        this.operativos = [];
      },
    });
  }

  // =====================================================
  // BUSCAR EQUIPOS DEL OPERATIVO
  // =====================================================

  buscarEquipos(): void {
    if (this.idOperativo === 0) {
      alert('Debe seleccionar un operativo');
      return;
    }

    this.service
      .buscarEquipamientoOperativo(this.idOperativo, this.filtro)
      .subscribe({
        next: (resp) => {
          console.log('equipo', resp);
          if (resp.code === '200') {
            this.equipos = resp.data ?? [];
          } else {
            this.equipos = [];
          }
        },

        error: (error) => {
          console.error('Error al buscar equipos:', error);
          this.equipos = [];
        },
      });
  }

  // =====================================================
  // SELECCIONAR EQUIPO
  // =====================================================

  seleccionarEquipo(equipo: RadioOperativo): void {
    const existe = this.equiposSeleccionados.some(
      (x) => x.idEquipamiento === equipo.idEquipamiento,
    );

    if (existe) {
      this.equiposSeleccionados = this.equiposSeleccionados.filter(
        (x) => x.idEquipamiento !== equipo.idEquipamiento,
      );
      //console.log('equipamiento', this.equiposSeleccionados);
    } else {
      this.equiposSeleccionados.push(equipo);
    }

    //console.log('equipos seleccionados', this.equiposSeleccionados);
  }

  // =====================================================
  // EQUIPO SELECCIONADO
  // =====================================================

  seleccionado(equipo: RadioOperativo): boolean {
    return this.equiposSeleccionados.some(
      (x) => x.idEquipamiento === equipo.idEquipamiento,
    );
  }

  // =====================================================
  // UNIDAD SELECCIONADA
  // =====================================================

  unidadSeleccionada(data: any): void {
    // console.log('unidad seleccionada', data);
    if (data) {
      this.item.unidadRecibe = data.id;
      this.item.nombreUnidad = data.nombre;
    }
  }

  // =====================================================
  // GUARDAR PLANILLA
  // =====================================================

  guardar(): void {
    // =========================================
    // VALIDAR PERSONA
    // =========================================
    this.item.usuarioEntrega = Number(Utils.getSession('user'));

    if (this.item.idPersona === 0) {
      alert('Debe seleccionar una persona');

      return;
    }

    // =========================================
    // VALIDAR UNIDAD
    // =========================================

    if (this.item.unidadRecibe === 0) {
      alert('Debe seleccionar una unidad');

      return;
    }

    // =========================================
    // VALIDAR OPERATIVO
    // =========================================

    if (this.idOperativo === 0) {
      alert('Debe seleccionar un operativo');

      return;
    }

    // =========================================
    // VALIDAR EQUIPOS
    // =========================================

    if (this.equiposSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un equipo');

      return;
    }

    // =========================================
    // ARMAR DETALLES
    // =========================================

    this.item.detalles = this.equiposSeleccionados.map((x) => ({
      idDetalle: 0,
      distribucion: 0,
      detalleOperativo: x.idDetalleOperativo,
      equipamiento: x.idEquipamiento,
      observacion: '',
      baja: false,
      activo: true,
    }));

    // =========================================
    // FECHA DE ENTREGA
    // =========================================

    this.item.fechaEntrega = new Date();

    // =========================================
    // ESTADO INICIAL
    // =========================================

    this.item.estadoEntrega = 1;

    this.item.baja = false;

    this.item.activo = true;

    // =========================================
    // CREAR PLANILLA
    // =========================================
    //console.log("data", this.item)
    this.service.crear(this.item).subscribe({
      next: (resp) => {
        if (resp.code === '201') {
          const cantidad = this.equiposSeleccionados.length;

          Swal.fire({
            icon: 'success',
            title: 'Entrega registrada',
            html: `
          <div class="text-start">
            <p class="mb-2">
              El equipamiento fue entregado correctamente.
            </p>

            <hr>

            <p class="mb-1">
              <strong>Receptor:</strong>
              ${this.item.apellido}, ${this.item.nombre}
            </p>

            <p class="mb-1">
              <strong>DNI:</strong>
              ${this.item.dni}
            </p>

            <p class="mb-0">
              <strong>Equipos entregados:</strong>
              ${cantidad}
            </p>
          </div>
        `,
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.limpiar();
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'No se pudo realizar la entrega',
            text:
              resp.message ||
              'No se pudo registrar la entrega del equipamiento.',
            confirmButtonText: 'Aceptar',
          });
        }
      },

      error: (error) => {
        console.error('Error al realizar entrega:', error);

        const mensaje =
          error?.error?.message ||
          error?.error?.error ||
          'Ocurrió un error al registrar la entrega del equipamiento.';

        Swal.fire({
          icon: 'error',
          title: 'Error al registrar la entrega',
          text: mensaje,
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  // =====================================================
  // LIMPIAR
  // =====================================================

  limpiar(): void {
    this.item = this.nuevaPlanilla();

    this.equipos = [];

    this.equiposSeleccionados = [];

    this.filtro = '';

    this.idOperativo = 0;

    //this.nombreUnidad = '';

    this.operativo = new Operativo();
  }
}
