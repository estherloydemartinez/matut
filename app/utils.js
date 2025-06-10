/* ==========================================================================
   BIBLIAAPP PRO v3.0 - UTILITIES
   Essential utility functions - Clean, functional, no garbage
   ========================================================================== */

import { APP_CONFIG, PERFORMANCE_CONFIG } from './constants.js';

// ==========================================
// DOM UTILITIES
// ==========================================

/**
 * Enhanced querySelector with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (optional)
 * @returns {Element|null}
 */
export const $ = (selector, context = document) => {
    try {
        return context.querySelector(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return null;
    }
};

/**
 * Enhanced querySelectorAll with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (optional)
 * @returns {NodeList}
 */
export const $$ = (selector, context = document) => {
    try {
        return context.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return [];
    }
};

/**
 * Create element with attributes and content
 * @param {string} tag - HTML tag
 * @param {Object} attributes - Element attributes
 * @param {string|Element} content - Element content
 * @returns {Element}
 */
export const createElement = (tag, attributes = {}, content = '') => {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Set content
    if (typeof content === 'string') {
        element.innerHTML = content;
    } else if (content instanceof Element) {
        element.appendChild(content);
    } else if (Array.isArray(content)) {
        content.forEach(item => {
            if (typeof item === 'string') {
                element.appendChild(document.createTextNode(item));
            } else if (item instanceof Element) {
                element.appendChild(item);
            }
        });
    }
    
    return element;
};

/**
 * Add multiple event listeners to an element
 * @param {Element} element - Target element
 * @param {Object} events - Events object {event: handler}
 */
export const addEventListeners = (element, events) => {
    Object.entries(events).forEach(([event, handler]) => {
        element.addEventListener(event, handler);
    });
};

/**
 * Remove multiple event listeners from an element
 * @param {Element} element - Target element
 * @param {Object} events - Events object {event: handler}
 */
export const removeEventListeners = (element, events) => {
    Object.entries(events).forEach(([event, handler]) => {
        element.removeEventListener(event, handler);
    });
};

/**
 * Check if element is in viewport
 * @param {Element} element - Target element
 * @param {number} threshold - Intersection threshold (0-1)
 * @returns {boolean}
 */
export const isInViewport = (element, threshold = 0) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const verticalVisible = rect.top <= windowHeight * (1 - threshold) && 
                           rect.bottom >= windowHeight * threshold;
    const horizontalVisible = rect.left <= windowWidth * (1 - threshold) && 
                             rect.right >= windowWidth * threshold;
    
    return verticalVisible && horizontalVisible;
};

// ==========================================
// STRING UTILITIES
// ==========================================

/**
 * Capitalize first letter of string
 * @param {string} str - Input string
 * @returns {string}
 */
export const capitalize = (str) => {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param {string} str - Input string
 * @returns {string}
 */
export const titleCase = (str) => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().split(' ').map(capitalize).join(' ');
};

/**
 * Convert string to kebab-case
 * @param {string} str - Input string
 * @returns {string}
 */
export const kebabCase = (str) => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
};

/**
 * Convert string to camelCase
 * @param {string} str - Input string
 * @returns {string}
 */
export const camelCase = (str) => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/[\s-_]+/g, '');
};

/**
 * Truncate string with ellipsis
 * @param {string} str - Input string
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix for truncated string
 * @returns {string}
 */
export const truncate = (str, length = 100, suffix = '...') => {
    if (typeof str !== 'string') return '';
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Remove HTML tags from string
 * @param {string} str - Input string with HTML
 * @returns {string}
 */
export const stripHtml = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '');
};

/**
 * Escape HTML special characters
 * @param {string} str - Input string
 * @returns {string}
 */
export const escapeHtml = (str) => {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

/**
 * Calculate string similarity using Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity percentage (0-1)
 */
export const stringSimilarity = (str1, str2) => {
    if (str1 === str2) return 1;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
};

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
export const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
};

// ==========================================
// NUMBER AND DATE UTILITIES
// ==========================================

/**
 * Format number with thousand separators
 * @param {number} num - Input number
 * @param {string} separator - Thousand separator
 * @returns {string}
 */
export const formatNumber = (num, separator = ',') => {
    if (typeof num !== 'number') return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

/**
 * Format bytes to human readable string
 * @param {number} bytes - Bytes count
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format duration in milliseconds to human readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string}
 */
export const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
};

/**
 * Format date relative to now (e.g., "2 days ago")
 * @param {Date|string|number} date - Input date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = now - targetDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) return 'hace un momento';
    if (diffMinutes < 60) return `hace ${diffMinutes} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    if (diffDays < 7) return `hace ${diffDays} d`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} sem`;
    if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} mes`;
    return `hace ${Math.floor(diffDays / 365)} año`;
};

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ==========================================
// ARRAY AND OBJECT UTILITIES
// ==========================================

/**
 * Deep clone an object or array
 * @param {any} obj - Object to clone
 * @returns {any}
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        Object.keys(obj).forEach(key => {
            clonedObj[key] = deepClone(obj[key]);
        });
        return clonedObj;
    }
    return obj;
};

/**
 * Deep merge multiple objects
 * @param {...Object} objects - Objects to merge
 * @returns {Object}
 */
export const deepMerge = (...objects) => {
    const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);
    
    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            if (isObject(prev[key]) && isObject(obj[key])) {
                prev[key] = deepMerge(prev[key], obj[key]);
            } else {
                prev[key] = obj[key];
            }
        });
        return prev;
    }, {});
};

/**
 * Check if two objects are deeply equal
 * @param {any} obj1 - First object
 * @param {any} obj2 - Second object
 * @returns {boolean}
 */
export const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    
    if (obj1 == null || obj2 == null) return false;
    
    if (typeof obj1 !== typeof obj2) return false;
    
    if (typeof obj1 !== 'object') return obj1 === obj2;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (let key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!deepEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
};

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array}
 */
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Group array elements by a property or function
 * @param {Array} array - Array to group
 * @param {string|function} key - Property name or function
 * @returns {Object}
 */
export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = typeof key === 'function' ? key(item) : item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
};

/**
 * Remove duplicates from array
 * @param {Array} array - Input array
 * @param {string|function} key - Property or function for comparison
 * @returns {Array}
 */
export const uniqueArray = (array, key = null) => {
    if (!key) return [...new Set(array)];
    
    const seen = new Set();
    return array.filter(item => {
        const k = typeof key === 'function' ? key(item) : item[key];
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
};

// ==========================================
// PERFORMANCE UTILITIES
// ==========================================

/**
 * Debounce function execution
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {function}
 */
export const debounce = (func, wait = APP_CONFIG.debounceDelay, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
};

/**
 * Throttle function execution
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function}
 */
export const throttle = (func, limit = 100) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Memoize function results
 * @param {function} func - Function to memoize
 * @param {function} keyGenerator - Function to generate cache key
 * @returns {function}
 */
export const memoize = (func, keyGenerator = (...args) => JSON.stringify(args)) => {
    const cache = new Map();
    
    return function memoized(...args) {
        const key = keyGenerator(...args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = func.apply(this, args);
        cache.set(key, result);
        
        // Prevent memory leaks by limiting cache size
        if (cache.size > PERFORMANCE_CONFIG.cache.maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        return result;
    };
};

/**
 * Create cancelable promise
 * @param {function} executor - Promise executor function
 * @returns {Object} Object with promise and cancel function
 */
export const cancelablePromise = (executor) => {
    let isCanceled = false;
    
    const promise = new Promise((resolve, reject) => {
        executor(
            (value) => {
                if (!isCanceled) resolve(value);
            },
            (reason) => {
                if (!isCanceled) reject(reason);
            }
        );
    });
    
    return {
        promise,
        cancel: () => {
            isCanceled = true;
        }
    };
};

// ==========================================
// BROWSER AND FEATURE DETECTION
// ==========================================

/**
 * Detect if device is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= APP_CONFIG.mobileBreakpoint;
};

/**
 * Detect if device is tablet
 * @returns {boolean}
 */
export const isTablet = () => {
    return window.innerWidth > APP_CONFIG.mobileBreakpoint && 
           window.innerWidth <= APP_CONFIG.tabletBreakpoint;
};

/**
 * Detect if browser supports a feature
 * @param {string} feature - Feature to detect
 * @returns {boolean}
 */
export const supportsFeature = (feature) => {
    const features = {
        localStorage: () => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        },
        serviceWorker: () => 'serviceWorker' in navigator,
        webWorker: () => typeof Worker !== 'undefined',
        webGL: () => {
            try {
                const canvas = document.createElement('canvas');
                return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            } catch (e) {
                return false;
            }
        },
        webAssembly: () => typeof WebAssembly === 'object',
        intersectionObserver: () => 'IntersectionObserver' in window,
        resizeObserver: () => 'ResizeObserver' in window,
        geolocation: () => 'geolocation' in navigator,
        webShare: () => 'share' in navigator,
        webNotifications: () => 'Notification' in window,
        dragAndDrop: () => 'draggable' in document.createElement('div'),
        touchEvents: () => 'ontouchstart' in window
    };
    
    return features[feature] ? features[feature]() : false;
};

/**
 * Get device pixel ratio
 * @returns {number}
 */
export const getDevicePixelRatio = () => {
    return window.devicePixelRatio || 1;
};

/**
 * Get viewport dimensions
 * @returns {Object}
 */
export const getViewportSize = () => {
    return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };
};

// ==========================================
// VALIDATION UTILITIES
// ==========================================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate Bible reference (e.g., "Juan 3:16", "Génesis 1:1-3")
 * @param {string} reference - Bible reference to validate
 * @returns {boolean}
 */
export const isValidBibleReference = (reference) => {
    const bibleRefRegex = /^[1-3]?\s*[A-Za-zÀ-ÿ]+\s+\d+:\d+(-\d+)?$/;
    return bibleRefRegex.test(reference.trim());
};

// ==========================================
// ERROR HANDLING UTILITIES
// ==========================================

/**
 * Safe function execution with error handling
 * @param {function} func - Function to execute
 * @param {any} fallback - Fallback value on error
 * @param {...any} args - Function arguments
 * @returns {any}
 */
export const safeExecute = (func, fallback = null, ...args) => {
    try {
        return func(...args);
    } catch (error) {
        console.warn('Safe execution failed:', error);
        return fallback;
    }
};

/**
 * Create retry function
 * @param {function} func - Function to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} delay - Delay between retries
 * @returns {function}
 */
export const createRetryFunction = (func, maxAttempts = 3, delay = 1000) => {
    return async (...args) => {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await func(...args);
            } catch (error) {
                lastError = error;
                
                if (attempt === maxAttempts) {
                    throw lastError;
                }
                
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
    };
};

// ==========================================
// ANIMATION UTILITIES
// ==========================================

/**
 * Smooth scroll to element
 * @param {Element|string} target - Target element or selector
 * @param {Object} options - Scroll options
 */
export const smoothScrollTo = (target, options = {}) => {
    const element = typeof target === 'string' ? $(target) : target;
    if (!element) return;
    
    const {
        offset = 0,
        duration = 500,
        easing = 'easeInOutQuad'
    } = options;
    
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    const easingFunctions = {
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    };
    
    const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easingFunctions[easing](progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    };
    
    requestAnimationFrame(animation);
};

/**
 * Animate CSS property
 * @param {Element} element - Target element
 * @param {Object} properties - CSS properties to animate
 * @param {number} duration - Animation duration
 * @param {string} easing - Easing function
 * @returns {Promise}
 */
export const animateCSS = (element, properties, duration = 300, easing = 'ease') => {
    return new Promise((resolve) => {
        const initialValues = {};
        
        // Store initial values
        Object.keys(properties).forEach(prop => {
            initialValues[prop] = getComputedStyle(element)[prop];
        });
        
        // Set transition
        element.style.transition = `all ${duration}ms ${easing}`;
        
        // Apply target properties
        Object.entries(properties).forEach(([prop, value]) => {
            element.style[prop] = value;
        });
        
        // Clean up after animation
        setTimeout(() => {
            element.style.transition = '';
            resolve();
        }, duration);
    });
};

// ==========================================
// STORAGE UTILITIES
// ==========================================

/**
 * Set item in localStorage with expiration
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {number} expiration - Expiration time in milliseconds
 */
export const setStorageWithExpiry = (key, value, expiration = null) => {
    const item = {
        value,
        timestamp: Date.now(),
        expiration: expiration ? Date.now() + expiration : null
    };
    
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.warn('Failed to store item:', error);
    }
};

/**
 * Get item from localStorage with expiration check
 * @param {string} key - Storage key
 * @returns {any|null}
 */
export const getStorageWithExpiry = (key) => {
    try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        
        // Check expiration
        if (item.expiration && Date.now() > item.expiration) {
            localStorage.removeItem(key);
            return null;
        }
        
        return item.value;
    } catch (error) {
        console.warn('Failed to retrieve item:', error);
        return null;
    }
};

// ==========================================
// EXPORT ALL UTILITIES
// ==========================================

export default {
    // DOM utilities
    $, $$, createElement, addEventListeners, removeEventListeners, isInViewport,
    
    // String utilities
    capitalize, titleCase, kebabCase, camelCase, truncate, stripHtml, escapeHtml,
    stringSimilarity, levenshteinDistance,
    
    // Number and date utilities
    formatNumber, formatBytes, formatDuration, formatRelativeTime, randomBetween,
    
    // Array and object utilities
    deepClone, deepMerge, deepEqual, shuffleArray, groupBy, uniqueArray,
    
    // Performance utilities
    debounce, throttle, memoize, cancelablePromise,
    
    // Browser detection
    isMobile, isTablet, supportsFeature, getDevicePixelRatio, getViewportSize,
    
    // Validation
    isValidEmail, isValidUrl, isValidBibleReference,
    
    // Error handling
    safeExecute, createRetryFunction,
    
    // Animation
    smoothScrollTo, animateCSS,
    
    // Storage
    setStorageWithExpiry, getStorageWithExpiry
};