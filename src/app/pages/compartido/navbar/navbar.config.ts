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

  correos: {
    titulo: 'PANEL DE CORREOS POLICIALES Y SISTEMAS NACIONALES',
    links: [
      { label: 'Solicitantes', route: '/pages/lst_usuario_solicitante' },
      { label: 'Correo Institucional', route: '/pages/lst_correos_institucionales' },
      { label: 'Sistemas Federales', route: '/pages/lst_plataforma' },
      { label: 'Reclamos', route: '/pages/lst_reclamos' }
    ]
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

  insumos: {
    titulo: 'CONTROL DE INSUMOS',
    links: [
      { label: 'Marcas', route: '/pages/lst_marcas' },
      { label: 'Modelos', route: '/pages/lst_modelos' },
      { label: 'Tipos de Insumos', route: '/pages/lst_tipoEquipo' },
      { label: 'Proveedores', route: '/pages/lst_proveedor' },
      { label: 'Equipamientos', route: '/pages/lst_equipamientos' }
    ]
  },

  conexiones: {
    titulo: 'CONEXIONES Y RECLAMOS SERVICIO DE INTERNET',
    links: [
      { label: 'Conexiones', route: '/pages/lst_conexiones' },
      { label: 'Solicitudes / Reclamos', route: '/pages/lst_solicitudReclamo' }
    ]
  },

  novedades: {
    titulo: 'NOVEDADES DIARIAS - DTI',
    links: [
      { label: 'Novedades', route: '/pages/lst_novedadesDTI' },
      { label: 'Tipos de Novedades', route: '/pages/lst_tipoNovedad' }
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
