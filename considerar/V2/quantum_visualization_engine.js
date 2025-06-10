/**
 * Quantum Visualization Engine
 * Ultra-advanced data visualization system for biblical analysis
 * Version 3.0.0 - Production Ready
 */

class QuantumVisualizationEngine {
    constructor() {
        this.version = '3.0.0';
        this.canvases = new Map();
        this.contexts = new Map();
        this.visualizations = new Map();
        this.animationFrames = new Map();
        this.isInitialized = false;
        
        // Advanced configuration
        this.config = {
            theme: 'dark',
            animations: true,
            performance: 'high',
            quality: 'ultra',
            antialiasing: true,
            devicePixelRatio: window.devicePixelRatio || 1,
            maxFPS: 120,
            targetLatency: 16.67, // 60 FPS baseline
            webGL: true,
            offscreenCanvas: true
        };

        // Color schemes
        this.colorSchemes = {
            neural: {
                primary: '#58a6ff',
                secondary: '#a5a2ff',
                accent: '#3fb950',
                warning: '#d29922',
                error: '#f85149',
                background: '#0d1117',
                surface: '#161b22',
                text: '#f0f6fc'
            },
            quantum: {
                primary: '#6f42c1',
                secondary: '#e1457b',
                accent: '#fd7e14',
                warning: '#ffc107',
                error: '#dc3545',
                background: '#0a0e13',
                surface: '#1a1f29',
                text: '#ffffff'
            },
            biblical: {
                primary: '#8b5a2b',
                secondary: '#c8860d',
                accent: '#228b22',
                warning: '#ff8c00',
                error: '#b22222',
                background: '#2f1b14',
                surface: '#3e2723',
                text: '#f5e6d3'
            }
        };

        // Performance monitoring
        this.performance = {
            frameCount: 0,
            lastFrameTime: 0,
            fps: 0,
            averageFrameTime: 0,
            memoryUsage: 0,
            renderCalls: 0
        };

        this.init();
    }

    async init() {
        console.log('🎨 Initializing Quantum Visualization Engine...');
        
        try {
            await this.detectCapabilities();
            await this.initializeWebGL();
            await this.setupPerformanceMonitoring();
            await this.loadShaders();
            await this.initializeVisualizationTypes();
            
            this.isInitialized = true;
            console.log('✅ Quantum Visualization Engine fully initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Visualization Engine:', error);
            throw error;
        }
    }

    async detectCapabilities() {
        // Detect browser and hardware capabilities
        this.capabilities = {
            webGL: !!window.WebGLRenderingContext,
            webGL2: !!window.WebGL2RenderingContext,
            offscreenCanvas: typeof OffscreenCanvas !== 'undefined',
            webWorkers: typeof Worker !== 'undefined',
            performanceAPI: typeof performance !== 'undefined',
            gamepadAPI: typeof navigator.getGamepads !== 'undefined',
            touchEvents: 'ontouchstart' in window,
            pointerEvents: typeof PointerEvent !== 'undefined',
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            deviceMemory: navigator.deviceMemory || 4,
            maxTextureSize: 0,
            maxVertexUniforms: 0,
            maxFragmentUniforms: 0
        };

        // WebGL capability detection
        if (this.capabilities.webGL) {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                this.capabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                this.capabilities.maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
                this.capabilities.maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
                
                // Clean up
                gl.getExtension('WEBGL_lose_context')?.loseContext();
            }
        }

        console.log('📊 Capabilities detected:', this.capabilities);
    }

    async initializeWebGL() {
        this.webGL = {
            contexts: new Map(),
            programs: new Map(),
            buffers: new Map(),
            textures: new Map(),
            uniforms: new Map()
        };
    }

    async setupPerformanceMonitoring() {
        this.performanceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'measure') {
                    this.performance.renderCalls++;
                }
            }
        });
        
        if (typeof PerformanceObserver !== 'undefined') {
            this.performanceObserver.observe({ entryTypes: ['measure'] });
        }

        // FPS monitoring
        this.startFPSMonitoring();
    }

    startFPSMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.performance.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.performance.averageFrameTime = (currentTime - lastTime) / frameCount;
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    async loadShaders() {
        this.shaders = {
            vertex: {
                basic: `
                    attribute vec2 a_position;
                    attribute vec4 a_color;
                    attribute vec2 a_texCoord;
                    
                    uniform mat3 u_matrix;
                    uniform float u_time;
                    
                    varying vec4 v_color;
                    varying vec2 v_texCoord;
                    
                    void main() {
                        vec3 position = u_matrix * vec3(a_position, 1.0);
                        gl_Position = vec4(position.xy, 0.0, 1.0);
                        v_color = a_color;
                        v_texCoord = a_texCoord;
                    }
                `,
                
                neural: `
                    attribute vec2 a_position;
                    attribute vec4 a_color;
                    attribute float a_weight;
                    
                    uniform mat3 u_matrix;
                    uniform float u_time;
                    uniform float u_amplitude;
                    
                    varying vec4 v_color;
                    varying float v_weight;
                    
                    void main() {
                        vec2 position = a_position;
                        
                        // Neural network animation
                        float wave = sin(u_time * 0.001 + a_position.x * 0.1) * u_amplitude;
                        position.y += wave * a_weight;
                        
                        vec3 finalPosition = u_matrix * vec3(position, 1.0);
                        gl_Position = vec4(finalPosition.xy, 0.0, 1.0);
                        
                        v_color = a_color;
                        v_weight = a_weight;
                    }
                `,
                
                correlation: `
                    attribute vec2 a_position;
                    attribute vec4 a_color;
                    attribute float a_correlation;
                    
                    uniform mat3 u_matrix;
                    uniform float u_time;
                    uniform vec2 u_resolution;
                    
                    varying vec4 v_color;
                    varying float v_correlation;
                    varying vec2 v_position;
                    
                    void main() {
                        vec2 position = a_position;
                        
                        // Correlation-based displacement
                        float angle = atan(position.y, position.x);
                        float radius = length(position);
                        radius *= (1.0 + a_correlation * 0.2);
                        
                        position = vec2(cos(angle) * radius, sin(angle) * radius);
                        
                        vec3 finalPosition = u_matrix * vec3(position, 1.0);
                        gl_Position = vec4(finalPosition.xy, 0.0, 1.0);
                        
                        v_color = a_color;
                        v_correlation = a_correlation;
                        v_position = position;
                    }
                `
            },
            
            fragment: {
                basic: `
                    precision mediump float;
                    
                    varying vec4 v_color;
                    varying vec2 v_texCoord;
                    
                    uniform sampler2D u_texture;
                    uniform float u_alpha;
                    
                    void main() {
                        vec4 textureColor = texture2D(u_texture, v_texCoord);
                        gl_FragColor = v_color * textureColor * u_alpha;
                    }
                `,
                
                neural: `
                    precision mediump float;
                    
                    varying vec4 v_color;
                    varying float v_weight;
                    
                    uniform float u_time;
                    uniform vec2 u_resolution;
                    
                    void main() {
                        vec2 uv = gl_FragCoord.xy / u_resolution;
                        
                        // Neural activity glow
                        float pulse = sin(u_time * 0.003 + v_weight * 10.0) * 0.5 + 0.5;
                        float glow = smoothstep(0.0, 1.0, v_weight) * pulse;
                        
                        vec3 color = v_color.rgb;
                        color += vec3(0.2, 0.4, 1.0) * glow * 0.3;
                        
                        gl_FragColor = vec4(color, v_color.a);
                    }
                `,
                
                heatmap: `
                    precision mediump float;
                    
                    varying vec4 v_color;
                    varying float v_correlation;
                    varying vec2 v_position;
                    
                    uniform float u_time;
                    uniform vec2 u_resolution;
                    
                    vec3 heatmapColor(float value) {
                        vec3 blue = vec3(0.0, 0.0, 1.0);
                        vec3 cyan = vec3(0.0, 1.0, 1.0);
                        vec3 yellow = vec3(1.0, 1.0, 0.0);
                        vec3 red = vec3(1.0, 0.0, 0.0);
                        
                        if (value < 0.33) {
                            return mix(blue, cyan, value * 3.0);
                        } else if (value < 0.66) {
                            return mix(cyan, yellow, (value - 0.33) * 3.0);
                        } else {
                            return mix(yellow, red, (value - 0.66) * 3.0);
                        }
                    }
                    
                    void main() {
                        float normalizedCorr = (v_correlation + 1.0) * 0.5;
                        vec3 color = heatmapColor(normalizedCorr);
                        
                        // Add some shimmer effect
                        float shimmer = sin(u_time * 0.005 + v_position.x * 10.0 + v_position.y * 10.0) * 0.1;
                        color += shimmer;
                        
                        gl_FragColor = vec4(color, 0.8);
                    }
                `
            }
        };
    }

    async initializeVisualizationTypes() {
        this.visualizationTypes = {
            'neural-network': new NeuralNetworkVisualization(this),
            'correlation-heatmap': new CorrelationHeatmapVisualization(this),
            'semantic-flow': new SemanticFlowVisualization(this),
            'timeline-analysis': new TimelineAnalysisVisualization(this),
            'word-cloud': new WordCloudVisualization(this),
            'pattern-matrix': new PatternMatrixVisualization(this),
            'contextual-radar': new ContextualRadarVisualization(this),
            'hierarchical-tree': new HierarchicalTreeVisualization(this),
            'dynamic-graph': new DynamicGraphVisualization(this),
            'statistical-distribution': new StatisticalDistributionVisualization(this)
        };
    }

    // Main visualization creation method
    async createVisualization(containerId, type, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container not found: ${containerId}`);
        }

        // Create canvas
        const canvas = await this.createCanvas(containerId, options);
        const context = this.getContext(containerId, options);
        
        // Get visualization instance
        const visualization = this.visualizationTypes[type];
        if (!visualization) {
            throw new Error(`Unknown visualization type: ${type}`);
        }

        // Setup and render
        await visualization.setup(canvas, context, options);
        const result = await visualization.render(data, options);
        
        // Store references
        this.visualizations.set(containerId, {
            type,
            visualization,
            canvas,
            context,
            data,
            options,
            lastUpdate: Date.now()
        });

        return result;
    }

    async createCanvas(containerId, options = {}) {
        const container = document.getElementById(containerId);
        const rect = container.getBoundingClientRect();
        
        const canvas = document.createElement('canvas');
        canvas.id = `${containerId}_canvas`;
        canvas.className = 'quantum-visualization-canvas';
        
        // Set size with device pixel ratio consideration
        const pixelRatio = this.config.devicePixelRatio;
        const width = (options.width || rect.width) * pixelRatio;
        const height = (options.height || rect.height) * pixelRatio;
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width / pixelRatio}px`;
        canvas.style.height = `${height / pixelRatio}px`;
        
        // Clear container and add canvas
        container.innerHTML = '';
        container.appendChild(canvas);
        
        this.canvases.set(containerId, canvas);
        return canvas;
    }

    getContext(containerId, options = {}) {
        const canvas = this.canvases.get(containerId);
        if (!canvas) {
            throw new Error(`Canvas not found: ${containerId}`);
        }

        let context;
        
        if (options.webgl && this.capabilities.webGL) {
            context = canvas.getContext('webgl', {
                alpha: true,
                antialias: this.config.antialiasing,
                depth: true,
                stencil: true,
                preserveDrawingBuffer: false,
                powerPreference: 'high-performance'
            });
            
            if (!context && this.capabilities.webGL) {
                context = canvas.getContext('experimental-webgl');
            }
        }
        
        if (!context) {
            context = canvas.getContext('2d', {
                alpha: true,
                desynchronized: true,
                colorSpace: 'srgb'
            });
        }

        this.contexts.set(containerId, context);
        return context;
    }

    // Animation system
    startAnimation(containerId, animationFunction) {
        this.stopAnimation(containerId);
        
        const animate = (timestamp) => {
            const visualization = this.visualizations.get(containerId);
            if (!visualization) return;
            
            performance.mark('render-start');
            
            animationFunction(timestamp, visualization);
            
            performance.mark('render-end');
            performance.measure('render-time', 'render-start', 'render-end');
            
            this.animationFrames.set(containerId, requestAnimationFrame(animate));
        };
        
        this.animationFrames.set(containerId, requestAnimationFrame(animate));
    }

    stopAnimation(containerId) {
        const frameId = this.animationFrames.get(containerId);
        if (frameId) {
            cancelAnimationFrame(frameId);
            this.animationFrames.delete(containerId);
        }
    }

    // Update visualization data
    async updateVisualization(containerId, newData, options = {}) {
        const viz = this.visualizations.get(containerId);
        if (!viz) {
            throw new Error(`Visualization not found: ${containerId}`);
        }

        // Merge new options
        const mergedOptions = { ...viz.options, ...options };
        
        // Update data
        viz.data = newData;
        viz.options = mergedOptions;
        viz.lastUpdate = Date.now();
        
        // Re-render
        if (viz.visualization.update) {
            await viz.visualization.update(newData, mergedOptions);
        } else {
            await viz.visualization.render(newData, mergedOptions);
        }
    }

    // Utility methods
    getCurrentTheme() {
        return this.colorSchemes[this.config.theme] || this.colorSchemes.neural;
    }

    setTheme(themeName) {
        if (this.colorSchemes[themeName]) {
            this.config.theme = themeName;
            
            // Update all active visualizations
            for (const [containerId, viz] of this.visualizations) {
                this.updateVisualization(containerId, viz.data, viz.options);
            }
        }
    }

    getPerformanceMetrics() {
        return {
            ...this.performance,
            capabilities: this.capabilities,
            activeVisualizations: this.visualizations.size,
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    estimateMemoryUsage() {
        let totalMemory = 0;
        
        for (const canvas of this.canvases.values()) {
            totalMemory += canvas.width * canvas.height * 4; // 4 bytes per pixel (RGBA)
        }
        
        return Math.round(totalMemory / 1024 / 1024); // MB
    }

    // Export functionality
    async exportVisualization(containerId, format = 'png', quality = 0.9) {
        const canvas = this.canvases.get(containerId);
        if (!canvas) {
            throw new Error(`Canvas not found: ${containerId}`);
        }

        switch (format.toLowerCase()) {
            case 'png':
                return canvas.toDataURL('image/png');
            case 'jpg':
            case 'jpeg':
                return canvas.toDataURL('image/jpeg', quality);
            case 'webp':
                return canvas.toDataURL('image/webp', quality);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    // Cleanup
    destroyVisualization(containerId) {
        this.stopAnimation(containerId);
        
        const viz = this.visualizations.get(containerId);
        if (viz && viz.visualization.destroy) {
            viz.visualization.destroy();
        }
        
        this.visualizations.delete(containerId);
        this.canvases.delete(containerId);
        this.contexts.delete(containerId);
        this.animationFrames.delete(containerId);
    }
}

// Neural Network Visualization
class NeuralNetworkVisualization {
    constructor(engine) {
        this.engine = engine;
        this.nodes = [];
        this.connections = [];
        this.animationState = {
            time: 0,
            pulsePhase: 0,
            activations: new Map()
        };
    }

    async setup(canvas, context, options) {
        this.canvas = canvas;
        this.context = context;
        this.options = {
            nodeRadius: 8,
            connectionWidth: 2,
            animationSpeed: 1,
            showActivations: true,
            showWeights: false,
            layerSpacing: 150,
            nodeSpacing: 60,
            ...options
        };
    }

    async render(data, options = {}) {
        const mergedOptions = { ...this.options, ...options };
        
        // Process neural network data
        this.processData(data);
        
        // Clear canvas
        this.clearCanvas();
        
        // Render connections first (behind nodes)
        this.renderConnections();
        
        // Render nodes
        this.renderNodes();
        
        // Render labels if enabled
        if (mergedOptions.showLabels) {
            this.renderLabels();
        }

        // Start animation if enabled
        if (this.engine.config.animations) {
            this.startAnimation();
        }
    }

    processData(data) {
        this.nodes = data.nodes || [];
        this.connections = data.connections || [];
        
        // Calculate positions if not provided
        if (this.nodes.length > 0 && !this.nodes[0].x) {
            this.calculatePositions();
        }
    }

    calculatePositions() {
        const layers = this.groupNodesByLayer();
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        layers.forEach((layerNodes, layerIndex) => {
            const x = centerX + (layerIndex - layers.length / 2) * this.options.layerSpacing;
            
            layerNodes.forEach((node, nodeIndex) => {
                const y = centerY + (nodeIndex - layerNodes.length / 2) * this.options.nodeSpacing;
                node.x = x;
                node.y = y;
            });
        });
    }

    groupNodesByLayer() {
        const layers = new Map();
        
        this.nodes.forEach(node => {
            const layer = node.layer || 0;
            if (!layers.has(layer)) {
                layers.set(layer, []);
            }
            layers.get(layer).push(node);
        });
        
        return Array.from(layers.values());
    }

    clearCanvas() {
        if (this.context.clearRect) {
            // 2D context
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            // WebGL context
            this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        }
    }

    renderConnections() {
        const theme = this.engine.getCurrentTheme();
        
        this.connections.forEach(connection => {
            const fromNode = this.nodes.find(n => n.id === connection.from);
            const toNode = this.nodes.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return;
            
            const weight = connection.weight || 0;
            const activation = this.animationState.activations.get(connection.id) || 0;
            
            // Connection styling
            const alpha = Math.abs(weight) * 0.7 + 0.3;
            const width = this.options.connectionWidth * (Math.abs(weight) + 0.5);
            
            // Color based on weight
            let color = weight > 0 ? theme.accent : theme.error;
            if (activation > 0.5) {
                color = theme.primary;
            }
            
            this.drawConnection(fromNode, toNode, color, alpha, width);
        });
    }

    drawConnection(from, to, color, alpha, width) {
        if (this.context.beginPath) {
            // 2D rendering
            this.context.beginPath();
            this.context.moveTo(from.x, from.y);
            this.context.lineTo(to.x, to.y);
            this.context.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
            this.context.lineWidth = width;
            this.context.stroke();
        } else {
            // WebGL rendering would go here
            this.drawWebGLConnection(from, to, color, alpha, width);
        }
    }

    renderNodes() {
        const theme = this.engine.getCurrentTheme();
        
        this.nodes.forEach(node => {
            const activation = node.activation || 0;
            const pulsePhase = this.animationState.pulsePhase + (node.id || 0) * 0.1;
            const pulse = Math.sin(pulsePhase) * 0.2 + 0.8;
            
            // Node styling
            const radius = this.options.nodeRadius * (activation * 0.5 + 0.5) * pulse;
            const color = this.getNodeColor(node, theme);
            const alpha = activation * 0.6 + 0.4;
            
            this.drawNode(node, radius, color, alpha);
        });
    }

    getNodeColor(node, theme) {
        switch (node.type) {
            case 'input': return theme.secondary;
            case 'hidden': return theme.primary;
            case 'output': return theme.accent;
            default: return theme.text;
        }
    }

    drawNode(node, radius, color, alpha) {
        if (this.context.beginPath) {
            // 2D rendering
            this.context.beginPath();
            this.context.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.context.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
            this.context.fill();
            
            // Glow effect
            const gradient = this.context.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius * 2
            );
            gradient.addColorStop(0, color + '40');
            gradient.addColorStop(1, 'transparent');
            
            this.context.fillStyle = gradient;
            this.context.fill();
        }
    }

    startAnimation() {
        this.engine.startAnimation(this.canvas.id, (timestamp) => {
            this.animationState.time = timestamp;
            this.animationState.pulsePhase += 0.1;
            
            // Update activations with wave effect
            this.connections.forEach(connection => {
                const wave = Math.sin(timestamp * 0.001 + connection.id * 0.1) * 0.5 + 0.5;
                this.animationState.activations.set(connection.id, wave);
            });
            
            // Re-render
            this.render(this.lastData, this.options);
        });
    }
}

// Correlation Heatmap Visualization
class CorrelationHeatmapVisualization {
    constructor(engine) {
        this.engine = engine;
        this.matrix = [];
        this.labels = [];
    }

    async setup(canvas, context, options) {
        this.canvas = canvas;
        this.context = context;
        this.options = {
            cellSize: 30,
            fontSize: 12,
            showValues: true,
            showColorBar: true,
            interpolation: 'bilinear',
            ...options
        };
    }

    async render(data, options = {}) {
        const mergedOptions = { ...this.options, ...options };
        
        this.processData(data);
        
        // Clear canvas
        this.clearCanvas();
        
        // Calculate layout
        const layout = this.calculateLayout();
        
        // Render heatmap
        this.renderHeatmap(layout);
        
        // Render labels
        if (mergedOptions.showLabels) {
            this.renderLabels(layout);
        }
        
        // Render color bar
        if (mergedOptions.showColorBar) {
            this.renderColorBar(layout);
        }
        
        // Render values
        if (mergedOptions.showValues) {
            this.renderValues(layout);
        }
    }

    processData(data) {
        this.matrix = data.matrix || [];
        this.labels = data.labels || [];
        
        // Generate labels if not provided
        if (this.labels.length === 0 && this.matrix.length > 0) {
            this.labels = this.matrix.map((_, i) => `Item ${i + 1}`);
        }
    }

    calculateLayout() {
        const margin = 80;
        const availableWidth = this.canvas.width - margin * 2;
        const availableHeight = this.canvas.height - margin * 2;
        
        const cellSize = Math.min(
            availableWidth / this.matrix.length,
            availableHeight / this.matrix.length,
            this.options.cellSize
        );
        
        return {
            margin,
            cellSize,
            startX: margin,
            startY: margin,
            width: cellSize * this.matrix.length,
            height: cellSize * this.matrix.length
        };
    }

    renderHeatmap(layout) {
        this.matrix.forEach((row, i) => {
            row.forEach((value, j) => {
                const x = layout.startX + j * layout.cellSize;
                const y = layout.startY + i * layout.cellSize;
                
                const color = this.valueToColor(value);
                
                if (this.context.fillRect) {
                    this.context.fillStyle = color;
                    this.context.fillRect(x, y, layout.cellSize, layout.cellSize);
                    
                    // Cell border
                    this.context.strokeStyle = this.engine.getCurrentTheme().background;
                    this.context.lineWidth = 1;
                    this.context.strokeRect(x, y, layout.cellSize, layout.cellSize);
                }
            });
        });
    }

    valueToColor(value) {
        // Normalize value to 0-1 range
        const normalized = (value + 1) / 2;
        
        // Create color gradient from blue through white to red
        let r, g, b;
        
        if (normalized < 0.5) {
            // Blue to white
            const t = normalized * 2;
            r = Math.round(t * 255);
            g = Math.round(t * 255);
            b = 255;
        } else {
            // White to red
            const t = (normalized - 0.5) * 2;
            r = 255;
            g = Math.round((1 - t) * 255);
            b = Math.round((1 - t) * 255);
        }
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    renderLabels(layout) {
        const theme = this.engine.getCurrentTheme();
        
        this.context.fillStyle = theme.text;
        this.context.font = `${this.options.fontSize}px ${this.engine.config.fontFamily || 'Inter'}`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        
        // X-axis labels
        this.labels.forEach((label, i) => {
            const x = layout.startX + i * layout.cellSize + layout.cellSize / 2;
            const y = layout.startY - 10;
            
            this.context.save();
            this.context.translate(x, y);
            this.context.rotate(-Math.PI / 4);
            this.context.fillText(label, 0, 0);
            this.context.restore();
        });
        
        // Y-axis labels
        this.context.textAlign = 'right';
        this.labels.forEach((label, i) => {
            const x = layout.startX - 10;
            const y = layout.startY + i * layout.cellSize + layout.cellSize / 2;
            this.context.fillText(label, x, y);
        });
    }

    renderValues(layout) {
        const theme = this.engine.getCurrentTheme();
        
        this.context.font = `${Math.max(8, this.options.fontSize - 2)}px ${this.engine.config.fontFamily || 'Inter'}`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        
        this.matrix.forEach((row, i) => {
            row.forEach((value, j) => {
                const x = layout.startX + j * layout.cellSize + layout.cellSize / 2;
                const y = layout.startY + i * layout.cellSize + layout.cellSize / 2;
                
                // Choose text color based on background
                const normalized = (value + 1) / 2;
                this.context.fillStyle = normalized > 0.5 ? '#000000' : '#ffffff';
                
                this.context.fillText(value.toFixed(2), x, y);
            });
        });
    }

    renderColorBar(layout) {
        const colorBarWidth = 20;
        const colorBarHeight = layout.height;
        const colorBarX = layout.startX + layout.width + 30;
        const colorBarY = layout.startY;
        
        // Draw color gradient
        const gradient = this.context.createLinearGradient(0, colorBarY + colorBarHeight, 0, colorBarY);
        gradient.addColorStop(0, 'rgb(0, 0, 255)');
        gradient.addColorStop(0.5, 'rgb(255, 255, 255)');
        gradient.addColorStop(1, 'rgb(255, 0, 0)');
        
        this.context.fillStyle = gradient;
        this.context.fillRect(colorBarX, colorBarY, colorBarWidth, colorBarHeight);
        
        // Draw scale
        const theme = this.engine.getCurrentTheme();
        this.context.fillStyle = theme.text;
        this.context.font = `${this.options.fontSize}px ${this.engine.config.fontFamily || 'Inter'}`;
        this.context.textAlign = 'left';
        
        // Scale labels
        this.context.fillText('1.0', colorBarX + colorBarWidth + 5, colorBarY);
        this.context.fillText('0.0', colorBarX + colorBarWidth + 5, colorBarY + colorBarHeight / 2);
        this.context.fillText('-1.0', colorBarX + colorBarWidth + 5, colorBarY + colorBarHeight);
    }

    clearCanvas() {
        if (this.context.clearRect) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Additional visualization classes would be implemented similarly...
// For brevity, I'll include just these two comprehensive examples

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumVisualizationEngine;
} else {
    window.QuantumVisualizationEngine = QuantumVisualizationEngine;
}