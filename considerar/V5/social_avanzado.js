/**
 * Módulo de Funcionalidades Sociales Mejoradas
 * Aplicación de Formación Bíblica - Versión Mejorada
 */

// Módulo principal para funcionalidades sociales
const SocialAvanzado = (function() {
    // Configuración
    const config = {
        perfilUsuario: null,
        modoConexion: 'local', // 'local' o 'online'
        actualizacionAutomatica: true,
        intervaloActualizacion: 60000, // 1 minuto en milisegundos
        maxEventosRecientes: 10,
        maxNotificaciones: 20
    };

    // Estado interno
    let estado = {
        comunidades: [],
        grupos: [],
        eventos: [],
        notificaciones: [],
        competencias: {
            teoria: [],
            practica: []
        },
        desafios: [],
        logros: [],
        actividad: [],
        conexiones: []
    };

    // Temporizador para actualizaciones automáticas
    let temporizadorActualizacion = null;

    /**
     * Inicializa el módulo social
     * @param {Object} opciones - Opciones de configuración
     */
    function inicializar(opciones = {}) {
        // Actualizar configuración
        Object.assign(config, opciones);
        
        // Cargar datos iniciales
        cargarDatosIniciales();
        
        // Renderizar interfaz
        renderizarInterfazSocial();
        
        // Configurar eventos
        configurarEventosSociales();
        
        // Iniciar actualizaciones automáticas si está habilitado
        if (config.actualizacionAutomatica) {
            iniciarActualizacionesAutomaticas();
        }
    }
    
    /**
     * Carga los datos iniciales del módulo social
     */
    function cargarDatosIniciales() {
        // En una implementación real, estos datos vendrían de una API o base de datos
        // Por ahora, usamos datos de ejemplo
        
        // Perfil de usuario
        if (!config.perfilUsuario) {
            config.perfilUsuario = {
                id: 'usuario1',
                nombre: 'Usuario',
                nivel: 1,
                experiencia: 0,
                fechaRegistro: new Date().toISOString(),
                ultimoAcceso: new Date().toISOString(),
                avatar: null
            };
        }
        
        // Comunidades
        estado.comunidades = [
            { id: 'com1', nombre: 'Estudio Bíblico General', miembros: 120, esPublica: true, descripcion: 'Comunidad general para el estudio de la Biblia' },
            { id: 'com2', nombre: 'Nuevo Testamento', miembros: 85, esPublica: true, descripcion: 'Enfocado en el estudio del Nuevo Testamento' },
            { id: 'com3', nombre: 'Antiguo Testamento', miembros: 73, esPublica: true, descripcion: 'Enfocado en el estudio del Antiguo Testamento' }
        ];
        
        // Grupos
        estado.grupos = [
            { id: 'grp1', nombre: 'Principiantes', miembros: 45, comunidadId: 'com1', esPrivado: false },
            { id: 'grp2', nombre: 'Avanzados', miembros: 32, comunidadId: 'com1', esPrivado: false },
            { id: 'grp3', nombre: 'Evangelios', miembros: 28, comunidadId: 'com2', esPrivado: false }
        ];
        
        // Eventos
        estado.eventos = [
            { 
                id: 'evt1', 
                titulo: 'Estudio semanal: Parábolas', 
                descripcion: 'Estudio de las parábolas de Jesús', 
                fecha: agregarDias(new Date(), 3).toISOString(),
                comunidadId: 'com2',
                participantes: 12,
                tipo: 'online',
                duracion: 60 // minutos
            },
            { 
                id: 'evt2', 
                titulo: 'Memorización: Salmos', 
                descripcion: 'Sesión de memorización de Salmos selectos', 
                fecha: agregarDias(new Date(), 7).toISOString(),
                comunidadId: 'com1',
                participantes: 8,
                tipo: 'online',
                duracion: 45 // minutos
            }
        ];
        
        // Competencias teóricas
        estado.competencias.teoria = [
            { id: 'ct1', nombre: 'Conocimiento Bíblico Básico', nivel: 2, maxNivel: 5, descripcion: 'Conocimiento general de la Biblia' },
            { id: 'ct2', nombre: 'Historia Bíblica', nivel: 1, maxNivel: 5, descripcion: 'Conocimiento de eventos históricos en la Biblia' },
            { id: 'ct3', nombre: 'Teología Básica', nivel: 0, maxNivel: 5, descripcion: 'Comprensión de conceptos teológicos fundamentales' },
            { id: 'ct4', nombre: 'Contexto Cultural', nivel: 0, maxNivel: 5, descripcion: 'Entendimiento del contexto cultural bíblico' }
        ];
        
        // Competencias prácticas
        estado.competencias.practica = [
            { id: 'cp1', nombre: 'Memorización', nivel: 1, maxNivel: 5, descripcion: 'Habilidad para memorizar versículos' },
            { id: 'cp2', nombre: 'Aplicación Personal', nivel: 2, maxNivel: 5, descripcion: 'Capacidad para aplicar enseñanzas a la vida diaria' },
            { id: 'cp3', nombre: 'Oración', nivel: 1, maxNivel: 5, descripcion: 'Desarrollo de vida de oración' },
            { id: 'cp4', nombre: 'Compartir Fe', nivel: 0, maxNivel: 5, descripcion: 'Habilidad para compartir fe con otros' }
        ];
        
        // Desafíos
        estado.desafios = [
            { 
                id: 'des1', 
                titulo: 'Lectura diaria', 
                descripcion: 'Lee un capítulo cada día durante una semana', 
                progreso: 3, 
                total: 7,
                recompensa: { experiencia: 50, competencia: 'ct1', nivelesCompetencia: 1 }
            },
            { 
                id: 'des2', 
                titulo: 'Memorización semanal', 
                descripcion: 'Memoriza un versículo cada semana', 
                progreso: 0, 
                total: 4,
                recompensa: { experiencia: 100, competencia: 'cp1', nivelesCompetencia: 1 }
            }
        ];
        
        // Logros
        estado.logros = [
            { id: 'log1', nombre: 'Primer Paso', descripcion: 'Completar el primer check-in diario', fecha: agregarDias(new Date(), -5).toISOString(), icono: '🏆' },
            { id: 'log2', nombre: 'Explorador', descripcion: 'Leer 5 libros diferentes de la Biblia', fecha: null, icono: '🔍', progreso: 2, total: 5 }
        ];
        
        // Actividad reciente
        estado.actividad = [
            { tipo: 'lectura', fecha: agregarDias(new Date(), -1).toISOString(), detalles: { libro: 'Juan', capitulo: 3 } },
            { tipo: 'memorizacion', fecha: agregarDias(new Date(), -2).toISOString(), detalles: { referencia: 'Juan 3:16', puntuacion: 4 } },
            { tipo: 'checkin', fecha: agregarDias(new Date(), -3).toISOString(), detalles: { duracion: 15 } }
        ];
        
        // Conexiones (amigos/mentores)
        estado.conexiones = [
            { id: 'usr1', nombre: 'Ana', nivel: 5, tipo: 'mentor', estado: 'online', ultimaActividad: new Date().toISOString() },
            { id: 'usr2', nombre: 'Carlos', nivel: 3, tipo: 'amigo', estado: 'offline', ultimaActividad: agregarDias(new Date(), -1).toISOString() }
        ];
        
        // Notificaciones
        estado.notificaciones = [
            { 
                id: 'not1', 
                tipo: 'evento', 
                titulo: 'Nuevo evento: Estudio semanal', 
                mensaje: 'Se ha programado un nuevo evento de estudio para el próximo jueves', 
                fecha: agregarDias(new Date(), -1).toISOString(),
                leida: false,
                accion: { tipo: 'verEvento', id: 'evt1' }
            },
            { 
                id: 'not2', 
                tipo: 'logro', 
                titulo: '¡Logro desbloqueado!', 
                mensaje: 'Has desbloqueado el logro "Primer Paso"', 
                fecha: agregarDias(new Date(), -5).toISOString(),
                leida: true,
                accion: { tipo: 'verLogro', id: 'log1' }
            }
        ];
    }
    
    /**
     * Renderiza la interfaz principal del módulo social
     */
    function renderizarInterfazSocial() {
        const contenedorSocial = document.getElementById('content-social');
        if (!contenedorSocial) return;
        
        // Limpiar contenedor
        contenedorSocial.innerHTML = '';
        
        // Crear estructura principal
        contenedorSocial.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Columna izquierda: Perfil y Estadísticas -->
                <div class="space-y-6">
                    ${renderizarPerfil()}
                    ${renderizarEstadisticas()}
                    ${renderizarLogros()}
                </div>
                
                <!-- Columna central: Actividad y Desafíos -->
                <div class="space-y-6">
                    ${renderizarActividadReciente()}
                    ${renderizarDesafios()}
                </div>
                
                <!-- Columna derecha: Comunidad y Eventos -->
                <div class="space-y-6">
                    ${renderizarComunidad()}
                    ${renderizarEventos()}
                </div>
            </div>
            
            <!-- Sección de Competencias -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                ${renderizarCompetenciasTeoricas()}
                ${renderizarCompetenciasPracticas()}
            </div>
        `;
        
        // Configurar eventos específicos de cada sección
        configurarEventosPerfil();
        configurarEventosCompetencias();
        configurarEventosComunidad();
        configurarEventosDesafios();
    }
    
    /**
     * Renderiza la sección de perfil de usuario
     * @returns {String} HTML de la sección de perfil
     */
    function renderizarPerfil() {
        const perfil = config.perfilUsuario;
        if (!perfil) return '';
        
        // Calcular nivel y progreso
        const nivelActual = perfil.nivel || 1;
        const expActual = perfil.experiencia || 0;
        const expSiguienteNivel = nivelActual * 100;
        const porcentajeProgreso = Math.min(100, Math.floor((expActual / expSiguienteNivel) * 100));
        
        return `
            <div class="discord-card rounded-lg p-4 md:p-6 shadow">
                <div class="flex items-center space-x-4">
                    <div class="perfil-avatar w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-2xl">
                        ${perfil.avatar ? `<img src="${perfil.avatar}" alt="Avatar" class="w-full h-full rounded-full">` : '👤'}
                    </div>
                    <div class="flex-grow">
                        <h2 class="text-xl font-semibold">${perfil.nombre}</h2>
                        <div class="text-sm discord-text-secondary">Nivel ${nivelActual}</div>
                        <div class="mt-2 w-full bg-[var(--bg-input)] rounded-full h-2.5">
                            <div class="bg-[var(--bg-primary)] h-2.5 rounded-full" style="width: ${porcentajeProgreso}%"></div>
                        </div>
                        <div class="text-xs discord-text-muted mt-1">
                            ${expActual}/${expSiguienteNivel} XP para nivel ${nivelActual + 1}
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 flex justify-between">
                    <button id="editar-perfil-btn" class="text-sm discord-button-secondary px-3 py-1 rounded">
                        Editar Perfil
                    </button>
                    <button id="ver-notificaciones-btn" class="text-sm discord-button-secondary px-3 py-1 rounded relative">
                        Notificaciones
                        ${estado.notificaciones.filter(n => !n.leida).length > 0 ? 
                            `<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                ${estado.notificaciones.filter(n => !n.leida).length}
                            </span>` : 
                            ''}
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza la sección de estadísticas del usuario
     * @returns {String} HTML de la sección de estadísticas
     */
    function renderizarEstadisticas() {
        // Calcular estadísticas
        const diasConsecutivos = 3; // Ejemplo
        const capitulosLeidos = 15; // Ejemplo
        const versiculosMemorizados = 7; // Ejemplo
        const tiempoTotal = 320; // minutos, ejemplo
        
        return `
            <div class="discord-card rounded-lg p-4 md:p-6 shadow">
                <h2 class="text-lg font-semibold mb-3">Estadísticas</h2>
                
                <div class="grid grid-cols-2 gap-3">
                    <div class="stat-item bg-[var(--bg-input)]/30 p-3 rounded">
                        <div class="text-sm discord-text-secondary">Racha actual</div>
                        <div class="text-xl font-semibold flex items-center">
                            ${diasConsecutivos} días
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                            </svg>
                        </div>
                    </div>
                    
                    <div class="stat-item bg-[var(--bg-input)]/30 p-3 rounded">
                        <div class="text-sm discord-text-secondary">Capítulos leídos</div>
                        <div class="text-xl font-semibold">${capitulosLeidos}</div>
                    </div>
                    
                    <div class="stat-item bg-[var(--bg-input)]/30 p-3 rounded">
                        <div class="text-sm discord-text-secondary">Versículos memorizados</div>
                        <div class="text-xl font-semibold">${versiculosMemorizados}</div>
                    </div>
                    
                    <div class="stat-item bg-[var(--bg-input)]/30 p-3 rounded">
                        <div class="text-sm discord-text-secondary">Tiempo total</div>
                        <div class="text-xl font-semibold">${formatearTiempo(tiempoTotal)}</div>
                    </div>
                </div>
                
                <button id="ver-estadisticas-completas-btn" class="mt-4 w-full text-sm discord-button-secondary px-3 py-1 rounded">
                    Ver estadísticas completas
                </button>
            </div>
        `;
    }
    
    /**
     * Renderiza la sección de logros del usuario
     * @returns {String} HTML de la sección de logros
     */
    function renderizarLogros() {
        // Filtrar logros desbloqueados y en progreso
        const logrosDesbloqueados = estado.logros.filter(l => l.fecha);
        const logrosEnProgreso = estado.logros.filter(l => !l.fecha && l.progreso);
        
        return `
            <div class="discord-card rounded-lg p-4 md:p-6 shadow">
                <div class="flex justify-between items-center mb-3">
                    <h2 class="text-lg font-semibold">Logros</h2>
                    <span class="text-sm discord-text-secondary">${logrosDesbloqueados.length}/${estado.logros.length}</span>
                </div>
                
                <div class="space-y-3">
                    ${logrosDesbloqueados.length > 0 ? 
                        logrosDesbloqueados.slice(0, 3).map(logro => `
                            <div class="logro-item flex items-center p-2 bg-[var(--bg-input)]/30 rounded">
                                <div class="logro-icono text-xl mr-3">${logro.icono || '🏆'}</div>
                                <div class="flex-grow">
                                    <div class="font-medium">${logro.nombre}</div>
                                    <div class="text-xs discord-text-secondary">${logro.descripcion}</div>
                                </div>
                                <div class="text-xs discord-text-muted">${formatearFecha(logro.fecha)}</div>
                            </div>
                        `).join('') : 
                        ''
                    }
                    
                    ${logrosEnProgreso.length > 0 ? 
                        logrosEnProgreso.slice(0, 2).map(logro => `
                            <div class="logro-item flex items-center p-2 bg-[var(--bg-input)]/30 rounded">
                                <div class="logro-icono text-xl mr-3 opacity-50">${logro.icono || '🏆'}</div>
                                <div class="flex-grow">
                                    <div class="font-medium">${logro.nombre}</div>
                                    <div class="text-xs discord-text-secondary">${logro.descripcion}</div>
                                    <div class="mt-1 w-full bg-[var(--bg-input)] rounded-full h-1.5">
                                        <div class="bg-[var(--bg-primary)] h-1.5 rounded-full" style="width: ${Math.floor((logro.progreso / logro.total) * 100)}%"></div>
                                    </div>
                                </div>
                                <div class="text-xs discord-text-muted">${logro.progreso}/${logro.total}</div>
                            </div>
                        `).join('') : 
                        ''
                    }
                    
                    ${logrosDesbloqueados.length === 0 && logrosEnProgreso.length === 0 ? 
                        `<p class="text-sm discord-text-muted text-center py-2">Aún no has desbloqueado ningún logro</p>` : 
                        ''
                    }
                </div>
                
                <button id="ver-todos-logros-btn" class="mt-4 w-full text-sm discord-button-secondary px-3 py-1 rounded">
                    Ver todos los logros
                </button>
            </div>
        `;
    }
    
    /**
     * Renderiza la sección de actividad reciente
     * @returns {String} HTML de la sección de actividad reciente
     */
    function renderizarActividadReciente() {
        // Ordenar actividad por fecha (más reciente primero)
        const actividadOrdenada = [...estado.actividad].sort((a, b) => 
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        
        return `
            <div class="discord-card rounded-lg p-4 md:p-6 shadow">
                <h2 class="text-lg font-semibold mb-3">Actividad Reciente</h2>
                
                <div class="space-y-3">
                    ${actividadOrdenada.length > 0 ? 
                        actividadOrdenada.slice(0, 5).map(actividad => `
                            <div class="actividad-item flex p-2 bg-[var(--bg-input)]/30 rounded">
                                <div class="actividad-icono mr-3 text-xl">
                                    ${obtenerIconoActividad(actividad.tipo)}
                                </div>
                                <div class="flex-grow">
                                    <div class="font-medium">${obtenerTituloActividad(actividad)}</div>
                                    <div class="text-xs discord-text-secondary">${obtenerDetalleActividad(actividad)}</div>
                                </div>
                                <div class="text-xs discord-text-muted">${formatearFechaRelativa(actividad.fecha)}</div>
                            </div>
                        `).join('') : 
                        `<p class="text-sm discord-text-muted text-center py-2">No hay actividad reciente</p>`
                    }
                </div>
                
                <button id="ver-toda-actividad-btn" class="mt-4 w-full text-sm discord-button-secondary px-3 py-1 rounded">
                    Ver toda la actividad
                </button>
            </div>
        `;
    }
    
    /**
     * Renderiza la sección de desafíos
     * @returns {String} HTML de la sección de desafíos
     */
    function renderizarDesafios() {
        return `
            <div class="discord-card rounded-lg p-4 md:p-6 shadow">
                <h2 class="text-lg font-semibold mb-3">Desafíos</h2>
                
                <div class="space-y-4">
                    ${estado.desafios.length > 0 ? 
                        estado.desafios.map(desafio => `
                            <div class="desafio-item p-3 bg-[var(--bg-input)]/30 rounded">
                                <div class="flex justify-between items-center">
                                    <h3 class="font-medium">${desafio.titulo}</h3>
                                    <span class="text-xs discord-text-muted">${desafio.progreso}/${desafio.total}</span>
                                </div>
                                <p class="text-sm discord-text-secondary mt-1">${desafio.descripcion}</p>
                                <div class="mt-2 w-full bg-[var(--bg-input)] rounded-full h-2">
                                    <div class="bg-[var(--bg-primary)] h-2 rounded-full" style="width: ${Math.floor((desafio.progreso / desafio.total) * 100)}%"></div>
                                </div>
                                <div class="mt-2 flex justify-between items-center">
                                    <div class="text-xs discord-text-muted">
                                        Recompensa: ${formatearRecompensa(desafio.recompensa)}
                                    </div>
                                    <button class="actualizar-desafio-btn text-xs discord-button-secondary px-2 py-0.5 rounded" data-id="${desafio.id}">
                                        Actualizar
                                    </button>
                                </div>
                            </div>
                        `).join('') : 
                        `<p class="text-sm discord-text-muted text-center py-2">No hay desafíos activos</p>`
                    }
                </div>
                
                <div class="mt-4 flex space-x-2">
                    <button id="ver-desafios-completados-btn" class="flex-1 text-sm discord-button-secondary px-3 py-1 rounded">
                        Completados
                    </button>
                    <button id="buscar-nuevos-desafios-btn" class="flex-1 text-sm discord-button-primary px-3 py-1 rounded">
                        Nuevos Desafíos
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza la sección de comunidad
     * @returns {String} HTML de la sección de comunidad
     */
    function renderizarComunidad() {
        return `
            <div class="discord-card rounded-lg p-4 md:p-6 shadow">
                <h2 class="text-lg font-semibold mb-3">Comunidad</h2>
                
                <div class="mb-4">
                    <h3 class="text-md font-medium mb-2">Tus Conexiones</h3>
                    <div class="space-y-2">
                        ${estado.conexiones.length > 0 ? 
                            estado.conexiones.map(conexion => `
                                <div class="conexion-item flex items-center p-2 bg-[var(--bg-input)]/30 rounded">
                                    <div class="conexion-avatar w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mr-3">
                                        👤
                                    </div>
                                    <div class="flex-grow">
                                        <div class="font-medium flex items-center">
                                            ${conexion.nombre}
                                            <span class="ml-2 text-xs px-1.5 py-0.5 rounded ${conexion.estado === 'online' ? 'bg-green-500' : 'bg-gray-500'} text-white">
                                                ${conexion.estado === 'online' ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                        <div class="text-xs discord-text-secondary">
                                            ${conexion.tipo === 'mentor' ? 'Mentor' : 'Amigo'} · Nivel ${conexion.nivel}
                                        </div>
                                    </div>
                                    <button class="enviar-mensaje-btn text-xs discord-button-secondary px-2 py-0.5 rounded" data-id="${conexion.id}">
                                        Mensaje
                                    </button>
                                </div>
                            `).join('') : 
                            `<p class="text-sm discord-text-muted text-center py-2">No tienes conexiones aún</p>`
                        }
                    </div>
                    <button id="buscar-conexiones-btn" class="mt-2 w-full text-sm discord-button-secondary px-3 py-1 rounded">
                        Buscar Conexiones
                    </button>
                </div>
                
                <div>
                    <h3 class="text-md font-medium mb-2">Comunidades</h3>
                    <div class="space-y-2">
                        ${estado.comunidades.length > 0 ? 
                            estado.comunidades.slice(0, 3).map(comunidad => `
                                <div class="comunidad-item p-2 bg-[var(--bg-input)]/30 rounded">
                                    <div class="font-medium">${comunidad.nombre}</div>
                                    <div class="text-xs discord-text-secondary">${comunidad.descripcion}</div>
                                    <div class="mt-1 flex justify-between items-center">
                                        <span class="text-xs discord-text-muted">${comunidad.miembros} miembros</span>
                                        <button class="unirse-comunidad-btn text-xs discord-button-secondary px-2 py-0.5 rounded" data-id="${comunidad.id}">
                                            Unirse
                                        </button>
                                    </div>
                                </div>
                            `).join('') : 
                            `<p class="text-sm discord-text-muted text-center py-2">No hay comunidades disponibles</p>`
                        }
                    </div>
                    <button id="explorar-comunidades-btn" class="mt-2 w-full text-sm discord-button-secondary px-3 py-1 rounded">
                        Explorar Comunidades
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza la sección de eventos
     * @returns {String} HTML de la sección de eventos
     */
    function renderizarEventos() {
        // Ordenar eventos por fecha (más cercano primero)
        const eventosOrdenados = [...estado.eventos].sort((a, b) => 
            new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        
        return `
            <div class="discord-card rounded-lg p-4 md:p-6 shadow">
                <h2 class="text-lg font-semibold mb-3">Eventos</h2>
                
                <div class="space-y-3">
                    ${eventosOrdenados.length > 0 ? 
                        eventosOrdenados.map(evento => `
                            <div class="evento-item p-3 bg-[var(--bg-input)]/30 rounded">
                                <div class="flex justify-between items-start">
                                    <h3 class="font-medium">${evento.titulo}</h3>
                                    <span class="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-primary)] text-white">
                                        ${evento.tipo === 'online' ? 'Online' : 'Presencial'}
                                    </span>
                                </div>
                                <p class="text-sm discord-text-secondary mt-1">${evento.descripcion}</p>
                                <div class="mt-2 flex justify-between items-center">
                                    <div class="text-xs discord-text-muted">
                                        <span class="inline-block mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            ${formatearFecha(evento.fecha)}
                                        </span>
                                        <span class="inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            ${evento.duracion} min
                                        </span>
                                    </div>
                                    <button class="participar-evento-btn text-xs discord-button-secondary px-2 py-0.5 rounded" data-id="${evento.id}">
                                        Participar
                                    </button>
                                </div>
                            </div>
                        `).join('') : 
                        `<p class="text-sm discord-text-muted text-center py-2">No hay eventos programados</p>`
                    }
                </div>
                
                <div class="mt-4 flex space-x-2">
                    <button id="ver-calendario-btn" class="flex-1 text-sm discord-button-secondary px-3 py-1 rounded">
                        Calendario
                    </button>
                    <button id="crear-evento-btn" class="flex-1 text-sm discord-button-primary px-3 py-1 rounded">
                        Crear Evento
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza la sección de competencias teóricas
     * @returns {String} HTML de la sección de competencias teóricas
     */
    function renderizarCompetenciasTeoricas() {
        return `
            <div class="discord-card rounded-lg p-4 md:p-6 shadow">
                <div class="flex justify-between items-center mb-3">
                    <h2 class="text-lg font-semibold">Competencias Teóricas</h2>
                    <button id="expandir-competencias-teoricas-btn" class="text-sm discord-button-secondary px-2 py-0.5 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                
                <div id="competencias-teoricas-container" class="space-y-3">
                    ${estado.competencias.teoria.length > 0 ? 
                        estado.competencias.teoria.map(competencia => `
                            <div class="competencia-item p-3 bg-[var(--bg-input)]/30 rounded">
                                <div class="flex justify-between items-center">
                                    <h3 class="font-medium">${competencia.nombre}</h3>
                                    <span class="text-xs discord-text-muted">Nivel ${competencia.nivel}/${competencia.maxNivel}</span>
                                </div>
                                <p class="text-sm discord-text-secondary mt-1">${competencia.descripcion}</p>
                                <div class="mt-2 w-full bg-[var(--bg-input)] rounded-full h-2">
                                    <div class="bg-[var(--bg-primary)] h-2 rounded-full" style="width: ${Math.floor((competencia.nivel / competencia.maxNivel) * 100)}%"></div>
                                </div>
                                <div class="mt-2 flex justify-end">
                                    <button class="mejorar-competencia-btn text-xs discord-button-secondary px-2 py-0.5 rounded" 
                                        data-id="${competencia.id}" data-tipo="teoria" ${competencia.nivel >= competencia.maxNivel ? 'disabled' : ''}>
                                        ${competencia.nivel >= competencia.maxNivel ? 'Máximo' : 'Mejorar'}
                                    </button>
                                </div>
                            </div>
                        `).join('') : 
                        `<p class="text-sm discord-text-muted text-center py-2">No hay competencias teóricas disponibles</p>`
                    }
                </div>
                
                <button id="agregar-competencia-teorica-btn" class="mt-4 w-full text-sm discord-button-secondary px-3 py-1 rounded">
                    Agregar Competencia Teórica
                </button>
            </div>
        `;
    }
    
    /**
     * Renderiza la sección de competencias prácticas
     * @returns {String} HTML de la sección de competencias prácticas
     */
    function renderizarCompetenciasPracticas() {
        return `
            <div class="discord-card rounded-lg p-4 md:p-6 shadow">
                <div class="flex justify-between items-center mb-3">
                    <h2 class="text-lg font-semibold">Competencias Prácticas</h2>
                    <button id="expandir-competencias-practicas-btn" class="text-sm discord-button-secondary px-2 py-0.5 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                
                <div id="competencias-practicas-container" class="space-y-3">
                    ${estado.competencias.practica.length > 0 ? 
                        estado.competencias.practica.map(competencia => `
                            <div class="competencia-item p-3 bg-[var(--bg-input)]/30 rounded">
                                <div class="flex justify-between items-center">
                                    <h3 class="font-medium">${competencia.nombre}</h3>
                                    <span class="text-xs discord-text-muted">Nivel ${competencia.nivel}/${competencia.maxNivel}</span>
                                </div>
                                <p class="text-sm discord-text-secondary mt-1">${competencia.descripcion}</p>
                                <div class="mt-2 w-full bg-[var(--bg-input)] rounded-full h-2">
                                    <div class="bg-[var(--bg-primary)] h-2 rounded-full" style="width: ${Math.floor((competencia.nivel / competencia.maxNivel) * 100)}%"></div>
                                </div>
                                <div class="mt-2 flex justify-end">
                                    <button class="mejorar-competencia-btn text-xs discord-button-secondary px-2 py-0.5 rounded" 
                                        data-id="${competencia.id}" data-tipo="practica" ${competencia.nivel >= competencia.maxNivel ? 'disabled' : ''}>
                                        ${competencia.nivel >= competencia.maxNivel ? 'Máximo' : 'Mejorar'}
                                    </button>
                                </div>
                            </div>
                        `).join('') : 
                        `<p class="text-sm discord-text-muted text-center py-2">No hay competencias prácticas disponibles</p>`
                    }
                </div>
                
                <button id="agregar-competencia-practica-btn" class="mt-4 w-full text-sm discord-button-secondary px-3 py-1 rounded">
                    Agregar Competencia Práctica
                </button>
            </div>
        `;
    }
    
    /**
     * Configura los eventos generales del módulo social
     */
    function configurarEventosSociales() {
        // Eventos para botones de navegación social
        const botonSocialGeneral = document.getElementById('social-general-btn');
        const botonSocialTeoria = document.getElementById('social-teoria-btn');
        const botonSocialPractica = document.getElementById('social-practica-btn');
        
        if (botonSocialGeneral) {
            botonSocialGeneral.classList.remove('hidden');
            botonSocialGeneral.addEventListener('click', () => {
                mostrarSeccionSocial('general');
            });
        }
        
        if (botonSocialTeoria) {
            botonSocialTeoria.classList.remove('hidden');
            botonSocialTeoria.addEventListener('click', () => {
                mostrarSeccionSocial('teoria');
            });
        }
        
        if (botonSocialPractica) {
            botonSocialPractica.classList.remove('hidden');
            botonSocialPractica.addEventListener('click', () => {
                mostrarSeccionSocial('practica');
            });
        }
    }
    
    /**
     * Configura los eventos específicos de la sección de perfil
     */
    function configurarEventosPerfil() {
        // Evento para botón de editar perfil
        const botonEditarPerfil = document.getElementById('editar-perfil-btn');
        if (botonEditarPerfil) {
            botonEditarPerfil.addEventListener('click', () => {
                mostrarModalEditarPerfil();
            });
        }
        
        // Evento para botón de notificaciones
        const botonNotificaciones = document.getElementById('ver-notificaciones-btn');
        if (botonNotificaciones) {
            botonNotificaciones.addEventListener('click', () => {
                mostrarModalNotificaciones();
            });
        }
        
        // Evento para botón de estadísticas completas
        const botonEstadisticasCompletas = document.getElementById('ver-estadisticas-completas-btn');
        if (botonEstadisticasCompletas) {
            botonEstadisticasCompletas.addEventListener('click', () => {
                mostrarModalEstadisticasCompletas();
            });
        }
        
        // Evento para botón de todos los logros
        const botonTodosLogros = document.getElementById('ver-todos-logros-btn');
        if (botonTodosLogros) {
            botonTodosLogros.addEventListener('click', () => {
                mostrarModalTodosLogros();
            });
        }
        
        // Evento para botón de toda la actividad
        const botonTodaActividad = document.getElementById('ver-toda-actividad-btn');
        if (botonTodaActividad) {
            botonTodaActividad.addEventListener('click', () => {
                mostrarModalTodaActividad();
            });
        }
    }
    
    /**
     * Configura los eventos específicos de la sección de competencias
     */
    function configurarEventosCompetencias() {
        // Eventos para botones de expandir competencias
        const botonExpandirTeoricas = document.getElementById('expandir-competencias-teoricas-btn');
        const contenedorTeoricas = document.getElementById('competencias-teoricas-container');
        
        if (botonExpandirTeoricas && contenedorTeoricas) {
            botonExpandirTeoricas.addEventListener('click', () => {
                contenedorTeoricas.classList.toggle('hidden');
                const icono = botonExpandirTeoricas.querySelector('svg');
                if (icono) {
                    icono.style.transform = contenedorTeoricas.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        }
        
        const botonExpandirPracticas = document.getElementById('expandir-competencias-practicas-btn');
        const contenedorPracticas = document.getElementById('competencias-practicas-container');
        
        if (botonExpandirPracticas && contenedorPracticas) {
            botonExpandirPracticas.addEventListener('click', () => {
                contenedorPracticas.classList.toggle('hidden');
                const icono = botonExpandirPracticas.querySelector('svg');
                if (icono) {
                    icono.style.transform = contenedorPracticas.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        }
        
        // Eventos para botones de mejorar competencia
        document.querySelectorAll('.mejorar-competencia-btn').forEach(boton => {
            boton.addEventListener('click', () => {
                const competenciaId = boton.dataset.id;
                const tipoCompetencia = boton.dataset.tipo;
                mostrarModalMejorarCompetencia(competenciaId, tipoCompetencia);
            });
        });
        
        // Eventos para botones de agregar competencia
        const botonAgregarTeorica = document.getElementById('agregar-competencia-teorica-btn');
        if (botonAgregarTeorica) {
            botonAgregarTeorica.addEventListener('click', () => {
                mostrarModalAgregarCompetencia('teoria');
            });
        }
        
        const botonAgregarPractica = document.getElementById('agregar-competencia-practica-btn');
        if (botonAgregarPractica) {
            botonAgregarPractica.addEventListener('click', () => {
                mostrarModalAgregarCompetencia('practica');
            });
        }
    }
    
    /**
     * Configura los eventos específicos de la sección de comunidad
     */
    function configurarEventosComunidad() {
        // Eventos para botones de enviar mensaje
        document.querySelectorAll('.enviar-mensaje-btn').forEach(boton => {
            boton.addEventListener('click', () => {
                const conexionId = boton.dataset.id;
                mostrarModalEnviarMensaje(conexionId);
            });
        });
        
        // Eventos para botones de unirse a comunidad
        document.querySelectorAll('.unirse-comunidad-btn').forEach(boton => {
            boton.addEventListener('click', () => {
                const comunidadId = boton.dataset.id;
                unirseAComunidad(comunidadId);
            });
        });
        
        // Evento para botón de buscar conexiones
        const botonBuscarConexiones = document.getElementById('buscar-conexiones-btn');
        if (botonBuscarConexiones) {
            botonBuscarConexiones.addEventListener('click', () => {
                mostrarModalBuscarConexiones();
            });
        }
        
        // Evento para botón de explorar comunidades
        const botonExplorarComunidades = document.getElementById('explorar-comunidades-btn');
        if (botonExplorarComunidades) {
            botonExplorarComunidades.addEventListener('click', () => {
                mostrarModalExplorarComunidades();
            });
        }
        
        // Eventos para botones de calendario y crear evento
        const botonVerCalendario = document.getElementById('ver-calendario-btn');
        if (botonVerCalendario) {
            botonVerCalendario.addEventListener('click', () => {
                mostrarModalCalendario();
            });
        }
        
        const botonCrearEvento = document.getElementById('crear-evento-btn');
        if (botonCrearEvento) {
            botonCrearEvento.addEventListener('click', () => {
                mostrarModalCrearEvento();
            });
        }
        
        // Eventos para botones de participar en evento
        document.querySelectorAll('.participar-evento-btn').forEach(boton => {
            boton.addEventListener('click', () => {
                const eventoId = boton.dataset.id;
                participarEnEvento(eventoId);
            });
        });
    }
    
    /**
     * Configura los eventos específicos de la sección de desafíos
     */
    function configurarEventosDesafios() {
        // Eventos para botones de actualizar desafío
        document.querySelectorAll('.actualizar-desafio-btn').forEach(boton => {
            boton.addEventListener('click', () => {
                const desafioId = boton.dataset.id;
                mostrarModalActualizarDesafio(desafioId);
            });
        });
        
        // Evento para botón de ver desafíos completados
        const botonDesafiosCompletados = document.getElementById('ver-desafios-completados-btn');
        if (botonDesafiosCompletados) {
            botonDesafiosCompletados.addEventListener('click', () => {
                mostrarModalDesafiosCompletados();
            });
        }
        
        // Evento para botón de buscar nuevos desafíos
        const botonNuevosDesafios = document.getElementById('buscar-nuevos-desafios-btn');
        if (botonNuevosDesafios) {
            botonNuevosDesafios.addEventListener('click', () => {
                mostrarModalNuevosDesafios();
            });
        }
    }
    
    /**
     * Muestra una sección específica del módulo social
     * @param {String} seccion - Nombre de la sección a mostrar ('general', 'teoria', 'practica')
     */
    function mostrarSeccionSocial(seccion) {
        // Implementación para mostrar diferentes secciones del módulo social
        console.log(`Mostrando sección social: ${seccion}`);
        
        // Aquí se implementaría la lógica para cambiar entre secciones
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal para editar perfil
     */
    function mostrarModalEditarPerfil() {
        // Implementación para mostrar modal de edición de perfil
        console.log('Mostrando modal para editar perfil');
        
        // Aquí se implementaría la lógica para mostrar un modal con formulario de edición
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal de notificaciones
     */
    function mostrarModalNotificaciones() {
        // Implementación para mostrar modal de notificaciones
        console.log('Mostrando modal de notificaciones');
        
        // Marcar todas las notificaciones como leídas
        estado.notificaciones.forEach(notificacion => {
            notificacion.leida = true;
        });
        
        // Actualizar interfaz
        renderizarInterfazSocial();
        configurarEventosSociales();
    }
    
    /**
     * Muestra el modal de estadísticas completas
     */
    function mostrarModalEstadisticasCompletas() {
        // Implementación para mostrar modal de estadísticas completas
        console.log('Mostrando modal de estadísticas completas');
        
        // Aquí se implementaría la lógica para mostrar un modal con estadísticas detalladas
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal de todos los logros
     */
    function mostrarModalTodosLogros() {
        // Implementación para mostrar modal de todos los logros
        console.log('Mostrando modal de todos los logros');
        
        // Aquí se implementaría la lógica para mostrar un modal con todos los logros
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal de toda la actividad
     */
    function mostrarModalTodaActividad() {
        // Implementación para mostrar modal de toda la actividad
        console.log('Mostrando modal de toda la actividad');
        
        // Aquí se implementaría la lógica para mostrar un modal con toda la actividad
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal para mejorar una competencia
     * @param {String} competenciaId - ID de la competencia
     * @param {String} tipo - Tipo de competencia ('teoria' o 'practica')
     */
    function mostrarModalMejorarCompetencia(competenciaId, tipo) {
        // Implementación para mostrar modal de mejora de competencia
        console.log(`Mostrando modal para mejorar competencia ${competenciaId} de tipo ${tipo}`);
        
        // Aquí se implementaría la lógica para mostrar un modal con opciones de mejora
        // Por ahora, simulamos una mejora directa
        
        const competencias = tipo === 'teoria' ? estado.competencias.teoria : estado.competencias.practica;
        const competencia = competencias.find(c => c.id === competenciaId);
        
        if (competencia && competencia.nivel < competencia.maxNivel) {
            competencia.nivel += 1;
            
            // Actualizar experiencia del usuario
            config.perfilUsuario.experiencia += 50;
            
            // Verificar si subió de nivel
            const nivelActual = config.perfilUsuario.nivel;
            const expNecesaria = nivelActual * 100;
            
            if (config.perfilUsuario.experiencia >= expNecesaria) {
                config.perfilUsuario.nivel += 1;
                // Mostrar notificación de subida de nivel
                agregarNotificacion({
                    tipo: 'nivel',
                    titulo: '¡Has subido de nivel!',
                    mensaje: `Has alcanzado el nivel ${config.perfilUsuario.nivel}`,
                    fecha: new Date().toISOString(),
                    leida: false
                });
            }
            
            // Actualizar interfaz
            renderizarInterfazSocial();
            configurarEventosSociales();
        }
    }
    
    /**
     * Muestra el modal para agregar una nueva competencia
     * @param {String} tipo - Tipo de competencia ('teoria' o 'practica')
     */
    function mostrarModalAgregarCompetencia(tipo) {
        // Implementación para mostrar modal de agregar competencia
        console.log(`Mostrando modal para agregar competencia de tipo ${tipo}`);
        
        // Aquí se implementaría la lógica para mostrar un modal con formulario
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal para enviar mensaje a una conexión
     * @param {String} conexionId - ID de la conexión
     */
    function mostrarModalEnviarMensaje(conexionId) {
        // Implementación para mostrar modal de envío de mensaje
        console.log(`Mostrando modal para enviar mensaje a conexión ${conexionId}`);
        
        // Aquí se implementaría la lógica para mostrar un modal con formulario de mensaje
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Realiza la acción de unirse a una comunidad
     * @param {String} comunidadId - ID de la comunidad
     */
    function unirseAComunidad(comunidadId) {
        // Implementación para unirse a comunidad
        console.log(`Uniéndose a comunidad ${comunidadId}`);
        
        // Aquí se implementaría la lógica para unirse a una comunidad
        // Por ahora, solo mostramos un mensaje en consola y actualizamos la interfaz
        
        // Actualizar interfaz
        renderizarInterfazSocial();
        configurarEventosSociales();
    }
    
    /**
     * Muestra el modal para buscar nuevas conexiones
     */
    function mostrarModalBuscarConexiones() {
        // Implementación para mostrar modal de búsqueda de conexiones
        console.log('Mostrando modal para buscar conexiones');
        
        // Aquí se implementaría la lógica para mostrar un modal con opciones de búsqueda
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal para explorar comunidades
     */
    function mostrarModalExplorarComunidades() {
        // Implementación para mostrar modal de exploración de comunidades
        console.log('Mostrando modal para explorar comunidades');
        
        // Aquí se implementaría la lógica para mostrar un modal con lista de comunidades
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal de calendario de eventos
     */
    function mostrarModalCalendario() {
        // Implementación para mostrar modal de calendario
        console.log('Mostrando modal de calendario');
        
        // Aquí se implementaría la lógica para mostrar un modal con calendario
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal para crear un nuevo evento
     */
    function mostrarModalCrearEvento() {
        // Implementación para mostrar modal de creación de evento
        console.log('Mostrando modal para crear evento');
        
        // Aquí se implementaría la lógica para mostrar un modal con formulario
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Realiza la acción de participar en un evento
     * @param {String} eventoId - ID del evento
     */
    function participarEnEvento(eventoId) {
        // Implementación para participar en evento
        console.log(`Participando en evento ${eventoId}`);
        
        // Aquí se implementaría la lógica para registrar participación
        // Por ahora, solo mostramos un mensaje en consola y actualizamos la interfaz
        
        // Buscar el evento
        const evento = estado.eventos.find(e => e.id === eventoId);
        if (evento) {
            evento.participantes += 1;
            
            // Agregar notificación
            agregarNotificacion({
                tipo: 'evento',
                titulo: 'Participación confirmada',
                mensaje: `Te has registrado para participar en "${evento.titulo}"`,
                fecha: new Date().toISOString(),
                leida: false,
                accion: { tipo: 'verEvento', id: eventoId }
            });
            
            // Actualizar interfaz
            renderizarInterfazSocial();
            configurarEventosSociales();
        }
    }
    
    /**
     * Muestra el modal para actualizar progreso de un desafío
     * @param {String} desafioId - ID del desafío
     */
    function mostrarModalActualizarDesafio(desafioId) {
        // Implementación para mostrar modal de actualización de desafío
        console.log(`Mostrando modal para actualizar desafío ${desafioId}`);
        
        // Aquí se implementaría la lógica para mostrar un modal con opciones
        // Por ahora, simulamos una actualización directa
        
        const desafio = estado.desafios.find(d => d.id === desafioId);
        if (desafio && desafio.progreso < desafio.total) {
            desafio.progreso += 1;
            
            // Verificar si se completó el desafío
            if (desafio.progreso >= desafio.total) {
                // Otorgar recompensa
                if (desafio.recompensa) {
                    // Experiencia
                    if (desafio.recompensa.experiencia) {
                        config.perfilUsuario.experiencia += desafio.recompensa.experiencia;
                        
                        // Verificar si subió de nivel
                        const nivelActual = config.perfilUsuario.nivel;
                        const expNecesaria = nivelActual * 100;
                        
                        if (config.perfilUsuario.experiencia >= expNecesaria) {
                            config.perfilUsuario.nivel += 1;
                            // Mostrar notificación de subida de nivel
                            agregarNotificacion({
                                tipo: 'nivel',
                                titulo: '¡Has subido de nivel!',
                                mensaje: `Has alcanzado el nivel ${config.perfilUsuario.nivel}`,
                                fecha: new Date().toISOString(),
                                leida: false
                            });
                        }
                    }
                    
                    // Mejora de competencia
                    if (desafio.recompensa.competencia) {
                        const tipoCompetencia = desafio.recompensa.competencia.startsWith('ct') ? 'teoria' : 'practica';
                        const competencias = tipoCompetencia === 'teoria' ? estado.competencias.teoria : estado.competencias.practica;
                        const competencia = competencias.find(c => c.id === desafio.recompensa.competencia);
                        
                        if (competencia && competencia.nivel < competencia.maxNivel) {
                            competencia.nivel += desafio.recompensa.nivelesCompetencia || 1;
                            if (competencia.nivel > competencia.maxNivel) {
                                competencia.nivel = competencia.maxNivel;
                            }
                        }
                    }
                }
                
                // Agregar notificación de desafío completado
                agregarNotificacion({
                    tipo: 'desafio',
                    titulo: '¡Desafío completado!',
                    mensaje: `Has completado el desafío "${desafio.titulo}"`,
                    fecha: new Date().toISOString(),
                    leida: false,
                    accion: { tipo: 'verDesafio', id: desafioId }
                });
            }
            
            // Actualizar interfaz
            renderizarInterfazSocial();
            configurarEventosSociales();
        }
    }
    
    /**
     * Muestra el modal de desafíos completados
     */
    function mostrarModalDesafiosCompletados() {
        // Implementación para mostrar modal de desafíos completados
        console.log('Mostrando modal de desafíos completados');
        
        // Aquí se implementaría la lógica para mostrar un modal con desafíos completados
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Muestra el modal para buscar nuevos desafíos
     */
    function mostrarModalNuevosDesafios() {
        // Implementación para mostrar modal de nuevos desafíos
        console.log('Mostrando modal de nuevos desafíos');
        
        // Aquí se implementaría la lógica para mostrar un modal con opciones de desafíos
        // Por ahora, solo mostramos un mensaje en consola
    }
    
    /**
     * Agrega una nueva notificación al sistema
     * @param {Object} notificacion - Objeto de notificación
     */
    function agregarNotificacion(notificacion) {
        // Generar ID único
        notificacion.id = `not${Date.now()}`;
        
        // Agregar al inicio de la lista
        estado.notificaciones.unshift(notificacion);
        
        // Limitar cantidad de notificaciones
        if (estado.notificaciones.length > config.maxNotificaciones) {
            estado.notificaciones = estado.notificaciones.slice(0, config.maxNotificaciones);
        }
    }
    
    /**
     * Inicia las actualizaciones automáticas
     */
    function iniciarActualizacionesAutomaticas() {
        // Detener temporizador existente si hay uno
        if (temporizadorActualizacion) {
            clearInterval(temporizadorActualizacion);
        }
        
        // Iniciar nuevo temporizador
        temporizadorActualizacion = setInterval(() => {
            actualizarDatos();
        }, config.intervaloActualizacion);
    }
    
    /**
     * Detiene las actualizaciones automáticas
     */
    function detenerActualizacionesAutomaticas() {
        if (temporizadorActualizacion) {
            clearInterval(temporizadorActualizacion);
            temporizadorActualizacion = null;
        }
    }
    
    /**
     * Actualiza los datos del módulo social
     */
    function actualizarDatos() {
        // En una implementación real, aquí se realizarían peticiones a un servidor
        // Por ahora, solo simulamos algunas actualizaciones aleatorias
        
        // Actualizar estado de conexiones
        estado.conexiones.forEach(conexion => {
            // 10% de probabilidad de cambiar estado
            if (Math.random() < 0.1) {
                conexion.estado = conexion.estado === 'online' ? 'offline' : 'online';
                conexion.ultimaActividad = new Date().toISOString();
            }
        });
        
        // Posibilidad de nueva notificación
        if (Math.random() < 0.05) {
            const tiposNotificacion = ['evento', 'logro', 'desafio', 'conexion'];
            const tipoAleatorio = tiposNotificacion[Math.floor(Math.random() * tiposNotificacion.length)];
            
            agregarNotificacion({
                tipo: tipoAleatorio,
                titulo: `Nueva notificación de ${tipoAleatorio}`,
                mensaje: `Esta es una notificación de ejemplo de tipo ${tipoAleatorio}`,
                fecha: new Date().toISOString(),
                leida: false
            });
            
            // Actualizar interfaz si hay nuevas notificaciones
            renderizarInterfazSocial();
            configurarEventosSociales();
        }
    }
    
    // Funciones auxiliares
    
    /**
     * Agrega días a una fecha
     * @param {Date} fecha - Fecha base
     * @param {Number} dias - Número de días a agregar (puede ser negativo)
     * @returns {Date} Nueva fecha
     */
    function agregarDias(fecha, dias) {
        const resultado = new Date(fecha);
        resultado.setDate(resultado.getDate() + dias);
        return resultado;
    }
    
    /**
     * Formatea una fecha en formato legible
     * @param {String} fechaISO - Fecha en formato ISO
     * @returns {String} Fecha formateada
     */
    function formatearFecha(fechaISO) {
        if (!fechaISO) return '';
        
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    }
    
    /**
     * Formatea una fecha en formato relativo
     * @param {String} fechaISO - Fecha en formato ISO
     * @returns {String} Fecha relativa formateada
     */
    function formatearFechaRelativa(fechaISO) {
        if (!fechaISO) return '';
        
        const fecha = new Date(fechaISO);
        const ahora = new Date();
        const diferenciaMilisegundos = ahora - fecha;
        const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));
        const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
        const diferenciaDias = Math.floor(diferenciaHoras / 24);
        
        if (diferenciaDias > 30) {
            return formatearFecha(fechaISO);
        } else if (diferenciaDias > 0) {
            return `hace ${diferenciaDias} ${diferenciaDias === 1 ? 'día' : 'días'}`;
        } else if (diferenciaHoras > 0) {
            return `hace ${diferenciaHoras} ${diferenciaHoras === 1 ? 'hora' : 'horas'}`;
        } else if (diferenciaMinutos > 0) {
            return `hace ${diferenciaMinutos} ${diferenciaMinutos === 1 ? 'minuto' : 'minutos'}`;
        } else {
            return 'ahora mismo';
        }
    }
    
    /**
     * Formatea tiempo en minutos a formato legible
     * @param {Number} minutos - Tiempo en minutos
     * @returns {String} Tiempo formateado
     */
    function formatearTiempo(minutos) {
        if (minutos < 60) {
            return `${minutos}min`;
        } else {
            const horas = Math.floor(minutos / 60);
            const minutosRestantes = minutos % 60;
            return minutosRestantes > 0 ? `${horas}h ${minutosRestantes}min` : `${horas}h`;
        }
    }
    
    /**
     * Obtiene el icono correspondiente a un tipo de actividad
     * @param {String} tipo - Tipo de actividad
     * @returns {String} Icono HTML
     */
    function obtenerIconoActividad(tipo) {
        switch (tipo) {
            case 'lectura':
                return '📖';
            case 'memorizacion':
                return '🧠';
            case 'checkin':
                return '✅';
            case 'oracion':
                return '🙏';
            case 'evento':
                return '📅';
            case 'desafio':
                return '🏆';
            default:
                return '📝';
        }
    }
    
    /**
     * Obtiene el título para una actividad
     * @param {Object} actividad - Objeto de actividad
     * @returns {String} Título formateado
     */
    function obtenerTituloActividad(actividad) {
        switch (actividad.tipo) {
            case 'lectura':
                return `Lectura: ${actividad.detalles.libro} ${actividad.detalles.capitulo}`;
            case 'memorizacion':
                return `Memorización: ${actividad.detalles.referencia}`;
            case 'checkin':
                return 'Check-in diario';
            case 'oracion':
                return 'Tiempo de oración';
            case 'evento':
                return `Evento: ${actividad.detalles.titulo || 'Sin título'}`;
            case 'desafio':
                return `Desafío: ${actividad.detalles.titulo || 'Sin título'}`;
            default:
                return 'Actividad';
        }
    }
    
    /**
     * Obtiene el detalle para una actividad
     * @param {Object} actividad - Objeto de actividad
     * @returns {String} Detalle formateado
     */
    function obtenerDetalleActividad(actividad) {
        switch (actividad.tipo) {
            case 'lectura':
                return `Has leído el capítulo ${actividad.detalles.capitulo} de ${actividad.detalles.libro}`;
            case 'memorizacion':
                return `Has practicado la memorización de ${actividad.detalles.referencia} (Puntuación: ${actividad.detalles.puntuacion}/5)`;
            case 'checkin':
                return `Has completado tu check-in diario (${actividad.detalles.duracion} minutos)`;
            case 'oracion':
                return `Has dedicado tiempo a la oración (${actividad.detalles.duracion || 0} minutos)`;
            case 'evento':
                return actividad.detalles.descripcion || 'Has participado en un evento';
            case 'desafio':
                return `Progreso: ${actividad.detalles.progreso || 0}/${actividad.detalles.total || 1}`;
            default:
                return '';
        }
    }
    
    /**
     * Formatea una recompensa para mostrarla
     * @param {Object} recompensa - Objeto de recompensa
     * @returns {String} Recompensa formateada
     */
    function formatearRecompensa(recompensa) {
        if (!recompensa) return 'Ninguna';
        
        let texto = '';
        
        if (recompensa.experiencia) {
            texto += `${recompensa.experiencia} XP`;
        }
        
        if (recompensa.competencia) {
            const tipoCompetencia = recompensa.competencia.startsWith('ct') ? 'teoria' : 'practica';
            const competencias = tipoCompetencia === 'teoria' ? estado.competencias.teoria : estado.competencias.practica;
            const competencia = competencias.find(c => c.id === recompensa.competencia);
            
            if (competencia) {
                if (texto) texto += ', ';
                texto += `+${recompensa.nivelesCompetencia || 1} nivel en ${competencia.nombre}`;
            }
        }
        
        return texto || 'Ninguna';
    }
    
    // API pública del módulo
    return {
        inicializar,
        renderizarInterfazSocial,
        actualizarDatos,
        getEstado: () => JSON.parse(JSON.stringify(estado)),
        getConfig: () => JSON.parse(JSON.stringify(config)),
        iniciarActualizacionesAutomaticas,
        detenerActualizacionesAutomaticas
    };
})();

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando módulo social avanzado...');
    
    // Inicializar módulo social
    if (typeof SocialAvanzado !== 'undefined') {
        SocialAvanzado.inicializar();
    }
});
