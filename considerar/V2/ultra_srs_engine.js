/**
 * Ultra SRS (Spaced Repetition System) Engine
 * Advanced AI-powered memorization system for biblical texts
 * Version 3.0.0 - Production Ready
 */

class UltraSRSEngine {
    constructor() {
        this.version = '3.0.0';
        this.algorithm = 'ultra-sm2-plus';
        this.cards = new Map();
        this.sessions = [];
        this.userProfile = null;
        this.neuralPredictor = null;
        this.difficultyEstimator = null;
        this.currentCard = null;
        this.isInitialized = false;
        
        // Advanced configuration
        this.config = {
            maxCardsPerSession: 50,
            newCardsPerDay: 20,
            maxReviewsPerDay: 200,
            graduationInterval: 4, // days
            easyInterval: 4, // days
            hardInterval: 1.2, // multiplier
            lapseInterval: 0.5, // multiplier
            minimumInterval: 1, // day
            maximumInterval: 36500, // 100 years
            easeFactor: {
                initial: 2.5,
                minimum: 1.3,
                maximum: 5.0,
                step: 0.15
            },
            leechThreshold: 8, // lapses before marking as leech
            buriedDelay: 1, // hour
            adaptiveAlgorithm: true,
            neuralPrediction: true
        };

        // Performance metrics
        this.metrics = {
            totalCards: 0,
            activeCards: 0,
            matureCards: 0,
            leechCards: 0,
            retentionRate: 0,
            averageRecallTime: 0,
            studyStreak: 0,
            totalStudyTime: 0,
            averageEaseFactor: 0,
            predictedAccuracy: 0
        };

        // Learning analytics
        this.analytics = {
            difficultyProgression: [],
            memoryStrength: new Map(),
            forgettingCurve: new Map(),
            optimalIntervals: new Map(),
            userPatterns: {
                bestStudyTime: null,
                averageSessionLength: 0,
                preferredDifficulty: 'medium',
                strongCategories: [],
                weakCategories: []
            }
        };

        this.init();
    }

    async init() {
        console.log('🧠 Initializing Ultra SRS Engine...');
        
        try {
            await this.loadUserProfile();
            await this.initializeNeuralComponents();
            await this.loadCards();
            await this.setupEventListeners();
            await this.initializeAnalytics();
            
            this.isInitialized = true;
            console.log('✅ Ultra SRS Engine fully initialized');
            
            // Start background processes
            this.startBackgroundOptimization();
            
        } catch (error) {
            console.error('❌ Failed to initialize Ultra SRS Engine:', error);
            throw error;
        }
    }

    async initializeNeuralComponents() {
        // Initialize neural predictor for interval optimization
        this.neuralPredictor = new NeuralIntervalPredictor();
        await this.neuralPredictor.init();
        
        // Initialize difficulty estimator
        this.difficultyEstimator = new DifficultyEstimator();
        await this.difficultyEstimator.init();
        
        // Initialize memory model
        this.memoryModel = new MemoryModel();
        await this.memoryModel.init();
    }

    async loadUserProfile() {
        // Load or create user profile
        const savedProfile = localStorage.getItem('ultra_srs_profile');
        
        if (savedProfile) {
            this.userProfile = JSON.parse(savedProfile);
        } else {
            this.userProfile = {
                id: this.generateUserId(),
                createdAt: Date.now(),
                studyPreferences: {
                    dailyGoal: 20,
                    sessionLength: 30, // minutes
                    preferredTime: 'morning',
                    difficultyPreference: 'adaptive'
                },
                cognitiveProfile: {
                    workingMemoryCapacity: 7, // Miller's number
                    processingSpeed: 1.0,
                    attentionSpan: 15, // minutes
                    learningStyle: 'visual-auditory'
                },
                performanceHistory: [],
                adaptiveParameters: {
                    personalEaseFactor: 2.5,
                    forgetfulnessIndex: 1.0,
                    consistencyBonus: 1.0
                }
            };
            
            this.saveUserProfile();
        }
    }

    async loadCards() {
        // Load cards from storage or create defaults
        const savedCards = localStorage.getItem('ultra_srs_cards');
        
        if (savedCards) {
            const cardsData = JSON.parse(savedCards);
            cardsData.forEach(cardData => {
                this.cards.set(cardData.id, this.createCardFromData(cardData));
            });
        } else {
            await this.createDefaultCards();
        }
        
        this.updateMetrics();
    }

    async createDefaultCards() {
        const defaultVerses = [
            {
                reference: 'Juan 3:16',
                text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
                category: 'salvacion',
                difficulty: 'medium',
                importance: 'high'
            },
            {
                reference: 'Filipenses 4:13',
                text: 'Todo lo puedo en Cristo que me fortalece.',
                category: 'fortaleza',
                difficulty: 'easy',
                importance: 'high'
            },
            {
                reference: 'Romanos 8:28',
                text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
                category: 'providencia',
                difficulty: 'medium',
                importance: 'high'
            },
            {
                reference: 'Jeremías 29:11',
                text: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
                category: 'esperanza',
                difficulty: 'medium',
                importance: 'high'
            },
            {
                reference: '1 Corintios 13:4-7',
                text: 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece; no hace nada indebido, no busca lo suyo, no se irrita, no guarda rencor; no se goza de la injusticia, mas se goza de la verdad. Todo lo sufre, todo lo cree, todo lo espera, todo lo soporta.',
                category: 'amor',
                difficulty: 'hard',
                importance: 'high'
            }
        ];

        for (const verse of defaultVerses) {
            const card = await this.createCard(verse);
            this.cards.set(card.id, card);
        }
        
        this.saveCards();
    }

    async createCard(verseData) {
        const cardId = this.generateCardId();
        const estimatedDifficulty = await this.difficultyEstimator.estimate(verseData.text);
        
        const card = {
            id: cardId,
            reference: verseData.reference,
            text: verseData.text,
            category: verseData.category,
            importance: verseData.importance || 'medium',
            
            // SRS parameters
            interval: 1,
            repetition: 0,
            easeFactor: this.config.easeFactor.initial,
            dueDate: Date.now(),
            lastReview: null,
            nextReview: Date.now(),
            
            // Advanced parameters
            difficulty: estimatedDifficulty,
            stabilityRating: 0.1, // Memory stability
            retrievabilityRating: 1.0, // Current retrievability
            lapseCount: 0,
            totalReviews: 0,
            totalStudyTime: 0,
            
            // Learning analytics
            reviewHistory: [],
            responseTimeHistory: [],
            difficultyHistory: [],
            
            // Neural predictions
            predictedRetention: 0.9,
            optimalInterval: 1,
            personalizedEaseFactor: this.config.easeFactor.initial,
            
            // Status
            cardType: 'new', // new, learning, review, relearning
            isLeech: false,
            isBuried: false,
            buriedUntil: null,
            
            // Metadata
            createdAt: Date.now(),
            lastModified: Date.now(),
            tags: this.extractTags(verseData.text),
            audioUrl: null,
            imageUrl: null,
            notes: ''
        };

        return card;
    }

    createCardFromData(data) {
        // Ensure all required properties exist
        return {
            ...data,
            reviewHistory: data.reviewHistory || [],
            responseTimeHistory: data.responseTimeHistory || [],
            difficultyHistory: data.difficultyHistory || [],
            tags: data.tags || [],
            predictedRetention: data.predictedRetention || 0.9,
            stabilityRating: data.stabilityRating || 0.1,
            retrievabilityRating: data.retrievabilityRating || 1.0
        };
    }

    extractTags(text) {
        // Extract meaningful tags from the text
        const biblicalTerms = [
            'dios', 'señor', 'jesus', 'cristo', 'espiritu', 'santo',
            'amor', 'fe', 'esperanza', 'gracia', 'misericordia',
            'salvacion', 'vida', 'eterna', 'reino', 'cielo'
        ];
        
        const words = text.toLowerCase().split(/\W+/);
        const tags = words.filter(word => 
            biblicalTerms.includes(word) && word.length > 2
        );
        
        return [...new Set(tags)];
    }

    // Core SRS algorithm
    async reviewCard(cardId, rating, responseTime = 0) {
        const card = this.cards.get(cardId);
        if (!card) {
            throw new Error(`Card not found: ${cardId}`);
        }

        const review = {
            timestamp: Date.now(),
            rating: rating,
            responseTime: responseTime,
            previousInterval: card.interval,
            previousEaseFactor: card.easeFactor,
            cardType: card.cardType
        };

        // Update card based on rating
        await this.updateCardParameters(card, rating, responseTime);
        
        // Record review
        card.reviewHistory.push(review);
        card.responseTimeHistory.push(responseTime);
        card.totalReviews++;
        card.totalStudyTime += responseTime;
        card.lastReview = Date.now();
        card.lastModified = Date.now();

        // Update analytics
        this.updateAnalytics(card, review);
        
        // Neural prediction update
        if (this.config.neuralPrediction) {
            await this.updateNeuralPredictions(card, review);
        }
        
        // Save changes
        this.saveCards();
        this.updateMetrics();
        
        return {
            nextInterval: card.interval,
            nextReview: card.nextReview,
            newEaseFactor: card.easeFactor,
            cardType: card.cardType,
            predictedRetention: card.predictedRetention
        };
    }

    async updateCardParameters(card, rating, responseTime) {
        const oldInterval = card.interval;
        const oldEaseFactor = card.easeFactor;
        
        // Update ease factor
        if (card.cardType === 'review' || card.cardType === 'relearning') {
            const easeChange = 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02);
            card.easeFactor = Math.max(
                this.config.easeFactor.minimum,
                Math.min(this.config.easeFactor.maximum, card.easeFactor + easeChange)
            );
        }

        // Update interval based on card type and rating
        switch (card.cardType) {
            case 'new':
                await this.updateNewCard(card, rating);
                break;
            case 'learning':
                await this.updateLearningCard(card, rating);
                break;
            case 'review':
                await this.updateReviewCard(card, rating);
                break;
            case 'relearning':
                await this.updateRelearningCard(card, rating);
                break;
        }

        // Apply neural optimization
        if (this.config.neuralPrediction && this.neuralPredictor) {
            const prediction = await this.neuralPredictor.predict({
                card: card,
                rating: rating,
                responseTime: responseTime,
                userProfile: this.userProfile
            });
            
            card.interval = Math.round(card.interval * prediction.intervalMultiplier);
            card.predictedRetention = prediction.retention;
        }

        // Update memory model
        await this.memoryModel.update(card, rating, responseTime);
        
        // Set next review date
        card.nextReview = Date.now() + (card.interval * 24 * 60 * 60 * 1000);
        
        // Handle leeches
        if (rating === 1) {
            card.lapseCount++;
            if (card.lapseCount >= this.config.leechThreshold) {
                card.isLeech = true;
                await this.handleLeech(card);
            }
        }
    }

    async updateNewCard(card, rating) {
        if (rating >= 3) {
            card.cardType = 'review';
            card.interval = this.config.graduationInterval;
            card.repetition = 1;
        } else {
            card.cardType = 'learning';
            card.interval = rating === 1 ? 1/1440 : 10/1440; // minutes to days
        }
    }

    async updateLearningCard(card, rating) {
        if (rating >= 3) {
            card.cardType = 'review';
            card.interval = this.config.graduationInterval;
            card.repetition = 1;
        } else {
            card.interval = rating === 1 ? 1/1440 : 10/1440; // stay in learning
        }
    }

    async updateReviewCard(card, rating) {
        if (rating === 1) {
            // Lapse - go to relearning
            card.cardType = 'relearning';
            card.interval = 1/1440; // 1 minute
            card.repetition = 0;
        } else {
            card.repetition++;
            
            if (rating === 2) {
                // Hard - reduce interval
                card.interval = Math.max(1, card.interval * this.config.hardInterval);
            } else if (rating === 4) {
                // Easy - increase interval more
                card.interval = card.interval * card.easeFactor * this.config.easyInterval;
            } else {
                // Good - normal interval
                card.interval = card.interval * card.easeFactor;
            }
        }
        
        // Apply bounds
        card.interval = Math.max(this.config.minimumInterval, 
                                Math.min(this.config.maximumInterval, card.interval));
    }

    async updateRelearningCard(card, rating) {
        if (rating >= 3) {
            card.cardType = 'review';
            card.interval = card.interval * this.config.lapseInterval;
        } else {
            card.interval = 1/1440; // stay in relearning
        }
    }

    async handleLeech(card) {
        // Advanced leech handling
        const leechStrategy = this.userProfile.studyPreferences.leechStrategy || 'bury';
        
        switch (leechStrategy) {
            case 'bury':
                card.isBuried = true;
                card.buriedUntil = Date.now() + (this.config.buriedDelay * 60 * 60 * 1000);
                break;
            case 'reduce_difficulty':
                card.text = await this.simplifyText(card.text);
                card.lapseCount = 0;
                card.isLeech = false;
                break;
            case 'audio_cue':
                card.audioUrl = await this.generateAudioCue(card.text);
                card.lapseCount = 0;
                card.isLeech = false;
                break;
            case 'mnemonic':
                card.notes = await this.generateMnemonic(card.text);
                card.lapseCount = 0;
                card.isLeech = false;
                break;
        }
    }

    // Scheduling and selection
    async getNextCard() {
        const availableCards = this.getAvailableCards();
        
        if (availableCards.length === 0) {
            return null;
        }
        
        // Advanced card selection algorithm
        const selectedCard = await this.selectOptimalCard(availableCards);
        this.currentCard = selectedCard;
        
        return selectedCard;
    }

    getAvailableCards() {
        const now = Date.now();
        const cards = Array.from(this.cards.values());
        
        return cards.filter(card => {
            // Skip buried cards
            if (card.isBuried && card.buriedUntil > now) {
                return false;
            }
            
            // Skip if not due
            if (card.nextReview > now) {
                return false;
            }
            
            return true;
        });
    }

    async selectOptimalCard(availableCards) {
        // Prioritize by urgency, difficulty, and user preferences
        const scoredCards = await Promise.all(
            availableCards.map(async (card) => {
                const score = await this.calculateCardScore(card);
                return { card, score };
            })
        );
        
        // Sort by score (higher is better)
        scoredCards.sort((a, b) => b.score - a.score);
        
        // Add some randomness to avoid predictability
        const topCards = scoredCards.slice(0, Math.min(5, scoredCards.length));
        const randomIndex = Math.floor(Math.random() * topCards.length);
        
        return topCards[randomIndex].card;
    }

    async calculateCardScore(card) {
        const now = Date.now();
        const overdue = Math.max(0, now - card.nextReview) / (24 * 60 * 60 * 1000); // days
        
        let score = 0;
        
        // Urgency factor (more urgent = higher score)
        score += overdue * 10;
        
        // Difficulty factor (balanced based on user preference)
        const userDifficultyPref = this.userProfile.studyPreferences.difficultyPreference;
        if (userDifficultyPref === 'easy' && card.difficulty < 0.5) {
            score += 5;
        } else if (userDifficultyPref === 'hard' && card.difficulty > 0.7) {
            score += 5;
        } else if (userDifficultyPref === 'adaptive') {
            // Adaptive scoring based on recent performance
            const recentPerformance = this.getRecentPerformance();
            if (recentPerformance > 0.8 && card.difficulty > 0.6) {
                score += 3; // Challenge user if doing well
            } else if (recentPerformance < 0.6 && card.difficulty < 0.5) {
                score += 3; // Give easier cards if struggling
            }
        }
        
        // Importance factor
        const importanceMultiplier = {
            'low': 0.5,
            'medium': 1.0,
            'high': 1.5
        };
        score *= importanceMultiplier[card.importance] || 1.0;
        
        // Memory strength factor (weaker memories get priority)
        score += (1 - card.stabilityRating) * 5;
        
        // Variety factor (avoid same category repeatedly)
        if (this.recentCategories.includes(card.category)) {
            score *= 0.8;
        }
        
        return score;
    }

    // Analytics and optimization
    updateAnalytics(card, review) {
        // Update user patterns
        this.updateUserPatterns(review);
        
        // Update forgetting curve
        this.updateForgettingCurve(card, review);
        
        // Update category performance
        this.updateCategoryPerformance(card, review);
        
        // Update difficulty progression
        this.analytics.difficultyProgression.push({
            timestamp: review.timestamp,
            cardId: card.id,
            difficulty: card.difficulty,
            rating: review.rating,
            responseTime: review.responseTime
        });
        
        // Limit history size
        if (this.analytics.difficultyProgression.length > 1000) {
            this.analytics.difficultyProgression = this.analytics.difficultyProgression.slice(-1000);
        }
    }

    updateUserPatterns(review) {
        const hour = new Date(review.timestamp).getHours();
        
        // Track best study time
        if (!this.analytics.userPatterns.studyTimePerformance) {
            this.analytics.userPatterns.studyTimePerformance = new Array(24).fill(0).map(() => ({ total: 0, correct: 0 }));
        }
        
        this.analytics.userPatterns.studyTimePerformance[hour].total++;
        if (review.rating >= 3) {
            this.analytics.userPatterns.studyTimePerformance[hour].correct++;
        }
        
        // Find best study time
        const bestHour = this.analytics.userPatterns.studyTimePerformance
            .map((perf, hour) => ({
                hour,
                accuracy: perf.total > 0 ? perf.correct / perf.total : 0,
                sessions: perf.total
            }))
            .filter(p => p.sessions > 5) // Need minimum sessions
            .sort((a, b) => b.accuracy - a.accuracy)[0];
            
        if (bestHour) {
            this.analytics.userPatterns.bestStudyTime = bestHour.hour;
        }
    }

    updateForgettingCurve(card, review) {
        const key = `${card.cardType}-${Math.round(card.difficulty * 10)}`;
        
        if (!this.analytics.forgettingCurve.has(key)) {
            this.analytics.forgettingCurve.set(key, []);
        }
        
        const curve = this.analytics.forgettingCurve.get(key);
        curve.push({
            interval: review.previousInterval,
            rating: review.rating,
            responseTime: review.responseTime,
            timestamp: review.timestamp
        });
        
        // Limit size
        if (curve.length > 100) {
            curve.splice(0, curve.length - 100);
        }
    }

    updateCategoryPerformance(card, review) {
        if (!this.analytics.categoryPerformance) {
            this.analytics.categoryPerformance = new Map();
        }
        
        if (!this.analytics.categoryPerformance.has(card.category)) {
            this.analytics.categoryPerformance.set(card.category, {
                total: 0,
                correct: 0,
                averageTime: 0,
                difficulty: 0
            });
        }
        
        const perf = this.analytics.categoryPerformance.get(card.category);
        perf.total++;
        if (review.rating >= 3) {
            perf.correct++;
        }
        perf.averageTime = (perf.averageTime + review.responseTime) / 2;
        perf.difficulty = (perf.difficulty + card.difficulty) / 2;
        
        // Update user profile
        const accuracy = perf.correct / perf.total;
        if (accuracy > 0.8) {
            if (!this.analytics.userPatterns.strongCategories.includes(card.category)) {
                this.analytics.userPatterns.strongCategories.push(card.category);
            }
        } else if (accuracy < 0.6) {
            if (!this.analytics.userPatterns.weakCategories.includes(card.category)) {
                this.analytics.userPatterns.weakCategories.push(card.category);
            }
        }
    }

    // Background optimization
    startBackgroundOptimization() {
        // Optimize intervals every hour
        setInterval(() => {
            this.optimizeIntervals();
        }, 60 * 60 * 1000);
        
        // Update user profile every 30 minutes
        setInterval(() => {
            this.updateUserProfile();
        }, 30 * 60 * 1000);
        
        // Clean up old data daily
        setInterval(() => {
            this.cleanupOldData();
        }, 24 * 60 * 60 * 1000);
    }

    async optimizeIntervals() {
        // Use forgetting curve data to optimize intervals
        for (const [key, curve] of this.analytics.forgettingCurve) {
            if (curve.length < 10) continue;
            
            const optimalInterval = this.calculateOptimalInterval(curve);
            this.analytics.optimalIntervals.set(key, optimalInterval);
        }
    }

    calculateOptimalInterval(curve) {
        // Find interval that maximizes retention while minimizing study time
        const intervalGroups = new Map();
        
        curve.forEach(point => {
            const interval = Math.round(point.interval);
            if (!intervalGroups.has(interval)) {
                intervalGroups.set(interval, { total: 0, correct: 0 });
            }
            
            const group = intervalGroups.get(interval);
            group.total++;
            if (point.rating >= 3) {
                group.correct++;
            }
        });
        
        let bestInterval = 1;
        let bestScore = 0;
        
        for (const [interval, stats] of intervalGroups) {
            if (stats.total < 3) continue; // Need minimum data
            
            const retention = stats.correct / stats.total;
            const efficiency = retention / Math.log(interval + 1); // Efficiency score
            
            if (efficiency > bestScore && retention > 0.75) {
                bestScore = efficiency;
                bestInterval = interval;
            }
        }
        
        return bestInterval;
    }

    updateUserProfile() {
        // Update cognitive profile based on performance
        const recentPerformance = this.getRecentPerformance(100);
        const averageResponseTime = this.getAverageResponseTime(100);
        
        // Update processing speed
        if (averageResponseTime < 5000) {
            this.userProfile.cognitiveProfile.processingSpeed = Math.min(2.0, 
                this.userProfile.cognitiveProfile.processingSpeed + 0.1);
        } else if (averageResponseTime > 15000) {
            this.userProfile.cognitiveProfile.processingSpeed = Math.max(0.5,
                this.userProfile.cognitiveProfile.processingSpeed - 0.1);
        }
        
        // Update forgetfulness index
        if (recentPerformance < 0.6) {
            this.userProfile.adaptiveParameters.forgetfulnessIndex = Math.min(2.0,
                this.userProfile.adaptiveParameters.forgetfulnessIndex + 0.1);
        } else if (recentPerformance > 0.8) {
            this.userProfile.adaptiveParameters.forgetfulnessIndex = Math.max(0.5,
                this.userProfile.adaptiveParameters.forgetfulnessIndex - 0.05);
        }
        
        this.saveUserProfile();
    }

    // Utility methods
    getRecentPerformance(count = 50) {
        const recentReviews = [];
        
        for (const card of this.cards.values()) {
            recentReviews.push(...card.reviewHistory.slice(-count));
        }
        
        recentReviews.sort((a, b) => b.timestamp - a.timestamp);
        const recent = recentReviews.slice(0, count);
        
        if (recent.length === 0) return 0.8; // Default
        
        const correct = recent.filter(r => r.rating >= 3).length;
        return correct / recent.length;
    }

    getAverageResponseTime(count = 50) {
        const recentTimes = [];
        
        for (const card of this.cards.values()) {
            recentTimes.push(...card.responseTimeHistory.slice(-count));
        }
        
        recentTimes.sort((a, b) => b - a);
        const recent = recentTimes.slice(0, count);
        
        if (recent.length === 0) return 10000; // Default 10 seconds
        
        return recent.reduce((sum, time) => sum + time, 0) / recent.length;
    }

    updateMetrics() {
        const cards = Array.from(this.cards.values());
        
        this.metrics.totalCards = cards.length;
        this.metrics.activeCards = cards.filter(c => !c.isBuried).length;
        this.metrics.matureCards = cards.filter(c => c.interval >= 21).length;
        this.metrics.leechCards = cards.filter(c => c.isLeech).length;
        
        const totalReviews = cards.reduce((sum, c) => sum + c.totalReviews, 0);
        const correctReviews = cards.reduce((sum, c) => 
            sum + c.reviewHistory.filter(r => r.rating >= 3).length, 0);
        
        this.metrics.retentionRate = totalReviews > 0 ? correctReviews / totalReviews : 0;
        
        const totalStudyTime = cards.reduce((sum, c) => sum + c.totalStudyTime, 0);
        this.metrics.totalStudyTime = totalStudyTime;
        this.metrics.averageRecallTime = totalReviews > 0 ? totalStudyTime / totalReviews : 0;
        
        const easeFactors = cards.map(c => c.easeFactor);
        this.metrics.averageEaseFactor = easeFactors.length > 0 ? 
            easeFactors.reduce((sum, ef) => sum + ef, 0) / easeFactors.length : 2.5;
    }

    // Data persistence
    saveCards() {
        const cardsData = Array.from(this.cards.values());
        localStorage.setItem('ultra_srs_cards', JSON.stringify(cardsData));
    }

    saveUserProfile() {
        localStorage.setItem('ultra_srs_profile', JSON.stringify(this.userProfile));
    }

    // Public API
    async addCard(verseData) {
        const card = await this.createCard(verseData);
        this.cards.set(card.id, card);
        this.saveCards();
        this.updateMetrics();
        return card;
    }

    async removeCard(cardId) {
        if (this.cards.delete(cardId)) {
            this.saveCards();
            this.updateMetrics();
            return true;
        }
        return false;
    }

    async getStudySession(maxCards = null) {
        const sessionSize = maxCards || this.userProfile.studyPreferences.dailyGoal;
        const session = [];
        
        for (let i = 0; i < sessionSize; i++) {
            const card = await this.getNextCard();
            if (!card) break;
            session.push(card);
        }
        
        return session;
    }

    getAnalytics() {
        return {
            metrics: this.metrics,
            analytics: {
                ...this.analytics,
                forgettingCurve: Object.fromEntries(this.analytics.forgettingCurve),
                categoryPerformance: Object.fromEntries(this.analytics.categoryPerformance || new Map()),
                optimalIntervals: Object.fromEntries(this.analytics.optimalIntervals)
            },
            userProfile: this.userProfile
        };
    }

    // Helper methods
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateCardId() {
        return 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    cleanupOldData() {
        const cutoffDate = Date.now() - (90 * 24 * 60 * 60 * 1000); // 90 days
        
        // Clean up old analytics data
        this.analytics.difficultyProgression = this.analytics.difficultyProgression
            .filter(item => item.timestamp > cutoffDate);
        
        // Clean up old review history in cards
        for (const card of this.cards.values()) {
            card.reviewHistory = card.reviewHistory.filter(r => r.timestamp > cutoffDate);
            card.responseTimeHistory = card.responseTimeHistory.slice(-100); // Keep last 100
        }
        
        this.saveCards();
    }
}

// Neural components for SRS optimization
class NeuralIntervalPredictor {
    constructor() {
        this.model = null;
        this.isReady = false;
    }

    async init() {
        // Initialize neural network for interval prediction
        // In production, this would load a trained TensorFlow.js model
        this.model = {
            predict: async (features) => {
                // Simulate neural prediction
                const baseMultiplier = 1.0;
                const difficultyFactor = 1 - features.card.difficulty * 0.3;
                const performanceFactor = features.userProfile.adaptiveParameters.forgetfulnessIndex;
                const timeFactor = Math.min(2.0, features.responseTime / 10000);
                
                const multiplier = baseMultiplier * difficultyFactor * performanceFactor / timeFactor;
                
                return {
                    intervalMultiplier: Math.max(0.5, Math.min(3.0, multiplier)),
                    retention: 0.85 + Math.random() * 0.1,
                    confidence: 0.9
                };
            }
        };
        
        this.isReady = true;
    }

    async predict(input) {
        if (!this.isReady) {
            throw new Error('Neural predictor not initialized');
        }
        
        return this.model.predict(input);
    }
}

class DifficultyEstimator {
    constructor() {
        this.model = null;
        this.isReady = false;
    }

    async init() {
        // Initialize difficulty estimation model
        this.model = {
            estimate: (text) => {
                // Estimate difficulty based on text features
                const words = text.split(/\s+/);
                const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
                const uniqueWords = new Set(words.map(w => w.toLowerCase()));
                const lexicalDiversity = uniqueWords.size / words.length;
                
                // Simple heuristic (in production, use trained model)
                let difficulty = 0.5;
                
                if (words.length > 30) difficulty += 0.2;
                if (avgWordLength > 6) difficulty += 0.1;
                if (lexicalDiversity > 0.8) difficulty += 0.1;
                if (text.includes(',') || text.includes(';')) difficulty += 0.1;
                
                return Math.max(0.1, Math.min(0.9, difficulty));
            }
        };
        
        this.isReady = true;
    }

    async estimate(text) {
        if (!this.isReady) {
            throw new Error('Difficulty estimator not initialized');
        }
        
        return this.model.estimate(text);
    }
}

class MemoryModel {
    constructor() {
        this.memoryStrengths = new Map();
        this.isReady = false;
    }

    async init() {
        this.isReady = true;
    }

    async update(card, rating, responseTime) {
        if (!this.isReady) return;
        
        const currentStrength = this.memoryStrengths.get(card.id) || 0.5;
        
        // Update memory strength based on review outcome
        let newStrength = currentStrength;
        
        if (rating >= 3) {
            // Successful recall strengthens memory
            newStrength = Math.min(1.0, currentStrength + 0.1 * (1 - currentStrength));
        } else {
            // Failed recall weakens memory
            newStrength = Math.max(0.1, currentStrength * 0.8);
        }
        
        // Response time factor
        const timeBonus = Math.max(0, Math.min(0.1, (10000 - responseTime) / 100000));
        newStrength += timeBonus;
        
        this.memoryStrengths.set(card.id, Math.max(0.1, Math.min(1.0, newStrength)));
        
        // Update card stability rating
        card.stabilityRating = newStrength;
    }

    getMemoryStrength(cardId) {
        return this.memoryStrengths.get(cardId) || 0.5;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraSRSEngine;
} else {
    window.UltraSRSEngine = UltraSRSEngine;
}