// HerramientasAnaliticas.js - Módulo para herramientas de análisis bíblico
console.log("HerramientasAnaliticas.js cargado.");

class HerramientasAnaliticas {
    constructor(appCore) {
        this.appCore = appCore;
        console.log("Módulo HerramientasAnaliticas inicializado.");
        this.mockTools = [
            {
                category: "Análisis de Texto",
                tools: [
                    { id: "concordancia", name: "Concordancia", description: "Busca palabras y sus apariciones." },
                    { id: "frecuencia_palabras", name: "Frecuencia de Palabras", description: "Muestra las palabras más usadas." },
                    { id: "comparar_versiones", name: "Comparar Versiones", description: "Compara el texto en diferentes versiones." }
                ]
            },
            {
                category: "Referencias y Contexto",
                tools: [
                    { id: "referencias_cruzadas", name: "Referencias Cruzadas", description: "Encuentra versículos relacionados." },
                    { id: "comentarios_biblicos", name: "Comentarios Bíblicos", description: "Accede a comentarios de eruditos." },
                    { id: "mapas_historicos", name: "Mapas Históricos", description: "Visualiza lugares bíblicos." }
                ]
            },
            {
                category: "Estudio Lingüístico",
                tools: [
                    { id: "diccionario_hebreo", name: "Diccionario Hebreo", description: "Consulta significados de palabras hebreas." },
                    { id: "diccionario_griego", name: "Diccionario Griego", description: "Consulta significados de palabras griegas." },
                    { id: "interlineal", name: "Biblia Interlineal", description: "Texto original con traducción literal." }
                ]
            }
        ];
    }

    renderPanel(containerElement) {
        if (!containerElement) {
            console.error("HerramientasAnaliticas: El contenedor para el panel no fue provisto.");
            return;
        }
        containerElement.innerHTML = ''; // Limpiar contenedor

        let panelHTML = '<h4 class="text-lg font-semibold mb-3 text-white">Herramientas Analíticas</h4>';
        panelHTML += '<div class="space-y-4">';

        this.mockTools.forEach(category => {
            panelHTML += `<div class="p-2 rounded bg-gray-700">`;
            panelHTML += `<h5 class="text-md font-semibold text-blue-300 mb-2">${category.category}</h5>`;
            panelHTML += '<ul class="space-y-1">';
            category.tools.forEach(tool => {
                panelHTML += `<li><button data-toolid="${tool.id}" class="tool-button text-left w-full text-sm text-gray-200 hover:text-blue-400 focus:outline-none">
                                ${tool.name}
                              </button></li>`;
            });
            panelHTML += '</ul></div>';
        });

        panelHTML += '</div>';
        containerElement.innerHTML = panelHTML;
        this.addEventListenersToTools(containerElement);
        console.log("HerramientasAnaliticas: Panel renderizado.");
    }

    addEventListenersToTools(containerElement) {
        const toolButtons = containerElement.querySelectorAll('.tool-button');
        toolButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const toolId = event.target.dataset.toolid;
                const tool = this.findToolById(toolId);
                if (tool) {
                    alert(`Herramienta '${tool.name}' seleccionada. Implementación pendiente.\nDescripción: ${tool.description}`);
                    console.log(`Herramienta seleccionada: ${tool.name} (ID: ${toolId})`);
                    // Aquí se podría llamar a una función para activar la herramienta específica
                    // this.activateTool(tool);
                }
            });
        });
    }

    findToolById(toolId) {
        for (const category of this.mockTools) {
            const foundTool = category.tools.find(tool => tool.id === toolId);
            if (foundTool) return foundTool;
        }
        return null;
    }

    // Placeholder para futura activación de herramienta
    // activateTool(tool) {
    //     console.log(`Activando herramienta: ${tool.name}`);
    //     // Lógica para mostrar la UI de la herramienta, interactuar con el texto bíblico, etc.
    // }

    searchConcordance(term) { // Método de ejemplo, no usado directamente en renderPanel
        return `<p>Resultados de concordancia para "${term}" (de HerramientasAnaliticas.js)</p>`;
    }
}

// window.HerramientasAnaliticas = HerramientasAnaliticas;
