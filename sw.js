const CACHE_NAME = 'ev-charger-v1';
const OFFLINE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
]:

// Service Worker - always fetch fresh version from server

self.addEventListener("install", (event) => {
  // Skip waiting so the new SW activates immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of clients right after activation
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Always fetch from network, don't use old cache
  event.respondWith(fetch(event.request));
});

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("fetch", () => {});
