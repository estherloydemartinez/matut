// Ajustes.js - Módulo para la sección de Ajustes
console.log("Ajustes.js cargado.");

class Ajustes {
    constructor(appCore) {
        this.appCore = appCore;
        console.log("Módulo Ajustes inicializado.");
    }

    renderContent(containerElement) {
        if (!containerElement) {
            console.error("Ajustes.renderContent: Contenedor no provisto.");
            return;
        }
        containerElement.innerHTML = ''; // Limpiar

        const currentTheme = this.appCore.stateManager.getState('app.theme', 'dark');
        const currentFontSize = this.appCore.stateManager.getState('user.preferences.fontSize', 'text-base');
        const currentBibleVersion = this.appCore.stateManager.getState('user.preferences.bibleVersion', 'RV1960');
        const notificationsLectura = this.appCore.stateManager.getState('user.preferences.notifications.lectura', true);
        const notificationsSocial = this.appCore.stateManager.getState('user.preferences.notifications.social', true);

        const ajustesHTML = `
            <div class="ajustes-page p-4 md:p-6">
                <h3 class="text-2xl font-semibold mb-6 text-center text-purple-300">Ajustes de la Aplicación</h3>

                <!-- Sección Apariencia -->
                <div class="mb-8 p-4 bg-gray-750 rounded-lg shadow">
                    <h4 class="text-xl font-medium mb-4 text-gray-200 border-b border-gray-700 pb-2">Apariencia</h4>

                    <div class="setting-item mb-4">
                        <label class="block text-sm font-medium text-gray-300 mb-1">Tema</label>
                        <div id="theme-selector" class="flex space-x-2">
                            <button data-theme="light" class="theme-btn py-2 px-4 rounded ${currentTheme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500'}">Claro</button>
                            <button data-theme="dark" class="theme-btn py-2 px-4 rounded ${currentTheme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500'}">Oscuro</button>
                        </div>
                    </div>

                    <div class="setting-item">
                        <label class="block text-sm font-medium text-gray-300 mb-1">Tamaño de Fuente</label>
                        <select id="fontSize-selector" class="w-full md:w-1/2 p-2 bg-gray-600 text-white border border-gray-500 rounded focus:ring-purple-400 focus:border-purple-400">
                            <option value="text-sm" ${currentFontSize === 'text-sm' ? 'selected' : ''}>Pequeño</option>
                            <option value="text-base" ${currentFontSize === 'text-base' ? 'selected' : ''}>Mediano</option>
                            <option value="text-lg" ${currentFontSize === 'text-lg' ? 'selected' : ''}>Grande</option>
                            <option value="text-xl" ${currentFontSize === 'text-xl' ? 'selected' : ''}>Muy Grande</option>
                        </select>
                    </div>
                </div>

                <!-- Sección Estudio (Placeholder) -->
                <div class="mb-8 p-4 bg-gray-750 rounded-lg shadow">
                    <h4 class="text-xl font-medium mb-4 text-gray-200 border-b border-gray-700 pb-2">Estudio</h4>
                    <div class="setting-item">
                        <label for="bibleVersion-selector" class="block text-sm font-medium text-gray-300 mb-1">Versión Bíblica Principal</label>
                        <select id="bibleVersion-selector" class="w-full md:w-1/2 p-2 bg-gray-600 text-white border border-gray-500 rounded focus:ring-purple-400 focus:border-purple-400" disabled>
                            <option value="RV1960" ${currentBibleVersion === 'RV1960' ? 'selected' : ''}>Reina Valera 1960</option>
                            <option value="NVI" ${currentBibleVersion === 'NVI' ? 'selected' : ''} disabled>Nueva Versión Internacional (Próximamente)</option>
                        </select>
                        <p class="text-xs text-gray-500 mt-1">Más versiones estarán disponibles pronto.</p>
                    </div>
                </div>

                <!-- Sección Notificaciones (Placeholder) -->
                <div class="p-4 bg-gray-750 rounded-lg shadow">
                    <h4 class="text-xl font-medium mb-4 text-gray-200 border-b border-gray-700 pb-2">Notificaciones</h4>
                    <div class="setting-item mb-3">
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" id="notif-lectura" class="form-checkbox h-5 w-5 text-purple-500 bg-gray-600 border-gray-500 rounded focus:ring-purple-400"
                                   ${notificationsLectura ? 'checked' : ''} disabled>
                            <span class="ml-2 text-sm text-gray-300">Recordatorios de lectura</span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" id="notif-social" class="form-checkbox h-5 w-5 text-purple-500 bg-gray-600 border-gray-500 rounded focus:ring-purple-400"
                                   ${notificationsSocial ? 'checked' : ''} disabled>
                            <span class="ml-2 text-sm text-gray-300">Actividad social relevante</span>
                        </label>
                         <p class="text-xs text-gray-500 mt-1">Configuración detallada de notificaciones próximamente.</p>
                    </div>
                </div>
            </div>
        `;
        containerElement.innerHTML = ajustesHTML;
        this.addEventListeners(containerElement);
        console.log("Ajustes: Contenido renderizado.");
    }

    addEventListeners(container) {
        // Tema
        container.querySelectorAll('.theme-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const newTheme = event.target.dataset.theme;
                this.appCore.stateManager.setState('app.theme', newTheme);
                // UIManager.applyTheme se encarga de la clase en <html> y de actualizar los botones aquí si es necesario
                // this.updateThemeButtons(newTheme, container); // Opcional, si applyTheme no lo hace
            });
        });

        // Tamaño de Fuente
        const fontSizeSelector = container.querySelector('#fontSize-selector');
        if (fontSizeSelector) {
            fontSizeSelector.addEventListener('change', (event) => {
                const newSizeClass = event.target.value;
                this.appCore.stateManager.setState('user.preferences.fontSize', newSizeClass);
                // La subscripción en AppCore a 'user.preferences.fontSize' llamará a UIManager.applyFontSize
            });
        }

        // Placeholder para otros listeners (Biblia, Notificaciones)
        // container.querySelector('#bibleVersion-selector').addEventListener('change', ...);
        // container.querySelector('#notif-lectura').addEventListener('change', ...);
    }

    // Si UIManager.applyTheme no actualiza los botones aquí directamente, este método podría ser llamado
    // por UIManager o por una subscripción en AjustesManager.
    updateThemeButtons(activeTheme, container = document) {
        container.querySelectorAll('.theme-btn').forEach(button => {
            if (button.dataset.theme === activeTheme) {
                button.classList.replace('bg-gray-600', 'bg-blue-600');
                button.classList.add('text-white');
            } else {
                button.classList.replace('bg-blue-600', 'bg-gray-600');
                button.classList.remove('text-white');
            }
        });
    }
     updateFontSizeSelector(newSizeClass, container = document) {
        const fontSizeSelector = container.querySelector('#fontSize-selector');
        if (fontSizeSelector) {
            fontSizeSelector.value = newSizeClass;
        }
    }


    getSettingsForm() { // Método de ejemplo, no usado por UIManager directamente
        return `<h2>Configuración de la Aplicación</h2> ... (formulario) ...`;
    }
}

// window.Ajustes = Ajustes;
