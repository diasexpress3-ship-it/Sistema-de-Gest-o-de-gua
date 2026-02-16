// Configurações fornecidas pelo utilizador
export const firebaseConfig = {
  apiKey: "AIzaSyDqN7J0A7ebBpUhSo5EyVwb5ZmZ2HaTezU",
  authDomain: "diasexpress-4073f.firebaseapp.com",
  projectId: "diasexpress-4073f",
  storageBucket: "diasexpress-4073f.firebasestorage.app",
  messagingSenderId: "174659717968",
  appId: "1:174659717968:web:8a682df7fa62f109d6fa55"
};

// Endpoint REST do Firebase Realtime Database para sincronização cross-device
const SYNC_URL = `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com/agua_mali_sync.json`;

/**
 * Serviço de Base de Dados com Sincronização em Nuvem (Cross-Device)
 * Resolve o problema de dados criados no telemóvel não aparecerem no portátil.
 */
export const db = {
  /**
   * Obtém dados locais (rápido) e tenta sincronizar com a nuvem
   */: JSON.stringify({
          houses: JSON.parse(localStorage.getItem('db_houses') || '[]'),
          users: JSON.parse(localStorage.getItem('db_users') || '[]'),
          readings: JSON.parse(localStorage.getItem('db_readings') || '[]'),
          updatedAt: Date.now()
        })
      });
    } catch (error) {
      console.warn("Falha na sincronização cloud:", error);
    }
  },

  /**
   * Puxa os dados mais recentes da nuvem para o dispositivo atual
   */
  sync: async () => {
    try {
      const response = await fetch(SYNC_URL);
      const cloudData = await response.json();
      
      if (cloudData) {
        // Atualiza o armazenamento local com os dados da nuvem
        if (cloudData.houses) localStorage.setItem('db_houses', JSON.stringify(cloudData.houses));
        if (cloudData.users) localStorage.setItem('db_users', JSON.stringify(cloudData.users));
        if (cloudData.readings) localStorage.setItem('db_readings', JSON.stringify(cloudData.readings));
        
        // Dispara evento para notificar componentes ativos
        window.dispatchEvent(new Event('sync-complete'));
        return true;
      }
    } catch (error) {
      console.error("Erro ao sincronizar dispositivos:", error);
    }
    return false;
  }
};
  get: async (collection: string) => {
    return JSON.parse(localStorage.getItem(`db_${collection}`) || '[]');
  },

  /**
   * Grava dados localmente e faz o push imediato para a nuvem
   */
  save: async (collection: string, data: any) => {
    // 1. Gravação Local
    const items = JSON.parse(localStorage.getItem(`db_${collection}`) || '[]');
    // Verifica se é uma atualização de array ou um item único
    const updatedItems = Array.isArray(data) ? data : [...items, data];
    localStorage.setItem(`db_${collection}`, JSON.stringify(updatedItems));

    // 2. Sincronização Cross-Device (Push para Nuvem)
    try {
      await fetch(SYNC_URL, {
        method: 'PUT', // Substitui o estado global na nuvem
        body
