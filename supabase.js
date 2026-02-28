// ===== SUPABASE CONFIGURATION =====
// Integração com Supabase para salvar dados na nuvem

const SUPABASE_URL = 'https://cmbvocapvhugtcmdjemm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3EPPsiGbF2oP53PaBBB1_A_2-jTrlQV';

// Inicializar cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Status de conexão
let supabaseConnected = false;
let syncInProgress = false;
let syncQueue = null; // Debounce timer

// ===== VERIFICAR CONEXÃO =====
async function checkSupabaseConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('user_data')
            .select('id')
            .eq('id', 'main')
            .single();

        if (error) throw error;
        
        supabaseConnected = true;
        updateSyncStatus('online');
        console.log('✅ Supabase conectado com sucesso!');
        return true;
    } catch (err) {
        supabaseConnected = false;
        updateSyncStatus('offline');
        console.warn('⚠️ Supabase offline - usando localStorage:', err.message);
        return false;
    }
}

// ===== CARREGAR DADOS DO SUPABASE =====
async function loadFromSupabase() {
    try {
        const { data: record, error } = await supabaseClient
            .from('user_data')
            .select('*')
            .eq('id', 'main')
            .single();

        if (error) throw error;

        // Se tem dados no Supabase, usar eles
        if (record && record.app_data && Object.keys(record.app_data).length > 0) {
            console.log('☁️ Dados carregados do Supabase');
            return {
                data: record.app_data,
                settings: record.app_settings || {}
            };
        }

        return null; // Sem dados no Supabase
    } catch (err) {
        console.warn('⚠️ Erro ao carregar do Supabase:', err.message);
        return null;
    }
}

// ===== SALVAR DADOS NO SUPABASE =====
async function saveToSupabase(appData, appSettings) {
    if (!supabaseConnected || syncInProgress) return;

    syncInProgress = true;
    updateSyncStatus('syncing');

    try {
        const { error } = await supabaseClient
            .from('user_data')
            .upsert({
                id: 'main',
                app_data: appData,
                app_settings: appSettings,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        updateSyncStatus('online');
        console.log('☁️ Dados sincronizados com Supabase');
    } catch (err) {
        updateSyncStatus('error');
        console.warn('⚠️ Erro ao sincronizar:', err.message);
    } finally {
        syncInProgress = false;
    }
}

// ===== SYNC COM DEBOUNCE (evita muitas chamadas) =====
let lastSyncData = null;
let lastSyncSettings = null;

function queueSupabaseSync(appData, appSettings) {
    lastSyncData = appData;
    lastSyncSettings = appSettings;
    
    if (syncQueue) clearTimeout(syncQueue);
    
    syncQueue = setTimeout(() => {
        saveToSupabase(appData, appSettings);
        syncQueue = null;
    }, 2000); // Aguarda 2 segundos após a última alteração
}

// Garantir que dados pendentes são salvos antes de fechar a página
window.addEventListener('beforeunload', () => {
    if (syncQueue && lastSyncData) {
        clearTimeout(syncQueue);
        // Usar sendBeacon para envio confiável durante fechamento
        const payload = JSON.stringify({
            id: 'main',
            app_data: lastSyncData,
            app_settings: lastSyncSettings,
            updated_at: new Date().toISOString()
        });
        const url = `${SUPABASE_URL}/rest/v1/user_data?id=eq.main`;
        navigator.sendBeacon && navigator.sendBeacon(
            url,
            new Blob([payload], { type: 'application/json' })
        );
    }
});

// ===== UPLOAD DE PRIMEIRA VEZ =====
// Envia dados do localStorage para o Supabase (migração inicial)
async function uploadLocalDataToSupabase() {
    const savedData = localStorage.getItem('nailStudioData');
    const savedSettings = localStorage.getItem('nailStudioSettings');

    if (savedData) {
        const appData = JSON.parse(savedData);
        const appSettings = savedSettings ? JSON.parse(savedSettings) : {};

        try {
            await saveToSupabase(appData, appSettings);
            console.log('📤 Dados locais enviados para o Supabase!');
            showToast('✅ Dados migrados para a nuvem!');
        } catch (err) {
            console.warn('⚠️ Erro na migração:', err.message);
        }
    }
}

// ===== INDICADOR DE STATUS DO SYNC =====
function updateSyncStatus(status) {
    let indicator = document.getElementById('syncIndicator');
    
    if (!indicator) {
        // Criar indicador se não existir
        indicator = document.createElement('div');
        indicator.id = 'syncIndicator';
        indicator.className = 'sync-indicator';
        document.body.appendChild(indicator);
    }

    const states = {
        online: { icon: 'fa-cloud', text: 'Sincronizado', class: 'sync-online' },
        offline: { icon: 'fa-cloud-slash', text: 'Offline (local)', class: 'sync-offline' },
        syncing: { icon: 'fa-sync fa-spin', text: 'Sincronizando...', class: 'sync-syncing' },
        error: { icon: 'fa-exclamation-triangle', text: 'Erro no sync', class: 'sync-error' }
    };

    const state = states[status] || states.offline;
    indicator.className = `sync-indicator ${state.class}`;
    indicator.innerHTML = `<i class="fas ${state.icon}"></i> <span>${state.text}</span>`;

    // Auto-esconder após 3 segundos (exceto offline e error)
    if (status === 'online' || status === 'syncing') {
        setTimeout(() => {
            indicator.classList.add('sync-hidden');
        }, 3000);
    } else {
        indicator.classList.remove('sync-hidden');
    }
}

// ===== ESCUTAR MUDANÇAS EM TEMPO REAL (sync entre dispositivos) =====
function enableRealtimeSync() {
    if (!supabaseConnected) return;

    supabaseClient
        .channel('user_data_changes')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_data',
            filter: 'id=eq.main'
        }, (payload) => {
            console.log('🔄 Atualização recebida de outro dispositivo');
            
            // Só atualizar se não estamos salvando
            if (!syncInProgress) {
                const newData = payload.new;
                if (newData.app_data) {
                    // Atualizar dados locais
                    data = newData.app_data;
                    if (!data.notifications) data.notifications = [];
                    localStorage.setItem('nailStudioData', JSON.stringify(data));
                }
                if (newData.app_settings) {
                    settings = newData.app_settings;
                    localStorage.setItem('nailStudioSettings', JSON.stringify(settings));
                    applySettings();
                }
                updateAllViews();
                showToast('🔄 Dados atualizados de outro dispositivo!');
            }
        })
        .subscribe();

    console.log('📡 Realtime sync ativado');
}

console.log('🔧 Supabase configurado - URL:', SUPABASE_URL);
