/* /src/main.js */
/* Friday, 11 April 2025 - Load Initial BG + Cycle 4 Images */

// Import the CSS file
import './style.css';

// --- Background Image Setup ---
const backgroundImages = [
  '/images/bg1.jpg', // Image 1 (Make sure this file exists!)
  '/images/bg2.jpg', // Image 2 (Make sure this file exists!)
  '/images/bg3.jpg', // Image 3 (Make sure this file exists!)
  '/images/bg4.jpg', // Image 4 (Make sure this file exists!)
];
// --- NEW: Initialize index to 0 as we load the first image ---
let currentBackgroundIndex = 0; 

// --- NEW: Set the initial background image on page load ---
// Ensure the array is not empty before accessing index 0
if (backgroundImages.length > 0) {
  document.body.style.backgroundImage = `url(${backgroundImages[currentBackgroundIndex]})`;
  console.log(`Initial background set to: ${backgroundImages[currentBackgroundIndex]}`); // For debugging
}
// --- End Background Image Setup / Initial Load ---


// Get a reference to the button element
const innerButton = document.querySelector('#inner-button');

// Ensure the button element was found
if (innerButton) {

  // --- Define handler functions ---
  const handlePress = (event) => {
    innerButton.classList.add('button-depressed');

    // --- Background Change Logic (Index starts at 0 now) ---
    // Increment index and wrap around using modulo
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;

    // Get the new image path
    const newImageUrl = backgroundImages[currentBackgroundIndex];

    // Apply the new background image to the body
    document.body.style.backgroundImage = `url(${newImageUrl})`;

    console.log(`Background changed to: ${newImageUrl}`); // For debugging
    // --- End Background Change Logic ---

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
  innerButton.addEventListener('touchstart', handlePress, { passive: true });

  innerButton.addEventListener('mouseup', handleRelease);
  innerButton.addEventListener('touchend', handleRelease);
  innerButton.addEventListener('mouseleave', handleRelease);
  innerButton.addEventListener('touchcancel', handleRelease);

} else {
  console.error('Error: Element with ID #inner-button not found.');
}

// Enable transitions after initial render fix
setTimeout(() => {
  document.body.classList.add('transitions-ready');
  // console.log('Transitions Ready.');
}, 0);