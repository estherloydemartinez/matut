/**
 * BibliaApp Pro - UI Manager (Discord-style Interface)
 * Handles all interface interactions with zero UI code waste
 * Focuses on functionality, quality, and clean code
 * Version: 2.0.0
 */

class UIManager {
    constructor(app) {
        this.app = app;
        this.initialized = false;
        this.currentSection = 'inicio';
        this.currentSubsection = null;
        this.animations = new Map();
        this.modals = new Map();
        this.dragDropSystem = null;
        this.filterSystem = null;
        
        // Performance optimization
        this.throttledResize = this.throttle(this.handleResize.bind(this), 150);
        this.throttledScroll = this.throttle(this.handleScroll.bind(this), 16);
        
        this.initialize();
    }

    /**
     * Initialize the UI Manager
     */
    async initialize() {
        try {
            this.log('Initializing UI Manager...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize core UI systems
            this.initializeNavigation();
            this.initializeTabSystem();
            this.initializeDragDropSystem();
            this.initializeFilterSystem();
            this.initializeModals();
            this.initializeEventListeners();
            this.initializeResponsiveHandling();
            
            // Set initial state
            this.updateBreadcrumbs(['Inicio']);
            this.showSection('inicio');
            
            this.initialized = true;
            this.app.emit('ui:initialized');
            
            this.log('UI Manager initialized successfully');
            
        } catch (error) {
            this.error('Error initializing UI Manager:', error);
            throw error;
        }
    }

    /**
     * Navigation System (Discord-style sidebar)
     */
    initializeNavigation() {
        const navButtons = document.querySelectorAll('.nav-button');
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = button.id.replace('nav-', '');
                this.navigateToSection(section);
            });
        });
        
        // Social buttons in header
        const socialButtons = document.querySelectorAll('[id*="social-"]');
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSocialSection(button.id);
            });
        });
        
        this.log('Navigation system initialized');
    }

    /**
     * Navigate to a section with smooth animations
     */
    navigateToSection(section) {
        if (section === this.currentSection) return;
        
        // Update nav buttons
        this.updateNavButtons(section);
        
        // Hide current content with animation
        const currentContent = document.getElementById(`content-${this.currentSection}`);
        if (currentContent) {
            this.animateOut(currentContent).then(() => {
                this.showSection(section);
            });
        } else {
            this.showSection(section);
        }
        
        // Update breadcrumbs
        const sectionNames = {
            'inicio': 'Inicio',
            'teoria': 'Teoría',
            'practica': 'Práctica',
            'social': 'Social',
            'settings': 'Ajustes'
        };
        
        this.updateBreadcrumbs([sectionNames[section]]);
        
        // Update social buttons visibility
        this.updateSocialButtons(section);
        
        // Update app state
        this.currentSection = section;
        this.app.setState('currentSection', section);
        
        // Add XP for navigation
        if (section !== 'inicio') {
            this.app.addXP('tool_usage', { type: 'navigation', section });
        }
        
        this.log(`Navigated to section: ${section}`);
    }

    /**
     * Show section content
     */
    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Show target section
        const targetContent = document.getElementById(`content-${section}`);
        if (targetContent) {
            targetContent.classList.remove('hidden');
            this.animateIn(targetContent);
            
            // Section-specific initialization
            this.initializeSectionFeatures(section);
        }
    }

    /**
     * Update navigation button states
     */
    updateNavButtons(activeSection) {
        document.querySelectorAll('.nav-button').forEach(button => {
            button.classList.remove('active');
        });
        
        const activeButton = document.getElementById(`nav-${activeSection}`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    /**
     * Update social buttons visibility
     */
    updateSocialButtons(section) {
        const socialButtons = {
            'social-general-btn': section !== 'social',
            'social-teoria-btn': section === 'teoria',
            'social-practica-btn': section === 'practica'
        };
        
        Object.entries(socialButtons).forEach(([id, show]) => {
            const button = document.getElementById(id);
            if (button) {
                button.classList.toggle('hidden', !show);
            }
        });
    }

    /**
     * Tab System for subsections
     */
    initializeTabSystem() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const target = button.getAttribute('data-target');
                this.switchTab(button, target);
            });
        });
        
        this.log('Tab system initialized');
    }

    /**
     * Switch between tabs in subsections
     */
    switchTab(buttonElement, targetId) {
        const container = buttonElement.closest('[id*="subcontent-container"]') || 
                         buttonElement.closest('.tab-nav-container').parentElement;
        
        // Update tab buttons
        container.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        buttonElement.classList.add('active');
        
        // Switch content
        container.querySelectorAll('.subcontent').forEach(content => {
            content.classList.add('hidden');
        });
        
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.remove('hidden');
            this.animateIn(targetContent);
            
            // Update breadcrumbs for subsection
            this.updateSubsectionBreadcrumbs(targetId);
            
            // Initialize subsection features
            this.initializeSubsectionFeatures(targetId);
        }
        
        this.currentSubsection = targetId;
        this.app.setState('currentSubsection', targetId);
    }

    /**
     * Drag and Drop System (Sistema Agua)
     */
    initializeDragDropSystem() {
        this.dragDropSystem = {
            draggedElement: null,
            sourceContainer: null,
            
            initialize: () => {
                const elementos = document.querySelectorAll('.agua-elemento');
                const columnas = document.querySelectorAll('.agua-columna');
                
                // Make elements draggable
                elementos.forEach(elemento => {
                    elemento.draggable = true;
                    
                    elemento.addEventListener('dragstart', (e) => {
                        this.dragDropSystem.draggedElement = elemento;
                        this.dragDropSystem.sourceContainer = elemento.closest('.agua-elementos-container');
                        elemento.classList.add('dragging');
                        
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/html', elemento.outerHTML);
                    });
                    
                    elemento.addEventListener('dragend', () => {
                        elemento.classList.remove('dragging');
                        this.dragDropSystem.draggedElement = null;
                        this.dragDropSystem.sourceContainer = null;
                    });
                });
                
                // Setup drop zones
                columnas.forEach(columna => {
                    columna.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        columna.classList.add('drag-over');
                    });
                    
                    columna.addEventListener('dragleave', () => {
                        columna.classList.remove('drag-over');
                    });
                    
                    columna.addEventListener('drop', (e) => {
                        e.preventDefault();
                        columna.classList.remove('drag-over');
                        
                        const container = columna.querySelector('.agua-elementos-container');
                        const draggedElement = this.dragDropSystem.draggedElement;
                        
                        if (draggedElement && container !== this.dragDropSystem.sourceContainer) {
                            // Move element
                            container.appendChild(draggedElement);
                            
                            // Update tool count
                            this.updateToolCount();
                            
                            // Add XP for organizing
                            this.app.addXP('tool_usage', { 
                                type: 'organize_tools',
                                tool: draggedElement.getAttribute('data-tool')
                            });
                            
                            // Visual feedback
                            this.showToast('Herramienta reorganizada', 'success');
                        }
                    });
                });
            },
            
            updateToolCount: () => {
                const total = document.querySelectorAll('.agua-elemento').length;
                const countElement = document.getElementById('tools-count');
                if (countElement) {
                    countElement.textContent = `${total} herramientas`;
                }
            }
        };
        
        this.log('Drag and drop system initialized');
    }

    /**
     * Advanced Filter System (Filtros Analíticos)
     */
    initializeFilterSystem() {
        this.filterSystem = {
            activeFilters: new Set(),
            
            initialize: () => {
                const filterHeaders = document.querySelectorAll('.filtro-header');
                const herramientaItems = document.querySelectorAll('.herramienta-item');
                
                // Accordion functionality
                filterHeaders.forEach(header => {
                    header.addEventListener('click', () => {
                        this.filterSystem.toggleAccordion(header);
                    });
                });
                
                // Tool selection
                herramientaItems.forEach(item => {
                    item.addEventListener('click', () => {
                        this.filterSystem.selectTool(item);
                    });
                });
            },
            
            toggleAccordion: (header) => {
                const content = header.nextElementSibling;
                const isExpanded = header.classList.contains('expanded');
                
                // Close all other accordions
                document.querySelectorAll('.filtro-header.expanded').forEach(h => {
                    if (h !== header) {
                        h.classList.remove('expanded');
                        h.nextElementSibling.classList.remove('expanded');
                    }
                });
                
                // Toggle current accordion
                header.classList.toggle('expanded');
                content.classList.toggle('expanded');
                
                // Smooth animation
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0px';
                }
            },
            
            selectTool: (item) => {
                const toolName = item.querySelector('h4').textContent;
                const toolDescription = item.querySelector('p').textContent;
                
                // Update detail view
                const detailView = document.getElementById('filter-detail-view');
                if (detailView) {
                    detailView.innerHTML = `
                        <h3 class="font-semibold mb-3">${toolName}</h3>
                        <p class="text-sm text-discord-secondary mb-4">${toolDescription}</p>
                        <div class="space-y-3">
                            <button class="w-full discord-button-primary py-2 rounded-lg">
                                Activar herramienta
                            </button>
                            <button class="w-full discord-button-secondary py-2 rounded-lg">
                                Ver detalles
                            </button>
                        </div>
                    `;
                    
                    // Add activate functionality
                    const activateBtn = detailView.querySelector('.discord-button-primary');
                    if (activateBtn) {
                        activateBtn.addEventListener('click', () => {
                            this.activateAnalyticalTool(toolName);
                        });
                    }
                }
                
                // Visual feedback
                document.querySelectorAll('.herramienta-item').forEach(i => {
                    i.classList.remove('herramienta-activa');
                });
                item.classList.add('herramienta-activa');
            }
        };
        
        this.log('Filter system initialized');
    }

    /**
     * Modal System
     */
    initializeModals() {
        // Check-in modal
        const checkinModal = document.getElementById('checkin-modal');
        const showCheckinBtn = document.getElementById('show-checkin-modal');
        const closeCheckinBtn = document.getElementById('close-checkin-modal');
        const saveCheckinBtn = document.getElementById('save-checkin');
        const cancelCheckinBtn = document.getElementById('cancel-checkin');
        
        if (showCheckinBtn) {
            showCheckinBtn.addEventListener('click', () => {
                this.showModal('checkin-modal');
            });
        }
        
        if (closeCheckinBtn) {
            closeCheckinBtn.addEventListener('click', () => {
                this.hideModal('checkin-modal');
            });
        }
        
        if (saveCheckinBtn) {
            saveCheckinBtn.addEventListener('click', () => {
                this.saveCheckIn();
            });
        }
        
        if (cancelCheckinBtn) {
            cancelCheckinBtn.addEventListener('click', () => {
                this.hideModal('checkin-modal');
            });
        }
        
        // Close modal on backdrop click
        if (checkinModal) {
            checkinModal.addEventListener('click', (e) => {
                if (e.target === checkinModal) {
                    this.hideModal('checkin-modal');
                }
            });
        }
        
        this.log('Modal system initialized');
    }

    /**
     * Event Listeners Setup
     */
    initializeEventListeners() {
        // Window resize
        window.addEventListener('resize', this.throttledResize);
        
        // Window scroll
        window.addEventListener('scroll', this.throttledScroll, { passive: true });
        
        // Quick action buttons
        const quickReading = document.getElementById('quick-reading');
        const quickPrayer = document.getElementById('quick-prayer');
        
        if (quickReading) {
            quickReading.addEventListener('click', () => {
                this.navigateToSection('teoria');
                setTimeout(() => {
                    this.switchTab(
                        document.querySelector('[data-target="subcontent-lectura"]'),
                        'subcontent-lectura'
                    );
                }, 300);
            });
        }
        
        if (quickPrayer) {
            quickPrayer.addEventListener('click', () => {
                this.navigateToSection('practica');
                this.startPrayerSession();
            });
        }
        
        // App events
        this.app.on('core:initialized', () => {
            this.updateUIFromAppState();
        });
        
        this.app.on('progress:levelUp', (e) => {
            this.showLevelUpNotification(e.detail);
        });
        
        this.app.on('progress:xpGained', (e) => {
            this.showXPGainedNotification(e.detail);
        });
        
        this.log('Event listeners initialized');
    }

    /**
     * Responsive Handling
     */
    initializeResponsiveHandling() {
        this.mediaQueries = {
            mobile: window.matchMedia('(max-width: 640px)'),
            tablet: window.matchMedia('(max-width: 1024px)'),
            desktop: window.matchMedia('(min-width: 1025px)')
        };
        
        // Handle media query changes
        Object.values(this.mediaQueries).forEach(mq => {
            mq.addListener(() => {
                this.handleResponsiveChange();
            });
        });
        
        this.handleResponsiveChange();
        this.log('Responsive handling initialized');
    }

    /**
     * Section-specific feature initialization
     */
    initializeSectionFeatures(section) {
        switch (section) {
            case 'teoria':
                this.dragDropSystem.initialize();
                this.filterSystem.initialize();
                break;
            case 'practica':
                this.initializePracticeFeatures();
                break;
            case 'social':
                this.initializeSocialFeatures();
                break;
            case 'inicio':
                this.updateDashboard();
                break;
        }
    }

    /**
     * Subsection-specific feature initialization
     */
    initializeSubsectionFeatures(subsectionId) {
        switch (subsectionId) {
            case 'subcontent-agua':
                this.dragDropSystem.initialize();
                this.dragDropSystem.updateToolCount();
                break;
            case 'subcontent-filtros':
                this.filterSystem.initialize();
                break;
            case 'subcontent-memorizacion':
                this.initializeMemorizationFeatures();
                break;
        }
    }

    /**
     * Practice section features
     */
    initializePracticeFeatures() {
        // Prayer type buttons
        const prayerButtons = document.querySelectorAll('[data-prayer-type]');
        prayerButtons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.getAttribute('data-prayer-type');
                this.startPrayerSession(type);
            });
        });
    }

    /**
     * Social section features
     */
    initializeSocialFeatures() {
        // Group interaction buttons
        const groupButtons = document.querySelectorAll('[data-group-action]');
        groupButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-group-action');
                this.handleGroupAction(action);
            });
        });
    }

    /**
     * Memorization features
     */
    initializeMemorizationFeatures() {
        const verifyBtn = document.querySelector('#subcontent-memorizacion .discord-button-primary');
        const hintBtn = document.querySelector('#subcontent-memorizacion .discord-button-secondary:nth-child(2)');
        const nextBtn = document.querySelector('#subcontent-memorizacion .discord-button-secondary:nth-child(3)');
        
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                this.verifyMemorization();
            });
        }
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                this.showMemorizationHint();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextMemorizationVerse();
            });
        }
    }

    /**
     * Animation System
     */
    animateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        return new Promise(resolve => {
            setTimeout(resolve, 300);
        });
    }

    animateOut(element) {
        element.style.transition = 'opacity 0.2s ease-in, transform 0.2s ease-in';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.classList.add('hidden');
                resolve();
            }, 200);
        });
    }

    /**
     * Breadcrumb Management
     */
    updateBreadcrumbs(path) {
        const breadcrumbPath = document.getElementById('breadcrumb-path');
        if (!breadcrumbPath) return;
        
        const breadcrumbHTML = path.map((item, index) => {
            if (index === path.length - 1) {
                return `<span class="breadcrumb-current">${item}</span>`;
            } else {
                return `<span class="breadcrumb-link" data-path="${index}">${item}</span>`;
            }
        }).join('');
        
        breadcrumbPath.innerHTML = breadcrumbHTML;
        
        // Add click handlers for navigation
        breadcrumbPath.querySelectorAll('.breadcrumb-link').forEach(link => {
            link.addEventListener('click', () => {
                const pathIndex = parseInt(link.getAttribute('data-path'));
                this.navigateToBreadcrumb(pathIndex);
            });
        });
    }

    updateSubsectionBreadcrumbs(subsectionId) {
        const subsectionNames = {
            'subcontent-lectura': 'Lectura',
            'subcontent-memorizacion': 'Memorización',
            'subcontent-agua': 'Sistema Agua',
            'subcontent-filtros': 'Filtros Analíticos'
        };
        
        const sectionName = this.getSectionDisplayName(this.currentSection);
        const subsectionName = subsectionNames[subsectionId];
        
        if (subsectionName) {
            this.updateBreadcrumbs([sectionName, subsectionName]);
        }
    }

    /**
     * Modal Management
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            this.animateIn(modal);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            this.animateOut(modal).then(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }
    }

    /**
     * Check-in System
     */
    saveCheckIn() {
        const checkboxes = document.querySelectorAll('#checkin-modal input[type="checkbox"]');
        const completedTasks = [];
        
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const label = checkbox.parentElement.textContent.trim();
                completedTasks.push(label);
            }
        });
        
        if (completedTasks.length > 0) {
            // Save to app state
            this.app.saveToStorage('daily_checkin', {
                date: new Date().toISOString().split('T')[0],
                tasks: completedTasks,
                timestamp: Date.now()
            });
            
            // Add XP for each completed task
            completedTasks.forEach(task => {
                this.app.addXP('daily_reading', { task });
            });
            
            // Update UI
            this.updateDailyProgress(completedTasks.length, 5);
            this.showToast(`¡${completedTasks.length} actividades completadas!`, 'success');
            
            this.hideModal('checkin-modal');
        } else {
            this.showToast('Selecciona al menos una actividad', 'warning');
        }
    }

    /**
     * Prayer Session Management
     */
    startPrayerSession(type = 'adoracion') {
        this.showToast('Iniciando sesión de oración...', 'info');
        
        // Start prayer session in app core
        const session = this.app.prayerSystem.startSession(type);
        
        // Navigate to practice section if not already there
        if (this.currentSection !== 'practica') {
            this.navigateToSection('practica');
        }
        
        // Show prayer interface (placeholder)
        this.showToast(`Sesión de ${type} iniciada`, 'success');
    }

    /**
     * Tool Management
     */
    activateAnalyticalTool(toolName) {
        try {
            // Find tool by name
            let toolId = null;
            for (let [id, tool] of this.app.studyTools) {
                if (tool.name === toolName) {
                    toolId = id;
                    break;
                }
            }
            
            if (toolId) {
                this.app.activateTool(toolId);
                this.showToast(`${toolName} activada`, 'success');
                
                // Update UI to show active state
                this.updateActiveToolsDisplay();
            } else {
                this.showToast('Herramienta no encontrada', 'error');
            }
        } catch (error) {
            this.error('Error activating tool:', error);
            this.showToast('Error activando herramienta', 'error');
        }
    }

    /**
     * UI State Updates
     */
    updateUIFromAppState() {
        // Update level display
        const levelElement = document.getElementById('user-level');
        if (levelElement) {
            levelElement.textContent = `Nivel ${this.app.getState('userLevel')}`;
        }
        
        // Update daily progress
        const progress = this.app.getProgress('dailyProgress') || { completed: 3, total: 5 };
        this.updateDailyProgress(progress.completed, progress.total);
        
        // Update streak
        const streakElement = document.getElementById('streak-count');
        if (streakElement) {
            streakElement.textContent = this.app.getProgress('streak') || '12';
        }
    }

    updateDailyProgress(completed, total) {
        const progressElement = document.getElementById('daily-progress');
        const progressBar = document.querySelector('.bg-gradient-to-r');
        
        if (progressElement) {
            progressElement.textContent = `${completed}/${total} completadas`;
        }
        
        if (progressBar) {
            const percentage = (completed / total) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    updateActiveToolsDisplay() {
        const activeTools = this.app.getState('activeTools') || [];
        const container = document.querySelector('.discord-card h3:contains("Herramientas Activas")');
        
        if (container) {
            const content = container.closest('.discord-card').querySelector('.space-y-2');
            if (content) {
                content.innerHTML = activeTools.map(toolId => {
                    const tool = this.app.studyTools.get(toolId);
                    return `
                        <div class="flex justify-between items-center">
                            <span>${tool?.name || toolId}</span>
                            <span class="text-discord-accent">●</span>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    /**
     * Notification System
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-discord-accent',
            error: 'bg-red-600',
            warning: 'bg-yellow-600',
            info: 'bg-discord-primary'
        };
        
        toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(full)';
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    showLevelUpNotification(data) {
        this.showToast(`🎉 ¡Subiste al nivel ${data.newLevel}!`, 'success');
    }

    showXPGainedNotification(data) {
        if (data.xp >= 10) { // Only show for significant XP gains
            this.showToast(`+${data.xp} XP`, 'success');
        }
    }

    /**
     * Responsive Handling
     */
    handleResponsiveChange() {
        if (this.mediaQueries.mobile.matches) {
            this.optimizeForMobile();
        } else if (this.mediaQueries.tablet.matches) {
            this.optimizeForTablet();
        } else {
            this.optimizeForDesktop();
        }
    }

    optimizeForMobile() {
        // Mobile-specific optimizations
        document.body.classList.add('mobile-layout');
        document.body.classList.remove('tablet-layout', 'desktop-layout');
    }

    optimizeForTablet() {
        // Tablet-specific optimizations
        document.body.classList.add('tablet-layout');
        document.body.classList.remove('mobile-layout', 'desktop-layout');
    }

    optimizeForDesktop() {
        // Desktop-specific optimizations
        document.body.classList.add('desktop-layout');
        document.body.classList.remove('mobile-layout', 'tablet-layout');
    }

    handleResize() {
        this.handleResponsiveChange();
    }

    handleScroll() {
        // Optimize scroll performance - placeholder for scroll-based features
    }

    /**
     * Memorization System UI
     */
    verifyMemorization() {
        this.showToast('Verificando memorización...', 'info');
        // Placeholder for memorization verification logic
    }

    showMemorizationHint() {
        this.showToast('Pista: "fortalece"', 'info');
    }

    nextMemorizationVerse() {
        this.showToast('Cargando siguiente versículo...', 'info');
    }

    /**
     * Social Features UI
     */
    handleGroupAction(action) {
        switch (action) {
            case 'join':
                this.showToast('Uniéndose al grupo...', 'info');
                break;
            case 'view':
                this.showToast('Abriendo grupo...', 'info');
                break;
            default:
                this.showToast('Acción no reconocida', 'warning');
        }
    }

    /**
     * Dashboard Updates
     */
    updateDashboard() {
        this.updateUIFromAppState();
        
        // Update verse of the day (placeholder)
        const verseContainer = document.querySelector('blockquote');
        if (verseContainer) {
            // Placeholder for daily verse rotation
        }
    }

    /**
     * Utility Methods
     */
    getSectionDisplayName(section) {
        const names = {
            'inicio': 'Inicio',
            'teoria': 'Teoría',
            'practica': 'Práctica',
            'social': 'Social',
            'settings': 'Ajustes'
        };
        return names[section] || section;
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    log(...args) {
        if (this.app && this.app.config.debug) {
            console.log('🎨 UI Manager:', ...args);
        }
    }

    error(...args) {
        console.error('❌ UI Manager Error:', ...args);
    }

    /**
     * Public API
     */
    isInitialized() {
        return this.initialized;
    }

    getCurrentSection() {
        return this.currentSection;
    }

    getCurrentSubsection() {
        return this.currentSubsection;
    }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}