/**
 * BibliaApp Pro - Service Worker
 * Offline support and caching for maximum functionality
 * Clean, optimized implementation
 * Version: 2.0.0
 */

const CACHE_VERSION = 'v2.0.0';
const CACHE_PREFIX = 'bibliaapp-pro';
const STATIC_CACHE = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;
const BIBLE_CACHE = `${CACHE_PREFIX}-bible-${CACHE_VERSION}`;

// Files to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/js/core/app.js',
    '/assets/js/core/ui-manager.js',
    '/assets/js/data/bible-data.js',
    '/assets/js/main.js',
    '/offline.html',
    // Tailwind CSS is loaded from CDN, but we'll cache a fallback
    'https://cdn.tailwindcss.com',
    // Google Fonts
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
                    mode: 'cors',
                    credentials: 'omit'
                })));
            })
            .then(() => {
                console.log('✅ Static assets cached successfully');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('❌ Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches
                        if (cacheName.startsWith(CACHE_PREFIX) && 
                            cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== BIBLE_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests (except fonts and CDN)
    if (url.origin !== location.origin && 
        !url.hostname.includes('fonts.googleapis.com') &&
        !url.hostname.includes('fonts.gstatic.com') &&
        !url.hostname.includes('cdn.tailwindcss.com')) {
        return;
    }
    
    event.respondWith(
        handleFetchRequest(request)
    );
});

/**
 * Handle fetch requests with intelligent caching strategy
 */
async function handleFetchRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Static assets - Cache First
        if (isStaticAsset(request)) {
            return await cacheFirst(request, STATIC_CACHE);
        }
        
        // Strategy 2: Bible data - Cache First with update
        if (isBibleData(request)) {
            return await cacheFirst(request, BIBLE_CACHE);
        }
        
        // Strategy 3: HTML pages - Network First with cache fallback
        if (isHTMLRequest(request)) {
            return await networkFirst(request, DYNAMIC_CACHE);
        }
        
        // Strategy 4: External resources (fonts, CDN) - Stale While Revalidate
        if (isExternalResource(request)) {
            return await staleWhileRevalidate(request, DYNAMIC_CACHE);
        }
        
        // Default: Network First
        return await networkFirst(request, DYNAMIC_CACHE);
        
    } catch (error) {
        console.error('❌ Fetch error:', error);
        return await getOfflineFallback(request);
    }
}

/**
 * Cache First strategy - check cache first, then network
 */
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        // Found in cache, return it
        return cachedResponse;
    }
    
    // Not in cache, fetch from network
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            // Cache the response for next time
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, return offline fallback
        return getOfflineFallback(request);
    }
}

/**
 * Network First strategy - try network first, fallback to cache
 */
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            // Update cache with fresh response
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // No cache either, return offline fallback
        return getOfflineFallback(request);
    }
}

/**
 * Stale While Revalidate strategy - return cached version immediately,
 * update cache in background
 */
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Fetch from network in background
    const networkResponsePromise = fetch(request)
        .then((response) => {
            if (response.status === 200) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => {
            // Network failed, that's okay for this strategy
        });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // No cached version, wait for network
    try {
        return await networkResponsePromise;
    } catch (error) {
        return getOfflineFallback(request);
    }
}

/**
 * Get offline fallback response
 */
async function getOfflineFallback(request) {
    const url = new URL(request.url);
    
    // For HTML requests, serve offline page
    if (isHTMLRequest(request)) {
        const cache = await caches.open(STATIC_CACHE);
        const offlinePage = await cache.match('/offline.html');
        
        if (offlinePage) {
            return offlinePage;
        }
    }
    
    // For other requests, return a generic offline response
    return new Response(
        JSON.stringify({
            error: 'Offline',
            message: 'This content is not available offline'
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }
    );
}

/**
 * Utility functions to determine request types
 */
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/assets/') || 
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.jpg') ||
           url.pathname.endsWith('.jpeg') ||
           url.pathname.endsWith('.gif') ||
           url.pathname.endsWith('.svg') ||
           url.pathname.endsWith('.ico');
}

function isBibleData(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/bible-data') ||
           url.pathname.includes('/api/bible') ||
           url.searchParams.has('bible');
}

function isHTMLRequest(request) {
    const acceptHeader = request.headers.get('accept');
    return acceptHeader && acceptHeader.includes('text/html');
}

function isExternalResource(request) {
    const url = new URL(request.url);
    return url.hostname.includes('fonts.googleapis.com') ||
           url.hostname.includes('fonts.gstatic.com') ||
           url.hostname.includes('cdn.tailwindcss.com');
}

// Background sync for data updates
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync:', event.tag);
    
    if (event.tag === 'bible-data-sync') {
        event.waitUntil(syncBibleData());
    } else if (event.tag === 'user-data-sync') {
        event.waitUntil(syncUserData());
    }
});

/**
 * Sync Bible data in background
 */
async function syncBibleData() {
    try {
        console.log('📖 Syncing Bible data...');
        
        // Check for Bible data updates
        const response = await fetch('/api/bible/version');
        if (response.ok) {
            const versionInfo = await response.json();
            
            // Compare with cached version
            const cache = await caches.open(BIBLE_CACHE);
            const cachedVersion = await cache.match('/api/bible/version');
            
            if (!cachedVersion || needsUpdate(cachedVersion, versionInfo)) {
                // Update Bible data cache
                await updateBibleDataCache();
            }
        }
        
        console.log('✅ Bible data sync completed');
    } catch (error) {
        console.error('❌ Bible data sync failed:', error);
    }
}

/**
 * Sync user data in background
 */
async function syncUserData() {
    try {
        console.log('👤 Syncing user data...');
        
        // Get user data from IndexedDB or localStorage
        const userData = await getUserDataForSync();
        
        if (userData) {
            const response = await fetch('/api/user/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (response.ok) {
                // Mark data as synced
                await markDataAsSynced();
            }
        }
        
        console.log('✅ User data sync completed');
    } catch (error) {
        console.error('❌ User data sync failed:', error);
    }
}

/**
 * Update Bible data cache
 */
async function updateBibleDataCache() {
    const cache = await caches.open(BIBLE_CACHE);
    
    const bibleEndpoints = [
        '/api/bible/books',
        '/api/bible/verses',
        '/api/bible/cross-references',
        '/api/bible/study-notes'
    ];
    
    for (const endpoint of bibleEndpoints) {
        try {
            const response = await fetch(endpoint);
            if (response.ok) {
                await cache.put(endpoint, response);
            }
        } catch (error) {
            console.error(`Failed to update ${endpoint}:`, error);
        }
    }
}

/**
 * Get user data for sync (placeholder)
 */
async function getUserDataForSync() {
    // This would typically get data from IndexedDB
    // For now, return null as we're using localStorage
    return null;
}

/**
 * Mark data as synced (placeholder)
 */
async function markDataAsSynced() {
    // Update sync status in storage
    console.log('Data marked as synced');
}

/**
 * Check if data needs update (placeholder)
 */
function needsUpdate(cachedResponse, newVersionInfo) {
    // Compare versions and determine if update is needed
    return false; // Placeholder
}

// Push notification handler
self.addEventListener('push', (event) => {
    console.log('📱 Push notification received');
    
    if (!event.data) {
        return;
    }
    
    const data = event.data.json();
    
    const options = {
        body: data.body || 'Nueva actualización disponible',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/badge-72x72.png',
        tag: data.tag || 'bible-app-notification',
        data: data.data || {},
        actions: [
            {
                action: 'open',
                title: 'Abrir',
                icon: '/assets/images/action-open.png'
            },
            {
                action: 'dismiss',
                title: 'Cerrar',
                icon: '/assets/images/action-close.png'
            }
        ],
        vibrate: [200, 100, 200],
        requireInteraction: true
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'BibliaApp Pro', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('📱 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        // Open the app
        event.waitUntil(
            self.clients.matchAll({ type: 'window' })
                .then((clients) => {
                    // Check if app is already open
                    for (const client of clients) {
                        if (client.url.includes(self.registration.scope) && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    
                    // Open new window
                    if (self.clients.openWindow) {
                        return self.clients.openWindow('/');
                    }
                })
        );
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('🚨 Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Service Worker unhandled rejection:', event.reason);
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('⏰ Periodic sync:', event.tag);
    
    if (event.tag === 'daily-bible-update') {
        event.waitUntil(syncDailyContent());
    }
});

/**
 * Sync daily content
 */
async function syncDailyContent() {
    try {
        console.log('📅 Syncing daily content...');
        
        // Fetch daily verse, devotional, etc.
        const dailyEndpoints = [
            '/api/daily/verse',
            '/api/daily/devotional',
            '/api/daily/plan'
        ];
        
        const cache = await caches.open(DYNAMIC_CACHE);
        
        for (const endpoint of dailyEndpoints) {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    await cache.put(endpoint, response);
                }
            } catch (error) {
                console.error(`Failed to sync ${endpoint}:`, error);
            }
        }
        
        console.log('✅ Daily content sync completed');
    } catch (error) {
        console.error('❌ Daily content sync failed:', error);
    }
}

console.log('🙏 BibliaApp Pro Service Worker loaded successfully');