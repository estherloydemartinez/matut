#!/usr/bin/env node

/**
 * BibliaApp Pro Enhanced - Deployment Script
 * Automated deployment with optimization and validation
 */

const fs = require('fs').promises;
const path = require('path');

class BibliaAppDeployer {
    constructor() {
        this.config = {
            sourceDir: '.',
            buildDir: './dist',
            assetsDir: './assets',
            version: '3.0.0',
            compressionEnabled: true,
            minificationEnabled: true,
            validationEnabled: true
        };
        
        this.deploymentSteps = [
            'validateEnvironment',
            'createBuildDirectory', 
            'copyStaticFiles',
            'optimizeAssets',
            'generateServiceWorker',
            'createManifest',
            'validateBuild',
            'generateDeploymentReport'
        ];
    }
    
    async deploy() {
        console.log('🚀 Starting BibliaApp Pro Enhanced deployment...\n');
        
        const startTime = Date.now();
        
        try {
            for (const step of this.deploymentSteps) {
                console.log(`📋 Executing: ${step}`);
                await this[step]();
                console.log(`✅ Completed: ${step}\n`);
            }
            
            const deploymentTime = Date.now() - startTime;
            console.log(`🎉 Deployment completed successfully in ${deploymentTime}ms`);
            
        } catch (error) {
            console.error('❌ Deployment failed:', error);
            process.exit(1);
        }
    }
    
    async validateEnvironment() {
        const requiredFiles = [
            'index.html',
            'manifest.json', 
            'sw.js',
            'assets/js/app-enhanced.js',
            'assets/css/core.css'
        ];
        
        for (const file of requiredFiles) {
            try {
                await fs.access(file);
                console.log(`  ✓ Found: ${file}`);
            } catch (error) {
                throw new Error(`Required file missing: ${file}`);
            }
        }
        
        console.log('  📁 All required files present');
    }
    
    async createBuildDirectory() {
        try {
            await fs.rm(this.config.buildDir, { recursive: true, force: true });
        } catch (error) {
            // Directory might not exist, which is fine
        }
        
        await fs.mkdir(this.config.buildDir, { recursive: true });
        console.log(`  📁 Created build directory: ${this.config.buildDir}`);
    }
    
    async copyStaticFiles() {
        const filesToCopy = [
            'index.html',
            'manifest.json',
            'sw.js'
        ];
        
        for (const file of filesToCopy) {
            const source = path.join('.', file);
            const destination = path.join(this.config.buildDir, file);
            
            await fs.copyFile(source, destination);
            console.log(`  📄 Copied: ${file}`);
        }
        
        // Copy assets directory recursively
        await this.copyDirectory('./assets', path.join(this.config.buildDir, 'assets'));
        console.log('  📁 Copied assets directory');
    }
    
    async copyDirectory(source, destination) {
        await fs.mkdir(destination, { recursive: true });
        
        const entries = await fs.readdir(source, { withFileTypes: true });
        
        for (const entry of entries) {
            const sourcePath = path.join(source, entry.name);
            const destinationPath = path.join(destination, entry.name);
            
            if (entry.isDirectory()) {
                await this.copyDirectory(sourcePath, destinationPath);
            } else {
                await fs.copyFile(sourcePath, destinationPath);
            }
        }
    }
    
    async optimizeAssets() {
        console.log('  🎯 Starting asset optimization...');
        
        // Optimize CSS files
        await this.optimizeCSS();
        
        // Optimize JavaScript files  
        await this.optimizeJS();
        
        // Generate optimized asset manifest
        await this.generateAssetManifest();
        
        console.log('  ✨ Asset optimization completed');
    }
    
    async optimizeCSS() {
        const cssFiles = await this.findFiles(path.join(this.config.buildDir, 'assets/css'), '.css');
        
        for (const cssFile of cssFiles) {
            const content = await fs.readFile(cssFile, 'utf8');
            
            // Basic CSS optimization (remove comments and excess whitespace)
            const optimized = content
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                .replace(/\s+/g, ' ') // Normalize whitespace
                .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
                .trim();
            
            await fs.writeFile(cssFile, optimized);
            console.log(`    📝 Optimized CSS: ${path.basename(cssFile)}`);
        }
    }
    
    async optimizeJS() {
        const jsFiles = await this.findFiles(path.join(this.config.buildDir, 'assets/js'), '.js');
        
        for (const jsFile of jsFiles) {
            const content = await fs.readFile(jsFile, 'utf8');
            
            // Basic JS optimization (remove excessive whitespace and comments)
            const optimized = content
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
                .replace(/\/\/.*$/gm, '') // Remove line comments
                .replace(/\s+/g, ' ') // Normalize whitespace
                .replace(/;\s*}/g, ';}') // Normalize syntax
                .trim();
            
            await fs.writeFile(jsFile, optimized);
            console.log(`    📝 Optimized JS: ${path.basename(jsFile)}`);
        }
    }
    
    async generateAssetManifest() {
        const assetManifest = {
            version: this.config.version,
            generated: new Date().toISOString(),
            assets: {
                css: await this.findFiles(path.join(this.config.buildDir, 'assets/css'), '.css'),
                js: await this.findFiles(path.join(this.config.buildDir, 'assets/js'), '.js'),
                images: await this.findFiles(path.join(this.config.buildDir, 'assets/images'), ['.png', '.jpg', '.jpeg', '.svg', '.gif'])
            }
        };
        
        const manifestPath = path.join(this.config.buildDir, 'asset-manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(assetManifest, null, 2));
        
        console.log('    📋 Generated asset manifest');
    }
    
    async findFiles(directory, extensions) {
        const files = [];
        
        try {
            const entries = await fs.readdir(directory, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(directory, entry.name);
                
                if (entry.isDirectory()) {
                    const nestedFiles = await this.findFiles(fullPath, extensions);
                    files.push(...nestedFiles);
                } else {
                    const ext = path.extname(entry.name);
                    if (Array.isArray(extensions) ? extensions.includes(ext) : ext === extensions) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            // Directory might not exist
        }
        
        return files;
    }
    
    async generateServiceWorker() {
        const swPath = path.join(this.config.buildDir, 'sw.js');
        let swContent = await fs.readFile(swPath, 'utf8');
        
        // Update cache version
        swContent = swContent.replace(
            /const CACHE_VERSION = '[^']+'/,
            `const CACHE_VERSION = '${this.config.version}'`
        );
        
        // Update cache name
        swContent = swContent.replace(
            /const CACHE_NAME = '[^']+'/,
            `const CACHE_NAME = 'bibliaapp-pro-v${this.config.version}'`
        );
        
        await fs.writeFile(swPath, swContent);
        console.log('  🔧 Updated Service Worker configuration');
    }
    
    async createManifest() {
        const manifestPath = path.join(this.config.buildDir, 'manifest.json');
        const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
        
        // Update version
        manifest.version = this.config.version;
        manifest.buildDate = new Date().toISOString();
        
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
        console.log('  📱 Updated PWA manifest');
    }
    
    async validateBuild() {
        console.log('  🔍 Validating build integrity...');
        
        // Check critical files exist
        const criticalFiles = [
            'index.html',
            'manifest.json',
            'sw.js',
            'assets/js/app-enhanced.js'
        ];
        
        for (const file of criticalFiles) {
            const filePath = path.join(this.config.buildDir, file);
            try {
                const stats = await fs.stat(filePath);
                if (stats.size === 0) {
                    throw new Error(`File is empty: ${file}`);
                }
                console.log(`    ✓ Valid: ${file} (${stats.size} bytes)`);
            } catch (error) {
                throw new Error(`Build validation failed for: ${file}`);
            }
        }
        
        // Validate JSON files
        await this.validateJSON(path.join(this.config.buildDir, 'manifest.json'));
        
        console.log('  ✅ Build validation passed');
    }
    
    async validateJSON(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            JSON.parse(content);
            console.log(`    ✓ Valid JSON: ${path.basename(filePath)}`);
        } catch (error) {
            throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
        }
    }
    
    async generateDeploymentReport() {
        const report = {
            timestamp: new Date().toISOString(),
            version: this.config.version,
            buildDirectory: this.config.buildDir,
            files: await this.getBuildStats(),
            validation: 'passed',
            deploymentSteps: this.deploymentSteps,
            nextSteps: [
                'Test the application in build directory',
                'Upload to web server',
                'Configure HTTPS and domain',
                'Test PWA installation',
                'Monitor performance metrics'
            ]
        };
        
        const reportPath = path.join(this.config.buildDir, 'deployment-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        // Also create a human-readable report
        const readableReport = this.generateReadableReport(report);
        const readableReportPath = path.join(this.config.buildDir, 'DEPLOYMENT.md');
        await fs.writeFile(readableReportPath, readableReport);
        
        console.log('  📊 Generated deployment report');
        console.log('  📄 Created readable deployment guide');
    }
    
    async getBuildStats() {
        const stats = {
            totalFiles: 0,
            totalSize: 0,
            breakdown: {}
        };
        
        const files = await this.findFiles(this.config.buildDir, ['.html', '.js', '.css', '.json', '.png', '.jpg', '.svg']);
        
        for (const file of files) {
            const stat = await fs.stat(file);
            const ext = path.extname(file);
            
            stats.totalFiles++;
            stats.totalSize += stat.size;
            
            if (!stats.breakdown[ext]) {
                stats.breakdown[ext] = { count: 0, size: 0 };
            }
            stats.breakdown[ext].count++;
            stats.breakdown[ext].size += stat.size;
        }
        
        return stats;
    }
    
    generateReadableReport(report) {
        return `# BibliaApp Pro Enhanced - Deployment Report

## Build Information
- **Version**: ${report.version}
- **Build Date**: ${report.timestamp}
- **Build Directory**: ${report.buildDirectory}
- **Validation Status**: ✅ ${report.validation}

## Build Statistics
- **Total Files**: ${report.files.totalFiles}
- **Total Size**: ${(report.files.totalSize / 1024 / 1024).toFixed(2)} MB

### File Breakdown
${Object.entries(report.files.breakdown).map(([ext, data]) => 
    `- **${ext || 'no extension'}**: ${data.count} files, ${(data.size / 1024).toFixed(1)} KB`
).join('\n')}

## Deployment Steps Completed
${report.deploymentSteps.map(step => `✅ ${step}`).join('\n')}

## Next Steps
${report.nextSteps.map(step => `1. ${step}`).join('\n')}

## Quick Start
\`\`\`bash
# Serve the built application
cd ${report.buildDirectory}
python -m http.server 8000

# Or with Node.js
npx serve .

# Open in browser
open http://localhost:8000
\`\`\`

## Production Deployment
1. Upload the entire \`${report.buildDirectory}\` directory to your web server
2. Configure HTTPS (required for PWA features)
3. Set proper MIME types for .js and .json files
4. Configure cache headers for optimal performance
5. Test PWA installation on mobile devices

## Performance Recommendations
- Enable gzip compression on server
- Set cache headers for static assets
- Configure Content Security Policy
- Monitor Core Web Vitals

---
Generated by BibliaApp Pro Enhanced Deployment System v${report.version}
`;
    }
}

// Run deployment if called directly
if (require.main === module) {
    const deployer = new BibliaAppDeployer();
    deployer.deploy().catch(console.error);
}

module.exports = BibliaAppDeployer;
