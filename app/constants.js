/* ==========================================================================
   BIBLIAAPP PRO v3.0 - CONSTANTS
   Central configuration and constants - NO GARBAGE CODE
   ========================================================================== */

// ==========================================
// APPLICATION CONSTANTS
// ==========================================

export const APP_CONFIG = {
    name: 'BibliaApp Pro',
    version: '3.0.0',
    buildDate: new Date().toISOString().split('T')[0],
    author: 'BibliaApp Team',
    description: 'Advanced Bible Study Platform',
    
    // Performance Settings
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    cacheExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    debounceDelay: 300,
    animationDuration: 250,
    
    // UI Settings
    sidebarWidth: 256,
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    
    // Feature Flags
    features: {
        offlineMode: true,
        socialFeatures: true,
        advancedAnalytics: true,
        experimentalTools: false,
        betaFeatures: false
    }
};

// ==========================================
// SRS (SPACED REPETITION SYSTEM) CONSTANTS
// ==========================================

export const SRS_CONFIG = {
    // Intervals in days for each difficulty level
    intervals: {
        1: [1, 1, 3, 7, 14],           // Again (red)
        2: [1, 3, 7, 14, 30],          // Hard (orange)  
        3: [3, 7, 14, 30, 90],         // Good (blue)
        4: [7, 14, 30, 90, 180]        // Easy (green)
    },
    
    // Ease factors for SM-2 algorithm
    easeFactor: {
        initial: 2.5,
        minimum: 1.3,
        maximum: 3.0,
        increment: 0.15,
        decrement: 0.20
    },
    
    // Rating descriptions
    ratings: {
        1: { label: 'Again', description: 'Complete blackout', color: '#ef4444', emoji: '😰' },
        2: { label: 'Hard', description: 'Incorrect with effort', color: '#f59e0b', emoji: '😅' },
        3: { label: 'Good', description: 'Correct with effort', color: '#3b82f6', emoji: '😊' },
        4: { label: 'Easy', description: 'Perfect recall', color: '#10b981', emoji: '😎' }
    },
    
    // Study session limits
    limits: {
        dailyNew: 20,
        dailyReview: 100,
        sessionMax: 50,
        timePerCard: 30 // seconds
    }
};

// ==========================================
// BIBLE DATA CONSTANTS
// ==========================================

export const BIBLE_CONFIG = {
    // Supported versions
    versions: {
        'rv1960': { name: 'Reina-Valera 1960', lang: 'es', year: 1960 },
        'nvi': { name: 'Nueva Versión Internacional', lang: 'es', year: 1999 },
        'lbla': { name: 'La Biblia de las Américas', lang: 'es', year: 1986 },
        'kjv': { name: 'King James Version', lang: 'en', year: 1611 },
        'esv': { name: 'English Standard Version', lang: 'en', year: 2001 }
    },
    
    // Default version
    defaultVersion: 'rv1960',
    
    // Book categories
    bookCategories: {
        oldTestament: {
            law: ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy'],
            history: ['joshua', 'judges', 'ruth', '1samuel', '2samuel', '1kings', '2kings', 
                     '1chronicles', '2chronicles', 'ezra', 'nehemiah', 'esther'],
            wisdom: ['job', 'psalms', 'proverbs', 'ecclesiastes', 'song'],
            majorProphets: ['isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel'],
            minorProphets: ['hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 
                           'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi']
        },
        newTestament: {
            gospels: ['matthew', 'mark', 'luke', 'john'],
            history: ['acts'],
            paulineEpistles: ['romans', '1corinthians', '2corinthians', 'galatians', 
                             'ephesians', 'philippians', 'colossians', '1thessalonians', 
                             '2thessalonians', '1timothy', '2timothy', 'titus', 'philemon'],
            generalEpistles: ['hebrews', 'james', '1peter', '2peter', '1john', '2john', '3john', 'jude'],
            prophecy: ['revelation']
        }
    },
    
    // Reading plans
    readingPlans: {
        'bible-year': { name: 'Bible in a Year', duration: 365, type: 'chronological' },
        'nt-month': { name: 'New Testament in a Month', duration: 30, type: 'sequential' },
        'psalms-month': { name: 'Psalms in a Month', duration: 30, type: 'devotional' },
        'gospels-week': { name: 'Four Gospels in a Week', duration: 7, type: 'thematic' }
    }
};

// ==========================================
// ANALYTICAL TOOLS CONSTANTS
// ==========================================

export const ANALYTICAL_TOOLS = {
    // 50+ Deep Study Tools organized by category
    categories: {
        hermeneutics: {
            name: 'Hermenéutica',
            description: 'Principios de interpretación bíblica',
            color: '#3b82f6',
            tools: [
                { id: 'grammatical-analysis', name: 'Análisis Gramatical', difficulty: 'intermediate' },
                { id: 'historical-context', name: 'Contexto Histórico', difficulty: 'beginner' },
                { id: 'literary-genre', name: 'Género Literario', difficulty: 'beginner' },
                { id: 'canonical-context', name: 'Contexto Canónico', difficulty: 'advanced' },
                { id: 'progressive-revelation', name: 'Revelación Progresiva', difficulty: 'advanced' },
                { id: 'typology-study', name: 'Estudio Tipológico', difficulty: 'advanced' },
                { id: 'allegory-analysis', name: 'Análisis Alegórico', difficulty: 'expert' },
                { id: 'intertextuality', name: 'Intertextualidad', difficulty: 'expert' },
                { id: 'authorial-intent', name: 'Intención Autoral', difficulty: 'intermediate' },
                { id: 'reader-response', name: 'Respuesta del Lector', difficulty: 'advanced' },
                { id: 'socio-rhetorical', name: 'Análisis Socio-retórico', difficulty: 'expert' },
                { id: 'narrative-criticism', name: 'Crítica Narrativa', difficulty: 'advanced' }
            ]
        },
        textualCriticism: {
            name: 'Crítica Textual',
            description: 'Análisis de manuscritos y variantes textuales',
            color: '#8b5cf6',
            tools: [
                { id: 'manuscript-comparison', name: 'Comparación de Manuscritos', difficulty: 'expert' },
                { id: 'variant-analysis', name: 'Análisis de Variantes', difficulty: 'advanced' },
                { id: 'textual-families', name: 'Familias Textuales', difficulty: 'expert' },
                { id: 'papyrus-study', name: 'Estudio de Papiros', difficulty: 'expert' },
                { id: 'uncial-analysis', name: 'Análisis Uncial', difficulty: 'expert' },
                { id: 'minuscule-examination', name: 'Examen Minúsculo', difficulty: 'advanced' },
                { id: 'versional-evidence', name: 'Evidencia Versional', difficulty: 'advanced' },
                { id: 'patristic-citations', name: 'Citas Patrísticas', difficulty: 'expert' },
                { id: 'scribal-habits', name: 'Hábitos Escribales', difficulty: 'advanced' },
                { id: 'apparatus-reading', name: 'Lectura de Aparato', difficulty: 'expert' }
            ]
        },
        linguistics: {
            name: 'Lingüística',
            description: 'Análisis de idiomas originales',
            color: '#10b981',
            tools: [
                { id: 'hebrew-morphology', name: 'Morfología Hebrea', difficulty: 'advanced' },
                { id: 'greek-syntax', name: 'Sintaxis Griega', difficulty: 'advanced' },
                { id: 'aramaic-passages', name: 'Pasajes Arameos', difficulty: 'expert' },
                { id: 'semantic-analysis', name: 'Análisis Semántico', difficulty: 'intermediate' },
                { id: 'word-study', name: 'Estudio de Palabras', difficulty: 'beginner' },
                { id: 'etymology-research', name: 'Investigación Etimológica', difficulty: 'advanced' },
                { id: 'cognate-languages', name: 'Lenguas Afines', difficulty: 'expert' },
                { id: 'discourse-analysis', name: 'Análisis del Discurso', difficulty: 'advanced' },
                { id: 'pragmatic-study', name: 'Estudio Pragmático', difficulty: 'advanced' },
                { id: 'phonetic-analysis', name: 'Análisis Fonético', difficulty: 'expert' }
            ]
        },
        archaeology: {
            name: 'Arqueología',
            description: 'Evidencia arqueológica y cultural',
            color: '#f59e0b',
            tools: [
                { id: 'site-exploration', name: 'Exploración de Sitios', difficulty: 'intermediate' },
                { id: 'artifact-analysis', name: 'Análisis de Artefactos', difficulty: 'advanced' },
                { id: 'inscription-study', name: 'Estudio de Inscripciones', difficulty: 'expert' },
                { id: 'cultural-background', name: 'Trasfondo Cultural', difficulty: 'beginner' },
                { id: 'ancient-customs', name: 'Costumbres Antiguas', difficulty: 'intermediate' },
                { id: 'architectural-context', name: 'Contexto Arquitectónico', difficulty: 'intermediate' },
                { id: 'chronological-dating', name: 'Datación Cronológica', difficulty: 'advanced' },
                { id: 'material-culture', name: 'Cultura Material', difficulty: 'advanced' }
            ]
        },
        theology: {
            name: 'Teología',
            description: 'Análisis teológico sistemático',
            color: '#ef4444',
            tools: [
                { id: 'systematic-theology', name: 'Teología Sistemática', difficulty: 'advanced' },
                { id: 'biblical-theology', name: 'Teología Bíblica', difficulty: 'intermediate' },
                { id: 'doctrinal-development', name: 'Desarrollo Doctrinal', difficulty: 'advanced' },
                { id: 'christology-study', name: 'Estudio Cristológico', difficulty: 'intermediate' },
                { id: 'pneumatology', name: 'Pneumatología', difficulty: 'advanced' },
                { id: 'eschatology-analysis', name: 'Análisis Escatológico', difficulty: 'advanced' },
                { id: 'soteriology-study', name: 'Estudio Soteriológico', difficulty: 'intermediate' },
                { id: 'ecclesiology', name: 'Eclesiología', difficulty: 'intermediate' },
                { id: 'theodicy-examination', name: 'Examen de Teodicea', difficulty: 'advanced' },
                { id: 'covenant-theology', name: 'Teología del Pacto', difficulty: 'advanced' }
            ]
        }
    },
    
    // Difficulty levels
    difficultyLevels: {
        beginner: { name: 'Principiante', color: '#10b981', description: 'Conocimiento básico requerido' },
        intermediate: { name: 'Intermedio', color: '#3b82f6', description: 'Experiencia moderada necesaria' },
        advanced: { name: 'Avanzado', color: '#f59e0b', description: 'Conocimiento profundo requerido' },
        expert: { name: 'Experto', color: '#ef4444', description: 'Especialización académica necesaria' }
    }
};

// ==========================================
// AGUA SYSTEM CONSTANTS
// ==========================================

export const AGUA_CONFIG = {
    columns: {
        valor: {
            name: 'Valor',
            description: 'Elementos que aportan valor',
            color: '#10b981',
            icon: 'star',
            maxItems: 50
        },
        anadir: {
            name: 'Añadir',
            description: 'Elementos por incorporar',
            color: '#3b82f6',
            icon: 'plus',
            maxItems: 30
        },
        noAnadir: {
            name: 'No Añadir',
            description: 'Elementos a evitar',
            color: '#ef4444',
            icon: 'x',
            maxItems: 20
        }
    },
    
    // Predefined element types
    elementTypes: {
        practice: 'Práctica Espiritual',
        study: 'Método de Estudio',
        habit: 'Hábito Personal',
        resource: 'Recurso',
        relationship: 'Relación',
        activity: 'Actividad',
        mindset: 'Mentalidad',
        discipline: 'Disciplina'
    },
    
    // Drag and drop settings
    dragConfig: {
        ghostOpacity: 0.5,
        dragThreshold: 5,
        autoScrollSpeed: 10,
        animationDuration: 300
    }
};

// ==========================================
// SOCIAL SYSTEM CONSTANTS
// ==========================================

export const SOCIAL_CONFIG = {
    // User roles and permissions
    userRoles: {
        student: { name: 'Estudiante', permissions: ['read', 'comment', 'share'] },
        mentor: { name: 'Mentor', permissions: ['read', 'comment', 'share', 'moderate', 'teach'] },
        pastor: { name: 'Pastor', permissions: ['read', 'comment', 'share', 'moderate', 'teach', 'admin'] },
        admin: { name: 'Administrador', permissions: ['all'] }
    },
    
    // Community types
    communityTypes: {
        study: { name: 'Grupo de Estudio', maxMembers: 12, features: ['discussions', 'assignments'] },
        prayer: { name: 'Grupo de Oración', maxMembers: 8, features: ['prayer-requests', 'testimonies'] },
        fellowship: { name: 'Comunión', maxMembers: 25, features: ['events', 'social'] },
        mentorship: { name: 'Mentoría', maxMembers: 2, features: ['one-on-one', 'progress-tracking'] }
    },
    
    // Activity types
    activityTypes: {
        study: 'Estudio Bíblico',
        prayer: 'Oración',
        discussion: 'Discusión',
        sharing: 'Compartir',
        testimony: 'Testimonio',
        question: 'Pregunta',
        insight: 'Insight',
        milestone: 'Logro'
    }
};

// ==========================================
// GAMIFICATION CONSTANTS
// ==========================================

export const GAMIFICATION_CONFIG = {
    // XP system
    xp: {
        dailyReading: 50,
        verseMemorized: 100,
        studySession: 75,
        prayerTime: 25,
        socialInteraction: 30,
        toolUsage: 40,
        streakBonus: 1.5, // multiplier
        perfectWeek: 300 // bonus XP
    },
    
    // Level system (XP thresholds)
    levels: [
        { level: 1, threshold: 0, title: 'Principiante', badge: 'seedling' },
        { level: 2, threshold: 500, title: 'Explorador', badge: 'compass' },
        { level: 3, threshold: 1200, title: 'Estudiante', badge: 'book' },
        { level: 4, threshold: 2500, title: 'Discípulo', badge: 'graduation-cap' },
        { level: 5, threshold: 5000, title: 'Maestro', badge: 'award' },
        { level: 6, threshold: 10000, title: 'Sabio', badge: 'crown' },
        { level: 7, threshold: 20000, title: 'Mentor', badge: 'star' },
        { level: 8, threshold: 35000, title: 'Guía', badge: 'lighthouse' },
        { level: 9, threshold: 55000, title: 'Anciano', badge: 'tree' },
        { level: 10, threshold: 80000, title: 'Maestro Supremo', badge: 'gem' }
    ],
    
    // Achievements
    achievements: {
        streaks: [
            { id: 'streak-7', name: 'Semana Perfecta', description: '7 días consecutivos', xp: 200 },
            { id: 'streak-30', name: 'Mes Dedicado', description: '30 días consecutivos', xp: 1000 },
            { id: 'streak-100', name: 'Centurión', description: '100 días consecutivos', xp: 5000 }
        ],
        memory: [
            { id: 'memory-10', name: 'Memorista', description: '10 versículos memorizados', xp: 300 },
            { id: 'memory-50', name: 'Tesoro Viviente', description: '50 versículos memorizados', xp: 1500 },
            { id: 'memory-100', name: 'Biblioteca Humana', description: '100 versículos memorizados', xp: 3000 }
        ],
        study: [
            { id: 'tools-all', name: 'Explorador Completo', description: 'Usó todas las herramientas', xp: 2000 },
            { id: 'deep-study-100', name: 'Académico', description: '100 sesiones de estudio profundo', xp: 2500 }
        ]
    }
};

// ==========================================
// PERFORMANCE CONSTANTS
// ==========================================

export const PERFORMANCE_CONFIG = {
    // Lazy loading
    lazyLoading: {
        rootMargin: '50px',
        threshold: 0.1,
        imageQuality: 0.8
    },
    
    // Virtual scrolling
    virtualScrolling: {
        itemHeight: 60,
        bufferSize: 10,
        containerHeight: 400
    },
    
    // Caching
    cache: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        maxSize: 100, // items
        cleanupInterval: 1000 * 60 * 60 // 1 hour
    },
    
    // API limits
    api: {
        rateLimitWindow: 1000 * 60, // 1 minute
        rateLimitRequests: 60,
        timeoutDuration: 10000, // 10 seconds
        retryAttempts: 3,
        retryDelay: 1000 // 1 second
    }
};

// ==========================================
// LOCAL STORAGE KEYS
// ==========================================

export const STORAGE_KEYS = {
    // User data
    userProfile: 'bibliaapp_user_profile',
    userProgress: 'bibliaapp_user_progress',
    userSettings: 'bibliaapp_user_settings',
    
    // Application state
    currentReading: 'bibliaapp_current_reading',
    bookmarks: 'bibliaapp_bookmarks',
    notes: 'bibliaapp_notes',
    highlights: 'bibliaapp_highlights',
    
    // SRS data
    srsCards: 'bibliaapp_srs_cards',
    srsSchedule: 'bibliaapp_srs_schedule',
    srsStats: 'bibliaapp_srs_stats',
    
    // Agua system
    aguaElements: 'bibliaapp_agua_elements',
    aguaHistory: 'bibliaapp_agua_history',
    
    // Social data
    communities: 'bibliaapp_communities',
    socialActivity: 'bibliaapp_social_activity',
    
    // Cache
    bibleCache: 'bibliaapp_bible_cache',
    imageCache: 'bibliaapp_image_cache',
    apiCache: 'bibliaapp_api_cache',
    
    // Offline data
    offlineQueue: 'bibliaapp_offline_queue',
    lastSync: 'bibliaapp_last_sync'
};

// ==========================================
// API ENDPOINTS (if external API is used)
// ==========================================

export const API_ENDPOINTS = {
    base: 'https://api.bibliaapp.pro/v3',
    bible: '/bible',
    user: '/user', 
    social: '/social',
    sync: '/sync',
    analytics: '/analytics'
};

// ==========================================
// ERROR CODES AND MESSAGES
// ==========================================

export const ERROR_CODES = {
    // Network errors
    NETWORK_ERROR: { code: 'NET_001', message: 'Error de conexión. Verifica tu internet.' },
    TIMEOUT_ERROR: { code: 'NET_002', message: 'La solicitud tardó demasiado. Intenta de nuevo.' },
    
    // Data errors
    DATA_NOT_FOUND: { code: 'DATA_001', message: 'Información no encontrada.' },
    DATA_CORRUPTED: { code: 'DATA_002', message: 'Datos corruptos. Reinstalando...' },
    
    // User errors
    INVALID_INPUT: { code: 'USER_001', message: 'Entrada inválida. Verifica los datos.' },
    PERMISSION_DENIED: { code: 'USER_002', message: 'Permisos insuficientes.' },
    
    // System errors
    STORAGE_FULL: { code: 'SYS_001', message: 'Almacenamiento lleno. Libera espacio.' },
    FEATURE_DISABLED: { code: 'SYS_002', message: 'Función deshabilitada temporalmente.' }
};

// ==========================================
// EXPORT DEFAULT CONFIGURATION
// ==========================================

export default {
    APP_CONFIG,
    SRS_CONFIG,
    BIBLE_CONFIG,
    ANALYTICAL_TOOLS,
    AGUA_CONFIG,
    SOCIAL_CONFIG,
    GAMIFICATION_CONFIG,
    PERFORMANCE_CONFIG,
    STORAGE_KEYS,
    API_ENDPOINTS,
    ERROR_CODES
};