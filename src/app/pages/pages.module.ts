import { BrowserModule } from '@angular/platform-browser';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages.routing.module';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './compartido/navbar/navbar.component';
import { FooterComponent } from './compartido/footer/footer.component';
import { PanelSeleccionComponent } from './componentes/panel-seleccion/panel-seleccion.component';
import { FilUsuariosComponent } from './filtros/fil-usuarios/fil-usuarios.component';
import { LstUsuariosComponent } from './lst/lst-usuarios/lst-usuarios.component';
import { PanelHabilitacionUsuariosComponent } from './componentes/panel-habilitacion-usuarios/panel-habilitacion-usuarios.component';
import { BusquedaPersonaComponent } from './componentes/busqueda-persona/busqueda-persona.component';
import { ComboRolComponent } from './componentes/combo-rol/combo-rol.component';
import { LstMarcaComponent } from './lst/lst-marca/lst-marca.component';
import { FilMarcaComponent } from './filtros/fil-marca/fil-marca.component';
import { AbmMarcaComponent } from './frm-abm/abm-marca/abm-marca.component';
import { LstModeloComponent } from './lst/lst-modelo/lst-modelo.component';
import { AbmModeloComponent } from './frm-abm/abm-modelo/abm-modelo.component';
import { FilModeloComponent } from './filtros/fil-modelo/fil-modelo.component';
import { LstTipoEquipoComponent } from './lst/lst-tipo-equipo/lst-tipo-equipo.component';
import { AbmTipoEquipoComponent } from './frm-abm/abm-tipo-equipo/abm-tipo-equipo.component';
import { FilTipoEquipoComponent } from './filtros/fil-tipo-equipo/fil-tipo-equipo.component';
import { FilEstadoComponent } from './filtros/fil-estado/fil-estado.component';
import { LstEstadoComponent } from './lst/lst-estado/lst-estado.component';
import { AbmEstadoComponent } from './frm-abm/abm-estado/abm-estado.component';
import { FilEquipamientoComponent } from './filtros/fil-equipamiento/fil-equipamiento.component';
import { LstEquipamientoComponent } from './lst/lst-equipamiento/lst-equipamiento.component';
import { AbmEquipamientoComponent } from './frm-abm/abm-equipamiento/abm-equipamiento.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FilAutocompletadoUnidadComponent } from './componentes/fil-autocompletado-unidad/fil-autocompletado-unidad.component';
import { FilOperativoComponent } from './filtros/fil-operativo/fil-operativo.component';
import { AbmOperativoComponent } from './frm-abm/abm-operativo/abm-operativo.component';
import { LstOperativoComponent } from './lst/lst-operativo/lst-operativo.component';
import { AbmDetalleOperativoComponent } from './frm-abm/abm-detalle-operativo/abm-detalle-operativo.component';
import { AbmEntregaEquipoComponent } from './frm-abm/abm-entrega-equipo/abm-entrega-equipo.component';
import { FilBusquedaPoliciaComponent } from './componentes/fil-busqueda-policia/fil-busqueda-policia.component';
import { LstEntregasEquiposComponent } from './lst/lst-entregas-equipos/lst-entregas-equipos.component';
import { FilEntregasEquiposComponent } from './filtros/fil-entregas-equipos/fil-entregas-equipos.component';

@NgModule({
  declarations: [
    PagesComponent,
    NavbarComponent,
    FooterComponent,
    PanelSeleccionComponent,
    FilUsuariosComponent,
    LstUsuariosComponent,
    PanelHabilitacionUsuariosComponent,
    BusquedaPersonaComponent,
    ComboRolComponent,
    LstMarcaComponent,
    FilMarcaComponent,
    AbmMarcaComponent,
    LstModeloComponent,
    FilModeloComponent,
    AbmModeloComponent,
    LstTipoEquipoComponent,
    AbmTipoEquipoComponent,
    FilTipoEquipoComponent,
    FilEstadoComponent,
    LstEstadoComponent,
    AbmEstadoComponent,
    FilEquipamientoComponent,
    LstEquipamientoComponent,
    AbmEquipamientoComponent,
    FilAutocompletadoUnidadComponent,
    FilOperativoComponent,
    AbmOperativoComponent,
    LstOperativoComponent,
    AbmDetalleOperativoComponent,
    AbmEntregaEquipoComponent,
    FilBusquedaPoliciaComponent,
    LstEntregasEquiposComponent,
    FilEntregasEquiposComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AutocompleteLibModule, // 👈 acá
  ],
  providers: [],
  bootstrap: [PagesComponent],
})
export class PagesModule {}
