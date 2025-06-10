/**
 * Módulo de Integración de la Biblia Reina Valera 1960
 * Aplicación de Formación Bíblica - Versión Mejorada
 */

// Módulo principal para la Biblia
const BibliaRV1960 = (function() {
    // Configuración
    const config = {
        apiBase: 'https://biblia-api.vercel.app/api/v1',
        cacheEnabled: true,
        cacheExpiration: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
        maxConcurrentRequests: 5,
        requestDelay: 300 // ms entre solicitudes para no sobrecargar la API
    };

    // Estructura de datos para almacenamiento en caché
    const cache = {
        libros: null,
        capitulos: {},
        versiculos: {}
    };

    // Información de libros de la Biblia
    const librosInfo = [
        { id: 'genesis', nombre: 'Génesis', abreviatura: 'Gn', testamento: 'AT', capitulos: 50 },
        { id: 'exodo', nombre: 'Éxodo', abreviatura: 'Ex', testamento: 'AT', capitulos: 40 },
        { id: 'levitico', nombre: 'Levítico', abreviatura: 'Lv', testamento: 'AT', capitulos: 27 },
        { id: 'numeros', nombre: 'Números', abreviatura: 'Nm', testamento: 'AT', capitulos: 36 },
        { id: 'deuteronomio', nombre: 'Deuteronomio', abreviatura: 'Dt', testamento: 'AT', capitulos: 34 },
        { id: 'josue', nombre: 'Josué', abreviatura: 'Jos', testamento: 'AT', capitulos: 24 },
        { id: 'jueces', nombre: 'Jueces', abreviatura: 'Jue', testamento: 'AT', capitulos: 21 },
        { id: 'rut', nombre: 'Rut', abreviatura: 'Rt', testamento: 'AT', capitulos: 4 },
        { id: '1samuel', nombre: '1 Samuel', abreviatura: '1S', testamento: 'AT', capitulos: 31 },
        { id: '2samuel', nombre: '2 Samuel', abreviatura: '2S', testamento: 'AT', capitulos: 24 },
        { id: '1reyes', nombre: '1 Reyes', abreviatura: '1R', testamento: 'AT', capitulos: 22 },
        { id: '2reyes', nombre: '2 Reyes', abreviatura: '2R', testamento: 'AT', capitulos: 25 },
        { id: '1cronicas', nombre: '1 Crónicas', abreviatura: '1Cr', testamento: 'AT', capitulos: 29 },
        { id: '2cronicas', nombre: '2 Crónicas', abreviatura: '2Cr', testamento: 'AT', capitulos: 36 },
        { id: 'esdras', nombre: 'Esdras', abreviatura: 'Esd', testamento: 'AT', capitulos: 10 },
        { id: 'nehemias', nombre: 'Nehemías', abreviatura: 'Neh', testamento: 'AT', capitulos: 13 },
        { id: 'ester', nombre: 'Ester', abreviatura: 'Est', testamento: 'AT', capitulos: 10 },
        { id: 'job', nombre: 'Job', abreviatura: 'Job', testamento: 'AT', capitulos: 42 },
        { id: 'salmos', nombre: 'Salmos', abreviatura: 'Sal', testamento: 'AT', capitulos: 150 },
        { id: 'proverbios', nombre: 'Proverbios', abreviatura: 'Pr', testamento: 'AT', capitulos: 31 },
        { id: 'eclesiastes', nombre: 'Eclesiastés', abreviatura: 'Ec', testamento: 'AT', capitulos: 12 },
        { id: 'cantares', nombre: 'Cantares', abreviatura: 'Cnt', testamento: 'AT', capitulos: 8 },
        { id: 'isaias', nombre: 'Isaías', abreviatura: 'Is', testamento: 'AT', capitulos: 66 },
        { id: 'jeremias', nombre: 'Jeremías', abreviatura: 'Jer', testamento: 'AT', capitulos: 52 },
        { id: 'lamentaciones', nombre: 'Lamentaciones', abreviatura: 'Lm', testamento: 'AT', capitulos: 5 },
        { id: 'ezequiel', nombre: 'Ezequiel', abreviatura: 'Ez', testamento: 'AT', capitulos: 48 },
        { id: 'daniel', nombre: 'Daniel', abreviatura: 'Dn', testamento: 'AT', capitulos: 12 },
        { id: 'oseas', nombre: 'Oseas', abreviatura: 'Os', testamento: 'AT', capitulos: 14 },
        { id: 'joel', nombre: 'Joel', abreviatura: 'Jl', testamento: 'AT', capitulos: 3 },
        { id: 'amos', nombre: 'Amós', abreviatura: 'Am', testamento: 'AT', capitulos: 9 },
        { id: 'abdias', nombre: 'Abdías', abreviatura: 'Abd', testamento: 'AT', capitulos: 1 },
        { id: 'jonas', nombre: 'Jonás', abreviatura: 'Jon', testamento: 'AT', capitulos: 4 },
        { id: 'miqueas', nombre: 'Miqueas', abreviatura: 'Mi', testamento: 'AT', capitulos: 7 },
        { id: 'nahum', nombre: 'Nahúm', abreviatura: 'Nah', testamento: 'AT', capitulos: 3 },
        { id: 'habacuc', nombre: 'Habacuc', abreviatura: 'Hab', testamento: 'AT', capitulos: 3 },
        { id: 'sofonias', nombre: 'Sofonías', abreviatura: 'Sof', testamento: 'AT', capitulos: 3 },
        { id: 'hageo', nombre: 'Hageo', abreviatura: 'Hag', testamento: 'AT', capitulos: 2 },
        { id: 'zacarias', nombre: 'Zacarías', abreviatura: 'Zac', testamento: 'AT', capitulos: 14 },
        { id: 'malaquias', nombre: 'Malaquías', abreviatura: 'Mal', testamento: 'AT', capitulos: 4 },
        { id: 'mateo', nombre: 'Mateo', abreviatura: 'Mt', testamento: 'NT', capitulos: 28 },
        { id: 'marcos', nombre: 'Marcos', abreviatura: 'Mr', testamento: 'NT', capitulos: 16 },
        { id: 'lucas', nombre: 'Lucas', abreviatura: 'Lc', testamento: 'NT', capitulos: 24 },
        { id: 'juan', nombre: 'Juan', abreviatura: 'Jn', testamento: 'NT', capitulos: 21 },
        { id: 'hechos', nombre: 'Hechos', abreviatura: 'Hch', testamento: 'NT', capitulos: 28 },
        { id: 'romanos', nombre: 'Romanos', abreviatura: 'Ro', testamento: 'NT', capitulos: 16 },
        { id: '1corintios', nombre: '1 Corintios', abreviatura: '1Co', testamento: 'NT', capitulos: 16 },
        { id: '2corintios', nombre: '2 Corintios', abreviatura: '2Co', testamento: 'NT', capitulos: 13 },
        { id: 'galatas', nombre: 'Gálatas', abreviatura: 'Ga', testamento: 'NT', capitulos: 6 },
        { id: 'efesios', nombre: 'Efesios', abreviatura: 'Ef', testamento: 'NT', capitulos: 6 },
        { id: 'filipenses', nombre: 'Filipenses', abreviatura: 'Fil', testamento: 'NT', capitulos: 4 },
        { id: 'colosenses', nombre: 'Colosenses', abreviatura: 'Col', testamento: 'NT', capitulos: 4 },
        { id: '1tesalonicenses', nombre: '1 Tesalonicenses', abreviatura: '1Ts', testamento: 'NT', capitulos: 5 },
        { id: '2tesalonicenses', nombre: '2 Tesalonicenses', abreviatura: '2Ts', testamento: 'NT', capitulos: 3 },
        { id: '1timoteo', nombre: '1 Timoteo', abreviatura: '1Ti', testamento: 'NT', capitulos: 6 },
        { id: '2timoteo', nombre: '2 Timoteo', abreviatura: '2Ti', testamento: 'NT', capitulos: 4 },
        { id: 'tito', nombre: 'Tito', abreviatura: 'Tit', testamento: 'NT', capitulos: 3 },
        { id: 'filemon', nombre: 'Filemón', abreviatura: 'Flm', testamento: 'NT', capitulos: 1 },
        { id: 'hebreos', nombre: 'Hebreos', abreviatura: 'He', testamento: 'NT', capitulos: 13 },
        { id: 'santiago', nombre: 'Santiago', abreviatura: 'Stg', testamento: 'NT', capitulos: 5 },
        { id: '1pedro', nombre: '1 Pedro', abreviatura: '1P', testamento: 'NT', capitulos: 5 },
        { id: '2pedro', nombre: '2 Pedro', abreviatura: '2P', testamento: 'NT', capitulos: 3 },
        { id: '1juan', nombre: '1 Juan', abreviatura: '1Jn', testamento: 'NT', capitulos: 5 },
        { id: '2juan', nombre: '2 Juan', abreviatura: '2Jn', testamento: 'NT', capitulos: 1 },
        { id: '3juan', nombre: '3 Juan', abreviatura: '3Jn', testamento: 'NT', capitulos: 1 },
        { id: 'judas', nombre: 'Judas', abreviatura: 'Jud', testamento: 'NT', capitulos: 1 },
        { id: 'apocalipsis', nombre: 'Apocalipsis', abreviatura: 'Ap', testamento: 'NT', capitulos: 22 }
    ];

    // Cola de solicitudes para controlar la tasa de peticiones
    let requestQueue = [];
    let processingQueue = false;

    /**
     * Inicializa el módulo de la Biblia
     * @param {Object} opciones - Opciones de configuración
     */
    function inicializar(opciones = {}) {
        // Actualizar configuración
        Object.assign(config, opciones);
        
        // Cargar caché desde localStorage si está disponible
        if (config.cacheEnabled && window.localStorage) {
            try {
                const cachedData = localStorage.getItem('bibliaRV1960Cache');
                if (cachedData) {
                    const parsedCache = JSON.parse(cachedData);
                    if (parsedCache && parsedCache.timestamp) {
                        // Verificar si la caché ha expirado
                        const ahora = new Date().getTime();
                        if (ahora - parsedCache.timestamp < config.cacheExpiration) {
                            cache.libros = parsedCache.libros || null;
                            cache.capitulos = parsedCache.capitulos || {};
                            cache.versiculos = parsedCache.versiculos || {};
                            console.log('Caché de la Biblia cargada correctamente');
                        } else {
                            console.log('Caché de la Biblia expirada, se usarán datos frescos');
                            limpiarCache();
                        }
                    }
                }
            } catch (error) {
                console.error('Error al cargar caché de la Biblia:', error);
                limpiarCache();
            }
        }
        
        // Inicializar libros si no están en caché
        if (!cache.libros) {
            cache.libros = librosInfo;
            guardarCache();
        }
        
        // Inicializar interfaz
        renderizarInterfazBiblia();
    }
    
    /**
     * Limpia la caché de la Biblia
     */
    function limpiarCache() {
        cache.libros = null;
        cache.capitulos = {};
        cache.versiculos = {};
        
        if (config.cacheEnabled && window.localStorage) {
            try {
                localStorage.removeItem('bibliaRV1960Cache');
            } catch (error) {
                console.error('Error al limpiar caché de la Biblia:', error);
            }
        }
    }
    
    /**
     * Guarda la caché actual en localStorage
     */
    function guardarCache() {
        if (config.cacheEnabled && window.localStorage) {
            try {
                const cacheData = {
                    timestamp: new Date().getTime(),
                    libros: cache.libros,
                    capitulos: cache.capitulos,
                    versiculos: cache.versiculos
                };
                
                localStorage.setItem('bibliaRV1960Cache', JSON.stringify(cacheData));
            } catch (error) {
                console.error('Error al guardar caché de la Biblia:', error);
            }
        }
    }
    
    /**
     * Obtiene la lista de libros de la Biblia
     * @returns {Promise<Array>} Lista de libros
     */
    async function obtenerLibros() {
        // Si ya tenemos los libros en caché, los devolvemos
        if (cache.libros) {
            return Promise.resolve(cache.libros);
        }
        
        // Si no, usamos la información predefinida
        cache.libros = librosInfo;
        guardarCache();
        return Promise.resolve(librosInfo);
    }
    
    /**
     * Obtiene un libro específico por su ID
     * @param {String} libroId - ID del libro
     * @returns {Promise<Object>} Información del libro
     */
    async function obtenerLibro(libroId) {
        const libros = await obtenerLibros();
        const libro = libros.find(l => l.id === libroId);
        
        if (!libro) {
            return Promise.reject(new Error(`Libro no encontrado: ${libroId}`));
        }
        
        return Promise.resolve(libro);
    }
    
    /**
     * Obtiene un capítulo específico de un libro
     * @param {String} libroId - ID del libro
     * @param {Number} capitulo - Número de capítulo
     * @returns {Promise<Object>} Contenido del capítulo
     */
    async function obtenerCapitulo(libroId, capitulo) {
        const cacheKey = `${libroId}-${capitulo}`;
        
        // Verificar si está en caché
        if (cache.capitulos[cacheKey]) {
            return Promise.resolve(cache.capitulos[cacheKey]);
        }
        
        // Verificar si el libro y capítulo son válidos
        const libro = await obtenerLibro(libroId);
        if (capitulo < 1 || capitulo > libro.capitulos) {
            return Promise.reject(new Error(`Capítulo inválido: ${capitulo} para libro ${libro.nombre}`));
        }
        
        // Realizar solicitud a la API
        return new Promise((resolve, reject) => {
            agregarSolicitudACola({
                url: `${config.apiBase}/${libroId}/${capitulo}`,
                onSuccess: (data) => {
                    // Guardar en caché
                    cache.capitulos[cacheKey] = data;
                    guardarCache();
                    resolve(data);
                },
                onError: (error) => {
                    reject(error);
                }
            });
        });
    }
    
    /**
     * Obtiene un versículo específico de un capítulo
     * @param {String} libroId - ID del libro
     * @param {Number} capitulo - Número de capítulo
     * @param {Number} versiculo - Número de versículo
     * @returns {Promise<Object>} Contenido del versículo
     */
    async function obtenerVersiculo(libroId, capitulo, versiculo) {
        const cacheKey = `${libroId}-${capitulo}-${versiculo}`;
        
        // Verificar si está en caché
        if (cache.versiculos[cacheKey]) {
            return Promise.resolve(cache.versiculos[cacheKey]);
        }
        
        // Realizar solicitud a la API
        return new Promise((resolve, reject) => {
            agregarSolicitudACola({
                url: `${config.apiBase}/${libroId}/${capitulo}/${versiculo}`,
                onSuccess: (data) => {
                    // Guardar en caché
                    cache.versiculos[cacheKey] = data;
                    guardarCache();
                    resolve(data);
                },
                onError: (error) => {
                    reject(error);
                }
            });
        });
    }
    
    /**
     * Busca texto en la Biblia
     * @param {String} texto - Texto a buscar
     * @param {Object} opciones - Opciones de búsqueda
     * @returns {Promise<Array>} Resultados de la búsqueda
     */
    async function buscarTexto(texto, opciones = {}) {
        const { 
            testamento = 'todos', // 'AT', 'NT', 'todos'
            libro = null,
            capitulo = null,
            sensibleMayusculas = false,
            palabraCompleta = true,
            maxResultados = 100
        } = opciones;
        
        // Validar parámetros
        if (!texto || texto.trim().length < 3) {
            return Promise.reject(new Error('El texto de búsqueda debe tener al menos 3 caracteres'));
        }
        
        // Preparar texto de búsqueda
        const textoBusqueda = sensibleMayusculas ? texto : texto.toLowerCase();
        
        // Resultados
        const resultados = [];
        
        // Obtener libros a buscar
        const libros = await obtenerLibros();
        const librosFiltrados = libros.filter(l => {
            if (libro && l.id !== libro) return false;
            if (testamento !== 'todos' && l.testamento !== testamento) return false;
            return true;
        });
        
        // Función para verificar coincidencia
        const coincide = (textoVersiculo, textoBusqueda, palabraCompleta) => {
            if (!sensibleMayusculas) {
                textoVersiculo = textoVersiculo.toLowerCase();
            }
            
            if (palabraCompleta) {
                const regex = new RegExp(`\\b${textoBusqueda}\\b`, sensibleMayusculas ? '' : 'i');
                return regex.test(textoVersiculo);
            } else {
                return textoVersiculo.includes(textoBusqueda);
            }
        };
        
        // Buscar en cada libro
        for (const libro of librosFiltrados) {
            // Si se especificó un capítulo, solo buscar en ese
            const capitulosABuscar = capitulo ? [capitulo] : Array.from({ length: libro.capitulos }, (_, i) => i + 1);
            
            for (const numCapitulo of capitulosABuscar) {
                try {
                    const datosCapitulo = await obtenerCapitulo(libro.id, numCapitulo);
                    
                    if (datosCapitulo && datosCapitulo.text && Array.isArray(datosCapitulo.text)) {
                        datosCapitulo.text.forEach((textoVersiculo, index) => {
                            const numVersiculo = index + 1;
                            
                            if (coincide(textoVersiculo, textoBusqueda, palabraCompleta)) {
                                resultados.push({
                                    libro: libro.nombre,
                                    libroId: libro.id,
                                    capitulo: numCapitulo,
                                    versiculo: numVersiculo,
                                    texto: textoVersiculo,
                                    referencia: `${libro.nombre} ${numCapitulo}:${numVersiculo}`
                                });
                            }
                        });
                    }
                    
                    // Limitar resultados
                    if (resultados.length >= maxResultados) {
                        break;
                    }
                } catch (error) {
                    console.error(`Error al buscar en ${libro.nombre} ${numCapitulo}:`, error);
                }
            }
            
            // Limitar resultados
            if (resultados.length >= maxResultados) {
                break;
            }
        }
        
        return Promise.resolve(resultados);
    }
    
    /**
     * Agrega una solicitud a la cola y procesa la cola
     * @param {Object} solicitud - Objeto de solicitud
     */
    function agregarSolicitudACola(solicitud) {
        requestQueue.push(solicitud);
        
        if (!processingQueue) {
            procesarColaSolicitudes();
        }
    }
    
    /**
     * Procesa la cola de solicitudes respetando límites de tasa
     */
    function procesarColaSolicitudes() {
        if (requestQueue.length === 0) {
            processingQueue = false;
            return;
        }
        
        processingQueue = true;
        
        // Procesar hasta el máximo de solicitudes concurrentes
        const solicitudesAProcesar = requestQueue.splice(0, config.maxConcurrentRequests);
        
        // Procesar cada solicitud
        solicitudesAProcesar.forEach(solicitud => {
            fetch(solicitud.url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    solicitud.onSuccess(data);
                })
                .catch(error => {
                    solicitud.onError(error);
                });
        });
        
        // Programar el siguiente lote después del retraso
        setTimeout(() => {
            procesarColaSolicitudes();
        }, config.requestDelay);
    }
    
    /**
     * Renderiza la interfaz principal de la Biblia
     */
    function renderizarInterfazBiblia() {
        const contenedor = document.getElementById('biblia-container');
        if (!contenedor) return;
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Crear estructura básica
        contenedor.innerHTML = `
            <div class="biblia-header flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Biblia Reina Valera 1960</h2>
                <div class="biblia-controles flex space-x-2">
                    <button id="biblia-modo-normal" class="text-sm discord-button-secondary px-3 py-1 rounded active">Normal</button>
                    <button id="biblia-modo-estudio" class="text-sm discord-button-secondary px-3 py-1 rounded">Estudio</button>
                </div>
            </div>
            
            <div class="biblia-navegacion flex flex-wrap gap-2 mb-4">
                <select id="biblia-select-testamento" class="discord-input text-sm rounded px-2 py-1">
                    <option value="todos">Toda la Biblia</option>
                    <option value="AT">Antiguo Testamento</option>
                    <option value="NT">Nuevo Testamento</option>
                </select>
                
                <select id="biblia-select-libro" class="discord-input text-sm rounded px-2 py-1">
                    <option value="">Seleccionar libro...</option>
                </select>
                
                <select id="biblia-select-capitulo" class="discord-input text-sm rounded px-2 py-1" disabled>
                    <option value="">Capítulo...</option>
                </select>
                
                <div class="flex-grow"></div>
                
                <div class="biblia-busqueda flex">
                    <input id="biblia-busqueda-input" type="text" placeholder="Buscar..." class="discord-input text-sm rounded-l px-2 py-1">
                    <button id="biblia-busqueda-btn" class="discord-button-primary text-sm rounded-r px-3 py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="biblia-contenido-container">
                <div id="biblia-modo-normal-contenido" class="biblia-contenido discord-card p-4 rounded-lg">
                    <div id="biblia-texto" class="biblia-texto space-y-2">
                        <p class="text-center text-gray-400">Selecciona un libro y capítulo para comenzar</p>
                    </div>
                </div>
                
                <div id="biblia-modo-estudio-contenido" class="biblia-contenido discord-card p-4 rounded-lg hidden">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="col-span-2">
                            <div id="biblia-texto-estudio" class="biblia-texto space-y-2">
                                <p class="text-center text-gray-400">Selecciona un libro y capítulo para comenzar</p>
                            </div>
                        </div>
                        <div class="col-span-1">
                            <div id="biblia-filtros-panel" class="biblia-filtros-panel">
                                <h3 class="text-lg font-semibold mb-2">Filtros Analíticos</h3>
                                
                                <div class="filtro-card mb-3">
                                    <div class="filtro-header flex justify-between items-center p-2 cursor-pointer">
                                        <span>Filtro Sangre</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <div class="filtro-content p-2 hidden">
                                        <!-- Contenido del filtro Sangre -->
                                    </div>
                                </div>
                                
                                <div class="filtro-card mb-3">
                                    <div class="filtro-header flex justify-between items-center p-2 cursor-pointer">
                                        <span>Filtro Agua</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <div class="filtro-content p-2 hidden">
                                        <!-- Contenido del filtro Agua -->
                                    </div>
                                </div>
                                
                                <div class="filtro-card mb-3">
                                    <div class="filtro-header flex justify-between items-center p-2 cursor-pointer">
                                        <span>Estadísticas</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <div class="filtro-content p-2 hidden">
                                        <div id="biblia-estadisticas" class="biblia-estadisticas">
                                            <!-- Contenido de estadísticas -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="biblia-resultados-busqueda" class="biblia-resultados discord-card p-4 rounded-lg mt-4 hidden">
                    <h3 class="text-lg font-semibold mb-2">Resultados de búsqueda</h3>
                    <div id="biblia-lista-resultados" class="biblia-lista-resultados space-y-2">
                        <!-- Resultados de búsqueda -->
                    </div>
                </div>
            </div>
        `;
        
        // Poblar selector de libros
        poblarSelectorLibros();
        
        // Configurar eventos
        configurarEventosBiblia();
    }
    
    /**
     * Pobla el selector de libros con los libros de la Biblia
     */
    async function poblarSelectorLibros() {
        const selectorLibro = document.getElementById('biblia-select-libro');
        if (!selectorLibro) return;
        
        const libros = await obtenerLibros();
        const selectorTestamento = document.getElementById('biblia-select-testamento');
        const testamentoSeleccionado = selectorTestamento ? selectorTestamento.value : 'todos';
        
        // Limpiar opciones actuales
        selectorLibro.innerHTML = '<option value="">Seleccionar libro...</option>';
        
        // Filtrar libros por testamento si es necesario
        const librosFiltrados = libros.filter(libro => 
            testamentoSeleccionado === 'todos' || libro.testamento === testamentoSeleccionado
        );
        
        // Añadir opciones
        librosFiltrados.forEach(libro => {
            const option = document.createElement('option');
            option.value = libro.id;
            option.textContent = libro.nombre;
            selectorLibro.appendChild(option);
        });
    }
    
    /**
     * Pobla el selector de capítulos para un libro específico
     * @param {String} libroId - ID del libro seleccionado
     */
    async function poblarSelectorCapitulos(libroId) {
        const selectorCapitulo = document.getElementById('biblia-select-capitulo');
        if (!selectorCapitulo) return;
        
        // Limpiar opciones actuales
        selectorCapitulo.innerHTML = '<option value="">Capítulo...</option>';
        
        if (!libroId) {
            selectorCapitulo.disabled = true;
            return;
        }
        
        try {
            const libro = await obtenerLibro(libroId);
            
            // Añadir opciones de capítulos
            for (let i = 1; i <= libro.capitulos; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                selectorCapitulo.appendChild(option);
            }
            
            selectorCapitulo.disabled = false;
        } catch (error) {
            console.error('Error al poblar selector de capítulos:', error);
            selectorCapitulo.disabled = true;
        }
    }
    
    /**
     * Configura los eventos de la interfaz de la Biblia
     */
    function configurarEventosBiblia() {
        // Evento para cambio de testamento
        const selectorTestamento = document.getElementById('biblia-select-testamento');
        if (selectorTestamento) {
            selectorTestamento.addEventListener('change', () => {
                poblarSelectorLibros();
                
                // Resetear selección de libro y capítulo
                const selectorLibro = document.getElementById('biblia-select-libro');
                if (selectorLibro) {
                    selectorLibro.value = '';
                }
                
                const selectorCapitulo = document.getElementById('biblia-select-capitulo');
                if (selectorCapitulo) {
                    selectorCapitulo.value = '';
                    selectorCapitulo.disabled = true;
                }
            });
        }
        
        // Evento para cambio de libro
        const selectorLibro = document.getElementById('biblia-select-libro');
        if (selectorLibro) {
            selectorLibro.addEventListener('change', () => {
                poblarSelectorCapitulos(selectorLibro.value);
                
                // Resetear selección de capítulo
                const selectorCapitulo = document.getElementById('biblia-select-capitulo');
                if (selectorCapitulo) {
                    selectorCapitulo.value = '';
                }
            });
        }
        
        // Evento para cambio de capítulo
        const selectorCapitulo = document.getElementById('biblia-select-capitulo');
        if (selectorCapitulo) {
            selectorCapitulo.addEventListener('change', () => {
                const libroId = selectorLibro.value;
                const capitulo = parseInt(selectorCapitulo.value);
                
                if (libroId && capitulo) {
                    cargarCapitulo(libroId, capitulo);
                }
            });
        }
        
        // Eventos para cambio de modo
        const botonModoNormal = document.getElementById('biblia-modo-normal');
        const botonModoEstudio = document.getElementById('biblia-modo-estudio');
        const contenidoModoNormal = document.getElementById('biblia-modo-normal-contenido');
        const contenidoModoEstudio = document.getElementById('biblia-modo-estudio-contenido');
        
        if (botonModoNormal && botonModoEstudio && contenidoModoNormal && contenidoModoEstudio) {
            botonModoNormal.addEventListener('click', () => {
                botonModoNormal.classList.add('active');
                botonModoEstudio.classList.remove('active');
                contenidoModoNormal.classList.remove('hidden');
                contenidoModoEstudio.classList.add('hidden');
            });
            
            botonModoEstudio.addEventListener('click', () => {
                botonModoEstudio.classList.add('active');
                botonModoNormal.classList.remove('active');
                contenidoModoEstudio.classList.remove('hidden');
                contenidoModoNormal.classList.add('hidden');
                
                // Actualizar contenido de estudio si hay un capítulo cargado
                const libroId = selectorLibro.value;
                const capitulo = parseInt(selectorCapitulo.value);
                
                if (libroId && capitulo) {
                    cargarCapitulo(libroId, capitulo, true);
                }
            });
        }
        
        // Evento para búsqueda
        const inputBusqueda = document.getElementById('biblia-busqueda-input');
        const botonBusqueda = document.getElementById('biblia-busqueda-btn');
        
        if (inputBusqueda && botonBusqueda) {
            const realizarBusqueda = () => {
                const textoBusqueda = inputBusqueda.value.trim();
                if (textoBusqueda.length >= 3) {
                    const testamento = selectorTestamento ? selectorTestamento.value : 'todos';
                    const libroId = selectorLibro && selectorLibro.value ? selectorLibro.value : null;
                    const capitulo = selectorCapitulo && selectorCapitulo.value ? parseInt(selectorCapitulo.value) : null;
                    
                    buscarEnBiblia(textoBusqueda, { testamento, libro: libroId, capitulo });
                }
            };
            
            botonBusqueda.addEventListener('click', realizarBusqueda);
            
            inputBusqueda.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    realizarBusqueda();
                }
            });
        }
        
        // Eventos para filtros en modo estudio
        document.querySelectorAll('.filtro-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                if (content) {
                    content.classList.toggle('hidden');
                    
                    // Rotar icono
                    const icon = header.querySelector('svg');
                    if (icon) {
                        icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                    }
                }
            });
        });
    }
    
    /**
     * Carga un capítulo de la Biblia en la interfaz
     * @param {String} libroId - ID del libro
     * @param {Number} capitulo - Número de capítulo
     * @param {Boolean} modoEstudio - Si se debe cargar en modo estudio
     */
    async function cargarCapitulo(libroId, capitulo, modoEstudio = false) {
        try {
            // Obtener datos del libro y capítulo
            const libro = await obtenerLibro(libroId);
            const datosCapitulo = await obtenerCapitulo(libroId, capitulo);
            
            // Contenedores de texto
            const contenedorTextoNormal = document.getElementById('biblia-texto');
            const contenedorTextoEstudio = document.getElementById('biblia-texto-estudio');
            
            if (!contenedorTextoNormal && !contenedorTextoEstudio) return;
            
            // Formatear texto
            let htmlCapitulo = `
                <h3 class="text-xl font-semibold mb-4">${libro.nombre} ${capitulo}</h3>
                <div class="space-y-2">
            `;
            
            if (datosCapitulo && datosCapitulo.text && Array.isArray(datosCapitulo.text)) {
                datosCapitulo.text.forEach((texto, index) => {
                    const numVersiculo = index + 1;
                    htmlCapitulo += `
                        <p class="biblia-versiculo" data-libro="${libroId}" data-capitulo="${capitulo}" data-versiculo="${numVersiculo}">
                            <span class="biblia-versiculo-numero font-semibold text-[var(--bg-primary)]">${numVersiculo}</span>
                            <span class="biblia-versiculo-texto">${texto}</span>
                        </p>
                    `;
                });
            } else {
                htmlCapitulo += `<p class="text-center text-gray-400">No se pudo cargar el texto del capítulo</p>`;
            }
            
            htmlCapitulo += `</div>`;
            
            // Actualizar contenido
            if (contenedorTextoNormal) {
                contenedorTextoNormal.innerHTML = htmlCapitulo;
            }
            
            if (contenedorTextoEstudio) {
                contenedorTextoEstudio.innerHTML = htmlCapitulo;
                
                // Si estamos en modo estudio, actualizar estadísticas y filtros
                if (modoEstudio) {
                    actualizarEstadisticasCapitulo(datosCapitulo);
                    aplicarFiltrosCapitulo(datosCapitulo);
                }
            }
            
            // Configurar eventos para versículos
            document.querySelectorAll('.biblia-versiculo').forEach(versiculo => {
                versiculo.addEventListener('click', () => {
                    const libroId = versiculo.dataset.libro;
                    const capitulo = versiculo.dataset.capitulo;
                    const numVersiculo = versiculo.dataset.versiculo;
                    
                    seleccionarVersiculo(libroId, parseInt(capitulo), parseInt(numVersiculo));
                });
            });
            
            // Ocultar resultados de búsqueda si están visibles
            const resultadosBusqueda = document.getElementById('biblia-resultados-busqueda');
            if (resultadosBusqueda) {
                resultadosBusqueda.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error al cargar capítulo:', error);
            
            // Mostrar mensaje de error
            const contenedorTextoNormal = document.getElementById('biblia-texto');
            const contenedorTextoEstudio = document.getElementById('biblia-texto-estudio');
            
            const mensajeError = `
                <div class="text-center text-red-500 p-4">
                    <p>Error al cargar el capítulo: ${error.message}</p>
                    <button id="biblia-reintentar" class="mt-2 px-3 py-1 rounded-lg discord-button-secondary text-sm">Reintentar</button>
                </div>
            `;
            
            if (contenedorTextoNormal) {
                contenedorTextoNormal.innerHTML = mensajeError;
            }
            
            if (contenedorTextoEstudio) {
                contenedorTextoEstudio.innerHTML = mensajeError;
            }
            
            // Configurar evento para reintentar
            const botonReintentar = document.getElementById('biblia-reintentar');
            if (botonReintentar) {
                botonReintentar.addEventListener('click', () => {
                    cargarCapitulo(libroId, capitulo, modoEstudio);
                });
            }
        }
    }
    
    /**
     * Selecciona un versículo específico
     * @param {String} libroId - ID del libro
     * @param {Number} capitulo - Número de capítulo
     * @param {Number} versiculo - Número de versículo
     */
    function seleccionarVersiculo(libroId, capitulo, versiculo) {
        // Deseleccionar versículos previamente seleccionados
        document.querySelectorAll('.biblia-versiculo.seleccionado').forEach(v => {
            v.classList.remove('seleccionado', 'bg-[var(--bg-primary)]/10');
        });
        
        // Seleccionar el versículo actual
        const selector = `.biblia-versiculo[data-libro="${libroId}"][data-capitulo="${capitulo}"][data-versiculo="${versiculo}"]`;
        const versiculoElement = document.querySelector(selector);
        
        if (versiculoElement) {
            versiculoElement.classList.add('seleccionado', 'bg-[var(--bg-primary)]/10');
            versiculoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Si estamos en modo estudio, actualizar panel de análisis
            const modoEstudio = !document.getElementById('biblia-modo-estudio-contenido').classList.contains('hidden');
            if (modoEstudio) {
                analizarVersiculo(libroId, capitulo, versiculo);
            }
        }
    }
    
    /**
     * Analiza un versículo específico en modo estudio
     * @param {String} libroId - ID del libro
     * @param {Number} capitulo - Número de capítulo
     * @param {Number} versiculo - Número de versículo
     */
    async function analizarVersiculo(libroId, capitulo, versiculo) {
        try {
            // Obtener datos del versículo
            const datosVersiculo = await obtenerVersiculo(libroId, capitulo, versiculo);
            
            // Actualizar panel de análisis
            const panelFiltros = document.getElementById('biblia-filtros-panel');
            if (!panelFiltros) return;
            
            // Aquí se implementaría la lógica para actualizar los filtros con el análisis del versículo
            // Por ahora, solo mostramos información básica
            
            // Expandir paneles de filtros si están cerrados
            document.querySelectorAll('.filtro-content.hidden').forEach(content => {
                content.classList.remove('hidden');
                const header = content.previousElementSibling;
                if (header) {
                    const icon = header.querySelector('svg');
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                    }
                }
            });
        } catch (error) {
            console.error('Error al analizar versículo:', error);
        }
    }
    
    /**
     * Actualiza las estadísticas para un capítulo en modo estudio
     * @param {Object} datosCapitulo - Datos del capítulo
     */
    function actualizarEstadisticasCapitulo(datosCapitulo) {
        const contenedorEstadisticas = document.getElementById('biblia-estadisticas');
        if (!contenedorEstadisticas || !datosCapitulo) return;
        
        // Calcular estadísticas básicas
        const totalVersiculos = datosCapitulo.verses || 0;
        const textoCompleto = datosCapitulo.text ? datosCapitulo.text.join(' ') : '';
        const totalPalabras = textoCompleto.split(/\s+/).filter(p => p.length > 0).length;
        const totalCaracteres = textoCompleto.length;
        
        // Palabras más frecuentes (excluyendo palabras comunes)
        const palabrasComunes = ['el', 'la', 'los', 'las', 'un', 'una', 'y', 'a', 'de', 'en', 'que', 'por', 'con', 'se', 'su', 'sus', 'para'];
        const palabras = textoCompleto.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(p => p.length > 3 && !palabrasComunes.includes(p));
        
        const frecuenciaPalabras = {};
        palabras.forEach(palabra => {
            frecuenciaPalabras[palabra] = (frecuenciaPalabras[palabra] || 0) + 1;
        });
        
        const palabrasFrecuentes = Object.entries(frecuenciaPalabras)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        // Actualizar contenido
        contenedorEstadisticas.innerHTML = `
            <div class="space-y-2 text-sm">
                <p><strong>Versículos:</strong> ${totalVersiculos}</p>
                <p><strong>Palabras:</strong> ${totalPalabras}</p>
                <p><strong>Caracteres:</strong> ${totalCaracteres}</p>
                
                <div class="mt-3">
                    <p class="font-semibold">Palabras más frecuentes:</p>
                    <ul class="list-disc list-inside">
                        ${palabrasFrecuentes.map(([palabra, frecuencia]) => 
                            `<li>${palabra} (${frecuencia})</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    /**
     * Aplica filtros analíticos a un capítulo en modo estudio
     * @param {Object} datosCapitulo - Datos del capítulo
     */
    function aplicarFiltrosCapitulo(datosCapitulo) {
        // Aquí se implementaría la lógica para aplicar los filtros de Sangre y Agua
        // Esta función sería llamada cuando se carga un capítulo en modo estudio
        
        // Por ahora, solo actualizamos los contenedores de filtros con mensajes de placeholder
        const filtroSangreContent = document.querySelector('.filtro-header:nth-child(1) + .filtro-content');
        if (filtroSangreContent) {
            filtroSangreContent.innerHTML = `
                <p class="text-sm text-gray-400">Selecciona categorías del filtro Sangre para aplicar al texto actual.</p>
                <div class="mt-2">
                    <button id="aplicar-filtro-sangre" class="w-full text-xs discord-button-secondary px-2 py-1 rounded">
                        Aplicar Filtro Sangre
                    </button>
                </div>
            `;
        }
        
        const filtroAguaContent = document.querySelector('.filtro-header:nth-child(1) + .filtro-content + .filtro-header + .filtro-content');
        if (filtroAguaContent) {
            filtroAguaContent.innerHTML = `
                <p class="text-sm text-gray-400">Selecciona elementos del filtro Agua para aplicar al texto actual.</p>
                <div class="mt-2">
                    <button id="aplicar-filtro-agua" class="w-full text-xs discord-button-secondary px-2 py-1 rounded">
                        Aplicar Filtro Agua
                    </button>
                </div>
            `;
        }
        
        // Configurar eventos para botones de aplicar filtros
        const botonFiltroSangre = document.getElementById('aplicar-filtro-sangre');
        if (botonFiltroSangre) {
            botonFiltroSangre.addEventListener('click', () => {
                // Aquí se implementaría la lógica para aplicar el filtro Sangre
                console.log('Aplicando filtro Sangre...');
            });
        }
        
        const botonFiltroAgua = document.getElementById('aplicar-filtro-agua');
        if (botonFiltroAgua) {
            botonFiltroAgua.addEventListener('click', () => {
                // Aquí se implementaría la lógica para aplicar el filtro Agua
                console.log('Aplicando filtro Agua...');
            });
        }
    }
    
    /**
     * Realiza una búsqueda en la Biblia y muestra los resultados
     * @param {String} texto - Texto a buscar
     * @param {Object} opciones - Opciones de búsqueda
     */
    async function buscarEnBiblia(texto, opciones = {}) {
        const contenedorResultados = document.getElementById('biblia-resultados-busqueda');
        const listaResultados = document.getElementById('biblia-lista-resultados');
        
        if (!contenedorResultados || !listaResultados) return;
        
        // Mostrar indicador de carga
        contenedorResultados.classList.remove('hidden');
        listaResultados.innerHTML = `
            <div class="text-center p-4">
                <p>Buscando "${texto}"...</p>
                <div class="loader mt-2 mx-auto w-6 h-6 border-2 border-t-2 border-[var(--bg-primary)] rounded-full animate-spin"></div>
            </div>
        `;
        
        try {
            const resultados = await buscarTexto(texto, opciones);
            
            if (resultados.length === 0) {
                listaResultados.innerHTML = `
                    <div class="text-center p-4">
                        <p>No se encontraron resultados para "${texto}"</p>
                    </div>
                `;
                return;
            }
            
            // Mostrar resultados
            listaResultados.innerHTML = `
                <p class="mb-3">Se encontraron ${resultados.length} resultados para "${texto}":</p>
                <div class="space-y-3">
                    ${resultados.map((resultado, index) => `
                        <div class="resultado-item p-3 bg-[var(--bg-input)]/30 rounded">
                            <p class="font-semibold text-[var(--bg-primary)]">${resultado.referencia}</p>
                            <p class="mt-1">${resaltarTexto(resultado.texto, texto)}</p>
                            <button class="ir-a-resultado mt-2 text-xs discord-button-secondary px-2 py-1 rounded" 
                                data-libro="${resultado.libroId}" 
                                data-capitulo="${resultado.capitulo}" 
                                data-versiculo="${resultado.versiculo}">
                                Ir al versículo
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Configurar eventos para botones de ir a resultado
            document.querySelectorAll('.ir-a-resultado').forEach(boton => {
                boton.addEventListener('click', () => {
                    const libroId = boton.dataset.libro;
                    const capitulo = parseInt(boton.dataset.capitulo);
                    const versiculo = parseInt(boton.dataset.versiculo);
                    
                    // Actualizar selectores
                    const selectorLibro = document.getElementById('biblia-select-libro');
                    if (selectorLibro) {
                        selectorLibro.value = libroId;
                        poblarSelectorCapitulos(libroId).then(() => {
                            const selectorCapitulo = document.getElementById('biblia-select-capitulo');
                            if (selectorCapitulo) {
                                selectorCapitulo.value = capitulo;
                                
                                // Cargar capítulo y seleccionar versículo
                                cargarCapitulo(libroId, capitulo).then(() => {
                                    seleccionarVersiculo(libroId, capitulo, versiculo);
                                });
                            }
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Error al buscar en la Biblia:', error);
            
            listaResultados.innerHTML = `
                <div class="text-center text-red-500 p-4">
                    <p>Error al realizar la búsqueda: ${error.message}</p>
                    <button id="biblia-reintentar-busqueda" class="mt-2 px-3 py-1 rounded-lg discord-button-secondary text-sm">Reintentar</button>
                </div>
            `;
            
            // Configurar evento para reintentar
            const botonReintentar = document.getElementById('biblia-reintentar-busqueda');
            if (botonReintentar) {
                botonReintentar.addEventListener('click', () => {
                    buscarEnBiblia(texto, opciones);
                });
            }
        }
    }
    
    /**
     * Resalta el texto de búsqueda en un resultado
     * @param {String} texto - Texto completo
     * @param {String} busqueda - Texto a resaltar
     * @returns {String} Texto con resaltado HTML
     */
    function resaltarTexto(texto, busqueda) {
        if (!busqueda || busqueda.trim().length === 0) return texto;
        
        const regex = new RegExp(`(${busqueda})`, 'gi');
        return texto.replace(regex, '<span class="bg-[var(--bg-primary)]/20 text-[var(--text-primary)] font-semibold">$1</span>');
    }
    
    // API pública del módulo
    return {
        inicializar,
        obtenerLibros,
        obtenerLibro,
        obtenerCapitulo,
        obtenerVersiculo,
        buscarTexto,
        cargarCapitulo,
        seleccionarVersiculo,
        limpiarCache
    };
})();

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando módulo de la Biblia Reina Valera 1960...');
    
    // Inicializar módulo de la Biblia
    if (typeof BibliaRV1960 !== 'undefined') {
        BibliaRV1960.inicializar({
            cacheEnabled: true
        });
    }
});
