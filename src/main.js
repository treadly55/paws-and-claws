/* /src/main.js */
/* Friday, 11 April 2025 2:24 AM AEST - Complete current state */

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
// Ensure the array is not empty before accessing index 0
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
    innerButton.classList.add('button-depressed');

    // Background Change Logic
    // Increment index and wrap around using modulo
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
    // Get the new image path
    const newImageUrl = backgroundImages[currentBackgroundIndex];
    // Apply the new background image to the body
    document.body.style.backgroundImage = `url(${newImageUrl})`;
    console.log(`Background changed to: ${newImageUrl}`); // For debugging

    // Log press event (optional)
    // console.log('Event: Press', event.type);
  };

  const handleRelease = (event) => {
    innerButton.classList.remove('button-depressed');
    // Log release event (optional)
    // console.log('Event: Release', event.type);
  };

  // Attach Event Listeners for inner button
  innerButton.addEventListener('mousedown', handlePress);
  innerButton.addEventListener('touchstart', handlePress, { passive: true });

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
    // If not fullscreen, request fullscreen on the whole page
    document.documentElement.requestFullscreen()
      .then(() => { document.body.classList.add('is-fullscreen'); }) // Add class on success
      .catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
  } else {
    // If already fullscreen, exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => { document.body.classList.remove('is-fullscreen'); }) // Remove class on success
        .catch((err) => {
          console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
        });
    }
  }
}

// Optional: Listen for fullscreen change events (e.g., user pressing Esc)
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        // Exited fullscreen (e.g., by pressing Esc)
        document.body.classList.remove('is-fullscreen');
    } else {
        // Entered fullscreen
         document.body.classList.add('is-fullscreen');
    }
});
// --- End Fullscreen Logic ---


// --- Enable transitions after initial render fix ---
// Add a class to the body shortly after the page loads.
// CSS rules dependent on '.transitions-ready' will now apply.
// setTimeout with 0ms delay executes after the current code and browser paint.
setTimeout(() => {
  document.body.classList.add('transitions-ready');
  // console.log('Transitions Ready.');
}, 0);
// --- End Enable transitions ---
