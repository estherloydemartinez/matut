// StateManager.js - Manejo del estado de la aplicación
console.log("StateManager.js cargado.");

class StateManager {
    constructor() {
        this.initialState = {
            app: {
                currentSection: 'inicio',
                theme: 'dark',
                isLoading: true,
                teoria: {
                    currentSubSection: 'lectura',
                    lectura: { currentModo: 'simple' }
                },
                practica: { currentSubSection: 'orar' },
                social: { currentSubSection: 'feed' },
                inicio: {},
                // app.theme ya existe y se inicializa a 'dark'
            },
            user: {
                profile: { name: 'Invitado', level: 1, xp: 0 },
                dailyCheckIn: { lastCheckInDate: null, streak: 0, completedTasksToday: [] },
                preferences: {
                    fontSize: 'text-base', // Clase de Tailwind
                    bibleVersion: 'RV1960',
                    notifications: { lectura: true, social: true }
                }
            },
            bible: { currentBook: null, currentChapter: null } // Estado para la lectura actual
        };
        this.state = JSON.parse(JSON.stringify(this.initialState)); // Deep copy
        this.subscribers = {}; // path: [callback, callback, ...]
        console.log("StateManager inicializado con estado:", this.state);
    }

    /**
     * Obtiene un valor del estado usando un path (ej. 'app.currentSection').
     * @param {string} path - El path al valor.
     * @param {*} defaultValue - Valor a retornar si el path no existe.
     * @returns {*} - El valor del estado o el defaultValue.
     */
    getState(path, defaultValue) {
        const keys = path.split('.');
        let current = this.state;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                // console.warn(`StateManager.getState: Path "${path}" no encontrado, retornando defaultValue.`);
                return defaultValue;
            }
        }
        return current;
    }

    /**
     * Obtiene un valor del estado usando un path (ej. 'app.currentSection').
     * @param {string} path - El path al valor.
     * @param {*} defaultValue - Valor a retornar si el path no existe.
     * @returns {*} - El valor del estado o el defaultValue.
     */
    getState(path, defaultValue) {
        const keys = path.split('.');
        let current = this.state;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        return current;
    }

    /**
     * Establece un valor en el estado usando un path.
     * @param {string} path - El path al valor.
     * @param {*} value - El nuevo valor.
     */
    setState(path, value) {
        const keys = path.split('.');
        let current = this.state;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {}; // Crear objeto si no existe en el path
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
        console.log(`Estado actualizado: ${path} =`, value);
        this.notifySubscribers(path, value);
    }

    /**
     * Suscribe un callback a cambios en un path específico del estado.
     * @param {string} path - El path del estado a observar.
     * @param {function} callback - Función a llamar cuando el estado cambie.
     */
    subscribe(path, callback) {
        if (!this.subscribers[path]) {
            this.subscribers[path] = [];
        }
        this.subscribers[path].push(callback);
        console.log(`Suscripción añadida para: ${path}`);
    }

    /**
     * Notifica a todos los suscriptores de un path específico.
     * @param {string} path - El path que cambió.
     * @param {*} value - El nuevo valor.
     */
    notifySubscribers(path, value) {
        // Notificar a los suscriptores del path exacto
        if (this.subscribers[path]) {
            this.subscribers[path].forEach(callback => callback(value));
        }

        // Notificar a los suscriptores de paths "padre"
        // (ej. si cambia 'app.teoria.lectura.currentModo', notificar a 'app.teoria.lectura', 'app.teoria', y 'app')
        const pathParts = path.split('.');
        let parentPath = '';
        for (let i = 0; i < pathParts.length - 1; i++) {
            parentPath = parentPath ? `${parentPath}.${pathParts[i]}` : pathParts[i];
            if (this.subscribers[parentPath]) {
                const parentState = this.getState(parentPath);
                if (parentState !== undefined) { // Asegurarse de que el estado padre exista
                    this.subscribers[parentPath].forEach(callback => callback(parentState));
                }
            }
        }
    }
}

// Para disponibilidad global temporal si no se usan módulos ES6 aún.
// window.StateManager = StateManager;
