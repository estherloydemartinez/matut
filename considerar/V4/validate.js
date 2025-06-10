#!/usr/bin/env node

/**
 * BibliaApp Pro Enhanced - Validation Script
 * Comprehensive validation of all enhanced components
 */

const fs = require('fs').promises;
const path = require('path');

class BibliaAppValidator {
    constructor() {
        this.validationResults = {
            structure: { passed: 0, failed: 0, tests: [] },
            modules: { passed: 0, failed: 0, tests: [] },
            integration: { passed: 0, failed: 0, tests: [] },
            performance: { passed: 0, failed: 0, tests: [] },
            pwa: { passed: 0, failed: 0, tests: [] }
        };
    }
    
    async validate() {
        console.log('🔍 Starting BibliaApp Pro Enhanced validation...\n');
        
        const startTime = Date.now();
        
        try {
            await this.validateProjectStructure();
            await this.validateModuleIntegrity();
            await this.validateModuleIntegration();
            await this.validatePerformanceMetrics();
            await this.validatePWAFeatures();
            
            this.generateValidationReport();
            
            const validationTime = Date.now() - startTime;
            console.log(`\\n✅ Validation completed in ${validationTime}ms`);
            
        } catch (error) {
            console.error('❌ Validation failed:', error);
            process.exit(1);
        }
    }
    
    async validateProjectStructure() {
        console.log('📁 Validating project structure...');
        
        const requiredFiles = [
            { path: 'index.html', type: 'file', critical: true },
            { path: 'manifest.json', type: 'file', critical: true },
            { path: 'sw.js', type: 'file', critical: true },
            { path: 'package.json', type: 'file', critical: true },
            { path: 'README.md', type: 'file', critical: false },
            { path: 'deploy.js', type: 'file', critical: false },
            { path: 'assets', type: 'directory', critical: true },
            { path: 'assets/css', type: 'directory', critical: true },
            { path: 'assets/js', type: 'directory', critical: true },
            { path: 'assets/js/core', type: 'directory', critical: true },
            { path: 'assets/js/modules', type: 'directory', critical: true }
        ];
        
        for (const item of requiredFiles) {
            await this.validateFileOrDirectory(item, 'structure');
        }
        
        // Validate core files
        const coreFiles = [
            'assets/js/core/constants.js',
            'assets/js/core/utils.js',
            'assets/js/core/storage.js',
            'assets/js/core/state-manager.js',
            'assets/js/core/ui-manager.js'
        ];
        
        for (const file of coreFiles) {
            await this.validateFileOrDirectory({ path: file, type: 'file', critical: true }, 'structure');
        }
        
        // Validate enhanced modules
        const enhancedModules = [
            'assets/js/modules/bible-data-enhanced.js',
            'assets/js/modules/social-system-enhanced.js',
            'assets/js/modules/analytical-tools-enhanced.js'
        ];
        
        for (const module of enhancedModules) {
            await this.validateFileOrDirectory({ path: module, type: 'file', critical: true }, 'structure');
        }
        
        console.log(`  ✅ Structure validation: ${this.validationResults.structure.passed} passed, ${this.validationResults.structure.failed} failed\\n`);
    }
    
    async validateModuleIntegrity() {
        console.log('🧩 Validating module integrity...');
        
        const modules = [
            { path: 'assets/js/app-enhanced.js', name: 'Enhanced App', critical: true },
            { path: 'assets/js/modules/bible-data-enhanced.js', name: 'Bible Data Enhanced', critical: true },
            { path: 'assets/js/modules/social-system-enhanced.js', name: 'Social System Enhanced', critical: true },
            { path: 'assets/js/modules/analytical-tools-enhanced.js', name: 'Analytical Tools Enhanced', critical: true }
        ];
        
        for (const module of modules) {
            await this.validateModuleStructure(module);
        }
        
        console.log(`  ✅ Module validation: ${this.validationResults.modules.passed} passed, ${this.validationResults.modules.failed} failed\\n`);
    }
    
    async validateModuleIntegration() {
        console.log('🔗 Validating module integration...');
        
        // Check if main app imports all enhanced modules
        await this.validateAppImports();
        
        // Check if modules follow proper export patterns
        await this.validateExportPatterns();
        
        // Check cross-module dependencies
        await this.validateCrossModuleDependencies();
        
        console.log(`  ✅ Integration validation: ${this.validationResults.integration.passed} passed, ${this.validationResults.integration.failed} failed\\n`);
    }
    
    async validatePerformanceMetrics() {
        console.log('⚡ Validating performance metrics...');
        
        // Check file sizes
        await this.validateFileSizes();
        
        // Check module structure for performance
        await this.validateModulePerformance();
        
        console.log(`  ✅ Performance validation: ${this.validationResults.performance.passed} passed, ${this.validationResults.performance.failed} failed\\n`);
    }
    
    async validatePWAFeatures() {
        console.log('📱 Validating PWA features...');
        
        // Validate manifest.json
        await this.validateManifest();
        
        // Validate service worker
        await this.validateServiceWorker();
        
        // Check PWA requirements
        await this.validatePWARequirements();
        
        console.log(`  ✅ PWA validation: ${this.validationResults.pwa.passed} passed, ${this.validationResults.pwa.failed} failed\\n`);
    }
    
    async validateFileOrDirectory(item, category) {
        try {
            const stats = await fs.stat(item.path);
            
            if (item.type === 'file' && !stats.isFile()) {
                throw new Error(`Expected file but found directory: ${item.path}`);
            }
            
            if (item.type === 'directory' && !stats.isDirectory()) {
                throw new Error(`Expected directory but found file: ${item.path}`);
            }
            
            this.recordTest(category, `${item.path} exists`, true);
            
            // Additional checks for files
            if (item.type === 'file' && stats.size === 0) {
                throw new Error(`File is empty: ${item.path}`);
            }
            
        } catch (error) {
            this.recordTest(category, `${item.path} validation`, false, error.message);
            if (item.critical) {
                throw error;
            }
        }
    }
    
    async validateModuleStructure(module) {
        try {
            const content = await fs.readFile(module.path, 'utf8');
            
            // Check for ES6 module syntax
            if (!content.includes('export')) {
                throw new Error(`Module missing export: ${module.path}`);
            }
            
            // Check for class definition or module pattern
            if (!content.includes('class ') && !content.includes('function ')) {
                throw new Error(`Module missing main class/function: ${module.path}`);
            }
            
            // Check for initialization pattern
            if (!content.includes('constructor') && !content.includes('initialize')) {
                console.warn(`  ⚠️ Module might be missing initialization: ${module.path}`);
            }
            
            this.recordTest('modules', `${module.name} structure`, true);
            
        } catch (error) {
            this.recordTest('modules', `${module.name} structure`, false, error.message);
            if (module.critical) {
                throw error;
            }
        }
    }
    
    async validateAppImports() {
        try {
            const appContent = await fs.readFile('assets/js/app-enhanced.js', 'utf8');
            
            const requiredImports = [
                'bible-data-enhanced.js',
                'social-system-enhanced.js', 
                'analytical-tools-enhanced.js'
            ];
            
            for (const importFile of requiredImports) {
                if (!appContent.includes(importFile)) {
                    throw new Error(`Missing import: ${importFile}`);
                }
            }
            
            this.recordTest('integration', 'App imports enhanced modules', true);
            
        } catch (error) {
            this.recordTest('integration', 'App imports enhanced modules', false, error.message);
        }
    }
    
    async validateExportPatterns() {
        const moduleFiles = [
            'assets/js/modules/bible-data-enhanced.js',
            'assets/js/modules/social-system-enhanced.js',
            'assets/js/modules/analytical-tools-enhanced.js'
        ];
        
        for (const moduleFile of moduleFiles) {
            try {
                const content = await fs.readFile(moduleFile, 'utf8');
                
                if (!content.includes('export default')) {
                    throw new Error(`Missing default export in ${moduleFile}`);
                }
                
                this.recordTest('integration', `${path.basename(moduleFile)} export pattern`, true);
                
            } catch (error) {
                this.recordTest('integration', `${path.basename(moduleFile)} export pattern`, false, error.message);
            }
        }
    }
    
    async validateCrossModuleDependencies() {
        // This would check for circular dependencies and proper module communication
        // For now, just verify the event bus pattern exists
        try {
            const appContent = await fs.readFile('assets/js/app-enhanced.js', 'utf8');
            
            if (!appContent.includes('BibliaAppEventBus')) {
                throw new Error('Missing event bus for cross-module communication');
            }
            
            this.recordTest('integration', 'Event bus pattern', true);
            
        } catch (error) {
            this.recordTest('integration', 'Event bus pattern', false, error.message);
        }
    }
    
    async validateFileSizes() {
        const fileSizeLimits = {
            'assets/js/app-enhanced.js': 500 * 1024, // 500KB
            'assets/js/modules/analytical-tools-enhanced.js': 300 * 1024, // 300KB
            'sw.js': 100 * 1024 // 100KB
        };
        
        for (const [file, limit] of Object.entries(fileSizeLimits)) {
            try {
                const stats = await fs.stat(file);
                
                if (stats.size > limit) {
                    console.warn(`  ⚠️ File size warning: ${file} is ${(stats.size/1024).toFixed(1)}KB (limit: ${limit/1024}KB)`);
                }
                
                this.recordTest('performance', `${file} size check`, true);
                
            } catch (error) {
                this.recordTest('performance', `${file} size check`, false, error.message);
            }
        }
    }
    
    async validateModulePerformance() {
        // Check for performance anti-patterns
        const performanceChecks = [
            { pattern: /console\\.log/, message: 'Contains console.log statements' },
            { pattern: /debugger/, message: 'Contains debugger statements' },
            { pattern: /alert\\(/, message: 'Contains alert statements' }
        ];
        
        const jsFiles = await this.findJSFiles('assets/js');
        
        for (const file of jsFiles) {
            try {
                const content = await fs.readFile(file, 'utf8');
                
                for (const check of performanceChecks) {
                    if (check.pattern.test(content)) {
                        console.warn(`  ⚠️ Performance warning in ${file}: ${check.message}`);
                    }
                }
                
                this.recordTest('performance', `${path.basename(file)} performance check`, true);
                
            } catch (error) {
                this.recordTest('performance', `${path.basename(file)} performance check`, false, error.message);
            }
        }
    }
    
    async validateManifest() {
        try {
            const manifestContent = await fs.readFile('manifest.json', 'utf8');
            const manifest = JSON.parse(manifestContent);
            
            const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'icons'];
            
            for (const field of requiredFields) {
                if (!manifest[field]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }
            
            // Check icons array
            if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
                throw new Error('Icons array is empty or invalid');
            }
            
            this.recordTest('pwa', 'Manifest validation', true);
            
        } catch (error) {
            this.recordTest('pwa', 'Manifest validation', false, error.message);
        }
    }
    
    async validateServiceWorker() {
        try {
            const swContent = await fs.readFile('sw.js', 'utf8');
            
            const requiredFeatures = [
                'install',
                'activate', 
                'fetch',
                'caches',
                'CACHE_NAME'
            ];
            
            for (const feature of requiredFeatures) {
                if (!swContent.includes(feature)) {
                    throw new Error(`Service Worker missing: ${feature}`);
                }
            }
            
            this.recordTest('pwa', 'Service Worker validation', true);
            
        } catch (error) {
            this.recordTest('pwa', 'Service Worker validation', false, error.message);
        }
    }
    
    async validatePWARequirements() {
        // Check if index.html references manifest
        try {
            const indexContent = await fs.readFile('index.html', 'utf8');
            
            if (!indexContent.includes('manifest.json')) {
                throw new Error('Index.html missing manifest link');
            }
            
            if (!indexContent.includes('theme-color')) {
                throw new Error('Index.html missing theme-color meta tag');
            }
            
            this.recordTest('pwa', 'PWA requirements', true);
            
        } catch (error) {
            this.recordTest('pwa', 'PWA requirements', false, error.message);
        }
    }
    
    async findJSFiles(directory) {
        const files = [];
        
        try {
            const entries = await fs.readdir(directory, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(directory, entry.name);
                
                if (entry.isDirectory()) {
                    const nestedFiles = await this.findJSFiles(fullPath);
                    files.push(...nestedFiles);
                } else if (entry.name.endsWith('.js')) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Directory might not exist
        }
        
        return files;
    }
    
    recordTest(category, testName, passed, errorMessage = null) {
        this.validationResults[category].tests.push({
            name: testName,
            passed,
            errorMessage
        });
        
        if (passed) {
            this.validationResults[category].passed++;
        } else {
            this.validationResults[category].failed++;
        }
    }
    
    generateValidationReport() {
        const totalPassed = Object.values(this.validationResults).reduce((sum, cat) => sum + cat.passed, 0);
        const totalFailed = Object.values(this.validationResults).reduce((sum, cat) => sum + cat.failed, 0);
        const totalTests = totalPassed + totalFailed;
        
        console.log('\\n📊 VALIDATION SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${totalPassed} (${((totalPassed/totalTests)*100).toFixed(1)}%)`);
        console.log(`Failed: ${totalFailed} (${((totalFailed/totalTests)*100).toFixed(1)}%)`);
        
        console.log('\\n📋 CATEGORY BREAKDOWN');
        console.log('-'.repeat(50));
        
        for (const [category, results] of Object.entries(this.validationResults)) {
            const total = results.passed + results.failed;
            const percentage = total > 0 ? ((results.passed / total) * 100).toFixed(1) : '0.0';
            
            console.log(`${category.toUpperCase()}: ${results.passed}/${total} (${percentage}%)`);
            
            // Show failed tests
            const failedTests = results.tests.filter(test => !test.passed);
            if (failedTests.length > 0) {
                failedTests.forEach(test => {
                    console.log(`  ❌ ${test.name}: ${test.errorMessage}`);
                });
            }
        }
        
        if (totalFailed === 0) {
            console.log('\\n🎉 ALL VALIDATIONS PASSED! BibliaApp Pro Enhanced is ready for deployment.');
        } else {
            console.log(`\\n⚠️ ${totalFailed} validation(s) failed. Please review and fix before deployment.`);
        }
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new BibliaAppValidator();
    validator.validate().catch(console.error);
}

module.exports = BibliaAppValidator;
