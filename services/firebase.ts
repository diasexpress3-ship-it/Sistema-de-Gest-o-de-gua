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
   */
  get: async (collection: string) => {
    return JSON.parse(localStorage.getItem(`db_${collection}`) || '[]');
  },

  /**
   * Grava dados localmente e faz o push imediato para a nuvem
   */
  save: async (collection: string, data: any) => {
    try {
      // 1. Gravação Local
      const items = JSON.parse(localStorage.getItem(`db_${collection}`) || '[]');
      
      // Verifica se é uma atualização de array ou um item único
      let updatedItems;
      if (Array.isArray(data)) {
        updatedItems = data; // Se for array, substitui completamente
      } else {
        // Se for um item único, verifica se já existe (atualiza) ou adiciona
        const existingIndex = items.findIndex((item: any) => item.id === data.id);
        if (existingIndex >= 0) {
          items[existingIndex] = { ...items[existingIndex], ...data, updatedAt: Date.now() };
          updatedItems = items;
        } else {
          updatedItems = [...items, { ...data, id: Date.now().toString(), createdAt: Date.now() }];
        }
      }
      
      localStorage.setItem(`db_${collection}`, JSON.stringify(updatedItems));

      // 2. Sincronização Cross-Device (Push para Nuvem)
      try {
        // Buscar dados atuais da nuvem primeiro
        const response = await fetch(SYNC_URL);
        const cloudData = await response.json() || {};
        
        // Atualizar apenas a coleção específica
        const updatedCloudData = {
          ...cloudData,
          [collection]: updatedItems,
          updatedAt: Date.now()
        };
        
        // Enviar para a nuvem
        await fetch(SYNC_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedCloudData)
        });
        
        console.log(`✅ Dados sincronizados: ${collection}`);
      } catch (error) {
        console.warn("Falha na sincronização cloud:", error);
      }
      
      return updatedItems;
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      return null;
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
        if (cloudData.houses) {
          localStorage.setItem('db_houses', JSON.stringify(cloudData.houses));
        }
        if (cloudData.users) {
          localStorage.setItem('db_users', JSON.stringify(cloudData.users));
        }
        if (cloudData.readings) {
          localStorage.setItem('db_readings', JSON.stringify(cloudData.readings));
        }
        if (cloudData.orders) {
          localStorage.setItem('db_orders', JSON.stringify(cloudData.orders));
        }
        
        // Dispara evento para notificar componentes ativos
        window.dispatchEvent(new Event('sync-complete'));
        console.log('✅ Sincronização concluída com sucesso');
        return true;
      }
    } catch (error) {
      console.error("Erro ao sincronizar dispositivos:", error);
    }
    return false;
  },

  /**
   * Remove dados do armazenamento local e da nuvem
   */
  remove: async (collection: string, id: string) => {
    try {
      // Remover do localStorage
      const items = JSON.parse(localStorage.getItem(`db_${collection}`) || '[]');
      const updatedItems = items.filter((item: any) => item.id !== id);
      localStorage.setItem(`db_${collection}`, JSON.stringify(updatedItems));
      
      // Sincronizar com a nuvem
      const response = await fetch(SYNC_URL);
      const cloudData = await response.json() || {};
      
      const updatedCloudData = {
        ...cloudData,
        [collection]: updatedItems,
        updatedAt: Date.now()
      };
      
      await fetch(SYNC_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCloudData)
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao remover dados:", error);
      return false;
    }
  }
};
