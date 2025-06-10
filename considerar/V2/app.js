/**
 * BibliaApp Pro - Core Application
 * Sistema de Control Principal de Clase Mundial
 */

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================

const AppConfig = {
    version: '2.0.0',
    environment: 'production',
    debug: false,
    
    // APIs y servicios
    api: {
        baseUrl: 'https://api.bibliaapp.com',
        timeout: 30000,
        retries: 3
    },
    
    // Cache y storage
    cache: {
        enabled: true,
        maxSize: 50, // MB
        expiration: 7 * 24 * 60 * 60 * 1000 // 7 días
    },
    
    // UI y UX
    ui: {
        animationDuration: 300,
        debounceDelay: 300,
        pageSize: 20,
        maxSearchResults: 100
    },
    
    // Gamificación
    gamification: {
        xpPerChapter: 10,
        xpPerVerse: 1,
        xpPerPrayerMinute: 2,
        xpPerMemoryVerse: 15
    }
};

// ============================================================================
// CLASE PRINCIPAL DE LA APLICACIÓN
// ============================================================================

class BibliaApp {
    constructor() {
        this.state = new AppState();
        this.router = new AppRouter();
        this.ui = new UIManager();
        this.cache = new CacheManager();
        this.analytics = new AnalyticsManager();
        this.gamification = new GamificationManager();
        
        this.initialized = false;
        this.currentUser = null;
        this.activeSection = 'inicio';
        
        // Bindear métodos
        this.init = this.init.bind(this);
        this.handleError = this.handleError.bind(this);
        this.updateState = this.updateState.bind(this);
    }
    
    /**
     * Inicializar la aplicación
     */
    async init() {
        try {
            console.log('🚀 Iniciando BibliaApp Pro v' + AppConfig.version);
            
            // Verificar soporte del navegador
            if (!this.checkBrowserSupport()) {
                throw new Error('Navegador no soportado');
            }
            
            // Inicializar componentes core
            await this.initializeCore();
            
            // Cargar datos iniciales
            await this.loadInitialData();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Inicializar UI
            this.ui.init();
            
            // Inicializar router
            this.router.init();
            
            // Marcar como inicializado
            this.initialized = true;
            
            // Evento de inicialización completa
            this.emit('app:initialized');
            
            console.log('✅ BibliaApp Pro inicializada correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando BibliaApp:', error);
            this.handleError(error);
        }
    }
    
    /**
     * Verificar soporte del navegador
     */
    checkBrowserSupport() {
        const requiredFeatures = [
            'localStorage',
            'sessionStorage',
            'fetch',
            'Promise',
            'Map',
            'Set',
            'Object.assign'
        ];
        
        return requiredFeatures.every(feature => {
            const supported = feature in window || eval(`typeof ${feature} !== 'undefined'`);
            if (!supported) {
                console.warn(`⚠️ Característica no soportada: ${feature}`);
            }
            return supported;
        });
    }
    
    /**
     * Inicializar componentes core
     */
    async initializeCore() {
        // Inicializar estado
        await this.state.init();
        
        // Inicializar cache
        await this.cache.init();
        
        // Inicializar analytics
        if (AppConfig.environment === 'production') {
            await this.analytics.init();
        }
        
        // Inicializar gamificación
        await this.gamification.init();
        
        // Cargar configuración del usuario
        await this.loadUserConfig();
    }
    
    /**
     * Cargar datos iniciales
     */
    async loadInitialData() {
        const loadPromises = [
            this.loadBibleData(),
            this.loadUserProgress(),
            this.loadSocialData(),
            this.loadCommunityData()
        ];
        
        await Promise.allSettled(loadPromises);
    }
    
    /**
     * Cargar datos bíblicos
     */
    async loadBibleData() {
        try {
            // Cargar desde cache primero
            let bibleData = await this.cache.get('bible:data');
            
            if (!bibleData) {
                // Cargar datos básicos integrados
                bibleData = await import('../data/bible-data.js');
                await this.cache.set('bible:data', bibleData);
            }
            
            this.state.setBibleData(bibleData);
            this.emit('bible:data-loaded', bibleData);
            
        } catch (error) {
            console.error('Error cargando datos bíblicos:', error);
            // Usar datos de respaldo
            this.loadFallbackBibleData();
        }
    }
    
    /**
     * Cargar progreso del usuario
     */
    async loadUserProgress() {
        try {
            const progress = await this.cache.get('user:progress') || {
                level: 1,
                xp: 0,
                chaptersRead: 0,
                versesMemorized: 0,
                prayerMinutes: 0,
                achievements: [],
                streak: 0,
                lastActivity: null
            };
            
            this.state.setUserProgress(progress);
            this.emit('user:progress-loaded', progress);
            
        } catch (error) {
            console.error('Error cargando progreso:', error);
        }
    }
    
    /**
     * Cargar datos sociales
     */
    async loadSocialData() {
        try {
            const socialData = await this.cache.get('social:data') || {
                communities: [],
                groups: [],
                friends: [],
                events: [],
                notifications: []
            };
            
            this.state.setSocialData(socialData);
            this.emit('social:data-loaded', socialData);
            
        } catch (error) {
            console.error('Error cargando datos sociales:', error);
        }
    }
    
    /**
     * Cargar datos de comunidad
     */
    async loadCommunityData() {
        try {
            const communityData = await this.cache.get('community:data') || {
                posts: [],
                discussions: [],
                resources: [],
                leaderboards: []
            };
            
            this.state.setCommunityData(communityData);
            this.emit('community:data-loaded', communityData);
            
        } catch (error) {
            console.error('Error cargando datos de comunidad:', error);
        }
    }
    
    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Eventos del navegador
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
        window.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Eventos de teclado
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Eventos táctiles para móviles
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Eventos personalizados de la app
        this.on('section:change', this.handleSectionChange.bind(this));
        this.on('user:action', this.handleUserAction.bind(this));
        this.on('error', this.handleError.bind(this));
    }
    
    /**
     * Manejar cambio de sección
     */
    handleSectionChange(data) {
        const { section, previousSection } = data;
        
        // Analytics
        this.analytics.trackEvent('navigation', 'section_change', {
            from: previousSection,
            to: section
        });
        
        // Actualizar estado
        this.activeSection = section;
        this.state.setActiveSection(section);
        
        // Cargar datos específicos de la sección
        this.loadSectionData(section);
    }
    
    /**
     * Cargar datos específicos de sección
     */
    async loadSectionData(section) {
        switch (section) {
            case 'teoria':
                await this.loadTheoryData();
                break;
            case 'practica':
                await this.loadPracticeData();
                break;
            case 'social':
                await this.loadAdvancedSocialData();
                break;
            case 'herramientas':
                await this.loadToolsData();
                break;
        }
    }
    
    /**
     * Cargar datos de teoría
     */
    async loadTheoryData() {
        try {
            const theoryData = await this.cache.get('theory:data') || {
                readingModes: ['simple', 'deep'],
                memorizationTechniques: [],
                studyPlans: [],
                progress: {}
            };
            
            this.state.setTheoryData(theoryData);
            this.emit('theory:data-loaded', theoryData);
            
        } catch (error) {
            console.error('Error cargando datos de teoría:', error);
        }
    }
    
    /**
     * Cargar datos de práctica
     */
    async loadPracticeData() {
        try {
            const practiceData = await this.cache.get('practice:data') || {
                prayerGuides: [],
                lifeAreas: [],
                actionTracking: {},
                goals: []
            };
            
            this.state.setPracticeData(practiceData);
            this.emit('practice:data-loaded', practiceData);
            
        } catch (error) {
            console.error('Error cargando datos de práctica:', error);
        }
    }
    
    /**
     * Manejar acciones del usuario
     */
    handleUserAction(data) {
        const { action, details } = data;
        
        // Analytics
        this.analytics.trackEvent('user_action', action, details);
        
        // Gamificación
        this.gamification.processAction(action, details);
        
        // Actualizar progreso
        this.updateUserProgress(action, details);
    }
    
    /**
     * Actualizar progreso del usuario
     */
    updateUserProgress(action, details) {
        const progress = this.state.getUserProgress();
        
        switch (action) {
            case 'chapter_read':
                progress.chaptersRead++;
                this.gamification.addXP(AppConfig.gamification.xpPerChapter);
                break;
                
            case 'verse_memorized':
                progress.versesMemorized++;
                this.gamification.addXP(AppConfig.gamification.xpPerMemoryVerse);
                break;
                
            case 'prayer_completed':
                progress.prayerMinutes += details.duration || 0;
                this.gamification.addXP(details.duration * AppConfig.gamification.xpPerPrayerMinute);
                break;
                
            case 'daily_checkin':
                progress.streak++;
                progress.lastActivity = new Date().toISOString();
                break;
        }
        
        // Guardar progreso actualizado
        this.state.setUserProgress(progress);
        this.cache.set('user:progress', progress);
        
        // Emitir evento
        this.emit('user:progress-updated', progress);
    }
    
    /**
     * Manejar errores
     */
    handleError(error) {
        console.error('🚨 Error en BibliaApp:', error);
        
        // Analytics de errores
        this.analytics.trackError(error);
        
        // Mostrar notificación de error al usuario
        this.ui.showNotification({
            type: 'error',
            title: 'Error',
            message: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
            duration: 5000
        });
        
        // Emitir evento de error
        this.emit('app:error', error);
    }
    
    /**
     * Eventos del navegador
     */
    handleBeforeUnload(event) {
        // Guardar estado antes de cerrar
        this.saveState();
        
        // Mostrar confirmación si hay cambios sin guardar
        if (this.state.hasUnsavedChanges()) {
            event.preventDefault();
            event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
            return event.returnValue;
        }
    }
    
    handleOnline() {
        console.log('📶 Conexión restaurada');
        this.state.setOnlineStatus(true);
        this.emit('app:online');
        
        // Sincronizar datos pendientes
        this.syncPendingData();
    }
    
    handleOffline() {
        console.log('📵 Conexión perdida');
        this.state.setOnlineStatus(false);
        this.emit('app:offline');
        
        // Mostrar notificación
        this.ui.showNotification({
            type: 'warning',
            title: 'Sin conexión',
            message: 'Trabajando en modo offline',
            duration: 3000
        });
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // App en segundo plano
            this.saveState();
            this.emit('app:background');
        } else {
            // App en primer plano
            this.emit('app:foreground');
            
            // Verificar actualizaciones
            this.checkForUpdates();
        }
    }
    
    /**
     * Manejar eventos de teclado
     */
    handleKeyDown(event) {
        // Shortcuts de teclado
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'k':
                    event.preventDefault();
                    this.ui.focusSearch();
                    break;
                    
                case 's':
                    event.preventDefault();
                    this.saveState();
                    break;
                    
                case '/':
                    event.preventDefault();
                    this.ui.toggleShortcutsHelp();
                    break;
            }
        }
        
        // Tecla ESC
        if (event.key === 'Escape') {
            this.ui.closeModals();
        }
    }
    
    /**
     * Eventos táctiles
     */
    handleTouchStart(event) {
        this.touchStartTime = Date.now();
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
    }
    
    handleTouchEnd(event) {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - this.touchStartTime;
        
        // Detectar tap largo
        if (touchDuration > 500) {
            this.emit('touch:longpress', {
                element: event.target,
                duration: touchDuration
            });
        }
    }
    
    /**
     * Guardar estado de la aplicación
     */
    saveState() {
        try {
            const state = this.state.serialize();
            localStorage.setItem('bibliaapp:state', JSON.stringify(state));
            
            // Marcar como guardado
            this.state.markAsSaved();
            
            console.log('💾 Estado guardado');
            
        } catch (error) {
            console.error('Error guardando estado:', error);
        }
    }
    
    /**
     * Cargar configuración del usuario
     */
    async loadUserConfig() {
        try {
            const config = await this.cache.get('user:config') || {
                theme: 'auto',
                language: 'es',
                bibleVersion: 'rv1960',
                fontSize: 'medium',
                notifications: true,
                privacy: {
                    analytics: true,
                    socialSharing: true
                }
            };
            
            this.state.setUserConfig(config);
            this.applyUserConfig(config);
            
        } catch (error) {
            console.error('Error cargando configuración:', error);
        }
    }
    
    /**
     * Aplicar configuración del usuario
     */
    applyUserConfig(config) {
        // Aplicar tema
        if (config.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (config.theme === 'light') {
            document.documentElement.classList.remove('dark');
        }
        
        // Aplicar tamaño de fuente
        document.documentElement.style.setProperty('--base-font-size', 
            config.fontSize === 'small' ? '14px' :
            config.fontSize === 'large' ? '18px' : '16px'
        );
        
        // Configurar idioma
        document.documentElement.lang = config.language;
    }
    
    /**
     * Sincronizar datos pendientes
     */
    async syncPendingData() {
        try {
            const pendingData = await this.cache.get('pending:sync') || [];
            
            for (const data of pendingData) {
                await this.syncData(data);
            }
            
            // Limpiar datos pendientes
            await this.cache.remove('pending:sync');
            
            console.log('🔄 Sincronización completada');
            
        } catch (error) {
            console.error('Error sincronizando datos:', error);
        }
    }
    
    /**
     * Verificar actualizaciones
     */
    async checkForUpdates() {
        try {
            // Solo en producción
            if (AppConfig.environment !== 'production') return;
            
            const response = await fetch('/api/version');
            const data = await response.json();
            
            if (data.version !== AppConfig.version) {
                this.ui.showNotification({
                    type: 'info',
                    title: 'Actualización disponible',
                    message: 'Hay una nueva versión disponible. Recarga la página para actualizarla.',
                    duration: 10000,
                    actions: [
                        {
                            text: 'Recargar',
                            action: () => window.location.reload()
                        }
                    ]
                });
            }
            
        } catch (error) {
            // Ignorar errores de actualización
            console.log('No se pudo verificar actualizaciones');
        }
    }
    
    /**
     * Sistema de eventos
     */
    on(event, callback) {
        if (!this.eventListeners) this.eventListeners = {};
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(callback);
    }
    
    emit(event, data) {
        if (!this.eventListeners || !this.eventListeners[event]) return;
        
        this.eventListeners[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error en event listener para ${event}:`, error);
            }
        });
    }
    
    off(event, callback) {
        if (!this.eventListeners || !this.eventListeners[event]) return;
        
        const index = this.eventListeners[event].indexOf(callback);
        if (index > -1) {
            this.eventListeners[event].splice(index, 1);
        }
    }
    
    /**
     * API pública
     */
    
    // Obtener estado
    getState() {
        return this.state;
    }
    
    // Obtener configuración
    getConfig() {
        return AppConfig;
    }
    
    // Verificar si está inicializada
    isInitialized() {
        return this.initialized;
    }
    
    // Obtener versión
    getVersion() {
        return AppConfig.version;
    }
    
    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Obtener sección activa
    getActiveSection() {
        return this.activeSection;
    }
}

// ============================================================================
// GESTORES AUXILIARES
// ============================================================================

/**
 * Gestor de Estado de la Aplicación
 */
class AppState {
    constructor() {
        this.data = {
            initialized: false,
            online: navigator.onLine,
            activeSection: 'inicio',
            user: null,
            bible: null,
            progress: null,
            social: null,
            community: null,
            theory: null,
            practice: null,
            unsavedChanges: false
        };
        
        this.subscribers = [];
    }
    
    async init() {
        // Cargar estado persistido
        try {
            const savedState = localStorage.getItem('bibliaapp:state');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                this.data = { ...this.data, ...parsedState };
            }
        } catch (error) {
            console.error('Error cargando estado persistido:', error);
        }
    }
    
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            const index = this.subscribers.indexOf(callback);
            if (index > -1) this.subscribers.splice(index, 1);
        };
    }
    
    setState(newState) {
        this.data = { ...this.data, ...newState };
        this.data.unsavedChanges = true;
        this.notifySubscribers();
    }
    
    notifySubscribers() {
        this.subscribers.forEach(callback => {
            try {
                callback(this.data);
            } catch (error) {
                console.error('Error en subscriber de estado:', error);
            }
        });
    }
    
    // Métodos específicos
    setOnlineStatus(online) { this.setState({ online }); }
    setActiveSection(section) { this.setState({ activeSection: section }); }
    setBibleData(bible) { this.setState({ bible }); }
    setUserProgress(progress) { this.setState({ progress }); }
    setSocialData(social) { this.setState({ social }); }
    setCommunityData(community) { this.setState({ community }); }
    setTheoryData(theory) { this.setState({ theory }); }
    setPracticeData(practice) { this.setState({ practice }); }
    setUserConfig(config) { this.setState({ userConfig: config }); }
    
    // Getters
    getUserProgress() { return this.data.progress; }
    getBibleData() { return this.data.bible; }
    getSocialData() { return this.data.social; }
    
    hasUnsavedChanges() { return this.data.unsavedChanges; }
    markAsSaved() { this.data.unsavedChanges = false; }
    
    serialize() {
        // Excluir datos sensibles o temporales
        const { unsavedChanges, ...serializableData } = this.data;
        return serializableData;
    }
}

/**
 * Gestor de Cache
 */
class CacheManager {
    constructor() {
        this.memoryCache = new Map();
        this.maxMemorySize = 50; // MB
        this.storagePrefix = 'bibliaapp:cache:';
    }
    
    async init() {
        // Limpiar cache expirado
        this.cleanExpiredCache();
        
        // Verificar espacio disponible
        this.checkStorageSpace();
    }
    
    async get(key) {
        try {
            // Verificar cache en memoria primero
            if (this.memoryCache.has(key)) {
                const cached = this.memoryCache.get(key);
                if (!this.isExpired(cached)) {
                    return cached.data;
                }
                this.memoryCache.delete(key);
            }
            
            // Verificar localStorage
            const stored = localStorage.getItem(this.storagePrefix + key);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (!this.isExpired(parsed)) {
                    // Agregar a memoria para acceso rápido
                    this.memoryCache.set(key, parsed);
                    return parsed.data;
                }
                localStorage.removeItem(this.storagePrefix + key);
            }
            
            return null;
            
        } catch (error) {
            console.error('Error obteniendo del cache:', error);
            return null;
        }
    }
    
    async set(key, data, expiration = AppConfig.cache.expiration) {
        try {
            const cacheItem = {
                data,
                timestamp: Date.now(),
                expiration: expiration
            };
            
            // Guardar en memoria
            this.memoryCache.set(key, cacheItem);
            
            // Guardar en localStorage
            localStorage.setItem(this.storagePrefix + key, JSON.stringify(cacheItem));
            
            // Limpiar cache si es necesario
            this.cleanupIfNeeded();
            
        } catch (error) {
            console.error('Error guardando en cache:', error);
        }
    }
    
    async remove(key) {
        this.memoryCache.delete(key);
        localStorage.removeItem(this.storagePrefix + key);
    }
    
    isExpired(cacheItem) {
        return Date.now() - cacheItem.timestamp > cacheItem.expiration;
    }
    
    cleanExpiredCache() {
        // Limpiar memoria
        for (const [key, item] of this.memoryCache.entries()) {
            if (this.isExpired(item)) {
                this.memoryCache.delete(key);
            }
        }
        
        // Limpiar localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.storagePrefix)) {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    if (this.isExpired(item)) {
                        localStorage.removeItem(key);
                    }
                } catch (error) {
                    // Remover item corrupto
                    localStorage.removeItem(key);
                }
            }
        }
    }
    
    checkStorageSpace() {
        try {
            const usage = this.getStorageUsage();
            if (usage > this.maxMemorySize * 1024 * 1024) {
                console.warn('⚠️ Cache cerca del límite de espacio');
                this.cleanOldestItems();
            }
        } catch (error) {
            console.error('Error verificando espacio de storage:', error);
        }
    }
    
    getStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (key.startsWith(this.storagePrefix)) {
                total += localStorage[key].length;
            }
        }
        return total;
    }
    
    cleanOldestItems() {
        const items = [];
        
        // Recopilar items con timestamps
        for (let key in localStorage) {
            if (key.startsWith(this.storagePrefix)) {
                try {
                    const item = JSON.parse(localStorage[key]);
                    items.push({ key, timestamp: item.timestamp });
                } catch (error) {
                    // Remover item corrupto
                    localStorage.removeItem(key);
                }
            }
        }
        
        // Ordenar por timestamp y remover los más antiguos
        items.sort((a, b) => a.timestamp - b.timestamp);
        const toRemove = Math.ceil(items.length * 0.2); // Remover 20%
        
        for (let i = 0; i < toRemove; i++) {
            localStorage.removeItem(items[i].key);
        }
    }
    
    cleanupIfNeeded() {
        // Limpiar memoria si tiene demasiados items
        if (this.memoryCache.size > 100) {
            const keys = Array.from(this.memoryCache.keys());
            const toRemove = keys.slice(0, 20); // Remover los primeros 20
            toRemove.forEach(key => this.memoryCache.delete(key));
        }
    }
}

/**
 * Gestor de Analytics
 */
class AnalyticsManager {
    constructor() {
        this.enabled = AppConfig.environment === 'production';
        this.queue = [];
        this.sessionId = this.generateSessionId();
    }
    
    async init() {
        if (!this.enabled) return;
        
        // Inicializar analytics
        this.trackEvent('app', 'session_start', {
            version: AppConfig.version,
            userAgent: navigator.userAgent,
            language: navigator.language
        });
    }
    
    trackEvent(category, action, details = {}) {
        if (!this.enabled) return;
        
        const event = {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            category,
            action,
            details: {
                ...details,
                url: window.location.href,
                referrer: document.referrer
            }
        };
        
        this.queue.push(event);
        this.processQueue();
    }
    
    trackError(error) {
        this.trackEvent('error', 'javascript_error', {
            message: error.message,
            stack: error.stack,
            filename: error.filename,
            lineno: error.lineno
        });
    }
    
    processQueue() {
        if (this.queue.length === 0) return;
        
        // Procesar en lotes
        if (this.queue.length >= 10 || !this.processingTimeout) {
            this.processingTimeout = setTimeout(() => {
                this.sendBatch();
                this.processingTimeout = null;
            }, 5000);
        }
    }
    
    async sendBatch() {
        if (this.queue.length === 0) return;
        
        const batch = [...this.queue];
        this.queue = [];
        
        try {
            // Enviar a servicio de analytics (simulado)
            console.log('📊 Analytics batch:', batch);
            
            // En implementación real, enviar a Google Analytics, Mixpanel, etc.
            
        } catch (error) {
            console.error('Error enviando analytics:', error);
            // Requeuer los eventos
            this.queue.unshift(...batch);
        }
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

/**
 * Gestor de Gamificación
 */
class GamificationManager {
    constructor() {
        this.currentLevel = 1;
        this.currentXP = 0;
        this.achievements = [];
        this.streak = 0;
    }
    
    async init() {
        // Cargar progreso de gamificación
        const saved = localStorage.getItem('bibliaapp:gamification');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(this, data);
        }
    }
    
    addXP(amount) {
        this.currentXP += amount;
        
        // Verificar subida de nivel
        const newLevel = this.calculateLevel(this.currentXP);
        if (newLevel > this.currentLevel) {
            this.levelUp(newLevel);
        }
        
        // Guardar progreso
        this.save();
        
        // Emitir evento
        window.App.emit('gamification:xp-gained', { amount, total: this.currentXP });
    }
    
    calculateLevel(xp) {
        // Fórmula: nivel = floor(sqrt(xp / 100)) + 1
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }
    
    levelUp(newLevel) {
        const oldLevel = this.currentLevel;
        this.currentLevel = newLevel;
        
        // Mostrar celebración
        window.App.ui.showLevelUpCelebration(oldLevel, newLevel);
        
        // Emitir evento
        window.App.emit('gamification:level-up', { from: oldLevel, to: newLevel });
    }
    
    processAction(action, details) {
        // Verificar logros
        this.checkAchievements(action, details);
        
        // Actualizar streak
        if (action === 'daily_checkin') {
            this.updateStreak();
        }
    }
    
    checkAchievements(action, details) {
        // Lista de logros disponibles
        const availableAchievements = [
            {
                id: 'first_chapter',
                name: 'Primer Capítulo',
                description: 'Lee tu primer capítulo',
                condition: (action) => action === 'chapter_read',
                icon: '📖'
            },
            {
                id: 'prayer_warrior',
                name: 'Guerrero de Oración',
                description: 'Ora durante 60 minutos en total',
                condition: () => this.getTotalPrayerMinutes() >= 60,
                icon: '🙏'
            },
            // Agregar más logros...
        ];
        
        availableAchievements.forEach(achievement => {
            if (!this.achievements.includes(achievement.id) && achievement.condition(action, details)) {
                this.unlockAchievement(achievement);
            }
        });
    }
    
    unlockAchievement(achievement) {
        this.achievements.push(achievement.id);
        
        // Mostrar notificación
        window.App.ui.showAchievementUnlocked(achievement);
        
        // Emitir evento
        window.App.emit('gamification:achievement-unlocked', achievement);
        
        // Bonus XP
        this.addXP(50);
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const lastCheckin = localStorage.getItem('bibliaapp:last-checkin');
        
        if (lastCheckin === today) {
            return; // Ya hizo checkin hoy
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastCheckin === yesterday.toDateString()) {
            this.streak++;
        } else {
            this.streak = 1; // Resetear streak
        }
        
        localStorage.setItem('bibliaapp:last-checkin', today);
        this.save();
        
        // Emitir evento
        window.App.emit('gamification:streak-updated', this.streak);
    }
    
    getTotalPrayerMinutes() {
        const progress = window.App.state.getUserProgress();
        return progress ? progress.prayerMinutes : 0;
    }
    
    save() {
        const data = {
            currentLevel: this.currentLevel,
            currentXP: this.currentXP,
            achievements: this.achievements,
            streak: this.streak
        };
        
        localStorage.setItem('bibliaapp:gamification', JSON.stringify(data));
    }
    
    // API pública
    getLevel() { return this.currentLevel; }
    getXP() { return this.currentXP; }
    getAchievements() { return this.achievements; }
    getStreak() { return this.streak; }
    
    getXPForNextLevel() {
        const nextLevel = this.currentLevel + 1;
        return Math.pow(nextLevel - 1, 2) * 100;
    }
    
    getProgressToNextLevel() {
        const currentLevelXP = Math.pow(this.currentLevel - 1, 2) * 100;
        const nextLevelXP = this.getXPForNextLevel();
        const progress = (this.currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP);
        return Math.max(0, Math.min(1, progress));
    }
}

// ============================================================================
// INICIALIZACIÓN GLOBAL
// ============================================================================

// Crear instancia global de la aplicación
window.App = new BibliaApp();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BibliaApp;
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.App.init();
    });
} else {
    // DOM ya está listo
    window.App.init();
}

// Debug en desarrollo
if (AppConfig.debug) {
    window.AppConfig = AppConfig;
    window.AppState = AppState;
    window.CacheManager = CacheManager;
    window.AnalyticsManager = AnalyticsManager;
    window.GamificationManager = GamificationManager;
    
    console.log('🔧 Modo debug activado. Variables disponibles:', {
        App: window.App,
        AppConfig,
        AppState,
        CacheManager,
        AnalyticsManager,
        GamificationManager
    });
}
