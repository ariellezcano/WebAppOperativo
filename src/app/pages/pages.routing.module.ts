import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { PanelSeleccionComponent } from './componentes/panel-seleccion/panel-seleccion.component';
import { AuthGuard } from './compartido/guards/auth.guard';
import { LstUsuariosComponent } from './lst/lst-usuarios/lst-usuarios.component';
import { PanelHabilitacionUsuariosComponent } from './componentes/panel-habilitacion-usuarios/panel-habilitacion-usuarios.component';
import { LstMarcaComponent } from './lst/lst-marca/lst-marca.component';
import { AbmMarcaComponent } from './frm-abm/abm-marca/abm-marca.component';
import { AbmModeloComponent } from './frm-abm/abm-modelo/abm-modelo.component';
import { LstModeloComponent } from './lst/lst-modelo/lst-modelo.component';
import { AbmTipoEquipoComponent } from './frm-abm/abm-tipo-equipo/abm-tipo-equipo.component';
import { LstTipoEquipoComponent } from './lst/lst-tipo-equipo/lst-tipo-equipo.component';
import { LstEstadoComponent } from './lst/lst-estado/lst-estado.component';
import { AbmEstadoComponent } from './frm-abm/abm-estado/abm-estado.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'principal', pathMatch: 'full' }, // Agregá esto
      {
        path: 'principal',
        component: PanelSeleccionComponent,
        canActivate: [AuthGuard],
      },
      //   {
      //     path: 'pagina_en_desarrollo',
      //     component: PanelEnDesarrolloComponent,
      //     canActivate: [AuthGuard],
      //   },

      // USUARIOS
      {
        path: 'lst_usuario',
        component: LstUsuariosComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'habilitar_usuario',
        component: PanelHabilitacionUsuariosComponent,
        canActivate: [AuthGuard],
      },

      //MARCAS
      {
        path: 'lst_marcas',
        component: LstMarcaComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'abm_marcas/:id',
        component: AbmMarcaComponent,
        canActivate: [AuthGuard],
      },

      //MODELOS
      {
        path: 'lst_modelos',
        component: LstModeloComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'abm_modelos/:id',
        component: AbmModeloComponent,
        canActivate: [AuthGuard],
      },

      //TIPO EQUIPO
        {
          path: 'lst_tipoEquipo',
          component: LstTipoEquipoComponent,
          canActivate: [AuthGuard],
        },
        {
          path: 'abm_tipoEquipo/:id',
          component: AbmTipoEquipoComponent,
          canActivate: [AuthGuard],
        },

        //ESTADOS
        {
          path: 'lst_estados',
          component: LstEstadoComponent,
          canActivate: [AuthGuard],
        },
        {
          path: 'abm_estados/:id',
          component: AbmEstadoComponent,
          canActivate: [AuthGuard],
        },


      //   {
      //     path: 'lst_usuario_solicitante',
      //     component: LstUsuarioSolicitanteComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'agregar_solicitante',
      //     component: AbmUsuarioSolicitanteComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'agregar_solicitante/:id',
      //     component: AbmUsuarioSolicitanteComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'agregar_correo/:id',
      //     component: AbmCorreoInstitucionalComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_correos_institucionales',
      //     component: LstCorreoInstitucionalComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'plataformas/:id',
      //     component: AbmPlataformaComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_plataforma',
      //     component: LstPlataformasComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_plataforma/:id',
      //     component: AbmActualizacionplataformaComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_reclamos',
      //     component: LstReclamosComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_reclamos',
      //     component: AbmReclamosComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_sistemas',
      //     component: LstSistemasComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_sistemas/:id',
      //     component: AbmSistemasComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_conexiones',
      //     component: LstConexionesComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_conexiones/:id',
      //     component: AbmConexionesComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_solicitudReclamo',
      //     component: LstSolicitudReclamoComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_solicitudReclamo/:id',
      //     component: AbmSolicitudReclamoComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_novedadesDTI',
      //     component: LstNovedadesDTIComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_novedadesDTI/:id',
      //     component: AbmNovedadesDtiComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_tipoNovedad',
      //     component: LstTiponovedadComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_tipoNovedad/:id',
      //     component: AbmTiponovedadComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_cambiarTitular/:id',
      //     component: AbmCambioTitularComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_proveedor',
      //     component: LstProveedorComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_proveedor/:id',
      //     component: AbmProveedorComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_equipamientos',
      //     component: LstEquipamientosComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_equipamiento/:id',
      //     component: AbmEquipamientosComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_asignacion/:id',
      //     component: AbmAsignacionEquipoComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'detalle_entrega/:id',
      //     component: FrmDetalleEntregaComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_mantenimiento',
      //     component: LstMantenimientoComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_mantenimiento/:id',
      //     component: AbmMantenimientoComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'lst_solicitudes',
      //     component: LstSolicitudesComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'abm_solicitudes/:id',
      //     component: AbmSolicitudesComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'panel_reportes',
      //     component: PanelSeleccionReportesComponent,
      //     canActivate: [AuthGuard],
      //   },
      //   {
      //     path: 'panel_recibo',
      //     component: AbmGeneracionReciboComponent,
      //     canActivate: [AuthGuard],
      //   },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // ✅ forChild, no forRoot
  exports: [RouterModule],
})
export class PagesRoutingModule {}
