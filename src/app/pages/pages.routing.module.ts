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
import { LstEquipamientoComponent } from './lst/lst-equipamiento/lst-equipamiento.component';
import { AbmEquipamientoComponent } from './frm-abm/abm-equipamiento/abm-equipamiento.component';
import { LstOperativoComponent } from './lst/lst-operativo/lst-operativo.component';
import { AbmOperativoComponent } from './frm-abm/abm-operativo/abm-operativo.component';
import { AbmDetalleOperativoComponent } from './frm-abm/abm-detalle-operativo/abm-detalle-operativo.component';

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
      //EQUIPAMIENTO

      {
        path: 'lst_equipos',
        component: LstEquipamientoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'abm_equipamiento/:id',
        component: AbmEquipamientoComponent,
        canActivate: [AuthGuard],
      },

      //OPERATIVOS

      {
        path: 'lst_operativos',
        component: LstOperativoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'abm_operativos/:id',
        component: AbmOperativoComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'abm_detalle_operativo/:id',
        component: AbmDetalleOperativoComponent,
        canActivate: [AuthGuard],
      },

      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // ✅ forChild, no forRoot
  exports: [RouterModule],
})
export class PagesRoutingModule {}
