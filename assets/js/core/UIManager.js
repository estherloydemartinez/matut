// UIManager.js - Manejo de la interfaz de usuario
console.log("UIManager.js cargado.");

class UIManager {
    constructor(stateManager, appCore) {
        this.stateManager = stateManager;
        this.appCore = appCore;

        this.pageContent = document.getElementById('pageContent');
        this.appHeader = document.getElementById('appHeader');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.appContainer = document.getElementById('appContainer');
        this.sidebar = document.getElementById('sidebar');

        this.previousFontSizeClass = this.appCore.stateManager.getState('user.preferences.fontSize', 'text-base');


        if (!this.pageContent) console.error("UIManager: Elemento pageContent no encontrado.");
        console.log("UIManager inicializado.");
    }

    renderSection(sectionName) {
        this.updateHeader(sectionName);

        if (this.pageContent) {
            if (sectionName === 'teoria') {
                this.renderTeoriaTabs();
                const currentTeoriaSub = this.stateManager.getState('app.teoria.currentSubSection', 'lectura');
                this.renderTeoriaSubSection(currentTeoriaSub);
                this.updateTeoriaTabsUI(currentTeoriaSub);
            } else if (sectionName === 'practica') {
                this.renderPracticaTabs();
                const currentPracticaSub = this.stateManager.getState('app.practica.currentSubSection', 'orar');
                this.renderPracticaSubSection(currentPracticaSub);
                this.updatePracticaTabsUI(currentPracticaSub);
            } else if (sectionName === 'social') {
                this.renderSocialTabs();
                const currentSocialSub = this.stateManager.getState('app.social.currentSubSection', 'feed');
                this.renderSocialSubSection(currentSocialSub);
                this.updateSocialTabsUI(currentSocialSub);
            } else if (sectionName === 'inicio') {
                if (this.appCore.inicioManager && typeof this.appCore.inicioManager.renderContent === 'function') {
                    this.appCore.inicioManager.renderContent(this.pageContent);
                } else {
                    this.pageContent.innerHTML = '<h2>Error: Módulo de Inicio no cargado correctamente.</h2>';
                }
            } else if (sectionName === 'ajustes') {
                 if (this.appCore.ajustesManager && typeof this.appCore.ajustesManager.renderContent === 'function') {
                    this.appCore.ajustesManager.renderContent(this.pageContent);
                } else {
                    this.pageContent.innerHTML = '<h2>Error: Módulo de Ajustes no cargado correctamente.</h2>';
                }
            } else {
                const title = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
                this.pageContent.innerHTML = `<h1>${title}</h1><p>Contenido de la sección ${sectionName}...</p>`;
            }
            console.log(`UIManager: Sección renderizada - ${sectionName}`);
        } else {
            console.error("UIManager: No se puede renderizar la sección, pageContent no existe.");
        }
    }

    // --- Métodos para la sección Teoría --- (sin cambios significativos)
    renderTeoriaTabs() { /* ... */
        const teoriaTabsHTML = `
            <div class="tabs-container mb-4 flex flex-wrap">
                <button class="tab-button teoria-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="lectura">Lectura</button>
                <button class="tab-button teoria-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="memorizacion">Memorización</button>
                <button class="tab-button teoria-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="agua">Sistema Agua</button>
                <button class="tab-button teoria-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="filtros-analiticos">Filtros Analíticos</button>
                <button class="tab-button teoria-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="analisis">Análisis Profundo</button>
            </div>
            <div id="teoriaPageContent" class="p-4 bg-gray-800 rounded-b-md rounded-r-md min-h-[calc(100vh-12rem)]"></div>`;
        this.pageContent.innerHTML = teoriaTabsHTML;
        this.pageContent.querySelectorAll('.teoria-tab').forEach(button => {
            button.addEventListener('click', () => {
                const subSectionName = button.dataset.subsection;
                this.appCore.stateManager.setState('app.teoria.currentSubSection', subSectionName);
            });
        });
    }
    updateTeoriaTabsUI(activeSubSection) { /* ... */
        this.pageContent.querySelectorAll('.teoria-tab').forEach(button => {
            if (button.dataset.subsection === activeSubSection) {
                button.classList.replace('bg-gray-600', 'bg-gray-800'); button.classList.add('font-semibold');
            } else {
                button.classList.replace('bg-gray-800', 'bg-gray-600'); button.classList.remove('font-semibold');
            }
        });
    }
    renderTeoriaSubSection(subSectionName) { /* ... */
        const container = document.getElementById('teoriaPageContent');
        if (!container) return;
        this.updateHeader('teoria');
        this.updateTeoriaTabsUI(subSectionName);
         switch (subSectionName) {
            case 'lectura': this.appCore.lecturaManager?.renderContent(container); break;
            case 'memorizacion': this.appCore.memorizacionManager?.renderContent(container); break;
            case 'agua': this.appCore.sistemaAguaManager?.renderContent(container); break;
            case 'filtros-analiticos': this.appCore.filtrosAnaliticosManager?.renderContent(container); break;
            case 'analisis': container.innerHTML = `<h2>Análisis Profundo (En desarrollo)</h2>`; break;
            default: container.innerHTML = `<h2>Subsección Teoría: ${subSectionName} no reconocida.</h2>`;
        }
    }

    // --- Métodos para la sección Práctica --- (sin cambios significativos)
    renderPracticaTabs() { /* ... */
        const practicaTabsHTML = `
            <div class="tabs-container mb-4 flex flex-wrap">
                <button class="tab-button practica-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="orar">Recibir / Orar</button>
                <button class="tab-button practica-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="accion">Dar / Accionar</button>
            </div>
            <div id="practicaPageContent" class="p-4 bg-gray-800 rounded-b-md rounded-r-md min-h-[calc(100vh-12rem)]"></div>`;
        this.pageContent.innerHTML = practicaTabsHTML;
        this.pageContent.querySelectorAll('.practica-tab').forEach(button => {
            button.addEventListener('click', () => {
                const subSectionName = button.dataset.subsection;
                this.appCore.stateManager.setState('app.practica.currentSubSection', subSectionName);
            });
        });
    }
    updatePracticaTabsUI(activeSubSection) { /* ... */
        this.pageContent.querySelectorAll('.practica-tab').forEach(button => {
            if (button.dataset.subsection === activeSubSection) {
                 button.classList.replace('bg-gray-600', 'bg-gray-800'); button.classList.add('font-semibold');
            } else {
                button.classList.replace('bg-gray-800', 'bg-gray-600'); button.classList.remove('font-semibold');
            }
        });
    }
    renderPracticaSubSection(subSectionName) { /* ... */
        const container = document.getElementById('practicaPageContent');
        if (!container) return;
        this.updateHeader('practica');
        this.updatePracticaTabsUI(subSectionName);
        switch (subSectionName) {
            case 'orar': this.appCore.practicaManager?.renderOrar(container); break;
            case 'accion': this.appCore.practicaManager?.renderAccion(container); break;
            default: container.innerHTML = `<h2>Subsección Práctica: ${subSectionName} no reconocida.</h2>`;
        }
    }

    // --- Métodos para la sección Social --- (sin cambios significativos)
    renderSocialTabs() { /* ... */
        const socialTabsHTML = `
            <div class="tabs-container mb-4 flex flex-wrap">
                <button class="tab-button social-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="feed">Feed</button>
                <button class="tab-button social-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="comunidades">Comunidades</button>
                <button class="tab-button social-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="competencias">Competencias</button>
                <button class="tab-button social-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="desafios">Desafíos</button>
                <button class="tab-button social-tab py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-t-md mr-1 mb-1" data-subsection="conexiones">Conexiones</button>
            </div>
            <div id="socialPageContent" class="p-4 bg-gray-800 rounded-b-md rounded-r-md min-h-[calc(100vh-12rem)]"></div>`;
        this.pageContent.innerHTML = socialTabsHTML;
        this.pageContent.querySelectorAll('.social-tab').forEach(button => {
            button.addEventListener('click', () => {
                const subSectionName = button.dataset.subsection;
                this.appCore.stateManager.setState('app.social.currentSubSection', subSectionName);
            });
        });
    }
    updateSocialTabsUI(activeSubSection) { /* ... */
         this.pageContent.querySelectorAll('.social-tab').forEach(button => {
             if (button.dataset.subsection === activeSubSection) {
                button.classList.replace('bg-gray-600', 'bg-gray-800'); button.classList.add('font-semibold');
            } else {
                button.classList.replace('bg-gray-800', 'bg-gray-600'); button.classList.remove('font-semibold');
            }
        });
    }
    renderSocialSubSection(subSectionName) { /* ... */
        const container = document.getElementById('socialPageContent');
        if (!container) return;
        this.updateHeader('social');
        this.updateSocialTabsUI(subSectionName);
        switch (subSectionName) {
            case 'feed': this.appCore.socialManager?.renderFeed(container); break;
            case 'comunidades': this.appCore.socialManager?.renderComunidades(container); break;
            case 'competencias': this.appCore.socialManager?.renderCompetencias(container); break;
            case 'desafios': this.appCore.socialManager?.renderDesafios(container); break;
            case 'conexiones': this.appCore.socialManager?.renderConexiones(container); break;
            default: container.innerHTML = `<h2>Subsección Social: ${subSectionName} no reconocida.</h2>`;
        }
    }

    // --- Métodos Comunes Actualizados ---
    updateHeader(sectionName) {
        if (!this.appHeader) return;

        let breadcrumbText = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
        let controlsHTML = '';

        if (sectionName === 'teoria') {
            const subSection = this.stateManager.getState('app.teoria.currentSubSection');
            if (subSection) breadcrumbText += ` / ${subSection.charAt(0).toUpperCase() + subSection.slice(1)}`;
            controlsHTML = `<button id="social-teoria-btn" class="contextual-social-btn ml-auto bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-3 rounded text-sm" data-target-social-sub="competenciasTeoricas">Social (Teoría)</button>`;
        } else if (sectionName === 'practica') {
            const subSection = this.stateManager.getState('app.practica.currentSubSection');
            if (subSection) breadcrumbText += ` / ${subSection.charAt(0).toUpperCase() + subSection.slice(1)}`;
            controlsHTML = `<button id="social-practica-btn" class="contextual-social-btn ml-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm" data-target-social-sub="competenciasPracticas">Social (Práctica)</button>`;
        } else if (sectionName === 'social') {
            const subSection = this.stateManager.getState('app.social.currentSubSection');
            if (subSection) breadcrumbText += ` / ${subSection.charAt(0).toUpperCase() + subSection.slice(1)}`;
        } else if (sectionName === 'inicio') {
            controlsHTML = `<button id="social-inicio-btn" class="contextual-social-btn ml-auto bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-3 rounded text-sm" data-target-social-sub="feed">Social Combinado</button>`;
        } else if (sectionName === 'ajustes') {
            // No hay controles contextuales para Ajustes por ahora.
        }

        this.appHeader.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <h2 class="text-xl">${breadcrumbText}</h2>
                <div>${controlsHTML}</div>
            </div>`;

        this.appHeader.querySelectorAll('.contextual-social-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const targetSocialSub = event.target.dataset.targetSocialSub || 'feed';
                if (this.appCore.inicioManager && btn.id === 'social-inicio-btn') {
                    this.appCore.inicioManager.handleSocialCombinadoClick();
                } else {
                    this.appCore.stateManager.setState('app.currentSection', 'social');
                    this.appCore.stateManager.setState('app.social.currentSubSection', targetSocialSub);
                }
            });
        });
    }

    applyTheme(themeName) {
        document.documentElement.classList.toggle('dark', themeName === 'dark');
        console.log(`UIManager: Tema aplicado - ${themeName}`);
        // Si la página de ajustes está visible, actualizar sus controles
        if (this.stateManager.getState('app.currentSection') === 'ajustes' && this.appCore.ajustesManager) {
            this.appCore.ajustesManager.updateThemeButtons(themeName, this.findElement('#pageContent'));
        }
    }

    applyFontSize(newSizeClass) {
        if (this.previousFontSizeClass) {
            document.body.classList.remove(this.previousFontSizeClass);
        }
        document.body.classList.add(newSizeClass);
        this.previousFontSizeClass = newSizeClass;
        console.log(`UIManager: Tamaño de fuente aplicado - ${newSizeClass}`);
        // Si la página de ajustes está visible, actualizar sus controles
         if (this.stateManager.getState('app.currentSection') === 'ajustes' && this.appCore.ajustesManager) {
            this.appCore.ajustesManager.updateFontSizeSelector(newSizeClass, this.findElement('#pageContent'));
        }
    }

    findElement(selector) { /* ... */ return this.pageContent.querySelector(selector) || document.querySelector(selector); }
    showLoading(isLoading) { /* ... */
        if (this.loadingScreen && this.appContainer) {
            this.loadingScreen.style.display = isLoading ? 'flex' : 'none';
            this.appContainer.classList.toggle('hidden', isLoading);
        }
    }
    updateSidebar(activeSection) { /* ... */
        if (!this.sidebar) return;
        this.sidebar.querySelectorAll('.nav-link').forEach(link => {
            constisActive = link.dataset.section === activeSection;
            link.classList.toggle('active', isActive);
            link.classList.toggle('bg-gray-700', isActive);
            link.classList.toggle('font-semibold', isActive);
            link.classList.toggle('hover:bg-gray-700', !isActive);
        });
    }
}
// window.UIManager = UIManager;
