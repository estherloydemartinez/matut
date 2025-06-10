/* ==========================================================================
   BIBLIAAPP PRO v3.0 - STORAGE SYSTEM
   Advanced storage management with caching, encryption, and sync
   ========================================================================== */

import { STORAGE_KEYS, APP_CONFIG, PERFORMANCE_CONFIG } from './constants.js';
import { deepClone, deepMerge, setStorageWithExpiry, getStorageWithExpiry } from './utils.js';

// ==========================================
// STORAGE MANAGER CLASS
// ==========================================

class StorageManager {
    constructor() {
        this.cache = new Map();
        this.observers = new Map();
        this.syncQueue = [];
        this.isOnline = navigator.onLine;
        
        this.initializeStorage();
        this.setupEventListeners();
        this.startCleanupInterval();
    }
    
    /**
     * Initialize storage system
     */
    initializeStorage() {
        // Check localStorage availability
        this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
        
        // Initialize IndexedDB for large data
        this.initializeIndexedDB();
        
        // Setup encryption key
        this.encryptionKey = this.getOrCreateEncryptionKey();
        
        console.log('Storage system initialized:', {
            localStorage: this.isLocalStorageAvailable,
            indexedDB: !!this.db,
            encryption: !!this.encryptionKey
        });
    }
    
    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    checkLocalStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return false;
        }
    }
    
    /**
     * Initialize IndexedDB for large data storage
     */
    async initializeIndexedDB() {
        if (!('indexedDB' in window)) {
            console.warn('IndexedDB not supported');
            return;
        }
        
        try {
            this.db = await this.openIndexedDB();
        } catch (error) {
            console.warn('Failed to initialize IndexedDB:', error);
        }
    }
    
    /**
     * Open IndexedDB connection
     * @returns {Promise<IDBDatabase>}
     */
    openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('BibliaAppDB', 3);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Bible content store
                if (!db.objectStoreNames.contains('bibleContent')) {
                    const bibleStore = db.createObjectStore('bibleContent', { keyPath: 'id' });
                    bibleStore.createIndex('version', 'version', { unique: false });
                    bibleStore.createIndex('book', 'book', { unique: false });
                }
                
                // User data store
                if (!db.objectStoreNames.contains('userData')) {
                    const userStore = db.createObjectStore('userData', { keyPath: 'id' });
                    userStore.createIndex('type', 'type', { unique: false });
                    userStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                // Cache store
                if (!db.objectStoreNames.contains('cache')) {
                    const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
                    cacheStore.createIndex('expiry', 'expiry', { unique: false });
                }
                
                // Offline queue store
                if (!db.objectStoreNames.contains('offlineQueue')) {
                    const queueStore = db.createObjectStore('offlineQueue', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    queueStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }
    
    /**
     * Get or create encryption key for sensitive data
     * @returns {string}
     */
    getOrCreateEncryptionKey() {
        try {
            let key = localStorage.getItem('__encryption_key__');
            
            if (!key) {
                // Generate simple encryption key (in real app, use proper crypto)
                key = btoa(Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15));
                localStorage.setItem('__encryption_key__', key);
            }
            
            return key;
        } catch (error) {
            console.warn('Failed to setup encryption:', error);
            return null;
        }
    }
    
    /**
     * Setup event listeners for storage events
     */
    setupEventListeners() {
        // Listen for online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processSyncQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
        
        // Listen for storage events from other tabs
        window.addEventListener('storage', (event) => {
            this.handleStorageEvent(event);
        });
        
        // Listen for beforeunload to save pending data
        window.addEventListener('beforeunload', () => {
            this.flush();
        });
    }
    
    /**
     * Handle storage events from other tabs
     * @param {StorageEvent} event
     */
    handleStorageEvent(event) {
        if (event.key && this.observers.has(event.key)) {
            const observers = this.observers.get(event.key);
            const newValue = event.newValue ? JSON.parse(event.newValue) : null;
            
            observers.forEach(callback => {
                try {
                    callback(newValue, event.oldValue ? JSON.parse(event.oldValue) : null);
                } catch (error) {
                    console.warn('Storage observer error:', error);
                }
            });
        }
    }
    
    /**
     * Start cleanup interval for expired data
     */
    startCleanupInterval() {
        setInterval(() => {
            this.cleanupExpiredData();
        }, PERFORMANCE_CONFIG.cache.cleanupInterval);
    }
    
    // ==========================================
    // BASIC STORAGE OPERATIONS
    // ==========================================
    
    /**
     * Set item in storage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @param {Object} options - Storage options
     * @returns {Promise<boolean>}
     */
    async set(key, value, options = {}) {
        const {
            expiry = null,
            encrypt = false,
            useIndexedDB = false,
            compress = false,
            sync = true
        } = options;
        
        try {
            let processedValue = deepClone(value);
            
            // Encrypt if required
            if (encrypt && this.encryptionKey) {
                processedValue = this.encrypt(processedValue);
            }
            
            // Compress if required
            if (compress) {
                processedValue = this.compress(processedValue);
            }
            
            const dataPackage = {
                value: processedValue,
                timestamp: Date.now(),
                expiry: expiry ? Date.now() + expiry : null,
                encrypted: encrypt,
                compressed: compress\n            };\n            \n            // Store in appropriate location\n            if (useIndexedDB && this.db) {\n                await this.setIndexedDB(key, dataPackage);\n            } else if (this.isLocalStorageAvailable) {\n                localStorage.setItem(key, JSON.stringify(dataPackage));\n            } else {\n                // Fallback to memory cache\n                this.cache.set(key, dataPackage);\n            }\n            \n            // Add to sync queue if sync is enabled and we're offline\n            if (sync && !this.isOnline) {\n                this.addToSyncQueue('set', key, value, options);\n            }\n            \n            // Notify observers\n            this.notifyObservers(key, value);\n            \n            return true;\n        } catch (error) {\n            console.error('Failed to set storage item:', error);\n            return false;\n        }\n    }\n    \n    /**\n     * Get item from storage\n     * @param {string} key - Storage key\n     * @param {any} defaultValue - Default value if not found\n     * @returns {Promise<any>}\n     */\n    async get(key, defaultValue = null) {\n        try {\n            let dataPackage = null;\n            \n            // Try memory cache first\n            if (this.cache.has(key)) {\n                dataPackage = this.cache.get(key);\n            }\n            // Try IndexedDB\n            else if (this.db) {\n                dataPackage = await this.getIndexedDB(key);\n            }\n            // Try localStorage\n            else if (this.isLocalStorageAvailable) {\n                const stored = localStorage.getItem(key);\n                if (stored) {\n                    dataPackage = JSON.parse(stored);\n                }\n            }\n            \n            if (!dataPackage) {\n                return defaultValue;\n            }\n            \n            // Check expiry\n            if (dataPackage.expiry && Date.now() > dataPackage.expiry) {\n                this.remove(key);\n                return defaultValue;\n            }\n            \n            let value = dataPackage.value;\n            \n            // Decompress if needed\n            if (dataPackage.compressed) {\n                value = this.decompress(value);\n            }\n            \n            // Decrypt if needed\n            if (dataPackage.encrypted && this.encryptionKey) {\n                value = this.decrypt(value);\n            }\n            \n            return value;\n        } catch (error) {\n            console.error('Failed to get storage item:', error);\n            return defaultValue;\n        }\n    }\n    \n    /**\n     * Remove item from storage\n     * @param {string} key - Storage key\n     * @returns {Promise<boolean>}\n     */\n    async remove(key) {\n        try {\n            // Remove from all locations\n            this.cache.delete(key);\n            \n            if (this.db) {\n                await this.removeIndexedDB(key);\n            }\n            \n            if (this.isLocalStorageAvailable) {\n                localStorage.removeItem(key);\n            }\n            \n            // Notify observers\n            this.notifyObservers(key, null);\n            \n            return true;\n        } catch (error) {\n            console.error('Failed to remove storage item:', error);\n            return false;\n        }\n    }\n    \n    /**\n     * Check if key exists in storage\n     * @param {string} key - Storage key\n     * @returns {Promise<boolean>}\n     */\n    async has(key) {\n        try {\n            const value = await this.get(key);\n            return value !== null;\n        } catch (error) {\n            return false;\n        }\n    }\n    \n    /**\n     * Clear all storage data\n     * @param {string} prefix - Optional key prefix to clear\n     * @returns {Promise<boolean>}\n     */\n    async clear(prefix = null) {\n        try {\n            if (prefix) {\n                // Clear with prefix\n                const keys = await this.keys();\n                const filteredKeys = keys.filter(key => key.startsWith(prefix));\n                \n                for (const key of filteredKeys) {\n                    await this.remove(key);\n                }\n            } else {\n                // Clear all\n                this.cache.clear();\n                \n                if (this.db) {\n                    await this.clearIndexedDB();\n                }\n                \n                if (this.isLocalStorageAvailable) {\n                    // Only clear our app's keys\n                    Object.values(STORAGE_KEYS).forEach(key => {\n                        localStorage.removeItem(key);\n                    });\n                }\n            }\n            \n            return true;\n        } catch (error) {\n            console.error('Failed to clear storage:', error);\n            return false;\n        }\n    }\n    \n    /**\n     * Get all storage keys\n     * @returns {Promise<string[]>}\n     */\n    async keys() {\n        const allKeys = new Set();\n        \n        // From memory cache\n        this.cache.keys().forEach(key => allKeys.add(key));\n        \n        // From IndexedDB\n        if (this.db) {\n            const indexedKeys = await this.getIndexedDBKeys();\n            indexedKeys.forEach(key => allKeys.add(key));\n        }\n        \n        // From localStorage\n        if (this.isLocalStorageAvailable) {\n            Object.values(STORAGE_KEYS).forEach(key => {\n                if (localStorage.getItem(key) !== null) {\n                    allKeys.add(key);\n                }\n            });\n        }\n        \n        return Array.from(allKeys);\n    }\n    \n    // ==========================================\n    // INDEXEDDB OPERATIONS\n    // ==========================================\n    \n    /**\n     * Set item in IndexedDB\n     * @param {string} key - Storage key\n     * @param {any} dataPackage - Data package to store\n     * @returns {Promise<boolean>}\n     */\n    setIndexedDB(key, dataPackage) {\n        return new Promise((resolve, reject) => {\n            const transaction = this.db.transaction(['cache'], 'readwrite');\n            const store = transaction.objectStore('cache');\n            const request = store.put({ key, ...dataPackage });\n            \n            request.onsuccess = () => resolve(true);\n            request.onerror = () => reject(request.error);\n        });\n    }\n    \n    /**\n     * Get item from IndexedDB\n     * @param {string} key - Storage key\n     * @returns {Promise<any>}\n     */\n    getIndexedDB(key) {\n        return new Promise((resolve, reject) => {\n            const transaction = this.db.transaction(['cache'], 'readonly');\n            const store = transaction.objectStore('cache');\n            const request = store.get(key);\n            \n            request.onsuccess = () => {\n                const result = request.result;\n                if (result) {\n                    delete result.key; // Remove the key property\n                    resolve(result);\n                } else {\n                    resolve(null);\n                }\n            };\n            request.onerror = () => reject(request.error);\n        });\n    }\n    \n    /**\n     * Remove item from IndexedDB\n     * @param {string} key - Storage key\n     * @returns {Promise<boolean>}\n     */\n    removeIndexedDB(key) {\n        return new Promise((resolve, reject) => {\n            const transaction = this.db.transaction(['cache'], 'readwrite');\n            const store = transaction.objectStore('cache');\n            const request = store.delete(key);\n            \n            request.onsuccess = () => resolve(true);\n            request.onerror = () => reject(request.error);\n        });\n    }\n    \n    /**\n     * Clear IndexedDB cache store\n     * @returns {Promise<boolean>}\n     */\n    clearIndexedDB() {\n        return new Promise((resolve, reject) => {\n            const transaction = this.db.transaction(['cache'], 'readwrite');\n            const store = transaction.objectStore('cache');\n            const request = store.clear();\n            \n            request.onsuccess = () => resolve(true);\n            request.onerror = () => reject(request.error);\n        });\n    }\n    \n    /**\n     * Get all keys from IndexedDB\n     * @returns {Promise<string[]>}\n     */\n    getIndexedDBKeys() {\n        return new Promise((resolve, reject) => {\n            const transaction = this.db.transaction(['cache'], 'readonly');\n            const store = transaction.objectStore('cache');\n            const request = store.getAllKeys();\n            \n            request.onsuccess = () => resolve(request.result);\n            request.onerror = () => reject(request.error);\n        });\n    }\n    \n    // ==========================================\n    // BIBLE DATA SPECIFIC METHODS\n    // ==========================================\n    \n    /**\n     * Store Bible content\n     * @param {string} version - Bible version\n     * @param {string} book - Book name\n     * @param {number} chapter - Chapter number\n     * @param {Object} content - Chapter content\n     * @returns {Promise<boolean>}\n     */\n    async setBibleContent(version, book, chapter, content) {\n        const key = `bible_${version}_${book}_${chapter}`;\n        return await this.set(key, content, {\n            useIndexedDB: true,\n            compress: true,\n            expiry: APP_CONFIG.cacheExpiry\n        });\n    }\n    \n    /**\n     * Get Bible content\n     * @param {string} version - Bible version\n     * @param {string} book - Book name\n     * @param {number} chapter - Chapter number\n     * @returns {Promise<Object|null>}\n     */\n    async getBibleContent(version, book, chapter) {\n        const key = `bible_${version}_${book}_${chapter}`;\n        return await this.get(key);\n    }\n    \n    /**\n     * Store user progress data\n     * @param {Object} progress - Progress data\n     * @returns {Promise<boolean>}\n     */\n    async setUserProgress(progress) {\n        return await this.set(STORAGE_KEYS.userProgress, progress, {\n            encrypt: true,\n            sync: true\n        });\n    }\n    \n    /**\n     * Get user progress data\n     * @returns {Promise<Object>}\n     */\n    async getUserProgress() {\n        return await this.get(STORAGE_KEYS.userProgress, {\n            level: 1,\n            xp: 0,\n            streak: 0,\n            achievements: [],\n            stats: {}\n        });\n    }\n    \n    /**\n     * Store SRS cards data\n     * @param {Array} cards - SRS cards array\n     * @returns {Promise<boolean>}\n     */\n    async setSRSCards(cards) {\n        return await this.set(STORAGE_KEYS.srsCards, cards, {\n            encrypt: true,\n            compress: true,\n            sync: true\n        });\n    }\n    \n    /**\n     * Get SRS cards data\n     * @returns {Promise<Array>}\n     */\n    async getSRSCards() {\n        return await this.get(STORAGE_KEYS.srsCards, []);\n    }\n    \n    /**\n     * Store Agua system elements\n     * @param {Object} elements - Agua elements data\n     * @returns {Promise<boolean>}\n     */\n    async setAguaElements(elements) {\n        return await this.set(STORAGE_KEYS.aguaElements, elements, {\n            sync: true\n        });\n    }\n    \n    /**\n     * Get Agua system elements\n     * @returns {Promise<Object>}\n     */\n    async getAguaElements() {\n        return await this.get(STORAGE_KEYS.aguaElements, {\n            valor: [],\n            anadir: [],\n            noAnadir: []\n        });\n    }\n    \n    // ==========================================\n    // ENCRYPTION/COMPRESSION UTILITIES\n    // ==========================================\n    \n    /**\n     * Simple encryption (for demo - use proper crypto in production)\n     * @param {any} data - Data to encrypt\n     * @returns {string}\n     */\n    encrypt(data) {\n        try {\n            const jsonString = JSON.stringify(data);\n            return btoa(jsonString); // Simple base64 encoding\n        } catch (error) {\n            console.warn('Encryption failed:', error);\n            return data;\n        }\n    }\n    \n    /**\n     * Simple decryption\n     * @param {string} encryptedData - Encrypted data\n     * @returns {any}\n     */\n    decrypt(encryptedData) {\n        try {\n            const jsonString = atob(encryptedData);\n            return JSON.parse(jsonString);\n        } catch (error) {\n            console.warn('Decryption failed:', error);\n            return encryptedData;\n        }\n    }\n    \n    /**\n     * Simple compression using JSON minification\n     * @param {any} data - Data to compress\n     * @returns {string}\n     */\n    compress(data) {\n        try {\n            // Simple compression by removing unnecessary whitespace\n            return JSON.stringify(data);\n        } catch (error) {\n            console.warn('Compression failed:', error);\n            return data;\n        }\n    }\n    \n    /**\n     * Simple decompression\n     * @param {string} compressedData - Compressed data\n     * @returns {any}\n     */\n    decompress(compressedData) {\n        try {\n            return JSON.parse(compressedData);\n        } catch (error) {\n            console.warn('Decompression failed:', error);\n            return compressedData;\n        }\n    }\n    \n    // ==========================================\n    // SYNC AND OFFLINE SUPPORT\n    // ==========================================\n    \n    /**\n     * Add operation to sync queue\n     * @param {string} operation - Operation type\n     * @param {string} key - Storage key\n     * @param {any} value - Value\n     * @param {Object} options - Options\n     */\n    addToSyncQueue(operation, key, value, options) {\n        this.syncQueue.push({\n            id: Date.now() + Math.random(),\n            operation,\n            key,\n            value,\n            options,\n            timestamp: Date.now()\n        });\n        \n        // Store sync queue persistently\n        this.set(STORAGE_KEYS.offlineQueue, this.syncQueue, { sync: false });\n    }\n    \n    /**\n     * Process sync queue when online\n     */\n    async processSyncQueue() {\n        if (!this.isOnline || this.syncQueue.length === 0) return;\n        \n        console.log(`Processing ${this.syncQueue.length} queued operations`);\n        \n        const processedIds = [];\n        \n        for (const operation of this.syncQueue) {\n            try {\n                // Process each operation\n                await this.processSyncOperation(operation);\n                processedIds.push(operation.id);\n            } catch (error) {\n                console.error('Failed to sync operation:', error);\n                // Keep failed operations in queue for retry\n            }\n        }\n        \n        // Remove successfully processed operations\n        this.syncQueue = this.syncQueue.filter(op => !processedIds.includes(op.id));\n        \n        // Update stored queue\n        await this.set(STORAGE_KEYS.offlineQueue, this.syncQueue, { sync: false });\n        \n        // Update last sync timestamp\n        await this.set(STORAGE_KEYS.lastSync, Date.now(), { sync: false });\n    }\n    \n    /**\n     * Process individual sync operation\n     * @param {Object} operation - Sync operation\n     */\n    async processSyncOperation(operation) {\n        // In a real app, this would sync with server\n        // For now, just ensure the data is properly stored\n        const { operation: op, key, value, options } = operation;\n        \n        if (op === 'set') {\n            await this.set(key, value, { ...options, sync: false });\n        } else if (op === 'remove') {\n            await this.remove(key);\n        }\n    }\n    \n    /**\n     * Load sync queue from storage\n     */\n    async loadSyncQueue() {\n        const queue = await this.get(STORAGE_KEYS.offlineQueue, []);\n        this.syncQueue = queue;\n        \n        if (this.isOnline && this.syncQueue.length > 0) {\n            this.processSyncQueue();\n        }\n    }\n    \n    // ==========================================\n    // OBSERVERS AND EVENTS\n    // ==========================================\n    \n    /**\n     * Subscribe to storage changes\n     * @param {string} key - Storage key to watch\n     * @param {function} callback - Callback function\n     * @returns {function} Unsubscribe function\n     */\n    subscribe(key, callback) {\n        if (!this.observers.has(key)) {\n            this.observers.set(key, new Set());\n        }\n        \n        this.observers.get(key).add(callback);\n        \n        // Return unsubscribe function\n        return () => {\n            const observers = this.observers.get(key);\n            if (observers) {\n                observers.delete(callback);\n                if (observers.size === 0) {\n                    this.observers.delete(key);\n                }\n            }\n        };\n    }\n    \n    /**\n     * Notify observers of storage changes\n     * @param {string} key - Storage key\n     * @param {any} value - New value\n     */\n    notifyObservers(key, value) {\n        if (this.observers.has(key)) {\n            this.observers.get(key).forEach(callback => {\n                try {\n                    callback(value, key);\n                } catch (error) {\n                    console.warn('Observer callback error:', error);\n                }\n            });\n        }\n    }\n    \n    // ==========================================\n    // MAINTENANCE AND CLEANUP\n    // ==========================================\n    \n    /**\n     * Clean up expired data\n     */\n    async cleanupExpiredData() {\n        try {\n            const keys = await this.keys();\n            const now = Date.now();\n            \n            for (const key of keys) {\n                const dataPackage = await this.getRawDataPackage(key);\n                \n                if (dataPackage && dataPackage.expiry && now > dataPackage.expiry) {\n                    await this.remove(key);\n                }\n            }\n        } catch (error) {\n            console.warn('Cleanup failed:', error);\n        }\n    }\n    \n    /**\n     * Get raw data package without processing\n     * @param {string} key - Storage key\n     * @returns {Promise<Object|null>}\n     */\n    async getRawDataPackage(key) {\n        try {\n            if (this.cache.has(key)) {\n                return this.cache.get(key);\n            }\n            \n            if (this.db) {\n                return await this.getIndexedDB(key);\n            }\n            \n            if (this.isLocalStorageAvailable) {\n                const stored = localStorage.getItem(key);\n                return stored ? JSON.parse(stored) : null;\n            }\n            \n            return null;\n        } catch (error) {\n            return null;\n        }\n    }\n    \n    /**\n     * Get storage usage statistics\n     * @returns {Promise<Object>}\n     */\n    async getStorageStats() {\n        const stats = {\n            localStorage: 0,\n            indexedDB: 0,\n            memoryCache: 0,\n            totalKeys: 0\n        };\n        \n        try {\n            // Calculate localStorage usage\n            if (this.isLocalStorageAvailable) {\n                let localStorageSize = 0;\n                Object.values(STORAGE_KEYS).forEach(key => {\n                    const item = localStorage.getItem(key);\n                    if (item) {\n                        localStorageSize += item.length;\n                    }\n                });\n                stats.localStorage = localStorageSize;\n            }\n            \n            // Calculate memory cache usage\n            let cacheSize = 0;\n            this.cache.forEach((value, key) => {\n                cacheSize += JSON.stringify(value).length;\n            });\n            stats.memoryCache = cacheSize;\n            \n            // Calculate total keys\n            const keys = await this.keys();\n            stats.totalKeys = keys.length;\n            \n        } catch (error) {\n            console.warn('Failed to calculate storage stats:', error);\n        }\n        \n        return stats;\n    }\n    \n    /**\n     * Flush all pending operations\n     */\n    async flush() {\n        try {\n            if (this.isOnline && this.syncQueue.length > 0) {\n                await this.processSyncQueue();\n            }\n        } catch (error) {\n            console.warn('Failed to flush storage:', error);\n        }\n    }\n    \n    /**\n     * Reset storage system (for debugging)\n     */\n    async reset() {\n        await this.clear();\n        this.cache.clear();\n        this.syncQueue = [];\n        this.observers.clear();\n        \n        console.log('Storage system reset');\n    }\n}\n\n// ==========================================\n// CREATE AND EXPORT STORAGE INSTANCE\n// ==========================================\n\nconst storage = new StorageManager();\n\n// Initialize sync queue on startup\nstorage.loadSyncQueue();\n\nexport default storage;\nexport { StorageManager };"