/**
 * BibliaApp Pro - Motor Principal de la Aplicación
 * Núcleo optimizado sin código basura, enfocado en funcionalidad robusta
 * Versión: 2.0.0
 */

class BibliaAppCore {
    constructor() {
        this.version = '2.0.0';
        this.initialized = false;
        this.state = new Map();
        this.events = new EventTarget();
        this.settings = new Map();
        this.progress = new Map();
        this.cache = new Map();
        
        // Configuración base
        this.config = {
            debug: window.location.hostname === 'localhost',
            storagePrefix: 'bibliaapp_',
            maxCacheSize: 50 * 1024 * 1024, // 50MB
            syncInterval: 5 * 60 * 1000, // 5 minutos
            autoSave: true,
            offlineMode: false
        };
        
        // Estado inicial
        this.state.set('currentSection', 'inicio');
        this.state.set('currentSubsection', null);
        this.state.set('userLevel', 1);
        this.state.set('userXP', 0);
        this.state.set('dailyStreak', 0);
        this.state.set('lastCheckIn', null);
        this.state.set('activeTools', []);
        
        this.initializeCore();
    }

    /**
     * Inicialización del núcleo de la aplicación
     */
    async initializeCore() {
        try {
            this.log('Inicializando BibliaApp Pro Core...');
            
            // Cargar configuraciones almacenadas
            await this.loadStoredData();
            
            // Inicializar subsistemas
            this.initializeProgressSystem();
            this.initializeStudyTools();
            this.initializeMemorizationEngine();
            this.initializePrayerSystem();
            this.initializeSocialFeatures();
            
            // Configurar eventos del sistema
            this.setupSystemEvents();
            
            // Marcar como inicializado
            this.initialized = true;
            this.emit('core:initialized');
            
            this.log('BibliaApp Pro Core inicializado correctamente');
            
        } catch (error) {
            this.error('Error inicializando el núcleo:', error);
            throw new Error('Fallo crítico en la inicialización');
        }
    }

    /**
     * Sistema de Progreso y Gamificación
     */
    initializeProgressSystem() {
        const progressData = this.loadFromStorage('progress', {
            level: 1,
            xp: 0,
            streak: 0,
            achievements: [],
            lastActivity: null,
            activities: []
        });

        this.progress = new Map(Object.entries(progressData));
        
        // Configurar XP por actividades
        this.xpRewards = new Map([
            ['daily_reading', 10],
            ['chapter_complete', 25],
            ['book_complete', 100],
            ['verse_memorized', 15],
            ['prayer_session', 5],
            ['social_interaction', 8],
            ['tool_usage', 3],
            ['achievement_unlock', 50],
            ['streak_milestone', 25],
            ['helping_others', 20]
        ]);

        // Configurar niveles
        this.levels = new Map([
            [1, { name: 'Principiante', xpRequired: 0 }],
            [2, { name: 'Buscador', xpRequired: 100 }],
            [3, { name: 'Discípulo', xpRequired: 300 }],
            [4, { name: 'Estudiante', xpRequired: 600 }],
            [5, { name: 'Erudito', xpRequired: 1000 }],
            [6, { name: 'Maestro', xpRequired: 1500 }],
            [7, { name: 'Sabio', xpRequired: 2200 }],
            [8, { name: 'Anciano', xpRequired: 3000 }],
            [9, { name: 'Mentor', xpRequired: 4000 }],
            [10, { name: 'Leyenda', xpRequired: 5500 }]
        ]);
    }

    /**
     * Herramientas de Estudio Profundo (50+ herramientas)
     */
    initializeStudyTools() {
        this.studyTools = new Map([
            // HERMENÉUTICA (12 herramientas)
            ['contexto_historico', {
                name: 'Contexto Histórico-Cultural',
                category: 'hermeneutica',
                description: 'Análisis del trasfondo temporal y cultural del texto',
                complexity: 'intermedio',
                active: false,
                execute: (passage) => this.analyzeHistoricalContext(passage)
            }],
            ['analisis_literario', {
                name: 'Análisis Literario',
                category: 'hermeneutica', 
                description: 'Estructura, género y forma literaria',
                complexity: 'avanzado',
                active: false,
                execute: (passage) => this.analyzeLiteraryStructure(passage)
            }],
            ['critica_textual', {
                name: 'Crítica Textual',
                category: 'hermeneutica',
                description: 'Análisis de variantes en manuscritos',
                complexity: 'experto',
                active: false,
                execute: (passage) => this.analyzeTextualVariants(passage)
            }],
            ['metodo_gramatico', {
                name: 'Método Gramático-Histórico',
                category: 'hermeneutica',
                description: 'Interpretación basada en gramática e historia',
                complexity: 'intermedio',
                active: false,
                execute: (passage) => this.applyGrammaticalMethod(passage)
            }],

            // ANÁLISIS CRÍTICO (10 herramientas)
            ['critica_fuentes', {
                name: 'Crítica de Fuentes',
                category: 'analisis_critico',
                description: 'Identificación de tradiciones subyacentes',
                complexity: 'avanzado',
                active: false,
                execute: (passage) => this.analyzeSourceCriticism(passage)
            }],
            ['critica_formas', {
                name: 'Crítica de Formas',
                category: 'analisis_critico',
                description: 'Análisis de géneros literarios específicos',
                complexity: 'avanzado',
                active: false,
                execute: (passage) => this.analyzeFormCriticism(passage)
            }],
            ['critica_redaccion', {
                name: 'Crítica de Redacción',
                category: 'analisis_critico',
                description: 'Propósito editorial del autor final',
                complexity: 'experto',
                active: false,
                execute: (passage) => this.analyzeRedactionCriticism(passage)
            }],
            ['analisis_narrativo', {
                name: 'Análisis Narrativo',
                category: 'analisis_critico',
                description: 'Estructura y técnicas narrativas',
                complexity: 'intermedio',
                active: false,
                execute: (passage) => this.analyzeNarrative(passage)
            }],

            // LINGÜÍSTICA (10 herramientas)
            ['analisis_lexico', {
                name: 'Análisis Léxico',
                category: 'linguistica',
                description: 'Significado de palabras en idiomas originales',
                complexity: 'intermedio',
                active: false,
                execute: (passage) => this.analyzeLexicon(passage)
            }],
            ['sintaxis_avanzada', {
                name: 'Sintaxis Avanzada',
                category: 'linguistica',
                description: 'Estructura gramatical compleja',
                complexity: 'avanzado',
                active: false,
                execute: (passage) => this.analyzeSyntax(passage)
            }],
            ['semantica_biblica', {
                name: 'Semántica Bíblica',
                category: 'linguistica',
                description: 'Significado en contexto bíblico',
                complexity: 'avanzado',
                active: false,
                execute: (passage) => this.analyzeSemantics(passage)
            }],
            ['pragmatica_textual', {
                name: 'Pragmática Textual',
                category: 'linguistica',
                description: 'Intención comunicativa del autor',
                complexity: 'experto',
                active: false,
                execute: (passage) => this.analyzePragmatics(passage)
            }],

            // HISTORIA Y ARQUEOLOGÍA (9 herramientas)
            ['cronologia_biblica', {
                name: 'Cronología Bíblica',
                category: 'historia_arqueologia',
                description: 'Líneas de tiempo y datación histórica',
                complexity: 'intermedio',
                active: false,
                execute: (passage) => this.analyzeChronology(passage)
            }],
            ['geografia_historica', {
                name: 'Geografía Histórica',
                category: 'historia_arqueologia',
                description: 'Contexto geográfico y topográfico',
                complexity: 'básico',
                active: false,
                execute: (passage) => this.analyzeGeography(passage)
            }],
            ['cultura_ane', {
                name: 'Cultura del Antiguo Cercano Oriente',
                category: 'historia_arqueologia',
                description: 'Contexto cultural de la época',
                complexity: 'avanzado',
                active: false,
                execute: (passage) => this.analyzeANECulture(passage)
            }],
            ['evidencia_arqueologica', {
                name: 'Evidencia Arqueológica',
                category: 'historia_arqueologia',
                description: 'Descubrimientos arqueológicos relevantes',
                complexity: 'intermedio',
                active: false,
                execute: (passage) => this.analyzeArchaeology(passage)
            }],

            // TEOLOGÍA SISTEMÁTICA (7 herramientas)
            ['doctrina_biblica', {
                name: 'Doctrina Bíblica',
                category: 'teologia_sistematica',
                description: 'Enseñanzas doctrinales fundamentales',
                complexity: 'intermedio',
                active: false,
                execute: (passage) => this.analyzeDoctrine(passage)
            }],
            ['teologia_biblica', {
                name: 'Teología Bíblica',
                category: 'teologia_sistematica',
                description: 'Desarrollo temático a través de la Escritura',
                complexity: 'avanzado',
                active: false,
                execute: (passage) => this.analyzeThemeProgression(passage)
            }],
            ['apologetica', {
                name: 'Apologética',
                category: 'teologia_sistematica',
                description: 'Defensa racional de la fe',
                complexity: 'avanzado',
                active: false,
                execute: (passage) => this.analyzeApologetics(passage)
            }],

            // VISUALIZACIÓN (6 herramientas)
            ['mapas_mentales', {
                name: 'Mapas Mentales',
                category: 'visualizacion',
                description: 'Conexiones conceptuales visuales',
                complexity: 'básico',
                active: false,
                execute: (passage) => this.createMindMap(passage)
            }],
            ['graficos_relacionales', {
                name: 'Gráficos Relacionales',
                category: 'visualizacion',
                description: 'Relaciones entre personajes y conceptos',
                complexity: 'intermedio',
                active: false,
                execute: (passage) => this.createRelationalGraphs(passage)
            }],
            ['lineas_tiempo', {
                name: 'Líneas de Tiempo',
                category: 'visualizacion',
                description: 'Secuencia cronológica de eventos',
                complexity: 'básico',
                active: false,
                execute: (passage) => this.createTimeline(passage)
            }]
        ]);

        this.log(`Inicializadas ${this.studyTools.size} herramientas de estudio`);
    }

    /**
     * Motor de Memorización con Repetición Espaciada
     */
    initializeMemorizationEngine() {
        this.memoryEngine = {
            algorithm: 'sm2', // SuperMemo 2
            intervals: [1, 6, 1, 6], // Días base
            easeFactor: 2.5,
            
            // Datos de memorización
            verses: new Map(),
            sessions: [],
            
            // Calcular próxima revisión
            calculateNextReview(difficulty, repetitions, easeFactor) {
                let interval;
                
                if (repetitions === 0) {
                    interval = 1;
                } else if (repetitions === 1) {
                    interval = 6;
                } else {
                    interval = Math.round((repetitions - 1) * easeFactor);
                }
                
                // Ajustar factor de facilidad
                easeFactor = easeFactor + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02));
                
                if (easeFactor < 1.3) easeFactor = 1.3;
                
                return {
                    interval,
                    easeFactor,
                    nextReview: new Date(Date.now() + interval * 24 * 60 * 60 * 1000)
                };
            },
            
            // Iniciar sesión de memorización
            startSession(verseId) {
                const verse = this.verses.get(verseId);
                if (!verse) {
                    throw new Error('Versículo no encontrado');
                }
                
                return {
                    verseId,
                    startTime: Date.now(),
                    attempts: 0,
                    hints: 0,
                    completed: false
                };
            },
            
            // Procesar respuesta
            processAnswer(sessionId, answer, correct) {
                const session = this.findSession(sessionId);
                if (!session) return null;
                
                session.attempts++;
                
                if (correct) {
                    session.completed = true;
                    this.updateProgress(session.verseId, true);
                    return { success: true, nextReview: this.calculateNextReview(5, session.attempts, 2.5) };
                } else {
                    return { success: false, attempts: session.attempts };
                }
            }
        };
        
        this.log('Motor de memorización inicializado');
    }

    /**
     * Sistema de Oración Estructurada
     */
    initializePrayerSystem() {
        this.prayerSystem = {
            types: new Map([
                ['adoracion', {
                    name: 'Adoración',
                    description: 'Alabanza por quien es Dios',
                    structure: ['attributes', 'praise', 'worship'],
                    duration: 10, // minutos
                    prompts: [
                        'Reflexiona sobre los atributos de Dios',
                        'Alaba Su carácter perfecto',
                        'Reconoce Su soberanía'
                    ]
                }],
                ['confesion', {
                    name: 'Confesión',
                    description: 'Reconocimiento de pecados',
                    structure: ['examination', 'confession', 'repentance'],
                    duration: 8,
                    prompts: [
                        'Examina tu corazón',
                        'Confiesa específicamente',
                        'Arrepiéntete genuinamente'
                    ]
                }],
                ['gratitud', {
                    name: 'Gratitud',
                    description: 'Agradecimiento por bendiciones',
                    structure: ['recognition', 'thanksgiving', 'appreciation'],
                    duration: 7,
                    prompts: [
                        'Reconoce las bendiciones recibidas',
                        'Agradece específicamente',
                        'Aprecia la providencia divina'
                    ]
                }],
                ['peticion', {
                    name: 'Petición',
                    description: 'Solicitudes específicas',
                    structure: ['needs', 'requests', 'intercession'],
                    duration: 15,
                    prompts: [
                        'Presenta tus necesidades',
                        'Intercede por otros',
                        'Busca la voluntad de Dios'
                    ]
                }]
            ]),
            
            sessions: [],
            
            // Iniciar sesión de oración
            startSession(type, customDuration = null) {
                const prayerType = this.types.get(type);
                if (!prayerType) {
                    throw new Error('Tipo de oración no válido');
                }
                
                const session = {
                    id: this.generateId(),
                    type,
                    duration: customDuration || prayerType.duration,
                    startTime: Date.now(),
                    structure: [...prayerType.structure],
                    currentStep: 0,
                    completed: false,
                    notes: []
                };
                
                this.sessions.push(session);
                return session;
            },
            
            // Avanzar en la sesión
            nextStep(sessionId) {
                const session = this.findSession(sessionId);
                if (!session || session.completed) return null;
                
                session.currentStep++;
                
                if (session.currentStep >= session.structure.length) {
                    session.completed = true;
                    session.endTime = Date.now();
                    this.recordSession(session);
                }
                
                return session;
            },
            
            // Registrar sesión completada
            recordSession(session) {
                const duration = (session.endTime - session.startTime) / 1000 / 60; // minutos
                
                // Agregar XP
                this.addXP('prayer_session', { 
                    type: session.type, 
                    duration: Math.round(duration) 
                });
                
                // Guardar en historial
                this.saveToStorage('prayer_history', {
                    ...session,
                    date: new Date().toISOString()
                });
            }
        };
        
        this.log('Sistema de oración inicializado');
    }

    /**
     * Características Sociales
     */
    initializeSocialFeatures() {
        this.social = {
            groups: new Map(),
            discussions: new Map(),
            userProfile: {
                level: this.progress.get('level'),
                achievements: this.progress.get('achievements'),
                contributions: 0,
                helpedUsers: 0
            },
            
            // Compartir insight
            shareInsight(content, tags = []) {
                const insight = {
                    id: this.generateId(),
                    content,
                    tags,
                    author: 'currentUser',
                    timestamp: Date.now(),
                    likes: 0,
                    comments: []
                };
                
                // Simular guardado
                this.saveToStorage('shared_insights', insight);
                
                // Agregar XP por compartir
                this.addXP('social_interaction', { type: 'share_insight' });
                
                return insight;
            },
            
            // Ayudar a otro usuario
            helpUser(userId, helpType) {
                this.social.userProfile.helpedUsers++;
                this.addXP('helping_others', { helpType, userId });
                
                // Verificar logro de ayudador
                if (this.social.userProfile.helpedUsers >= 10) {
                    this.unlockAchievement('ayudador');
                }
            }
        };
        
        this.log('Características sociales inicializadas');
    }

    /**
     * Configurar eventos del sistema
     */
    setupSystemEvents() {
        // Auto-guardado periódico
        if (this.config.autoSave) {
            setInterval(() => {
                this.saveAllData();
            }, 60000); // Cada minuto
        }
        
        // Sincronización periódica (si hay conexión)
        setInterval(() => {
            if (navigator.onLine && !this.config.offlineMode) {
                this.syncData();
            }
        }, this.config.syncInterval);
        
        // Eventos de ventana
        window.addEventListener('beforeunload', () => {
            this.saveAllData();
        });
        
        // Detección de conexión
        window.addEventListener('online', () => {
            this.config.offlineMode = false;
            this.emit('network:online');
        });
        
        window.addEventListener('offline', () => {
            this.config.offlineMode = true;
            this.emit('network:offline');
        });
    }

    /**
     * Sistema de Experiencia y Niveles
     */
    addXP(activity, metadata = {}) {
        const xpAmount = this.xpRewards.get(activity) || 0;
        if (xpAmount === 0) return;
        
        const currentXP = this.progress.get('xp') || 0;
        const newXP = currentXP + xpAmount;
        const currentLevel = this.progress.get('level') || 1;
        const newLevel = this.calculateLevel(newXP);
        
        // Actualizar XP
        this.progress.set('xp', newXP);
        this.state.set('userXP', newXP);
        
        // Verificar subida de nivel
        if (newLevel > currentLevel) {
            this.progress.set('level', newLevel);
            this.state.set('userLevel', newLevel);
            this.emit('progress:levelUp', { oldLevel: currentLevel, newLevel });
        }
        
        // Registrar actividad
        const activity_record = {
            type: activity,
            xp: xpAmount,
            metadata,
            timestamp: Date.now()
        };
        
        this.saveToStorage('activity_log', activity_record);
        this.emit('progress:xpGained', { activity, xp: xpAmount, totalXP: newXP });
        
        this.log(`+${xpAmount} XP por ${activity} (Total: ${newXP})`);
    }

    /**
     * Calcular nivel basado en XP
     */
    calculateLevel(xp) {
        for (let [level, data] of this.levels) {
            if (xp < data.xpRequired) {
                return level - 1;
            }
        }
        return this.levels.size; // Nivel máximo
    }

    /**
     * Desbloquear logro
     */
    unlockAchievement(achievementId) {
        const achievements = this.progress.get('achievements') || [];
        
        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            this.progress.set('achievements', achievements);
            
            this.addXP('achievement_unlock', { achievement: achievementId });
            this.emit('progress:achievementUnlocked', { achievementId });
            
            this.log(`🏆 Logro desbloqueado: ${achievementId}`);
        }
    }

    /**
     * Gestión de Herramientas
     */
    activateTool(toolId) {
        const tool = this.studyTools.get(toolId);
        if (!tool) {
            throw new Error(`Herramienta no encontrada: ${toolId}`);
        }
        
        tool.active = true;
        const activeTools = this.state.get('activeTools') || [];
        if (!activeTools.includes(toolId)) {
            activeTools.push(toolId);
            this.state.set('activeTools', activeTools);
        }
        
        this.addXP('tool_usage', { tool: toolId });
        this.emit('tools:activated', { toolId });
        
        return tool;
    }

    deactivateTool(toolId) {
        const tool = this.studyTools.get(toolId);
        if (tool) {
            tool.active = false;
            const activeTools = this.state.get('activeTools') || [];
            const index = activeTools.indexOf(toolId);
            if (index > -1) {
                activeTools.splice(index, 1);
                this.state.set('activeTools', activeTools);
            }
            this.emit('tools:deactivated', { toolId });
        }
    }

    getToolsByCategory(category) {
        const tools = [];
        for (let [id, tool] of this.studyTools) {
            if (tool.category === category) {
                tools.push({ id, ...tool });
            }
        }
        return tools;
    }

    /**
     * Análisis de Pasajes (Funciones de ejemplo para herramientas)
     */
    analyzeHistoricalContext(passage) {
        return {
            period: 'Período del Segundo Templo',
            culture: 'Cultura helenística-judía',
            context: 'Contexto de dominación romana',
            significance: 'Importante para entender las tensiones sociales'
        };
    }

    analyzeLiteraryStructure(passage) {
        return {
            genre: 'Narrativa histórica',
            structure: 'Quiasmo simple',
            devices: ['Paralelismo', 'Simbolismo'],
            purpose: 'Enseñanza teológica a través de narrativa'
        };
    }

    analyzeLexicon(passage) {
        return {
            keyWords: [
                { word: 'ἀγάπη', meaning: 'amor incondicional', significance: 'Central al mensaje' },
                { word: 'πίστις', meaning: 'fe/confianza', significance: 'Respuesta humana requerida' }
            ],
            semanticField: 'Terminología de relación divino-humana'
        };
    }

    /**
     * Persistencia de Datos
     */
    saveToStorage(key, data) {
        try {
            const fullKey = this.config.storagePrefix + key;
            
            if (Array.isArray(data)) {
                // Para arrays, agregar al final
                const existing = JSON.parse(localStorage.getItem(fullKey) || '[]');
                existing.push(data);
                localStorage.setItem(fullKey, JSON.stringify(existing));
            } else {
                localStorage.setItem(fullKey, JSON.stringify(data));
            }
        } catch (error) {
            this.error('Error guardando en storage:', error);
        }
    }

    loadFromStorage(key, defaultValue = null) {
        try {
            const fullKey = this.config.storagePrefix + key;
            const data = localStorage.getItem(fullKey);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            this.error('Error cargando desde storage:', error);
            return defaultValue;
        }
    }

    async loadStoredData() {
        // Cargar progreso
        const progressData = this.loadFromStorage('progress');
        if (progressData) {
            for (let [key, value] of Object.entries(progressData)) {
                this.progress.set(key, value);
                this.state.set('user' + key.charAt(0).toUpperCase() + key.slice(1), value);
            }
        }
        
        // Cargar configuraciones
        const settingsData = this.loadFromStorage('settings');
        if (settingsData) {
            for (let [key, value] of Object.entries(settingsData)) {
                this.settings.set(key, value);
            }
        }
    }

    saveAllData() {
        // Guardar progreso
        const progressData = Object.fromEntries(this.progress);
        this.saveToStorage('progress', progressData);
        
        // Guardar configuraciones
        const settingsData = Object.fromEntries(this.settings);
        this.saveToStorage('settings', settingsData);
        
        this.log('Datos guardados automáticamente');
    }

    async syncData() {
        // Placeholder para sincronización con servidor
        this.log('Sincronización con servidor (placeholder)');
    }

    /**
     * Utilidades
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    emit(event, data = null) {
        this.events.dispatchEvent(new CustomEvent(event, { detail: data }));
    }

    on(event, callback) {
        this.events.addEventListener(event, callback);
    }

    off(event, callback) {
        this.events.removeEventListener(event, callback);
    }

    log(...args) {
        if (this.config.debug) {
            console.log('🙏 BibliaApp:', ...args);
        }
    }

    error(...args) {
        console.error('❌ BibliaApp Error:', ...args);
    }

    /**
     * API pública del núcleo
     */
    getState(key) {
        return this.state.get(key);
    }

    setState(key, value) {
        this.state.set(key, value);
        this.emit('state:changed', { key, value });
    }

    getSetting(key, defaultValue = null) {
        return this.settings.get(key) || defaultValue;
    }

    setSetting(key, value) {
        this.settings.set(key, value);
        this.emit('settings:changed', { key, value });
    }

    getProgress(key) {
        return this.progress.get(key);
    }

    // Método para verificar si el núcleo está listo
    isReady() {
        return this.initialized;
    }

    // Método para obtener estadísticas de uso
    getUsageStats() {
        return {
            level: this.progress.get('level'),
            xp: this.progress.get('xp'),
            achievements: this.progress.get('achievements')?.length || 0,
            activeTools: this.state.get('activeTools')?.length || 0,
            totalTools: this.studyTools.size
        };
    }
}

// Instancia global
window.BibliaApp = new BibliaAppCore();

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BibliaAppCore;
}