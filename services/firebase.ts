
// Configurações fornecidas pelo utilizador
export const firebaseConfig = {
  apiKey: "AIzaSyDqN7J0A7ebBpUhSo5EyVwb5ZmZ2HaTezU",
  authDomain: "diasexpress-4073f.firebaseapp.com",
  projectId: "diasexpress-4073f",
  storageBucket: "diasexpress-4073f.firebasestorage.app",
  messagingSenderId: "174659717968",
  appId: "1:174659717968:web:8a682df7fa62f109d6fa55"
};

const SYNC_URL = `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com/agua_mali_sync.json`;

export const db = {
  get: async (collection: string) => {
    const data = localStorage.getItem(`db_${collection}`);
    // Se existir a chave, mesmo que seja um array vazio [], retornamos o que está lá.
    // Isso impede que os Mocks voltem depois de um Delete.
    return data ? JSON.parse(data) : null;
  },

  save: async (collection: string, data: any) => {
    try {
      let updatedItems = Array.isArray(data) ? data : [];
      
      if (!Array.isArray(data)) {
        const items = JSON.parse(localStorage.getItem(`db_${collection}`) || '[]');
        const existingIndex = items.findIndex((item: any) => item.id === data.id);
        if (existingIndex >= 0) {
          items[existingIndex] = { ...items[existingIndex], ...data, updatedAt: Date.now() };
          updatedItems = items;
        } else {
          updatedItems = [...items, { ...data, updatedAt: Date.now() }];
        }
      }
      
      localStorage.setItem(`db_${collection}`, JSON.stringify(updatedItems));

      // Sincronização Cloud
      const response = await fetch(SYNC_URL);
      const cloudData = await response.json() || {};
      
      const updatedCloudData = {
        ...cloudData,
        [collection]: updatedItems,
        updatedAt: Date.now() // Timestamp para o App.tsx verificar mudanças
      };
      
      await fetch(SYNC_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCloudData)
      });
      
      return updatedItems;
    } catch (error) {
      console.error("Erro ao salvar:", error);
      return null;
    }
  },

  sync: async () => {
    try {
      const response = await fetch(SYNC_URL);
      const cloudData = await response.json();
      
      if (cloudData) {
        const lastLocalSync = localStorage.getItem('last_cloud_sync') || '0';
        
        // Só atualiza o localStorage e dispara evento se a nuvem for mais recente
        // Isso remove o "piscar" constante da aplicação
        if (cloudData.updatedAt && cloudData.updatedAt.toString() !== lastLocalSync) {
          if (cloudData.houses) localStorage.setItem('db_houses', JSON.stringify(cloudData.houses));
          if (cloudData.users) localStorage.setItem('db_users', JSON.stringify(cloudData.users));
          if (cloudData.readings) localStorage.setItem('db_readings', JSON.stringify(cloudData.readings));
          
          localStorage.setItem('last_cloud_sync', cloudData.updatedAt.toString());
          window.dispatchEvent(new Event('sync-complete'));
          return true; 
        }
      }
    } catch (error) {
      console.error("Erro na sync:", error);
    }
    return false;
  }
};
