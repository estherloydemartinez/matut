/**
 * Funciones Analíticas y Estadísticas para Filtros de Sangre y Agua
 * Aplicación de Formación Bíblica - Versión Mejorada
 */

// Módulo principal para análisis de datos
const AnalisisAvanzado = (function() {
    // Configuración global
    const config = {
        modoDebug: false,
        nivelPrecision: 2,
        umbralCorrelacion: 0.7,
        maxElementosVisualizacion: 100
    };

    // Estructura de datos para almacenar resultados de análisis
    let datosAnalisis = {
        sangre: {
            categorias: {},
            frecuencias: {},
            correlaciones: {},
            patrones: []
        },
        agua: {
            elementos: {},
            conexiones: {},
            flujos: {},
            patrones: []
        },
        estadisticas: {
            global: {},
            porLibro: {},
            porCategoria: {},
            temporal: {}
        }
    };

    /**
     * Análisis de frecuencia de términos y categorías
     * @param {Object} texto - Texto a analizar
     * @param {Array} categorias - Categorías para clasificación
     * @returns {Object} Resultados del análisis de frecuencia
     */
    function analizarFrecuencia(texto, categorias) {
        if (!texto || !categorias) return null;
        
        const resultado = {
            totalPalabras: 0,
            frecuenciaCategorias: {},
            densidadPorParrafo: [],
            terminosDestacados: []
        };
        
        // Implementación del análisis de frecuencia
        const palabras = texto.toLowerCase().match(/\b\w+\b/g) || [];
        resultado.totalPalabras = palabras.length;
        
        // Análisis por categorías
        categorias.forEach(categoria => {
            const terminos = categoria.terminos || [];
            let contador = 0;
            
            terminos.forEach(termino => {
                const regex = new RegExp(`\\b${termino}\\b`, 'gi');
                const coincidencias = (texto.match(regex) || []).length;
                contador += coincidencias;
            });
            
            resultado.frecuenciaCategorias[categoria.id] = {
                total: contador,
                porcentaje: (contador / resultado.totalPalabras * 100).toFixed(config.nivelPrecision)
            };
        });
        
        // Análisis de densidad por párrafo
        const parrafos = texto.split(/\n\n+/);
        resultado.densidadPorParrafo = parrafos.map(parrafo => {
            const totalPalabrasParrafo = parrafo.match(/\b\w+\b/g)?.length || 0;
            const densidadCategorias = {};
            
            categorias.forEach(categoria => {
                const terminos = categoria.terminos || [];
                let contadorParrafo = 0;
                
                terminos.forEach(termino => {
                    const regex = new RegExp(`\\b${termino}\\b`, 'gi');
                    contadorParrafo += (parrafo.match(regex) || []).length;
                });
                
                densidadCategorias[categoria.id] = totalPalabrasParrafo ? 
                    (contadorParrafo / totalPalabrasParrafo * 100).toFixed(config.nivelPrecision) : 0;
            });
            
            return {
                longitud: totalPalabrasParrafo,
                densidad: densidadCategorias
            };
        });
        
        return resultado;
    }

    /**
     * Análisis de correlaciones entre categorías
     * @param {Object} datosFrecuencia - Datos de frecuencia previamente calculados
     * @param {Array} categorias - Categorías para análisis de correlación
     * @returns {Object} Matriz de correlación entre categorías
     */
    function analizarCorrelaciones(datosFrecuencia, categorias) {
        if (!datosFrecuencia || !categorias) return null;
        
        const matrizCorrelacion = {};
        const idsCategorias = categorias.map(cat => cat.id);
        
        // Crear matriz de correlación vacía
        idsCategorias.forEach(id1 => {
            matrizCorrelacion[id1] = {};
            idsCategorias.forEach(id2 => {
                matrizCorrelacion[id1][id2] = id1 === id2 ? 1 : 0;
            });
        });
        
        // Calcular correlaciones basadas en co-ocurrencia en párrafos
        const { densidadPorParrafo } = datosFrecuencia;
        
        idsCategorias.forEach(id1 => {
            idsCategorias.forEach(id2 => {
                if (id1 === id2) return;
                
                let sumaProductos = 0;
                let sumaCuadrados1 = 0;
                let sumaCuadrados2 = 0;
                
                densidadPorParrafo.forEach(parrafo => {
                    const valor1 = parseFloat(parrafo.densidad[id1]) || 0;
                    const valor2 = parseFloat(parrafo.densidad[id2]) || 0;
                    
                    sumaProductos += valor1 * valor2;
                    sumaCuadrados1 += valor1 * valor1;
                    sumaCuadrados2 += valor2 * valor2;
                });
                
                // Coeficiente de correlación de Pearson
                const denominador = Math.sqrt(sumaCuadrados1 * sumaCuadrados2);
                const correlacion = denominador ? sumaProductos / denominador : 0;
                
                matrizCorrelacion[id1][id2] = parseFloat(correlacion.toFixed(config.nivelPrecision));
            });
        });
        
        return matrizCorrelacion;
    }

    /**
     * Detección de patrones en el texto utilizando algoritmos avanzados
     * @param {Object} texto - Texto a analizar
     * @param {Object} opciones - Opciones de configuración para detección
     * @returns {Array} Patrones detectados
     */
    function detectarPatrones(texto, opciones = {}) {
        const patrones = [];
        const { 
            longitudMinima = 3, 
            umbralFrecuencia = 2,
            maxPatrones = 20
        } = opciones;
        
        if (!texto) return patrones;
        
        // Preprocesamiento del texto
        const palabras = texto.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(p => p.length > 2);
        
        // Encontrar secuencias repetidas (n-gramas)
        const ngramas = {};
        
        // Generar n-gramas de diferentes longitudes
        for (let n = longitudMinima; n <= Math.min(7, palabras.length / 3); n++) {
            for (let i = 0; i <= palabras.length - n; i++) {
                const ngrama = palabras.slice(i, i + n).join(' ');
                ngramas[ngrama] = (ngramas[ngrama] || 0) + 1;
            }
        }
        
        // Filtrar y ordenar patrones por frecuencia
        Object.entries(ngramas)
            .filter(([_, frecuencia]) => frecuencia >= umbralFrecuencia)
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxPatrones)
            .forEach(([patron, frecuencia]) => {
                patrones.push({
                    texto: patron,
                    frecuencia,
                    palabras: patron.split(' ').length,
                    importancia: calcularImportancia(patron, frecuencia, palabras.length)
                });
            });
        
        return patrones;
    }
    
    /**
     * Calcula la importancia de un patrón basado en frecuencia y longitud
     * @private
     */
    function calcularImportancia(patron, frecuencia, totalPalabras) {
        const longitudPatron = patron.split(' ').length;
        // Fórmula que favorece patrones más largos y frecuentes
        const importancia = (frecuencia * Math.log2(longitudPatron + 1)) / Math.log2(totalPalabras);
        return parseFloat(importancia.toFixed(config.nivelPrecision));
    }

    /**
     * Análisis de flujo para el sistema de Agua
     * @param {Array} elementos - Elementos del sistema
     * @param {Array} conexiones - Conexiones entre elementos
     * @returns {Object} Análisis de flujo y métricas
     */
    function analizarFlujo(elementos, conexiones) {
        if (!elementos || !conexiones) return null;
        
        const resultado = {
            nodos: {},
            flujos: {},
            metricas: {
                densidadRed: 0,
                centralidad: {},
                caminosCriticos: []
            }
        };
        
        // Construir grafo de conexiones
        const grafo = {};
        elementos.forEach(elem => {
            grafo[elem.id] = {
                datos: elem,
                conexionesEntrantes: [],
                conexionesSalientes: []
            };
            resultado.nodos[elem.id] = {
                tipo: elem.tipo,
                nombre: elem.nombre,
                peso: 0
            };
        });
        
        // Poblar conexiones
        conexiones.forEach(conn => {
            if (grafo[conn.origen] && grafo[conn.destino]) {
                grafo[conn.origen].conexionesSalientes.push(conn);
                grafo[conn.destino].conexionesEntrantes.push(conn);
                
                // Registrar flujo
                const idFlujo = `${conn.origen}-${conn.destino}`;
                resultado.flujos[idFlujo] = {
                    origen: conn.origen,
                    destino: conn.destino,
                    tipo: conn.tipo,
                    peso: conn.peso || 1
                };
            }
        });
        
        // Calcular métricas de red
        const totalConexionesPosibles = elementos.length * (elementos.length - 1);
        resultado.metricas.densidadRed = totalConexionesPosibles ? 
            conexiones.length / totalConexionesPosibles : 0;
        
        // Calcular centralidad de grado para cada nodo
        elementos.forEach(elem => {
            const nodo = grafo[elem.id];
            const gradoEntrante = nodo.conexionesEntrantes.length;
            const gradoSaliente = nodo.conexionesSalientes.length;
            
            resultado.nodos[elem.id].peso = gradoEntrante + gradoSaliente;
            resultado.metricas.centralidad[elem.id] = {
                entrante: gradoEntrante,
                saliente: gradoSaliente,
                total: gradoEntrante + gradoSaliente
            };
        });
        
        // Identificar caminos críticos (implementación simplificada)
        // En una implementación completa, se usaría un algoritmo como Floyd-Warshall
        
        return resultado;
    }

    /**
     * Genera datos para visualizaciones
     * @param {Object} datosAnalisis - Datos de análisis previos
     * @param {String} tipoVisualizacion - Tipo de visualización a generar
     * @returns {Object} Datos formateados para visualización
     */
    function generarDatosVisualizacion(datosAnalisis, tipoVisualizacion) {
        if (!datosAnalisis) return null;
        
        let resultado = null;
        
        switch (tipoVisualizacion) {
            case 'mapaCalor':
                resultado = generarDatosMapa(datosAnalisis);
                break;
            case 'red':
                resultado = generarDatosRed(datosAnalisis);
                break;
            case 'barras':
                resultado = generarDatosBarras(datosAnalisis);
                break;
            case 'linea':
                resultado = generarDatosLinea(datosAnalisis);
                break;
            case 'radar':
                resultado = generarDatosRadar(datosAnalisis);
                break;
            default:
                resultado = { error: 'Tipo de visualización no soportado' };
        }
        
        return resultado;
    }
    
    // Funciones auxiliares para generación de datos de visualización
    function generarDatosMapa(datos) {
        // Implementación para mapa de calor
        return {
            tipo: 'mapaCalor',
            datos: {
                etiquetasX: Object.keys(datos.correlaciones || {}),
                etiquetasY: Object.keys(datos.correlaciones || {}),
                valores: Object.entries(datos.correlaciones || {}).map(([key, value]) => {
                    return Object.entries(value).map(([k, v]) => v);
                })
            }
        };
    }
    
    function generarDatosRed(datos) {
        // Implementación para visualización de red
        const nodos = [];
        const enlaces = [];
        
        // Convertir nodos
        Object.entries(datos.nodos || {}).forEach(([id, nodo]) => {
            nodos.push({
                id,
                label: nodo.nombre || id,
                value: nodo.peso || 1,
                group: nodo.tipo || 'default'
            });
        });
        
        // Convertir enlaces
        Object.entries(datos.flujos || {}).forEach(([id, flujo]) => {
            enlaces.push({
                from: flujo.origen,
                to: flujo.destino,
                value: flujo.peso || 1,
                title: flujo.tipo || 'conexión'
            });
        });
        
        return {
            tipo: 'red',
            datos: {
                nodos,
                enlaces
            }
        };
    }
    
    function generarDatosBarras(datos) {
        // Implementación para gráfico de barras
        const categorias = Object.keys(datos.frecuenciaCategorias || {});
        const valores = categorias.map(cat => 
            parseFloat(datos.frecuenciaCategorias[cat]?.porcentaje || 0)
        );
        
        return {
            tipo: 'barras',
            datos: {
                etiquetas: categorias,
                series: [{
                    nombre: 'Frecuencia (%)',
                    datos: valores
                }]
            }
        };
    }
    
    function generarDatosLinea(datos) {
        // Implementación para gráfico de línea (temporal)
        return {
            tipo: 'linea',
            datos: {
                etiquetas: datos.temporal?.etiquetas || [],
                series: datos.temporal?.series || []
            }
        };
    }
    
    function generarDatosRadar(datos) {
        // Implementación para gráfico de radar
        const categorias = Object.keys(datos.metricas?.centralidad || {});
        const valores = categorias.map(cat => 
            datos.metricas?.centralidad[cat]?.total || 0
        );
        
        return {
            tipo: 'radar',
            datos: {
                etiquetas: categorias,
                series: [{
                    nombre: 'Centralidad',
                    datos: valores
                }]
            }
        };
    }

    // API pública del módulo
    return {
        // Métodos principales
        analizarFrecuencia,
        analizarCorrelaciones,
        detectarPatrones,
        analizarFlujo,
        generarDatosVisualizacion,
        
        // Acceso a datos
        getDatosAnalisis: () => JSON.parse(JSON.stringify(datosAnalisis)),
        setDatosAnalisis: (datos) => {
            datosAnalisis = JSON.parse(JSON.stringify(datos));
        },
        
        // Configuración
        getConfig: () => JSON.parse(JSON.stringify(config)),
        setConfig: (nuevaConfig) => {
            Object.assign(config, nuevaConfig);
        }
    };
})();

// Módulo para visualizaciones
const VisualizacionAvanzada = (function() {
    // Configuración de visualización
    const configVis = {
        colores: [
            '#5865f2', '#4752c4', '#43b581', '#f04747', '#faa61a',
            '#747f8d', '#2e3136', '#9b84ee', '#eb459e', '#4f545c'
        ],
        temaOscuro: true,
        animaciones: true,
        responsive: true
    };
    
    // Referencias a elementos DOM
    let contenedores = {};
    
    /**
     * Inicializa el módulo de visualización
     * @param {Object} config - Configuración personalizada
     */
    function inicializar(config = {}) {
        Object.assign(configVis, config);
        
        // Detectar contenedores en el DOM
        contenedores = {
            sangre: document.getElementById('vis-sangre-container'),
            agua: document.getElementById('vis-agua-container'),
            estadisticas: document.getElementById('vis-estadisticas-container')
        };
        
        // Aplicar tema
        aplicarTema();
    }
    
    /**
     * Aplica el tema de visualización (claro/oscuro)
     */
    function aplicarTema() {
        const estiloBase = {
            fontFamily: "'Inter', sans-serif",
            backgroundColor: configVis.temaOscuro ? '#36393f' : '#ffffff',
            color: configVis.temaOscuro ? '#ffffff' : '#2f3136',
            borderColor: configVis.temaOscuro ? '#4f545c' : '#e3e5e8'
        };
        
        // Aplicar estilos a contenedores
        Object.values(contenedores).forEach(contenedor => {
            if (!contenedor) return;
            
            Object.entries(estiloBase).forEach(([prop, valor]) => {
                contenedor.style[prop] = valor;
            });
        });
    }
    
    /**
     * Crea una visualización de mapa de calor
     * @param {String} contenedorId - ID del contenedor
     * @param {Object} datos - Datos para la visualización
     * @param {Object} opciones - Opciones de configuración
     */
    function crearMapaCalor(contenedorId, datos, opciones = {}) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor || !datos) return;
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Crear elemento canvas para el mapa de calor
        const canvas = document.createElement('canvas');
        canvas.width = contenedor.clientWidth;
        canvas.height = contenedor.clientHeight;
        contenedor.appendChild(canvas);
        
        // Aquí se implementaría la lógica para dibujar el mapa de calor
        // Usando una biblioteca como Chart.js o D3.js
        
        // Ejemplo de código para Chart.js:
        /*
        new Chart(canvas, {
            type: 'heatmap',
            data: {
                labels: datos.etiquetasY,
                datasets: datos.valores.map((fila, i) => ({
                    label: datos.etiquetasX[i],
                    data: fila,
                    backgroundColor: generarEscalaColores()
                }))
            },
            options: {
                responsive: configVis.responsive,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: configVis.temaOscuro ? '#ffffff' : '#2f3136'
                        }
                    },
                    title: {
                        display: true,
                        text: opciones.titulo || 'Mapa de Calor',
                        color: configVis.temaOscuro ? '#ffffff' : '#2f3136'
                    }
                }
            }
        });
        */
    }
    
    /**
     * Crea una visualización de red
     * @param {String} contenedorId - ID del contenedor
     * @param {Object} datos - Datos para la visualización
     * @param {Object} opciones - Opciones de configuración
     */
    function crearVisualizacionRed(contenedorId, datos, opciones = {}) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor || !datos) return;
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Aquí se implementaría la lógica para crear la visualización de red
        // Usando una biblioteca como vis.js o D3.js
        
        // Ejemplo de código para vis.js:
        /*
        const opciones = {
            nodes: {
                shape: 'dot',
                scaling: {
                    min: 10,
                    max: 30,
                    label: {
                        enabled: true,
                        min: 14,
                        max: 30
                    }
                },
                font: {
                    size: 12,
                    face: 'Inter',
                    color: configVis.temaOscuro ? '#ffffff' : '#2f3136'
                }
            },
            edges: {
                width: 0.15,
                color: { inherit: 'from' },
                smooth: {
                    type: 'continuous'
                }
            },
            physics: {
                stabilization: false,
                barnesHut: {
                    gravitationalConstant: -80000,
                    springConstant: 0.001,
                    springLength: 200
                }
            },
            interaction: {
                tooltipDelay: 200,
                hideEdgesOnDrag: true
            }
        };
        
        const network = new vis.Network(contenedor, datos, opciones);
        */
    }
    
    /**
     * Crea un gráfico de barras
     * @param {String} contenedorId - ID del contenedor
     * @param {Object} datos - Datos para la visualización
     * @param {Object} opciones - Opciones de configuración
     */
    function crearGraficoBarras(contenedorId, datos, opciones = {}) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor || !datos) return;
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Crear elemento canvas para el gráfico
        const canvas = document.createElement('canvas');
        canvas.width = contenedor.clientWidth;
        canvas.height = contenedor.clientHeight;
        contenedor.appendChild(canvas);
        
        // Aquí se implementaría la lógica para dibujar el gráfico de barras
        // Usando una biblioteca como Chart.js
        
        // Ejemplo de código para Chart.js:
        /*
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: datos.etiquetas,
                datasets: datos.series.map((serie, i) => ({
                    label: serie.nombre,
                    data: serie.datos,
                    backgroundColor: configVis.colores[i % configVis.colores.length],
                    borderColor: configVis.temaOscuro ? '#36393f' : '#ffffff',
                    borderWidth: 1
                }))
            },
            options: {
                responsive: configVis.responsive,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: configVis.temaOscuro ? '#4f545c' : '#e3e5e8'
                        },
                        ticks: {
                            color: configVis.temaOscuro ? '#b9bbbe' : '#4f545c'
                        }
                    },
                    x: {
                        grid: {
                            color: configVis.temaOscuro ? '#4f545c' : '#e3e5e8'
                        },
                        ticks: {
                            color: configVis.temaOscuro ? '#b9bbbe' : '#4f545c'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: configVis.temaOscuro ? '#ffffff' : '#2f3136'
                        }
                    },
                    title: {
                        display: true,
                        text: opciones.titulo || 'Gráfico de Barras',
                        color: configVis.temaOscuro ? '#ffffff' : '#2f3136'
                    }
                },
                animation: configVis.animaciones ? {
                    duration: 1000,
                    easing: 'easeOutQuart'
                } : false
            }
        });
        */
    }
    
    /**
     * Genera una escala de colores para visualizaciones
     * @param {Number} pasos - Número de pasos en la escala
     * @returns {Array} Array de colores en formato hexadecimal
     */
    function generarEscalaColores(pasos = 10) {
        const colores = [];
        
        // Generar escala de colores
        for (let i = 0; i < pasos; i++) {
            const indice = Math.floor(i * configVis.colores.length / pasos);
            colores.push(configVis.colores[indice]);
        }
        
        return colores;
    }
    
    // API pública del módulo
    return {
        inicializar,
        crearMapaCalor,
        crearVisualizacionRed,
        crearGraficoBarras,
        
        // Configuración
        getConfig: () => JSON.parse(JSON.stringify(configVis)),
        setConfig: (nuevaConfig) => {
            Object.assign(configVis, nuevaConfig);
            aplicarTema();
        }
    };
})();

// Módulo para el sistema de filtros de Sangre
const FiltroSangre = (function() {
    // Estado interno
    let estado = {
        categorias: [],
        seleccionadas: [],
        resultados: null,
        modo: 'basico' // 'basico' o 'avanzado'
    };
    
    // Configuración
    const config = {
        maxCategoriasSimultaneas: 5,
        colorPrimario: '#f04747', // Rojo para sangre
        colorSecundario: '#eb459e',
        colorTerciario: '#9b84ee'
    };
    
    /**
     * Inicializa el módulo de filtro de sangre
     * @param {Array} categorias - Categorías iniciales
     * @param {Object} opciones - Opciones de configuración
     */
    function inicializar(categorias = [], opciones = {}) {
        // Actualizar configuración
        Object.assign(config, opciones);
        
        // Establecer categorías iniciales
        estado.categorias = categorias.map(cat => ({
            ...cat,
            activa: false,
            expandida: false
        }));
        
        // Renderizar interfaz inicial
        renderizarInterfaz();
        
        // Configurar eventos
        configurarEventos();
    }
    
    /**
     * Renderiza la interfaz del filtro de sangre
     */
    function renderizarInterfaz() {
        const contenedor = document.getElementById('filtro-sangre-container');
        if (!contenedor) return;
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Crear encabezado
        const header = document.createElement('div');
        header.className = 'filter-header flex justify-between items-center';
        header.innerHTML = `
            <h3 class="font-medium flex items-center">
                <span class="mr-2">Sangre</span>
                <span class="text-xs bg-[${config.colorPrimario}] px-2 py-0.5 rounded-full">
                    ${estado.seleccionadas.length}/${estado.categorias.length}
                </span>
            </h3>
            <div class="flex space-x-2">
                <button id="sangre-modo-btn" class="text-sm discord-button-secondary px-2 py-1 rounded">
                    ${estado.modo === 'basico' ? 'Modo Básico' : 'Modo Avanzado'}
                </button>
                <button id="sangre-expandir-btn" class="text-sm discord-button-secondary px-2 py-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
            </div>
        `;
        contenedor.appendChild(header);
        
        // Crear contenido
        const content = document.createElement('div');
        content.className = 'filter-content';
        content.id = 'sangre-filter-content';
        
        // Renderizar categorías
        if (estado.categorias.length > 0) {
            const categoriasHTML = estado.categorias.map((cat, index) => `
                <div class="categoria-item mb-2 last:mb-0">
                    <div class="flex items-center">
                        <input type="checkbox" id="sangre-cat-${index}" 
                            class="form-checkbox h-4 w-4 text-[${config.colorPrimario}] bg-gray-700 border-gray-600 rounded focus:ring-[${config.colorPrimario}]"
                            ${cat.activa ? 'checked' : ''}>
                        <label for="sangre-cat-${index}" class="ml-2 block text-sm">
                            ${cat.nombre}
                        </label>
                        <button class="expandir-subcategorias ml-auto text-xs discord-button-secondary px-1 rounded"
                            data-index="${index}">
                            ${cat.expandida ? '−' : '+'}
                        </button>
                    </div>
                    
                    ${cat.expandida && cat.subcategorias ? `
                        <div class="subcategorias ml-6 mt-2 space-y-1">
                            ${cat.subcategorias.map((subcat, subIndex) => `
                                <div class="flex items-center">
                                    <input type="checkbox" id="sangre-subcat-${index}-${subIndex}" 
                                        class="form-checkbox h-3 w-3 text-[${config.colorSecundario}] bg-gray-700 border-gray-600 rounded focus:ring-[${config.colorSecundario}]"
                                        ${subcat.activa ? 'checked' : ''}>
                                    <label for="sangre-subcat-${index}-${subIndex}" class="ml-2 block text-xs">
                                        ${subcat.nombre}
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('');
            
            content.innerHTML = `
                <div class="categorias-container space-y-2">
                    ${categoriasHTML}
                </div>
            `;
            
            // Añadir sección de análisis en modo avanzado
            if (estado.modo === 'avanzado') {
                const analisisHTML = `
                    <div class="analisis-container mt-4 pt-4 border-t border-gray-700">
                        <h4 class="text-sm font-medium mb-2">Análisis Avanzado</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <button id="sangre-analisis-frecuencia" class="text-xs discord-button-secondary px-2 py-1 rounded">
                                Frecuencia
                            </button>
                            <button id="sangre-analisis-correlacion" class="text-xs discord-button-secondary px-2 py-1 rounded">
                                Correlaciones
                            </button>
                            <button id="sangre-analisis-patrones" class="text-xs discord-button-secondary px-2 py-1 rounded">
                                Patrones
                            </button>
                            <button id="sangre-analisis-visualizar" class="text-xs discord-button-secondary px-2 py-1 rounded">
                                Visualizar
                            </button>
                        </div>
                        
                        <div id="sangre-resultados-container" class="mt-3 text-xs bg-gray-800/30 p-2 rounded max-h-40 overflow-y-auto ${estado.resultados ? '' : 'hidden'}">
                            ${estado.resultados ? `<pre>${JSON.stringify(estado.resultados, null, 2)}</pre>` : ''}
                        </div>
                    </div>
                `;
                
                content.innerHTML += analisisHTML;
            }
        } else {
            content.innerHTML = `
                <p class="text-sm text-gray-400">No hay categorías disponibles.</p>
            `;
        }
        
        contenedor.appendChild(content);
    }
    
    /**
     * Configura los eventos de la interfaz
     */
    function configurarEventos() {
        // Evento para cambiar modo
        const modoBtn = document.getElementById('sangre-modo-btn');
        if (modoBtn) {
            modoBtn.addEventListener('click', () => {
                estado.modo = estado.modo === 'basico' ? 'avanzado' : 'basico';
                renderizarInterfaz();
                configurarEventos();
            });
        }
        
        // Evento para expandir/contraer
        const expandirBtn = document.getElementById('sangre-expandir-btn');
        if (expandirBtn) {
            expandirBtn.addEventListener('click', () => {
                const content = document.getElementById('sangre-filter-content');
                if (content) {
                    content.classList.toggle('expanded');
                }
            });
        }
        
        // Eventos para checkboxes de categorías
        estado.categorias.forEach((_, index) => {
            const checkbox = document.getElementById(`sangre-cat-${index}`);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    estado.categorias[index].activa = e.target.checked;
                    actualizarSeleccionadas();
                    renderizarInterfaz();
                    configurarEventos();
                });
            }
            
            // Evento para expandir subcategorías
            const expandirSubcatBtn = document.querySelector(`.expandir-subcategorias[data-index="${index}"]`);
            if (expandirSubcatBtn) {
                expandirSubcatBtn.addEventListener('click', () => {
                    estado.categorias[index].expandida = !estado.categorias[index].expandida;
                    renderizarInterfaz();
                    configurarEventos();
                });
            }
            
            // Eventos para subcategorías
            if (estado.categorias[index].subcategorias) {
                estado.categorias[index].subcategorias.forEach((_, subIndex) => {
                    const subCheckbox = document.getElementById(`sangre-subcat-${index}-${subIndex}`);
                    if (subCheckbox) {
                        subCheckbox.addEventListener('change', (e) => {
                            estado.categorias[index].subcategorias[subIndex].activa = e.target.checked;
                            actualizarSeleccionadas();
                        });
                    }
                });
            }
        });
        
        // Eventos para botones de análisis en modo avanzado
        if (estado.modo === 'avanzado') {
            // Análisis de frecuencia
            const frecuenciaBtn = document.getElementById('sangre-analisis-frecuencia');
            if (frecuenciaBtn) {
                frecuenciaBtn.addEventListener('click', () => {
                    analizarFrecuencia();
                });
            }
            
            // Análisis de correlación
            const correlacionBtn = document.getElementById('sangre-analisis-correlacion');
            if (correlacionBtn) {
                correlacionBtn.addEventListener('click', () => {
                    analizarCorrelaciones();
                });
            }
            
            // Análisis de patrones
            const patronesBtn = document.getElementById('sangre-analisis-patrones');
            if (patronesBtn) {
                patronesBtn.addEventListener('click', () => {
                    detectarPatrones();
                });
            }
            
            // Visualización
            const visualizarBtn = document.getElementById('sangre-analisis-visualizar');
            if (visualizarBtn) {
                visualizarBtn.addEventListener('click', () => {
                    visualizarResultados();
                });
            }
        }
    }
    
    /**
     * Actualiza la lista de categorías seleccionadas
     */
    function actualizarSeleccionadas() {
        estado.seleccionadas = estado.categorias
            .filter(cat => cat.activa)
            .map(cat => ({
                id: cat.id,
                nombre: cat.nombre,
                subcategorias: cat.subcategorias ? 
                    cat.subcategorias.filter(sub => sub.activa) : []
            }));
    }
    
    /**
     * Realiza análisis de frecuencia con las categorías seleccionadas
     */
    function analizarFrecuencia() {
        // Simulación de análisis (en implementación real se usaría AnalisisAvanzado.analizarFrecuencia)
        const texto = obtenerTextoActual();
        
        if (!texto || estado.seleccionadas.length === 0) {
            mostrarMensaje('Selecciona al menos una categoría y asegúrate de tener texto para analizar.');
            return;
        }
        
        // Llamar al módulo de análisis
        estado.resultados = {
            tipo: 'frecuencia',
            timestamp: new Date().toISOString(),
            categorias: estado.seleccionadas.map(cat => cat.nombre),
            datos: {
                totalPalabras: texto.split(/\s+/).length,
                frecuenciaCategorias: {}
            }
        };
        
        // Simular resultados para cada categoría
        estado.seleccionadas.forEach(cat => {
            estado.resultados.datos.frecuenciaCategorias[cat.id] = {
                total: Math.floor(Math.random() * 50),
                porcentaje: (Math.random() * 10).toFixed(2)
            };
        });
        
        renderizarInterfaz();
        configurarEventos();
    }
    
    /**
     * Realiza análisis de correlaciones entre categorías
     */
    function analizarCorrelaciones() {
        if (estado.seleccionadas.length < 2) {
            mostrarMensaje('Selecciona al menos dos categorías para analizar correlaciones.');
            return;
        }
        
        // Simulación de análisis (en implementación real se usaría AnalisisAvanzado.analizarCorrelaciones)
        estado.resultados = {
            tipo: 'correlaciones',
            timestamp: new Date().toISOString(),
            categorias: estado.seleccionadas.map(cat => cat.nombre),
            datos: {}
        };
        
        // Crear matriz de correlación simulada
        estado.seleccionadas.forEach(cat1 => {
            estado.resultados.datos[cat1.id] = {};
            estado.seleccionadas.forEach(cat2 => {
                if (cat1.id === cat2.id) {
                    estado.resultados.datos[cat1.id][cat2.id] = 1;
                } else {
                    // Valor aleatorio entre -1 y 1
                    estado.resultados.datos[cat1.id][cat2.id] = (Math.random() * 2 - 1).toFixed(2);
                }
            });
        });
        
        renderizarInterfaz();
        configurarEventos();
    }
    
    /**
     * Detecta patrones en el texto con las categorías seleccionadas
     */
    function detectarPatrones() {
        const texto = obtenerTextoActual();
        
        if (!texto || estado.seleccionadas.length === 0) {
            mostrarMensaje('Selecciona al menos una categoría y asegúrate de tener texto para analizar.');
            return;
        }
        
        // Simulación de detección de patrones
        estado.resultados = {
            tipo: 'patrones',
            timestamp: new Date().toISOString(),
            categorias: estado.seleccionadas.map(cat => cat.nombre),
            datos: {
                patrones: []
            }
        };
        
        // Generar patrones simulados
        for (let i = 0; i < 5; i++) {
            estado.resultados.datos.patrones.push({
                texto: `Patrón de ejemplo ${i+1}`,
                frecuencia: Math.floor(Math.random() * 10) + 1,
                importancia: (Math.random() * 5).toFixed(2)
            });
        }
        
        renderizarInterfaz();
        configurarEventos();
    }
    
    /**
     * Visualiza los resultados del análisis
     */
    function visualizarResultados() {
        if (!estado.resultados) {
            mostrarMensaje('Realiza un análisis primero para visualizar resultados.');
            return;
        }
        
        // Aquí se implementaría la lógica para mostrar visualizaciones
        // Usando el módulo VisualizacionAvanzada
        
        // Por ahora, solo mostramos un mensaje
        mostrarMensaje('Visualización de resultados disponible en la pestaña de visualizaciones.');
    }
    
    /**
     * Obtiene el texto actual para análisis
     * @returns {String} Texto para analizar
     */
    function obtenerTextoActual() {
        // En implementación real, obtendría el texto del contenido bíblico actual
        // Por ahora, devolvemos un texto de ejemplo
        return "Este es un texto de ejemplo para simular el análisis. En una implementación real, se obtendría el texto bíblico actual que el usuario está estudiando.";
    }
    
    /**
     * Muestra un mensaje al usuario
     * @param {String} mensaje - Mensaje a mostrar
     */
    function mostrarMensaje(mensaje) {
        // En implementación real, mostraría un toast o notificación
        console.log(mensaje);
        
        // Actualizar resultados para mostrar mensaje
        estado.resultados = {
            tipo: 'mensaje',
            mensaje
        };
        
        renderizarInterfaz();
        configurarEventos();
    }
    
    // API pública del módulo
    return {
        inicializar,
        getEstado: () => JSON.parse(JSON.stringify(estado)),
        setEstado: (nuevoEstado) => {
            estado = JSON.parse(JSON.stringify(nuevoEstado));
            renderizarInterfaz();
            configurarEventos();
        },
        getSeleccionadas: () => JSON.parse(JSON.stringify(estado.seleccionadas)),
        getResultados: () => estado.resultados ? JSON.parse(JSON.stringify(estado.resultados)) : null
    };
})();

// Módulo para el sistema de filtros de Agua
const FiltroAgua = (function() {
    // Estado interno
    let estado = {
        elementos: {
            valor: [],
            anadir: [],
            noAnadir: []
        },
        conexiones: [],
        seleccionados: [],
        modo: 'basico' // 'basico' o 'avanzado'
    };
    
    // Configuración
    const config = {
        colorPrimario: '#00a8fc', // Azul para agua
        colorSecundario: '#5865f2',
        colorTerciario: '#43b581'
    };
    
    /**
     * Inicializa el módulo de filtro de agua
     * @param {Object} elementos - Elementos iniciales por categoría
     * @param {Array} conexiones - Conexiones iniciales entre elementos
     * @param {Object} opciones - Opciones de configuración
     */
    function inicializar(elementos = {}, conexiones = [], opciones = {}) {
        // Actualizar configuración
        Object.assign(config, opciones);
        
        // Establecer elementos iniciales
        estado.elementos = {
            valor: (elementos.valor || []).map(prepararElemento),
            anadir: (elementos.anadir || []).map(prepararElemento),
            noAnadir: (elementos.noAnadir || []).map(prepararElemento)
        };
        
        // Establecer conexiones iniciales
        estado.conexiones = conexiones.map(conn => ({
            ...conn,
            activa: true
        }));
        
        // Renderizar interfaz inicial
        renderizarInterfaz();
        
        // Configurar eventos
        configurarEventos();
        
        // Inicializar sistema de arrastrar y soltar si estamos en modo avanzado
        if (estado.modo === 'avanzado') {
            inicializarDragAndDrop();
        }
    }
    
    /**
     * Prepara un elemento para su uso en el sistema
     * @param {Object} elemento - Elemento a preparar
     * @returns {Object} Elemento preparado
     */
    function prepararElemento(elemento) {
        return {
            ...elemento,
            seleccionado: false,
            destacado: false
        };
    }
    
    /**
     * Renderiza la interfaz del filtro de agua
     */
    function renderizarInterfaz() {
        const contenedor = document.getElementById('filtro-agua-container');
        if (!contenedor) return;
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Crear encabezado
        const header = document.createElement('div');
        header.className = 'filter-header flex justify-between items-center';
        header.innerHTML = `
            <h3 class="font-medium flex items-center">
                <span class="mr-2">Agua</span>
                <span class="text-xs bg-[${config.colorPrimario}] px-2 py-0.5 rounded-full">
                    ${estado.seleccionados.length}/${contarElementosTotales()}
                </span>
            </h3>
            <div class="flex space-x-2">
                <button id="agua-modo-btn" class="text-sm discord-button-secondary px-2 py-1 rounded">
                    ${estado.modo === 'basico' ? 'Modo Básico' : 'Modo Avanzado'}
                </button>
                <button id="agua-expandir-btn" class="text-sm discord-button-secondary px-2 py-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
            </div>
        `;
        contenedor.appendChild(header);
        
        // Crear contenido
        const content = document.createElement('div');
        content.className = 'filter-content';
        content.id = 'agua-filter-content';
        
        // Renderizar sistema de columnas
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="agua-columna border border-dashed border-gray-600 p-2 rounded flex flex-col">
                    <h3 class="font-semibold text-center mb-2 sticky top-0 bg-[var(--bg-card)] py-1">Valor</h3>
                    <div id="agua-valor-container" class="agua-elementos-container space-y-2 flex-grow overflow-y-auto">
                        ${renderizarElementos('valor')}
                    </div>
                    <button id="agua-add-valor-btn" class="add-agua-elemento-btn mt-2 discord-button-secondary text-xs py-1">+ Añadir</button>
                </div>
                
                <div class="agua-columna border border-dashed border-gray-600 p-2 rounded flex flex-col">
                    <h3 class="font-semibold text-center mb-2 sticky top-0 bg-[var(--bg-card)] py-1">Añadir</h3>
                    <div id="agua-anadir-container" class="agua-elementos-container space-y-2 flex-grow overflow-y-auto">
                        ${renderizarElementos('anadir')}
                    </div>
                    <button id="agua-add-anadir-btn" class="add-agua-elemento-btn mt-2 discord-button-secondary text-xs py-1">+ Añadir</button>
                </div>
                
                <div class="agua-columna border border-dashed border-gray-600 p-2 rounded flex flex-col">
                    <h3 class="font-semibold text-center mb-2 sticky top-0 bg-[var(--bg-card)] py-1">No Añadir</h3>
                    <div id="agua-no-anadir-container" class="agua-elementos-container space-y-2 flex-grow overflow-y-auto">
                        ${renderizarElementos('noAnadir')}
                    </div>
                    <button id="agua-add-no-anadir-btn" class="add-agua-elemento-btn mt-2 discord-button-secondary text-xs py-1">+ Añadir</button>
                </div>
            </div>
        `;
        
        // Añadir sección de análisis en modo avanzado
        if (estado.modo === 'avanzado') {
            const analisisHTML = `
                <div class="analisis-container mt-4 pt-4 border-t border-gray-700">
                    <h4 class="text-sm font-medium mb-2">Análisis Avanzado</h4>
                    <div class="grid grid-cols-2 gap-2">
                        <button id="agua-analisis-flujo" class="text-xs discord-button-secondary px-2 py-1 rounded">
                            Análisis de Flujo
                        </button>
                        <button id="agua-analisis-conexiones" class="text-xs discord-button-secondary px-2 py-1 rounded">
                            Conexiones
                        </button>
                        <button id="agua-analisis-patrones" class="text-xs discord-button-secondary px-2 py-1 rounded">
                            Patrones
                        </button>
                        <button id="agua-analisis-visualizar" class="text-xs discord-button-secondary px-2 py-1 rounded">
                            Visualizar
                        </button>
                    </div>
                    
                    <div id="agua-canvas-container" class="mt-3 bg-gray-800/30 p-2 rounded h-40 ${estado.visualizacionActiva ? '' : 'hidden'}">
                        <canvas id="agua-visualizacion-canvas" width="100%" height="100%"></canvas>
                    </div>
                </div>
            `;
            
            content.innerHTML += analisisHTML;
        }
        
        contenedor.appendChild(content);
    }
    
    /**
     * Renderiza los elementos de una columna específica
     * @param {String} tipo - Tipo de columna ('valor', 'anadir', 'noAnadir')
     * @returns {String} HTML de los elementos
     */
    function renderizarElementos(tipo) {
        if (!estado.elementos[tipo] || estado.elementos[tipo].length === 0) {
            return '<p class="text-xs text-gray-400">No hay elementos</p>';
        }
        
        return estado.elementos[tipo].map((elem, index) => `
            <div class="agua-elemento ${elem.seleccionado ? 'border-[' + config.colorPrimario + ']' : ''} ${elem.destacado ? 'bg-[' + config.colorPrimario + ']/20' : ''}"
                data-id="${elem.id}" data-tipo="${tipo}" data-index="${index}">
                <div class="flex items-center">
                    <span class="flex-grow">${elem.nombre || elem.id}</span>
                    ${estado.modo === 'avanzado' ? `
                        <button class="agua-elemento-editar text-xs ml-1 opacity-50 hover:opacity-100">✏️</button>
                        <button class="agua-elemento-conectar text-xs ml-1 opacity-50 hover:opacity-100">🔗</button>
                    ` : ''}
                </div>
                ${elem.descripcion ? `<p class="text-xs text-gray-400 mt-1">${elem.descripcion}</p>` : ''}
            </div>
        `).join('');
    }
    
    /**
     * Configura los eventos de la interfaz
     */
    function configurarEventos() {
        // Evento para cambiar modo
        const modoBtn = document.getElementById('agua-modo-btn');
        if (modoBtn) {
            modoBtn.addEventListener('click', () => {
                estado.modo = estado.modo === 'basico' ? 'avanzado' : 'basico';
                renderizarInterfaz();
                configurarEventos();
                
                if (estado.modo === 'avanzado') {
                    inicializarDragAndDrop();
                }
            });
        }
        
        // Evento para expandir/contraer
        const expandirBtn = document.getElementById('agua-expandir-btn');
        if (expandirBtn) {
            expandirBtn.addEventListener('click', () => {
                const content = document.getElementById('agua-filter-content');
                if (content) {
                    content.classList.toggle('expanded');
                }
            });
        }
        
        // Eventos para botones de añadir elementos
        ['valor', 'anadir', 'noAnadir'].forEach(tipo => {
            const addBtn = document.getElementById(`agua-add-${tipo}-btn`);
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    anadirNuevoElemento(tipo);
                });
            }
        });
        
        // Eventos para elementos
        document.querySelectorAll('.agua-elemento').forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.classList.contains('agua-elemento-editar')) {
                    // Editar elemento
                    const tipo = elem.dataset.tipo;
                    const index = parseInt(elem.dataset.index);
                    editarElemento(tipo, index);
                } else if (e.target.classList.contains('agua-elemento-conectar')) {
                    // Conectar elemento
                    const tipo = elem.dataset.tipo;
                    const index = parseInt(elem.dataset.index);
                    iniciarConexion(tipo, index);
                } else {
                    // Seleccionar elemento
                    const tipo = elem.dataset.tipo;
                    const index = parseInt(elem.dataset.index);
                    seleccionarElemento(tipo, index);
                }
            });
        });
        
        // Eventos para botones de análisis en modo avanzado
        if (estado.modo === 'avanzado') {
            // Análisis de flujo
            const flujoBtn = document.getElementById('agua-analisis-flujo');
            if (flujoBtn) {
                flujoBtn.addEventListener('click', () => {
                    analizarFlujo();
                });
            }
            
            // Análisis de conexiones
            const conexionesBtn = document.getElementById('agua-analisis-conexiones');
            if (conexionesBtn) {
                conexionesBtn.addEventListener('click', () => {
                    analizarConexiones();
                });
            }
            
            // Análisis de patrones
            const patronesBtn = document.getElementById('agua-analisis-patrones');
            if (patronesBtn) {
                patronesBtn.addEventListener('click', () => {
                    detectarPatrones();
                });
            }
            
            // Visualización
            const visualizarBtn = document.getElementById('agua-analisis-visualizar');
            if (visualizarBtn) {
                visualizarBtn.addEventListener('click', () => {
                    visualizarSistema();
                });
            }
        }
    }
    
    /**
     * Inicializa el sistema de arrastrar y soltar
     */
    function inicializarDragAndDrop() {
        // Aquí se implementaría la lógica para drag and drop
        // Usando una biblioteca como Sortable.js o implementación nativa
        
        // Ejemplo de código para Sortable.js:
        /*
        ['valor', 'anadir', 'noAnadir'].forEach(tipo => {
            const container = document.getElementById(`agua-${tipo}-container`);
            if (!container) return;
            
            new Sortable(container, {
                group: 'agua-elementos',
                animation: 150,
                ghostClass: 'elemento-ghost',
                chosenClass: 'elemento-chosen',
                dragClass: 'elemento-drag',
                onEnd: function(evt) {
                    const itemEl = evt.item;
                    const fromType = evt.from.id.replace('agua-', '').replace('-container', '');
                    const toType = evt.to.id.replace('agua-', '').replace('-container', '');
                    const oldIndex = evt.oldIndex;
                    const newIndex = evt.newIndex;
                    
                    // Mover elemento entre columnas
                    if (fromType !== toType) {
                        const elemento = estado.elementos[fromType][oldIndex];
                        estado.elementos[fromType].splice(oldIndex, 1);
                        estado.elementos[toType].splice(newIndex, 0, elemento);
                    } 
                    // Reordenar dentro de la misma columna
                    else {
                        const elemento = estado.elementos[fromType][oldIndex];
                        estado.elementos[fromType].splice(oldIndex, 1);
                        estado.elementos[fromType].splice(newIndex, 0, elemento);
                    }
                }
            });
        });
        */
    }
    
    /**
     * Añade un nuevo elemento a una columna
     * @param {String} tipo - Tipo de columna ('valor', 'anadir', 'noAnadir')
     */
    function anadirNuevoElemento(tipo) {
        // En implementación real, mostraría un modal para ingresar datos
        // Por ahora, creamos un elemento con datos de ejemplo
        const nuevoId = `${tipo}-${Date.now()}`;
        const nuevoElemento = {
            id: nuevoId,
            nombre: `Nuevo ${tipo}`,
            descripcion: `Descripción del nuevo elemento ${tipo}`,
            seleccionado: false,
            destacado: false
        };
        
        estado.elementos[tipo].push(nuevoElemento);
        renderizarInterfaz();
        configurarEventos();
    }
    
    /**
     * Edita un elemento existente
     * @param {String} tipo - Tipo de columna ('valor', 'anadir', 'noAnadir')
     * @param {Number} index - Índice del elemento en la columna
     */
    function editarElemento(tipo, index) {
        // En implementación real, mostraría un modal para editar datos
        // Por ahora, solo mostramos un mensaje
        console.log(`Editando elemento ${tipo}[${index}]`);
    }
    
    /**
     * Inicia el proceso de conexión entre elementos
     * @param {String} tipo - Tipo de columna del elemento origen
     * @param {Number} index - Índice del elemento origen
     */
    function iniciarConexion(tipo, index) {
        // En implementación real, entraría en modo de selección de destino
        // Por ahora, solo mostramos un mensaje
        console.log(`Iniciando conexión desde ${tipo}[${index}]`);
    }
    
    /**
     * Selecciona o deselecciona un elemento
     * @param {String} tipo - Tipo de columna
     * @param {Number} index - Índice del elemento
     */
    function seleccionarElemento(tipo, index) {
        const elemento = estado.elementos[tipo][index];
        elemento.seleccionado = !elemento.seleccionado;
        
        // Actualizar lista de seleccionados
        actualizarSeleccionados();
        
        renderizarInterfaz();
        configurarEventos();
    }
    
    /**
     * Actualiza la lista de elementos seleccionados
     */
    function actualizarSeleccionados() {
        estado.seleccionados = [];
        
        ['valor', 'anadir', 'noAnadir'].forEach(tipo => {
            estado.elementos[tipo].forEach(elem => {
                if (elem.seleccionado) {
                    estado.seleccionados.push({
                        id: elem.id,
                        tipo,
                        nombre: elem.nombre
                    });
                }
            });
        });
    }
    
    /**
     * Cuenta el número total de elementos en todas las columnas
     * @returns {Number} Total de elementos
     */
    function contarElementosTotales() {
        return estado.elementos.valor.length + 
               estado.elementos.anadir.length + 
               estado.elementos.noAnadir.length;
    }
    
    /**
     * Realiza análisis de flujo del sistema
     */
    function analizarFlujo() {
        // En implementación real, usaría AnalisisAvanzado.analizarFlujo
        // Por ahora, solo activamos la visualización
        estado.visualizacionActiva = true;
        renderizarInterfaz();
        configurarEventos();
        
        // Dibujar visualización simple
        const canvas = document.getElementById('agua-visualizacion-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                dibujarVisualizacionSimple(ctx);
            }
        }
    }
    
    /**
     * Analiza las conexiones entre elementos
     */
    function analizarConexiones() {
        // En implementación real, analizaría las conexiones
        // Por ahora, solo activamos la visualización
        estado.visualizacionActiva = true;
        renderizarInterfaz();
        configurarEventos();
        
        // Dibujar visualización simple
        const canvas = document.getElementById('agua-visualizacion-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                dibujarVisualizacionSimple(ctx);
            }
        }
    }
    
    /**
     * Detecta patrones en el sistema
     */
    function detectarPatrones() {
        // En implementación real, usaría AnalisisAvanzado.detectarPatrones
        // Por ahora, solo mostramos un mensaje
        console.log('Detectando patrones en el sistema de agua');
    }
    
    /**
     * Visualiza el sistema completo
     */
    function visualizarSistema() {
        estado.visualizacionActiva = true;
        renderizarInterfaz();
        configurarEventos();
        
        // Dibujar visualización simple
        const canvas = document.getElementById('agua-visualizacion-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                dibujarVisualizacionSimple(ctx);
            }
        }
    }
    
    /**
     * Dibuja una visualización simple en el canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    function dibujarVisualizacionSimple(ctx) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Dibujar fondo
        ctx.fillStyle = '#2f3136';
        ctx.fillRect(0, 0, width, height);
        
        // Dibujar nodos
        const nodos = [];
        let nodeIndex = 0;
        
        ['valor', 'anadir', 'noAnadir'].forEach((tipo, tipoIndex) => {
            const xOffset = width * (tipoIndex + 1) / 4;
            
            estado.elementos[tipo].forEach((elem, elemIndex) => {
                const yOffset = height * (elemIndex + 1) / (estado.elementos[tipo].length + 1);
                
                // Guardar posición del nodo
                nodos.push({
                    id: elem.id,
                    tipo,
                    x: xOffset,
                    y: yOffset,
                    radio: elem.seleccionado ? 8 : 6
                });
                
                // Dibujar nodo
                ctx.beginPath();
                ctx.arc(xOffset, yOffset, nodos[nodeIndex].radio, 0, Math.PI * 2);
                ctx.fillStyle = getColorForTipo(tipo);
                ctx.fill();
                
                // Dibujar texto
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(elem.nombre || elem.id, xOffset, yOffset + 20);
                
                nodeIndex++;
            });
        });
        
        // Dibujar conexiones
        ctx.strokeStyle = '#4f545c';
        ctx.lineWidth = 1;
        
        estado.conexiones.forEach(conn => {
            const nodoOrigen = nodos.find(n => n.id === conn.origen);
            const nodoDestino = nodos.find(n => n.id === conn.destino);
            
            if (nodoOrigen && nodoDestino) {
                ctx.beginPath();
                ctx.moveTo(nodoOrigen.x, nodoOrigen.y);
                ctx.lineTo(nodoDestino.x, nodoDestino.y);
                ctx.stroke();
                
                // Dibujar flecha
                const angulo = Math.atan2(nodoDestino.y - nodoOrigen.y, nodoDestino.x - nodoOrigen.x);
                const x1 = nodoDestino.x - 10 * Math.cos(angulo) + 5 * Math.cos(angulo - Math.PI/2);
                const y1 = nodoDestino.y - 10 * Math.sin(angulo) + 5 * Math.sin(angulo - Math.PI/2);
                const x2 = nodoDestino.x - 10 * Math.cos(angulo) + 5 * Math.cos(angulo + Math.PI/2);
                const y2 = nodoDestino.y - 10 * Math.sin(angulo) + 5 * Math.sin(angulo + Math.PI/2);
                
                ctx.beginPath();
                ctx.moveTo(nodoDestino.x, nodoDestino.y);
                ctx.lineTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.closePath();
                ctx.fillStyle = '#4f545c';
                ctx.fill();
            }
        });
    }
    
    /**
     * Obtiene el color correspondiente a un tipo de columna
     * @param {String} tipo - Tipo de columna
     * @returns {String} Color en formato hexadecimal
     */
    function getColorForTipo(tipo) {
        switch (tipo) {
            case 'valor':
                return config.colorPrimario;
            case 'anadir':
                return config.colorSecundario;
            case 'noAnadir':
                return config.colorTerciario;
            default:
                return '#ffffff';
        }
    }
    
    // API pública del módulo
    return {
        inicializar,
        getEstado: () => JSON.parse(JSON.stringify(estado)),
        setEstado: (nuevoEstado) => {
            estado = JSON.parse(JSON.stringify(nuevoEstado));
            renderizarInterfaz();
            configurarEventos();
            
            if (estado.modo === 'avanzado') {
                inicializarDragAndDrop();
            }
        },
        getSeleccionados: () => JSON.parse(JSON.stringify(estado.seleccionados)),
        getElementos: () => JSON.parse(JSON.stringify(estado.elementos)),
        getConexiones: () => JSON.parse(JSON.stringify(estado.conexiones))
    };
})();

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando módulos de análisis y filtros...');
    
    // Inicializar filtro de sangre con categorías de ejemplo
    const categoriasSangre = [
        {
            id: 'cat1',
            nombre: 'Categoría 1',
            subcategorias: [
                { id: 'subcat1-1', nombre: 'Subcategoría 1.1', activa: false },
                { id: 'subcat1-2', nombre: 'Subcategoría 1.2', activa: false }
            ]
        },
        {
            id: 'cat2',
            nombre: 'Categoría 2',
            subcategorias: [
                { id: 'subcat2-1', nombre: 'Subcategoría 2.1', activa: false }
            ]
        },
        {
            id: 'cat3',
            nombre: 'Categoría 3'
        }
    ];
    
    if (document.getElementById('filtro-sangre-container')) {
        FiltroSangre.inicializar(categoriasSangre);
    }
    
    // Inicializar filtro de agua con elementos de ejemplo
    const elementosAgua = {
        valor: [
            { id: 'v1', nombre: 'Elemento Valor 1', descripcion: 'Descripción del elemento' },
            { id: 'v2', nombre: 'Elemento Valor 2' }
        ],
        anadir: [
            { id: 'a1', nombre: 'Elemento Añadir A' },
            { id: 'a2', nombre: 'Elemento Añadir B', descripcion: 'Descripción del elemento' }
        ],
        noAnadir: [
            { id: 'n1', nombre: 'Elemento No Añadir X' }
        ]
    };
    
    const conexionesAgua = [
        { origen: 'v1', destino: 'a1', tipo: 'conexion', peso: 1 },
        { origen: 'v2', destino: 'a2', tipo: 'conexion', peso: 2 },
        { origen: 'a1', destino: 'n1', tipo: 'conexion', peso: 1 }
    ];
    
    if (document.getElementById('filtro-agua-container')) {
        FiltroAgua.inicializar(elementosAgua, conexionesAgua);
    }
    
    // Inicializar módulo de visualización
    if (typeof VisualizacionAvanzada !== 'undefined') {
        VisualizacionAvanzada.inicializar({
            temaOscuro: true,
            animaciones: true
        });
    }
});
