const DB_NAME = 'vibegram-share';
const DB_VERSION = 1;
const STORE_NAME = 'shared_files';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME, { autoIncrement: true });
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (event.request.method === 'POST' && url.pathname === '/share') {
    event.respondWith((async () => {
      try {
        const formData = await event.request.formData();
        const files = formData.getAll('files');
        const title = formData.get('title');
        const text = formData.get('text');
        
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        
        await new Promise((resolve, reject) => {
          const clearReq = store.clear();
          clearReq.onsuccess = () => {
             const addReq = store.add({ files, title, text, timestamp: Date.now() });
             addReq.onsuccess = resolve;
             addReq.onerror = () => reject(addReq.error);
          };
          clearReq.onerror = () => reject(clearReq.error);
        });
        
        return Response.redirect('/?shared=1', 303);
      } catch (e) {
        console.error('SW Share Error:', e);
        return Response.redirect('/', 303);
      }
    })());
  }
});
