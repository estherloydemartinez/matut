// AppCore.js - Lógica principal de la aplicación
console.log("AppCore.js cargado.");

// Asumiendo que StateManager y UIManager están disponibles globalmente
// Si fueran módulos ES6, serían:
// import StateManager from './StateManager.js';
// import UIManager from './UIManager.js';

class AppCore {
    constructor() {
        // Asegurarse de que las clases StateManager y UIManager estén definidas y disponibles
        if (typeof StateManager === 'undefined') {
            throw new Error("AppCore: StateManager no está definido. Asegúrate de que el script se cargue antes.");
        }
        if (typeof UIManager === 'undefined') {
            throw new Error("AppCore: UIManager no está definido. Asegúrate de que el script se cargue antes.");
        }
        // Verificar que todas las clases de módulos estén disponibles
        const moduleClasses = ['Teoria', 'Practica', 'Social', 'Inicio', 'Ajustes', 'Lectura', 'Memorizacion', 'SistemaAgua', 'HerramientasAnaliticas', 'DatosBiblicos'];
        for (const className of moduleClasses) {
            if (typeof window[className] === 'undefined') {
                // En un entorno de módulos ES6, esto sería un error de importación.
                // Por ahora, dependemos de la carga global de scripts.
                console.warn(`AppCore: La clase del módulo ${className} no está definida globalmente. Asegúrate de que el script se cargue antes.`);
            }
        }

        this.stateManager = new StateManager();
        // Pass 'this' (AppCore instance) to UIManager
        this.uiManager = new UIManager(this.stateManager, this);

        // Instanciar módulos principales
        // DatosBiblicos primero ya que Lectura depende de él
        this.datosBiblicosManager = typeof DatosBiblicos !== 'undefined' ? new DatosBiblicos() : null;

        this.teoriaManager = typeof Teoria !== 'undefined' ? new Teoria() : null;
        this.practicaManager = typeof Practica !== 'undefined' ? new Practica() : null;
        this.socialManager = typeof Social !== 'undefined' ? new Social() : null;
        this.inicioManager = typeof Inicio !== 'undefined' ? new Inicio() : null;
        this.ajustesManager = typeof Ajustes !== 'undefined' ? new Ajustes() : null;
        // LecturaManager ahora toma AppCore (this) como argumento
        this.lecturaManager = typeof Lectura !== 'undefined' ? new Lectura(this) : null;
        this.memorizacionManager = typeof Memorizacion !== 'undefined' ? new Memorizacion(this) : null;
        this.sistemaAguaManager = typeof SistemaAgua !== 'undefined' ? new SistemaAgua(this) : null;
        this.herramientasManager = typeof HerramientasAnaliticas !== 'undefined' ? new HerramientasAnaliticas(this) : null;
        this.filtrosAnaliticosManager = typeof FiltrosAnaliticos !== 'undefined' ? new FiltrosAnaliticos(this) : null;
        this.practicaManager = typeof Practica !== 'undefined' ? new Practica(this) : null;
        this.socialManager = typeof Social !== 'undefined' ? new Social(this) : null;
        this.inicioManager = typeof Inicio !== 'undefined' ? new Inicio(this) : null;
        this.ajustesManager = typeof Ajustes !== 'undefined' ? new Ajustes(this) : null; // Nueva instancia

        console.log("AppCore inicializado con StateManager, UIManager y todos los módulos principales.");
        // ... (warnings existentes) ...
        if (!this.practicaManager) console.warn("AppCore: practicaManager no pudo ser inicializado.");
        if (!this.socialManager) console.warn("AppCore: socialManager no pudo ser inicializado.");
        if (!this.inicioManager) console.warn("AppCore: inicioManager no pudo ser inicializado.");
        if (!this.ajustesManager) console.warn("AppCore: ajustesManager no pudo ser inicializado.");

        // Inicializar DatosBiblicosManager si existe
        if (this.datosBiblicosManager && typeof this.datosBiblicosManager.init === 'function') {
            this.datosBiblicosManager.init().then(() => {
                console.log("AppCore: DatosBiblicosManager inicializado después de su init().");
                // Disparar un evento o callback si otras partes de la app necesitan saber que los datos están listos
                // Por ejemplo, si UIManager necesita poblar selectores de libros inmediatamente.
                if (this.uiManager && typeof this.uiManager.onDatosBiblicosReady === 'function') {
                    this.uiManager.onDatosBiblicosReady();
                }
            }).catch(error => {
                console.error("AppCore: Error durante la inicialización de DatosBiblicosManager:", error);
            });
        } else if (this.datosBiblicosManager) {
            console.warn("AppCore: datosBiblicosManager no tiene un método init().");
        }
    }

    getDatosBiblicosManager() {
        return this.datosBiblicosManager;
    }

    init() {
        console.log("AppCore: Iniciando aplicación...");

        // Suscripciones a cambios de estado
        // La suscripción a app.currentSection se maneja más abajo y es más completa.
        // Esta más antigua se elimina para evitar duplicados.

        this.stateManager.subscribe('app.teoria.currentSubSection', (newSubSection) => {
            console.log("AppCore: app.teoria.currentSubSection cambió a", newSubSection);
            if (this.stateManager.getState('app.currentSection') === 'teoria') {
                 this.uiManager.renderTeoriaSubSection(newSubSection); // Esto ya actualiza el header y las pestañas
            }
        });

        this.stateManager.subscribe('app.teoria.lectura.currentModo', (newModo) => {
            console.log("AppCore: app.teoria.lectura.currentModo cambió a", newModo);
            // Solo re-renderizar si la sección actual es 'teoria' y la subsección es 'lectura'
            if (this.stateManager.getState('app.currentSection') === 'teoria' &&
                this.stateManager.getState('app.teoria.currentSubSection') === 'lectura') {
                if (this.lecturaManager && typeof this.lecturaManager.renderContent === 'function') {
                    const teoriaPageContent = this.uiManager.findElement('#teoriaPageContent');
                    if (teoriaPageContent) {
                        this.lecturaManager.renderContent(teoriaPageContent);
                    } else {
                        console.error("AppCore: No se encontró #teoriaPageContent para re-renderizar LecturaManager.");
                    }
                }
            }
        });

        this.stateManager.subscribe('app.practica.currentSubSection', (newSubSection) => {
            console.log("AppCore: app.practica.currentSubSection cambió a", newSubSection);
            if (this.stateManager.getState('app.currentSection') === 'practica') {
                 this.uiManager.renderPracticaSubSection(newSubSection);
            }
        });

        this.stateManager.subscribe('app.social.currentSubSection', (newSubSection) => {
            console.log("AppCore: app.social.currentSubSection cambió a", newSubSection);
            if (this.stateManager.getState('app.currentSection') === 'social') {
                 this.uiManager.renderSocialSubSection(newSubSection);
            }
        });

        this.stateManager.subscribe('app.theme', (newTheme) => {
            console.log("AppCore: app.theme cambió a", newTheme);
            this.uiManager.applyTheme(newTheme);
            // Notificar a AjustesManager para actualizar sus botones si la UI de Ajustes está activa
            if (this.stateManager.getState('app.currentSection') === 'ajustes' && this.ajustesManager) {
                this.ajustesManager.updateThemeButtons(newTheme, this.uiManager.findElement('#pageContent'));
            }
        });

        this.stateManager.subscribe('user.preferences.fontSize', (newSizeClass) => {
            console.log("AppCore: user.preferences.fontSize cambió a", newSizeClass);
            this.uiManager.applyFontSize(newSizeClass);
            // Notificar a AjustesManager para actualizar su selector si la UI de Ajustes está activa
             if (this.stateManager.getState('app.currentSection') === 'ajustes' && this.ajustesManager) {
                this.ajustesManager.updateFontSizeSelector(newSizeClass, this.uiManager.findElement('#pageContent'));
            }
        });

        // Suscripción de app.currentSection (actualizada para incluir 'ajustes')
        this.stateManager.subscribe('app.currentSection', (newSection) => {
            console.log("AppCore: app.currentSection cambió a", newSection);
            this.uiManager.renderSection(newSection);
            this.uiManager.updateSidebar(newSection);

            if (newSection === 'teoria') {
                const currentSubSection = this.stateManager.getState('app.teoria.currentSubSection', 'lectura');
                this.stateManager.setState('app.teoria.currentSubSection', currentSubSection);
            } else if (newSection === 'practica') {
                const currentSubSection = this.stateManager.getState('app.practica.currentSubSection', 'orar');
                this.stateManager.setState('app.practica.currentSubSection', currentSubSection);
            } else if (newSection === 'social') {
                const currentSubSection = this.stateManager.getState('app.social.currentSubSection', 'feed');
                this.stateManager.setState('app.social.currentSubSection', currentSubSection);
            } else if (newSection === 'inicio') {
                // No hay subsecciones en inicio por ahora
            } else if (newSection === 'ajustes') {
                // No hay subsecciones en ajustes por ahora
            }
        });


        this.stateManager.subscribe('app.isLoading', (isLoading) => {
            console.log("AppCore: app.isLoading cambió a", isLoading);
            this.uiManager.showLoading(isLoading);
        });

        // Configurar event listeners para la navegación
        const navLinks = document.querySelectorAll('#sidebar .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const sectionName = link.dataset.section;
                if (sectionName) {
                    console.log(`AppCore: Navegación a sección: ${sectionName}`);
                    this.stateManager.setState('app.currentSection', sectionName);
                } else {
                    console.warn("AppCore: Link de navegación sin data-section.", link);
                }
            });
        });
        console.log("AppCore: Event listeners de navegación configurados.");

        // Establecer estado inicial de la aplicación
        // El orden es importante aquí.
        // 1. Aplicar tema (para que la UI no parpadee si el tema por defecto del HTML es distinto)
        // 2. Mostrar la sección inicial (esto también actualiza la sidebar)
        // 3. Finalmente, quitar la pantalla de carga.

        this.stateManager.setState('app.theme', this.stateManager.getState('app.theme', 'dark'));
        this.stateManager.setState('app.currentSection', this.stateManager.getState('app.currentSection', 'inicio'));
        this.stateManager.setState('app.isLoading', false); // Esto oculta loading y muestra la app

        // Inicializar iconos Lucide si están disponibles
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
            console.log("AppCore: Iconos Lucide actualizados.");
        } else {
            console.log("AppCore: Lucide no disponible o createIcons no es una función.");
        }

        console.log("AppCore: Inicialización completada.");
    }

    // Placeholder para el sistema de gamificación/XP
    addXP(activity, metadata) {
        console.log(`AppCore.addXP: Actividad '${activity}' completada.`, metadata);
        const currentXP = this.stateManager.getState('user.profile.xp', 0);
        let points = 0;
        if (activity === 'checkin_diario' && metadata && metadata.count) {
            points = metadata.count * 10; // Ej: 10 XP por tarea de check-in
        }
        // Añadir más lógica de puntos para otras actividades

        if (points > 0) {
            const newXP = currentXP + points;
            this.stateManager.setState('user.profile.xp', newXP);
            console.log(`AppCore.addXP: ${points} XP añadidos. Nuevo total: ${newXP} XP.`);
            // Aquí se podría verificar si sube de nivel.
        }
    }
}

// Para disponibilidad global temporal si no se usan módulos ES6 aún.
// window.AppCore = AppCore;
