// SistemaAgua.js - Módulo para el "Sistema de Agua Viva" (metáfora de crecimiento espiritual)
console.log("SistemaAgua.js cargado.");

class SistemaAgua {
    constructor(appCore) {
        this.appCore = appCore;
        this.elementIdCounter = 0;
        this.columnas = {
            valor: [
                { id: this.nextId(), text: "Oración constante" },
                { id: this.nextId(), text: "Estudio bíblico diario" }
            ],
            anadir: [
                { id: this.nextId(), text: "Servir en la comunidad" }
            ],
            no_anadir: [
                { id: this.nextId(), text: "Murmuración" },
                { id: this.nextId(), text: "Contienda" }
            ]
        };
        console.log("Módulo SistemaAgua inicializado.");
    }

    nextId() {
        return `sa-el-${this.elementIdCounter++}`;
    }

    renderContent(containerElement) {
        if (!containerElement) {
            console.error("SistemaAgua: El contenedor para el contenido no fue provisto.");
            return;
        }
        containerElement.innerHTML = ''; // Limpiar contenedor

        const sistemaAguaHTML = `
            <div class="sistema-agua p-4">
                <h3 class="text-xl font-semibold mb-4 text-center text-sky-300">Sistema de Agua Viva</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${this.renderColumna('valor', 'Principios de Valor')}
                    ${this.renderColumna('anadir', 'Prácticas a Añadir')}
                    ${this.renderColumna('no_anadir', 'Hábitos a No Añadir')}
                </div>
            </div>
        `;
        containerElement.innerHTML = sistemaAguaHTML;
        this.addEventListeners();
        console.log("SistemaAgua: Contenido renderizado.");
    }

    renderColumna(idColumna, titulo) {
        let elementosHTML = '';
        this.columnas[idColumna].forEach(el => {
            elementosHTML += `<div id="${el.id}" class="elemento-agua p-2 mb-2 bg-gray-600 rounded cursor-grab" draggable="true">${el.text}</div>`;
        });

        return `
            <div id="agua-columna-${idColumna}" class="columna-agua bg-gray-700 p-3 rounded min-h-[200px]">
                <h4 class="text-lg font-medium mb-3 text-center text-gray-300">${titulo}</h4>
                <div id="agua-elementos-${idColumna}" class="elementos-container space-y-2 min-h-[150px]">
                    ${elementosHTML}
                </div>
                <button class="btn-anadir-elemento-agua mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm" data-columna="${idColumna}">+ Añadir Elemento</button>
            </div>
        `;
    }

    actualizarRenderColumna(idColumna) {
        const columnaDiv = document.getElementById(`agua-columna-${idColumna}`);
        if (!columnaDiv) return;

        const titulo = columnaDiv.querySelector('h4').textContent; // Re-usar el título existente
        const newColumnaHTML = this.renderColumna(idColumna, titulo);

        // Para no perder los event listeners del contenedor principal, actualizamos solo el interior.
        // O mejor, encontrar el contenedor específico y reemplazarlo.
        // Por simplicidad ahora, si el contenedor de todas las columnas existe, lo re-renderizamos.
        // Esto es ineficiente para una sola columna, pero más simple de implementar ahora.
        const sistemaAguaContainer = columnaDiv.closest('.sistema-agua');
        if (sistemaAguaContainer && sistemaAguaContainer.parentElement) {
             this.renderContent(sistemaAguaContainer.parentElement);
        } else {
             // Fallback si la estructura es inesperada
             console.warn("No se pudo re-renderizar la columna de forma optimizada. Re-renderizando todo el contenido de SistemaAgua.");
             if(this.appCore && this.appCore.uiManager && this.appCore.uiManager.findElement){
                const teoriaPageContent = this.appCore.uiManager.findElement('#teoriaPageContent');
                if(teoriaPageContent) this.renderContent(teoriaPageContent);
             }
        }
    }


    addEventListeners() {
        // Drag and Drop
        const elementos = document.querySelectorAll('.elemento-agua');
        elementos.forEach(el => {
            el.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', event.target.id);
                event.dataTransfer.setData('text/columna-origen', event.target.closest('.columna-agua').id.split('-').pop());
                event.target.classList.add('opacity-50');
                console.log(`DragStart: ${event.target.id} desde ${event.target.closest('.columna-agua').id.split('-').pop()}`);
            });
            el.addEventListener('dragend', (event) => {
                event.target.classList.remove('opacity-50');
            });
        });

        const columnasDrop = document.querySelectorAll('.columna-agua');
        columnasDrop.forEach(col => {
            col.addEventListener('dragover', (event) => {
                event.preventDefault(); // Necesario para permitir drop
                col.classList.add('bg-gray-650'); // Feedback visual
            });
            col.addEventListener('dragleave', (event) => {
                col.classList.remove('bg-gray-650');
            });
            col.addEventListener('drop', (event) => {
                event.preventDefault();
                col.classList.remove('bg-gray-650');
                const elementoId = event.dataTransfer.getData('text/plain');
                const columnaOrigenId = event.dataTransfer.getData('text/columna-origen');
                const columnaDestinoId = col.id.replace('agua-columna-', '');

                console.log(`Drop: Elemento ${elementoId} desde ${columnaOrigenId} a ${columnaDestinoId}`);

                if (columnaOrigenId !== columnaDestinoId) {
                    // Mover el elemento en la data
                    const elementoIndex = this.columnas[columnaOrigenId].findIndex(e => e.id === elementoId);
                    if (elementoIndex > -1) {
                        const [elementoMovido] = this.columnas[columnaOrigenId].splice(elementoIndex, 1);
                        this.columnas[columnaDestinoId].push(elementoMovido);

                        // Re-renderizar las columnas afectadas
                        this.actualizarRenderColumna(columnaOrigenId);
                        this.actualizarRenderColumna(columnaDestinoId);
                        console.log("SistemaAgua: Elemento movido y columnas re-renderizadas.");
                    } else {
                         console.warn(`Elemento con id ${elementoId} no encontrado en columna ${columnaOrigenId}`);
                    }
                }
            });
        });

        // Botones "+ Añadir Elemento"
        const botonesAnadir = document.querySelectorAll('.btn-anadir-elemento-agua');
        botonesAnadir.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const columnaId = event.target.dataset.columna;
                const nombreElemento = prompt(`Nombre del nuevo elemento para "${columnaId}":`);
                if (nombreElemento && nombreElemento.trim() !== "") {
                    this.columnas[columnaId].push({ id: this.nextId(), text: nombreElemento.trim() });
                    this.actualizarRenderColumna(columnaId);
                     console.log(`SistemaAgua: Elemento "${nombreElemento}" añadido a columna ${columnaId} y columna re-renderizada.`);
                }
            });
        });
    }

    getCurrentWaterLevel() { // Método de ejemplo, no usado directamente
        return "<p>Nivel de Agua Viva: 75% (de SistemaAgua.js)</p>";
    }
}

// window.SistemaAgua = SistemaAgua;
