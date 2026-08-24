// navbar.config.ts
export interface NavbarConfig {
  titulo: string;
  links: {
    label: string;
    route: string;
  }[];
}

export const NAVBAR_CONFIG: Record<string, NavbarConfig> = {
  principal: {
    titulo: 'PANEL PRINCIPAL',
    links: []
  },


  usuarios: {
    titulo: 'USUARIOS PARA USO DEL SISTEMA',
    links: [
      { label: 'Usuarios', route: '/pages/lst_usuario' },
    ]
  },

  equipamiento: {
    titulo: 'EQUIPAMIENTOS',
    links: [
      { label: 'Marcas', route: '/pages/lst_marcas' },
      { label: 'Modelos', route: '/pages/lst_modelos' },
      { label: 'Tipos de equipos', route: '/pages/lst_tipoEquipo' },
      { label: 'Estados', route: '/pages/lst_estados' },
      { label: 'Equipos', route: '/pages/lst_equipos' },
    ]
  },

  operativo: {
    titulo: 'OPERATIVOS',
    links: [
      { label: 'Servicios', route: '/pages/lst_operativos' }
    ]
  },

  planillaDistribucion: {
    titulo: 'DISTRIBUCION DE EQUIPAMIENTO',
    links: [
      { label: 'Listado de equipos entregados', route: '/pages/lst_distribucion' },
      { label: 'Panel de asignación', route: '/pages/abm_entrega_equipo' }
    ]
  },
  

  

  reportes: {
    titulo: 'REPORTES DEL SISTEMA',
    links: [
      //{ label: 'Reporte de Prendas', route: '/pages/lst_reporte_entrega' },
      // { label: 'Solicitudes / Reclamos', route: '/pages/lst_solicitudReclamo' }
    ]
  },

};
