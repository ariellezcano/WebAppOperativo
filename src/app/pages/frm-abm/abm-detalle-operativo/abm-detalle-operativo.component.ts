import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { DetalleOperativo } from 'src/app/modelos/components/detalleOperativo';
import { EquipamientoDTO } from 'src/app/modelos/relacionModelos/equipamientoDTO';

import { DetalleOperativoService } from 'src/app/services/components/detalle-operativo.service';
import { OperativoService } from 'src/app/services/components/operativo.service';

import { Utils } from 'src/app/utils/utils';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-detalle-operativo',
  templateUrl: './abm-detalle-operativo.component.html',
  styleUrls: ['./abm-detalle-operativo.component.scss'],
})
export class AbmDetalleOperativoComponent implements OnInit {
  // =====================================================
  // DATOS DEL DETALLE
  // =====================================================

  detalle: DetalleOperativo = new DetalleOperativo();

  idOperativo!: number;

  operativo: any;

  // =====================================================
  // LISTAS
  // =====================================================

  equiposDisponibles: EquipamientoDTO[] = [];

  equiposOperativo: any[] = [];

  // =====================================================
  // BUSQUEDA Y PAGINACION
  // =====================================================

  filtroEquipo: string = '';

  paginaEquiposDisponibles: number = 1;

  tamanoPaginaEquiposDisponibles: number = 10;

  totalPaginasEquiposDisponibles: number = 0;

  totalRegistrosEquiposDisponibles: number = 0;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DetalleOperativoService,
    private operativoService: OperativoService,
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.idOperativo = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar información
    this.cargarOperativo();

    // Cargar equipos disponibles
    this.cargarDisponibles();

    // Cargar equipos asignados
    this.cargarAsignados();

    // =====================================================
    // FECHAS POR DEFECTO
    // =====================================================

    const hoy = new Date().toISOString().split('T')[0];

    this.detalle.fechaInicio = hoy;

    this.detalle.fechaFin = hoy;
  }

  // =====================================================
  // CARGAR OPERATIVO
  // =====================================================

  cargarOperativo(): void {
    this.operativoService.obtenerPorId(this.idOperativo).subscribe({
      next: (resp: any) => {
        const data = JSON.parse(JSON.stringify(resp));

        this.operativo = data.dato;
      },

      error: (err) => {
        console.error('Error cargando operativo:', err);
      },
    });
  }

  // =====================================================
  // CARGAR EQUIPOS DISPONIBLES
  // =====================================================

  async cargarDisponibles(): Promise<void> {
    try {
      const resp: any = await firstValueFrom(
        this.service.equiposDisponibles(
          this.paginaEquiposDisponibles,

          this.tamanoPaginaEquiposDisponibles,

          this.filtroEquipo,
        ),
      );

      const data = JSON.parse(JSON.stringify(resp));

      console.log('Equipos disponibles:', data);

      // Lista
      this.equiposDisponibles = data.data ?? [];

      // Total registros
      this.totalRegistrosEquiposDisponibles = data.totalRegistros ?? 0;

      // Total páginas
      this.totalPaginasEquiposDisponibles = data.totalPaginas ?? 0;

      // Si la página actual queda fuera
      if (
        this.paginaEquiposDisponibles > this.totalPaginasEquiposDisponibles &&
        this.totalPaginasEquiposDisponibles > 0
      ) {
        this.paginaEquiposDisponibles = this.totalPaginasEquiposDisponibles;

        await this.cargarDisponibles();
      }
    } catch (error) {
      console.error('Error cargando equipos disponibles:', error);

      this.equiposDisponibles = [];

      this.totalRegistrosEquiposDisponibles = 0;

      this.totalPaginasEquiposDisponibles = 0;
    }
  }

  // =====================================================
  // CARGAR EQUIPOS ASIGNADOS
  // =====================================================

  async cargarAsignados(): Promise<void> {
    try {
      console.log('Cargando equipos asignados...');

      const resp: any = await firstValueFrom(
        this.service.listarPorOperativo(this.idOperativo),
      );

      const data = JSON.parse(JSON.stringify(resp));

      console.log('Asignados:', data);

      this.equiposOperativo = data.data ?? [];
    } catch (error) {
      console.error('Error cargando equipos asignados:', error);

      this.equiposOperativo = [];
    }
  }

  // =====================================================
  // BUSCAR EQUIPOS
  // =====================================================

  buscarEquiposDisponibles(): void {
    this.paginaEquiposDisponibles = 1;

    this.cargarDisponibles();
  }

  // =====================================================
  // LIMPIAR FILTRO
  // =====================================================

  limpiarFiltroEquipo(): void {
    this.filtroEquipo = '';

    this.paginaEquiposDisponibles = 1;

    this.cargarDisponibles();
  }

  // =====================================================
  // PAGINA ANTERIOR
  // =====================================================

  paginaAnteriorEquipos(): void {
    if (this.paginaEquiposDisponibles > 1) {
      this.paginaEquiposDisponibles--;

      this.cargarDisponibles();
    }
  }

  // =====================================================
  // PAGINA SIGUIENTE
  // =====================================================

  paginaSiguienteEquipos(): void {
    if (this.paginaEquiposDisponibles < this.totalPaginasEquiposDisponibles) {
      this.paginaEquiposDisponibles++;

      this.cargarDisponibles();
    }
  }

  // =====================================================
  // AGREGAR EQUIPO
  // =====================================================

  async agregar(equipo: EquipamientoDTO): Promise<void> {
    // ===================================================
    // VALIDAR FECHA INICIO
    // ===================================================

    if (!this.detalle.fechaInicio) {
      Swal.fire('Atención', 'Debe ingresar la fecha de inicio.', 'warning');

      return;
    }

    // ===================================================
    // VALIDAR FECHA FIN
    // ===================================================

    if (!this.detalle.fechaFin) {
      Swal.fire('Atención', 'Debe ingresar la fecha de fin.', 'warning');

      return;
    }

    // ===================================================
    // VALIDAR FECHAS
    // ===================================================

    if (new Date(this.detalle.fechaFin) < new Date(this.detalle.fechaInicio)) {
      Swal.fire(
        'Atención',
        'La fecha fin no puede ser menor a la fecha de inicio.',
        'warning',
      );

      return;
    }

    // ===================================================
    // VALIDAR TURNO
    // ===================================================

    if (!this.detalle.turno) {
      Swal.fire('Atención', 'Debe seleccionar un turno.', 'warning');

      return;
    }

    // ===================================================
    // CREAR DETALLE
    // ===================================================

    const detalle = new DetalleOperativo();

    detalle.operativo = Number(this.idOperativo);

    detalle.equipamiento = equipo.idEquipamiento;

    detalle.turno = this.detalle.turno;

    detalle.fechaInicio = this.detalle.fechaInicio;

    detalle.fechaFin = this.detalle.fechaFin;

    detalle.observacion = this.detalle.observacion;

    detalle.usuarioAlta = Number(Utils.getSession('user'));

    console.log('Detalle a insertar:', detalle);

    // ===================================================
    // INSERTAR
    // ===================================================

    try {
      const data: any = await firstValueFrom(this.service.insert(detalle));

      const result = JSON.parse(JSON.stringify(data));

      if (result.code === '201') {
        await Swal.fire('Éxito', result.message, 'success');

        // Recargar disponibles
        await this.cargarDisponibles();

        // Recargar asignados
        await this.cargarAsignados();
      } else {
        Swal.fire('Atención', result.message, 'warning');
      }
    } catch (error: any) {
      console.error('Error asignando equipo:', error);

      Swal.fire('Error', 'No fue posible asignar el equipamiento.', 'error');
    }
  }

  // =====================================================
  // QUITAR / LIBERAR EQUIPO
  // =====================================================

  async quitar(item: any): Promise<void> {
    const confirmacion = await Swal.fire({
      title: '¿Liberar equipo?',

      html: `
          <p class="mb-2">
            El equipo será desvinculado del operativo.
          </p>

          <small class="text-muted">
            Una vez liberado, volverá a estar disponible.
          </small>
        `,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: '<i class="fas fa-unlock me-1"></i> Sí, liberar',

      cancelButtonText: '<i class="fas fa-times me-1"></i> Cancelar',

      confirmButtonColor: '#dc3545',

      cancelButtonColor: '#6c757d',

      reverseButtons: true,

      focusCancel: true,

      allowOutsideClick: false,
    });

    // ===================================================
    // CANCELAR
    // ===================================================

    if (!confirmacion.isConfirmed) {
      return;
    }

    // ===================================================
    // USUARIO BAJA
    // ===================================================

    item.usuarioBaja = Number(Utils.getSession('user'));

    // ===================================================
    // ELIMINAR
    // ===================================================

    try {
      const data: any = await firstValueFrom(
        this.service.delete(
          item.idDetalleOperativo,

          item.usuarioBaja,
        ),
      );

      const result = JSON.parse(JSON.stringify(data));

      if (result.code === '200') {
        await Swal.fire({
          icon: 'success',

          title: 'Equipo liberado',

          text: result.message ?? 'La operación se realizó correctamente.',

          confirmButtonText: 'Aceptar',

          confirmButtonColor: '#198754',
        });

        // IMPORTANTE:
        // Recargar ambas listas

        await this.cargarDisponibles();

        await this.cargarAsignados();
      } else {
        Swal.fire({
          icon: 'warning',

          title: 'No se pudo liberar',

          text: result.message || 'No fue posible liberar el equipo.',

          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error: any) {
      console.error('Error liberando equipo:', error);

      Swal.fire({
        icon: 'error',

        title: 'Error',

        text: 'No fue posible liberar el equipamiento.',

        confirmButtonText: 'Aceptar',
      });
    }
  }

  // =====================================================
  // VOLVER
  // =====================================================

  back(): void {
    this.router.navigate(['/operativos']);
  }
}
