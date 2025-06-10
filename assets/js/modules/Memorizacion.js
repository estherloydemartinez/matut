// Memorizacion.js - Módulo para herramientas de memorización de versículos
console.log("Memorizacion.js cargado.");

class Memorizacion {
    constructor(appCore) {
        this.appCore = appCore;
        this.currentVerse = null; // Objeto { referencia: "Juan 3:16", texto: "Porque de tal manera..." }
        this.srsData = new Map(); // Simulación de datos SRS: verseRef -> { interval, easeFactor, dueDate }
        console.log("Módulo Memorizacion inicializado.");
    }

    renderContent(containerElement) {
        if (!containerElement) {
            console.error("Memorizacion: El contenedor para el contenido no fue provisto.");
            return;
        }
        containerElement.innerHTML = ''; // Limpiar contenedor

        const srsHTML = `
            <div class="memorizacion-srs p-4 space-y-4">
                <div id="srsVersiculoReferencia" class="text-xl font-semibold text-center text-blue-300"></div>
                <textarea id="srsEntradaUsuario" class="w-full h-32 p-2 bg-gray-700 text-white border border-gray-600 rounded" placeholder="Escribe el versículo aquí..."></textarea>
                <div class="flex justify-around">
                    <button id="srsBtnVerificar" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Verificar</button>
                    <button id="srsBtnMostrar" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Mostrar</button>
                    <button id="srsBtnSiguiente" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Siguiente</button>
                </div>
                <div id="srsFeedbackArea" class="p-2 min-h-[4em] bg-gray-700 border border-gray-600 rounded text-center"></div>
                <div class="text-center text-sm text-gray-400 mb-2">¿Cómo te fue?</div>
                <div id="srsCalificacionContainer" class="flex justify-around">
                    <button class="srs-calificacion-btn bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded text-sm" data-rating="again">Otra vez (1)</button>
                    <button class="srs-calificacion-btn bg-orange-500 hover:bg-orange-700 text-white py-1 px-3 rounded text-sm" data-rating="hard">Difícil (2)</button>
                    <button class="srs-calificacion-btn bg-green-600 hover:bg-green-800 text-white py-1 px-3 rounded text-sm" data-rating="good">Bien (3)</button>
                    <button class="srs-calificacion-btn bg-sky-500 hover:bg-sky-700 text-white py-1 px-3 rounded text-sm" data-rating="easy">Fácil (4)</button>
                </div>
                <div id="srsStatsArea" class="mt-4 p-3 bg-gray-700 border border-gray-600 rounded text-sm">
                    <h4 class="font-semibold mb-1 text-gray-300">Estadísticas (Placeholder)</h4>
                    <p>Versículos aprendidos: 0</p>
                    <p>Próxima revisión: N/A</p>
                </div>
            </div>
        `;
        containerElement.innerHTML = srsHTML;
        this.addEventListeners();
        this.cargarProximoVersiculo(); // Cargar el primer versículo
        console.log("Memorizacion: Contenido SRS renderizado.");
    }

    addEventListeners() {
        document.getElementById('srsBtnVerificar')?.addEventListener('click', () => this.verificarRespuesta());
        document.getElementById('srsBtnMostrar')?.addEventListener('click', () => this.mostrarVersiculo());
        document.getElementById('srsBtnSiguiente')?.addEventListener('click', () => this.cargarProximoVersiculo());

        const calificacionButtons = document.querySelectorAll('.srs-calificacion-btn');
        calificacionButtons.forEach(btn => {
            btn.addEventListener('click', (event) => this.procesarCalificacionSRS(event.target.dataset.rating));
        });
    }

    async cargarProximoVersiculo() {
        // Lógica para seleccionar el próximo versículo (ej. del pool de SRS o uno nuevo)
        // Por ahora, un versículo fijo y luego otro para simular cambio.
        if (!this.currentVerse || this.currentVerse.referencia === "Juan 3:16") {
            this.currentVerse = {
                referencia: "Romanos 8:28",
                texto: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados."
            };
        } else {
             this.currentVerse = {
                referencia: "Juan 3:16",
                texto: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna."
            };
        }

        const refEl = document.getElementById('srsVersiculoReferencia');
        const entradaEl = document.getElementById('srsEntradaUsuario');
        const feedbackEl = document.getElementById('srsFeedbackArea');

        if (refEl) refEl.textContent = this.currentVerse.referencia;
        if (entradaEl) entradaEl.value = '';
        if (feedbackEl) feedbackEl.innerHTML = '<p class="text-gray-400">Ingresa el texto del versículo.</p>';

        // Actualizar estadísticas (placeholder)
        this.actualizarStats();
        console.log(`Memorizacion: Próximo versículo cargado - ${this.currentVerse.referencia}`);
    }

    verificarRespuesta() {
        const entradaUsuario = document.getElementById('srsEntradaUsuario')?.value || '';
        const feedbackEl = document.getElementById('srsFeedbackArea');
        if (!this.currentVerse || !feedbackEl) return;

        // Comparación simple (normalizar espacios y mayúsculas/minúsculas)
        const textoCorrectoNormalizado = this.currentVerse.texto.trim().replace(/\s+/g, ' ').toLowerCase();
        const entradaNormalizada = entradaUsuario.trim().replace(/\s+/g, ' ').toLowerCase();

        if (textoCorrectoNormalizado === entradaNormalizada) {
            feedbackEl.innerHTML = '<p class="text-green-400">¡Correcto! Buen trabajo.</p>';
        } else {
            // Podría añadirse una comparación más detallada (diff)
            feedbackEl.innerHTML = '<p class="text-red-400">Incorrecto. Intenta de nuevo o usa "Mostrar".</p>';
        }
    }

    mostrarVersiculo() {
        const entradaEl = document.getElementById('srsEntradaUsuario');
        const feedbackEl = document.getElementById('srsFeedbackArea');
        if (!this.currentVerse) return;

        if (entradaEl) entradaEl.value = this.currentVerse.texto;
        if (feedbackEl) feedbackEl.innerHTML = `<p class="text-yellow-300">Versículo mostrado: ${this.currentVerse.referencia}</p>`;
    }

    procesarCalificacionSRS(rating) {
        if (!this.currentVerse) {
            console.warn("Memorizacion.procesarCalificacionSRS: No hay versículo actual para calificar.");
            return;
        }
        console.log(`Memorizacion: Versículo '${this.currentVerse.referencia}' calificado como '${rating}'.`);
        // Aquí iría la lógica SRS para actualizar intervalo, factor de facilidad, fecha de próxima revisión.
        // Por ejemplo:
        // let srsEntry = this.srsData.get(this.currentVerse.referencia) || { interval: 0, easeFactor: 2.5 };
        // ...cálculos SRS...
        // this.srsData.set(this.currentVerse.referencia, srsEntry);

        this.cargarProximoVersiculo(); // Cargar el siguiente después de calificar
    }

    actualizarStats() {
        const statsEl = document.getElementById('srsStatsArea');
        if (statsEl) {
            // Lógica real para contar versículos aprendidos, etc.
            statsEl.innerHTML = `
                <h4 class="font-semibold mb-1 text-gray-300">Estadísticas (Placeholder)</h4>
                <p>Versículos en SRS: ${this.srsData.size}</p>
                <p>Versículo Actual: ${this.currentVerse ? this.currentVerse.referencia : "N/A"}</p>
            `;
        }
    }

    getRandomVerseToMemorize() { // Método de ejemplo, no usado directamente en renderContent
        return "<p>Versículo para memorizar: Juan 3:16 (de Memorizacion.js)</p>";
    }
}

// window.Memorizacion = Memorizacion;
