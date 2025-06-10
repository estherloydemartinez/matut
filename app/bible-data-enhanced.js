/* ==========================================================================
   BIBLIAAPP PRO v3.0 - ENHANCED BIBLE DATA MODULE
   Advanced Bible text processing with Mantenencia/Aumentancia concepts
   ========================================================================== */

import { $, $$, createElement, debounce, deepClone } from './utils.js'; // Corrected path
import { BIBLE_CONFIG } from './constants.js'; // Corrected path
import stateManager, { getState, setState, subscribe } from './state-manager.js'; // Corrected path
import uiManager from './ui-manager.js'; // Corrected path

// Intended Bible Data Path (relative to app root): ../bakend/biblia offline/

// ==========================================
// ENHANCED BIBLE DATA CLASS
// ==========================================

class BibleDataEnhanced {
    constructor() {
        this.currentVerseRef = null; // e.g., { book: 'Juan', chapter: 3, verse: 16 }
        this.bookIndex = []; // To store data from Books.json
        this.bibleBooksData = {}; // Cache for loaded book data { "Genesis": { chapters... } }

        this.searchResults = [];
        this.annotations = new Map();
        this.crossReferences = new Map();
        this.analyticalFilters = {
            mantenencia: [],
            aumentancia: [],
            custom: []
        };
        this.textAnalysis = {}; // Store analysis per verseKey

        this.isInitialized = false;
        this.dataBasePath = '../bakend/biblia offline/'; // Relative to app/index.html

        // Make sure this is called after all properties are initialized
        this.initializeSystem();
    }

    /**
     * Initialize Bible Data System
     */
    async initializeSystem() {
        try {
            // Load Bible book index
            await this.loadBookIndex(); // Changed from loadBibleData

            // Setup analytical filters
            this.setupAnalyticalFilters();

            // Setup reading interface
            this.setupReadingInterface();

            // Setup state subscriptions
            this.setupStateSubscriptions();

            // Set a default verse to trigger initial load if needed
            const currentRef = getState('bible.current') || BIBLE_CONFIG.defaultVerse || { book: 'Juan', chapter: 3, verse: 16 };
            await this.setCurrentVerse(currentRef.book, currentRef.chapter, currentRef.verse);

            this.isInitialized = true;
            console.log('✅ Enhanced Bible Data system initialized');

        } catch (error) {
            console.error('Failed to initialize Bible Data system:', error);
            uiManager.showNotification('Error al cargar datos bíblicos. Algunas funciones pueden no estar disponibles.', 'error', { persistent: true });
        }
    }

    /**
     * Load Bible book index (Books.json)
     */
    async loadBookIndex() {
        try {
            const response = await fetch(`${this.dataBasePath}Books.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} while fetching Books.json`);
            }
            this.bookIndex = await response.json();
            setState('bible.bookIndex', this.bookIndex);
            console.log('📚 Book index loaded successfully:', this.bookIndex.length, 'books');
        } catch (error) {
            console.error('Error loading Books.json:', error);
            throw error; // Re-throw to be caught by initializeSystem
        }
    }

    /**
     * Load data for a specific book if not already loaded
     * @param {string} bookName - The name of the book (e.g., "Génesis")
     * @returns {Promise<Object|null>} The book data or null if not found/error
     */
    async loadBookData(bookName) {
        if (this.bibleBooksData[bookName]) {
            return this.bibleBooksData[bookName]; // Already loaded
        }

        const bookMeta = this.bookIndex.find(b => b.name === bookName || b.aliases?.includes(bookName));
        if (!bookMeta || !bookMeta.file) {
            console.error(`Book metadata not found for: ${bookName}`);
            return null;
        }

        try {
            console.log(`Fetching data for ${bookName} from ${this.dataBasePath}${bookMeta.file}...`);
            const response = await fetch(`${this.dataBasePath}${bookMeta.file}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} while fetching ${bookMeta.file}`);
            }
            const bookData = await response.json();
            this.bibleBooksData[bookName] = bookData; // Cache it
            console.log(`📖 Data for ${bookName} loaded and cached.`);
            return bookData;
        } catch (error) {
            console.error(`Error loading data for ${bookName}:`, error);
            uiManager.showNotification(`Error al cargar datos para ${bookName}.`, 'error');
            return null;
        }
    }

    /**
     * Setup analytical filters for Mantenencia and Aumentancia
     */
    setupAnalyticalFilters() {
        // ... (existing setupAnalyticalFilters method content remains unchanged)
        this.analyticalFilters.mantenencia = [
            { id: 'mant_preservacion', name: 'Preservación de la Fe', description: 'Textos sobre mantener y preservar la fe', keywords: ['guardar', 'mantener', 'preservar', 'permanecer', 'fiel', 'constante'], color: '#4CAF50', category: 'mantenencia' },
            { id: 'mant_disciplinas', name: 'Disciplinas Espirituales', description: 'Prácticas regulares de la vida cristiana', keywords: ['orar', 'ayunar', 'leer', 'estudiar', 'meditar', 'adorar'], color: '#2196F3', category: 'mantenencia' },
            { id: 'mant_caracter', name: 'Formación del Carácter', description: 'Desarrollo y mantenimiento del carácter cristiano', keywords: ['paciencia', 'humildad', 'amor', 'bondad', 'templanza', 'dominio'], color: '#9C27B0', category: 'mantenencia' }
        ];
        this.analyticalFilters.aumentancia = [
            { id: 'aum_crecimiento', name: 'Crecimiento Espiritual', description: 'Textos sobre crecimiento y madurez espiritual', keywords: ['crecer', 'madurar', 'desarrollar', 'avanzar', 'progresar', 'perfeccionar'], color: '#FF9800', category: 'aumentancia' },
            { id: 'aum_expansion', name: 'Expansión del Reino', description: 'Misión, evangelismo y expansión del reino de Dios', keywords: ['predicar', 'evangelizar', 'testificar', 'discípulos', 'misión', 'reino'], color: '#F44336', category: 'aumentancia' },
            { id: 'aum_dones', name: 'Desarrollo de Dones', description: 'Desarrollo y uso de dones espirituales', keywords: ['don', 'talento', 'habilidad', 'ministerio', 'servir', 'edificar'], color: '#795548', category: 'aumentancia' },
            { id: 'aum_transformacion', name: 'Transformación Personal', description: 'Cambio radical y renovación de la vida', keywords: ['transformar', 'renovar', 'cambiar', 'nuevo', 'regenerar', 'santificar'], color: '#607D8B', category: 'aumentancia' }
        ];
        console.log('🔍 Analytical filters configured');
    }

    /**
     * Setup reading interface
     */
    setupReadingInterface() {
        // ... (existing setupReadingInterface method content can remain, but ensure it calls updateVerseDisplay)
        const mantenenciaCheckbox = $('input[type="checkbox"] + span:contains("Mantenencia")')?.previousElementSibling;
        const aumentanciaCheckbox = $('input[type="checkbox"] + span:contains("Aumentancia")')?.previousElementSibling;
        if (mantenenciaCheckbox) { mantenenciaCheckbox.addEventListener('change', (e) => this.toggleAnalyticalFilter('mantenencia', e.target.checked)); }
        if (aumentanciaCheckbox) { aumentanciaCheckbox.addEventListener('change', (e) => this.toggleAnalyticalFilter('aumentancia', e.target.checked)); }
        this.updateVerseDisplay(); // Initial display
        console.log('📱 Reading interface configured');
    }

    /**
     * Set current verse
     * @param {string} book - Book name
     * @param {number} chapter - Chapter number
     * @param {number} verse - Verse number
     */
    async setCurrentVerse(book, chapter, verse) {
        this.currentVerseRef = { book, chapter: parseInt(chapter), verse: parseInt(verse) };

        setState('bible.current', this.currentVerseRef);

        // Ensure book data is loaded before updating display and analyzing
        await this.loadBookData(book);

        this.updateVerseDisplay();
        this.analyzeCurrentVerse();
    }

    /**
     * Update verse display in UI
     */
    async updateVerseDisplay() {
        if (!this.currentVerseRef) {
            console.warn("updateVerseDisplay called but currentVerseRef is not set.");
            return;
        }
        const { book, chapter, verse } = this.currentVerseRef;
        const verseContainer = $('.border.border-\\[var\\(--border-color\\)\\]\\.rounded\\.p-3'); // Escaped special chars for querySelector
        if (!verseContainer) {
            console.warn("Verse container not found in UI for display.");
            return;
        }

        const reference = `${book} ${chapter}:${verse}`;
        const text = await this.getVerseText(book, chapter, verse); // Now async

        const referenceElement = verseContainer.querySelector('.font-semibold');
        if (referenceElement) {
            referenceElement.textContent = `${reference} (RV1960)`; // Assuming RV1960 for now
        }

        const textElement = verseContainer.querySelector('.discord-text-secondary');
        if (textElement) {
            textElement.innerHTML = this.highlightAnalyticalElements(text || "Texto no disponible.");
        }
    }

    /**
     * Get verse text from loaded data
     * @param {string} bookName - Book name
     * @param {number} chapterNum - Chapter number (1-indexed)
     * @param {number} verseNum - Verse number (1-indexed)
     * @returns {Promise<string|null>}
     */
    async getVerseText(bookName, chapterNum, verseNum) {
        const bookData = await this.loadBookData(bookName); // Ensures data is loaded
        if (!bookData) {
            return `Error: Libro "${bookName}" no encontrado o no pudo ser cargado.`;
        }

        const chapter = bookData.chapters?.find(c => c.chapter === chapterNum);
        if (!chapter) {
            return `Error: Capítulo ${chapterNum} no encontrado en ${bookName}.`;
        }

        const verseData = chapter.verses?.find(v => v.verse === verseNum);
        if (!verseData) {
            return `Error: Versículo ${verseNum} no encontrado en ${bookName} ${chapterNum}.`;
        }
        return verseData.text;
    }

    /**
     * Highlight analytical elements in text
     * @param {string} text - Original text
     * @returns {string} Highlighted text
     */
    highlightAnalyticalElements(text) {
        // ... (existing highlightAnalyticalElements method content remains unchanged)
        if (!text) return '';
        let highlightedText = text;
        const mantenenciaActive = getState('ui.filters.mantenencia', false);
        const aumentanciaActive = getState('ui.filters.aumentancia', false);
        if (mantenenciaActive) {
            this.analyticalFilters.mantenencia.forEach(filter => {
                filter.keywords.forEach(keyword => {
                    const regex = new RegExp(`\\b(${keyword}\\w*)\\b`, 'gi');
                    highlightedText = highlightedText.replace(regex, `<span class="inline-block px-1 py-0.5 rounded text-xs font-medium" style="background-color: ${filter.color}20; color: ${filter.color}; border: 1px solid ${filter.color}30;">$1</span>`);
                });
            });
        }
        if (aumentanciaActive) {
            this.analyticalFilters.aumentancia.forEach(filter => {
                filter.keywords.forEach(keyword => {
                    const regex = new RegExp(`\\b(${keyword}\\w*)\\b`, 'gi');
                    highlightedText = highlightedText.replace(regex, `<span class="inline-block px-1 py-0.5 rounded text-xs font-medium" style="background-color: ${filter.color}20; color: ${filter.color}; border: 1px solid ${filter.color}30;">$1</span>`);
                });
            });
        }
        return highlightedText;
    }

    /**
     * Toggle analytical filter
     * @param {string} filterType - Filter type (mantenencia/aumentancia)
     * @param {boolean} active - Whether filter is active
     */
    toggleAnalyticalFilter(filterType, active) {
        // ... (existing toggleAnalyticalFilter method content remains unchanged)
        setState(`ui.filters.${filterType}`, active);
        this.updateVerseDisplay();
        const filterName = filterType === 'mantenencia' ? 'Mantenencia' : 'Aumentancia';
        const action = active ? 'activado' : 'desactivado';
        uiManager.showNotification(`Filtro ${filterName} ${action}`, 'info', { duration: 2000 });
        this.analyzeCurrentVerse();
    }

    /**
     * Analyze current verse for patterns and insights
     */
    async analyzeCurrentVerse() {
        if (!this.currentVerseRef) return;
        const { book, chapter, verse } = this.currentVerseRef;
        const text = await this.getVerseText(book, chapter, verse);
        if (!text || text.startsWith("Error:")) {
            console.warn("Cannot analyze verse, text not available:", text);
            return;
        }
        const analysis = this.performTextAnalysis(text);
        const verseKey = `${book}_${chapter}_${verse}`;
        this.textAnalysis[verseKey] = analysis;
        setState('bible.analysis.current', analysis);
        console.log(`🔍 Analyzed verse: ${verseKey}`, analysis);
    }

    /**
     * Perform comprehensive text analysis
     * @param {string} text - Text to analyze
     * @returns {Object} Analysis results
     */
    performTextAnalysis(text) {
        // ... (existing performTextAnalysis method content remains unchanged, ensure it handles null/empty text)
        if (!text) return {}; // Basic guard
        const analysis = { wordCount: 0, characterCount: 0, sentenceCount: 0, keywords: [], themes: [], mantenenciaScore: 0, aumentanciaScore: 0, complexity: 'medium', readability: 0, emotionalTone: 'neutral', literaryDevices: [] };
        analysis.characterCount = text.length;
        analysis.wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        analysis.sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
        if (analysis.wordCount === 0) return analysis; // Avoid division by zero
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordFreq = {};
        words.forEach(word => { if (word.length > 3) { wordFreq[word] = (wordFreq[word] || 0) + 1; } });
        analysis.keywords = Object.entries(wordFreq).sort(([,a], [,b]) => b - a).slice(0, 5).map(([word, count]) => ({ word, count }));
        analysis.mantenenciaScore = this.calculateThemeScore(text, this.analyticalFilters.mantenencia);
        analysis.aumentanciaScore = this.calculateThemeScore(text, this.analyticalFilters.aumentancia);
        if (analysis.mantenenciaScore > analysis.aumentanciaScore) { analysis.themes.push('Mantenencia'); } else if (analysis.aumentanciaScore > analysis.mantenenciaScore) { analysis.themes.push('Aumentancia'); } else { analysis.themes.push('Equilibrado'); }
        const avgWordsPerSentence = analysis.wordCount / Math.max(analysis.sentenceCount, 1);
        if (avgWordsPerSentence > 15) { analysis.complexity = 'high'; } else if (avgWordsPerSentence < 8) { analysis.complexity = 'low'; }
        analysis.readability = Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (analysis.characterCount / analysis.wordCount)) ));
        const positiveWords = ['amor', 'vida', 'eterna', 'bendición', 'gozo', 'paz', 'fortaleza'];
        const negativeWords = ['muerte', 'pecado', 'perdición', 'ira', 'juicio', 'condenación'];
        const positiveCount = positiveWords.filter(word => text.toLowerCase().includes(word)).length;
        const negativeCount = negativeWords.filter(word => text.toLowerCase().includes(word)).length;
        if (positiveCount > negativeCount) { analysis.emotionalTone = 'positive'; } else if (negativeCount > positiveCount) { analysis.emotionalTone = 'negative'; }
        if (text.includes('como') || text.includes('cual')) { analysis.literaryDevices.push('símil'); }
        if (text.match(/\b(\w+)\s+\w+\s+\1\b/)) { analysis.literaryDevices.push('repetición'); }
        if (text.split(',').length > 2) { analysis.literaryDevices.push('enumeración'); }
        return analysis;
    }

    /**
     * Calculate theme score for given filters
     * @param {string} text - Text to analyze
     * @param {Array} filters - Filter array
     * @returns {number} Theme score (0-100)
     */
    calculateThemeScore(text, filters) {
        // ... (existing calculateThemeScore method content remains unchanged)
        let totalMatches = 0; let totalKeywords = 0;
        filters.forEach(filter => {
            totalKeywords += filter.keywords.length;
            filter.keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
                const matches = (text.match(regex) || []).length;
                totalMatches += matches;
            });
        });
        return totalKeywords > 0 ? Math.min(100, (totalMatches / totalKeywords) * 100) : 0;
    }

    /**
     * Search Bible text (Placeholder - needs full implementation with actual data)
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @returns {Array} Search results
     */
    async searchBible(query, options = {}) {
        // This needs to iterate over this.bibleBooksData and this.bookIndex
        // For now, returning sample to avoid breaking UI if called.
        console.warn("searchBible is using placeholder implementation.");
        const sampleResults = [ { book: 'Juan', chapter: 3, verse: 16, text: 'Porque de tal manera amó Dios al mundo...', relevance: 0.95, context: { before: '...', after: '...' } } ];
        const filteredResults = sampleResults.filter(result => result.text.toLowerCase().includes(query.toLowerCase()));
        this.searchResults = filteredResults;
        setState('bible.searchResults', filteredResults);
        return filteredResults;
    }

    /**
     * Get cross-references for current verse (Placeholder)
     * @returns {Array} Cross-references
     */
    getCrossReferences() {
        // ... (existing getCrossReferences method content can remain, using sample data)
        if (!this.currentVerseRef) return [];
        const { book, chapter, verse } = this.currentVerseRef;
        const verseKey = `${book}_${chapter}_${verse}`;
        const sampleReferences = { 'Juan_3_16': [ { book: 'Romanos', chapter: 5, verse: 8, relation: 'amor de Dios' } ] };
        return sampleReferences[verseKey] || [];
    }

    /**
     * Add annotation to verse
     * @param {string} annotation - Annotation text
     * @param {Object} metadata - Additional metadata
     */
    addAnnotation(annotation, metadata = {}) {
        // ... (existing addAnnotation method content can remain)
        if (!this.currentVerseRef) return;
        const { book, chapter, verse } = this.currentVerseRef;
        const verseKey = `${book}_${chapter}_${verse}`;
        if (!this.annotations.has(verseKey)) { this.annotations.set(verseKey, []); }
        const annotationObj = { id: Date.now().toString(), text: annotation, timestamp: Date.now(), metadata };
        this.annotations.get(verseKey).push(annotationObj);
        setState('bible.annotations', Object.fromEntries(this.annotations));
        uiManager.showNotification('Anotación añadida correctamente', 'success', { duration: 2000 });
    }

    /**
     * Get annotations for current verse
     * @returns {Array} Annotations
     */
    getCurrentAnnotations() {
        // ... (existing getCurrentAnnotations method content can remain)
        if (!this.currentVerseRef) return [];
        const { book, chapter, verse } = this.currentVerseRef;
        const verseKey = `${book}_${chapter}_${verse}`;
        return this.annotations.get(verseKey) || [];
    }

    /**
     * Navigate to specific verse reference string
     * @param {string} reference - Bible reference (e.g., "Juan 3:16")
     */
    async navigateToVerse(reference) {
        const match = reference.match(/(\D+)\s*(\d+)\s*[:.]\s*(\d+)/); // More flexible parsing
        if (match) {
            const [, bookName, chapterStr, verseStr] = match;
            // Basic normalization for book name (e.g., "1 Juan" vs "1Juan")
            // More robust normalization might be needed.
            const normalizedBookName = bookName.trim().replace(/\s+/g, " ");
            await this.setCurrentVerse(normalizedBookName, parseInt(chapterStr), parseInt(verseStr));
        } else {
            console.warn("Invalid verse reference format for navigation:", reference);
            uiManager.showNotification(`Referencia inválida: ${reference}`, 'warning');
        }
    }

    getReadingPlanProgress() { return getState('bible.readingPlan', { currentDay: 1, totalDays: 365, completedReadings: [], streakDays: 0, plan: 'chronological' }); }
    markReadingCompleted(reference) { /* ... existing ... */ }

    setupStateSubscriptions() {
        subscribe('bible.current', async (current) => {
            if (current && current.book && current.chapter && current.verse) {
                // Avoid re-triggering if currentVerseRef already matches
                if (!this.currentVerseRef ||
                    this.currentVerseRef.book !== current.book ||
                    this.currentVerseRef.chapter !== current.chapter ||
                    this.currentVerseRef.verse !== current.verse) {
                    // Ensure we don't get into a loop if setCurrentVerse itself triggers this subscription immediately
                    // This check might need to be more robust depending on state update flow
                    const tempRef = { book: current.book, chapter: current.chapter, verse: current.verse };
                    if (JSON.stringify(tempRef) !== JSON.stringify(this.currentVerseRef)) {
                         await this.setCurrentVerse(current.book, current.chapter, current.verse);
                    }
                }
            }
        });
        // Subscribe to filter changes to re-highlight, not re-analyze unless content changes
        subscribe('ui.filters', () => {
            if(this.isInitialized && this.currentVerseRef){ // only if initialized and a verse is set
                this.updateVerseDisplay();
            }
        });
    }

    exportData() { /* ... existing ... */ return { annotations: Object.fromEntries(this.annotations), crossReferences: Object.fromEntries(this.crossReferences), textAnalysis: this.textAnalysis, readingPlan: this.getReadingPlanProgress(), exported: Date.now() }; }
    importData(data) { /* ... existing ... */ try { if (data.annotations) { this.annotations = new Map(Object.entries(data.annotations)); } if (data.crossReferences) { this.crossReferences = new Map(Object.entries(data.crossReferences)); } if (data.textAnalysis) { this.textAnalysis = data.textAnalysis; } uiManager.showNotification('Datos bíblicos importados correctamente', 'success', { duration: 3000 }); return true; } catch (error) { console.error('Failed to import Bible data:', error); return false; } }

    getStats() {
        if (!this.currentVerseRef) return { isInitialized: this.isInitialized, booksLoaded: Object.keys(this.bibleBooksData).length, bookIndexSize: this.bookIndex.length };
        const { book, chapter, verse } = this.currentVerseRef;
        return {
            currentVerse: `${book} ${chapter}:${verse}`,
            annotationsCount: this.annotations.size,
            crossReferencesCount: this.crossReferences.size,
            analysisCount: Object.keys(this.textAnalysis).length,
            filtersAvailable: { mantenencia: this.analyticalFilters.mantenencia.length, aumentancia: this.analyticalFilters.aumentancia.length },
            isInitialized: this.isInitialized,
            booksLoaded: Object.keys(this.bibleBooksData).length,
            bookIndexSize: this.bookIndex.length
        };
    }

    debug() {
        console.group('📖 Enhanced Bible Data Debug');
        console.log('Statistics:', this.getStats());
        if (this.currentVerseRef) {
            const { book, chapter, verse } = this.currentVerseRef;
            console.log('Current analysis:', this.textAnalysis[`${book}_${chapter}_${verse}`]);
        }
        console.log('Book Index:', this.bookIndex);
        console.log('Loaded Books Data:', this.bibleBooksData);
        console.log('Analytical filters:', this.analyticalFilters);
        console.log('Annotations:', Object.fromEntries(this.annotations));
        console.groupEnd();
    }
}

// ==========================================
// CREATE AND EXPORT BIBLE DATA INSTANCE
// ==========================================

const bibleDataEnhanced = new BibleDataEnhanced();

export default bibleDataEnhanced;
export { BibleDataEnhanced };
