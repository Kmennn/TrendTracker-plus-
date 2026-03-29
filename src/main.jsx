import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

async function clearStaleServiceWorkers() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (!registrations.length) {
      return false;
    }

    await Promise.all(registrations.map((registration) => registration.unregister()));

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }

    return true;
  } catch (error) {
    console.warn('Failed to clear service workers', error);
    return false;
  }
}

clearStaleServiceWorkers().then((didClear) => {
  const reloadMarker = 'trendtracker-sw-reset';

  if (didClear && !window.sessionStorage.getItem(reloadMarker)) {
    window.sessionStorage.setItem(reloadMarker, '1');
    window.location.reload();
    return;
  }

  window.sessionStorage.removeItem(reloadMarker);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
