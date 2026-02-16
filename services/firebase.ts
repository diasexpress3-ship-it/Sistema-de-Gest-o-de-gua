
// This would be the actual Firebase initialization
// Using placeholders for mock implementation as requested
export const firebaseConfig = {
  apiKey: "AIzaSyDqN7J0A7ebBpUhSo5EyVwb5ZmZ2HaTezU",
  authDomain: "diasexpress-4073f.firebaseapp.com",
  projectId: "diasexpress-4073f",
  storageBucket: "diasexpress-4073f.firebasestorage.app",
  messagingSenderId: "174659717968",
  appId: "1:174659717968:web:8a682df7fa62f109d6fa55"
};

// Mock service layer for demonstration
export const db = {
  get: async (collection: string) => JSON.parse(localStorage.getItem(`db_${collection}`) || '[]'),
  save: async (collection: string, data: any) => {
    const items = JSON.parse(localStorage.getItem(`db_${collection}`) || '[]');
    items.push(data);
    localStorage.setItem(`db_${collection}`, JSON.stringify(items));
  }
};
