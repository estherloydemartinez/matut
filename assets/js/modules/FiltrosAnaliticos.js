// FiltrosAnaliticos.js - Módulo para gestionar filtros analíticos
console.log("FiltrosAnaliticos.js cargado.");

class FiltrosAnaliticos {
    constructor(appCore) {
        this.appCore = appCore;
        this.mockFiltros = {
            Mantenencia: [
                { id: "filtro_claridad", name: "Claridad del Pasaje", active: true },
                { id: "filtro_contexto_historico", name: "Contexto Histórico", active: true },
                { id: "filtro_genero_literario", name: "Género Literario", active: false }
            ],
            Aumentancia: [
                { id: "filtro_aplicacion_personal", name: "Aplicación Personal", active: true },
                { id: "filtro_relevancia_actual", name: "Relevancia Actual", active: true }
            ],
            Hermenéutica: [
                { id: "filtro_primer_uso", name: "Principio del Primer Uso", active: false },
                { id: "filtro_analogia_fe", name: "Analogía de la Fe", active: true }
            ],
            Lingüística: [
                { id: "filtro_palabras_clave", name: "Palabras Clave Griegas/Hebreas", active: false },
                { id: "filtro_tiempos_verbales", name: "Análisis de Tiempos Verbales", active: false }
            ]
        };
        // El estado de los filtros debería eventualmente vivir en StateManager
        console.log("Módulo FiltrosAnaliticos inicializado.");
    }

    renderContent(containerElement) {
        if (!containerElement) {
            console.error("FiltrosAnaliticos: El contenedor para el contenido no fue provisto.");
            return;
        }
        containerElement.innerHTML = ''; // Limpiar contenedor

        let filtrosHTML = `
            <div class="filtros-analiticos p-4">
                <h3 class="text-xl font-semibold mb-4 text-center text-teal-300">Gestión de Filtros Analíticos</h3>
                <div class="space-y-3">
        `;

        for (const categoria in this.mockFiltros) {
            filtrosHTML += `
                <details class="accordion-filtro bg-gray-700 rounded shadow">
                    <summary class="font-medium text-gray-200 p-3 cursor-pointer hover:bg-gray-650 rounded-t">
                        ${categoria}
                    </summary>
                    <div class="p-3 border-t border-gray-600">
                        <ul class="space-y-2">
            `;
            this.mockFiltros[categoria].forEach(filtro => {
                filtrosHTML += `
                            <li class="flex items-center justify-between">
                                <label for="${filtro.id}" class="text-sm text-gray-300">${filtro.name}</label>
                                <input type="checkbox" id="${filtro.id}" name="${filtro.id}" class="form-checkbox h-5 w-5 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
                                       data-categoria="${categoria}" data-id="${filtro.id}" ${filtro.active ? 'checked' : ''}>
                            </li>
                `;
            });
            filtrosHTML += `
                        </ul>
                    </div>
                </details>
            `;
        }

        filtrosHTML += `
                </div>
            </div>
        `;
        containerElement.innerHTML = filtrosHTML;
        this.addEventListeners(containerElement);
        console.log("FiltrosAnaliticos: Contenido renderizado.");
    }

    addEventListeners(containerElement) {
        const checkboxes = containerElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const filtroId = event.target.dataset.id;
                const categoria = event.target.dataset.categoria;
                const isActive = event.target.checked;

                // Actualizar el estado en mockFiltros (eventualmente en StateManager)
                const filtro = this.mockFiltros[categoria].find(f => f.id === filtroId);
                if (filtro) {
                    filtro.active = isActive;
                }

                console.log(`FiltroAnalitico: '${filtroId}' en '${categoria}' cambiado a: ${isActive}`);
                // Aquí se podría disparar un evento o actualizar StateManager para que otros módulos reaccionen.
                // this.appCore.stateManager.setState(`app.filtros.${categoria}.${filtroId}.active`, isActive);
            });
        });

        // Opcional: abrir/cerrar todos los acordeones
        // const summaries = containerElement.querySelectorAll('.accordion-filtro summary');
        // summaries.forEach(summary => {
        //     summary.addEventListener('click', (event) => {
        //         // Lógica para manejar el estado open/closed si no es nativo del <details>
        //     });
        // });
    }
}

// window.FiltrosAnaliticos = FiltrosAnaliticos;
