/* /src/main.js */
/* Friday, 11 April 2025 2:37 AM AEST - Fix double press on touch */
/* Updated: Apply background to #app, not body */

// Import the CSS file
import './style.css';

// --- NEW: Select the #app element ---
const appElement = document.querySelector('#app');
if (!appElement) {
  console.error('CRITICAL ERROR: #app element not found!');
  // Maybe throw an error or stop execution if #app is essential
}
// --- End NEW ---

// --- Background Image Setup ---
const backgroundImages = [
  '/images/bg1.jpg', // Image 1 (Make sure this file exists!)
  '/images/bg2.jpg', // Image 2 (Make sure this file exists!)
  '/images/bg3.jpg', // Image 3 (Make sure this file exists!)
  '/images/bg4.jpg', // Image 4 (Make sure this file exists!)
];
let currentBackgroundIndex = 0;

// Set the initial background image on page load - TARGET #app
// Check if appElement exists before using it
if (appElement && backgroundImages.length > 0) {
  appElement.style.backgroundImage = `url(${backgroundImages[currentBackgroundIndex]})`; // <-- CHANGE HERE
  console.log(`Initial background set on #app to: ${backgroundImages[currentBackgroundIndex]}`);
}
// --- End Background Image Setup / Initial Load ---


// --- Inner Button Interaction ---
const innerButton = document.querySelector('#inner-button');

if (innerButton && appElement) { // Also check for appElement here

  const handlePress = (event) => {
    if (event.type === 'touchstart') {
      event.preventDefault();
    }

    innerButton.classList.add('button-depressed');

    // Background Change Logic - TARGET #app
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
    const newImageUrl = backgroundImages[currentBackgroundIndex];
    appElement.style.backgroundImage = `url(${newImageUrl})`; // <-- CHANGE HERE
    console.log(`Background on #app changed to: ${newImageUrl}`);

    // console.log('Event: Press', event.type);
  };

  const handleRelease = (event) => {
    innerButton.classList.remove('button-depressed');
    // console.log('Event: Release', event.type);
  };

  innerButton.addEventListener('mousedown', handlePress);
  innerButton.addEventListener('touchstart', handlePress);
  innerButton.addEventListener('mouseup', handleRelease);
  innerButton.addEventListener('touchend', handleRelease);
  innerButton.addEventListener('mouseleave', handleRelease);
  innerButton.addEventListener('touchcancel', handleRelease);

} else {
  if (!innerButton) console.error('Error: Element with ID #inner-button not found.');
  // Error for missing #app already handled above
}
// --- End Inner Button Interaction ---


// --- Fullscreen Logic ---
// This logic often targets document.documentElement for entering fullscreen,
// which is usually fine. The visual styling changes (is-fullscreen class)
// are on the body, which still works for hiding/showing the button icon.
// If you wanted ONLY the #app element to go fullscreen, you'd request it on appElement,
// but that's less common for a full-page feel. Current logic is likely OK.

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
    // Request fullscreen on the whole page (documentElement)
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

// This listener remains on the document and toggles class on body, which is fine
// as it controls the fullscreen icon visibility which is outside #app.
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove('is-fullscreen');
    } else {
        document.body.classList.add('is-fullscreen');
    }
});
// --- End Fullscreen Logic ---


// --- Enable transitions after initial render fix ---
// This remains the same, adding the class to the body.
// CSS rules target #app or #inner-button based on this body class.
setTimeout(() => {
  document.body.classList.add('transitions-ready');
  // console.log('Transitions Ready.');
}, 0);
// --- End Enable transitions ---