/**
 * BibliaApp Pro - Main Application Orchestrator
 * Clean, functional code that ties everything together
 * Zero waste code - every line serves a purpose
 * Version: 2.0.0
 */

class BibliaAppMain {
    constructor() {
        this.initialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Start initialization process
        this.init();
    }

    /**
     * Initialize the complete application
     */
    async init() {
        try {
            this.log('Starting BibliaApp Pro initialization...');
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Wait for core app to be ready
            await this.waitForAppCore();
            
            // Initialize UI Manager
            this.uiManager = new UIManager(window.BibliaApp);
            
            // Wait for UI to be ready
            await this.waitForUI();
            
            // Initialize Bible data
            await this.initializeBibleData();
            
            // Setup global error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup PWA features
            await this.setupPWA();
            
            // Final initialization
            this.finializeInitialization();
            
            this.log('BibliaApp Pro fully initialized and ready!');
            
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Wait for App Core to be ready
     */
    waitForAppCore() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('App core initialization timeout'));
            }, 10000);

            const checkReady = () => {
                if (window.BibliaApp && window.BibliaApp.isReady()) {
                    clearTimeout(timeout);
                    resolve();
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            
            checkReady();
        });
    }

    /**
     * Wait for UI Manager to be ready
     */
    waitForUI() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('UI Manager initialization timeout'));
            }, 5000);

            const checkReady = () => {
                if (this.uiManager && this.uiManager.isInitialized()) {
                    clearTimeout(timeout);
                    resolve();
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            
            checkReady();
        });
    }

    /**
     * Initialize Bible data and content
     */
    async initializeBibleData() {
        this.log('Initializing Bible data...');
        
        // Initialize with sample data for now
        window.BibleData = {
            versions: {
                'RV1960': 'Reina-Valera 1960'
            },
            
            currentVersion: 'RV1960',
            
            // Sample books structure
            books: {
                'genesis': {
                    name: 'Génesis',
                    testament: 'old',
                    chapters: 50,
                    order: 1
                },
                'exodo': {
                    name: 'Éxodo', 
                    testament: 'old',
                    chapters: 40,
                    order: 2
                },
                'juan': {
                    name: 'Juan',
                    testament: 'new',
                    chapters: 21,
                    order: 43
                },
                'filipenses': {
                    name: 'Filipenses',
                    testament: 'new', 
                    chapters: 4,
                    order: 50
                }
            },
            
            // Sample verses for demonstration
            verses: {
                'juan_3_16': {
                    book: 'juan',
                    chapter: 3,
                    verse: 16,
                    text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.'
                },
                'filipenses_4_13': {
                    book: 'filipenses',
                    chapter: 4,
                    verse: 13,
                    text: 'Todo lo puedo en Cristo que me fortalece.'
                },
                'genesis_1_1': {
                    book: 'genesis',
                    chapter: 1,
                    verse: 1,
                    text: 'En el principio creó Dios los cielos y la tierra.'
                }
            },
            
            // Reading plans
            readingPlans: {
                'daily': {
                    name: 'Plan Diario',
                    description: 'Lee la Biblia en un año',
                    duration: 365,
                    currentDay: 47
                },
                'topical': {
                    name: 'Plan Temático',
                    description: 'Temas fundamentales de la fe',
                    duration: 90,
                    currentDay: 12
                }
            },
            
            // Study tools data
            studyNotes: new Map(),
            bookmarks: new Set(),
            highlights: new Map(),
            
            // Methods
            getVerse: function(reference) {
                return this.verses[reference] || null;
            },
            
            getBook: function(bookId) {
                return this.books[bookId] || null;
            },
            
            addBookmark: function(reference) {
                this.bookmarks.add(reference);
                window.BibliaApp.saveToStorage('bookmarks', Array.from(this.bookmarks));
            },
            
            addHighlight: function(reference, color = 'yellow') {
                this.highlights.set(reference, { color, timestamp: Date.now() });
                window.BibliaApp.saveToStorage('highlights', Object.fromEntries(this.highlights));
            },
            
            addStudyNote: function(reference, note) {
                this.studyNotes.set(reference, { note, timestamp: Date.now() });
                window.BibliaApp.saveToStorage('study_notes', Object.fromEntries(this.studyNotes));
            }
        };
        
        // Load saved user data
        this.loadUserBibleData();
        
        this.log('Bible data initialized');
    }

    /**
     * Load user's saved Bible data
     */
    loadUserBibleData() {
        // Load bookmarks
        const savedBookmarks = window.BibliaApp.loadFromStorage('bookmarks', []);
        window.BibleData.bookmarks = new Set(savedBookmarks);
        
        // Load highlights
        const savedHighlights = window.BibliaApp.loadFromStorage('highlights', {});
        window.BibleData.highlights = new Map(Object.entries(savedHighlights));
        
        // Load study notes
        const savedNotes = window.BibliaApp.loadFromStorage('study_notes', {});
        window.BibleData.studyNotes = new Map(Object.entries(savedNotes));
        
        this.log('User Bible data loaded');
    }

    /**
     * Setup comprehensive error handling
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleGlobalError('JavaScript Error', event.error, event);
        });
        
        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError('Promise Rejection', event.reason, event);
        });
        
        // App-specific error handler
        window.BibliaApp.on('core:error', (event) => {
            this.handleAppError(event.detail);
        });
        
        this.log('Error handling setup complete');
    }

    /**
     * Handle different types of errors gracefully
     */
    handleGlobalError(type, error, event) {
        console.error(`${type}:`, error);
        
        // Don't let errors break the user experience
        if (event) {
            event.preventDefault();
        }
        
        // Show user-friendly message
        if (this.uiManager) {
            this.uiManager.showToast('Ocurrió un error, pero la aplicación sigue funcionando', 'warning');
        }
        
        // Log error for debugging
        window.BibliaApp?.saveToStorage('error_log', {
            type,
            message: error.message || error,
            stack: error.stack,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }

    handleAppError(errorDetail) {
        this.log('App error handled:', errorDetail);
        
        if (this.uiManager) {
            this.uiManager.showToast('Error en la aplicación', 'error');
        }
    }

    handleInitializationError(error) {
        console.error('Initialization failed:', error);
        
        this.retryCount++;
        if (this.retryCount <= this.maxRetries) {
            this.log(`Retrying initialization (${this.retryCount}/${this.maxRetries})...`);
            setTimeout(() => {
                this.init();
            }, 2000 * this.retryCount);
        } else {
            this.showFatalError(error);
        }
    }

    /**
     * Show fatal error screen
     */
    showFatalError(error) {
        document.body.innerHTML = `
            <div class="min-h-screen bg-discord-dark flex items-center justify-center p-4">
                <div class="text-center max-w-md">
                    <div class="text-6xl mb-4">😔</div>
                    <h1 class="text-2xl font-bold text-white mb-4">Error Crítico</h1>
                    <p class="text-discord-secondary mb-6">
                        La aplicación no pudo inicializarse. Por favor, recarga la página.
                    </p>
                    <button onclick="window.location.reload()" 
                            class="bg-discord-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                        Recargar Aplicación
                    </button>
                    <details class="mt-6 text-left">
                        <summary class="cursor-pointer text-discord-muted">Detalles técnicos</summary>
                        <pre class="mt-2 text-xs text-discord-muted bg-discord-input p-3 rounded overflow-auto">
${error.stack || error.message || error}
                        </pre>
                    </details>
                </div>
            </div>
        `;
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
                
                if (usedMB > limitMB * 0.8) { // 80% memory usage
                    this.log('High memory usage detected:', usedMB, 'MB');
                    this.optimizeMemory();
                }
            }, 30000); // Check every 30 seconds
        }
        
        // Monitor performance marks
        window.BibliaApp.on('performance:mark', (event) => {
            performance.mark(event.detail.name);
        });
        
        this.log('Performance monitoring setup complete');
    }

    /**
     * Optimize memory usage when needed
     */
    optimizeMemory() {
        // Clear old cache entries
        const cache = window.BibliaApp.cache;
        if (cache.size > 100) {
            const oldestEntries = Array.from(cache.entries())
                .sort(([,a], [,b]) => a.timestamp - b.timestamp)
                .slice(0, 50);
            
            oldestEntries.forEach(([key]) => cache.delete(key));
            this.log('Cleared', oldestEntries.length, 'cache entries');
        }
        
        // Trigger garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    /**
     * Setup PWA features
     */
    async setupPWA() {
        try {
            // Register service worker
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('/sw.js');
                this.log('Service Worker registered:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });
            }
            
            // Setup install prompt
            this.setupInstallPrompt();
            
            // Setup offline detection
            this.setupOfflineDetection();
            
            this.log('PWA features setup complete');
            
        } catch (error) {
            this.log('PWA setup error (non-critical):', error);
        }
    }

    /**
     * Setup app install prompt
     */
    setupInstallPrompt() {
        let deferredPrompt = null;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            const installBtn = document.createElement('button');
            installBtn.textContent = '📱 Instalar App';
            installBtn.className = 'fixed bottom-4 left-4 bg-discord-primary text-white px-4 py-2 rounded-lg shadow-lg z-50';
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        this.log('User installed the app');
                    }
                    deferredPrompt = null;
                    document.body.removeChild(installBtn);
                }
            });
            
            document.body.appendChild(installBtn);
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (installBtn.parentElement) {
                    document.body.removeChild(installBtn);
                }
            }, 10000);
        });
    }

    /**
     * Setup offline detection and handling
     */
    setupOfflineDetection() {
        const updateOnlineStatus = () => {
            if (navigator.onLine) {
                this.uiManager?.showToast('Conexión restaurada', 'success');
                window.BibliaApp.config.offlineMode = false;
            } else {
                this.uiManager?.showToast('Sin conexión - Modo offline activado', 'warning');
                window.BibliaApp.config.offlineMode = true;
            }
        };
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        // Initial status
        if (!navigator.onLine) {
            window.BibliaApp.config.offlineMode = true;
        }
    }

    /**
     * Show update available notification
     */
    showUpdateAvailable() {
        if (this.uiManager) {
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-discord-primary text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
            toast.innerHTML = `
                <h4 class="font-semibold mb-2">Actualización disponible</h4>
                <p class="text-sm mb-3">Una nueva versión está disponible</p>
                <div class="flex space-x-2">
                    <button onclick="window.location.reload()" 
                            class="bg-white text-discord-primary px-3 py-1 rounded text-sm">
                        Actualizar
                    </button>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="bg-discord-secondary text-white px-3 py-1 rounded text-sm">
                        Después
                    </button>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Auto-remove after 30 seconds
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 30000);
        }
    }

    /**
     * Final initialization steps
     */
    finializeInitialization() {
        // Mark as initialized
        this.initialized = true;
        
        // Emit ready event
        window.BibliaApp.emit('app:ready');
        
        // Initialize analytics (placeholder)
        this.initializeAnalytics();
        
        // Setup auto-save
        this.setupAutoSave();
        
        // Show welcome message for new users
        this.checkFirstTimeUser();
        
        // Performance mark
        performance.mark('app-fully-loaded');
        
        this.log('Application fully ready for use');
    }

    /**
     * Initialize analytics (privacy-respecting)
     */
    initializeAnalytics() {
        // Only track usage patterns, no personal data
        const analytics = {
            sessionStart: Date.now(),
            features: new Set(),
            
            trackFeatureUsage: (feature) => {
                this.features.add(feature);
            },
            
            getSessionSummary: () => {
                return {
                    duration: Date.now() - this.sessionStart,
                    featuresUsed: Array.from(this.features),
                    timestamp: Date.now()
                };
            }
        };
        
        window.BibliaApp.analytics = analytics;
        
        // Track session end
        window.addEventListener('beforeunload', () => {
            const summary = analytics.getSessionSummary();
            window.BibliaApp.saveToStorage('session_analytics', summary);
        });
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        // Save user data every 2 minutes
        setInterval(() => {
            if (window.BibliaApp && this.initialized) {
                window.BibliaApp.saveAllData();
                
                // Also save Bible data
                window.BibliaApp.saveToStorage('bookmarks', Array.from(window.BibleData.bookmarks));
                window.BibliaApp.saveToStorage('highlights', Object.fromEntries(window.BibleData.highlights));
                window.BibliaApp.saveToStorage('study_notes', Object.fromEntries(window.BibleData.studyNotes));
            }
        }, 120000); // 2 minutes
        
        this.log('Auto-save setup complete');
    }

    /**
     * Check if this is a first-time user
     */
    checkFirstTimeUser() {
        const isFirstTime = !window.BibliaApp.loadFromStorage('user_onboarded');
        
        if (isFirstTime) {
            setTimeout(() => {
                this.showWelcomeMessage();
                window.BibliaApp.saveToStorage('user_onboarded', true);
            }, 2000);
        }
    }

    /**
     * Show welcome message for new users
     */
    showWelcomeMessage() {
        if (this.uiManager) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="bg-discord-card max-w-lg w-full p-8 rounded-lg text-center">
                    <div class="text-6xl mb-4">🙏</div>
                    <h2 class="text-2xl font-bold text-white mb-4">¡Bienvenido a BibliaApp Pro!</h2>
                    <p class="text-discord-secondary mb-6">
                        La aplicación más avanzada para el estudio bíblico profundo. 
                        Comienza explorando las herramientas de estudio en la sección de Teoría.
                    </p>
                    <div class="space-y-3">
                        <button onclick="this.closest('.fixed').remove(); window.bibliaAppMain.uiManager.navigateToSection('teoria')" 
                                class="w-full bg-discord-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                            Comenzar Tour
                        </button>
                        <button onclick="this.closest('.fixed').remove()" 
                                class="w-full bg-discord-secondary text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                            Explorar Libremente
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
    }

    /**
     * Utility methods
     */
    log(...args) {
        if (window.BibliaApp?.config.debug) {
            console.log('🚀 Main App:', ...args);
        }
    }

    /**
     * Public API
     */
    isInitialized() {
        return this.initialized;
    }

    getVersion() {
        return '2.0.0';
    }

    restart() {
        window.location.reload();
    }
}

// Global error protection
try {
    // Initialize main application
    window.bibliaAppMain = new BibliaAppMain();
    
    // Global access for debugging
    if (window.BibliaApp?.config.debug) {
        window.debugApp = {
            core: window.BibliaApp,
            ui: () => window.bibliaAppMain.uiManager,
            data: () => window.BibleData,
            main: window.bibliaAppMain
        };
        console.log('🔧 Debug tools available at window.debugApp');
    }
    
} catch (error) {
    console.error('Critical startup error:', error);
    
    // Last resort error display
    document.body.innerHTML = `
        <div class="min-h-screen bg-red-900 flex items-center justify-center p-4">
            <div class="text-center text-white">
                <h1 class="text-3xl font-bold mb-4">Error Crítico</h1>
                <p class="mb-4">La aplicación no pudo iniciarse.</p>
                <button onclick="window.location.reload()" 
                        class="bg-white text-red-900 px-6 py-3 rounded-lg">
                    Recargar
                </button>
            </div>
        </div>
    `;
}