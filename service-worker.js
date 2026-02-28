// ===== SERVICE WORKER - BETINA'S Beauty PWA =====
const CACHE_NAME = 'betinas-beauty-v2';
const OFFLINE_URL = './index.html';

// Arquivos essenciais para funcionar offline
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './supabase.js',
    './manifest.json',
    './Favicon.ico',
    './Logo - Betina (Icone).png',
    './Logo - Betina (Lateral).png'
];

// URLs externas para cachear (fontes, ícones, SDK)
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// ===== INSTALL: Cachear arquivos essenciais =====
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 Cacheando arquivos essenciais...');
            // Cachear arquivos locais
            const localCaching = cache.addAll(PRECACHE_ASSETS);
            
            // Cachear externos (não bloqueia instalação se falhar)
            EXTERNAL_ASSETS.forEach(url => {
                fetch(url, { mode: 'cors' })
                    .then(response => {
                        if (response.ok) {
                            cache.put(url, response);
                        }
                    })
                    .catch(() => console.log('⚠️ Não foi possível cachear:', url));
            });
            
            return localCaching;
        }).then(() => {
            console.log('✅ Service Worker: Instalado!');
            return self.skipWaiting(); // Ativar imediatamente
        })
    );
});

// ===== ACTIVATE: Limpar caches antigos =====
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Ativando...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Ativado!');
            return self.clients.claim(); // Controlar todas as páginas
        })
    );
});

// ===== FETCH: Estratégia Network First com fallback para Cache =====
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar requests que não são GET
    if (request.method !== 'GET') return;
    
    // Ignorar requests para o Supabase (API calls devem ir direto para a rede)
    if (url.hostname.includes('supabase.co')) return;
    
    // Para navegação (páginas HTML): Network First
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Salvar no cache
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Offline: retornar do cache
                    return caches.match(OFFLINE_URL);
                })
        );
        return;
    }
    
    // Para arquivos locais (CSS, JS, imagens): Network First com fallback para Cache
    if (url.origin === self.location.origin) {
        event.respondWith(
            fetch(request).then((networkResponse) => {
                // Atualizar cache com a versão mais recente
                if (networkResponse.ok) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Rede falhou, usar cache como fallback
                return caches.match(request);
            })
        );
        return;
    }
    
    // Para recursos externos (CDN, fontes): Cache First
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            
            return fetch(request).then((response) => {
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            }).catch(() => {
                // Recurso externo offline sem cache
                return new Response('', { status: 408, statusText: 'Offline' });
            });
        })
    );
});

// ===== PUSH NOTIFICATIONS (futuro) =====
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    
    const options = {
        body: data.body || 'Você tem uma nova notificação',
        icon: './Logo - Betina (Icone).png',
        badge: './Favicon.ico',
        vibrate: [100, 50, 100],
        data: { url: data.url || './' },
        actions: [
            { action: 'open', title: 'Abrir' },
            { action: 'close', title: 'Fechar' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(
            data.title || "BETINA'S Beauty",
            options
        )
    );
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'close') return;
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // Se já tem uma janela aberta, focar nela
                for (const client of windowClients) {
                    if (client.url.includes('index.html') && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Senão, abrir nova
                return clients.openWindow(event.notification.data.url || './');
            })
    );
});

// ===== BACKGROUND SYNC (para salvar dados quando voltar online) =====
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        console.log('🔄 Background sync: sincronizando dados...');
        // A sync real é feita pelo supabase.js no app
    }
});

console.log('📱 Service Worker carregado - BETINA\'S Beauty PWA');
