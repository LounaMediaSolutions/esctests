
var VERSION = 'v1';

var cacheFirstFiles = [
  // ADDME: Add paths and URLs to pull from cache first if it has been loaded before. Else fetch from network.
  // If loading from cache, fetch from network in the background to update the resource. Examples:
  // 'assets/img/logo.png',
  // 'assets/models/controller.gltf',
  'https://cdn.aframe.io/360-image-gallery-boilerplate/audio/click.ogg',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fbackground2.jpg?1520975609228',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2FEscapar%20logo%20animation.mp4?1516746131534',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fonboarding%201.png?1521502779573',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fonboarding%202.png?1521502779573',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fonboarding%203.png?1521502779573',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fonboarding%204.png?1521502779573',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fonboarding1.mp3?1521504180752',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fonboarding2.mp3?1521504180752',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fonboarding3.mp3?1521504180752',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fonboarding4.mp3?1521504180752',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fhome.mp3?1521504180752',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fbutton%20next.png?1521502831034',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fbutton%20begin.png?1521502831034',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fdown-arrow.png?1520283878348',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fhome%20icon.png?1521502612810',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fback%20icon.png?1521502612810',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fassistant%20icon.png?1521502612810',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fwishlist%20icon.png?1521502612810',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fassistant-icon.png?1520647301430',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fuser-icon.png?1520647301336',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fassistant-what-is-in-wishlist.mp3?1521504181086',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fassistant-wishlist-empty.mp3?1521504181086',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fassistant-popular-destination.mp3?1521504181086',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fassistant-where-should-i-stay.mp3?1521504181086',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fassistant-where-else.mp3?1521504181086',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fhome%20card%201%20(cliff).png?1521503000884',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fhome%20card%202%20(ski).png?1521503000884',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fhome%20card%203%20(forest).png?1521503000884',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fhome%20card%204%20(water).png?1521503000884',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2FPreview%201%20(10%22).mp4?1520901669886',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2FPreview%202%20(11%22).mp4?1520901577991',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2FPreview%203%20(11%22).mp4?1520901625370',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2FPreview%204%20(11%22).mp4?1520901648245',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2FDestination%20Video%20(27%22).mp4?1521504116154',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fpoi%20icon.png?1521503154558',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fpoi%20card.png?1521503159741',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fbutton%20dismiss.png?1521503157644',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Finfocard.mp3?1521504176749',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fpayment%201.png?1521503662778',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fpayment%202.mp4?1521503739776',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fbutton%20confirm.png?1521503662454',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fpayment1.mp3?1521504178241',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fwishlist%201.png?1521503559458',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fwishlist%202.png?1521503559458',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fwishlist%203.png?1521503559458',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fbutton%20purchase%20wishlist.png?1521503550815',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fpackage%201.png?1521503321073',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fpackage%202.png?1521503321073',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fadded%20overlay.png?1521503321073',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fbutton%20purchase.png?1521503608018',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fbutton%20add.png?1521503321073',
  'https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Fbutton%20remove.png?1521503321073',
];

var networkFirstFiles = [
  // ADDME: Add paths and URLs to pull from network first. Else fall back to cache if offline. Examples:
  'index.html',
  'components/assistant.js',
  'components/deep-visible.js',
  'components/experience.js',
  'components/home.js',
  'components/nav-bar.js',
  'components/on-controller.js',
  'components/onboarding.js',
  'components/packages.js',
  'components/purchase.js',
  'components/splash.js',
  'components/wishlist.js',
  'systems/app-state.js',
  'systems/assistant.js',
  'systems/wishlist.js',
  'utils.js'
];

// Below is the service worker code.

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || event.request.method !== 'OPTIONS') { return; }
  if (networkFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(networkElseCache(event));
  } else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(cacheElseNetwork(event));
  } else {
    event.respondWith(fetch(event.request));
  }
});

// If cache else network.
// For images and assets that are not critical to be fully up-to-date.
// developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
// #cache-falling-back-to-network
function cacheElseNetwork (event) {
  return caches.match(event.request).then(response => {
    function fetchAndCache () {
       return fetch(event.request).then(response => {
        // Update cache.
        caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
        return response;
      });
    }

    // If not exist in cache, fetch.
    if (!response) { return fetchAndCache(); }

    // If exists in cache, return from cache while updating cache in background.
    fetchAndCache();
    return response;
  });
}

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache (event) {
  return caches.match(event.request).then(match => {
    if (!match) { return fetch(event.request); }
    return fetch(event.request).then(response => {
      // Update cache.
      caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
      return response;
    }) || response;
  });
}
