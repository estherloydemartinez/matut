// Lectura.js - Módulo para la funcionalidad de lectura de la Biblia
console.log("Lectura.js cargado.");

class Lectura {
    constructor(appCore) {
        this.appCore = appCore;
        this.datosBiblicosManager = this.appCore.getDatosBiblicosManager();

        this.uiIds = {
            // Comunes o para modo simple
            container: null,
            selectorLibro: 'selectorLibroLectura',
            selectorCapitulo: 'selectorCapituloLectura',
            contenedorTexto: 'contenedorTextoBiblicoLectura',
            btnAnterior: 'btnCapAnteriorLectura',
            btnSiguiente: 'btnCapSiguienteLectura',
            // Específicos modo profundo
            selectorLibroProfundo: 'selectorLibroLecturaProfunda',
            selectorCapituloProfundo: 'selectorCapituloLecturaProfunda',
            contenedorTextoProfundo: 'contenedorTextoBiblicoLecturaProfunda',
            btnAnteriorProfundo: 'btnCapAnteriorLecturaProfunda',
            btnSiguienteProfundo: 'btnCapSiguienteLecturaProfunda',
            panelHerramientas: 'panelHerramientasAnaliticasLectura'
        };
        console.log("Módulo Lectura inicializado y AppCore referenciado.");
    }

    renderContent(containerElement) {
        this.uiIds.container = containerElement;
        containerElement.innerHTML = ''; // Limpiar contenedor

        this.renderModoToggle(containerElement);

        const modoActual = this.appCore.stateManager.getState('app.teoria.lectura.currentModo', 'simple');
        const modoContainer = document.createElement('div');
        modoContainer.id = "lecturaModoContainer";
        containerElement.appendChild(modoContainer);

        if (modoActual === 'simple') {
            this.renderModoSimpleUI(modoContainer);
        } else if (modoActual === 'profundo') {
            this.renderModoProfundoUI(modoContainer);
        } else {
            modoContainer.innerHTML = '<p>Modo de lectura no reconocido.</p>';
        }
        console.log(`Lectura: Contenido renderizado en modo ${modoActual}.`);
    }

    renderModoToggle(containerElement) {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'modo-toggle-lectura mb-4 flex space-x-2';

        const modoActual = this.appCore.stateManager.getState('app.teoria.lectura.currentModo', 'simple');

        const btnSimple = document.createElement('button');
        btnSimple.textContent = 'Modo Simple';
        btnSimple.className = `py-2 px-4 rounded ${modoActual === 'simple' ? 'bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`;
        btnSimple.onclick = () => {
            if (this.appCore.stateManager.getState('app.teoria.lectura.currentModo') !== 'simple') {
                this.appCore.stateManager.setState('app.teoria.lectura.currentModo', 'simple');
                // La renderización se manejará por la subscripción en AppCore
            }
        };

        const btnProfundo = document.createElement('button');
        btnProfundo.textContent = 'Modo Profundo';
        btnProfundo.className = `py-2 px-4 rounded ${modoActual === 'profundo' ? 'bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`;
        btnProfundo.onclick = () => {
             if (this.appCore.stateManager.getState('app.teoria.lectura.currentModo') !== 'profundo') {
                this.appCore.stateManager.setState('app.teoria.lectura.currentModo', 'profundo');
            }
        };

        toggleContainer.appendChild(btnSimple);
        toggleContainer.appendChild(btnProfundo);
        containerElement.appendChild(toggleContainer);
    }

    renderModoSimpleUI(container) {
        const htmlContent = `
            <div class="modo-simple-lectura p-1"> <!-- Reducido padding para que quepa el toggle -->
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3">
                    <select id="${this.uiIds.selectorLibro}" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/2"></select>
                    <select id="${this.uiIds.selectorCapitulo}" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/2"></select>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <button id="${this.uiIds.btnAnterior}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">&lt; Anterior</button>
                    <button id="${this.uiIds.btnSiguiente}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Siguiente &gt;</button>
                </div>
                <div id="${this.uiIds.contenedorTexto}" class="p-2 bg-gray-800 rounded h-[calc(100vh-24rem)] overflow-y-auto">
                    <p class="text-gray-500">Selecciona un libro y capítulo para leer.</p>
                </div>
            </div>
        `;
        container.innerHTML = htmlContent;
        this.initBibleNavUI(
            this.uiIds.selectorLibro,
            this.uiIds.selectorCapitulo,
            this.uiIds.btnAnterior,
            this.uiIds.btnSiguiente,
            this.uiIds.contenedorTexto
        );
        console.log("Lectura: Modo Simple UI renderizado.");
    }

    renderModoProfundoUI(container) {
        const htmlContent = `
            <div class="modo-profundo-lectura p-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="columna-texto-biblico">
                    <h4 class="text-md font-semibold mb-2 text-gray-300">Texto Bíblico</h4>
                    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3">
                        <select id="${this.uiIds.selectorLibroProfundo}" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/2"></select>
                        <select id="${this.uiIds.selectorCapituloProfundo}" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/2"></select>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <button id="${this.uiIds.btnAnteriorProfundo}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">&lt; Anterior</button>
                        <button id="${this.uiIds.btnSiguienteProfundo}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Siguiente &gt;</button>
                    </div>
                    <div id="${this.uiIds.contenedorTextoProfundo}" class="p-2 bg-gray-800 rounded h-[calc(100vh-28rem)] overflow-y-auto">
                        <p class="text-gray-500">Selecciona un libro y capítulo.</p>
                    </div>
                </div>
                <div id="${this.uiIds.panelHerramientas}" class="columna-herramientas bg-gray-750 p-3 rounded overflow-y-auto h-[calc(100vh-24rem)]">
                    <!-- Panel de Herramientas Analíticas se cargará aquí -->
                </div>
            </div>
        `;
        container.innerHTML = htmlContent;
        this.initBibleNavUI(
            this.uiIds.selectorLibroProfundo,
            this.uiIds.selectorCapituloProfundo,
            this.uiIds.btnAnteriorProfundo,
            this.uiIds.btnSiguienteProfundo,
            this.uiIds.contenedorTextoProfundo
        );

        const panelHerramientasEl = document.getElementById(this.uiIds.panelHerramientas);
        if (panelHerramientasEl && this.appCore.herramientasManager) {
            this.appCore.herramientasManager.renderPanel(panelHerramientasEl);
        } else {
            console.error("Lectura: No se pudo renderizar el panel de Herramientas Analíticas.");
            if(panelHerramientasEl) panelHerramientasEl.innerHTML = "<p>Error al cargar herramientas.</p>";
        }
        console.log("Lectura: Modo Profundo UI renderizado.");
    }

    // Refactorizado de initModoSimpleUI para ser genérico
    async initBibleNavUI(selLibroId, selCapId, btnAntId, btnSigId, contTextoId) {
        const selectorLibroEl = document.getElementById(selLibroId);
        const selectorCapituloEl = document.getElementById(selCapId);
        const btnAnteriorEl = document.getElementById(btnAntId);
        const btnSiguienteEl = document.getElementById(btnSigId);

        if (!selectorLibroEl || !selectorCapituloEl || !btnAnteriorEl || !btnSiguienteEl) {
            console.error("Lectura.initBibleNavUI: No se encontraron todos los elementos UI para navegación bíblica con IDs:", selLibroId, selCapId, btnAntId, btnSigId);
            return;
        }

        const libros = this.datosBiblicosManager.getListaLibros();
        if (!libros || libros.length === 0) {
            selectorLibroEl.innerHTML = '<option value="">No hay libros</option>';
            return;
        }
        selectorLibroEl.innerHTML = '<option value="">Selecciona un libro</option>';
        libros.forEach(libro => {
            const option = document.createElement('option');
            option.value = libro.name;
            option.textContent = libro.name;
            selectorLibroEl.appendChild(option);
        });

        selectorLibroEl.onchange = async () => {
            const nombreLibro = selectorLibroEl.value;
            if (nombreLibro) {
                await this.poblarCapitulos(nombreLibro, selectorCapituloEl);
                 document.getElementById(contTextoId).innerHTML = '<p class="text-gray-500">Selecciona un capítulo.</p>';
            } else {
                selectorCapituloEl.innerHTML = '<option value="">Selecciona un libro</option>';
                document.getElementById(contTextoId).innerHTML = '<p class="text-gray-500">Selecciona un libro y capítulo para leer.</p>';
            }
        };

        selectorCapituloEl.onchange = async () => {
            const nombreLibro = selectorLibroEl.value;
            const numeroCapitulo = selectorCapituloEl.value;
            if (nombreLibro && numeroCapitulo) {
                await this.mostrarCapituloActual(nombreLibro, numeroCapitulo, contTextoId);
            }
        };

        btnAnteriorEl.onclick = async () => await this.navegarCapitulo(-1, selLibroId, selCapId, contTextoId);
        btnSiguienteEl.onclick = async () => await this.navegarCapitulo(1, selLibroId, selCapId, contTextoId);

        const currentBook = this.appCore.stateManager.getState('bible.currentBook');
        const currentChapter = this.appCore.stateManager.getState('bible.currentChapter');
        if (currentBook) {
            selectorLibroEl.value = currentBook;
            await this.poblarCapitulos(currentBook, selectorCapituloEl);
            if (currentChapter) {
                selectorCapituloEl.value = currentChapter;
                await this.mostrarCapituloActual(currentBook, currentChapter, contTextoId);
            }
        }
        console.log("Lectura: UI de Navegación Bíblica inicializada para IDs:", selLibroId, selCapId);
    }

    async poblarCapitulos(nombreLibro, selectorCapituloEl) { // Sin cambios
        selectorCapituloEl.innerHTML = '<option value="">Cargando...</option>';
        const numCapitulos = await this.datosBiblicosManager.getNumeroCapitulos(nombreLibro);
        if (numCapitulos === 0) {
            selectorCapituloEl.innerHTML = '<option value="">No hay capítulos</option>';
            return;
        }
        selectorCapituloEl.innerHTML = '<option value="">Selecciona capítulo</option>';
        for (let i = 1; i <= numCapitulos; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = `Capítulo ${i}`;
            selectorCapituloEl.appendChild(option);
        }
    }

    async mostrarCapituloActual(nombreLibro, numeroCapitulo, contTextoId) { // contTextoId añadido
        const contenedorTextoEl = document.getElementById(contTextoId);
        if (!contenedorTextoEl) {
            console.error("Lectura.mostrarCapituloActual: Contenedor de texto no encontrado con ID:", contTextoId);
            return;
        }
        if (!nombreLibro || !numeroCapitulo) {
            contenedorTextoEl.innerHTML = '<p class="text-gray-500">Libro o capítulo no especificado.</p>';
            return;
        }

        contenedorTextoEl.innerHTML = '<p class="text-gray-500">Cargando texto...</p>';
        try {
            const texto = await this.datosBiblicosManager.getTextoCapitulo(nombreLibro, numeroCapitulo);
            contenedorTextoEl.innerHTML = texto;
            this.appCore.stateManager.setState('bible.currentBook', nombreLibro);
            this.appCore.stateManager.setState('bible.currentChapter', numeroCapitulo);
        } catch (error) {
            console.error(`Lectura: Error al mostrar capítulo ${nombreLibro} ${numeroCapitulo}:`, error);
            contenedorTextoEl.innerHTML = `<p class="text-red-500">Error al cargar el capítulo. ${error.message}</p>`;
        }
    }

    async navegarCapitulo(direccion, selLibroId, selCapId, contTextoId) { // IDs añadidos
        const selectorLibroEl = document.getElementById(selLibroId);
        const selectorCapituloEl = document.getElementById(selCapId);

        const currentBook = selectorLibroEl.value; // Obtener del selector actual del modo activo
        let currentChapter = parseInt(selectorCapituloEl.value);

        if (!currentBook || isNaN(currentChapter)) {
            // Si no hay nada seleccionado en los selectores de este modo, intentar con el estado global
            const globalBook = this.appCore.stateManager.getState('bible.currentBook');
            const globalChapter = parseInt(this.appCore.stateManager.getState('bible.currentChapter'));
            if (!globalBook || isNaN(globalChapter)) {
                 console.warn("Lectura.navegarCapitulo: No hay libro/capítulo actual para navegar.");
                 return;
            }
            // Si hay estado global, usarlo para la primera navegación
            selectorLibroEl.value = globalBook;
            await this.poblarCapitulos(globalBook, selectorCapituloEl);
            selectorCapituloEl.value = globalChapter.toString();
            currentChapter = globalChapter;
        }

        let nuevoCapitulo = currentChapter + direccion;
        const numCapitulosEnLibro = await this.datosBiblicosManager.getNumeroCapitulos(currentBook);

        if (nuevoCapitulo >= 1 && nuevoCapitulo <= numCapitulosEnLibro) {
            selectorCapituloEl.value = nuevoCapitulo.toString();
            await this.mostrarCapituloActual(currentBook, nuevoCapitulo.toString(), contTextoId);
        } else {
            console.log(`Lectura: No se puede navegar más allá de los límites del libro (Cap ${nuevoCapitulo} de ${numCapitulosEnLibro}).`);
            // Podría implementarse navegación entre libros aquí
        }
    }
}

// window.Lectura = Lectura;
