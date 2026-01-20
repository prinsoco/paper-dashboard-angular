// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  services:{
    apiService: 'api',
    catalogoService: 'http://localhost:5005/api/Catalogo/',
    especialidadService: 'http://localhost:5005/api/Especialidad/',
    medicoService: 'http://localhost:5005/api/Medico/',
    pacienteService: 'http://localhost:5005/api/Paciente/',
    perfilService: 'http://localhost:5005/api/Perfil/',
    rolService: 'http://localhost:5005/api/Rol/',
    usuarioService: 'http://localhost:5005/api/Usuario/',
    dashboardService: 'http://localhost:5005/api/DashBoard/',
    parametroService: 'http://localhost:5005/api/Parametros/',
    notificacionService: 'http://localhost:5005/api/Notificacion/',
    horarioServices: 'http://localhost:5005/api/Horarios/',
    citasServices: 'http://localhost:5005/api/Cita/',
    historialServices: 'http://localhost:5005/api/HistorialClinico/',
    authServices: 'http://localhost:5005/api'
  }
};
