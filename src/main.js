/* /src/main.js */
/* Friday, 11 April 2025 2:37 AM AEST - Fix double press on touch */

// Import the CSS file
import './style.css';

// --- Background Image Setup ---
const backgroundImages = [
  '/images/bg1.jpg', // Image 1 (Make sure this file exists!)
  '/images/bg2.jpg', // Image 2 (Make sure this file exists!)
  '/images/bg3.jpg', // Image 3 (Make sure this file exists!)
  '/images/bg4.jpg', // Image 4 (Make sure this file exists!)
];
// Initialize index to 0 as we load the first image
let currentBackgroundIndex = 0;

// Set the initial background image on page load
if (backgroundImages.length > 0) {
  document.body.style.backgroundImage = `url(${backgroundImages[currentBackgroundIndex]})`;
  console.log(`Initial background set to: ${backgroundImages[currentBackgroundIndex]}`); // For debugging
}
// --- End Background Image Setup / Initial Load ---


// --- Inner Button Interaction ---
const innerButton = document.querySelector('#inner-button');

// Ensure the inner button element was found
if (innerButton) {

  // Define handler functions for inner button
  const handlePress = (event) => {
    // --- NEW: Prevent default action for touchstart to potentially stop ghost clicks ---
    if (event.type === 'touchstart') {
      event.preventDefault(); // Prevent browser default actions like firing mouse events
    }
    // --- End NEW ---

    innerButton.classList.add('button-depressed');

    // Background Change Logic
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
    const newImageUrl = backgroundImages[currentBackgroundIndex];
    document.body.style.backgroundImage = `url(${newImageUrl})`;
    console.log(`Background changed to: ${newImageUrl}`);

    // Log press event (optional)
    // console.log('Event: Press', event.type);
  };

  const handleRelease = (event) => {
    innerButton.classList.remove('button-depressed');
    // Log release event (optional)
    // console.log('Event: Release', event.type);
  };

  // --- Attach Event Listeners ---
  innerButton.addEventListener('mousedown', handlePress);
  // --- CHANGED: Removed { passive: true } because we now call preventDefault() ---
  innerButton.addEventListener('touchstart', handlePress);
  // --- End CHANGED ---

  innerButton.addEventListener('mouseup', handleRelease);
  innerButton.addEventListener('touchend', handleRelease);
  innerButton.addEventListener('mouseleave', handleRelease);
  innerButton.addEventListener('touchcancel', handleRelease);

} else {
  console.error('Error: Element with ID #inner-button not found.');
}
// --- End Inner Button Interaction ---


// --- Fullscreen Logic ---
const fullscreenButton = document.querySelector('#fullscreen-btn');

if (fullscreenButton) {
  fullscreenButton.addEventListener('click', () => {
    toggleFullscreen();
  });
} else {
  console.error('Fullscreen button #fullscreen-btn not found.');
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
      .then(() => { document.body.classList.add('is-fullscreen'); })
      .catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => { document.body.classList.remove('is-fullscreen'); })
        .catch((err) => {
          console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
        });
    }
  }
}

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove('is-fullscreen');
    } else {
         document.body.classList.add('is-fullscreen');
    }
});
// --- End Fullscreen Logic ---


// --- Enable transitions after initial render fix ---
setTimeout(() => {
  document.body.classList.add('transitions-ready');
  // console.log('Transitions Ready.');
}, 0);
// --- End Enable transitions ---